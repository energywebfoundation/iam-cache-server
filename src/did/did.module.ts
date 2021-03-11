import { BullModule } from '@nestjs/bull';
import { forwardRef, HttpModule, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DgraphModule } from '../dgraph/dgraph.module';
import { SentryModule } from '../sentry/sentry.module';
import { DIDController } from './did.controller';
import { DIDProcessor } from './did.processor';
import { DIDRepository } from './did.repository';
import { DIDService } from './did.service';
import { ResolverFactory } from './ResolverFactory';

const redisConfig = {
  port: parseInt(process.env.REDIS_PORT),
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
};

@Module({
  imports: [
    HttpModule,
    BullModule.registerQueue({
      name: 'dids',
      redis: redisConfig,
    }),
    DgraphModule,
    SentryModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [DIDController],
  providers: [DIDService, DIDRepository, ResolverFactory, DIDProcessor],
  exports: [DIDService],
})
export class DIDModule {}
