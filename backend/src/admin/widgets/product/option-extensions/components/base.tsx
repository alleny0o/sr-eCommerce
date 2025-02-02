// ui
import { Container, Heading, Tooltip } from "@medusajs/ui";
import { InformationCircle } from "@medusajs/icons";

type BaseProps = {
  heading: string;
  children: React.ReactNode;
  drawer?: React.ReactNode;
};

export const Base = ({ heading, children, drawer }: BaseProps) => {
  return (
    <>
      <Container className="divide-y p-0 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h2">{heading}</Heading>
          <Tooltip content="Option extensions are the different ways a product option can be displayed on the storefront.">
            <InformationCircle />
          </Tooltip>
        </div>
        <>{children}</>
        <>{drawer}</>
      </Container>
    </>
  );
};
