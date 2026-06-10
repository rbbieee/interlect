import { User } from "../models/User";
import { Program } from "../models/Program";
import { Application } from "../models/Application";

export class ApplicationController {
  createApplication(user: User, program: Program): void {}

  trackApplication(applicationId: number): Application | null {
    return null;
  }
}
