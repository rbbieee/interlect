export class Application {
  applicationId: number;
  status: string;
  appliedAt: Date;

  constructor(applicationId: number, status: string, appliedAt: Date) {
    this.applicationId = applicationId;
    this.status = status;
    this.appliedAt = appliedAt;
  }

  submitApplication(): void {}

  checkStatus(): string {
    return this.status;
  }

  withdrawApplication(): void {}

  updateStatus(status: string): void {
    this.status = status;
  }
}
