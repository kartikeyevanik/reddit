// types/server-actions.ts
export interface ValidationError {
  path: string;
  message: string;
}

export interface SubmitContentState {
  error?: string;
  success?: string;
  details?: ValidationError[];
  content?: any;
}