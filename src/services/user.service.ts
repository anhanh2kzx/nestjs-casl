import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Role) private rolesRepository: Repository<Role>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['roles', 'roles.menus', 'roles.menus.permissions'],
    });
  }

  async findOne(id: number): Promise<User> {
    return this.usersRepository.findOne({
      relations: ['roles', 'roles.menus', 'roles.menus.permissions'],
      where: { id },
    });
  }

  async getPermissions(id: number) {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['roles', 'roles.menus', 'roles.menus.permissions'],
    });
  }

  async validateUser(username: string, pass: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    return null;
  }

  async findOneByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { username },
    });
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create(user);
    newUser.password = await bcrypt.hash(newUser.password, 10);
    return this.usersRepository.save(newUser);
  }

  async update(id: number, user: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, user);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

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

  async addRoleToUser(userId: number, roleId: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      relations: ['roles'],
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const role = await this.rolesRepository.findOne({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    if (!user.roles) {
      user.roles = [];
    }
    user.roles.push(role);

    await this.usersRepository.save(user);
    return user;
  }

  async addRolesToUser(userId: number, roleIds: number[]): Promise<User> {
    const user = await this.usersRepository.findOne({
      relations: ['roles'],
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const roles = await this.rolesRepository.findBy({ id: In(roleIds) });
    if (roles.length !== roleIds.length) {
      throw new NotFoundException(`One or more roles not found`);
    }

    user.roles = [...user.roles, ...roles];
    await this.usersRepository.save(user);
    return this.usersRepository.findOne({
      relations: ['roles'],
      where: { id: userId },
    });
  }
}
