// icons
import { ExclamationCircle } from "@medusajs/icons";

const CustomEmptyState = () => {
  return (
    <div className="flex flex-col items-center gap-y-3">
      <ExclamationCircle className="text-ui-fg-subtle" />

      <div className="flex flex-col items-center gap-y-1">
        <p className="font-medium font-sans txt-compact-small">No reviews</p>
        <p className="font-normal font-sans txt-small text-ui-fg-muted">No one has written a review</p>
      </div>
    </div>
  );
};

export default CustomEmptyState;
