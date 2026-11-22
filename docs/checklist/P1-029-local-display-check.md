# P1-029 Local Display Verification Checklist

## 1. Task information

| Item | Details |
|---|---|
| Task ID | P1-029 |
| Task name | Local display verification |
| Phase | Phase 1: Static website MVP |
| Purpose | Verify that the main pages render locally and navigation works |
| Test URL | http://localhost:3000 |
| Date performed |  |
| Performed by |  |

---

## 2. Prerequisites

| Check | Expected result | Result | Notes |
|---|---|---|---|
| Check `git status` | No unintended changes |  |  |
| Check `git branch` | The correct working branch is selected |  |  |
| Run `npm install` | Dependencies are installed |  |  |
| `npm run typecheck` succeeds | No TypeScript errors |  |  |
| `npm run lint` succeeds | No ESLint errors |  |  |
| `npm run dev` starts | The site is available on localhost |  |  |

---

## 3. Main page rendering

| URL | Page | Expected result | Result | Notes |
|---|---|---|---|---|
| `/` | Home | Site overview, CTAs, and main navigation are displayed |  |  |
| `/roadmap` | Learning roadmap | The learning path from CLF to SAA is displayed |  |  |
| `/terms` | AWS glossary | Glossary cards, search, and categories are displayed |  |  |
| `/terms/s3` | AWS glossary detail | Service overview, use cases, and exam points are displayed |  |  |
| `/comparisons` | Service comparisons | Comparison article cards are displayed |  |  |
| `/comparisons/s3-vs-ebs-vs-efs` | Service comparison detail | Comparison table, exam points, and related links are displayed |  |  |
| `/questions` | Practice question home | Links to practice questions are displayed |  |  |
| `/questions/clf` | CLF practice question list | The question list is displayed |  |  |
| `/questions/clf-001` | Practice question detail | Question text, choices, and the answer button are displayed |  |  |
| `/architectures` | Architectures | Architecture cards are displayed |  |  |
| `/architectures/static-site-s3-cloudfront` | Architecture detail | The diagram, services used, and design points are displayed |  |  |
| `/blog` | Blog | Article cards are displayed |  |  |
| `/blog/aws-free-tier-portfolio` | Blog post | Article content and related navigation are displayed |  |  |
| `/contact` | Contact | The input form is displayed |  |  |
| `/about` | About | Site operator information is displayed |  |  |
| `/privacy` | Privacy policy | Personal information and cookie explanations are displayed |  |  |
| `/disclaimer` | Disclaimer | Learning and exam information disclaimers are displayed |  |  |
| `/github` | GitHub landing page | Links to GitHub and the technology stack are displayed |  | Optional page |

---

## 4. Header navigation

| Link | Destination | Expected result | Result | Notes |
|---|---|---|---|---|
| Home | `/` | Opens the home page |  |  |
| Glossary | `/terms` | Opens the glossary list |  |  |
| Comparisons | `/comparisons` | Opens the comparison list |  |  |
| Practice questions | `/questions` | Opens the practice question home page |  |  |
| Architectures | `/architectures` | Opens the architecture list |  |  |
| Blog | `/blog` | Opens the blog list |  |  |
| Roadmap | `/roadmap` | Opens the roadmap |  |  |

---

## 5. Footer navigation

| Link | Destination | Expected result | Result | Notes |
|---|---|---|---|---|
| About | `/about` | Opens the about page |  |  |
| Contact | `/contact` | Opens the contact page |  |  |
| Privacy policy | `/privacy` | Opens the privacy policy |  |  |
| Disclaimer | `/disclaimer` | Opens the disclaimer |  |  |
| GitHub | `/github` or external GitHub URL | Opens the GitHub-related page |  |  |
| note | External note URL | Opens note |  | Optional |

---

## 6. Detail page navigation

| Starting point | Action | Expected result | Result | Notes |
|---|---|---|---|---|
| `/terms` | Click a glossary card | Opens `/terms/[termId]` |  |  |
| `/comparisons` | Click a comparison article card | Opens `/comparisons/[comparisonSlug]` |  |  |
| `/questions/clf` | Click a question card | Opens `/questions/[questionId]` |  |  |
| `/architectures` | Click an architecture card | Opens `/architectures/[architectureSlug]` |  |  |
| `/blog` | Click an article card | Opens `/blog/[postSlug]` |  |  |

---

## 7. Contact form

| Check | Expected result | Result | Notes |
|---|---|---|---|
| Name input | Accepts input |  |  |
| Email address input | Accepts input |  |  |
| Subject input | Accepts input |  |  |
| Message input | Accepts input |  |  |
| Submit button | Is displayed |  |  |
| Required fields left blank | An error is displayed or submission is prevented |  |  |
| Honeypot field | Is not visible on screen |  |  |

---

## 8. 404 behavior

| URL | Expected result | Result | Notes |
|---|---|---|---|
| `/not-found-test` | The 404 page is displayed |  |  |
| `/terms/not-existing-term` | A 404 or not-found message is displayed |  |  |
| `/questions/not-existing-question` | A 404 or not-found message is displayed |  |  |

---

## 9. Display quality

| Check | Expected result | Result | Notes |
|---|---|---|---|
| Desktop width | Layout remains intact |  |  |
| Tablet width | No horizontal scrolling |  |  |
| Mobile width | Text and buttons are not clipped |  |  |
| Header | Main navigation works |  |  |
| Footer | Trust-related pages can be reached |  |  |
| CTAs | Lead to the next learning action |  |  |
| Images | Are displayed |  |  |
| Long body text | Line width remains readable |  |  |

---

## 10. Verification summary

| Item | Status |
|---|---|
| Main page rendering | Not verified |
| Header navigation | Not verified |
| Footer navigation | Not verified |
| Detail page navigation | Not verified |
| Contact form UI | Not verified |
| 404 page | Not verified |
| Responsive layout | Not verified |
| P1-029 completion | Incomplete |

---

## 11. Issues found

| No. | Description | Affected URL | Priority | Resolution approach |
|---:|---|---|---|---|
| 1 |  |  |  |  |
| 2 |  |  |  |  |
| 3 |  |  |  |  |

---

## 12. Completion criteria

P1-029 is complete when all of the following are satisfied:

- `npm run dev` starts the local server
- The main pages in the MVP scope render
- List pages link successfully to detail pages
- Main header and footer links work
- The contact form UI is displayed
- The 404 page is displayed
- There are no major layout defects at desktop or mobile widths
