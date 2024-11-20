import { Type } from 'class-transformer';
import { IsString, IsEmail, MinLength, ValidateNested } from 'class-validator';

class ResetPassword {
  @IsString()
  readonly token: string;

  @IsString()
  readonly expiryTime: Date;
}

export class CreateUserDto {
  @IsString()
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  @MinLength(6)
  readonly password: string;

  @ValidateNested()
  @Type(() => ResetPassword)
  passwordResetData: ResetPassword;
}
