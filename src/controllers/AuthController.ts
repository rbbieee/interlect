import { User } from "../models/User";

export class AuthController {
  authenticate(email: string, password: string): boolean {
    return false;
  }

  logout(user: User): void {}
}
