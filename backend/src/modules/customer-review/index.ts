import CustomerReviewModuleService from "./service";
import { Module } from "@medusajs/framework/utils";

export const CUSTOMER_REVIEW_MODULE = "customerReviewModuleService";

export default Module(CUSTOMER_REVIEW_MODULE, {
    service: CustomerReviewModuleService,
});