import { defineWidgetConfig } from "@medusajs/admin-sdk";

// props
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types";

// js sdk
import { sdk } from "../../../lib/config";

// react
import { useEffect, useState } from "react";

// context
import { ExtensionsContext } from "./context/extensions-context";

// tanstack query
import { useQuery } from "@tanstack/react-query";

// components
import { InfoTable } from "./components/info-table";
import { Base } from "./components/base";

// types
import { OptionExtension, OptionExtensionType } from "../../../types/option-extension";
import { optionsMatch, setExtensionsUtil } from "./utils/utils";

// ui
import { Badge } from "@medusajs/ui";

const OptionExtensionsWidget = ({ data }: DetailWidgetProps<AdminProduct>) => {
  const product_id = data.id;
  const options = data.options;

  // Serialize options to include in queryKey
  const optionsKey = JSON.stringify(options);

  // extensions state
  const [extensions, setExtensions] = useState<OptionExtension[]>([]);

  // fetch error state
  const [fetchError, setFetchError] = useState(false);
  const [isExtensionsSet, setIsExtensionsSet] = useState(false);

  // useQuery to gather extensions
  const {
    data: extensionData,
    isLoading,
    error,
    isFetched,
    isSuccess,
  } = useQuery({
    queryKey: ["option-extensions", product_id, optionsKey],
    queryFn: () =>
      sdk.client.fetch<{ option_extensions: OptionExtensionType[] }>(`/admin/product_option-extensions/product/${product_id}`),
    refetchOnMount: "always",
  });

  // Reset state when options change
  useEffect(() => {
    setExtensions([]);
    setIsExtensionsSet(false);
    setFetchError(false);
  }, [options]);

  // Set extensions when extensionData is fetched
  useEffect(() => {
    if (extensionData && isSuccess) {
      try {
        setExtensionsUtil(extensionData, setExtensions);
        setIsExtensionsSet(true);
      } catch (e) {
        setFetchError(true);
      }
    }
  }, [extensionData, isSuccess]);

  if (isLoading || !isFetched || !isExtensionsSet) {
    return (
      <Base heading="Option Extensions">
        <div className="flex justify-center items-center min-h-32">
          <div className="loader border-t-2 rounded-full border-gray-500 bg-gray-300 animate-spin aspect-square w-10 flex justify-center items-center text-yellow-700"></div>
        </div>
      </Base>
    );
  }

  if (error || fetchError) {
    return (
      <Base heading="Option Extensions">
        <div className="flex justify-center items-center min-h-32">
          <Badge size="base" color="red">
            ERROR: Failed to retrieve option extensions!
          </Badge>
        </div>
      </Base>
    );
  }

  if (!optionsMatch(options, extensions)) {
    console.log(options, extensions);
    return (
      <Base heading="Option Extensions">
        <div className="flex flex-col justify-center items-center min-h-32 space-y-2">
          <Badge size="base" color="orange">
            WARNING: Extensions do not match options!
          </Badge>
          <p className="w-[90%] text-center text-xs text-gray-600">
            Extensions and options are not in sync. If you see this multple times, let the developer know.
          </p>
        </div>
      </Base>
    );
  }

  return (
    <ExtensionsContext.Provider value={extensions}>
      <Base heading="Option Extensions">
        {extensions.length > 0 ? (
          <InfoTable />
        ) : (
          <div className="flex justify-center items-center min-h-32">
            <Badge size="base" color="grey">
              No extensions available. Create an option first!
            </Badge>
          </div>
        )}
      </Base>
    </ExtensionsContext.Provider>
  );
};

export const config = defineWidgetConfig({
  zone: "product.details.side.before",
});

export default OptionExtensionsWidget;
