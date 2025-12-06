declare module 'mammoth' {
    export function extractRawText(options: { arrayBuffer: ArrayBuffer }): Promise<{ value: string; messages: any[] }>;
    export function convertToHtml(options: { arrayBuffer: ArrayBuffer }): Promise<{ value: string; messages: any[] }>;
}
