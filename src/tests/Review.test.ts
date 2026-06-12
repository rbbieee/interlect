import { Review } from "../models/Review";

describe("Review Model Class Testing", () => {
  let review: Review;

  beforeEach(() => {
    review = new Review(1, 5, "Excellent consultant experience!");
  });

  test("Constructor should correctly initialize Review attributes", () => {
    expect(review.reviewId).toBe(1);
    expect(review.rating).toBe(5);
    expect(review.comment).toBe("Excellent consultant experience!");
  });

  test("editReview should correctly modify comment and rating attributes", () => {
    review.editReview("Good experience.", 4);
    expect(review.comment).toBe("Good experience.");
    expect(review.rating).toBe(4);
  });
});
