import type {
    ContactSubmitApiResponse,
    ContactSubmitPayload,
  } from "@/types/contact";
  
  const REQUEST_TIMEOUT_MS = 10000;
  
  export class ContactApiError extends Error {
    readonly statusCode?: number;
    readonly responseBody?: unknown;
  
    constructor(message: string, statusCode?: number, responseBody?: unknown) {
      super(message);
      this.name = "ContactApiError";
      this.statusCode = statusCode;
      this.responseBody = responseBody;
    }
  }
  
  function getApiBaseUrl(): string {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  
    if (!apiBaseUrl) {
      throw new ContactApiError(
        "API URLが設定されていません。NEXT_PUBLIC_API_BASE_URLを確認してください。",
      );
    }
  
    return apiBaseUrl.replace(/\/$/, "");
  }
  
  function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
  }
  
  function isContactSubmitApiResponse(
    value: unknown,
  ): value is ContactSubmitApiResponse {
    if (!isObject(value)) {
      return false;
    }
  
    return typeof value.success === "boolean";
  }
  
  function tryParseJson(text: string): unknown {
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }
  
  function unwrapLambdaProxyResponse(value: unknown): unknown {
    if (!isObject(value)) {
      return value;
    }
  
    const body = value.body;
  
    if (typeof body !== "string") {
      return value;
    }
  
    const parsedBody = tryParseJson(body);
  
    return parsedBody ?? value;
  }
  
  export async function submitContact(
    payload: ContactSubmitPayload,
  ): Promise<ContactSubmitApiResponse> {
    const apiBaseUrl = getApiBaseUrl();
    const endpoint = `${apiBaseUrl}/contact`;
  
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      controller.abort();
    }, REQUEST_TIMEOUT_MS);
  
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
  
      const responseText = await response.text();
      const parsedBody = tryParseJson(responseText);
      const unwrappedBody = unwrapLambdaProxyResponse(parsedBody);
  
      if (isContactSubmitApiResponse(unwrappedBody)) {
        return unwrappedBody;
      }
  
      if (!response.ok) {
        throw new ContactApiError(
          "問い合わせ送信に失敗しました。API Gateway、Lambda、CORS設定を確認してください。",
          response.status,
          unwrappedBody ?? responseText,
        );
      }
  
      console.error("Unexpected contact API response:", {
        status: response.status,
        endpoint,
        body: unwrappedBody ?? responseText,
      });
  
      throw new ContactApiError(
        "APIレスポンスの形式が想定と異なります。ブラウザのConsoleでUnexpected contact API responseを確認してください。",
        response.status,
        unwrappedBody ?? responseText,
      );
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new ContactApiError(
          "問い合わせ送信がタイムアウトしました。通信環境を確認して再度お試しください。",
        );
      }
  
      if (error instanceof ContactApiError) {
        throw error;
      }
  
      throw new ContactApiError(
        "問い合わせ送信中に通信エラーが発生しました。CORS設定またはAPI URLを確認してください。",
      );
    } finally {
      window.clearTimeout(timeoutId);
    }
  }