// ui
import { DropdownMenu, IconButton } from "@medusajs/ui";

// icons
import { EllipsisHorizontal, CheckCircle,  XCircle } from "@medusajs/icons";

export const ActionsColumnDropdown = () => {
    return(
        <DropdownMenu>
            <DropdownMenu.Trigger>
                <IconButton size="small" variant="transparent">
                    <EllipsisHorizontal />
                </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
            <DropdownMenu.Item className="gap-x-2">
                <CheckCircle className="text-ui-fg-subtle" />
                Approve
            </DropdownMenu.Item>
            <DropdownMenu.Item className="gap-x-2">
                <XCircle className="text-ui-fg-subtle" />
                Reject
            </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu>
    );
};