import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Message {
  role: "user" | "model";
  parts: [{ text: string }];
}

export interface Thread {
  id: string;
  title: string;
  messages: Message[];
}

export interface ChatState {
  threads: Thread[];
  activeThreadId: string | null;
  isStreaming: boolean;

  createNewThread: () => void;
  switchThread: (id: string) => void;
  addMessage: (role: "user" | "model", text: string) => void;
  updateLastMessage: (text: string) => void;
  setStreaming: (status: boolean) => void;
}

const generateId = (): string => Math.random().toString(36).substring(2, 9);

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      threads: [],
      activeThreadId: null,
      isStreaming: false,

      createNewThread: () => {
        const newId = generateId();
        set((state) => ({
          threads: [
            { id: newId, title: "Yeni Sohbet", messages: [] },
            ...state.threads,
          ],
          activeThreadId: newId,
        }));
      },

      switchThread: (id) => {
        set({ activeThreadId: id });
      },

      addMessage: (role, text) =>
        set((state) => {
          let currentThreadId = state.activeThreadId;
          let newThreads = [...state.threads];

          if (!currentThreadId || newThreads.length === 0) {
            currentThreadId = generateId();
            newThreads = [
              { id: currentThreadId, title: "Yeni Sohbet", messages: [] },
              ...newThreads,
            ];
          }

          const threadIndex = newThreads.findIndex(
            (t) => t.id === currentThreadId,
          );
          if (threadIndex !== -1) {
            const thread = newThreads[threadIndex];

            let newTitle = thread.title;
            if (thread.messages.length === 0 && role === "user") {
              newTitle =
                text.length > 20 ? text.substring(0, 20) + "..." : text;
            }

            newThreads[threadIndex] = {
              ...thread,
              title: newTitle,
              messages: [...thread.messages, { role, parts: [{ text }] }],
            };
          }

          return { threads: newThreads, activeThreadId: currentThreadId };
        }),

      updateLastMessage: (text) =>
        set((state) => {
          if (!state.activeThreadId) return state;
          const newThreads = [...state.threads];
          const threadIndex = newThreads.findIndex(
            (t) => t.id === state.activeThreadId,
          );
          if (threadIndex !== -1) {
            const thread = newThreads[threadIndex];
            const newMessages = [...thread.messages];
            if (newMessages.length > 0) {
              newMessages[newMessages.length - 1].parts[0].text = text;
            }
            newThreads[threadIndex] = { ...thread, messages: newMessages };
          }
          return { threads: newThreads };
        }),

      setStreaming: (status) => set({ isStreaming: status }),
    }),
    {
      name: "chat-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
