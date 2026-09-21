import React, { useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from "react-native";

type FormSelector3Props = {
    children: React.ReactNode;
    labels?: string[];
};

export default function FormSelector3({
    children,
    labels = [],
}: FormSelector3Props) {
    const itens = React.Children.toArray(children);
    const [selected, setSelected] = useState(0);
    const { width } = useWindowDimensions();

    const small = width <= 768;
    const verySmall = width <= 480;

    return (
        <View style={styles.container}>
            <View style={[
                    styles.tabs,
                    small && styles.tabsSmall,
                ]}
            >
                {itens.map((_, index) => {
                    const active = selected === index;

                    return (
                        <Pressable
                            key={index}
                            onPress={() => setSelected(index)}
                            style={({ pressed }) => [
                                styles.tab,
                                small && styles.tabSmall,
                                verySmall && styles.tabVerySmall,
                                active && styles.tabActive,
                                pressed && styles.tabPressed,
                            ]}
                        >
                            <Text style={[styles.text, active && styles.textActive]}>
                                {small
                                    ? index + 1
                                    : labels[index] ?? `Formulário ${index + 1}`}
                            </Text>

                            {active && <View style={styles.indicator} />}
                        </Pressable>
                    );
                })}
            </View>

            <View
                style={[
                    styles.content,
                    small && styles.contentSmall,
                    verySmall && styles.contentVerySmall,
                ]}
            >
                <ScrollView
                    style={styles.contentScroll}
                    contentContainerStyle={styles.contentScrollContainer}
                    showsVerticalScrollIndicator={true}
                    showsHorizontalScrollIndicator={false}
                    nestedScrollEnabled={true}
                >
                    {itens[selected]}
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  /*
   * COMPONENTE INTEIRO
   */
  container: {
    flex: 1,

    width: "100%",

    minWidth: 0,
    minHeight: 0,

    backgroundColor: "#fff",
  },

  /*
   * ABAS
   */
  tabs: {
    flexDirection: "row",

    alignItems: "flex-end",

    paddingBottom: 0,
  },

  tabsSmall: {
    width: "100%",
  },

  tab: {
    minWidth: 150,

    paddingVertical: 9,
    paddingHorizontal: 16,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#E8EAF7",

    borderWidth: 1,
    borderColor: "#D7D9E8",

    borderBottomWidth: 0,

    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,

    position: "relative",
  },

  tabSmall: {
    flex: 1,

    minWidth: 90,

    paddingVertical: 8,
    paddingHorizontal: 10,
  },

  tabVerySmall: {
    minWidth: 60,

    paddingVertical: 7,
  },

  tabActive: {
    backgroundColor: "#fff",

    zIndex: 2,
  },

  tabPressed: {
    backgroundColor: "#F3F4FD",
  },

  text: {
    color: "#666",

    fontSize: 14,

    fontWeight: "600",

    textAlign: "center",
  },

  textActive: {
    color: "#3C6A48",

    fontWeight: "700",
  },

  indicator: {
    position: "absolute",

    left: 0,
    right: 0,

    bottom: -1,

    height: 3,

    backgroundColor: "#fff",

    zIndex: 3,
  },

  /*
   * ÁREA DO CONTEÚDO
   *
   * Essa área recebe somente o espaço
   * que sobrou abaixo das abas.
   */
  content: {
    flex: 1,

    width: "100%",

    minWidth: 0,
    minHeight: 0,

    backgroundColor: "#fff",

    borderWidth: 1,
    borderColor: "#D7D9E8",

    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,

    overflow: "hidden",
  },

  /*
   * SCROLL DO FORMULÁRIO
   */
  contentScroll: {
    flex: 1,

    minHeight: 0,
    minWidth: 0,
  },

  /*
   * ESPAÇAMENTO DO FORMULÁRIO
   */
  contentScrollContainer: {
    padding: 20,

    flexGrow: 1,
  },

  contentSmall: {
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },

  contentVerySmall: {
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
});