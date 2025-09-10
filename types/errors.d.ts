// types/errors.ts
export interface ValidationErrorDetail {
    path: string;
    message: string;
}

export interface SubmitContentResult {
    success?: string;
    error?: string;
    details?: ValidationErrorDetail[];
    content?: any; // You can replace `any` with your Content type if available
}
