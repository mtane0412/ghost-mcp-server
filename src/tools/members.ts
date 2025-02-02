import {
  GhostMember,
  MemberPaginationParams,
  MemberInclude,
  MemberSearchParams,
  ToolResponse,
  CreateMemberParams,
  UpdateMemberParams
} from '../types/index.js';
import { handleGhostApiError } from '../utils/error.js';
import { createGhostApi } from '../config/config.js';
import type { BrowseParams, ReadParams } from '@tryghost/admin-api';

const ghostApi = createGhostApi();

export const getMembersSchema = {
  name: 'get_members',
  description: 'メンバー一覧を取得',
  inputSchema: {
    type: 'object',
    properties: {
      limit: {
        type: 'number',
        description: '取得するメンバー数(デフォルト: 10)',
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
        description: '並び順(デフォルト: created_at DESC)',
        enum: [
          'created_at DESC',
          'created_at ASC',
          'updated_at DESC',
          'updated_at ASC'
        ]
      },
      include: {
        type: 'array',
        description: '含める関連データ',
        items: {
          type: 'string',
          enum: ['labels', 'newsletters']
        }
      }
    }
  },
};

export const getMemberSchema = {
  name: 'get_member',
  description: '特定のメンバーを取得',
  inputSchema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'メンバーのID'
      },
      include: {
        type: 'array',
        description: '含める関連データ',
        items: {
          type: 'string',
          enum: ['labels', 'newsletters']
        }
      }
    },
    required: ['id']
  },
};

export const createMemberSchema = {
  name: 'create_member',
  description: '新しいメンバーを作成',
  inputSchema: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        description: 'メールアドレス'
      },
      name: {
        type: 'string',
        description: '名前'
      },
      note: {
        type: 'string',
        description: 'メモ'
      },
      labels: {
        type: 'array',
        description: 'ラベルのID配列',
        items: {
          type: 'string'
        }
      },
      newsletters: {
        type: 'array',
        description: 'ニュースレターのID配列',
        items: {
          type: 'string'
        }
      },
      subscribed: {
        type: 'boolean',
        description: 'ニュースレター購読状態'
      }
    },
    required: ['email']
  }
};

export const updateMemberSchema = {
  name: 'update_member',
  description: 'メンバーを更新',
  inputSchema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'メンバーのID'
      },
      email: {
        type: 'string',
        description: 'メールアドレス'
      },
      name: {
        type: 'string',
        description: '名前'
      },
      note: {
        type: 'string',
        description: 'メモ'
      },
      labels: {
        type: 'array',
        description: 'ラベルのID配列(既存のラベルは置換)',
        items: {
          type: 'string'
        }
      },
      newsletters: {
        type: 'array',
        description: 'ニュースレターのID配列(既存のニュースレターは置換)',
        items: {
          type: 'string'
        }
      },
      subscribed: {
        type: 'boolean',
        description: 'ニュースレター購読状態'
      }
    },
    required: ['id']
  }
};

export const deleteMemberSchema = {
  name: 'delete_member',
  description: 'メンバーを削除',
  inputSchema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'メンバーのID'
      }
    },
    required: ['id']
  }
};

export const searchMembersSchema = {
  name: 'search_members',
  description: 'メンバーを検索',
  inputSchema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: '検索キーワード'
      },
      limit: {
        type: 'number',
        description: '取得するメンバー数(デフォルト: 10)',
        minimum: 1,
        maximum: 100
      },
      include: {
        type: 'array',
        description: '含める関連データ',
        items: {
          type: 'string',
          enum: ['labels', 'newsletters']
        }
      }
    },
    required: ['query']
  },
};

export const getMembers = async ({ limit = 10, page = 1, order, include }: MemberPaginationParams): Promise<ToolResponse> => {
  try {
    const params: BrowseParams = { limit, page };
    
    if (order) params.order = order;
    if (include?.length) params.include = include.join(',');

    const members = await ghostApi.members.browse(params);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(members, null, 2),
        },
      ],
    };
  } catch (error) {
    throw handleGhostApiError(error);
  }
};

export const getMember = async ({ 
  id, 
  include 
}: { 
  id: string; 
  include?: MemberInclude[]; 
}): Promise<ToolResponse> => {
  try {
    const params: ReadParams = { id };
    
    if (include?.length) params.include = include.join(',');

    const member = await ghostApi.members.read(params);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(member, null, 2),
        },
      ],
    };
  } catch (error) {
    throw handleGhostApiError(error);
  }
};

export const searchMembers = async ({
  query,
  limit = 10,
  include
}: MemberSearchParams): Promise<ToolResponse> => {
  try {
    const params: BrowseParams = { limit, search: query };
    
    if (include?.length) params.include = include.join(',');

    const members = await ghostApi.members.browse(params);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(members, null, 2),
        },
      ],
    };
  } catch (error) {
    throw handleGhostApiError(error);
  }
};

export const createMember = async (params: CreateMemberParams): Promise<ToolResponse> => {
  try {
    const member = await ghostApi.members.add(params);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(member, null, 2),
        },
      ],
    };
  } catch (error) {
    throw handleGhostApiError(error);
  }
};

export const updateMember = async ({ id, ...params }: UpdateMemberParams): Promise<ToolResponse> => {
  try {
    const member = await ghostApi.members.edit({ id, ...params });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(member, null, 2),
        },
      ],
    };
  } catch (error) {
    throw handleGhostApiError(error);
  }
};

export const deleteMember = async ({ id }: { id: string }): Promise<ToolResponse> => {
  try {
    await ghostApi.members.delete({ id });
    return {
      content: [
        {
          type: 'text',
          text: 'メンバーが正常に削除されました',
        },
      ],
    };
  } catch (error) {
    throw handleGhostApiError(error);
  }
};