export * from './posts.js';
export * from './tags.js';
export * from './authors.js';
export * from './pages.js';
export * from './members.js';
export * from './images.js';

export const toolSchemas = [
  // Posts
  {
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
        }
      }
    },
  },
  {
    name: 'get_post',
    description: '特定の記事を取得',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: '記事のID'
        }
      },
      required: ['id']
    },
  },
  {
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
        }
      },
      required: ['query']
    },
  },
  {
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
    },
  },
  {
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
    },
  },
  {
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
    },
  },
  {
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
    },
  },
  // Tags
  {
    name: 'get_tags',
    description: 'タグ一覧を取得',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: '取得するタグ数(デフォルト: 10)',
          minimum: 1,
          maximum: 100
        }
      }
    },
  },
  // Authors
  {
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
        }
      }
    },
  },
  // Pages
  {
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
    }
  },
  {
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
    }
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  // Members
  {
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
    }
  },
  {
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
    }
  },
  {
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
    }
  },
  {
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
  },
  {
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
  },
  {
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
  },
  // Images
  {
    name: 'upload_image',
    description: '画像をアップロード',
    inputSchema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          description: 'アップロードする画像ファイル(Base64)'
        },
        purpose: {
          type: 'string',
          description: '画像の用途',
          enum: ['image', 'profile_image', 'icon']
        },
        ref: {
          type: 'string',
          description: '画像の参照情報(オプション)'
        }
      },
      required: ['file']
    }
  }
];