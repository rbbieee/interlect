export class Program {
  programId: number;
  name: string;
  tuition: number;

  constructor(programId: number, name: string, tuition: number) {
    this.programId = programId;
    this.name = name;
    this.tuition = tuition;
  }

  getDetails(): string {
    return `Program: ${this.name}, Tuition: ${this.tuition}`;
  }

  updateTuition(tuition: number): void {
    this.tuition = tuition;
  }

  isAvailable(): boolean {
    return true;
  }
}
