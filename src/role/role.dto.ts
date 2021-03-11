import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
  validateOrReject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  EnrolmentPrecondition,
  Fields,
  Issuer,
  RoleDefinition,
} from './role.types';
import { BaseEnsEntity } from '../shared/ENSBaseEntity';
import { Type } from 'class-transformer';

export class FieldsDTO implements Fields {
  @IsString()
  @ApiProperty()
  fieldType: string;

  @IsString()
  @ApiProperty()
  label: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  required?: boolean;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  minLength?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  maxLength?: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  pattern?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  minValue?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  maxValue?: number;

  @IsOptional()
  @IsDate()
  @ApiProperty()
  minDate?: Date;

  @IsOptional()
  @IsDate()
  @ApiProperty()
  maxDate?: Date;
}

export class PreconditionsDTO implements EnrolmentPrecondition {
  @IsString()
  type: string;

  @IsArray()
  conditions: string[];
}

export class IssuerDTO implements Issuer {
  @IsString()
  issuerType: string;

  @IsArray()
  did: string[];

  @IsString()
  @IsOptional()
  roleName?: string;
}

/**
 * Role's Definition DTO providing validation and API schema for swagger UI
 */
export class RoleDefinitionDTO implements RoleDefinition {
  static async create(
    data: Partial<RoleDefinitionDTO>,
  ): Promise<RoleDefinitionDTO> {
    const dto = new RoleDefinitionDTO();
    Object.assign(dto, data);
    await validateOrReject(dto, { whitelist: true });
    return dto;
  }
  @ValidateNested({ each: true })
  @IsOptional()
  @IsArray()
  @Type(() => FieldsDTO)
  fields?: FieldsDTO[];

  @IsOptional()
  @IsObject()
  @ApiProperty()
  metadata?: Record<string, unknown>;

  @ValidateNested()
  @IsObject()
  @Type(() => IssuerDTO)
  issuer: IssuerDTO;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PreconditionsDTO)
  enrolmentPreconditions: PreconditionsDTO[];

  @IsString()
  @ApiProperty()
  roleName: string;

  @IsString()
  @ApiProperty()
  roleType: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  version: string;
}

/**
 * Role DTO providing validation and API schema for swagger UI
 */
export class RoleDTO implements BaseEnsEntity {
  static async create(data: Partial<RoleDTO>): Promise<RoleDTO> {
    const dto = new RoleDTO();
    Object.assign(dto, data);
    await validateOrReject(dto, { whitelist: true });
    return dto;
  }

  @ApiProperty()
  @IsObject()
  definition: RoleDefinitionDTO;

  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  namespace: string;

  @IsString()
  @ApiProperty()
  owner: string;

  @IsOptional()
  @IsString()
  orgNamespace?: string;

  @IsOptional()
  @IsString()
  appNamespace?: string;
}

export interface NamespaceFragments {
  apps?: string;
  roles?: string;
  org?: string;
  ewc?: string;
}
