import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { providers, utils, errors } from 'ethers';
import { abi as ensResolverContract } from '@ensdomains/resolver/build/contracts/PublicResolver.json';
import { PublicResolverFactory } from '../ethers/PublicResolverFactory';
import { RoleService } from '../role/role.service';
import { ApplicationService } from '../application/application.service';
import { OrganizationService } from '../organization/organization.service';
import { EnsRegistryFactory } from '../ethers/EnsRegistryFactory';
import { ConfigService } from '@nestjs/config';
import { PublicResolver } from '../ethers/PublicResolver';
import { EnsRegistry } from '../ethers/EnsRegistry';
import { namehash } from '../ethers/utils';
import chunk from 'lodash.chunk';
import { Logger } from '../logger/logger.service';

export const emptyAddress = '0x'.padEnd(42, '0');

@Injectable()
export class EnsService {
  private publicResolver: PublicResolver;
  private ensRegistry: EnsRegistry;
  private provider: providers.JsonRpcProvider;
  constructor(
    private readonly roleService: RoleService,
    private readonly applicationService: ApplicationService,
    private readonly organizationService: OrganizationService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly config: ConfigService,
    private readonly logger: Logger,
  ) {
    this.logger.setContext(EnsService.name);
    errors.setLogLevel('error');

    // Get config values from .env file
    const ENS_URL = this.config.get<string>('ENS_URL');
    const PUBLIC_RESOLVER_ADDRESS = this.config.get<string>(
      'PUBLIC_RESOLVER_ADDRESS',
    );
    const ENS_REGISTRY_ADDRESS = this.config.get<string>(
      'ENS_REGISTRY_ADDRESS',
    );

    // Connect to smart contracts
    this.provider = new providers.JsonRpcProvider(ENS_URL);
    this.publicResolver = PublicResolverFactory.connect(
      PUBLIC_RESOLVER_ADDRESS,
      this.provider,
    );
    this.ensRegistry = EnsRegistryFactory.connect(
      ENS_REGISTRY_ADDRESS,
      this.provider,
    );

    // Using setInterval so that interval can be set dynamically from config
    const ensSyncInterval = this.config.get<string>('ENS_SYNC_INTERVAL_IN_MS');
    const ENS_SYNC_ENABLED =
      this.config.get<string>('ENS_SYNC_ENABLED') !== 'false';
    if (ensSyncInterval && ENS_SYNC_ENABLED) {
      const interval = setInterval(
        () => this.syncENS(),
        parseInt(ensSyncInterval),
      );
      this.schedulerRegistry.addInterval('ENS Sync', interval);
    }

    this.InitEventListeners();
    this.syncENS();
  }

  private InitEventListeners(): void {
    try {
      this.publicResolver.addListener('TextChanged', async hash => {
        const namespace = await this.publicResolver.name(hash.toString());
        if (!namespace) return;
        await this.eventHandler({ hash, name: namespace });
      });

      // Register event handler for owner change or namespace deletion
      this.ensRegistry.addListener('NewOwner', async (node, label, owner) => {
        const hash = utils.keccak256(node + label.slice(2));
        const namespace = await this.publicResolver.name(hash.toString());
        if (!namespace) return;

        await this.eventHandler({ hash, name: namespace, owner });
      });

      this.ensRegistry.addListener('Transfer', async (node, owner) => {
        const namespace = await this.publicResolver.name(node.toString());
        if (namespace === '') {
          return;
        }

        this.eventHandler({ hash: node, name: namespace, owner });
      });
    } catch (err) {
      this.logger.error(err);
    }
    // Register event handler for new Role/App/Org
  }

  private async getAllNamespaces() {
    const ensInterface = new utils.Interface(ensResolverContract);
    const Event = this.publicResolver.filters.TextChanged(
      null,
      'metadata',
      null,
    );
    const filter = {
      fromBlock: 0,
      toBlock: 'latest',
      address: Event.address,
      topics: [...(Event.topics as string[])],
    };
    const logs = await this.provider.getLogs(filter);
    const domains = await Promise.all(
      logs.map(log => {
        const parsedLog = ensInterface.parseLog(log);
        const { node } = parsedLog.values;
        return this.publicResolver.name(node);
      }),
    );

    const uniqDomains = [...new Set(domains)];
    return uniqDomains;
  }

  public async eventHandler({
    hash,
    name,
    owner,
  }: {
    hash: string;
    name: string;
    owner?: string;
  }) {
    try {
      const promises = [
        // get role data
        this.publicResolver.text(hash, 'metadata'),
      ];
      if (!owner) {
        promises.push(this.ensRegistry.owner(hash));
      }

      const [data, namespaceOwner = owner] = await Promise.all(promises);

      if (!namespaceOwner || !data) {
        this.logger.debug(
          `Role: ${name} not supported lack of owner or metadata`,
        );
        return;
      }

      await this.syncNamespace({
        data,
        namespace: name,
        owner: namespaceOwner,
      });
    } catch (err) {
      this.logger.error(err);
      return;
    }
  }

  getNamespaceInfo({
    namespace,
    metadata,
  }: {
    namespace: string;
    metadata: {
      orgName?: string;
      appName?: string;
      roleName?: string;
      roleType?: string;
    };
  }): {
    type: 'Org' | 'App' | 'Role' | 'NotSupported';
    name?: string;
    orgNamespace?: string;
    appNamespace?: string;
  } {
    const [name, parent, ...rest] = namespace.split('.');
    if (metadata.orgName) {
      return {
        type: 'Org',
        name,
        orgNamespace:
          parent !== 'iam' ? [parent, ...rest].join('.') : undefined,
      };
    }
    if (metadata.appName) {
      if (parent === 'apps') {
        return {
          name,
          type: 'App',
          orgNamespace: rest.join('.'),
        };
      }
    }

    if (metadata.roleName) {
      if (metadata.roleType.toLowerCase() === 'app') {
        return {
          name,
          type: 'Role',
          appNamespace: rest.join('.'),
        };
      }
      if (metadata.roleType.toLowerCase() === 'org') {
        return {
          name,
          type: 'Role',
          orgNamespace: rest.join('.'),
        };
      }
    }
    return {
      type: 'NotSupported',
    };
  }

  public async syncNamespace({
    data,
    namespace,
    owner,
  }: {
    data: string;
    namespace: string;
    owner: string;
  }) {
    let metadata: Record<string, unknown>;
    try {
      metadata = JSON.parse(data);
    } catch (err) {
      this.logger.debug('Metadata not parsable: ' + data);
      return;
    }
    const { type, appNamespace, name, orgNamespace } = this.getNamespaceInfo({
      metadata,
      namespace,
    });
    if (type === 'NotSupported') {
      this.logger.debug(
        'Metadata or namespace not supported for ' + namespace + ': ' + data,
      );
      return;
    }

    if (type === 'Org') {
      return this.organizationService.handleOrgSyncWithEns({
        metadata,
        namespace,
        owner,
        name,
        parentOrgNamespace: orgNamespace,
      });
    }

    if (type === 'App') {
      return this.applicationService.handleAppSyncWithEns({
        metadata,
        namespace,
        owner,
        name,
        parentOrgNamespace: orgNamespace,
      });
    }

    if (type === 'Role') {
      return this.roleService.handleRoleSyncWithEns({
        metadata,
        namespace,
        owner,
        name,
        appNamespace,
        orgNamespace,
      });
    }
    this.logger.debug(
      `Bailed: Data not supported ${namespace}, ${JSON.stringify(metadata)}`,
    );
  }

  async syncENS() {
    this.logger.debug('started sync');
    try {
      const namespaces = await this.getAllNamespaces();
      const chunks = chunk(namespaces, 50);
      for (const part of chunks) {
        await Promise.allSettled(
          part.map(item => {
            const hash = namehash(item);
            return this.eventHandler({ hash, name: item });
          }),
        );
      }
    } catch (err) {
      this.logger.error(err);
    }
    this.logger.debug('finished sync');
  }
}
