import { model } from "@medusajs/framework/utils";
import CustomerReviewImage from "./customer-review-image";
import CustomerReviewVote from "./customer-review-vote";

const CustomerReview = model.define("customer_review", {
    id: model.id().primaryKey(),
    product_id: model.text(),
    customer_id: model.text(),

    rating: model.number(),
    title: model.text(),
    comment: model.text(),
    recommend: model.boolean().default(true),

    images: model.hasMany(() => CustomerReviewImage, {
        mappedBy: "customer_review",
    }),
    votes: model.hasMany(() => CustomerReviewVote, {
        mappedBy: "customer_review",
    }),

    total_upvotes: model.number().default(0),
    total_downvotes: model.number().default(0),
}).cascades({
    delete: ["images", "votes"],
});

export default CustomerReview;