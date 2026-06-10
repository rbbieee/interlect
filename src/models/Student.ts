import { User } from "./User";
import { Application } from "./Application";

export class Student extends User {
  studentId: number;

  constructor(userId: number, name: string, email: string, password: string, studentId: number) {
    super(userId, name, email, password);
    this.studentId = studentId;
  }

  enroll(): void {}

  viewApplications(): Application[] {
    return [];
  }
}
