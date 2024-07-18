import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { Menu } from '../entities/menu.enity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Role) private rolesRepository: Repository<Role>,
    @InjectRepository(Menu) private menuRepository: Repository<Menu>,
  ) {}

  async findAllRoles(): Promise<Role[]> {
    return this.rolesRepository.find();
  }

  async findOneRole(id: number): Promise<Role> {
    return this.rolesRepository.findOne({ where: { id } });
  }

  async createRole(role: Partial<Role>): Promise<Role> {
    const newRole = this.rolesRepository.create(role);
    return this.rolesRepository.save(newRole);
  }

  async updateRole(id: number, role: Partial<Role>): Promise<Role> {
    await this.rolesRepository.update(id, role);
    return this.findOneRole(id);
  }

  async removeRole(id: number): Promise<void> {
    await this.rolesRepository.delete(id);
  }

  async addMenusToRole(roleId: number, menuIds: number[]): Promise<Role> {
    const role = await this.rolesRepository.findOne({
      relations: ['menus'],
      where: { id: roleId },
    });
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    const menus = await this.menuRepository.findBy({ id: In(menuIds) });
    if (menus.length !== menuIds.length) {
      throw new NotFoundException(`One or more menus not found`);
    }

    role.menus = [...role.menus, ...menus];
    await this.rolesRepository.save(role);
    return this.rolesRepository.findOne({
      relations: ['menus'],
      where: { id: roleId },
    });
  }

  async getListPermissionFromRole(roleId: number) {
    const role = await this.rolesRepository.findOne({
      relations: ['menus', 'menus.permissions'],
      where: { id: roleId },
    });

    if (!role) {
      throw new Error('Role not found');
    }

    return role.menus.map((menu) => ({
      ...menu,
      permissions: menu.permissions,
    }));
  }
}
