import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, it } from "vitest";

it.each(["zh", "ja", "en"])("publishes the AgentCore learning example with official references in %s", (locale) => {
  const article = readFileSync(
    resolve(__dirname, "../../../../contents/blog", locale, "agentcore-guardrails-vs-tool-authorization.mdx"),
    "utf8",
  );
  expect(article).toContain('postId: "blog-027"');
  expect(article).toContain("https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy.html");
  expect(article).toContain("https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-guardrails-in-policies.html");
  expect(article).toContain("suppressOutput");
  expect(article).toContain("ap-northeast-1");
  expect(article).toContain("ai-practitioner-01-domain5.html#ai-practitioner-01-domain5-task5-1");
  expect(article).toContain("https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html");
  expect(article).toContain("https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.html");
});
