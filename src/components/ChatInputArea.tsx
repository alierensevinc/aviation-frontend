import React, { memo } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from "react-native";
import { Send, Square } from "lucide-react-native";
import { COLORS } from "../theme/colors";

export interface ChatInputAreaProps {
  input: string;
  isStreaming: boolean;
  onInputChange: (text: string) => void;
  onSend: () => void;
  onStop: () => void;
}

export const ChatInputArea = memo(
  ({
    input,
    isStreaming,
    onInputChange,
    onSend,
    onStop,
  }: ChatInputAreaProps) => {
    const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      const nativeEvent = e.nativeEvent as any;
      if (nativeEvent.key === "Enter" && !nativeEvent.shiftKey) {
        e.preventDefault();
        onSend();
      }
    };

    return (
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Havacılık hakkında bir şey sor..."
          value={input}
          onChangeText={onInputChange}
          multiline
          maxLength={500}
          onKeyPress={handleKeyPress}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            !isStreaming && !input.trim() && styles.disabledButton,
          ]}
          onPress={isStreaming ? onStop : onSend}
          disabled={!isStreaming && !input.trim()}
        >
          {isStreaming ? (
            <Square color={COLORS.white} size={20} fill={COLORS.white} />
          ) : (
            <Send color={COLORS.white} size={20} />
          )}
        </TouchableOpacity>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: "#E1E8ED",
    alignItems: "center",
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
