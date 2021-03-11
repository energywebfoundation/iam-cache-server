import {
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
  validateOrReject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEnsDefinition, BaseEnsEntity } from '../shared/ENSBaseEntity';

/**
 * Application's Definition DTO providing validation and API schema for swagger UI
 */
export class ApplicationDefinitionDTO implements BaseEnsDefinition {
  static async create(data: Partial<ApplicationDefinitionDTO>) {
    const dto = new ApplicationDefinitionDTO();
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
  appName: string;

  @IsOptional()
  @IsObject()
  @ApiProperty({
    type: 'object',
  })
  others?: Record<string, unknown>;
}

/**
 * Application DTO providing validation and API schema for swagger UI
 */
export class ApplicationDTO implements BaseEnsEntity {
  static async create(data: Partial<ApplicationDTO>) {
    const dto = new ApplicationDTO();
    Object.assign(dto, data);
    await validateOrReject(dto, { whitelist: true });
    return dto;
  }

  @ValidateNested()
  @ApiProperty()
  definition: ApplicationDefinitionDTO;

  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  owner: string;

  @IsString()
  @ApiProperty()
  namespace: string;

  @IsString()
  parentOrg: string;
}
