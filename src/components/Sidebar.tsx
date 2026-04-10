import React, { useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useChatStore } from "../store/useChatStore";
import { COLORS } from "../theme/colors";
import { PlusCircle } from "lucide-react-native";
import { SidebarThreadItem } from "./SidebarThreadItem";
import { DrawerNavigationProp } from "@react-navigation/drawer";

interface SidebarProps {
  navigation: DrawerNavigationProp<any, any>;
}

export const Sidebar = ({ navigation }: SidebarProps) => {
  const { threads, activeThreadId, createNewThread, switchThread } =
    useChatStore();
  const insets = useSafeAreaInsets();

  const handleNewChat = useCallback(() => {
    createNewThread();
    navigation.closeDrawer();
  }, [createNewThread, navigation]);

  const handleSelectThread = useCallback(
    (id: string) => {
      switchThread(id);
      navigation.closeDrawer();
    },
    [switchThread, navigation],
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top || 50 }]}>
      <TouchableOpacity style={styles.newChatButton} onPress={handleNewChat}>
        <PlusCircle color={COLORS.white} size={20} />
        <Text style={styles.newChatText}>Yeni Sohbet</Text>
      </TouchableOpacity>

      <ScrollView style={styles.threadList}>
        {threads.map((thread) => (
          <SidebarThreadItem
            key={thread.id}
            id={thread.id}
            title={thread.title}
            isActive={thread.id === activeThreadId}
            onPress={handleSelectThread}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
  },
  newChatButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.secondary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    gap: 8,
  },
  newChatText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  threadList: {
    flex: 1,
  },
});
