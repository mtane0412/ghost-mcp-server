declare module '@tryghost/admin-api' {
  export type PostStatus = 'published' | 'draft' | 'scheduled' | 'sent';
  export type PostVisibility = 'public' | 'members' | 'paid' | 'tiers';

  export {
    GhostPost,
    GhostPage,
    GhostTag,
    GhostAuthor,
    GhostMember,
    GhostLabel,
    GhostNewsletter,
    BrowseParams,
    ReadParams,
    CreatePostParams,
    UpdatePostParams,
    CreatePageParams,
    UpdatePageParams,
    CreateMemberParams,
    UpdateMemberParams
  };

  interface GhostPost {
    id: string;
    title: string;
    slug: string;
    html: string | null;
    mobiledoc: string | null;
    lexical: string | null;
    feature_image: string | null;
    feature_image_alt: string | null;
    feature_image_caption: string | null;
    featured: boolean;
    status: PostStatus;
    visibility: PostVisibility;
    locale: string | null;
    visibility_filter: string | null;
    created_at: string;
    updated_at: string | null;
    published_at: string | null;
    custom_excerpt: string | null;
    excerpt: string;
    meta_title: string | null;
    meta_description: string | null;
    og_image: string | null;
    og_title: string | null;
    og_description: string | null;
    twitter_image: string | null;
    twitter_title: string | null;
    twitter_description: string | null;
    canonical_url: string | null;
    url: string;
    authors: GhostAuthor[];
    tags: GhostTag[];
    email_subject: string | null;
    email_only: boolean;
  }

  interface GhostTag {
    id: string;
    name: string;
    slug: string;
    description?: string;
    feature_image?: string;
    visibility: string;
  }

  interface GhostAuthor {
    id: string;
    name: string;
    slug: string;
    profile_image?: string;
    cover_image?: string;
    bio?: string;
    website?: string;
    location?: string;
    facebook?: string;
    twitter?: string;
  }

  interface BrowseParams {
    limit?: number;
    page?: number;
    order?: string;
    filter?: string;
    search?: string;
    include?: string;
    formats?: string;
  }

  interface ReadParams {
    id: string;
    include?: string;
    formats?: string;
  }

  interface CreatePostParams {
    title: string;
    html?: string;
    lexical?: string;
    status?: PostStatus;
    visibility?: PostVisibility;
    published_at?: string;
    tags?: string[];
    authors?: string[];
    featured?: boolean;
    email_subject?: string;
    email_only?: boolean;
    newsletter?: boolean;
  }

  interface UpdatePostParams extends Partial<CreatePostParams> {
    updated_at: string;
  }

  interface GhostPage extends Omit<GhostPost, 'email_subject' | 'email_only'> {}
  
  interface CreatePageParams extends Omit<CreatePostParams, 'email_subject' | 'email_only' | 'newsletter'> {}
  
  interface UpdatePageParams extends Omit<UpdatePostParams, 'email_subject' | 'email_only' | 'newsletter'> {}
  
  interface GhostMember {
    id: string;
    email: string;
    name: string | null;
    note: string | null;
    subscribed: boolean;
    created_at: string;
    updated_at: string | null;
    labels: GhostLabel[];
    newsletters: GhostNewsletter[];
    status: 'free' | 'paid';
    comped: boolean;
  }

  interface GhostLabel {
    id: string;
    name: string;
    slug: string;
    created_at: string;
    updated_at: string | null;
  }

  interface GhostNewsletter {
    id: string;
    name: string;
    description: string | null;
    status: 'active' | 'archived';
  }

  interface CreateMemberParams {
    email: string;
    name?: string;
    note?: string;
    labels?: string[];
    newsletters?: string[];
    subscribed?: boolean;
  }

  interface UpdateMemberParams extends Partial<CreateMemberParams> {
    id: string;
  }

  // 画像アップロード関連の型定義を追加
  interface ImageUploadResponse {
    url: string;
    ref?: string;
  }

  interface ImageUploadOptions {
    file: FormData;
    purpose?: string;
    ref?: string;
  }

  interface GhostAPI {
    posts: {
      browse(params?: BrowseParams): Promise<GhostPost[]>;
      read(params: ReadParams): Promise<GhostPost>;
      add(post: CreatePostParams): Promise<GhostPost>;
      edit(params: { id: string } & UpdatePostParams): Promise<GhostPost>;
      delete(params: { id: string }): Promise<void>;
      copy(params: { id: string }): Promise<GhostPost>;
    };
    pages: {
      browse(params?: BrowseParams): Promise<GhostPage[]>;
      read(params: ReadParams): Promise<GhostPage>;
      add(page: CreatePageParams): Promise<GhostPage>;
      edit(params: { id: string } & UpdatePageParams): Promise<GhostPage>;
      delete(params: { id: string }): Promise<void>;
    };
    tags: {
      browse(params?: BrowseParams): Promise<GhostTag[]>;
    };
    users: {
      browse(params?: BrowseParams): Promise<GhostAuthor[]>;
    };
    members: {
      browse(params?: BrowseParams): Promise<GhostMember[]>;
      read(params: ReadParams): Promise<GhostMember>;
      add(member: CreateMemberParams): Promise<GhostMember>;
      edit(params: UpdateMemberParams): Promise<GhostMember>;
      delete(params: { id: string }): Promise<void>;
    };
    images: {
      upload(options: ImageUploadOptions): Promise<ImageUploadResponse>;
    };
  }

  interface GhostAdminAPIOptions {
    url: string;
    key: string;
    version: string;
  }

  export default class GhostAdminAPI implements GhostAPI {
    constructor(options: GhostAdminAPIOptions);
    posts: GhostAPI['posts'];
    pages: GhostAPI['pages'];
    tags: GhostAPI['tags'];
    users: GhostAPI['users'];
    members: GhostAPI['members'];
    images: GhostAPI['images'];
  }
}