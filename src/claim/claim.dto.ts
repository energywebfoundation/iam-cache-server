import { IClaimIssuance, IClaimRejection, IClaimRequest } from './claim.types';
import {
  IsArray,
  IsBoolean,
  IsString,
  validateOrReject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ClaimRequestDTO implements IClaimRequest {
  static async create(data: Partial<ClaimRequestDTO>) {
    const dto = new ClaimRequestDTO();
    Object.assign(dto, data);
    await validateOrReject(dto, { whitelist: true });
    return dto;
  }

  @IsString()
  @ApiProperty()
  id: string;

  @IsArray()
  @ApiProperty()
  claimIssuer: string[];

  @IsString()
  @ApiProperty()
  requester: string;

  @IsString()
  @ApiProperty()
  token: string;

  @IsString()
  @ApiProperty()
  claimType: string;

  @IsString()
  @ApiProperty()
  claimTypeVersion: string;
}

export class ClaimIssueDTO implements IClaimIssuance {
  static async create(data: Partial<ClaimIssueDTO>) {
    const dto = new ClaimIssueDTO();
    Object.assign(dto, data);
    await validateOrReject(dto, { whitelist: true });
    return dto;
  }

  @IsString()
  @ApiProperty()
  id: string;

  @IsString()
  @ApiProperty()
  acceptedBy: string;

  @IsArray()
  @ApiProperty()
  claimIssuer: string[];

  @IsString()
  @ApiProperty()
  issuedToken: string;

  @IsString()
  @ApiProperty()
  requester: string;
}

export class ClaimRejectionDTO implements IClaimRejection {
  static async create(data: Partial<ClaimRejectionDTO>) {
    const dto = new ClaimRejectionDTO();
    Object.assign(dto, data);
    await validateOrReject(dto, { whitelist: true });
    return dto;
  }

  @IsString()
  @ApiProperty()
  id: string;

  @IsArray()
  @ApiProperty()
  claimIssuer: string[];

  @IsString()
  @ApiProperty()
  requester: string;

  @IsBoolean()
  @ApiProperty()
  isRejected: boolean;
}
