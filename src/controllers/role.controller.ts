import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { Role } from '../entities/role.entity';
import { RoleService } from '../services/role.service';

// @UseGuards(JwtAuthGuard)
@Controller('roles')
export class RoleController {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {}

  @Get()
  findAllRoles() {
    return this.userService.findAllRoles();
  }

  @Get(':id')
  findOneRole(@Param('id') id: string) {
    return this.userService.findOneRole(+id);
  }

  @Post()
  createRole(@Body() createRoleDto: Partial<Role>) {
    return this.userService.createRole(createRoleDto);
  }

  @Put(':id')
  updateRole(@Param('id') id: string, @Body() updateRoleDto: Partial<Role>) {
    return this.userService.updateRole(+id, updateRoleDto);
  }

  @Delete(':id')
  removeRole(@Param('id') id: string) {
    return this.userService.removeRole(+id);
  }

  @Patch(':roleId/menus')
  addMenusToRole(
    @Param('roleId') roleId: string,
    @Body('menuIds') menuIds: number[],
  ) {
    return this.roleService.addMenusToRole(+roleId, menuIds);
  }

  @Get(':id/menus-permissions')
  async getMenusAndPermissionsByRoleId(@Param('id') id: number) {
    return this.roleService.getListPermissionFromRole(id);
  }

  @Get(':id/list-menu')
  async getListMenuByRole(@Param('id') id: number) {
    return this.roleService.getMenusByRoleId(id);
  }
}
