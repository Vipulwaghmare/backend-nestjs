import { Model, Schema, model } from 'mongoose';

// interface IUser {
//   name: string;
//   email: string;
//   password: string;
//   passwordResetData?: {
//     expiryTime: Date;
//     token: string;
//   };
// }

// interface IUserMethods {
//   isValidatedPassword: (arg0: string) => Promise<boolean>;
//   getAccessToken: () => string;
//   getRefreshToken: () => string;
// }

// type UserModel = Model<IUser, unknown, IUserMethods>;

// export const userSchema = new Schema<IUser, UserModel, IUserMethods>({
export const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'password should be atleast 6 char'],
    select: false,
  },
  passwordResetData: {
    type: Object,
  },
});

// const UserModel = model<IUser, UserModel>('User', userSchema);

// export default UserModel;
