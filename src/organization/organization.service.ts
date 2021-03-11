import { Injectable } from '@nestjs/common';
import { OrganizationDefinitionDTO, OrganizationDTO } from './organization.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './organization.entity';
import { emptyAddress } from '../shared/constants';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly orgRepository: Repository<Organization>,
  ) {}

  /**
   * Returns all Apps belonging to Organization with matching namespace
   * @param namespace
   */
  public async getApps(namespace: string) {
    const { apps } = await this.orgRepository.findOne({
      where: { namespace },
      relations: ['apps'],
    });
    return apps;
  }

  /**
   * Returns all Role belonging to Organization with matching namespace
   * @param namespace
   */
  public async getRoles(namespace: string) {
    const { roles } = await this.orgRepository.findOne({
      where: { namespace },
      relations: ['roles'],
    });
    return roles;
  }

  /**
   * Returns all SubOrgs belonging to Organization with matching namespace
   * @param namespace
   */
  public async getSubOrgs(namespace: string) {
    const { subOrgs } = await this.orgRepository.findOne({
      where: {
        namespace,
      },
    });
    return subOrgs;
  }

  /**
   * returns single Org with matching namespace
   * @param {String} namespace
   */
  public async getByNamespace(namespace: string) {
    return this.orgRepository.findOne({
      where: { namespace },
      relations: ['subOrgs'],
    });
  }

  /**
   * returns single Org with matching namespace
   * @param {String} owner
   */
  public async getByOwner(owner: string) {
    return this.orgRepository.findOne({
      where: { owner },
      relations: ['subOrgs'],
    });
  }

  /**
   * return true if Org with given namespace exists
   * @param namespace
   */
  public async exists(namespace: string): Promise<boolean> {
    return Boolean(await this.getByNamespace(namespace));
  }

  /**
   * Method for adding new Org to database
   * @param data object containing all needed Org properties
   * @return id of newly added Org
   */
  public async create({ parentOrg, ...data }: OrganizationDTO) {
    const parentOrganization = await this.getByNamespace(parentOrg);
    const org = Organization.create({ ...data, parentOrg: parentOrganization });
    return this.orgRepository.save(org);
  }

  /**
   * Update existing Org with given namespace
   * @param namespace target Org's namespace
   * @param patch
   */
  public async update({ parentOrg, ...data }: OrganizationDTO) {
    const org = await this.orgRepository.findOne({
      where: {
        namespace: data.namespace,
      },
    });
    if (!org) return this.create({ ...data, parentOrg });
    const parentOrganization = await this.getByNamespace(parentOrg);
    const updatedOrg = Organization.create({
      ...org,
      ...data,
      parentOrg: parentOrganization,
    });
    return this.orgRepository.save(updatedOrg);
  }

  /**
   * removes Organization with matching namespace
   * @param namespace
   */
  public async remove(namespace: string) {
    const org = await this.getByNamespace(namespace);
    if (!org) {
      return;
    }

    return this.orgRepository.delete(org.id);
  }

  public async handleOrgSyncWithEns({
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
      this.remove(namespace);
      return;
    }

    const definitionDTO = await OrganizationDefinitionDTO.create(metadata);

    const dto = await OrganizationDTO.create({
      definition: definitionDTO,
      parentOrg: parentOrgNamespace,
      owner,
      namespace,
      name,
    });

    this.update(dto);
  }
}
