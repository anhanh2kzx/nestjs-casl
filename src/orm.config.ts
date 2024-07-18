import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { Menu } from './entities/menu.enity';

export const db_config = {
  // type: 'better-sqlite3',
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'admin1234',
  database: 'test',
  // seeds: [ CreateUsers],
  entities: [User, Role, Permission, Menu],
  synchronize: true,
};
