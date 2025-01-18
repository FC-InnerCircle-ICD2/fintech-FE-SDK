import { HTTPError } from 'ky';

export const handleError = (error: unknown): never => {
  if (error instanceof HTTPError) {
    console.error(`HTTP Error: ${error.response.status}`, error);
  } else {
    console.error('Unexpected Error:', error);
  }
  throw error;
};
