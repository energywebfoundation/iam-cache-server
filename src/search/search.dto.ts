import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { NamespaceEntities } from './search.types';

export class SearchDTO {
  static create(data: Partial<SearchDTO>): SearchDTO {
    const dto = new SearchDTO();
    Object.assign(dto, data);
    return dto;
  }

  @IsOptional()
  @IsArray()
  @IsEnum(NamespaceEntities, { each: true })
  types?: NamespaceEntities[];

  @IsString()
  search: string;
}
