import {
  GhostPage,
  PagePaginationParams,
  PostFormat,
  PostInclude,
  ToolResponse,
  CreatePageParams,
  UpdatePageParams
} from '../types/index.js';
import { handleGhostApiError } from '../utils/error.js';
import { createGhostApi } from '../config/config.js';
import type { BrowseParams, ReadParams } from '@tryghost/admin-api';

const ghostApi = createGhostApi();

export const getPagesSchema = {
  name: 'get_pages',
  description: 'Get a list of pages',
  inputSchema: {
    type: 'object',
    properties: {
      limit: {
        type: 'number',
        description: '取得するページ数(デフォルト: 10)',
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
        description: '並び順(デフォルト: published_at DESC)',
        enum: [
          'published_at DESC',
          'published_at ASC',
          'created_at DESC',
          'created_at ASC',
          'updated_at DESC',
          'updated_at ASC'
        ]
      },
      formats: {
        type: 'array',
        description: '取得するコンテンツフォーマット',
        items: {
          type: 'string',
          enum: ['html', 'mobiledoc', 'lexical']
        }
      },
      include: {
        type: 'array',
        description: '含める関連データ',
        items: {
          type: 'string',
          enum: ['authors', 'tags']
        }
      }
    }
  },
};

export const getPageSchema = {
  name: 'get_page',
  description: '特定のページを取得',
  inputSchema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'ページのID'
      },
      formats: {
        type: 'array',
        description: '取得するコンテンツフォーマット',
        items: {
          type: 'string',
          enum: ['html', 'mobiledoc', 'lexical']
        }
      },
      include: {
        type: 'array',
        description: '含める関連データ',
        items: {
          type: 'string',
          enum: ['authors', 'tags']
        }
      }
    },
    required: ['id']
  },
};

export const createPageSchema = {
  name: 'create_page',
  description: '新しいページを作成',
  inputSchema: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'ページのタイトル'
      },
      html: {
        type: 'string',
        description: 'HTML形式のコンテンツ'
      },
      lexical: {
        type: 'string',
        description: 'Lexical形式のコンテンツ'
      },
      status: {
        type: 'string',
        description: 'ページの状態',
        enum: ['published', 'draft', 'scheduled']
      },
      visibility: {
        type: 'string',
        description: '公開範囲',
        enum: ['public', 'members', 'paid', 'tiers']
      },
      published_at: {
        type: 'string',
        description: '公開日時(スケジュール投稿用)'
      },
      tags: {
        type: 'array',
        description: 'タグのID配列',
        items: {
          type: 'string'
        }
      },
      authors: {
        type: 'array',
        description: '著者のID配列',
        items: {
          type: 'string'
        }
      },
      featured: {
        type: 'boolean',
        description: 'おすすめページとして設定'
      }
    },
    required: ['title']
  }
};

export const updatePageSchema = {
  name: 'update_page',
  description: 'ページを更新',
  inputSchema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'ページのID'
      },
      title: {
        type: 'string',
        description: 'ページのタイトル'
      },
      html: {
        type: 'string',
        description: 'HTML形式のコンテンツ'
      },
      lexical: {
        type: 'string',
        description: 'Lexical形式のコンテンツ'
      },
      status: {
        type: 'string',
        description: 'ページの状態',
        enum: ['published', 'draft', 'scheduled']
      },
      visibility: {
        type: 'string',
        description: '公開範囲',
        enum: ['public', 'members', 'paid', 'tiers']
      },
      published_at: {
        type: 'string',
        description: '公開日時(スケジュール投稿用)'
      },
      tags: {
        type: 'array',
        description: 'タグのID配列(既存のタグは置換)',
        items: {
          type: 'string'
        }
      },
      authors: {
        type: 'array',
        description: '著者のID配列(既存の著者は置換)',
        items: {
          type: 'string'
        }
      },
      featured: {
        type: 'boolean',
        description: 'おすすめページとして設定'
      }
    },
    required: ['id']
  }
};

export const deletePageSchema = {
  name: 'delete_page',
  description: 'ページを削除',
  inputSchema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'ページのID'
      }
    },
    required: ['id']
  }
};

export const getPageBySlugSchema = {
  name: 'get_page_by_slug',
  description: 'スラッグでページを取得',
  inputSchema: {
    type: 'object',
    properties: {
      slug: {
        type: 'string',
        description: 'ページのスラッグ'
      },
      formats: {
        type: 'array',
        description: '取得するコンテンツフォーマット',
        items: {
          type: 'string',
          enum: ['html', 'mobiledoc', 'lexical']
        }
      },
      include: {
        type: 'array',
        description: '含める関連データ',
        items: {
          type: 'string',
          enum: ['authors', 'tags']
        }
      }
    },
    required: ['slug']
  }
};

export const getPages = async ({ limit = 10, page = 1, order, formats, include }: PagePaginationParams): Promise<ToolResponse> => {
  try {
    const params: BrowseParams = { limit, page };
    
    if (order) params.order = order;
    if (formats?.length) params.formats = formats.join(',');
    if (include?.length) params.include = include.join(',');

    const pages = await ghostApi.pages.browse(params);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(pages, null, 2),
        },
      ],
    };
  } catch (error) {
    throw handleGhostApiError(error);
  }
};

export const getPage = async ({ 
  id, 
  formats, 
  include 
}: { 
  id: string; 
  formats?: PostFormat[]; 
  include?: PostInclude[]; 
}): Promise<ToolResponse> => {
  try {
    const params: ReadParams = { id };
    
    if (formats?.length) params.formats = formats.join(',');
    if (include?.length) params.include = include.join(',');

    const page = await ghostApi.pages.read(params);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(page, null, 2),
        },
      ],
    };
  } catch (error) {
    throw handleGhostApiError(error);
  }
};

export const createPage = async (params: CreatePageParams): Promise<ToolResponse> => {
  try {
    const page = await ghostApi.pages.add(params);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(page, null, 2),
        },
      ],
    };
  } catch (error) {
    throw handleGhostApiError(error);
  }
};

export const updatePage = async ({ id, ...params }: { id: string } & UpdatePageParams): Promise<ToolResponse> => {
  try {
    // 現在のページの情報を取得
    const currentPage = await ghostApi.pages.read({ id });
    
    // 現在のupdated_atを使用
    params.updated_at = currentPage.updated_at || new Date().toISOString();
    
    const page = await ghostApi.pages.edit({ id, ...params });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(page, null, 2),
        },
      ],
    };
  } catch (error) {
    throw handleGhostApiError(error);
  }
};

export const deletePage = async ({ id }: { id: string }): Promise<ToolResponse> => {
  try {
    await ghostApi.pages.delete({ id });
    return {
      content: [
        {
          type: 'text',
          text: 'ページが正常に削除されました',
        },
      ],
    };
  } catch (error) {
    throw handleGhostApiError(error);
  }
};

export const getPageBySlug = async ({
  slug,
  formats,
  include
}: {
  slug: string;
  formats?: PostFormat[];
  include?: PostInclude[];
}): Promise<ToolResponse> => {
  try {
    const params: BrowseParams = { filter: `slug:${slug}` };
    
    if (formats?.length) params.formats = formats.join(',');
    if (include?.length) params.include = include.join(',');

    const [page] = await ghostApi.pages.browse(params);
    if (!page) {
      throw new Error(`スラッグ "${slug}" のページが見つかりませんでした`);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(page, null, 2),
        },
      ],
    };
  } catch (error) {
    throw handleGhostApiError(error);
  }
};
