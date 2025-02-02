import { createContext, useContext } from "react";
import { OptionExtension } from "../../../../types/option-extension";

export const ExtensionsContext = createContext<OptionExtension[] | undefined>(undefined);

export function useExtensionsContext() {
    const extensions = useContext(ExtensionsContext);

    if (extensions === undefined) {
        throw new Error("useExtensionsContext must be used within a ExtensionsContext");
    }

    return extensions;
};