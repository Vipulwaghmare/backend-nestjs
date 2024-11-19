import { BadRequestException, Body, Controller, Post, Headers } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { CryptoService } from '../services/crypto.service';
import { EmailService } from 'src/services/email.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly cryptoService: CryptoService,
    private readonly emailService: EmailService
  ) { }

  @Post('/register')
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
  async login(@Body() body: LoginUserDto) {
    const user = await this.userService.findByEmail(body.email.trim().toLowerCase(), { email: 1, password: 1 });
    if (!user) {
      throw new BadRequestException('Invalid email');
    }
    const isMatched = await this.cryptoService.validatePassword(body.password, user.password);
    if (!isMatched) {
      throw new BadRequestException('Invalid password');
    };
    const jwtPayload = {
      userEmail: body.email,
      userId: user._id,
    };
    const accessToken = await this.cryptoService.getAccessToken(jwtPayload);
    const refreshToken = await this.cryptoService.getRefreshToken(jwtPayload);
    return {
      success: `User is logged in with email: ${body.email}`,
      accessToken,
      refreshToken,
    };
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto, @Headers() headers) {
    const { email } = body;
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new BadRequestException('No user with this Email')
    }

    const response = await this.cryptoService.getResetToken(user._id);
    const host = `http://${headers.host}`;
    const message = `You are receiving this because you requested a password reset.\n
           Please click on the following link, or paste it into your browser to reset your password:\n
           ${host}/auth/reset-password/${response.token} 
           If you did not request this, please ignore this email.`;

    this.emailService.sendEmail({
      to: email,
      subject: 'Password Reset Link',
      text: message,
    })
    this.userService.update(user._id, { passwordResetData: response });

    return {
      message: 'Successfully send password reset email to your email',
    };
  }

  @Post('/reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    const decodedData = await this.cryptoService.verifyResetToken(body.token);
    if (!decodedData) {
      throw new BadRequestException('Your password reset link is expired. Please try again.');
    }
    const userId = decodedData.userId;
    const user = await this.userService.findById(userId);
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
  async updatePassword(@Body() body: UpdatePasswordDto) {
    const userId = body.jwtPayload.userId;
    const user = await this.userService.findById(userId, { email: 1, password: 1 });
    if (!user) {
      throw new BadRequestException('Invalid email');
    }
    const isMatched = await this.cryptoService.validatePassword(body.password, user.password);
    if (!isMatched) {
      // const userEmail = user.email;
      // TODO: Send email to user that password update attempt was made
      throw new BadRequestException('Invalid password');
    }
    const hashPassword = await this.cryptoService.hashPassword(body.newPassword);

    await this.userService.update(userId, { password: hashPassword });
    // TODO: Send email to user that password update was successful
    return {
      message: 'Password updated successfully',
    };
  }
}
