import type { ArticleCandidate, ArticleTranslation, Locale } from "../../types";

// Literal snapshots parsed from master f0fdd05 before the Nov 18 corrections.
// Never derive historical notes from the current article bodies.
const snapshots: Record<string, Record<Locale, Pick<ArticleTranslation, "updatedAt" | "correctionNotes">>> = {
  "arc-007": {
    "ja": {
      "updatedAt": "2026-11-09",
      "correctionNotes": {
        "entries": [
          {
            "date": "2026-11-09",
            "blocks": [
              {
                "type": "list",
                "ordered": false,
                "items": [
                  [
                    {
                      "type": "paragraph",
                      "children": [
                        {
                          "type": "text",
                          "value": "SQS が常に順番どおりに処理するかのような説明を訂正しました。Standard では重複や順序の入れ替わりがあり、FIFO の順序保証はメッセージグループ単位です。重複排除は業務上の副作用が一度だけ起きる保証ではなく、コンシューマーにも冪等性が必要であることを追記しました。"
                        }
                      ]
                    }
                  ]
                ]
              },
              {
                "type": "paragraph",
                "children": [
                  {
                    "type": "text",
                    "value": "参照資料："
                  },
                  {
                    "type": "link",
                    "href": "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/standard-queues.html",
                    "children": [
                      {
                        "type": "text",
                        "value": "SQS Standard"
                      }
                    ]
                  },
                  {
                    "type": "text",
                    "value": " / "
                  },
                  {
                    "type": "link",
                    "href": "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues-understanding-logic.html",
                    "children": [
                      {
                        "type": "text",
                        "value": "SQS FIFO"
                      }
                    ]
                  },
                  {
                    "type": "text",
                    "value": "."
                  }
                ]
              }
            ]
          }
        ],
        "errors": []
      }
    },
    "en": {
      "updatedAt": "2026-11-09",
      "correctionNotes": {
        "entries": [
          {
            "date": "2026-11-09",
            "blocks": [
              {
                "type": "list",
                "ordered": false,
                "items": [
                  [
                    {
                      "type": "paragraph",
                      "children": [
                        {
                          "type": "text",
                          "value": "Corrected wording that implied SQS always processes messages in order: Standard can duplicate or reorder messages, while FIFO ordering is scoped to a message group. Added that deduplication does not guarantee exactly-once business side effects and consumers still need idempotency."
                        }
                      ]
                    }
                  ]
                ]
              },
              {
                "type": "paragraph",
                "children": [
                  {
                    "type": "text",
                    "value": "References："
                  },
                  {
                    "type": "link",
                    "href": "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/standard-queues.html",
                    "children": [
                      {
                        "type": "text",
                        "value": "SQS Standard"
                      }
                    ]
                  },
                  {
                    "type": "text",
                    "value": " / "
                  },
                  {
                    "type": "link",
                    "href": "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues-understanding-logic.html",
                    "children": [
                      {
                        "type": "text",
                        "value": "SQS FIFO"
                      }
                    ]
                  },
                  {
                    "type": "text",
                    "value": "."
                  }
                ]
              }
            ]
          }
        ],
        "errors": []
      }
    },
    "zh": {
      "updatedAt": "2026-11-09",
      "correctionNotes": {
        "entries": [
          {
            "date": "2026-11-09",
            "blocks": [
              {
                "type": "list",
                "ordered": false,
                "items": [
                  [
                    {
                      "type": "paragraph",
                      "children": [
                        {
                          "type": "text",
                          "value": "更正將 SQS 一概描述為依序處理的文字：Standard 可能重複或亂序，FIFO 的順序範圍是訊息群組；補充去重不等於業務副作用只執行一次，消費端仍須處理冪等性。"
                        }
                      ]
                    }
                  ]
                ]
              },
              {
                "type": "paragraph",
                "children": [
                  {
                    "type": "text",
                    "value": "依據："
                  },
                  {
                    "type": "link",
                    "href": "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/standard-queues.html",
                    "children": [
                      {
                        "type": "text",
                        "value": "SQS Standard"
                      }
                    ]
                  },
                  {
                    "type": "text",
                    "value": " / "
                  },
                  {
                    "type": "link",
                    "href": "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues-understanding-logic.html",
                    "children": [
                      {
                        "type": "text",
                        "value": "SQS FIFO"
                      }
                    ]
                  },
                  {
                    "type": "text",
                    "value": "."
                  }
                ]
              }
            ]
          }
        ],
        "errors": []
      }
    }
  },
  "arc-008": {
    "ja": {
      "updatedAt": "2026-06-21",
      "correctionNotes": {
        "entries": [],
        "errors": []
      }
    },
    "en": {
      "updatedAt": "2026-06-21",
      "correctionNotes": {
        "entries": [],
        "errors": []
      }
    },
    "zh": {
      "updatedAt": "2026-06-21",
      "correctionNotes": {
        "entries": [],
        "errors": []
      }
    }
  }
};

export function beforeIssue348Batch2Corrections(articles: ArticleCandidate[]): ArticleCandidate[] {
  const historical = structuredClone(articles);
  for (const article of historical) {
    if (article.kind !== "architecture" || !snapshots[article.id]) continue;
    for (const locale of ["ja", "en", "zh"] as const) {
      const translation = article.translations[locale];
      if (!translation) continue;
      Object.assign(translation, structuredClone(snapshots[article.id][locale]));
    }
  }
  return historical;
}
