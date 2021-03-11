import {
  Controller,
  Get,
  HttpStatus,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleDTO } from './role.dto';
import { Auth } from '../auth/auth.decorator';
import { SentryErrorInterceptor } from '../interceptors/sentry-error-interceptor';

@Auth()
@UseInterceptors(SentryErrorInterceptor)
@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Get('/:namespace')
  @ApiTags('Roles')
  @ApiOperation({
    summary: 'Returns Role with given namespace',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: RoleDTO,
    description: 'Role with matching Id',
  })
  public async getById(@Param('namespace') namespace: string) {
    return await this.roleService.getByNamespace(namespace);
  }

  @Get('/owner/:owner')
  @ApiTags('Roles')
  @ApiOperation({
    summary: 'Returns if Role exists',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
  })
  public async getByOwner(@Param('owner') owner: string) {
    return await this.roleService.getByOwner(owner);
  }

  @Get('/:namespace/exists')
  @ApiTags('Roles')
  @ApiOperation({
    summary: 'Returns if Role exists',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
  })
  public async exists(@Param('namespace') namespace: string) {
    return await this.roleService.exists(namespace);
  }
}
