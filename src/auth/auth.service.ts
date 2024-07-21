import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../services/user.service';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  private tokenBlacklist: Set<string> = new Set();

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly usersService: UserService,
  ) {}

  async validateUser(userId: number): Promise<User> {
    return this.usersService.getPermissions(userId);
  }

  async login(user: User) {
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async logout(token: string) {
    this.tokenBlacklist.add(token);
  }

  async register(user: Partial<User>): Promise<User> {
    return this.userService.create(user);
  }

  isBlacklisted(token: string): boolean {
    return this.tokenBlacklist.has(token);
  }
}
