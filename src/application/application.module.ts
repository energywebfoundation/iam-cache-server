import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationModule } from '../organization/organization.module';
import { ApplicationController } from './application.controller';
import { Application } from './application.entity';
import { ApplicationService } from './application.service';

@Module({
  imports: [TypeOrmModule.forFeature([Application]), OrganizationModule],
  controllers: [ApplicationController],
  providers: [ApplicationService],
  exports: [ApplicationService, TypeOrmModule, TypeOrmModule],
})
export class ApplicationModule {}
