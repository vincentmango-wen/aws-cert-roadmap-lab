export type ExternalLinkKey = "note" | "x" | "github";

export type ExternalLink = {
  key: ExternalLinkKey;
  label: string;
  url: string;
  description: string;
  ariaLabel: string;
};

export const externalLinks: Record<ExternalLinkKey, ExternalLink> = {
  note: {
    key: "note",
    label: "note",
    url: "https://note.com/fumi_ai_202507",
    description: "AWS学習・生成AI・キャリア記事",
    ariaLabel: "noteでAWS学習や生成AIの記事を見る",
  },
  x: {
    key: "x",
    label: "X",
    url: "https://x.com/fumi_ai_202507",
    description: "開発ログ・学習ログ・更新情報",
    ariaLabel: "Xで開発ログや更新情報を見る",
  },
  github: {
    key: "github",
    label: "GitHub",
    url: "https://github.com/vincentmango-wen/aws-cert-roadmap-lab",
    description: "ソースコード・README・AWS構成",
    ariaLabel: "GitHubでソースコードとREADMEを見る",
  },
};

export const externalLinkList: ExternalLink[] = [
  externalLinks.note,
  externalLinks.x,
  externalLinks.github,
];