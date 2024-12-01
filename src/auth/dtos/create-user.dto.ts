// import { Type } from 'class-transformer';
import { IsString, IsEmail, MinLength, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// class ResetPassword {
//   @ApiProperty()
//   @IsString()
//   readonly token: string;

//   @ApiProperty()
//   @IsString()
//   readonly expiryTime: Date;
// }

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
  })
  @IsString()
  readonly name: string;

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

  // @ApiProperty()
  // @ValidateNested()
  // @Type(() => ResetPassword)
  // passwordResetData: ResetPassword;
}
