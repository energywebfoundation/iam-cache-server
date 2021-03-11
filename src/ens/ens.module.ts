import { Module } from '@nestjs/common';
import { ApplicationModule } from '../application/application.module';
import { OrganizationModule } from '../organization/organization.module';
import { RoleModule } from '../role/role.module';
import { EnsService } from './ens.service';

@Module({
  imports: [RoleModule, OrganizationModule, ApplicationModule],
  providers: [EnsService],
})
export class ENSModule {}
