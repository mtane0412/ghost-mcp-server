#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import {
  getPost,
  getPosts,
  searchPosts,
  createPost,
  updatePost,
  deletePost,
  getPostBySlug,
  getPage,
  getPages,
  createPage,
  updatePage,
  deletePage,
  getPageBySlug,
  getTags,
  getAuthors,
  getMember,
  getMembers,
  searchMembers,
  createMember,
  updateMember,
  deleteMember,
  uploadImage,
  toolSchemas
} from './tools/index.js';
import {
  isPaginationParams,
  isSearchParams,
  isMemberPaginationParams,
  isMemberSearchParams,
  isCreateMemberParams,
  isUpdateMemberParams,
  isImageUploadParams,
  PostFormat,
  PostInclude,
  PostStatus,
  PostVisibility,
  MemberInclude,
  CreateMemberParams,
  UpdateMemberParams
} from './types/index.js';

const isPostStatus = (value: string): value is PostStatus =>
  ['published', 'draft', 'scheduled'].includes(value);

const isPostVisibility = (value: string): value is PostVisibility =>
  ['public', 'members', 'paid', 'tiers'].includes(value);

class GhostServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'ghost-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: toolSchemas,
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const args = request.params.arguments || {};
        
        switch (request.params.name) {
          case 'get_posts':
            if (!isPaginationParams(args)) {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid pagination parameters');
            }
            return getPosts(args);

          case 'get_post': {
            const id = args.id;
            if (typeof id !== 'string') {
              throw new McpError(ErrorCode.InvalidParams, 'ID must be a string');
            }
            return getPost({ id });
          }

          case 'search_posts':
            if (!isSearchParams(args)) {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid search parameters');
            }
            return searchPosts(args);

          case 'get_tags':
            if (!isPaginationParams(args)) {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid pagination parameters');
            }
            return getTags(args);

          case 'get_authors':
            if (!isPaginationParams(args)) {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid pagination parameters');
            }
            return getAuthors(args);

          case 'create_post': {
            const { title, html, lexical, status, visibility, published_at, tags, authors, featured, email_subject, email_only, newsletter } = args;
            if (!title || typeof title !== 'string') {
              throw new McpError(ErrorCode.InvalidParams, 'Title is required and must be a string');
            }
            return createPost({
              title,
              html: typeof html === 'string' ? html : undefined,
              lexical: typeof lexical === 'string' ? lexical : undefined,
              status: typeof status === 'string' && isPostStatus(status) ? status : undefined,
              visibility: typeof visibility === 'string' && isPostVisibility(visibility) ? visibility : undefined,
              published_at: typeof published_at === 'string' ? published_at : undefined,
              tags: Array.isArray(tags) ? tags.filter((t): t is string => typeof t === 'string') : undefined,
              authors: Array.isArray(authors) ? authors.filter((a): a is string => typeof a === 'string') : undefined,
              featured: typeof featured === 'boolean' ? featured : undefined,
              email_subject: typeof email_subject === 'string' ? email_subject : undefined,
              email_only: typeof email_only === 'boolean' ? email_only : undefined,
              newsletter: typeof newsletter === 'boolean' ? newsletter : undefined,
            });
          }

          case 'update_post': {
            const { id, title, html, lexical, status, visibility, published_at, tags, authors, featured, email_subject, email_only, newsletter } = args;
            if (typeof id !== 'string') {
              throw new McpError(ErrorCode.InvalidParams, 'ID must be a string');
            }
            return updatePost({
              id,
              title: typeof title === 'string' ? title : undefined,
              html: typeof html === 'string' ? html : undefined,
              lexical: typeof lexical === 'string' ? lexical : undefined,
              status: typeof status === 'string' && isPostStatus(status) ? status : undefined,
              visibility: typeof visibility === 'string' && isPostVisibility(visibility) ? visibility : undefined,
              published_at: typeof published_at === 'string' ? published_at : undefined,
              tags: Array.isArray(tags) ? tags.filter((t): t is string => typeof t === 'string') : undefined,
              authors: Array.isArray(authors) ? authors.filter((a): a is string => typeof a === 'string') : undefined,
              featured: typeof featured === 'boolean' ? featured : undefined,
              email_subject: typeof email_subject === 'string' ? email_subject : undefined,
              email_only: typeof email_only === 'boolean' ? email_only : undefined,
              newsletter: typeof newsletter === 'boolean' ? newsletter : undefined,
              updated_at: new Date().toISOString(),
            });
          }

          case 'delete_post': {
            const { id } = args;
            if (typeof id !== 'string') {
              throw new McpError(ErrorCode.InvalidParams, 'ID must be a string');
            }
            return deletePost({ id });
          }

          case 'get_post_by_slug': {
            const { slug, formats, include } = args;
            if (typeof slug !== 'string') {
              throw new McpError(ErrorCode.InvalidParams, 'Slug must be a string');
            }
            return getPostBySlug({
              slug,
              formats: Array.isArray(formats) ? formats.filter((f): f is PostFormat => typeof f === 'string' && ['html', 'mobiledoc', 'lexical'].includes(f)) : undefined,
              include: Array.isArray(include) ? include.filter((i): i is PostInclude => typeof i === 'string' && ['authors', 'tags'].includes(i)) : undefined,
            });
          }

          // Pages
          case 'get_pages':
            if (!isPaginationParams(args)) {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid pagination parameters');
            }
            return getPages(args);

          case 'get_page': {
            const id = args.id;
            if (typeof id !== 'string') {
              throw new McpError(ErrorCode.InvalidParams, 'ID must be a string');
            }
            return getPage({ id });
          }

          case 'create_page': {
            const { title, html, lexical, status, visibility, published_at, tags, authors, featured } = args;
            if (!title || typeof title !== 'string') {
              throw new McpError(ErrorCode.InvalidParams, 'Title is required and must be a string');
            }
            return createPage({
              title,
              html: typeof html === 'string' ? html : undefined,
              lexical: typeof lexical === 'string' ? lexical : undefined,
              status: typeof status === 'string' && isPostStatus(status) ? status : undefined,
              visibility: typeof visibility === 'string' && isPostVisibility(visibility) ? visibility : undefined,
              published_at: typeof published_at === 'string' ? published_at : undefined,
              tags: Array.isArray(tags) ? tags.filter((t): t is string => typeof t === 'string') : undefined,
              authors: Array.isArray(authors) ? authors.filter((a): a is string => typeof a === 'string') : undefined,
              featured: typeof featured === 'boolean' ? featured : undefined,
            });
          }

          case 'update_page': {
            const { id, title, html, lexical, status, visibility, published_at, tags, authors, featured } = args;
            if (typeof id !== 'string') {
              throw new McpError(ErrorCode.InvalidParams, 'ID must be a string');
            }
            return updatePage({
              id,
              title: typeof title === 'string' ? title : undefined,
              html: typeof html === 'string' ? html : undefined,
              lexical: typeof lexical === 'string' ? lexical : undefined,
              status: typeof status === 'string' && isPostStatus(status) ? status : undefined,
              visibility: typeof visibility === 'string' && isPostVisibility(visibility) ? visibility : undefined,
              published_at: typeof published_at === 'string' ? published_at : undefined,
              tags: Array.isArray(tags) ? tags.filter((t): t is string => typeof t === 'string') : undefined,
              authors: Array.isArray(authors) ? authors.filter((a): a is string => typeof a === 'string') : undefined,
              featured: typeof featured === 'boolean' ? featured : undefined,
              updated_at: new Date().toISOString(),
            });
          }

          case 'delete_page': {
            const { id } = args;
            if (typeof id !== 'string') {
              throw new McpError(ErrorCode.InvalidParams, 'ID must be a string');
            }
            return deletePage({ id });
          }

          case 'get_page_by_slug': {
            const { slug, formats, include } = args;
            if (typeof slug !== 'string') {
              throw new McpError(ErrorCode.InvalidParams, 'Slug must be a string');
            }
            return getPageBySlug({
              slug,
              formats: Array.isArray(formats) ? formats.filter((f): f is PostFormat => typeof f === 'string' && ['html', 'mobiledoc', 'lexical'].includes(f)) : undefined,
              include: Array.isArray(include) ? include.filter((i): i is PostInclude => typeof i === 'string' && ['authors', 'tags'].includes(i)) : undefined,
            });
          }

          // Members
          case 'get_members':
            if (!isMemberPaginationParams(args)) {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid pagination parameters');
            }
            return getMembers(args);

          case 'get_member': {
            const { id, include } = args;
            if (typeof id !== 'string') {
              throw new McpError(ErrorCode.InvalidParams, 'ID must be a string');
            }
            return getMember({
              id,
              include: Array.isArray(include) ? include.filter((i): i is MemberInclude => typeof i === 'string' && ['labels', 'newsletters'].includes(i)) : undefined,
            });
          }

          case 'search_members':
            if (!isMemberSearchParams(args)) {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid search parameters');
            }
            return searchMembers(args);

          case 'create_member':
            if (!isCreateMemberParams(args)) {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid member parameters');
            }
            return createMember(args as unknown as CreateMemberParams);

          case 'update_member':
            if (!isUpdateMemberParams(args)) {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid member parameters');
            }
            return updateMember(args as unknown as UpdateMemberParams);

          case 'delete_member': {
            const { id } = args;
            if (typeof id !== 'string') {
              throw new McpError(ErrorCode.InvalidParams, 'ID must be a string');
            }
            return deleteMember({ id });
          }

          // Images
          case 'upload_image':
            if (!isImageUploadParams(args)) {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid image upload parameters');
            }
            return uploadImage(args);

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${request.params.name}`
            );
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        console.error('Ghost API Error:', error);
        throw new McpError(
          ErrorCode.InternalError,
          `Ghost API error: ${(error as Error).message}`
        );
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Ghost MCP server running on stdio');
  }
}

const server = new GhostServer();
server.run().catch(console.error);