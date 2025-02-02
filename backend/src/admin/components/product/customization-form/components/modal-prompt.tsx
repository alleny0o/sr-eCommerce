import { Prompt, Button } from "@medusajs/ui";

type ModalPromptProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const ModalPrompt = ({ open, onClose, onConfirm }: ModalPromptProps) => {
  return (
    <Prompt open={open} onOpenChange={onClose}>
      <Prompt.Content>
        <Prompt.Header>
          <Prompt.Title>Are you sure you want to leave this form?</Prompt.Title>
          <Prompt.Description>You have unsaved changes that will be lost if you exit this form.</Prompt.Description>
        </Prompt.Header>
        <Prompt.Footer>
          <Prompt.Cancel>Cancel</Prompt.Cancel>
          <Button size="small" variant="primary" onClick={onConfirm}>
            Continue
          </Button>
        </Prompt.Footer>
      </Prompt.Content>
    </Prompt>
  );
};
