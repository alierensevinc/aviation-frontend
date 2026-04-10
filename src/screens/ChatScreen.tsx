import React, { useState, useRef, useCallback, useEffect } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import { COLORS } from "../theme/colors";
import { ChatBubble } from "../components/ChatBubble";
import { SkeletonBubble } from "../components/SkeletonBubble";
import { WelcomeView } from "../components/WelcomeView";
import { useChatStore, Message } from "../store/useChatStore";
import { streamChat } from "../api/chatService";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { ChatHeader } from "../components/ChatHeader";
import { ChatInputArea } from "../components/ChatInputArea";

export const ChatScreen = () => {
  const [input, setInput] = useState("");
  const {
    threads,
    activeThreadId,
    addMessage,
    updateLastMessage,
    isStreaming,
    setStreaming,
  } = useChatStore();

  const messages = threads.find((t) => t.id === activeThreadId)?.messages || [];

  // @ts-ignore
  const flashListRef = useRef<FlashList<Message>>(null);
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [activeThreadId]);

  const handleSend = useCallback(
    async (customText?: string | any) => {
      const messageToSend =
        typeof customText === "string" ? customText : input.trim();
      if (!messageToSend || isStreaming) return;

      setInput("");
      addMessage("user", messageToSend);

      setStreaming(true);
      addMessage("model", "");

      abortControllerRef.current = new AbortController();

      try {
        await streamChat(
          messageToSend,
          messages,
          (fullText) => {
            updateLastMessage(fullText);
            flashListRef.current?.scrollToEnd({ animated: true });
          },
          abortControllerRef.current.signal,
        );
      } catch (error: any) {
        if (
          error.name === "AbortError" ||
          error.message?.includes("aborted") ||
          error.message?.includes("iptal")
        ) {
          console.log("İstek kullanıcı tarafından iptal edildi.");
        } else {
          updateLastMessage(error.message || "Üzgünüm, bir hata oluştu.");
        }
      } finally {
        setStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [input, isStreaming, addMessage, setStreaming, messages, updateLastMessage],
  );

  const handleStop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setStreaming(false);
  }, [setStreaming]);

  const handleMenuPress = useCallback(() => {
    navigation.openDrawer();
  }, [navigation]);

  const handleInputChange = useCallback((text: string) => {
    setInput(text);
  }, []);

  const renderItem = useCallback(
    ({ item, index }: { item: Message; index: number }) => {
      if (
        item.role === "model" &&
        item.parts[0].text === "" &&
        isStreaming &&
        index === messages.length - 1
      ) {
        return <SkeletonBubble />;
      }
      return <ChatBubble role={item.role} text={item.parts[0].text} />;
    },
    [isStreaming, messages.length],
  );

  const onContentSizeChange = useCallback(() => {
    flashListRef.current?.scrollToEnd({ animated: true });
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ChatHeader onMenuPress={handleMenuPress} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <View style={styles.listContainer}>
          {messages.length === 0 ? (
            <WelcomeView onSuggestionPress={handleSend} />
          ) : (
            <FlashList
              ref={flashListRef}
              data={messages}
              renderItem={renderItem}
              // @ts-ignore
              estimatedItemSize={100}
              contentContainerStyle={{ paddingBottom: 20 }}
              onContentSizeChange={onContentSizeChange}
              removeClippedSubviews={true}
              maxToRenderPerBatch={10}
              windowSize={5}
            />
          )}
        </View>

        <ChatInputArea
          input={input}
          isStreaming={isStreaming}
          onInputChange={handleInputChange}
          onSend={handleSend}
          onStop={handleStop}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.primary },
  container: { flex: 1, backgroundColor: COLORS.background },
  listContainer: { flex: 1 },
});
