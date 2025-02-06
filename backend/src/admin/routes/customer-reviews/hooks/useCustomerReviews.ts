// useQuery
import { useQuery } from "@tanstack/react-query";

// sdk
import { sdk } from "../../../lib/config";

// types
import { ReviewStatus } from "../../../../modules/customer-review/types";

export type CustomerReview = {
  id: string;
  product_id: string;
  customer_id: string;
  rating: number;
  title: string;
  comment: string;
  recommend: boolean;
  status: ReviewStatus;
};

export type CustomerReviewsResponse = {
  reviews: CustomerReview[];
  count: number;
  limit: number;
  offset: number;
};

export const useCustomerReviews = (limit: number, offset: number) => {
  return useQuery<CustomerReviewsResponse>({
    queryKey: ["customer-reviews", limit, offset],
    queryFn: () =>
      sdk.client.fetch("/admin/customer-reviews", {
        query: { limit, offset },
      }),
  });
};
