import { model } from "@medusajs/framework/utils";
import CustomerReviewImage from "./customer-review-image";
import CustomerReviewVote from "./customer-review-vote";
import { ReviewStatus } from "../types";

const CustomerReview = model
  .define("customer_review", {
    // Unique identifier for the customer review
    id: model.id().primaryKey(),

    // Associated product and customer identifiers
    product_id: model.text(),
    customer_id: model.text(),

    // Review details
    rating: model.number(),
    title: model.text(),
    comment: model.text(),
    recommend: model.boolean().default(true),

    // Review status with pre-defined enum values
    // You can adjust these values as needed for your application logic.
    status: model.enum(ReviewStatus).default(ReviewStatus.PENDING),

    // Check if the review is edited
    is_edited: model.boolean().default(false),

    // One-to-many relationship to images associated with the review
    images: model.hasMany(() => CustomerReviewImage, {
      mappedBy: "customer_review",
    }),

    // One-to-many relationship to votes associated with the review
    votes: model.hasMany(() => CustomerReviewVote, {
      mappedBy: "customer_review",
    }),

    // Aggregated vote counts
    total_upvotes: model.number().default(0),
    total_downvotes: model.number().default(0),
  })
  .cascades({
    // Automatically delete associated images and votes when the review is deleted
    delete: ["images", "votes"],
  });

export default CustomerReview;
