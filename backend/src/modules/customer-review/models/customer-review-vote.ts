import { model } from "@medusajs/framework/utils";
import CustomerReview from "./customer-review";
import { ReviewVote } from "../types";

const CustomerReviewVote = model.define("customer_review_vote", {
    id: model.id().primaryKey(),
    customer_id: model.text(),
    vote: model.enum(ReviewVote),

    customer_review: model.belongsTo(() => CustomerReview, {
        mappedBy: "votes",
    }),
});

export default CustomerReviewVote;