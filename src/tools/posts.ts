import {
  GhostPost,
  PostPaginationParams,
  PostFormat,
  PostInclude,
  SearchParams,
  ToolResponse,
  CreatePostParams,
  UpdatePostParams
} from '../types/index.js';
import { handleGhostApiError } from '../utils/error.js';
import { createGhostApi } from '../config/config.js';
import type { BrowseParams, ReadParams } from '@tryghost/admin-api';

const ghostApi = createGhostApi();

export const getPostsSchema = {
  name: 'get_posts',
  description: 'Get a list of blog posts',
  inputSchema: {
    type: 'object',
    properties: {
      limit: {
        type: 'number',
        description: '取得する記事数(デフォルト: 10)',
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

export const getPostSchema = {
  name: 'get_post',
  description: '特定の記事を取得',
  inputSchema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: '記事のID'
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

export const createPostSchema = {
  name: 'create_post',
  description: '新しい記事を作成',
  inputSchema: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: '記事のタイトル'
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
        description: '記事の状態',
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
        description: 'おすすめ記事として設定'
      },
      email_subject: {
        type: 'string',
        description: 'メール送信時の件名'
      },
      email_only: {
        type: 'boolean',
        description: 'メールのみの投稿'
      },
      newsletter: {
        type: 'boolean',
        description: 'メール送信を行うかどうか'
      }
    },
    required: ['title']
  }
};

export const updatePostSchema = {
  name: 'update_post',
  description: '記事を更新',
  inputSchema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: '記事のID'
      },
      title: {
        type: 'string',
        description: '記事のタイトル'
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
        description: '記事の状態',
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
        description: 'おすすめ記事として設定'
      },
      email_subject: {
        type: 'string',
        description: 'メール送信時の件名'
      },
      email_only: {
        type: 'boolean',
        description: 'メールのみの投稿'
      },
      newsletter: {
        type: 'boolean',
        description: 'メール送信を行うかどうか'
      }
    },
    required: ['id']
  }
};

export const deletePostSchema = {
  name: 'delete_post',
  description: '記事を削除',
  inputSchema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: '記事のID'
      }
    },
    required: ['id']
  }
};

export const getPostBySlugSchema = {
  name: 'get_post_by_slug',
  description: 'スラッグで記事を取得',
  inputSchema: {
    type: 'object',
    properties: {
      slug: {
        type: 'string',
        description: '記事のスラッグ'
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

export const searchPostsSchema = {
  name: 'search_posts',
  description: '記事を検索',
  inputSchema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: '検索キーワード'
      },
      limit: {
        type: 'number',
        description: '取得する記事数(デフォルト: 10)',
        minimum: 1,
        maximum: 100
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
    required: ['query']
  },
};

export const getPosts = async ({ limit = 10, page = 1, order, formats, include }: PostPaginationParams): Promise<ToolResponse> => {
  try {
    const params: BrowseParams = { limit, page };
    
    if (order) params.order = order;
    if (formats?.length) params.formats = formats.join(',');
    if (include?.length) params.include = include.join(',');

    const posts = await ghostApi.posts.browse(params);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(posts, null, 2),
        },
      ],
    };
  } catch (error) {
    throw handleGhostApiError(error);
  }
};

export const getPost = async ({ 
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

    const post = await ghostApi.posts.read(params);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(post, null, 2),
        },
      ],
    };
  } catch (error) {
    throw handleGhostApiError(error);
  }
};

export const searchPosts = async ({
  query,
  limit = 10,
  formats,
  include
}: SearchParams): Promise<ToolResponse> => {
  try {
    const params: BrowseParams = { limit, search: query };
    
    if (formats?.length) params.formats = formats.join(',');
    if (include?.length) params.include = include.join(',');

    const posts = await ghostApi.posts.browse(params);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(posts, null, 2),
        },
      ],
    };
  } catch (error) {
    throw handleGhostApiError(error);
  }
};

export const createPost = async (params: CreatePostParams): Promise<ToolResponse> => {
  try {
    // lexicalデータのバリデーションと不要なタグの除去
    if (params.lexical) {
      try {
        // 文字列をJSONとしてパース
        const lexicalData = JSON.parse(params.lexical);
        // 不要なタグが含まれている可能性のある文字列を除去
        params.lexical = JSON.stringify(lexicalData);
      } catch (e) {
        throw new Error('Lexicalデータが不正なJSON形式です');
      }
    }

    const post = await ghostApi.posts.add(params);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(post, null, 2),
        },
      ],
    };
  } catch (error) {
    throw handleGhostApiError(error);
  }
};

export const updatePost = async ({ id, ...params }: { id: string } & UpdatePostParams): Promise<ToolResponse> => {
  try {
    // updated_atは必須
    if (!params.updated_at) {
      params.updated_at = new Date().toISOString();
    }
    const post = await ghostApi.posts.edit({ id, ...params });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(post, null, 2),
        },
      ],
    };
  } catch (error) {
    throw handleGhostApiError(error);
  }
};

export const deletePost = async ({ id }: { id: string }): Promise<ToolResponse> => {
  try {
    await ghostApi.posts.delete({ id });
    return {
      content: [
        {
          type: 'text',
          text: '記事が正常に削除されました',
        },
      ],
    };
  } catch (error) {
    throw handleGhostApiError(error);
  }
};

export const getPostBySlug = async ({
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

    const [post] = await ghostApi.posts.browse(params);
    if (!post) {
      throw new Error(`スラッグ "${slug}" の記事が見つかりませんでした`);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(post, null, 2),
        },
      ],
    };
  } catch (error) {
    throw handleGhostApiError(error);
  }
};