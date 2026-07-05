export declare function successResponse<T>(title: string, message: string, data?: T): {
    title: string;
    message: string;
    data: T | undefined;
};
export declare function errorResponse(title: string, message: string): {
    title: string;
    message: string;
};
export declare function responseData<T>(response: T | {
    data?: T;
}): T;
