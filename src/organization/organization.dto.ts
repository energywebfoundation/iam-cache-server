import {
  IsOptional,
  IsString,
  ValidateNested,
  IsObject,
  validateOrReject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { BaseEnsDefinition, BaseEnsEntity } from '../shared/ENSBaseEntity';
export class OrganizationDefinitionDTO implements BaseEnsDefinition {
  static async create(data: Partial<OrganizationDefinitionDTO>) {
    const dto = new OrganizationDefinitionDTO();
    Object.assign(dto, data);
    await validateOrReject(dto, { whitelist: true });
    return dto;
  }

  @IsOptional()
  @IsString()
  @ApiProperty()
  description?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  websiteUrl?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  logoUrl?: string;

  @IsString()
  @ApiProperty()
  orgName: string;

  @IsOptional()
  @IsObject()
  @ApiProperty({
    type: 'object',
  })
  others?: Record<string, unknown>;
}

/**
 * Organization DTO providing validation and API schema for swagger UI
 */
export class OrganizationDTO implements BaseEnsEntity {
  static async create(data: Partial<OrganizationDTO>) {
    const dto = new OrganizationDTO();
    Object.assign(dto, data);
    await validateOrReject(dto, { whitelist: true });
    return dto;
  }

  @ValidateNested()
  @ApiProperty()
  definition: OrganizationDefinitionDTO;

  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  owner: string;

  @IsString()
  @ApiProperty()
  namespace: string;

  @IsOptional()
  @IsString()
  parentOrg: string;
}
