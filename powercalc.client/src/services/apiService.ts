const API_BASE_URL = '/api';

export class ApiError extends Error {
    constructor(
        public status: number,
        message: string,
        public endpoint?: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    // Check if Content-Type header is already set
    const hasContentType = options.headers &&
        new Headers(options.headers).has('content-type');

    const config: RequestInit = {
        credentials: 'include',
        headers: {
            ...(hasContentType ? {} : { 'Content-Type': 'application/json' }),
            ...options.headers,
        },
        ...options,
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            const errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            throw new ApiError(response.status, errorMessage, endpoint);
        }

        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
            return await response.json();
        }

        // Handle non-JSON responses (plain text or numbers)
        const text = await response.text();

        // Try to parse as number if it looks like one
        const num = Number(text);
        if (!isNaN(num) && text.trim() !== '') {
            return num as T;
        }

        return text as T;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new ApiError(0, `Network error on ${endpoint}: ${errorMessage}`, endpoint);
    }
}