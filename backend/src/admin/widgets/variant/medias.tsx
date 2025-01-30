// widget config
import { defineWidgetConfig } from "@medusajs/admin-sdk";

// widget props
import { DetailWidgetProps, AdminProductVariant } from "@medusajs/framework/types";

// useQuery
import { useQuery } from "@tanstack/react-query";

// js sdk
import { sdk } from "../../lib/config";

// ui
import { Badge, Container, Heading, Tooltip } from "@medusajs/ui";
import { ThumbnailBadge, FaceSmile } from "@medusajs/icons";

// types
import { Media } from "../../types/medias";

// context
import { VariantContext } from "./context/context";

// components
import { EditMediaModal } from "../../components/variant/medias/edit-media-modal";
import { useEffect, useState } from "react";

// MediaDisplay Component
const MediaDisplay = ({ media }: { media: Media }) => {
  const isVideo = media.mime_type?.startsWith("video/");

  return (
    <div className="shadow-elevation-card-rest hover:shadow-elevation-card-hover transition-fg group relative aspect-square size-full overflow-hidden rounded-[8px] cursor-pointer">
      {isVideo ? (
        <video src={media.url} className="size-full object-cover" controls muted>
          Your browser does not support the video tag.
        </video>
      ) : (
        <>
          <img src={media.url} alt={media.name} className="size-full object-cover" />
          {media.is_thumbnail && (
            <div className="absolute left-2 top-2">
              <Tooltip content="Thumbnail">
                <ThumbnailBadge />
              </Tooltip>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Base Component
type BaseProps = {
  heading: string;
  modalContent?: React.ReactNode;
  children: React.ReactNode;
};

const Base: React.FC<BaseProps> = ({ heading, modalContent, children }) => {
  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{heading}</Heading>
        {modalContent}
      </div>
      {children}
    </Container>
  );
};

// VariantMediasWidget Component
const VariantMediasWidget = ({ data }: DetailWidgetProps<AdminProductVariant>) => {
  // medias state
  const [medias, setMedias] = useState<Media[]>([]);

  const {
    data: mediasData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["variant-medias", data.id],
    queryFn: () => sdk.client.fetch<{ medias: Media[] }>(`/admin/product-variant_medias/variant/${data.id}`),
    refetchOnMount: "always",
  });

  useEffect(() => {
    if (mediasData?.medias) {
      setMedias(mediasData.medias);
    }
  }, [mediasData]);

  if (isLoading) {
    return (
      <Base heading="Media">
        <div className="flex justify-center items-center min-h-48">
          <div className="loader border-t-2 rounded-full border-gray-500 bg-gray-300 animate-spin aspect-square w-10 flex justify-center items-center text-yellow-700"></div>
        </div>
      </Base>
    );
  }

  if (error || !data.product_id || !mediasData) {
    return (
      <Base heading="Media">
        <div className="flex justify-center items-center min-h-48">
          <Badge size="base" color="red">
            ERROR: Failed to retrieve media!
          </Badge>
        </div>
      </Base>
    );
  }

  return (
    <VariantContext.Provider value={{ variantId: data.id, productId: data.product_id }}>
      <Base heading="Media" modalContent={<EditMediaModal medias={medias} setMedias={setMedias} />}>
        {medias.length > 0 ? (
          <div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-4 px-6 py-4">
              {medias.map((media) => (
                <MediaDisplay key={media.file_id} media={media} />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center min-h-48">
            <Badge size="base" color="grey">
              Add your first media
              <FaceSmile className="ml-1" />
            </Badge>
          </div>
        )}
      </Base>
    </VariantContext.Provider>
  );
};

export const config = defineWidgetConfig({
  zone: "product_variant.details.after",
});

export default VariantMediasWidget;
