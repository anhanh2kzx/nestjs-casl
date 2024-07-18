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
import { User } from '../entities/user.entity';
import { MenuService } from '../services/menu.service';
import { Menu } from '../entities/menu.enity';

// @UseGuards(JwtAuthGuard)
@Controller('menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  findAll() {
    return this.menuService.findAll();
  }

  // @CheckAbilities({ action: Action.Read, subject: User })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(+id);
  }

  // @CheckAbilities({ action: Action.Create, subject: User })
  @Post()
  create(@Body() createMenuDto: Partial<User>) {
    return this.menuService.create(createMenuDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateMenu: Partial<Menu>) {
    return this.menuService.update(+id, updateMenu);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuService.remove(+id);
  }

  @Patch(':menuId/permissions')
  addRolesToUser(
    @Param('menuId') menuId: string,
    @Body('perIds') perIds: number[],
  ) {
    return this.menuService.addPermissionsToMenu(+menuId, perIds);
  }
}
