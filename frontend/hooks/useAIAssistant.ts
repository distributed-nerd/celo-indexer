import { useState } from 'react';
import { runAIQuery } from '../lib/api';

export interface AIResponse {
  success: boolean;
  message: string;
  data?: any;
  queryType?: 'address' | 'informational';
  fields?: string[] | 'all';
  endPoint?: string;
}

export interface ProcessedResponse {
  text: string;
  data?: any;
  endpoint?: string;
}

export function useAIAssistant() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendQuery = async (message: string): Promise<AIResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await runAIQuery(message);
      return result as AIResponse;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const processResults = (response: AIResponse): ProcessedResponse => {
    if (!response.success) {
      return { text: response.message || 'Failed to process request' };
    }

    if (response.queryType === 'informational') {
      return {
        text: response.data?.response || response.message || 'No information available',
      };
    }

    if (response.queryType === 'address') {
      const count = Array.isArray(response.data) ? response.data.length : 0;
      return {
        text: count > 0
          ? `Found ${count} transfer${count !== 1 ? 's' : ''} for this address.`
          : 'No transfers found for this address.',
        data: Array.isArray(response.data) ? response.data : undefined,
        endpoint: response.endPoint,
      };
    }

    return {
      text: response.message || 'Received response from AI assistant',
      data: response.data,
    };
  };

  return { sendQuery, processResults, isLoading, error };
}
