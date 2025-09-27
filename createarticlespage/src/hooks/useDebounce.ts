import { useCallback, useRef } from 'react';

/**
 * Hook personalizado para implementar debounce
 * 
 * @param callback - Função a ser executada após o delay
 * @param delay - Tempo de delay em milissegundos (padrão: 300ms)
 * @returns Função debounced
 */
export function useDebounce<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      // Limpa o timeout anterior se existir
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
        timeoutRef.current = null;
      }, delay);
    },
    [callback, delay]
  );

  return debouncedCallback;
}

/**
 * Hook específico para debounce de requisições à API
 * 
 * @param apiFunction - Função da API a ser executada
 * @param delay - Tempo de delay em milissegundos (padrão: 500ms para APIs)
 * @returns Objeto com função debounced e estado de loading
 */
export function useApiDebounce<T extends (...args: unknown[]) => Promise<unknown>>(
  apiFunction: T,
  delay: number = 500
) {
  const isLoadingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedApiCall = useCallback(
    async (...args: Parameters<T>): Promise<void> => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (isLoadingRef.current) {
        return;
      }

      return new Promise((resolve) => {
        timeoutRef.current = setTimeout(async () => {
          try {
            isLoadingRef.current = true;
            await apiFunction(...args);
          } catch (error) {
            console.error('Erro na requisição à API:', error);
          } finally {
            isLoadingRef.current = false;
            timeoutRef.current = null;
            resolve();
          }
        }, delay);
      });
    },
    [apiFunction, delay]
  );

  const isLoading = useCallback(() => isLoadingRef.current, []);

  return {
    debouncedApiCall,
    isLoading
  };
}
