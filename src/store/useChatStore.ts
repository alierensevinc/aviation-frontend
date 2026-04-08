import { create } from "zustand";

export interface Message {
  role: "user" | "model";
  parts: [{ text: string }];
}

interface ChatState {
  messages: Message[];
  isStreaming: boolean;
  addMessage: (role: "user" | "model", text: string) => void;
  updateLastMessage: (text: string) => void;
  setStreaming: (status: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isStreaming: false,
  addMessage: (role, text) =>
    set((state) => ({
      messages: [...state.messages, { role, parts: [{ text }] }],
    })),
  updateLastMessage: (text) =>
    set((state) => {
      const newMessages = [...state.messages];
      newMessages[newMessages.length - 1].parts[0].text = text;
      return { messages: newMessages };
    }),
  setStreaming: (status) => set({ isStreaming: status }),
}));
