// pages/customer-reviews/index.tsx
import { useMemo, useState } from "react";
import { Container, Heading, DataTable, DataTablePaginationState, useDataTable } from "@medusajs/ui";
import { defineRouteConfig } from "@medusajs/admin-sdk";
import { StarSolid } from "@medusajs/icons";
import CustomEmptyState from "./components/CustomEmptyState";
import { customerReviewColumns } from "./columns/customerReviewColumns";
import { useCustomerReviews } from "./hooks/useCustomerReviews";

const CustomerReviewsPage = () => {
  const limit = 15;
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageIndex: 0,
    pageSize: limit,
  });

  const offset = useMemo(() => pagination.pageIndex * limit, [pagination, limit]);
  const { data, isLoading } = useCustomerReviews(limit, offset);

  const [search, setSearch] = useState<string>("");
  const shownReviews = useMemo(() => {
    if (!data) return [];
    return data.reviews.filter((review) => review.title.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const table = useDataTable({
    columns: customerReviewColumns,
    data: shownReviews,
    getRowId: (row) => row.id,
    rowCount: data?.count || 0,
    isLoading,
    pagination: {
      state: pagination,
      onPaginationChange: setPagination,
    },
    search: {
      state: search,
      onSearchChange: setSearch,
    },
  });

  return (
    <Container className="p-0 divide-y">
      <DataTable instance={table}>
        <DataTable.Toolbar className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
          <Heading>Customer Reviews</Heading>
          {!data || data.reviews.length === 0 ? null : <DataTable.Search placeholder="Search by title..." />}{" "}
        </DataTable.Toolbar>
        <DataTable.Table
          emptyState={{
            empty: { custom: <CustomEmptyState /> },
          }}
        />
        <DataTable.Pagination />
      </DataTable>
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Customer Reviews",
  icon: StarSolid,
});

export default CustomerReviewsPage;
