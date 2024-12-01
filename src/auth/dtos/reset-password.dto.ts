import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'token-received-in-mail'
  })
  @IsString()
  readonly token: string;

  @ApiProperty({
    example: 'new.password@1234'
  })
  @IsString()
  @MinLength(6)
  readonly password: string;
}
