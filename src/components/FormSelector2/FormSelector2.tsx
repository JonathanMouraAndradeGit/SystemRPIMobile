import React, { useState } from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

interface FormSelector2Props {
  children: React.ReactNode;
}

export default function FormSelector2({
  children,
}: FormSelector2Props) {
  const [opt, setOpt] = useState<"categoria" | "tipo">("categoria");

  const childrenArray = React.Children.toArray(children);

  return (
    <View style={styles.container}>

      {/* TABS */}
      <View style={styles.tabs}>

        {/* CATEGORIA */}
        <Pressable
          onPress={() => setOpt("categoria")}
          style={({ pressed }) => [
            styles.tab,
            opt === "categoria" && styles.activeTab,
            pressed && styles.pressedTab,
          ]}
        >
          <Text
            style={[
              styles.tabText,
              opt === "categoria" && styles.activeTabText,
            ]}
          >
            Categoria
          </Text>

          {opt === "categoria" && (
            <View style={styles.activeIndicator} />
          )}
        </Pressable>

        {/* TIPO */}
        <Pressable
          onPress={() => setOpt("tipo")}
          style={({ pressed }) => [
            styles.tab,
            opt === "tipo" && styles.activeTab,
            pressed && styles.pressedTab,
          ]}
        >
          <Text
            style={[
              styles.tabText,
              opt === "tipo" && styles.activeTabText,
            ]}
          >
            Tipo
          </Text>

          {opt === "tipo" && (
            <View style={styles.activeIndicator} />
          )}
        </Pressable>

      </View>

      {/* CONTEÚDO */}
      <View style={styles.content}>
        {opt === "categoria"
          ? childrenArray[0]
          : childrenArray[1]}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",

    flexDirection: "column",
  },

  tabs: {
    flexDirection: "row",

    zIndex: 2,
  },

  tab: {
    width: "20%",

    minHeight: 48,

    paddingVertical: 12,
    paddingHorizontal: 28,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#E8EAF7",

    borderWidth: 1,
    borderColor: "#d7d9e8",

    borderBottomWidth: 0,

    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,

    position: "relative",
  },

  activeTab: {
    backgroundColor: "#ffffff",
  },

  pressedTab: {
    backgroundColor: "#F3F4FD",
  },

  tabText: {
    fontSize: 15,

    fontWeight: "600",

    color: "#666666",
  },

  activeTabText: {
    color: "#3c6a48",
  },

  activeIndicator: {
    position: "absolute",

    left: 0,
    right: 0,
    bottom: -2,

    height: 4,

    backgroundColor: "#ffffff",
  },

  content: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#ffffff",

    borderWidth: 1,
    borderColor: "#d7d9e8",

    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 5,
    },

    shadowOpacity: 0.08,
    shadowRadius: 20,

    elevation: 4,

    padding: 25,
  },
});