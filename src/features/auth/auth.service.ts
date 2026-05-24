import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  errorResponse,
  successResponse,
} from '../../common/responses/api-response.util';
import {
  hashPassword,
  isPasswordHashed,
  verifyPassword,
} from '../../common/security/password.util';
import { UsersService } from '../users/users.service';
import { LoginRequest } from './dto/login.request';
import { AuthenticatedUser } from './types/authenticated-user.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(payload: LoginRequest) {
    const user = await this.usersService.findByUsernameOrEmail(
      payload.identifier,
    );

    if (!user || user.status !== 'active') {
      throw new UnauthorizedException(
        errorResponse(
          'Login Failed',
          'Username/email or password is incorrect',
        ),
      );
    }

    const isValidPassword = await verifyPassword(
      payload.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException(
        errorResponse(
          'Login Failed',
          'Username/email or password is incorrect',
        ),
      );
    }

    if (!isPasswordHashed(user.password)) {
      await this.usersService.updatePasswordHash(
        user.id,
        await hashPassword(payload.password),
      );
    }

    const authUser: AuthenticatedUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
    };

    return successResponse('Login Successful', 'Login successful', {
      access_token: await this.jwtService.signAsync({
        sub: user.id,
        username: user.username,
      }),
      token_type: 'Bearer',
      expires_in: this.configService.get<string>('JWT_EXPIRES_IN') ?? '1d',
      user: authUser,
    });
  }
}
