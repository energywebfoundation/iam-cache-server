import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationModule } from '../application/application.module';
import { DIDModule } from '../did/did.module';
import { OrganizationModule } from '../organization/organization.module';
import { RoleController } from './role.controller';
import { Role } from './role.entity';
import { RoleService } from './role.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
    DIDModule,
    ApplicationModule,
    OrganizationModule,
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService, TypeOrmModule, ApplicationModule, OrganizationModule],
})
export class RoleModule {}
