export class Consultant {
  consultantId: number;
  name: string;
  expertise: string;
  rating: number;

  constructor(consultantId: number, name: string, expertise: string, rating: number) {
    this.consultantId = consultantId;
    this.name = name;
    this.expertise = expertise;
    this.rating = rating;
  }

  respondToChat(message: string): void {}

  updateRating(rating: number): void {}
}
