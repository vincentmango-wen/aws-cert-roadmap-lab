export type NavigationKey =
  | "home"
  | "terms"
  | "comparisons"
  | "questions"
  | "architectures"
  | "blog"
  | "roadmap"
  | "contact"
  | "about"
  | "privacy"
  | "disclaimer"
  | "github"
  | "note"
  | "x";

export type FooterSectionKey = "learning" | "siteInfo" | "portfolio";

export type TermCategoryKey =
  | "All"
  | "Compute"
  | "Storage"
  | "Database"
  | "Networking"
  | "Security"
  | "Monitoring"
  | "Integration"
  | "Management"
  | "Analytics";

export type TermLevelKey = "beginner" | "intermediate" | "advanced";

export type UiDictionary = {
  site: {
    name: string;
    shortName: string;
    tagline: string;
    description: string;
    independentNotice: string;
  };
  header: {
    skipToContent: string;
    homeAriaLabel: string;
    desktopNavAriaLabel: string;
    mobileNavAriaLabel: string;
    openMenu: string;
    closeMenu: string;
  };
  navigation: Record<NavigationKey, string>;
  footer: {
    description: string;
    copyright: string;
    sections: Record<
      FooterSectionKey,
      {
        title: string;
        linkKeys: NavigationKey[];
      }
    >;
  };
  languageSwitcher: {
    label: string;
    ariaLabel: string;
    currentLanguage: string;
    switchTo: string;
  };
  common: {
    readMore: string;
    viewDetails: string;
    backToList: string;
    next: string;
    previous: string;
    updatedAt: string;
    publishedAt: string;
    relatedLinks: string;
    externalLinkSuffix: string;
  };
  cta: {
    startQuestions: string;
    viewTerms: string;
    viewComparisons: string;
    viewArchitectures: string;
    readBlog: string;
    viewRoadmap: string;
    contactUs: string;
    viewGitHub: string;
    nextStepLabel: string;
    learnWithComparisonsAndQuestions: string;
  };
  search: {
    keywordSearch: string;
    termSearchPlaceholder: string;
    blogSearchPlaceholder: string;
    noResultsTitle: string;
    noResultsDescription: string;
    displayedCountSuffix: string;
    keywordBadgeLabel: string;
  };
  filters: {
    category: string;
    exam: string;
    difficulty: string;
    all: string;
    categoryLabels: Record<TermCategoryKey, string>;
    levelLabels: Record<TermLevelKey, string>;
  };
  breadcrumb: {
    home: string;
  };
  forms: {
    contact: {
      name: string;
      email: string;
      subject: string;
      message: string;
      honeypot: string;
      submit: string;
      sending: string;
      successTitle: string;
      successMessage: string;
      errorTitle: string;
      errorMessage: string;
    };
  };
  errors: {
    required: string;
    invalidEmail: string;
    tooLong: string;
    unexpected: string;
  };
  notFound: {
    title: string;
    description: string;
    backHome: string;
  };
};

export const jaDictionary: UiDictionary = {
  site: {
    name: "AWS資格ロードマップラボ",
    shortName: "AWS Cert Roadmap Lab",
    tagline: "Cloud Practitioner / SAA 学習サイト",
    description:
      "AWS Cloud Practitioner / Solutions Architect Associate の学習内容を、用語・比較・問題・構成図で整理する学習サイトです。",
    independentNotice:
      "This site is an independent learning project and is not affiliated with Amazon Web Services.",
  },
  header: {
    skipToContent: "メインコンテンツへ移動",
    homeAriaLabel: "AWS資格ロードマップラボのトップページへ移動",
    desktopNavAriaLabel: "メインナビゲーション",
    mobileNavAriaLabel: "スマートフォン用ナビゲーション",
    openMenu: "メニューを開く",
    closeMenu: "メニューを閉じる",
  },
  navigation: {
    home: "ホーム",
    terms: "用語集",
    comparisons: "比較",
    questions: "模擬問題",
    architectures: "構成図",
    blog: "ブログ",
    roadmap: "ロードマップ",
    contact: "問い合わせ",
    about: "運営者情報",
    privacy: "プライバシーポリシー",
    disclaimer: "免責事項",
    github: "GitHub",
    note: "note",
    x: "X",
  },
  footer: {
    description:
      "AWS Cloud Practitioner / Solutions Architect Associate の学習内容を、用語・比較・問題・構成図で整理する学習サイトです。",
    copyright:
      "© 2026 AWS資格ロードマップラボ. This site is an independent learning project and is not affiliated with Amazon Web Services.",
    sections: {
      learning: {
        title: "学習コンテンツ",
        linkKeys: [
          "terms",
          "comparisons",
          "questions",
          "architectures",
          "blog",
          "roadmap",
        ],
      },
      siteInfo: {
        title: "サイト情報",
        linkKeys: ["about", "contact", "privacy", "disclaimer"],
      },
      portfolio: {
        title: "ポートフォリオ",
        linkKeys: ["github", "note", "x"],
      },
    },
  },
  languageSwitcher: {
    label: "表示言語",
    ariaLabel: "表示言語を切り替える",
    currentLanguage: "現在の言語",
    switchTo: "この言語で表示",
  },
  common: {
    readMore: "続きを読む",
    viewDetails: "詳細を見る",
    backToList: "一覧に戻る",
    next: "次へ",
    previous: "前へ",
    updatedAt: "更新日",
    publishedAt: "公開日",
    relatedLinks: "関連リンク",
    externalLinkSuffix: "外部リンク",
  },
  cta: {
    startQuestions: "模擬問題を解く",
    viewTerms: "用語集を見る",
    viewComparisons: "サービス比較を見る",
    viewArchitectures: "AWS構成図を見る",
    readBlog: "ブログを読む",
    viewRoadmap: "ロードマップを見る",
    contactUs: "問い合わせる",
    viewGitHub: "GitHubを見る",
    nextStepLabel: "Next Step",
    learnWithComparisonsAndQuestions:
      "用語を覚えたら、比較と問題で確認する",
  },
  search: {
    keywordSearch: "キーワード検索",
    termSearchPlaceholder: "例：S3, Lambda, セキュリティ",
    blogSearchPlaceholder: "記事タイトル、カテゴリ、AWSサービス名で検索",
    noResultsTitle: "該当する結果がありません",
    noResultsDescription:
      "検索キーワード、カテゴリ、試験区分を変更してください。",
    displayedCountSuffix: "件表示中",
    keywordBadgeLabel: "keyword",
  },
  filters: {
    category: "カテゴリ",
    exam: "試験区分",
    difficulty: "難易度",
    all: "すべて",
    categoryLabels: {
      All: "すべて",
      Compute: "コンピューティング",
      Storage: "ストレージ",
      Database: "データベース",
      Networking: "ネットワーク",
      Security: "セキュリティ",
      Monitoring: "監視・ログ",
      Integration: "アプリケーション連携",
      Management: "管理",
      Analytics: "分析",
    },
    levelLabels: {
      beginner: "初級",
      intermediate: "中級",
      advanced: "上級",
    },
  },
  breadcrumb: {
    home: "ホーム",
  },
  forms: {
    contact: {
      name: "名前",
      email: "メールアドレス",
      subject: "件名",
      message: "本文",
      honeypot: "入力しないでください",
      submit: "送信する",
      sending: "送信中",
      successTitle: "送信しました",
      successMessage: "お問い合わせを受け付けました。",
      errorTitle: "送信できませんでした",
      errorMessage:
        "入力内容を確認し、時間をおいて再度お試しください。",
    },
  },
  errors: {
    required: "必須項目です。",
    invalidEmail: "正しいメールアドレスを入力してください。",
    tooLong: "入力文字数が上限を超えています。",
    unexpected: "予期しないエラーが発生しました。",
  },
  notFound: {
    title: "ページが見つかりません",
    description: "URLが変更されたか、ページが削除された可能性があります。",
    backHome: "トップページへ戻る",
  },
};