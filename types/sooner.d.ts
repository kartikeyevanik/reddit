declare module "sooner" {
    const toast: {
        success: (message: string) => void;
        error: (message: string) => void;
    };
    export { toast };
}
