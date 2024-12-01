import { BadRequestException, Body, Controller, Post, Headers } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { CryptoService } from '../services/crypto.service';
import { EmailService } from '../services/email.service';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { validationApiResOptions } from '../dto/validation-error.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly cryptoService: CryptoService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService
  ) { }

  @Post('/register')
  @ApiOperation({ summary: 'Register User' })
  @ApiOkResponse({
    description: 'User Created Successfully',
    // type: CreateUserDto
    // content: {
    //   'application/json': {
    //     example: {
    //       message: 'User Created Successfully'
    //     }
    //   },
    // }
  })
  @ApiResponse(validationApiResOptions)
  @ApiBadRequestResponse({
    description: 'Bad Request', // TODO: Fix this
    // type: CreateUserDto
    // isArray: true,
  })
  async register(@Body() body: CreateUserDto) {
    const hashPassword = await this.cryptoService.hashPassword(body.password);
    const resp = await this.userService.create({
      ...body,
      email: body.email.trim().toLowerCase(),
      password: hashPassword,
    });
    if ('error' in resp) {
      throw new BadRequestException(resp.error);
    }
    return {
      message: "User Created Successfully",
    }
  }

  @Post('/login')
  @ApiResponse(validationApiResOptions)
  async login(@Body() body: LoginUserDto) {
    const email = body.email.trim().toLowerCase();
    const user = await this.userService.findByEmail(email, { email: 1, password: 1 });
    if (!user) {
      throw new BadRequestException('Invalid email');
    }
    const isMatched = await this.cryptoService.validatePassword(body.password, user.password);
    if (!isMatched) {
      throw new BadRequestException('Invalid password');
    };
    const jwtPayload = {
      userEmail: email,
      userId: user._id,
    };
    const accessToken = await this.cryptoService.getAccessToken(jwtPayload);
    const refreshToken = await this.cryptoService.getRefreshToken(jwtPayload);
    return {
      success: `User is logged in with email: ${email}`,
      accessToken,
      refreshToken,
      userId: user._id,
    };
  }

  @Post('/forgot-password')
  @ApiResponse(validationApiResOptions)
  async forgotPassword(@Body() body: ForgotPasswordDto, @Headers() headers) {
    const email = body.email.trim().toLowerCase();
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new BadRequestException('No user with this Email')
    }

    const response = await this.cryptoService.getResetToken(user._id);
    const message = `You are receiving this because you requested a password reset.\n
           Please click on the following link, or paste it into your browser to reset your password:\n
           ${this.configService.get('FRONTED_URL')}/auth/reset-password/${response.token} 
           If you did not request this, please ignore this email.`;
    await this.emailService.sendEmail({
      to: email,
      subject: 'Password Reset Link',
      text: message,
    })
    await this.userService.update(user._id, { passwordResetData: response });

    return {
      message: 'Successfully send password reset email to your email',
    };
  }

  @Post('/reset-password')
  @ApiResponse(validationApiResOptions)
  @ApiOkResponse({
    description: 'Successfully updated user password',
  })
  async resetPassword(@Body() body: ResetPasswordDto) {
    const decodedData = await this.cryptoService.verifyResetToken(body.token);
    if (!decodedData) {
      throw new BadRequestException('Your password reset link is expired. Please try again.');
    }
    const userId = decodedData.userId;
    const user = await this.userService.findById(userId);
    if (user?.passwordResetData?.token !== body.token) {
      throw new BadRequestException('Your password reset link is expired. Please try again.');
    }
    if (!user?.passwordResetData?.expiryTime) {
      throw new BadRequestException('Your password reset link is expired. Please try again.');
    }
    if (user.passwordResetData.expiryTime <= new Date()) {
      throw new BadRequestException('Your password reset link is expired. Please try again.');
    }
    const hashPassword = await this.cryptoService.hashPassword(body.password);
    await this.userService.update(userId, { password: hashPassword, passwordResetData: null });
    return {
      message: 'Successfully updated user password',
    };
  }

  @Post('/update-password')
  @ApiResponse(validationApiResOptions)
  @ApiOkResponse({
    description: 'Successfully updated user password',
  })

  async updatePassword(@Body() body: UpdatePasswordDto) {
    const userId = body.jwtPayload.userId;
    const user = await this.userService.findById(userId, { email: 1, password: 1 });
    if (!user) {
      throw new BadRequestException('Invalid email');
    }
    const isMatched = await this.cryptoService.validatePassword(body.password, user.password);
    if (!isMatched) {
      // TODO: Send email to user that password update attempt was made
      throw new BadRequestException('Invalid password');
    }
    const hashPassword = await this.cryptoService.hashPassword(body.newPassword);

    await this.userService.update(userId, { password: hashPassword });
    // TODO: Send email to user that password update was successful
    return {
      message: 'Successfully updated user password',
    };
  }
}
