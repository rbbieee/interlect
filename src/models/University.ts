import { Program } from "./Program";

export class University {
  universityId: number;
  name: string;
  location: string;
  rating: number;
  tuition: number;

  constructor(universityId: number, name: string, location: string, rating: number, tuition: number) {
    this.universityId = universityId;
    this.name = name;
    this.location = location;
    this.rating = rating;
    this.tuition = tuition;
  }

  addProgram(program: Program): void {}

  removeProgram(programId: number): void {}

  calculateAverageRating(): number {
    return this.rating;
  }

  updateDetails(name: string, location: string, rating: number, tuition: number): void {
    this.name = name;
    this.location = location;
    this.rating = rating;
    this.tuition = tuition;
  }
}
