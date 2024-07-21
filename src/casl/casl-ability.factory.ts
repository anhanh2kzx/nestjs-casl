import {
  AbilityBuilder,
  AbilityClass,
  createMongoAbility,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
  PureAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { Menu } from '../entities/menu.enity';
import { Permission } from '../entities/permission.entity';

type Subjects =
  | InferSubjects<typeof User | typeof Role | typeof Menu | typeof Permission>
  | 'all';

export type AppAbility = PureAbility<[string, Subjects]>;

@Injectable()
export class AbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder(
      PureAbility as AbilityClass<AppAbility>,
    );

    user.roles.forEach((role) => {
      role.menus.forEach((menu) => {
        menu.permissions.forEach((permission) => {
          can(
            permission.action,
            permission.subject as ExtractSubjectType<Subjects>,
          );
        });
      });
    });

    // console.log(User.constructor === 'User');

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
