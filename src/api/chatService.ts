const API_URL = "https://aviation-backend-rho.vercel.app/api/chat";
const APP_SECRET = process.env.EXPO_PUBLIC_APP_VARIANT_SECRET;

export const streamChat = async (
  message: string,
  history: any[],
  onChunk: (text: string) => void,
) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-app-secret": APP_SECRET,
    },
    body: JSON.stringify({ message, history }),
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("Lütfen biraz yavaşla. Çok fazla istek attın, biraz bekleyip tekrar dene.");
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Uçuş kulesiyle bağlantı kurulamadı.");
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let fullText = "";

  while (true) {
    const { done, value } = await reader?.read()!;
    if (done) break;

    const chunk = decoder.decode(value);
    fullText += chunk;
    onChunk(fullText);
  }
};
