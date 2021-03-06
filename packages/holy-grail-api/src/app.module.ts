import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AppConfigModule } from './app-config/app-config.module';
import { DomainsModule } from './domains/domains.module';
import { ProxyModule } from './proxy/proxy.module';

@Module({
  imports: [
    AuthModule,
    // Import typeORM module for sqlite with autoimport entities
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './db.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AppConfigModule,
    DomainsModule,
    ProxyModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
