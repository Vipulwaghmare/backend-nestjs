import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    example: 'john.doe@email.com',
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: 'password@1234'
  })
  @IsString()
  @MinLength(6)
  readonly password: string;
}
