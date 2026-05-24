import { IsString, MinLength } from 'class-validator';

export class LoginRequest {
  @IsString()
  identifier: string;

  @IsString()
  @MinLength(8)
  password: string;
}
