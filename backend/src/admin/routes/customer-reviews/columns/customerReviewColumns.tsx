// column utils
import { createDataTableColumnHelper } from "@medusajs/ui";

// ui
import { Badge } from "@medusajs/ui";

// types
import { ReviewStatus } from "../../../../modules/customer-review/types";
import { CustomerReview } from "../hooks/useCustomerReviews";

// components
import { ActionsColumnDropdown } from "../components/ActionsColumnDropdown";

const columnHelper = createDataTableColumnHelper<CustomerReview>();

export const customerReviewColumns = [
  columnHelper.accessor("id", { header: "ID" }),
  columnHelper.accessor("title", { header: "Title" }),
  columnHelper.accessor("comment", { header: "Comment" }),
  columnHelper.accessor("rating", { header: "Rating" }),
  columnHelper.accessor("recommend", { header: "Recommend" }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue();
      return (
        <>
          {status === ReviewStatus.APPROVED && <Badge color="green">Approved</Badge>}
          {status === ReviewStatus.PENDING && <Badge color="grey">Pending</Badge>}
          {status === ReviewStatus.REJECTED && <Badge color="red">Rejected</Badge>}
        </>
      );
    },
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: () => <ActionsColumnDropdown/>,
  }),
];
