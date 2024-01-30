import { useCallback } from 'react';
import { useErrorState } from '../hooks/ErrorContext';

export interface FetchOptions {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: BodyInit | null;
    headers?: HeadersInit;
}

export interface ErrorResponse {
    message: string;
    status: number;
}

export type FetchResponse<T> =
    | {
          data: T;
          error?: never;
      }
    | {
          error: ErrorResponse;
          data?: never;
      };

export const useFetch = () => {
    const { showError } = useErrorState();

    const fetchApi: <T>(
        url: string,
        options: FetchOptions
    ) => Promise<FetchResponse<T>> = useCallback(
        async (url, options) => {
            try {
                const response = await fetch(url, options);

                if (!response.ok) {
                    const errorData: ErrorResponse = await response.json();

                    showError(errorData.message || 'An error occurred.');

                    return { error: errorData };
                } else {
                    const data = await response.json();

                    return { data };
                }
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? {
                              message: error.message,
                              status: 500,
                          }
                        : {
                              message: 'An unexpected error occurred.',
                              status: 500,
                          };

                showError(`${errorMessage.message}, ${errorMessage.status}`);

                return { error: errorMessage };
            }
        },

        [showError]
    );

    return { fetchApi };
};
