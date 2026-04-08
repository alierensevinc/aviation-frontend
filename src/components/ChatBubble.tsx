import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Markdown from "react-native-markdown-display";
import { COLORS } from "../theme/colors";

interface Props {
  role: "user" | "model";
  text: string;
}

export const ChatBubble = ({ role, text }: Props) => {
  const isUser = role === "user";

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
      </View>
    </View>
  );
};

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
});

const userMarkdownStyles = { body: { color: COLORS.white, fontSize: 15 } };
const aiMarkdownStyles = { body: { color: COLORS.text, fontSize: 15 } };
