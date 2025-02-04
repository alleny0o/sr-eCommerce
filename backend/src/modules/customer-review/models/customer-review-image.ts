import { model } from "@medusajs/framework/utils";
import CustomerReview from "./customer-review";

const CustomerReviewImage = model.define("customer_review_image", {
    id: model.id().primaryKey(),
    file_id: model.text().unique(),
    name: model.text(),
    size: model.number(),
    mime_type: model.text(),
    url: model.text(),

    customer_review: model.belongsTo(() => CustomerReview, {
        mappedBy: "images",
    }),
});

export default CustomerReviewImage;