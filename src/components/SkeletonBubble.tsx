import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { COLORS } from "../theme/colors";

export const SkeletonBubble = () => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <View style={styles.aiAlign}>
      <Animated.View style={[styles.bubble, { opacity }]}>
        <View style={styles.skeletonLine} />
        <View style={[styles.skeletonLine, { width: "60%" }]} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  aiAlign: {
    alignItems: "flex-start",
    marginVertical: 8,
    paddingHorizontal: 12,
  },
  bubble: {
    maxWidth: "80%",
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#E1E8ED",
    borderBottomLeftRadius: 4,
    width: 200,
  },
  skeletonLine: {
    height: 12,
    backgroundColor: "#D1D9E0",
    borderRadius: 6,
    marginBottom: 8,
  },
});
