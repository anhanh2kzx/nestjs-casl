import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Menu } from '../entities/menu.enity';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu) private menusRepository: Repository<Menu>,
    @InjectRepository(Role) private rolesRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async findAll(): Promise<Menu[]> {
    return this.menusRepository.find({ relations: ['permissions'] });
  }

  async findOne(id: number): Promise<Menu> {
    return this.menusRepository.findOne({
      relations: ['permissions'],
      where: { id },
    });
  }
  async create(user: Partial<Menu>): Promise<Menu> {
    const newUser = this.menusRepository.create(user);
    return this.menusRepository.save(newUser);
  }

  async update(id: number, user: Partial<Menu>): Promise<Menu> {
    await this.menusRepository.update(id, user);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.menusRepository.delete(id);
  }

  async addPermissionsToMenu(menuId: number, perIds: number[]): Promise<Menu> {
    const menu = await this.menusRepository.findOne({
      relations: ['permissions'],
      where: { id: menuId },
    });
    if (!menu) {
      throw new NotFoundException(`Menu with ID ${menuId} not found`);
    }

    const pers = await this.permissionRepository.findBy({ id: In(perIds) });
    if (pers.length !== perIds.length) {
      throw new NotFoundException(`One or more pers not found`);
    }

    menu.permissions = [...menu.permissions, ...pers];
    await this.menusRepository.save(menu);
    return this.menusRepository.findOne({
      relations: ['permissions'],
      where: { id: menuId },
    });
  }
}
