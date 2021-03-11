import { Injectable } from '@nestjs/common';
import { IServiceEndpoint } from '@ew-did-registry/did-resolver-interface';
import { RoleDefinitionDTO, RoleDTO } from './role.dto';
import { DIDService } from '../did/did.service';
import { DID } from '../did/did.types';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { Repository } from 'typeorm';
import { emptyAddress } from '../shared/constants';
import { ApplicationService } from '../application/application.service';
import { OrganizationService } from '../organization/organization.service';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    private readonly didService: DIDService,
    private readonly appService: ApplicationService,
    private readonly orgService: OrganizationService,
  ) {}

  /**
   * returns single Role with matching namespace
   * @param {String} namespace
   */
  public async getByNamespace(namespace: string) {
    return this.roleRepository.findOne({ where: { namespace } });
  }

  /**
   * returns single Role with matching namespace
   * @param {String} namespace
   */
  public async getByOwner(namespace: string) {
    return this.roleRepository.find({ where: { namespace } });
  }

  /**
   * return true if role with given namespace exists
   * @param namespace
   */
  public async exists(namespace: string) {
    return Boolean(await this.getByNamespace(namespace));
  }

  /**
   * Method for adding new Role to database
   * @param data object containing all needed role properties
   * @return id of newly added Role
   */
  public async create({ appNamespace, orgNamespace, ...data }: RoleDTO) {
    if (appNamespace) {
      const app = await this.appService.getByNamespace(appNamespace);
      if (!app) {
        return;
      }
      const role = Role.create({ ...data, parentApp: app });
      return this.roleRepository.save(role);
    }
    if (orgNamespace) {
      const org = await this.orgService.getByNamespace(orgNamespace);
      if (!org) {
        return;
      }
      const role = Role.create({ ...data, parentOrg: org });
      return this.roleRepository.save(role);
    }
  }

  /**
   * Update existing role with given namespace
   * @param namespace target role's namespace
   * @param patch
   */
  public async update(data: RoleDTO) {
    const role = await this.roleRepository.findOne({
      where: {
        namespace: data.namespace,
      },
    });
    if (!role) return this.create(data);

    if (data.appNamespace) {
      const app = await this.appService.getByNamespace(data.appNamespace);
      if (!app) {
        return;
      }
      const updatedRole = Role.create({ ...role, ...data, parentApp: app });
      return this.roleRepository.save(updatedRole);
    }
    if (data.orgNamespace) {
      const org = await this.orgService.getByNamespace(data.orgNamespace);
      if (!org) {
        return;
      }
      const updatedRole = Role.create({ ...role, ...data, parentOrg: org });
      return this.roleRepository.save(updatedRole);
    }
  }

  /**
   * removes Role with matching namespace
   * @param namespace
   */
  public async remove(namespace: string) {
    const role = await this.getByNamespace(namespace);
    if (!role) {
      return;
    }

    return this.roleRepository.delete(role.id);
  }

  public async verifyUserRoles(did: string) {
    const user = new DID(did);
    const { service } = await this.didService.getById(user, true);
    const verifiedRoles = await Promise.all(
      ((service as unknown) as (IServiceEndpoint & {
        claimType?: string;
        claimTypeVersion?: string;
        iss: string;
      })[]).map(({ iss, claimTypeVersion, claimType }) =>
        this.verifyRole({
          issuer: iss,
          namespace: claimType,
          version: claimTypeVersion,
        }),
      ),
    );
    return verifiedRoles.filter(Boolean);
  }

  public async verifyEnrolmentPrecondition({
    userDID,
    claimType,
  }: {
    userDID: string;
    claimType: string;
  }) {
    const [didDocument, role] = await Promise.all([
      this.didService.getById(new DID(userDID), true),
      this.getByNamespace(claimType),
    ]);

    if (!role) {
      throw new Error(`There is no created role for ${claimType} namespace`);
    }

    const {
      definition: { enrolmentPreconditions },
    } = role;

    if (!enrolmentPreconditions || enrolmentPreconditions.length < 1) return;
    for (const { type, conditions } of enrolmentPreconditions) {
      if (type === 'role' && conditions) {
        const conditionMet = didDocument.service.some(
          ({ claimType }) =>
            claimType && conditions.includes(claimType as string),
        );
        if (!conditionMet) {
          throw new Error(
            `Role enrolment precondition not met for user: ${userDID} and role: ${claimType}`,
          );
        }
      }
    }
  }

  private async verifyRole({
    namespace,
    issuer,
    version,
  }: {
    namespace?: string;
    issuer: string;
    version?: string;
  }) {
    if (!namespace) return null;

    const { definition: role } = (await this.getByNamespace(namespace)) || {};
    if (!role) {
      return null;
    }

    if (version && role.version !== version) {
      return null;
    }

    if (role.issuer?.issuerType === 'DID') {
      if (
        Array.isArray(role.issuer?.did) &&
        role.issuer?.did.includes(issuer)
      ) {
        return {
          name: role.roleName,
          namespace,
        };
      }
      return null;
    }

    if (role.issuer?.issuerType === 'Role') {
      const issuerDID = new DID(issuer);
      const { service: issuerClaims } = await this.didService.getById(
        issuerDID,
        true,
      );
      const issuerRoles = issuerClaims.map(c => c.claimType);
      if (issuerRoles.includes(role.issuer.roleName)) {
        return {
          name: role.roleName,
          namespace,
        };
      }
    }
    return null;
  }

  public async handleRoleSyncWithEns({
    owner,
    namespace,
    orgNamespace,
    appNamespace,
    metadata,
    name,
  }: {
    owner: string;
    namespace: string;
    orgNamespace?: string;
    appNamespace?: string;
    metadata: Record<string, unknown>;
    name: string;
  }) {
    if (owner === emptyAddress) {
      this.remove(namespace);
      return;
    }

    const dto = await RoleDTO.create({
      definition: await RoleDefinitionDTO.create(metadata),
      orgNamespace,
      appNamespace,
      owner,
      name,
      namespace,
    });

    console.log(dto);

    this.update(dto);
  }
}
