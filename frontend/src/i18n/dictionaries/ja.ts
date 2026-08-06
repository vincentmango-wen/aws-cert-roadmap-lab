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

export type QuestionDifficultyKey = "easy" | "normal" | "hard";

/**
 * 模擬問題のカテゴリキー。
 *
 * 値は AWS 公式試験ガイドのドメイン名に対応する識別子であり、
 * `types/question.ts` の `QuestionCategory` と同一集合であることが
 * `lib/questions.ts` の `QUESTION_CATEGORY_LABELS` の型注釈で担保される。
 */
export type QuestionCategoryKey =
  | "Cloud Concepts"
  | "Security and Compliance"
  | "Cloud Technology and Services"
  | "Billing, Pricing, and Support"
  | "Secure Architectures"
  | "Resilient Architectures"
  | "High-Performing Architectures"
  | "Cost-Optimized Architectures";

export type QuestionsDictionary = {
  breadcrumbHome: string;
  breadcrumbQuestions: string;
  examLabel: string;
  difficultyLabels: Record<QuestionDifficultyKey, string>;
  categoryLabel: string;
  choicesLabel: string;
  submitButtonLabel: string;
  retryButtonLabel: string;
  resultCorrect: string;
  resultIncorrect: string;
  yourAnswerLabel: string;
  correctAnswerLabel: string;
  explanationTitle: string;
  choiceExplanationsTitle: string;
  practicalNoteTitle: string;
  officialDocsTitle: string;
  relatedLinksTitle: string;
  relatedServicesLabel: string;
  relatedTermsLabel: string;
  relatedComparisonsLabel: string;
  previousQuestionLabel: string;
  nextQuestionLabel: string;
  backToListLabel: string;
  noPreviousQuestion: string;
  noNextQuestion: string;
  examDumpDisclaimer: string;
  // 一覧ページ（フィルタ / カード / 空状態）で使う文言
  difficultyLabel: string;
  categoryLabels: Record<QuestionCategoryKey, string>;
  allCategoriesLabel: string;
  allDifficultiesLabel: string;
  filteredCountPrefix: string;
  filteredCountSeparator: string;
  filteredCountSuffix: string;
  labelSeparator: string;
  noRelatedServicesLabel: string;
  viewQuestionLabel: string;
  emptyStateTitle: string;
  emptyStateDescription: string;
  paginationNavAriaLabel: string;
  paginationPreviousLabel: string;
  paginationNextLabel: string;
  paginationGoToPageAriaLabelPrefix: string;
  paginationGoToPageAriaLabelSuffix: string;
  paginationRangeBefore: string;
  paginationRangeBetweenStartEnd: string;
  paginationRangeBetweenEndTotal: string;
  paginationRangeAfter: string;
};

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
  questions: QuestionsDictionary;
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
  questions: {
    breadcrumbHome: "ホーム",
    breadcrumbQuestions: "模擬問題",
    examLabel: "試験区分",
    difficultyLabels: {
      easy: "やさしい",
      normal: "標準",
      hard: "難しい",
    },
    categoryLabel: "カテゴリ",
    choicesLabel: "選択肢",
    submitButtonLabel: "回答する",
    retryButtonLabel: "もう一度選ぶ",
    resultCorrect: "正解です。",
    resultIncorrect: "不正解です。",
    yourAnswerLabel: "あなたの回答",
    correctAnswerLabel: "正解",
    explanationTitle: "解説",
    choiceExplanationsTitle: "選択肢ごとの解説",
    practicalNoteTitle: "実務での使いどころ",
    officialDocsTitle: "公式ドキュメント",
    relatedLinksTitle: "関連リンク",
    relatedServicesLabel: "関連サービス",
    relatedTermsLabel: "関連用語",
    relatedComparisonsLabel: "関連比較",
    previousQuestionLabel: "前の問題",
    nextQuestionLabel: "次の問題",
    backToListLabel: "一覧に戻る",
    noPreviousQuestion: "前の問題はありません",
    noNextQuestion: "次の問題はありません",
    examDumpDisclaimer: "本サイトの問題はオリジナルであり、実際の試験問題（試験ダンプ）ではありません。",
    difficultyLabel: "難易度",
    categoryLabels: {
      "Cloud Concepts": "クラウドの概念",
      "Security and Compliance": "セキュリティとコンプライアンス",
      "Cloud Technology and Services": "クラウド技術とサービス",
      "Billing, Pricing, and Support": "請求・料金・サポート",
      "Secure Architectures": "セキュアなアーキテクチャ",
      "Resilient Architectures": "耐障害性のあるアーキテクチャ",
      "High-Performing Architectures": "高性能なアーキテクチャ",
      "Cost-Optimized Architectures": "コスト最適化されたアーキテクチャ",
    },
    allCategoriesLabel: "すべてのカテゴリ",
    allDifficultiesLabel: "すべての難易度",
    filteredCountPrefix: "表示中：",
    filteredCountSeparator: "問 / 全",
    filteredCountSuffix: "問",
    labelSeparator: "：",
    noRelatedServicesLabel: "関連サービスなし",
    viewQuestionLabel: "問題を見る →",
    emptyStateTitle: "条件に一致する問題がありません。",
    emptyStateDescription: "カテゴリまたは難易度の条件を変更してください。",
    paginationNavAriaLabel: "ページ送り",
    paginationPreviousLabel: "前へ",
    paginationNextLabel: "次へ",
    paginationGoToPageAriaLabelPrefix: "ページ ",
    paginationGoToPageAriaLabelSuffix: "",
    paginationRangeBefore: "",
    paginationRangeBetweenStartEnd: "〜",
    paginationRangeBetweenEndTotal: "問を表示中（全",
    paginationRangeAfter: "問）",
  },
};