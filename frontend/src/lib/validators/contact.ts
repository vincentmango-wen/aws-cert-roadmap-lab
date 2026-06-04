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
  ): ContactValidationError[] {
    const errors: ContactValidationError[] = [];
  
    const name = values.name.trim();
    const email = values.email.trim();
    const subject = values.subject.trim();
    const message = values.message.trim();
  
    if (!name) {
      errors.push({
        field: "name",
        message: "名前を入力してください。",
      });
    } else if (name.length > CONTACT_FORM_LIMITS.name) {
      errors.push({
        field: "name",
        message: `名前は${CONTACT_FORM_LIMITS.name}文字以内で入力してください。`,
      });
    }
  
    if (!email) {
      errors.push({
        field: "email",
        message: "メールアドレスを入力してください。",
      });
    } else if (!isValidEmail(email)) {
      errors.push({
        field: "email",
        message: "正しいメールアドレスを入力してください。",
      });
    }
  
    if (!subject) {
      errors.push({
        field: "subject",
        message: "件名を入力してください。",
      });
    } else if (subject.length > CONTACT_FORM_LIMITS.subject) {
      errors.push({
        field: "subject",
        message: `件名は${CONTACT_FORM_LIMITS.subject}文字以内で入力してください。`,
      });
    }
  
    if (!message) {
      errors.push({
        field: "message",
        message: "本文を入力してください。",
      });
    } else if (message.length > CONTACT_FORM_LIMITS.message) {
      errors.push({
        field: "message",
        message: `本文は${CONTACT_FORM_LIMITS.message.toLocaleString()}文字以内で入力してください。`,
      });
    }
  
    return errors;
  }