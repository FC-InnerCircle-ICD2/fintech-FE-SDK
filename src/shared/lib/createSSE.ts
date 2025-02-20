import { EventSourcePolyfill } from 'event-source-polyfill';

type EventSourceState = 'CONNECTING' | 'OPEN' | 'CLOSED';

type EventSourceOptions = {
  withCredentials?: boolean;
  headers?: Record<string, string>;
  onStateChange?: (state: EventSourceState) => void;
  maxRetries?: number;
};

type EventHandlers<T> = {
  onMessage?: (event: MessageEvent) => void;
  onError?: (error: Event) => void;
  onOpen?: (event: Event) => void;
  eventHandlers?: Record<string, (data: T) => void>;
};

const EVENT_SOURCE_STATES: Record<number, EventSourceState> = {
  [EventSource.CONNECTING]: 'CONNECTING',
  [EventSource.OPEN]: 'OPEN',
  [EventSource.CLOSED]: 'CLOSED',
} as const;

export const createSSE = <T>(
  url: string,
  options: EventSourceOptions = {},
  handlers: EventHandlers<T> = {},
) => {
  const { withCredentials, onStateChange, maxRetries = 3, headers } = options;
  let retryCount = 0;
  let eventSource: EventSource | null = null;

  const handleStateChange = () => {
    if (!eventSource) return;
    const currentState = EVENT_SOURCE_STATES[eventSource.readyState];
    onStateChange?.(currentState);
  };

  const connect = () => {
    eventSource = new EventSourcePolyfill(url, {
      withCredentials,
      headers,
    });

    eventSource.onopen = (event) => {
      retryCount = 0;
      handleStateChange();
      handlers.onOpen?.(event);
    };

    eventSource.onmessage = (event) => {
      handlers.onMessage?.(event);
    };

    eventSource.onerror = (error) => {
      handleStateChange();

      if (retryCount < maxRetries) {
        retryCount++;
        console.log(`재연결 시도 ${retryCount}/${maxRetries}`);

        eventSource?.close();

        const retryDelay = Math.min(1000 * Math.pow(2, retryCount - 1), 10000); // 지수 백오프 적용, 최대 10초

        setTimeout(() => {
          connect();
        }, retryDelay);
      } else {
        console.error('최대 재시도 횟수 초과');
        handlers.onError?.(error);
        eventSource?.close();
      }

      handlers.onError?.(error);
    };

    if (handlers.eventHandlers) {
      Object.entries(handlers.eventHandlers).forEach(
        ([eventName, callback]) => {
          addEventHandler<T>(eventSource!, eventName, callback);
        },
      );
    }
  };

  connect();

  return {
    close: () => {
      eventSource?.close();
    },
    getState: () =>
      eventSource ? EVENT_SOURCE_STATES[eventSource.readyState] : 'CLOSED',
    addEventListener: <K>(eventName: string, callback: (data: K) => void) => {
      if (!eventSource) return () => {};

      return addEventHandler<K>(eventSource, eventName, callback);
    },
  };
};

const addEventHandler = <T>(
  eventSource: EventSource,
  eventName: string,
  callback: (data: T) => void,
) => {
  const handler = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data) as T;
      callback(data);
    } catch (error) {
      console.error(
        `이벤트 데이터 파싱 실패: ${eventName}`,
        error instanceof Error ? error.message : error,
      );
    }
  };

  eventSource.addEventListener(eventName, handler as EventListener);

  return () => {
    eventSource.removeEventListener(eventName, handler as EventListener);
  };
};
