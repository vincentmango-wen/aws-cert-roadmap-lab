/**
 * 公式ドキュメントリンクの型定義（SSoT）。
 * Question / Term の両コンテンツ種別で共有する。
 *
 * @see frontend/src/lib/official-doc.ts - URL 検証ヘルパー
 */
export type OfficialDoc = {
  label: string;
  url: string;
};
