import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';

export const handleGhostApiError = (error: unknown): never => {
  if (error instanceof McpError) {
    throw error;
  }

  console.error('Ghost API Error:', error);
  throw new McpError(
    ErrorCode.InternalError,
    `Ghost API error: ${(error as Error).message}`
  );
};