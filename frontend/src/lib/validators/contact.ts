import type {
  ContactFormValues,
  ContactValidationError,
} from "@/types/contact";

export const CONTACT_FORM_LIMITS = {
  name: 100,
  email: 255,
  subject: 150,
  message: 2000,
} as const;

export type ContactFormLocale = "ja" | "en" | "zh";

const validationMessages = {
  ja: {
    nameRequired: "名前を入力してください。",
    nameTooLong: `名前は${CONTACT_FORM_LIMITS.name}文字以内で入力してください。`,
    emailRequired: "メールアドレスを入力してください。",
    emailInvalid: "正しいメールアドレスを入力してください。",
    subjectRequired: "件名を入力してください。",
    subjectTooLong: `件名は${CONTACT_FORM_LIMITS.subject}文字以内で入力してください。`,
    messageRequired: "本文を入力してください。",
    messageTooLong: `本文は${CONTACT_FORM_LIMITS.message.toLocaleString()}文字以内で入力してください。`,
  },
  en: {
    nameRequired: "Please enter your name.",
    nameTooLong: `Name must be ${CONTACT_FORM_LIMITS.name} characters or less.`,
    emailRequired: "Please enter your email address.",
    emailInvalid: "Please enter a valid email address.",
    subjectRequired: "Please enter a subject.",
    subjectTooLong: `Subject must be ${CONTACT_FORM_LIMITS.subject} characters or less.`,
    messageRequired: "Please enter your message.",
    messageTooLong: `Message must be ${CONTACT_FORM_LIMITS.message.toLocaleString()} characters or less.`,
  },
  zh: {
  nameRequired: "請輸入姓名。",
  nameTooLong: `姓名請控制在${CONTACT_FORM_LIMITS.name}字以內。`,
  emailRequired: "請輸入電子郵件地址。",
  emailInvalid: "請輸入有效的電子郵件地址。",
  subjectRequired: "請輸入主旨。",
  subjectTooLong: `主旨請控制在${CONTACT_FORM_LIMITS.subject}字以內。`,
  messageRequired: "請輸入內容。",
  messageTooLong: `內容請控制在${CONTACT_FORM_LIMITS.message.toLocaleString("zh-TW")}字以內。`,
  },
} as const satisfies Record<ContactFormLocale, Record<string, string>>;

export function isValidEmail(email: string): boolean {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return false;
  }

  if (trimmedEmail.length > CONTACT_FORM_LIMITS.email) {
    return false;
  }

  const pattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

  return pattern.test(trimmedEmail);
}

export function validateContactForm(
  values: ContactFormValues,
  locale: ContactFormLocale = "ja",
): ContactValidationError[] {
  const errors: ContactValidationError[] = [];
  const messages = validationMessages[locale];

  const name = values.name.trim();
  const email = values.email.trim();
  const subject = values.subject.trim();
  const message = values.message.trim();

  if (!name) {
    errors.push({
      field: "name",
      message: messages.nameRequired,
    });
  } else if (name.length > CONTACT_FORM_LIMITS.name) {
    errors.push({
      field: "name",
      message: messages.nameTooLong,
    });
  }

  if (!email) {
    errors.push({
      field: "email",
      message: messages.emailRequired,
    });
  } else if (!isValidEmail(email)) {
    errors.push({
      field: "email",
      message: messages.emailInvalid,
    });
  }

  if (!subject) {
    errors.push({
      field: "subject",
      message: messages.subjectRequired,
    });
  } else if (subject.length > CONTACT_FORM_LIMITS.subject) {
    errors.push({
      field: "subject",
      message: messages.subjectTooLong,
    });
  }

  if (!message) {
    errors.push({
      field: "message",
      message: messages.messageRequired,
    });
  } else if (message.length > CONTACT_FORM_LIMITS.message) {
    errors.push({
      field: "message",
      message: messages.messageTooLong,
    });
  }

  return errors;
}