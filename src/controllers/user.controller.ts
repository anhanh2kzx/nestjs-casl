import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { CheckPolicies } from '../casl/check-abilities.decorator';
import { Action } from '../casl/action.enum';
import { AbilitiesGuard } from '../casl/abilities.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('/test-permission')
  @UseGuards(AbilitiesGuard)
  @CheckPolicies((ability) => ability.can(Action.Read, User))
  testPermission() {
    return 'This action returns all resources';
  }

  // @CheckAbilities({ action: Action.Read, subject: User })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  // @CheckAbilities({ action: Action.Create, subject: User })
  @Post()
  create(@Body() createUserDto: Partial<User>) {
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: Partial<User>) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Get('/roles')
  findAllRoles() {
    return this.userService.findAllRoles();
  }

  @Get('/roles/:id')
  findOneRole(@Param('id') id: string) {
    return this.userService.findOneRole(+id);
  }

  // @CheckAbilities({ action: Action.Create, subject: Role })
  @Post('/roles')
  createRole(@Body() createRoleDto: Partial<Role>) {
    return this.userService.createRole(createRoleDto);
  }

  @Put('/roles/:id')
  updateRole(@Param('id') id: string, @Body() updateRoleDto: Partial<Role>) {
    return this.userService.updateRole(+id, updateRoleDto);
  }

  @Delete('/roles/:id')
  removeRole(@Param('id') id: string) {
    return this.userService.removeRole(+id);
  }

  @Patch(':userId/roles/:roleId')
  addRoleToUser(
    @Param('userId') userId: string,
    @Param('roleId') roleId: string,
  ) {
    return this.userService.addRoleToUser(+userId, +roleId);
  }

  @Patch(':userId/roles')
  addRolesToUser(
    @Param('userId') userId: string,
    @Body('roleIds') roleIds: number[],
  ) {
    return this.userService.addRolesToUser(+userId, roleIds);
  }
}
