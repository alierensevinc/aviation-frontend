import { Message } from "../store/useChatStore";

const API_URL = "https://aviation-backend-rho.vercel.app/api/chat";
const APP_SECRET = process.env.EXPO_PUBLIC_APP_VARIANT_SECRET;

export interface ChatErrorResponse {
  error?: string;
}

export const streamChat = async (
  message: string,
  history: Message[],
  handleStreamChunk: (text: string) => void,
  signal?: AbortSignal,
): Promise<void> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-app-secret": APP_SECRET ?? "",
    },
    body: JSON.stringify({ message, history }),
    signal,
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error(
        "Lütfen biraz yavaşla. Çok fazla istek attın, biraz bekleyip tekrar dene.",
      );
    }
    const errorData = (await response.json().catch(() => ({}))) as ChatErrorResponse;
    throw new Error(errorData.error || "Uçuş kulesiyle bağlantı kurulamadı.");
  }

  if (!response.body) {
    throw new Error("Sunucudan veri akışı sağlanamadı.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      fullText += chunk;
      handleStreamChunk(fullText);
    }
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AbortError") {
      console.log("İstek kullanıcı tarafından iptal edildi.");
    } else {
      throw error;
    }
  } finally {
    reader.releaseLock();
  }
};
