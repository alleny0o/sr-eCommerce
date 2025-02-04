import { MedusaService } from "@medusajs/framework/utils";
import CustomerReview from "./models/customer-review";
import CustomerReviewImage from "./models/customer-review-image";
import CustomerReviewVote from "./models/customer-review-vote";

class CustomerReviewModuleService extends MedusaService({
  CustomerReview,
  CustomerReviewImage,
  CustomerReviewVote,
}) {}

export default CustomerReviewModuleService;
