import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  IClaimIssuance,
  IClaimRejection,
  IClaimRequest,
  DecodedClaimToken,
} from './claim.types';
import jwt_decode from 'jwt-decode';
import { RoleService } from '../role/role.service';
import { Logger } from '../logger/logger.service';
import { ClaimIssueDTO, ClaimRejectionDTO, ClaimRequestDTO } from './claim.dto';
import { Claim } from './claim.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

interface QueryFilters {
  accepted?: 'true' | string;
  parentNamespace?: string;
}

@Injectable()
export class ClaimService {
  constructor(
    private readonly roleService: RoleService,
    private readonly logger: Logger,
    @InjectRepository(Claim)
    private readonly claimRepository: Repository<Claim>,
  ) {
    this.logger.setContext(ClaimService.name);
  }

  /**
   * Returns dgraph filter string based on passed options object
   * @param options config object
   * @return string
   * @private
   */
  private parseFilters({
    accepted,
    parentNamespace,
  }: QueryFilters): (
    | { isAccepted: boolean }
    | { parentNamespace: string }
    | undefined
  )[] {
    const filters: (
      | { isAccepted: boolean }
      | { parentNamespace: string }
      | undefined
    )[] = [];
    if (accepted === 'true') {
      filters.push({ isAccepted: true });
    }
    if (parentNamespace) {
      filters.push({ parentNamespace });
    }
    return filters;
  }

  /**
   * Handles claims saving and updates
   * @param data Raw claim data
   */
  public async handleExchangeMessage(
    data: IClaimIssuance | IClaimRejection | IClaimRequest,
  ): Promise<string> {
    try {
      const claim: Claim = await this.getById(data.id);
      if (!claim && 'token' in data) {
        const {
          claimData: { claimType, claimTypeVersion },
        }: DecodedClaimToken = jwt_decode(data.token);

        const dto = await ClaimRequestDTO.create({
          ...data,
          claimType,
          claimTypeVersion,
        });

        await this.roleService.verifyEnrolmentPrecondition({
          claimType,
          userDID: dto.requester,
        });

        await this.create(dto);
        return;
      }
      if (claim && !claim.isAccepted && 'isRejected' in data) {
        const dto = await ClaimRejectionDTO.create(data);

        await this.reject(dto.id);
        return;
      }

      if (claim && !claim.isRejected && 'issuedToken' in data) {
        const dto = await ClaimIssueDTO.create(data);

        await this.issue(dto);
        return;
      }
    } catch (err) {
      this.logger.error(err);
    }
  }

  /**
   * Saves claim to database
   * @param data Raw claim data
   */
  public async create(data: ClaimRequestDTO): Promise<Claim> {
    const parent = data.claimType
      .split('.')
      .slice(2)
      .join('.');

    const claim = Claim.create({
      ...data,
      parentNamespace: parent,
    });
    return this.claimRepository.save(claim);
  }

  public async reject(id: string) {
    const claim = await this.claimRepository.findOne(id);
    const updatedClaim = Claim.create({ ...claim, isRejected: true });
    return this.claimRepository.save(updatedClaim);
  }

  public async issue(data: ClaimIssueDTO) {
    const claim = await this.claimRepository.findOne(data.id);
    const updatedClaim = Claim.create({ ...claim, ...data, isAccepted: true });
    return this.claimRepository.save(updatedClaim);
  }

  /**
   * returns claim with matching ID
   * @param id claim ID
   */
  public async getById(id: string): Promise<Claim> {
    return this.claimRepository.findOne(id);
  }

  /**
   * returns claims with matching parent namespace
   * eg: passing "A.app" will return all roles in this namespace like "admin.roles.A.app", "user.roles.A.app"
   * @param namespace target parent namespace
   */
  async getByParentNamespace(namespace: string) {
    return this.claimRepository.find({
      where: { parentNamespace: namespace },
    });
  }

  /**
   * Get claims requested or issued by user with matching DID
   * @param did user DID
   */
  async getByUserDid(did: string) {
    return this.claimRepository.find({
      where: [{ claimIssuer: did }, { requester: did }],
    });
  }

  /**
   * Get claims issued by user with matching DID
   * @param did issuer's DID
   * @param filters additional filters
   */
  async getByIssuer(did: string, filters: QueryFilters = {}) {
    const parsedFilters = this.parseFilters(filters);
    return this.claimRepository.find({
      where: [...parsedFilters, { claimIssuer: did }],
    });
  }

  /**
   * Get claims requested by user with matching DID
   * @param did requester's DID
   * @param filters additional filters
   */
  async getByRequester(did: string, filters: QueryFilters = {}) {
    const parsedFilters = this.parseFilters(filters);
    return this.claimRepository.find({
      where: [...parsedFilters, { requester: did }],
    });
  }

  /**
   * delete claim with matching ID
   * @param id claim ID
   */
  public async removeById(id: string, currentUser?: string) {
    const claim = await this.getById(id);
    if (
      !claim ||
      (currentUser && claim.requester !== currentUser) ||
      claim.isAccepted ||
      claim.isRejected
    ) {
      throw new ForbiddenException();
    }
    await this.claimRepository.delete(claim.id);
  }

  /**
   * get all DID of requesters of given namespace
   * @param namespace target claim namespace
   * @param accepted flag for filtering only accepted claims
   */
  public async getDidOfClaimsOfNamespace(
    namespace: string,
    accepted?: string,
  ): Promise<string[]> {
    const parsedFilters = this.parseFilters({ accepted });
    const claims = await this.claimRepository.find({
      where: [...parsedFilters, { claimType: namespace }],
    });
    return claims.map(claim => claim.requester);
  }
}
