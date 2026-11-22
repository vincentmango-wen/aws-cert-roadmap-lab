# Design Documents

This directory contains the design documents for AWS Cert Roadmap Lab.

Use these documents as the basis for implementation work.

For learning-content changes, follow the [reader-facing correction and editorial provenance policy](seo/content-policy.md#16-reader-facing-corrections-and-editorial-provenance).

---

## Purpose

The goals of `docs/designs/` are to:

- Centralize requirements, screens, APIs, data, AWS architecture, and operational policies
- Identify the design documents to consult during implementation
- Make the design process explainable as part of the portfolio
- Make it possible to compare the design with the implementation during future changes

## Documentation and content language

Developer documentation, code comments, and Issue/PR descriptions are maintained in English. The project README is the exception: English is the main entry point, with matching Japanese and Taiwan Traditional Chinese versions. Website learning content remains available in Japanese, English, and Traditional Chinese, with Taiwan Traditional Chinese as the primary content priority. Localized examples, search queries, and test specimens may retain their original language when it is needed to explain or verify the design.

Older design documents describe the scope and decisions at the time they were written. The long-term direction is to cover all AWS certifications; that does not imply that the historical MVP or the current content already covers them all. The root README records the current direction without changing existing language URLs.

---

## Planned design documents

| Filename | Content | Priority |
|---|---|---|
| `01_project_proposal.md` | Project proposal | High |
| `02_requirements_definition.md` | Requirements definition | High |
| `03_screen_transition_design.md` | Page inventory and navigation design | High |
| `04_aws_architecture_design.md` | AWS architecture design | High |
| `05_data_design.md` | Data design | High |
| `06_api_design.md` | API design | High |
| `07_security_design.md` | Security design | High |
| `08_cost_management_design.md` | Cost management design | High |
| `09_infrastructure_build_guide.md` | Infrastructure setup guide | High |
| `10_lambda_design..md` | Lambda implementation design | High |
| `11_cicd_design.md` | CI/CD design | Medium |
| `12_operation_design.md` | Operational monitoring design | Medium |
| `13_development_tasks.md` | Development task list | High |
| `14_readme_draft.md.md` | README draft | Medium |

The Lambda design and README draft filenames above match the existing files, including their original extra periods/extensions.

---

## Naming convention

Use numbered snake_case filenames to make the intended reading order clear.

Format:

```text
<number>_<document_name>.md
```
