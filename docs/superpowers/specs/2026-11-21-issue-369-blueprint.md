# Issue #369: AIF-C01 question-bank blueprint

Status: written before item drafting. Source language: Taiwan Traditional Chinese; preserve the decision, context, option meaning, answer key and reference URLs in Japanese and English. No exam dumps, recollections, official sample copying, or claims that this single-answer bank duplicates AWS's exam formats.

| Domain | Scored weight | Count | Item IDs | Task map (in item order) |
|---|---:|---:|---|---|
| Fundamentals of AI and ML | 20% | 6 | 001–006 | 1.1, 1.2, 1.2, 1.3, 1.3, 1.1 |
| Fundamentals of GenAI | 24% | 7 | 007–013 | 2.1, 2.1, 2.1, 2.2, 2.2, 2.3, 2.3 |
| Applications of Foundation Models | 28% | 9 | 014–022 | 3.1, 3.1, 3.1, 3.2, 3.2, 3.2, 3.3, 3.4, 3.4 |
| Guidelines for Responsible AI | 14% | 4 | 023–026 | 4.1, 4.1, 4.2, 4.2 |
| Security, Compliance, and Governance for AI Solutions | 14% | 4 | 027–030 | 5.1, 5.1, 5.2, 5.2 |

Guide: https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.html . Contract category labels preserve the guide wording; the domain field prefixes each label with “Domain n:”. Mix follows the requested 6/7/9/4/4 and approximates, not duplicates, the official weights.

| ID suffix | Decision or misconception tested | Difficulty |
|---|---|---|
| 001 | Known labeled outcomes imply supervised classification | easy |
| 002 | Discover unlabeled groups via clustering, not classification or regression | easy |
| 003 | Use Textract for forms with structured fields | normal |
| 004 | Prevent leakage with chronological splits and point-in-time features | hard |
| 005 | Measure false-negative sensitivity via recall | normal |
| 006 | Choose batch inference for a daily workload without interactive SLA | normal |
| 007 | Context window accounts for input and intended output | normal |
| 008 | Semantic retrieval compares embeddings, not token IDs | easy |
| 009 | Paired text/photo analysis requires a multimodal model | easy |
| 010 | Generated citation still needs checking against evidence | easy |
| 011 | Do not present uncertain model outputs as deterministic calculations | normal |
| 012 | Managed model API without managing model servers: Amazon Bedrock | easy |
| 013 | Reusable prefix and eligible repeated requests: prompt caching | normal |
| 014 | Retrieve frequently changing private information at inference by RAG | normal |
| 015 | Preserve filterable metadata and vector retrieval in OpenSearch | normal |
| 016 | Agent selects an approved tool to look up dynamic external state | normal |
| 017 | Few-shot examples constrain output structure without training | easy |
| 018 | Quarantine retrieved instructions as untrusted data | hard |
| 019 | Roll out versioned prompts, not model versions, for reproducibility | normal |
| 020 | Remove duplicates, redact sensitive information, separate evaluation before fine-tuning | hard |
| 021 | Compare grounded claims with cited passages on the same evaluation set | hard |
| 022 | Measure actual successful task completion per dollar spent | normal |
| 023 | Measure error differences across representative subgroups | normal |
| 024 | Apply sensitive-information filtering with synthetic positive/negative tests | normal |
| 025 | Use model cards to document intended use, limitations and evaluation | easy |
| 026 | Give affected users an understandable explanation and review channel | normal |
| 027 | Detect sensitive data in S3 with Macie, not payload filtering | normal |
| 028 | Bedrock interface endpoint meets private service connectivity goal | normal |
| 029 | CloudTrail audits management actions, not prompt/response contents | normal |
| 030 | Artifact supplies AWS compliance reports, not application certification | easy |

Plan: ground each item in an AWS guide or product page and include task mapping, four differentiated alternatives and choice-level rationale. Publish only after validation of 30 IDs per locale, distribution and exact structural parity, no normalized text collisions with current question bank, source URL integrity, and solution review. Keys distributed A/B/C/D = 8/8/7/7 in a non-cycling order. Authoring keeps the correct option first in the working source only; export applies the fixed key and rotates distractors without changing rationale alignment. Omit unrelated cross-links and unsupported claims about service eligibility, model coverage or region.

## Primary source and key manifest

| Item | Task | Key | Item reference (in addition to AWS exam guide) |
|---|---:|:---:|---|
| aif-c01-001 | 1.1 | C | [Supervised learning](https://aws.amazon.com/what-is/supervised-learning/) |
| aif-c01-002 | 1.2 | D | [Unsupervised learning](https://aws.amazon.com/what-is/unsupervised-learning/) |
| aif-c01-003 | 1.2 | A | [Amazon Textract: Form data](https://docs.aws.amazon.com/textract/latest/dg/how-it-works-kvp.html) |
| aif-c01-004 | 1.3 | B | [AWS Prescriptive Guidance: Successful MLOps](https://docs.aws.amazon.com/pdfs/prescriptive-guidance/latest/ml-operations-planning/ml-operations-planning.pdf) |
| aif-c01-005 | 1.3 | D | [Amazon SageMaker AI: Metrics and validation](https://docs.aws.amazon.com/sagemaker/latest/dg/autopilot-metrics-validation.html) |
| aif-c01-006 | 1.1 | B | [Amazon SageMaker AI: Batch transform](https://docs.aws.amazon.com/sagemaker/latest/dg/batch-transform.html) |
| aif-c01-007 | 2.1 | A | [Amazon Bedrock: Model specifications example](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-amazon-nova-2-lite.html) |
| aif-c01-008 | 2.1 | D | [Amazon Bedrock: Titan Text Embeddings](https://docs.aws.amazon.com/bedrock/latest/userguide/titan-embedding-models.html) |
| aif-c01-009 | 2.1 | C | [Amazon Bedrock: Input and output modalities](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-amazon-nova-2-lite.html) |
| aif-c01-010 | 2.2 | D | [AWS Prescriptive Guidance: Grounding and RAG](https://docs.aws.amazon.com/prescriptive-guidance/latest/agentic-ai-serverless/grounding-and-rag.html) |
| aif-c01-011 | 2.2 | C | [Amazon Bedrock: Inference parameters](https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters.html) |
| aif-c01-012 | 2.3 | C | [Amazon Bedrock: Overview](https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html) |
| aif-c01-013 | 2.3 | B | [Amazon Bedrock: Prompt caching](https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html) |
| aif-c01-014 | 3.1 | A | [Amazon Bedrock Knowledge Bases](https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base.html) |
| aif-c01-015 | 3.1 | B | [Amazon OpenSearch Service: Vector search](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless-vector-search.html) |
| aif-c01-016 | 3.1 | C | [Amazon Bedrock: Agents](https://docs.aws.amazon.com/bedrock/latest/userguide/agents.html) |
| aif-c01-017 | 3.2 | D | [Amazon Bedrock: Prompt engineering concepts](https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-engineering-guidelines.html) |
| aif-c01-018 | 3.2 | A | [Amazon Bedrock Guardrails: Prompt attacks](https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails-prompt-attack.html) |
| aif-c01-019 | 3.2 | A | [Amazon Bedrock: Prompt Management](https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-management.html) |
| aif-c01-020 | 3.3 | B | [Amazon Bedrock: Fine-tuning data](https://docs.aws.amazon.com/bedrock/latest/userguide/model-customization-prepare.html) |
| aif-c01-021 | 3.4 | B | [Amazon Bedrock: RAG evaluation metrics](https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base-eval-llm-results.html) |
| aif-c01-022 | 3.4 | C | [Amazon Bedrock: Evaluation](https://docs.aws.amazon.com/bedrock/latest/userguide/evaluation.html) |
| aif-c01-023 | 4.1 | D | [Amazon Transcribe: Responsible AI service card](https://docs.aws.amazon.com/ai/responsible-ai/transcribe-speech-recognition/overview.html) |
| aif-c01-024 | 4.1 | C | [Amazon Bedrock Guardrails: Sensitive information filters](https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails-sensitive-filters.html) |
| aif-c01-025 | 4.2 | A | [Amazon SageMaker Model Cards](https://docs.aws.amazon.com/sagemaker/latest/dg/model-cards.html) |
| aif-c01-026 | 4.2 | A | [AWS Well-Architected: Human oversight](https://docs.aws.amazon.com/wellarchitected/latest/responsible-ai-lens/raiuc04-bp02.html) |
| aif-c01-027 | 5.1 | B | [Amazon Macie: Overview](https://docs.aws.amazon.com/macie/latest/user/what-is-macie.html) |
| aif-c01-028 | 5.1 | B | [Amazon Bedrock: AWS PrivateLink](https://docs.aws.amazon.com/bedrock/latest/userguide/vpc-interface-endpoints.html) |
| aif-c01-029 | 5.2 | A | [Amazon Bedrock: AWS CloudTrail](https://docs.aws.amazon.com/bedrock/latest/userguide/logging-using-cloudtrail.html) |
| aif-c01-030 | 5.2 | D | [AWS Artifact: Overview](https://docs.aws.amazon.com/artifact/latest/ug/what-is-aws-artifact.html) |
