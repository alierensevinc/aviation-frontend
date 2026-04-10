import React, { memo } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { MessageSquare } from "lucide-react-native";
import { COLORS } from "../theme/colors";

export interface SidebarThreadItemProps {
  id: string;
  title: string;
  isActive: boolean;
  onPress: (id: string) => void;
}

export const SidebarThreadItem = memo(
  ({ id, title, isActive, onPress }: SidebarThreadItemProps) => {
    return (
      <TouchableOpacity
        style={[styles.threadItem, isActive && styles.activeThreadItem]}
        onPress={() => onPress(id)}
      >
        <MessageSquare
          color={isActive ? COLORS.primary : COLORS.text}
          size={18}
        />
        <Text
          style={[styles.threadText, isActive && styles.activeThreadText]}
          numberOfLines={1}
        >
          {title}
        </Text>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  threadItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    gap: 12,
  },
  activeThreadItem: {
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  threadText: {
    color: COLORS.text,
    fontSize: 15,
    flex: 1,
  },
  activeThreadText: {
    color: COLORS.primary,
    fontWeight: "600",
  },
});
