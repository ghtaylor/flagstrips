export interface ApiResponseCollection<T> {
    results: T[];
}

export interface ApiResponseError {
    message: string;
    additionalData?: unknown;
}
