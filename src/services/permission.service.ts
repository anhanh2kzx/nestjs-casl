import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from '../entities/menu.enity';
import { Permission } from '../entities/permission.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(Menu) private menuRepository: Repository<Menu>,
  ) {}

  async findAll(): Promise<Permission[]> {
    return this.permissionRepository.find({ relations: ['menus'] });
  }

  async findOne(id: number): Promise<Permission> {
    return this.permissionRepository.findOne({
      relations: ['menus'],
      where: { id },
    });
  }

  async create(permission: Partial<Permission>): Promise<Permission> {
    const newPermission = this.permissionRepository.create(permission);
    return this.permissionRepository.save(newPermission);
  }

  async update(
    id: number,
    permission: Partial<Permission>,
  ): Promise<Permission> {
    await this.permissionRepository.update(id, permission);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.permissionRepository.delete(id);
  }
}
