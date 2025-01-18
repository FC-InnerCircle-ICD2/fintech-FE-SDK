import ky, { type Options } from 'ky';
import { API_BASE_URL } from '../config/api-endpoint';
import { handleError } from '../error/handle-error';

export type Response<S> = {
  code: string;
  data: S;
  message?: string;
};

export type HttpClient = {
  get: <S>(url: string, options?: Options) => Promise<Response<S>>;
  post: <Q, S>(url: string, body: Q, options?: Options) => Promise<Response<S>>;
  put: <Q, S>(url: string, body: Q, options?: Options) => Promise<Response<S>>;
  delete: <S>(url: string, options?: Options) => Promise<Response<S>>;
};

export const createHttpClient = (options?: Options): HttpClient => {
  const { ...kyOptions } = options ?? {};

  const mergedHooks = {
    beforeRequest: [
      ...(kyOptions.hooks?.beforeRequest ?? []),
      ...(defaultHooks?.beforeRequest ?? []),
    ],
    afterResponse: [
      ...(kyOptions.hooks?.afterResponse ?? []),
      ...(defaultHooks?.afterResponse ?? []),
    ],
  };

  const httpClient = ky.create({
    prefixUrl: options?.prefixUrl ?? API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      ...kyOptions.headers,
    },
    credentials: 'include',
    ...kyOptions,
    hooks: mergedHooks,
  });

  return {
    get: async <S>(url: string, options?: Options): Promise<Response<S>> => {
      try {
        return await httpClient.get(url, options).json<Response<S>>();
      } catch (error) {
        return handleError(error);
      }
    },

    post: async <Q, S>(
      url: string,
      body: Q,
      options?: Options,
    ): Promise<Response<S>> => {
      try {
        return await httpClient
          .post(url, { json: body, ...options })
          .json<Response<S>>();
      } catch (error) {
        return handleError(error);
      }
    },

    put: async <Q, S>(
      url: string,
      body: Q,
      options?: Options,
    ): Promise<Response<S>> => {
      try {
        return await httpClient
          .put(url, { json: body, ...options })
          .json<Response<S>>();
      } catch (error) {
        return handleError(error);
      }
    },

    delete: async <S>(url: string, options?: Options): Promise<Response<S>> => {
      try {
        return await httpClient.delete(url, options).json<Response<S>>();
      } catch (error) {
        return handleError(error);
      }
    },
  };
};

const defaultHooks: Options['hooks'] = {
  beforeRequest: [],
  afterResponse: [
    async (_request, _options, response) => {
      if (response.status === 401) {
        console.warn('Unauthorized - redirecting to login...');
      }
    },
  ],
  beforeError: [],
  beforeRetry: [],
};
