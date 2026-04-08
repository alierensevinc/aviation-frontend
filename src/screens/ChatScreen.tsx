import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import { Send, Plane, Menu } from "lucide-react-native";
import { COLORS } from "../theme/colors";
import { ChatBubble } from "../components/ChatBubble";
import { useChatStore } from "../store/useChatStore";
import { streamChat } from "../api/chatService";
import { useNavigation } from "@react-navigation/native";

export const ChatScreen = () => {
  const [input, setInput] = useState("");
  const { threads, activeThreadId, addMessage, updateLastMessage, isStreaming, setStreaming } =
    useChatStore();
  
  const messages = threads.find((t) => t.id === activeThreadId)?.messages || [];
  
  const flashListRef = useRef<FlashList<any>>(null);
  const navigation = useNavigation<any>();

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage = input.trim();
    setInput("");
    addMessage("user", userMessage);

    // AI için boş bir mesaj baloncuğu oluştur
    addMessage("model", "...");
    setStreaming(true);

    try {
      // Backend'e son 5 mesajı geçmiş olarak gönderiyoruz (Store'dan alarak)
      await streamChat(userMessage, messages, (fullText) => {
        updateLastMessage(fullText);
        flashListRef.current?.scrollToEnd({ animated: true });
      });
    } catch (error) {
      updateLastMessage(
        "Üzgünüm, uçuş kulesiyle bağlantı koptu. Lütfen tekrar dene.",
      );
    } finally {
      setStreaming(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Menu color={COLORS.white} size={28} />
        </TouchableOpacity>
        <Plane color={COLORS.accent} size={28} />
        <Text style={styles.headerTitle}>SkyGuide TR</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
        // iOS'te SafeArea ve header yüksekliğinden kaynaklanan kayma için opsiyonel düzeltme
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <View style={styles.listContainer}>
          <FlashList
            ref={flashListRef}
            data={messages}
            renderItem={({ item }) => (
              <ChatBubble role={item.role} text={item.parts[0].text} />
            )}
            estimatedItemSize={100}
            contentContainerStyle={{ paddingBottom: 20 }}
            onContentSizeChange={() =>
              flashListRef.current?.scrollToEnd({ animated: true })
            }
          />
        </View>

        {/* Input Alanı */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Havacılık hakkında bir şey sor..."
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
            onKeyPress={(e) => {
              const nativeEvent = e.nativeEvent as any;
              if (nativeEvent.key === "Enter") {
                // Sadece Shift tuşuna basılmadığında (Shift+Enter yeni satır yapar) gönder
                if (!nativeEvent.shiftKey) {
                  e.preventDefault(); // Web'de alt satıra geçmesini engeller
                  handleSend();
                }
              }
            }}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!input.trim() || isStreaming) && styles.disabledButton,
            ]}
            onPress={handleSend}
            disabled={!input.trim() || isStreaming}
          >
            {isStreaming ? (
              <ActivityIndicator color={COLORS.white} size="small" />
            ) : (
              <Send color={COLORS.white} size={20} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.primary },
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: COLORS.primary,
    gap: 12,
  },
  headerTitle: { color: COLORS.white, fontSize: 20, fontWeight: "bold" },
  listContainer: { flex: 1 },
  inputWrapper: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: "#E1E8ED",
    alignItems: "flex-end",
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: "#F5F8FA",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 16,
    color: COLORS.text,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: { backgroundColor: "#AAB8C2" },
});
