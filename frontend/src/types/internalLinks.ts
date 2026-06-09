export type InternalLinkType =
  | 'term'
  | 'comparison'
  | 'question'
  | 'architecture'
  | 'blog'
  | 'roadmap'
  | 'external';

export type InternalLinkItem = {
  type: InternalLinkType;
  href: string;
  label: string;
  description?: string;
};

export type InternalLinkSection = {
  title: string;
  description?: string;
  links: InternalLinkItem[];
};