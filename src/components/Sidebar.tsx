import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useChatStore } from "../store/useChatStore";
import { COLORS } from "../theme/colors";
import { PlusCircle, MessageSquare } from "lucide-react-native";

export const Sidebar = ({ navigation }: any) => {
  const { threads, activeThreadId, createNewThread, switchThread } =
    useChatStore();

  const handleNewChat = () => {
    createNewThread();
    navigation.closeDrawer();
  };

  const handleSelectThread = (id: string) => {
    switchThread(id);
    navigation.closeDrawer();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.newChatButton} onPress={handleNewChat}>
        <PlusCircle color={COLORS.white} size={20} />
        <Text style={styles.newChatText}>Yeni Sohbet</Text>
      </TouchableOpacity>

      <ScrollView style={styles.threadList}>
        {threads.map((thread) => {
          const isActive = thread.id === activeThreadId;
          return (
            <TouchableOpacity
              key={thread.id}
              style={[styles.threadItem, isActive && styles.activeThreadItem]}
              onPress={() => handleSelectThread(thread.id)}
            >
              <MessageSquare
                color={isActive ? COLORS.primary : COLORS.text}
                size={18}
              />
              <Text
                style={[styles.threadText, isActive && styles.activeThreadText]}
                numberOfLines={1}
              >
                {thread.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 50, // SafeArea yerine basit bir padding verildi
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
