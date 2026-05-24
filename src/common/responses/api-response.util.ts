export function successResponse<T>(title: string, message: string, data?: T) {
  return { title, message, data };
}

export function errorResponse(title: string, message: string) {
  return { title, message };
}

export function responseData<T>(response: T | { data?: T }): T {
  if (response && typeof response === 'object' && 'data' in response) {
    return response.data as T;
  }

  return response as T;
}
