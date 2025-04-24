import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { JwtModule } from '@nestjs/jwt';
import { ClientModule } from './client/client.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { ChildModule } from './child/child.module';
import { YogaclassModule } from './yogaclass/yogaclass.module';
import { LocationModule } from './location/location.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: 'debug', //define o nível de log
        redact: ['password'],
        transport: {
          targets: [
            {
              target: 'pino-pretty', //ativa o pino-pretty
              options: {
                colorize: true, //adiciona cores no log
              },
            },
            {
              target: '@logtail/pino',
              level: 'debug',
              options: {
                sourceToken: process.env.BETTERSTACK_TOKEN,
                options: {
                  endpoint: 'https://s1265203.eu-nbg-2.betterstackdata.com',
                },
              },
            },
          ],
          options: {
            colorize: true,
          },
        },
      },
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'src', 'assets', 'images'),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    PrismaModule,
    ClientModule,
    UserModule,
    RoleModule,
    ChildModule,
    YogaclassModule,
    LocationModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }, AppService],
})
export class AppModule {}
