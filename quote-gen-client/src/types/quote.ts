export interface MockQuote {
    quote: string;
    author: string;
}

export interface BaseQuote extends MockQuote {
    id: number;
    category?: string;
    created_at: string;
}