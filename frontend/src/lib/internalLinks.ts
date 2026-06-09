import type { InternalLinkItem, InternalLinkSection } from '@/types/internalLinks';

type LabelMap = Record<string, string>;

const termLabels: LabelMap = {
  iam: 'AWS IAM',
  s3: 'Amazon S3',
  ec2: 'Amazon EC2',
  lambda: 'AWS Lambda',
  vpc: 'Amazon VPC',
  rds: 'Amazon RDS',
  dynamodb: 'Amazon DynamoDB',
  cloudfront: 'Amazon CloudFront',
  route53: 'Amazon Route 53',
  cloudwatch: 'Amazon CloudWatch',
  cloudtrail: 'AWS CloudTrail',
  'api-gateway': 'Amazon API Gateway',
  sqs: 'Amazon SQS',
  sns: 'Amazon SNS',
  eventbridge: 'Amazon EventBridge',
  ebs: 'Amazon EBS',
  efs: 'Amazon EFS',
  elb: 'Elastic Load Balancing',
  'auto-scaling': 'Amazon EC2 Auto Scaling',
  acm: 'AWS Certificate Manager',
  kms: 'AWS KMS',
  waf: 'AWS WAF',
  budgets: 'AWS Budgets',
  'cost-explorer': 'AWS Cost Explorer',
  organizations: 'AWS Organizations',
  config: 'AWS Config',
  'secrets-manager': 'AWS Secrets Manager',
  'systems-manager': 'AWS Systems Manager',
  cloudformation: 'AWS CloudFormation',
  cognito: 'Amazon Cognito',
};

const comparisonLabels: LabelMap = {
  's3-vs-ebs-vs-efs': 'S3・EBS・EFSの違い',
  'rds-vs-dynamodb': 'RDS・DynamoDBの違い',
  'sns-vs-sqs-vs-eventbridge': 'SNS・SQS・EventBridgeの違い',
  'iam-user-vs-role-vs-policy': 'IAMユーザー・IAMロール・IAMポリシーの違い',
  'cloudwatch-vs-cloudtrail-vs-config': 'CloudWatch・CloudTrail・AWS Configの違い',
  'alb-vs-nlb-vs-cloudfront': 'ALB・NLB・CloudFrontの違い',
  'multi-az-vs-read-replica': 'Multi-AZ・Read Replicaの違い',
  'security-group-vs-nacl': 'Security Group・NACLの違い',
};

const architectureLabels: LabelMap = {
  'static-site-s3-cloudfront': 'S3 + CloudFront 静的Webサイト構成',
  'serverless-api-basic': 'API Gateway + Lambda + DynamoDB サーバーレスAPI構成',
  'three-tier-vpc': 'VPC内3層Webアプリ構成',
  'high-availability-web-app': '高可用性Webアプリ構成',
  'eventbridge-lambda-batch': 'EventBridge + Lambda バッチ処理構成',
};

const questionLabels: LabelMap = {};

function uniqueValues(values: string[] | undefined): string[] {
  if (!values) {
    return [];
  }

  return Array.from(
    new Set(
      values
        .map((value) => value.trim())
        .filter((value) => value.length > 0),
    ),
  );
}

export function buildTermLinks(termIds: string[] | undefined): InternalLinkItem[] {
  return uniqueValues(termIds).map((termId) => ({
    type: 'term',
    href: `/terms/${termId}`,
    label: termLabels[termId] ?? termId,
    description: '関連するAWS用語を確認する',
  }));
}

export function buildComparisonLinks(slugs: string[] | undefined): InternalLinkItem[] {
  return uniqueValues(slugs).map((slug) => ({
    type: 'comparison',
    href: `/comparisons/${slug}`,
    label: comparisonLabels[slug] ?? slug,
    description: '似ているAWSサービスの違いを確認する',
  }));
}

export function buildArchitectureLinks(slugs: string[] | undefined): InternalLinkItem[] {
  return uniqueValues(slugs).map((slug) => ({
    type: 'architecture',
    href: `/architectures/${slug}`,
    label: architectureLabels[slug] ?? slug,
    description: 'AWS構成図でサービスの使われ方を確認する',
  }));
}

export function buildQuestionLinks(questionIds: string[] | undefined): InternalLinkItem[] {
  return uniqueValues(questionIds).map((questionId) => ({
    type: 'question',
    href: `/questions/${questionId}`,
    label: questionLabels[questionId] ?? `模擬問題 ${questionId.toUpperCase()}`,
    description: '関連する模擬問題で理解度を確認する',
  }));
}

export function buildRoadmapLink(): InternalLinkItem {
  return {
    type: 'roadmap',
    href: '/roadmap',
    label: 'AWS資格学習ロードマップ',
    description: 'Cloud PractitionerからSAAまでの学習順序を確認する',
  };
}

export function buildTermDetailInternalLinkSections(params: {
  relatedServices?: string[];
  comparisonSlugs?: string[];
  architectureSlugs?: string[];
  relatedQuestionIds?: string[];
}): InternalLinkSection[] {
  const sections: InternalLinkSection[] = [
    {
      title: '関連する比較記事',
      description: '似ているAWSサービスとの違いを整理できます。',
      links: buildComparisonLinks(params.comparisonSlugs),
    },
    {
      title: '関連する構成図',
      description: 'このサービスがAWS構成の中でどう使われるか確認できます。',
      links: buildArchitectureLinks(params.architectureSlugs),
    },
    {
      title: '関連する模擬問題',
      description: '資格試験での問われ方を確認できます。',
      links: buildQuestionLinks(params.relatedQuestionIds),
    },
    {
      title: 'あわせて確認したいAWS用語',
      description: '周辺サービスも確認すると理解がつながります。',
      links: buildTermLinks(params.relatedServices),
    },
  ];

  return sections.filter((section) => section.links.length > 0);
}

export function buildComparisonDetailInternalLinkSections(params: {
  serviceIds?: string[];
  relatedQuestionIds?: string[];
  nextComparisonSlugs?: string[];
}): InternalLinkSection[] {
  const sections: InternalLinkSection[] = [
    {
      title: '比較対象のAWS用語',
      description: '各サービスの基本説明を確認できます。',
      links: buildTermLinks(params.serviceIds),
    },
    {
      title: '関連する模擬問題',
      description: '比較内容が試験でどう問われるか確認できます。',
      links: buildQuestionLinks(params.relatedQuestionIds),
    },
    {
      title: '次に読む比較記事',
      description: '混同しやすいAWSサービスを続けて整理できます。',
      links: buildComparisonLinks(params.nextComparisonSlugs),
    },
  ];

  return sections.filter((section) => section.links.length > 0);
}

export function buildQuestionDetailInternalLinkSections(params: {
  relatedTerms?: string[];
  relatedServices?: string[];
  relatedComparisons?: string[];
  nextQuestionId?: string;
}): InternalLinkSection[] {
  const termIds = uniqueValues([
    ...(params.relatedTerms ?? []),
    ...(params.relatedServices ?? []),
  ]);

  const nextQuestionLinks: InternalLinkItem[] = params.nextQuestionId
    ? [
        {
          type: 'question',
          href: `/questions/${params.nextQuestionId}`,
          label: `次の問題 ${params.nextQuestionId.toUpperCase()}`,
          description: '続けて問題演習を進める',
        },
      ]
    : [];

  const sections: InternalLinkSection[] = [
    {
      title: '解説とあわせて確認したいAWS用語',
      description: '間違えた問題は、関連用語に戻って理解を補強します。',
      links: buildTermLinks(termIds),
    },
    {
      title: '関連する比較記事',
      description: '選択肢で迷いやすいサービスの違いを確認できます。',
      links: buildComparisonLinks(params.relatedComparisons),
    },
    {
      title: '次の問題',
      description: '問題演習を継続します。',
      links: nextQuestionLinks,
    },
  ];

  return sections.filter((section) => section.links.length > 0);
}

export function buildArchitectureDetailInternalLinkSections(params: {
  serviceIds?: string[];
  comparisonSlugs?: string[];
  relatedQuestionIds?: string[];
}): InternalLinkSection[] {
  const sections: InternalLinkSection[] = [
    {
      title: 'この構成で使うAWSサービス',
      description: '構成図に出てくるサービスの役割を確認できます。',
      links: buildTermLinks(params.serviceIds),
    },
    {
      title: '関連する比較記事',
      description: '設計判断で迷いやすいサービスの違いを確認できます。',
      links: buildComparisonLinks(params.comparisonSlugs),
    },
    {
      title: '関連する模擬問題',
      description: 'SAA・CLFでの問われ方を確認できます。',
      links: buildQuestionLinks(params.relatedQuestionIds),
    },
  ];

  return sections.filter((section) => section.links.length > 0);
}

export function buildBlogDetailInternalLinkSections(params: {
  relatedTerms?: string[];
  relatedComparisons?: string[];
  relatedQuestions?: string[];
  relatedArchitectures?: string[];
  relatedPosts?: InternalLinkItem[];
}): InternalLinkSection[] {
  const sections: InternalLinkSection[] = [
    {
      title: 'この記事と一緒に読むAWS用語',
      description: '記事内で出てきたAWSサービスを用語集で確認できます。',
      links: buildTermLinks(params.relatedTerms),
    },
    {
      title: '関連する比較記事',
      description: 'サービス選定で迷いやすいポイントを整理できます。',
      links: buildComparisonLinks(params.relatedComparisons),
    },
    {
      title: '関連する構成図',
      description: 'AWSサービスを実際の構成として確認できます。',
      links: buildArchitectureLinks(params.relatedArchitectures),
    },
    {
      title: '関連する模擬問題',
      description: '記事で学んだ内容を問題演習で確認できます。',
      links: buildQuestionLinks(params.relatedQuestions),
    },
    {
      title: '次に読む記事',
      description: '関連テーマの記事へ進みます。',
      links: params.relatedPosts ?? [],
    },
  ];

  return sections.filter((section) => section.links.length > 0);
}