// ui
import { Drawer, Heading } from "@medusajs/ui";
import React from "react";

type DrawerBaseProps = {
    heading: string;
    open: boolean;
    openChange: (open: boolean) => void;
    footer?: React.ReactNode;
    children: React.ReactNode;
};

export const DrawerBase = ({ heading, open, openChange, footer, children }: DrawerBaseProps) => {
    return (
        <Drawer open={open} onOpenChange={(open) => openChange(open)}>
            <Drawer.Content>
                <Drawer.Header>
                    <Heading level="h1">{heading}</Heading>
                </Drawer.Header>
                <Drawer.Body className="flex flex-1 flex-col overflow-auto gap-y-4">
                    {children}
                </Drawer.Body>
                <Drawer.Footer>
                    {footer}
                </Drawer.Footer>
            </Drawer.Content>
        </Drawer>
    );
};