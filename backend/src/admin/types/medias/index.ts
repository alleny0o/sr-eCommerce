export type Media = {
    id?: string;
    file_id: string;
    product_id: string;
    variant_id: string;
    name: string;
    size: number;
    mime_type: string;
    is_thumbnail: boolean;
    url: string;
    file?: File;
};