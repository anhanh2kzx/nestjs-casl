import { AppAbility } from './casl-ability.factory';

export type PolicyHandlerCallback = (ability: AppAbility) => boolean;

export interface PolicyHandlerObject {
  handle(ability: AppAbility): boolean;
}

export type PolicyHandler = PolicyHandlerCallback | PolicyHandlerObject;
