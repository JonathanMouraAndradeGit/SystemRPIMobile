import { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function TxtInput({
    id,
    label,
    logo,
    error,
    value,
    onFocus,
    onBlur,
    ...props
}: any) {
    const [focused, setFocused] = useState(false);

    const hasValue = value !== undefined && value !== "";

    const active = focused || hasValue;

    const handleFocus = (event: any) => {
        setFocused(true);

        if (onFocus) {
            onFocus(event);
        }
    };

    const handleBlur = (event: any) => {
        setFocused(false);

        if (onBlur) {
            onBlur(event);
        }
    };

    return (
        <View style={styles.container}>

            {logo && (
                <View style={styles.icon}>
                    {logo}
                </View>
            )}

            <View style={styles.fieldWrapper}>
                <View
                    style={[
                        styles.field,
                        focused && styles.fieldFocused,
                        error && styles.fieldError,
                    ]}
                >
                    <TextInput
                        nativeID={id}
                        value={value}
                        placeholder=" "
                        autoComplete="off"
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        style={styles.input}
                        {...props}
                    />

                    {label && <Text
                        style={[
                            styles.label,
                            active && styles.labelActive,
                            focused && styles.labelFocused,
                            error && styles.labelError,
                        ]}
                    >
                        {label}
                    </Text>}
                </View>

                {typeof error === "string" && error.length > 2 && (
                    <Text style={styles.errorMessage}>
                        {error}
                    </Text>
                )}

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        gap: 12,
        alignItems: "flex-start",
    },

    icon: {
        width: 42,
        height: 42,
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    },
    fieldWrapper: {
        width: "100%",

        flex: 1,

        flexDirection: "column",

        gap: 6,
    },

    field: {
        position: "relative",
        justifyContent: "center",
    },

    input: {
        width: "100%",
        height: 54,
        paddingHorizontal: 14,
        paddingTop: 20,
        paddingBottom: 6,
        borderWidth: 2,
        borderColor: "#d6d6d6",
        borderRadius: 10,
        backgroundColor: "#ffffff",
        fontSize: 15,
        color: "#333333",
    },

    fieldFocused: {
        borderColor: "#3c6a48",
        shadowColor: "#3c6a48",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.16,
        shadowRadius: 3,
        elevation: 2,
    },

    fieldError: {
        borderColor: "#b42318",
    },

    label: {
        position: "absolute",
        left: 14,
        top: 27,
        color: "#666666",
        fontSize: 15,
        backgroundColor: "#ffffff",
        paddingHorizontal: 4,
    },

    labelActive: {
        top: 0,
        fontSize: 12,
    },

    labelFocused: {
        color: "#3c6a48",
    },

    labelError: {
        color: "#b42318",
    },

    errorMessage: {
        fontSize: 13,
        color: "#b42318",
        paddingLeft: 4,
    },
});