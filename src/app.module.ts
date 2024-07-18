import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthMiddleware } from './auth/auth.middleware';
import { AbilityFactory } from './casl/casl-ability.factory';
import { APP_GUARD } from '@nestjs/core';
import { AbilitiesGuard } from './casl/abilities.guard';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { db_config } from './orm.config';
import { AuthModule } from './auth/auth.module';
import { UserService } from './services/user.service';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { Menu } from './entities/menu.enity';
import { UsersModule } from './module/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(db_config as any),
    TypeOrmModule.forFeature([User, Role, Permission, Menu]),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UserService,
    AbilityFactory,
    {
      provide: APP_GUARD,
      useClass: AbilitiesGuard,
    },
    JwtService,
    AuthService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(AuthMiddleware).exclude('/auth/login').forRoutes('*');
  }
}
