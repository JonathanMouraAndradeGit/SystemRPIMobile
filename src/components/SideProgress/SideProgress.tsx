import React, {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    Animated,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from "react-native";

type SideProgressItem = {
  title: string;
  icon: React.ReactNode;
};

type SideProgressProps = {
  items: SideProgressItem[];
  selected: number;
  onSelect: (index: number) => void;
};

export default function SideProgress({
  items,
  selected,
  onSelect,
}: SideProgressProps) {
  const { width } = useWindowDimensions();

  /*
   * Responsividade
   *
   * > 900px  = desktop/tablet grande
   * 768-900  = tablet
   * 480-768  = celular/tablet pequeno
   * < 480px  = celular pequeno
   */

  const isSmallMobile = width <= 480;
  const isMobile = width <= 768;
  const isTablet = width <= 900;

  const containerWidth = isSmallMobile
    ? 60
    : isMobile
      ? 80
      : isTablet
        ? 220
        : 280;

  const iconSize = isSmallMobile
    ? 36
    : isMobile
      ? 42
      : isTablet
        ? 42
        : 48;

  const stepHeight = isSmallMobile
    ? 56
    : isMobile
      ? 64
      : 72;

  const iconAreaWidth = isMobile
    ? containerWidth
    : isTablet
      ? 60
      : 70;

  /*
   * Guarda quais linhas já estão selecionadas.
   */
  const [selectedLines, setSelectedLines] =
    useState<number[]>([]);

  /*
   * Animação da linha.
   */
  const lineAnimations = useRef<
    Record<number, Animated.Value>
  >({}).current;

  useEffect(() => {
    if (selected > selectedLines.length) {
      let current = selectedLines.length;

      const interval = setInterval(() => {
        current++;

        setSelectedLines((prev) => [
          ...prev,
          current,
        ]);

        if (current >= selected) {
          clearInterval(interval);
        }
      }, 120);

      return () => clearInterval(interval);
    }

    if (selected < selectedLines.length) {
      let current = selectedLines.length;

      const interval = setInterval(() => {
        current--;

        setSelectedLines((prev) =>
          prev.slice(0, -1)
        );

        if (current <= selected) {
          clearInterval(interval);
        }
      }, 120);

      return () => clearInterval(interval);
    }
  }, [selected]);

  /*
   * Inicializa animações das linhas.
   */
  useEffect(() => {
    items.forEach((_, index) => {
      if (!lineAnimations[index]) {
        lineAnimations[index] =
          new Animated.Value(
            selectedLines.includes(index)
              ? 1
              : 0
          );
      }
    });
  }, [items, selectedLines]);

  /*
   * Anima as linhas conforme o progresso.
   */
  useEffect(() => {
    items.forEach((_, index) => {
      if (index === 0) return;

      const animation =
        lineAnimations[index];

      if (!animation) return;

      Animated.timing(animation, {
        toValue: selectedLines.includes(index)
          ? 1
          : 0,
        duration: 350,
        useNativeDriver: false,
      }).start();
    });
  }, [selectedLines, items]);

  return (
    <ScrollView
      style={[
        styles.container,
        {
          width: containerWidth,
        },
      ]}
      contentContainerStyle={{
        paddingVertical: 12,
      }}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      {items.map((item, index) => {
        const isSelected = index <= selected;
        const isCurrent = index === selected;

        const lineAnimation =
          lineAnimations[index];

        const lineHeight = lineAnimation
          ? lineAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, stepHeight],
            })
          : 0;

        return (
          <Pressable
            key={index}
            onPress={() => onSelect(index)}
            style={({ pressed }) => [
              styles.step,
              {
                minHeight: stepHeight,
              },
              pressed &&
                styles.stepPressed,
            ]}
          >
            {/* ÁREA DO ÍCONE */}
            <View
              style={[
                styles.iconArea,
                {
                  width: iconAreaWidth,
                  minWidth: iconAreaWidth,
                },
              ]}
            >
              {/* LINHA */}
              {index > 0 && (
                <Animated.View
                  style={[
                    styles.line,
                    {
                      height: lineHeight,
                      top: -stepHeight / 2,
                    },
                  ]}
                />
              )}

              {/* ÍCONE */}
              <View
                style={[
                  styles.icon,

                  {
                    width: iconSize,
                    height: iconSize,
                    borderRadius:
                      iconSize / 2,
                  },

                  isSelected &&
                    styles.selected,

                  isCurrent &&
                    styles.current,
                ]}
              >
                {item.icon}
              </View>
            </View>

            {/* TÍTULO */}
            {!isMobile && (
              <View
                style={styles.content}
              >
                <Text
                  style={[
                    styles.title,

                    isSelected &&
                      styles.titleSelected,
                  ]}
                  numberOfLines={2}
                >
                  {item.title}
                </Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,

    flexShrink: 0,

    maxHeight: "100%",
  },

  step: {
    width: "100%",

    flexDirection: "row",

    alignItems: "center",

    paddingVertical: 6,

    borderRadius: 12,
  },

  stepPressed: {
    backgroundColor:
      "rgba(60, 106, 72, 0.07)",
  },

  iconArea: {
    justifyContent: "center",

    alignItems: "center",

    position: "relative",
  },

  icon: {
    justifyContent: "center",

    alignItems: "center",

    backgroundColor: "#d6d6d6",

    shadowColor: "#000000",

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.08,

    shadowRadius: 5,

    elevation: 2,

    zIndex: 2,
  },

  selected: {
    backgroundColor: "#3c6a48",

    shadowColor: "#3c6a48",

    shadowOffset: {
      width: 0,
      height: 5,
    },

    shadowOpacity: 0.25,

    shadowRadius: 7,

    elevation: 4,
  },

  current: {
    transform: [
      {
        scale: 1.12,
      },
    ],

    shadowColor: "#3c6a48",

    shadowOffset: {
      width: 0,
      height: 0,
    },

    shadowOpacity: 0.2,

    shadowRadius: 8,

    elevation: 5,

    borderWidth: 5,

    borderColor:
      "rgba(60, 106, 72, 0.15)",
  },

  line: {
    position: "absolute",

    width: 3,

    backgroundColor: "#3c6a48",

    left: "50%",

    transform: [
      {
        translateX: -1.5,
      },
    ],

    borderRadius: 10,

    zIndex: 1,
  },

  content: {
    flex: 1,

    paddingRight: 10,

    paddingLeft: 4,
  },

  title: {
    color: "#444444",

    fontSize: 15,

    fontWeight: "600",
  },

  titleSelected: {
    color: "#3c6a48",
  },
});