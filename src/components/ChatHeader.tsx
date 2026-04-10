import React, { memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Plane, Menu } from "lucide-react-native";
import { COLORS } from "../theme/colors";

export interface ChatHeaderProps {
  onMenuPress: () => void;
}

export const ChatHeader = memo(({ onMenuPress }: ChatHeaderProps) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onMenuPress}>
        <Menu color={COLORS.white} size={28} />
      </TouchableOpacity>
      <Plane color={COLORS.accent} size={28} />
      <Text style={styles.headerTitle}>SkyGuide TR</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: COLORS.primary,
    gap: 12,
  },
  headerTitle: { color: COLORS.white, fontSize: 20, fontWeight: "bold" },
});
