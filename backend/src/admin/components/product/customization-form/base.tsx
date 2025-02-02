// ui
import { Heading, Container, Tooltip } from "@medusajs/ui";
import { InformationCircle } from "@medusajs/icons";

type BaseProps = {
  heading: string;
  children: React.ReactNode;
  modal?: React.ReactNode;
};

const Base: React.FC<BaseProps> = ({ heading, children, modal }) => {
  return (
    <>
      <Container className="divide-y p-0 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h2">{heading}</Heading>
          <Tooltip content="The customization form allows users to provide specific details or preferences for customizing the product.">
            <InformationCircle />
          </Tooltip>
        </div>
        <>{children}</>
      </Container>

      {modal}
    </>
  );
};

export default Base;
