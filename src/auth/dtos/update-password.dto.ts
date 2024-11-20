import { IsString, MinLength } from 'class-validator';
import { JWT_DTO } from '../../services/crypto.service';

export class UpdatePasswordDto extends JWT_DTO {
  @IsString()
  @MinLength(6)
  readonly newPassword: string;

  @IsString()
  @MinLength(6)
  readonly password: string;
}
