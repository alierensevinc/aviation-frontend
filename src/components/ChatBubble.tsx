import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Markdown from "react-native-markdown-display";
import { COLORS } from "../theme/colors";
import { Copy, Check, RefreshCw } from "lucide-react-native";
import * as Clipboard from "expo-clipboard";

interface Props {
  role: "user" | "model";
  text: string;
  isError?: boolean;
  onRetry?: () => void;
}

export const ChatBubble = React.memo(({ role, text, isError, onRetry }: Props) => {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View
      style={[styles.container, isUser ? styles.userAlign : styles.aiAlign]}
    >
      <View
        style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}
      >
        <Markdown style={isUser ? userMarkdownStyles : aiMarkdownStyles}>
          {text}
        </Markdown>

        {!isUser && text.length > 0 && (
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={handleCopy} activeOpacity={0.7}>
              {copied ? (
                <Check color={COLORS.primary} size={14} />
              ) : (
                <Copy color={COLORS.text} size={14} />
              )}
              <Text style={styles.actionText}>{copied ? "Kopyalandı" : "Kopyala"}</Text>
            </TouchableOpacity>

            {isError && onRetry && (
              <TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.7}>
                <RefreshCw color={COLORS.white} size={14} />
                <Text style={styles.retryText}>Tekrar Dene</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { marginVertical: 8, paddingHorizontal: 12 },
  userAlign: { alignItems: "flex-end" },
  aiAlign: { alignItems: "flex-start" },
  bubble: {
    maxWidth: "85%",
    padding: 12,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  userBubble: {
    backgroundColor: COLORS.userBubble,
    borderBottomRightRadius: 4,
  },
  aiBubble: { backgroundColor: COLORS.aiBubble, borderBottomLeftRadius: 4 },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    paddingTop: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    color: COLORS.text,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.error,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  retryText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: "bold",
  },
});

const userMarkdownStyles = { body: { color: COLORS.white, fontSize: 15 } };
const aiMarkdownStyles = { body: { color: COLORS.text, fontSize: 15, marginVertical: 0 } };
