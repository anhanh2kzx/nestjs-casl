import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { UserService } from '../../services/user.service';
import { Role } from '../../entities/role.entity';
import { Permission } from '../../entities/permission.entity';
import { Menu } from '../../entities/menu.enity';
import { UserController } from '../../controllers/user.controller';
import { RoleService } from '../../services/role.service';
import { PermissionService } from '../../services/permission.service';
import { MenuService } from '../../services/menu.service';
import { RoleController } from '../../controllers/role.controller';
import { PermissionController } from '../../controllers/permission.controller';
import { MenuController } from '../../controllers/menu.controller';
import { AbilityFactory } from '../../casl/casl-ability.factory';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission, Menu])],
  providers: [
    UserService,
    RoleService,
    PermissionService,
    MenuService,
    AbilityFactory,
  ],
  exports: [UserService, RoleService, PermissionService, MenuService],
  controllers: [
    UserController,
    RoleController,
    PermissionController,
    MenuController,
  ],
})
export class UsersModule {}
