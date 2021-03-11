import { Injectable } from '@nestjs/common';
import { ApplicationDefinitionDTO, ApplicationDTO } from './application.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from './application.entity';
import { Repository } from 'typeorm';
import { Logger } from '../logger/logger.service';
import { emptyAddress } from '../shared/constants';
import { OrganizationService } from '../organization/organization.service';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    private readonly organizationService: OrganizationService,
    private readonly logger: Logger,
  ) {
    this.logger.setContext(ApplicationService.name);
  }

  /**
   * returns single App with matching namespace
   * @param {String} namespace
   */
  public async getByNamespace(namespace: string): Promise<Application> {
    return this.applicationRepository.findOne({ where: { namespace } });
  }

  /**
   * returns single App with matching namespace
   * @param {String} owner
   */
  public async getByOwner(owner: string) {
    return this.applicationRepository.find({
      where: {
        owner,
      },
    });
  }

  /**
   * Returns all Roles belonging to Application with matching namespace
   * @param namespace
   */
  public async getRoles(namespace: string) {
    const { roles } = await this.applicationRepository.findOne({
      where: { namespace },
      relations: ['roles'],
    });
    return roles || [];
  }

  /**
   * return true if App with given namespace exists
   * @param namespace
   */
  public async exists(namespace: string) {
    return Boolean(await this.getByNamespace(namespace));
  }

  /**
   * Method for adding new App to database
   * @param data object containing all needed App properties
   * @return id of newly added App
   */
  public async create({ parentOrg, ...data }: ApplicationDTO) {
    const org = await this.organizationService.getByNamespace(parentOrg);
    if (!org) {
      this.logger.debug(
        `Not able to create application: ${data.namespace}, parent organization ${parentOrg} does not exists`,
      );
    }
    const app = Application.create({ ...data, parentOrg: org });
    return this.applicationRepository.save(app);
  }

  /**
   * Update existing App with given namespace
   * @param namespace target App's namespace
   * @param patch
   */
  public async update({ parentOrg, ...data }: ApplicationDTO) {
    const app = await this.applicationRepository.findOne({
      where: {
        namespace: data.namespace,
      },
    });
    if (!app) {
      return this.create({ ...data, parentOrg });
    }
    const org = await this.organizationService.getByNamespace(parentOrg);
    const updatedApp = Application.create({ ...app, ...data, parentOrg: org });
    return this.applicationRepository.save(updatedApp);
  }

  /**
   * removes App with matching namespace
   * @param namespace
   */
  public async remove(namespace: string) {
    const app = await this.getByNamespace(namespace);
    if (!app) return;
    return this.applicationRepository.delete(app.id);
  }

  public async handleAppSyncWithEns({
    owner,
    namespace,
    parentOrgNamespace,
    metadata,
    name,
  }: {
    owner: string;
    namespace: string;
    parentOrgNamespace: string;
    metadata: Record<string, unknown>;
    name: string;
  }) {
    if (owner === emptyAddress) {
      await this.remove(namespace);
      return;
    }
    const definitionDTO = await ApplicationDefinitionDTO.create(metadata);

    const dto = await ApplicationDTO.create({
      definition: definitionDTO,
      owner,
      name,
      namespace,
      parentOrg: parentOrgNamespace,
    });

    await this.update(dto);
  }
}
