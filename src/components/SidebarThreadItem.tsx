import React, { memo } from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { MessageSquare, Trash2 } from "lucide-react-native";
import { COLORS } from "../theme/colors";

export interface SidebarThreadItemProps {
  id: string;
  title: string;
  isActive: boolean;
  onPress: (id: string) => void;
  onDelete: (id: string) => void;
}

export const SidebarThreadItem = memo(
  ({ id, title, isActive, onPress, onDelete }: SidebarThreadItemProps) => {
    return (
      <View style={[styles.threadItemContainer, isActive && styles.activeThreadItem]}>
        <TouchableOpacity
          style={styles.mainContent}
          onPress={() => onPress(id)}
          activeOpacity={0.7}
        >
          <MessageSquare color={isActive ? COLORS.primary : COLORS.text} size={18} />
          <View style={styles.titleContainer}>
            <Text
              style={[styles.threadText, isActive && styles.activeThreadText]}
              numberOfLines={1}
            >
              {title}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Trash2 color={COLORS.error} size={18} />
        </TouchableOpacity>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  threadItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 8,
  },
  activeThreadItem: {
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  mainContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
  },
  titleContainer: {
    flex: 1,
  },
  threadText: {
    color: COLORS.text,
    fontSize: 15,
  },
  activeThreadText: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  deleteButton: {
    padding: 12,
  },
});
