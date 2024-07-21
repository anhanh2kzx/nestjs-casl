import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AbilityFactory, AppAbility } from './casl-ability.factory';
import { PolicyHandler } from './policy-handler.interface';
import { CHECK_POLICIES_KEY } from './check-abilities.decorator';

@Injectable()
export class AbilitiesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const request = context.switchToHttp().getRequest<Request>();

    const path = request.path;

    if (path.includes('/auth/login') || path.includes('/auth/register')) {
      return true;
    }

    const user = request['user'];

    if (!user) {
      throw new UnauthorizedException('User not found in request');
    }

    const ability = this.abilityFactory.createForUser(user);

    // Log ability for debugging
    console.log('User Ability:', ability);

    // Evaluate policy handlers against user's ability
    const allPoliciesPassed = policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability),
    );

    console.log('All Policies Passed:', allPoliciesPassed);

    return allPoliciesPassed;
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}
