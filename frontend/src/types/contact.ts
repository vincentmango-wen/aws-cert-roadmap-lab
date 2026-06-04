export type ContactFormField =
  | "name"
  | "email"
  | "subject"
  | "message"
  | "honeypot";

export type ContactFormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot: string;
};

export type ContactSubmitPayload = ContactFormValues & {
  sourcePage: string;
};

export type ContactValidationError = {
  field: ContactFormField;
  message: string;
};

export type ContactFieldErrors = Partial<Record<ContactFormField, string>>;

export type ContactSubmitSuccessData = {
  contactId: string | null;
  status: string;
};

export type ApiErrorDetail = {
  field?: string;
  message: string;
};

export type ContactSubmitSuccessResponse = {
  success: true;
  data: ContactSubmitSuccessData;
  message: string;
  requestId: string;
};

export type ContactSubmitErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: ApiErrorDetail[];
  };
  requestId: string;
};

export type ContactSubmitApiResponse =
  | ContactSubmitSuccessResponse
  | ContactSubmitErrorResponse;