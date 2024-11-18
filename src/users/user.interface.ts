import { Document } from 'mongoose';

export interface User extends Document {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly _id: string;
  readonly passwordResetData?: {
    expiryTime: Date;
    token: string;
  }
}
