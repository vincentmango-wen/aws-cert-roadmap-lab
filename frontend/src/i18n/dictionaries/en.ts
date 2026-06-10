import type { UiDictionary } from "./ja";

export const enDictionary: UiDictionary = {
  site: {
    name: "AWS Cert Roadmap Lab",
    shortName: "AWS Cert Roadmap Lab",
    tagline: "Cloud Practitioner / SAA Learning Site",
    description:
      "A learning site that organizes AWS Cloud Practitioner and Solutions Architect Associate topics through terms, comparisons, questions, and architecture diagrams.",
    independentNotice:
      "This site is an independent learning project and is not affiliated with Amazon Web Services.",
  },
  header: {
    skipToContent: "Skip to main content",
    homeAriaLabel: "Go to the AWS Cert Roadmap Lab homepage",
    desktopNavAriaLabel: "Main navigation",
    mobileNavAriaLabel: "Mobile navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  navigation: {
    home: "Home",
    terms: "Glossary",
    comparisons: "Comparisons",
    questions: "Practice Questions",
    architectures: "Architectures",
    blog: "Blog",
    roadmap: "Roadmap",
    contact: "Contact",
    about: "About",
    privacy: "Privacy Policy",
    disclaimer: "Disclaimer",
    github: "GitHub",
    note: "note",
    x: "X",
  },
  footer: {
    description:
      "A learning site that organizes AWS Cloud Practitioner and Solutions Architect Associate topics through terms, comparisons, questions, and architecture diagrams.",
    copyright:
      "© 2026 AWS Cert Roadmap Lab. This site is an independent learning project and is not affiliated with Amazon Web Services.",
    sections: {
      learning: {
        title: "Learning Content",
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
        title: "Site Information",
        linkKeys: ["about", "contact", "privacy", "disclaimer"],
      },
      portfolio: {
        title: "Portfolio",
        linkKeys: ["github", "note", "x"],
      },
    },
  },
  languageSwitcher: {
    label: "Language",
    ariaLabel: "Switch display language",
    currentLanguage: "Current language",
    switchTo: "View in this language",
  },
  common: {
    readMore: "Read more",
    viewDetails: "View details",
    backToList: "Back to list",
    next: "Next",
    previous: "Previous",
    updatedAt: "Updated",
    publishedAt: "Published",
    relatedLinks: "Related links",
    externalLinkSuffix: "External link",
  },
  cta: {
    startQuestions: "Start practice questions",
    viewTerms: "View glossary",
    viewComparisons: "View service comparisons",
    viewArchitectures: "View AWS architecture diagrams",
    readBlog: "Read the blog",
    viewRoadmap: "View roadmap",
    contactUs: "Contact us",
    viewGitHub: "View GitHub",
    nextStepLabel: "Next Step",
    learnWithComparisonsAndQuestions:
      "After learning the terms, review them with comparisons and questions",
  },
  search: {
    keywordSearch: "Keyword search",
    termSearchPlaceholder: "Example: S3, Lambda, security",
    blogSearchPlaceholder:
      "Search by article title, category, or AWS service name",
    noResultsTitle: "No matching results found",
    noResultsDescription:
      "Change the keyword, category, or exam filter and try again.",
    displayedCountSuffix: "results shown",
    keywordBadgeLabel: "keyword",
  },
  filters: {
    category: "Category",
    exam: "Exam",
    difficulty: "Difficulty",
    all: "All",
    categoryLabels: {
      All: "All",
      Compute: "Compute",
      Storage: "Storage",
      Database: "Database",
      Networking: "Networking",
      Security: "Security",
      Monitoring: "Monitoring and Logging",
      Integration: "Application Integration",
      Management: "Management",
      Analytics: "Analytics",
    },
    levelLabels: {
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Advanced",
    },
  },
  breadcrumb: {
    home: "Home",
  },
  forms: {
    contact: {
      name: "Name",
      email: "Email address",
      subject: "Subject",
      message: "Message",
      honeypot: "Do not fill this field",
      submit: "Submit",
      sending: "Sending",
      successTitle: "Message sent",
      successMessage: "Your inquiry has been received.",
      errorTitle: "Could not send message",
      errorMessage:
        "Check your input and try again after a short interval.",
    },
  },
  errors: {
    required: "This field is required.",
    invalidEmail: "Enter a valid email address.",
    tooLong: "The input exceeds the maximum length.",
    unexpected: "An unexpected error occurred.",
  },
  notFound: {
    title: "Page not found",
    description: "The URL may have changed or the page may have been removed.",
    backHome: "Back to homepage",
  },
};