export enum UserStatus {
  Unverified, //0
  Verified, //1
  Banned
}

export enum UserRole {
  Admin,
  Staff,
  Student
}

export enum TokenType {
  AccessToken, //0
  RefreshToken, //1
  ForgotPasswordToken, //2
  EmailVerificationToken //3
}
