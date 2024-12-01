import { IsString, MinLength } from 'class-validator';
import { JWT_DTO } from '../../services/crypto.service';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto extends JWT_DTO {
  @ApiProperty({
    example: 'new.password@1234'
  })
  @IsString()
  @MinLength(6)
  readonly newPassword: string;

  @ApiProperty({
    example: 'password@1234'
  })
  @IsString()
  @MinLength(6)
  readonly password: string;
}
