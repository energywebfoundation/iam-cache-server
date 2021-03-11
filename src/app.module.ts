import fs from 'fs';
import { HttpModule, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApplicationModule } from './application/application.module';
import { AuthModule } from './auth/auth.module';
import { ClaimModule } from './claim/claim.module';
import { DIDModule } from './did/did.module';
import { LoggerModule } from './logger/logger.module';
import { SearchModule } from './search/search.module';
import { NatsModule } from './nats/nats.module';
import { OrganizationModule } from './organization/organization.module';
import { DgraphModule } from './dgraph/dgraph.module';
import { RoleModule } from './role/role.module';
import { SentryModule } from './sentry/sentry.module';
import { InterceptorsModule } from './interceptors/interceptors.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ENSModule } from './ens/ens.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction =
          configService.get<string>('NODE_ENV') === 'production';

        const config: TypeOrmModuleOptions = {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: +configService.get<string>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          migrations: ['migrations/*.js'],
          cli: { migrationsDir: 'migrations' },
          migrationsRun: true,
          migrationsTableName: 'migrations_iam_cache_server',
          logging: false,
          autoLoadEntities: true,
        };

        !isProduction &&
          fs.writeFileSync(
            'ormconfig.json',
            JSON.stringify(
              { ...config, entities: ['dist/**/*.entity.js'] },
              null,
              2,
            ),
          );

        return config;
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    HttpModule,
    ApplicationModule,
    AuthModule,
    ClaimModule,
    DIDModule,
    LoggerModule,
    SearchModule,
    NatsModule,
    OrganizationModule,
    DgraphModule,
    RoleModule,
    SentryModule,
    InterceptorsModule,
    ENSModule,
  ],
})
export class AppModule {}
