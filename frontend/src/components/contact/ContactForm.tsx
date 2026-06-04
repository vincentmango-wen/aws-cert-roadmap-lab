"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { submitContact } from "@/lib/api/contact";
import { validateContactForm } from "@/lib/validators/contact";
import type {
  ContactFieldErrors,
  ContactFormField,
  ContactFormValues,
} from "@/types/contact";

const initialValues: ContactFormValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
  honeypot: "",
};

type SubmitStatus = "idle" | "submitting" | "success" | "error";

function buildFieldErrors(
  errors: { field: ContactFormField; message: string }[],
): ContactFieldErrors {
  return errors.reduce<ContactFieldErrors>((accumulator, error) => {
    accumulator[error.field] = error.message;
    return accumulator;
  }, {});
}

function getApiFieldErrors(details: { field?: string; message: string }[]) {
  return details.reduce<ContactFieldErrors>((accumulator, detail) => {
    if (
      detail.field === "name" ||
      detail.field === "email" ||
      detail.field === "subject" ||
      detail.field === "message" ||
      detail.field === "honeypot"
    ) {
      accumulator[detail.field] = detail.message;
    }

    return accumulator;
  }, {});
}

export default function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [message, setMessage] = useState<string>("");

  const isSubmitting = status === "submitting";

  const remainingMessageLength = useMemo(() => {
    return 2000 - values.message.length;
  }, [values.message.length]);

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    if (
      name !== "name" &&
      name !== "email" &&
      name !== "subject" &&
      name !== "message" &&
      name !== "honeypot"
    ) {
      return;
    }

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));

    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [name]: undefined,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatus("submitting");
    setMessage("");
    setFieldErrors({});

    const validationErrors = validateContactForm(values);

    if (validationErrors.length > 0) {
      setFieldErrors(buildFieldErrors(validationErrors));
      setStatus("error");
      setMessage("入力内容を確認してください。");
      return;
    }

    try {
      const sourcePage =
        typeof window === "undefined" ? "/contact" : window.location.pathname;

      const response = await submitContact({
        name: values.name.trim(),
        email: values.email.trim(),
        subject: values.subject.trim(),
        message: values.message.trim(),
        sourcePage,
        honeypot: values.honeypot,
      });

      if (!response.success) {
        const apiFieldErrors = response.error.details
          ? getApiFieldErrors(response.error.details)
          : {};

        setFieldErrors(apiFieldErrors);
        setStatus("error");
        setMessage(response.error.message);
        return;
      }

      setStatus("success");
      setMessage(response.message || "お問い合わせを受け付けました。");
      setValues(initialValues);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "問い合わせ送信中にエラーが発生しました。";

      setStatus("error");
      setMessage(errorMessage);
    }
  }

  function getInputClassName(field: ContactFormField): string {
    const baseClassName =
      "mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:ring-2";

    if (fieldErrors[field]) {
      return `${baseClassName} border-red-400 focus:border-red-500 focus:ring-red-100`;
    }

    return `${baseClassName} border-slate-300 focus:border-blue-500 focus:ring-blue-100`;
  }

  return (
    <form
      className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="space-y-6">
        <div>
          <label
            className="block text-sm font-semibold text-slate-800"
            htmlFor="name"
          >
            名前
            <span className="ml-1 text-red-500" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={values.name}
            onChange={handleChange}
            className={getInputClassName("name")}
            autoComplete="name"
            maxLength={100}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? "name-error" : undefined}
            disabled={isSubmitting}
          />
          {fieldErrors.name ? (
            <p id="name-error" className="mt-2 text-sm text-red-600">
              {fieldErrors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label
            className="block text-sm font-semibold text-slate-800"
            htmlFor="email"
          >
            メールアドレス
            <span className="ml-1 text-red-500" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            className={getInputClassName("email")}
            autoComplete="email"
            maxLength={255}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
            disabled={isSubmitting}
          />
          {fieldErrors.email ? (
            <p id="email-error" className="mt-2 text-sm text-red-600">
              {fieldErrors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label
            className="block text-sm font-semibold text-slate-800"
            htmlFor="subject"
          >
            件名
            <span className="ml-1 text-red-500" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            value={values.subject}
            onChange={handleChange}
            className={getInputClassName("subject")}
            maxLength={150}
            aria-invalid={Boolean(fieldErrors.subject)}
            aria-describedby={
              fieldErrors.subject ? "subject-error" : undefined
            }
            disabled={isSubmitting}
          />
          {fieldErrors.subject ? (
            <p id="subject-error" className="mt-2 text-sm text-red-600">
              {fieldErrors.subject}
            </p>
          ) : null}
        </div>

        <div>
          <label
            className="block text-sm font-semibold text-slate-800"
            htmlFor="message"
          >
            本文
            <span className="ml-1 text-red-500" aria-hidden="true">
              *
            </span>
          </label>
          <textarea
            id="message"
            name="message"
            value={values.message}
            onChange={handleChange}
            className={`${getInputClassName("message")} min-h-40 resize-y`}
            maxLength={2000}
            aria-invalid={Boolean(fieldErrors.message)}
            aria-describedby={
              fieldErrors.message ? "message-error" : "message-count"
            }
            disabled={isSubmitting}
          />
          <div className="mt-2 flex items-start justify-between gap-4">
            {fieldErrors.message ? (
              <p id="message-error" className="text-sm text-red-600">
                {fieldErrors.message}
              </p>
            ) : (
              <p className="text-sm text-slate-500">
                AWS記事の誤り報告、ポートフォリオへの質問、仕事相談などを送信できます。
              </p>
            )}
            <p id="message-count" className="shrink-0 text-sm text-slate-500">
              残り {remainingMessageLength.toLocaleString()} 文字
            </p>
          </div>
        </div>

        <div
          className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
          aria-hidden="true"
        >
          <label htmlFor="honeypot">この項目は入力しないでください</label>
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

        {message ? (
          <div
            className={
              status === "success"
                ? "rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
                : "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            }
            role="status"
          >
            {message}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? "送信中..." : "問い合わせを送信する"}
        </button>
      </div>
    </form>
  );
}