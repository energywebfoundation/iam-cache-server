import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiQuery, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { NamespaceEntities } from './search.types';
import { SearchDTO } from './search.dto';
import { validate } from 'class-validator';
import { Auth } from '../auth/auth.decorator';
import { SentryErrorInterceptor } from '../interceptors/sentry-error-interceptor';

@Auth()
@UseInterceptors(SentryErrorInterceptor)
@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get(':search')
  @ApiTags('Search')
  @ApiOperation({
    summary: 'Search Org/App/Role by namespace',
  })
  @ApiQuery({
    name: 'types',
    required: false,
    enum: NamespaceEntities,
    isArray: true,
    type: [String],
  })
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
  })
  public async search(
    @Param('search') search: string,
    @Query('types') types?: NamespaceEntities[],
  ) {
    if (search.length < 3) {
      throw new HttpException(
        'Search phrase too short (min 3 characters)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const searchByData = SearchDTO.create({ search, types });
    const validationErrors = await validate(searchByData);
    if (validationErrors.length > 0) {
      return validationErrors;
    }
    return await this.searchService.searchByText(
      searchByData.search,
      searchByData.types,
    );
  }
}
