import { createContext, useContext } from "react";

export type VariantID = {
    variantId: string;
    productId: string;
};

export const VariantContext = createContext<VariantID | undefined>(undefined);

export function useVariantContext() {
    const variant = useContext(VariantContext);

    if (variant === undefined) {
        throw new Error("must be used within provider");
    };

    return variant;
};
