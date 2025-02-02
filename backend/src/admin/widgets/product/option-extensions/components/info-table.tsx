// ui
import { Badge, DropdownMenu, IconButton, Table } from "@medusajs/ui";
import { EllipsisHorizontal, PencilSquare } from "@medusajs/icons";

// state
import { useState } from "react";

// context
import { useExtensionsContext } from "../context/extensions-context";

// types
import { OptionExtension } from "../../../../types/option-extension";
import { capitalize } from "../utils/utils";
import { UpdateExtensionDrawer } from "../../../../components/product/option-extensions/update-extension-drawer";

export const InfoTable = () => {
    const extensions = useExtensionsContext();

    // state
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [extension, setExtension] = useState<OptionExtension | null>(null);
  
    const isDefaultExtension = (ext: OptionExtension) => {
      return ext.id === extensions[0].id;
    };
  
    const handleEditClick = (ext: OptionExtension) => {
      if (!isDefaultExtension(ext)) {
        setExtension(ext);
        setDrawerOpen(true);
      } else {
        setDrawerOpen(true);
      }
    };

  return (
    <>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Cell>Option Title</Table.Cell>
            <Table.Cell>Display Type</Table.Cell>
            <Table.Cell></Table.Cell>
          </Table.Row>
        </Table.Header>
        <Table.Body className="border-b-0">
          {extensions.map((extension, index) => {
            const is_last = index === extensions.length - 1;

            return (
              <Table.Row key={extension.id} className={`${is_last ? "border-b-0" : ""}`}>
                <Table.Cell>{extension.option_title}</Table.Cell>
                <Table.Cell>
                  <Badge size="2xsmall">{capitalize(extension.display_type[0]) + extension.display_type.slice(1)}</Badge>
                </Table.Cell>
                <Table.Cell>
                  <DropdownMenu>
                    <DropdownMenu.Trigger asChild>
                      <IconButton size="small" variant="transparent">
                        <EllipsisHorizontal />
                      </IconButton>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                      <DropdownMenu.Item
                        className="gap-x-2"
                        onClick={() => {
                            handleEditClick(extension);
                        }}
                      >
                        <PencilSquare className="text-ui-fg-subtle" />
                        Edit
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>

      {/* Drawer */}
      <UpdateExtensionDrawer extension={extension || extensions[0]} open={drawerOpen} setOpen={setDrawerOpen} />
    </>
  );
};
