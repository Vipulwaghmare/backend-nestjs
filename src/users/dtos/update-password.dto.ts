import { IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @MinLength(6)
  readonly newPassword: string;

  @IsString()
  @MinLength(6)
  readonly password: string;
}
