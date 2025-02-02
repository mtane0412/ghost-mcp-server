import { AuthorPaginationParams, ToolResponse } from '../types/index.js';
import { handleGhostApiError } from '../utils/error.js';
import { createGhostApi } from '../config/config.js';
import type { BrowseParams } from '@tryghost/admin-api';

const ghostApi = createGhostApi();

export const getAuthorsSchema = {
  name: 'get_authors',
  description: '著者一覧を取得',
  inputSchema: {
    type: 'object',
    properties: {
      limit: {
        type: 'number',
        description: '取得する著者数(デフォルト: 10)',
        minimum: 1,
        maximum: 100
      },
      page: {
        type: 'number',
        description: 'ページ番号(デフォルト: 1)',
        minimum: 1
      },
      order: {
        type: 'string',
        description: '並び順(デフォルト: name ASC)',
        enum: [
          'name ASC',
          'name DESC',
          'created_at DESC',
          'created_at ASC',
          'slug ASC',
          'slug DESC'
        ]
      },
      include: {
        type: 'string',
        description: '含める関連データ',
        enum: ['count.posts']
      },
      filter: {
        type: 'string',
        description: 'フィルター条件(例: slug:john)'
      }
    }
  },
};

export const getAuthors = async ({ 
  limit = 10, 
  page = 1,
  order,
  include,
  filter
}: AuthorPaginationParams): Promise<ToolResponse> => {
  try {
    const params: BrowseParams = { limit, page };
    
    if (order) params.order = order;
    if (include) params.include = include;
    if (filter) params.filter = filter;

    const authors = await ghostApi.users.browse(params);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(authors, null, 2),
        },
      ],
    };
  } catch (error) {
    throw handleGhostApiError(error);
  }
};