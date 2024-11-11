import { Document } from 'mongoose';

export interface User extends Document {
  readonly name: string;
  readonly email: number;
  readonly password: string;
  readonly passwordResetData?: {
    expiryTime: Date;
    token: string;
  }
}
