import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PermissionService } from '../services/permission.service';
import { Permission } from '../entities/permission.entity';

// @UseGuards(JwtAuthGuard)
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  findAll() {
    return this.permissionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(+id);
  }

  @Post()
  create(@Body() createPermissionDto: Partial<Permission>) {
    return this.permissionService.create(createPermissionDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: Partial<Permission>,
  ) {
    return this.permissionService.update(+id, updatePermissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionService.remove(+id);
  }
}
