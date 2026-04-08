const API_URL = "https://aviation-backend-rho.vercel.app/api/chat";
const APP_SECRET = "backend-ile-ayni-key";

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

  if (!response.ok) throw new Error("API Hatası");

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let fullText = "";

  while (true) {
    const { done, value } = await reader?.read()!;
    if (done) break;

    const chunk = decoder.decode(value);
    fullText += chunk;
    onChunk(fullText); // Her kelime geldiğinde UI'ı tetikle
  }
};
