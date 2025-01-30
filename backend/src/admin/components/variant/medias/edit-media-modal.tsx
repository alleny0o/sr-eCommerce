// ui
import { FocusModal, Button, Prompt } from "@medusajs/ui";

// types
import { Media } from "../../../types/medias";

// components
import { Dropzone } from "./dropzone";
import { MediaItem } from "./media-item";

// hooks
import { useEditMediaModal } from "./hooks/use-edit-media-modal";

// dnd-kit imports
import { closestCorners, DndContext, DragOverlay, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, rectSortingStrategy, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";

// context
import { useVariantContext } from "../../../widgets/variant/context/context";

type EditModalProps = {
  medias: Media[];
  setMedias: (medias: Media[]) => void;
};

export const EditMediaModal = ({ medias, setMedias }: EditModalProps) => {
  const variant = useVariantContext();
  const variantId = variant.variantId;
  const productId = variant.productId;
  const {
    isOpen,
    setIsOpen,
    editedMedias,
    setEditedMedias,
    showConfirmPrompt,
    setShowConfirmPrompt,
    isSaving,
    handleSave,
    handleCancel,
    confirmCancel,
    handleDelete,
    handleThumbnail,
    activeId,
    setActiveId,
  } = useEditMediaModal(variantId, productId, medias, setMedias);

  // Define sensors outside of the component to avoid re-creation on every render
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end event
  const getTaskPos = (id: string) => {
    return editedMedias.findIndex((m) => m.file_id === id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null); // Clear activeId if there's no target
      return;
    }

    if (active.id === over.id) {
      setActiveId(null); // Clear activeId if dropped on the same item
      return;
    }

    setEditedMedias((medias) => {
      const originalPos = getTaskPos(active.id as string);
      const newPos = getTaskPos(over.id as string);

      if (originalPos === -1 || newPos === -1) return medias;

      return arrayMove(medias, originalPos, newPos);
    });

    setActiveId(null); // Clear activeId after handling drag end
  };

  return (
    <>
      <FocusModal
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleCancel();
          } else {
            setIsOpen(true);
          }
        }}
      >
        <FocusModal.Trigger asChild>
          <Button size="small" variant="secondary">
            Edit
          </Button>
        </FocusModal.Trigger>
        <FocusModal.Content>
          <FocusModal.Header></FocusModal.Header>
          <FocusModal.Body
            aria-labelledby="dialog-title"
            aria-describedby="dialog-description"
            className="flex-1 flex flex-col overflow-hidden"
          >
            <p id="dialog-description" className="sr-only">
              In this dialog, you can edit, rearrange, or delete media items. You can also upload new media.
            </p>
            <div className="flex size-full flex-col-reverse lg:grid lg:grid-cols-[1fr_560px]">
              <div className="bg-ui-bg-subtle size-full overflow-auto">
                <DndContext
                  sensors={sensors}
                  onDragEnd={handleDragEnd}
                  onDragStart={({ active }) => setActiveId(active.id as string)}
                  onDragCancel={() => setActiveId(null)}
                  collisionDetection={closestCorners}
                >
                  <SortableContext items={editedMedias.map((m) => m.file_id)} strategy={rectSortingStrategy}>
                    <div className="grid h-fit auto-rows-auto grid-cols-3 sm:grid-cols-4 gap-6 p-6">
                      {editedMedias.map((media) => (
                        <MediaItem
                          key={media.file_id}
                          id={media.file_id}
                          media={media}
                          onDelete={handleDelete}
                          onThumbnail={handleThumbnail}
                          isOverlay={false}
                          isActive={media.file_id === activeId}
                        />
                      ))}
                    </div>
                  </SortableContext>
                  <DragOverlay>
                    {activeId ? (
                      <MediaItem
                        id={activeId}
                        media={editedMedias.find((m) => m.file_id === activeId)!}
                        onDelete={handleDelete}
                        onThumbnail={handleThumbnail}
                        isOverlay={true}
                        isActive={false}
                      />
                    ) : null}
                  </DragOverlay>
                </DndContext>
              </div>
              <div className="bg-ui-bg-base overflow-auto border-b px-6 py-4 lg:border-b-0 lg:border-l">
                <Dropzone editedMedias={editedMedias} setEditedMedias={setEditedMedias} />
              </div>
            </div>
          </FocusModal.Body>
          <FocusModal.Footer className="flex justify-end space-x-2">
            <Button size="small" variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button size="small" onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </FocusModal.Footer>
        </FocusModal.Content>
      </FocusModal>

      {/* Confirmation Prompt for Unsaved Changes */}
      <Prompt open={showConfirmPrompt} onOpenChange={setShowConfirmPrompt}>
        <Prompt.Content>
          <Prompt.Header>
            <Prompt.Title>Are you sure you want to leave this form?</Prompt.Title>
            <Prompt.Description>You have unsaved changes that will be lost if you exit this form.</Prompt.Description>
          </Prompt.Header>
          <Prompt.Footer>
            <Button size="small" variant="secondary" onClick={() => setShowConfirmPrompt(false)}>
              Cancel
            </Button>
            <Button size="small" onClick={confirmCancel}>
              Continue
            </Button>
          </Prompt.Footer>
        </Prompt.Content>
      </Prompt>
    </>
  );
};
