import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'john.doe@email.com',
  })
  @IsEmail()
  readonly email: string;
}
