"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useState,
} from "react";

type ContactFormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot: string;
};

type ContactFormField = keyof ContactFormValues;

type ContactFormErrors = Partial<Record<ContactFormField, string>>;

type SubmitStatus = "idle" | "success" | "error";

const initialValues: ContactFormValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
  honeypot: "",
};

const maxLengths = {
  name: 100,
  email: 255,
  subject: 150,
  message: 2000,
} as const;

function isValidEmail(email: string): boolean {
  const trimmedEmail = email.trim();

  if (trimmedEmail.length === 0 || trimmedEmail.length > maxLengths.email) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
}

function validateContactForm(values: ContactFormValues): ContactFormErrors {
  const errors: ContactFormErrors = {};

  const name = values.name.trim();
  const email = values.email.trim();
  const subject = values.subject.trim();
  const message = values.message.trim();

  if (name.length === 0) {
    errors.name = "名前を入力してください。";
  } else if (name.length > maxLengths.name) {
    errors.name = `名前は${maxLengths.name}文字以内で入力してください。`;
  }

  if (email.length === 0) {
    errors.email = "メールアドレスを入力してください。";
  } else if (!isValidEmail(email)) {
    errors.email = "正しいメールアドレスを入力してください。";
  }

  if (subject.length === 0) {
    errors.subject = "件名を入力してください。";
  } else if (subject.length > maxLengths.subject) {
    errors.subject = `件名は${maxLengths.subject}文字以内で入力してください。`;
  }

  if (message.length === 0) {
    errors.message = "本文を入力してください。";
  } else if (message.length > maxLengths.message) {
    errors.message = `本文は${maxLengths.message.toLocaleString()}文字以内で入力してください。`;
  }

  if (values.honeypot.trim().length > 0) {
    errors.honeypot = "送信に失敗しました。時間をおいて再度お試しください。";
  }

  return errors;
}

export function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>(initialValues);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");

  const messageLength = values.message.length;

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void {
    const { name, value } = event.target;
    const fieldName = name as ContactFormField;

    setValues((currentValues) => ({
      ...currentValues,
      [fieldName]: value,
    }));

    setErrors((currentErrors) => {
      if (!(fieldName in currentErrors)) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[fieldName];

      return nextErrors;
    });

    if (submitStatus !== "idle") {
      setSubmitStatus("idle");
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const validationErrors = validateContactForm(values);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitStatus("error");
      return;
    }

    setValues(initialValues);
    setErrors({});
    setSubmitStatus("success");
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        <div>
          <label
            className="block text-sm font-semibold text-slate-900"
            htmlFor="name"
          >
            名前
            <span className="ml-1 text-red-600" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={values.name}
            onChange={handleChange}
            maxLength={maxLengths.name}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            autoComplete="name"
            className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-950 shadow-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            placeholder="山田 太郎"
          />
          {errors.name ? (
            <p id="name-error" className="mt-2 text-sm text-red-700">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label
            className="block text-sm font-semibold text-slate-900"
            htmlFor="email"
          >
            メールアドレス
            <span className="ml-1 text-red-600" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            maxLength={maxLengths.email}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            autoComplete="email"
            className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-950 shadow-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            placeholder="example@example.com"
          />
          {errors.email ? (
            <p id="email-error" className="mt-2 text-sm text-red-700">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label
            className="block text-sm font-semibold text-slate-900"
            htmlFor="subject"
          >
            件名
            <span className="ml-1 text-red-600" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            value={values.subject}
            onChange={handleChange}
            maxLength={maxLengths.subject}
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={errors.subject ? "subject-error" : undefined}
            className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-950 shadow-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            placeholder="S3の記事について"
          />
          {errors.subject ? (
            <p id="subject-error" className="mt-2 text-sm text-red-700">
              {errors.subject}
            </p>
          ) : null}
        </div>

        <div>
          <div className="flex items-end justify-between gap-4">
            <label
              className="block text-sm font-semibold text-slate-900"
              htmlFor="message"
            >
              本文
              <span className="ml-1 text-red-600" aria-hidden="true">
                *
              </span>
            </label>
            <span className="text-xs text-slate-500">
              {messageLength.toLocaleString()} /{" "}
              {maxLengths.message.toLocaleString()}文字
            </span>
          </div>
          <textarea
            id="message"
            name="message"
            value={values.message}
            onChange={handleChange}
            maxLength={maxLengths.message}
            rows={8}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "message-error" : undefined}
            className="mt-2 w-full resize-y rounded-2xl border border-slate-300 px-4 py-3 text-sm leading-7 text-slate-950 shadow-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            placeholder="問い合わせ内容を入力してください。記事の誤り報告の場合は、対象ページやAWSサービス名も書いてください。"
          />
          {errors.message ? (
            <p id="message-error" className="mt-2 text-sm text-red-700">
              {errors.message}
            </p>
          ) : null}
        </div>

        <div className="hidden" aria-hidden="true">
          <label htmlFor="honeypot">この欄は入力しないでください</label>
          <input
            id="honeypot"
            name="honeypot"
            type="text"
            value={values.honeypot}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {errors.honeypot ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {errors.honeypot}
          </p>
        ) : null}

        {submitStatus === "success" ? (
          <p className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            入力内容を確認しました。API接続後は、この内容を問い合わせAPIへ送信します。
          </p>
        ) : null}

        {submitStatus === "error" && Object.keys(errors).length > 0 ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            入力内容に誤りがあります。赤字の項目を修正してください。
          </p>
        ) : null}

        <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-6 text-slate-500">
            送信内容にはAWSアクセスキー、パスワード、APIキーなどの秘密情報を含めないでください。
          </p>

          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-2xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
          >
            送信する
          </button>
        </div>
      </form>
    </section>
  );
}