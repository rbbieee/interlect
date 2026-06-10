export class Review {
  reviewId: number;
  rating: number;
  comment: string;

  constructor(reviewId: number, rating: number, comment: string) {
    this.reviewId = reviewId;
    this.rating = rating;
    this.comment = comment;
  }

  submitReview(): void {}

  editReview(comment: string, rating: number): void {
    this.comment = comment;
    this.rating = rating;
  }

  deleteReview(): void {}
}
