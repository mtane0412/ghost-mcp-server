import { ServerResult } from '@modelcontextprotocol/sdk/types.js';
import type { GhostPost as AdminGhostPost, BrowseParams } from '@tryghost/admin-api';

export type {
  GhostPost,
  GhostPage,
  GhostMember,
  GhostLabel,
  GhostNewsletter,
  CreatePostParams,
  CreatePageParams,
  UpdatePostParams,
  UpdatePageParams,
  PostStatus,
  PostVisibility,
  CreateMemberParams,
  UpdateMemberParams
} from '@tryghost/admin-api';

export type ToolResponse = ServerResult;

export type PostFormat = 'html' | 'mobiledoc' | 'lexical';
export type PostInclude = 'authors' | 'tags';
export type TagInclude = 'count.posts';
export type AuthorInclude = 'count.posts';

// 画像関連の型定義
export type ImagePurpose = 'image' | 'profile_image' | 'icon';

export interface ImageUploadParams {
  file: string; // Base64エンコードされた画像データ
  purpose?: ImagePurpose;
  ref?: string;
}

export interface ImageResponse {
  url: string;
  ref?: string;
}

export const isImageUploadParams = (args: unknown): args is ImageUploadParams => {
  if (typeof args !== 'object' || args === null) return false;
  const obj = args as Record<string, unknown>;

  return typeof obj.file === 'string' &&
    (obj.purpose === undefined || ['image', 'profile_image', 'icon'].includes(obj.purpose as string)) &&
    (obj.ref === undefined || typeof obj.ref === 'string');
};

export interface BasePaginationParams {
  limit?: number;
  page?: number;
  order?: string;
}

export interface PostPaginationParams extends BasePaginationParams {
  formats?: PostFormat[];
  include?: PostInclude[];
}

export interface PagePaginationParams extends BasePaginationParams {
  formats?: PostFormat[];
  include?: PostInclude[];
}

export interface TagPaginationParams extends BasePaginationParams {
  include?: TagInclude;
  filter?: string;
}

export interface AuthorPaginationParams extends BasePaginationParams {
  include?: AuthorInclude;
  filter?: string;
}

export type MemberInclude = 'labels' | 'newsletters';

export interface MemberPaginationParams extends BasePaginationParams {
  include?: MemberInclude[];
  filter?: string;
}

export interface MemberSearchParams extends MemberPaginationParams {
  query: string;
}

export interface SearchParams extends PostPaginationParams {
  query: string;
}

export const isSearchParams = (args: unknown): args is SearchParams => {
  if (typeof args !== 'object' || args === null) return false;
  const obj = args as Record<string, unknown>;
  
  return typeof obj.query === 'string' &&
    (obj.limit === undefined || typeof obj.limit === 'number') &&
    (obj.page === undefined || typeof obj.page === 'number') &&
    (obj.order === undefined || typeof obj.order === 'string') &&
    (obj.formats === undefined || (Array.isArray(obj.formats) && obj.formats.every(f => typeof f === 'string'))) &&
    (obj.include === undefined || (Array.isArray(obj.include) && obj.include.every(i => typeof i === 'string')));
};

export const isPaginationParams = (args: unknown): args is BasePaginationParams => {
  if (typeof args !== 'object' || args === null) return false;
  const obj = args as Record<string, unknown>;
  
  return (obj.limit === undefined || typeof obj.limit === 'number') &&
    (obj.page === undefined || typeof obj.page === 'number') &&
    (obj.order === undefined || typeof obj.order === 'string');
};

export const isMemberPaginationParams = (args: unknown): args is MemberPaginationParams => {
  if (!isPaginationParams(args)) return false;
  const obj = args as Record<string, unknown>;

  return (obj.include === undefined || (Array.isArray(obj.include) && obj.include.every(i => typeof i === 'string'))) &&
    (obj.filter === undefined || typeof obj.filter === 'string');
};

export const isMemberSearchParams = (args: unknown): args is MemberSearchParams => {
  if (!isMemberPaginationParams(args)) return false;
  const obj = args as Record<string, unknown>;

  return typeof obj.query === 'string';
};

import type { CreateMemberParams, UpdateMemberParams } from '@tryghost/admin-api';

export const isCreateMemberParams = (args: unknown): args is CreateMemberParams => {
  if (typeof args !== 'object' || args === null) return false;
  const obj = args as Record<string, unknown>;

  return typeof obj.email === 'string' &&
    (obj.name === undefined || typeof obj.name === 'string') &&
    (obj.note === undefined || typeof obj.note === 'string') &&
    (obj.labels === undefined || (Array.isArray(obj.labels) && obj.labels.every(l => typeof l === 'string'))) &&
    (obj.newsletters === undefined || (Array.isArray(obj.newsletters) && obj.newsletters.every(n => typeof n === 'string'))) &&
    (obj.subscribed === undefined || typeof obj.subscribed === 'boolean');
};

export const isUpdateMemberParams = (args: unknown): args is UpdateMemberParams => {
  if (typeof args !== 'object' || args === null) return false;
  const obj = args as Record<string, unknown>;

  return typeof obj.id === 'string' &&
    (obj.email === undefined || typeof obj.email === 'string') &&
    (obj.name === undefined || typeof obj.name === 'string') &&
    (obj.note === undefined || typeof obj.note === 'string') &&
    (obj.labels === undefined || (Array.isArray(obj.labels) && obj.labels.every(l => typeof l === 'string'))) &&
    (obj.newsletters === undefined || (Array.isArray(obj.newsletters) && obj.newsletters.every(n => typeof n === 'string'))) &&
    (obj.subscribed === undefined || typeof obj.subscribed === 'boolean');
};