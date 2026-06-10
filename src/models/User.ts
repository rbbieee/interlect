export class User {
  userId: number;
  name: string;
  email: string;
  password: string;

  constructor(userId: number, name: string, email: string, password: string) {
    this.userId = userId;
    this.name = name;
    this.email = email;
    this.password = password;
  }

  login(email: string, password: string): boolean {
    return false;
  }

  logout(): void {}

  updateProfile(name: string, email: string): void {
    this.name = name;
    this.email = email;
  }

  changePassword(oldPassword: string, newPassword: string): void {
    this.password = newPassword;
  }
}