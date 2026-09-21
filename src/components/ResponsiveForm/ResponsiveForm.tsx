import React from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    useWindowDimensions,
} from "react-native";

type ResponsiveButtonProps = {
    children?: React.ReactNode;
    onClick?: () => void;
    onPress?: () => void;
    fullWidth?: boolean;
    disabled?: boolean;
};

export default function ResponsiveButton({
    children = "Novo",
    onClick,
    onPress,
    fullWidth = false,
    disabled = false,
}: ResponsiveButtonProps) {
    const { width } = useWindowDimensions();

    const isSmallScreen = width <= 500;

    const handlePress = () => {
        if (disabled) {
            return;
        }

        if (onPress) {
            onPress();
            return;
        }

        if (onClick) {
            onClick();
        }
    };

    return (
        <Pressable
            disabled={disabled}
            onPress={handlePress}
            style={({ pressed }) => [
                styles.button,

                // Equivalente ao fullWidth do CSS
                fullWidth && styles.fullWidth,

                // Equivalente ao @media (max-width: 500px)
                isSmallScreen && styles.smallScreen,

                // Equivalente ao :hover/:active
                pressed && !disabled && styles.pressed,

                // Equivalente ao :disabled
                disabled && styles.disabled,
            ]}
        >
            <Text style={styles.text}>
                {children}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",

        alignItems: "center",

        justifyContent: "center",

        paddingVertical: 10,

        paddingHorizontal: 18,

        borderRadius: 8,

        backgroundColor: "#3c6a48",

        minHeight: 42,

        maxWidth: "100%",

        alignSelf: "flex-start",
    },

    fullWidth: {
        width: "100%",

        alignSelf: "stretch",
    },

    smallScreen: {
        width: "50%",

        alignSelf: "stretch",
    },

    pressed: {
        backgroundColor: "#2f573a",

        opacity: 0.9,
    },

    disabled: {
        opacity: 0.6,
    },

    text: {
        color: "#ffffff",

        fontSize: 15,

        fontWeight: "600",

        textAlign: "center",

        flexShrink: 1,
    },
});