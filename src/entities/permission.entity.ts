import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Menu } from './menu.enity';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  action: string;

  @Column()
  subject: string;

  @ManyToMany(() => Menu, (menu) => menu.permissions)
  menus: Menu[];
}
