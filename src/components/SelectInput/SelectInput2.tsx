import { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
} from "react-native";

import { Picker } from "@react-native-picker/picker";

export default function SelectInput({
    id,
    name,
    label,
    value,
    onChange,
    logo,
    error,
    options = [],
    disabled = false,
}:any) {
    const [focused, setFocused] = useState(false);

    const hasValue =
        value !== undefined &&
        value !== null &&
        value !== "";

    const active = focused || hasValue;

    return (
        <View style={styles.container}>

            {logo && (
                <View
                    style={[styles.icon,active && styles.iconActive,
                        disabled && styles.iconDisabled,
                    ]}
                ><>{logo}</></View>
            )}

            <View style={styles.fieldWrapper}>

                <View
                    style={[
                        styles.field,
                        focused && styles.fieldFocused,
                        error && styles.fieldError,
                        disabled && styles.fieldDisabled,
                    ]}
                >

                    <Picker
                        selectedValue={value}
                        onValueChange={(itemValue) => {
                            onChange?.(itemValue);
                        }}
                        enabled={!disabled}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        style={styles.picker}
                        dropdownIconColor={
                            disabled
                                ? "#777777"
                                : "#3c6a48"
                        }
                    >

                        <Picker.Item
                            label="Selecione..."
                            value=""
                            color="#666666"
                        />

                        {options.map((option:any) => (
                            <Picker.Item
                                key={String(option.value)}
                                label={option.label}
                                value={option.value}
                            />
                        ))}

                    </Picker>

                    <Text
                        style={[
                            styles.label,
                            active && styles.labelActive,
                            focused && styles.labelFocused,
                            error && styles.labelError,
                            disabled && styles.labelDisabled,
                        ]}
                    >
                        {label}
                    </Text>

                </View>

                {error && (
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

    iconActive: {
        // color: "#3c6a48"
    },

    iconDisabled: {
        opacity: 0.5,
    },

    fieldWrapper: {
        flex: 1,

        width: "100%",

        flexDirection: "column",

        gap: 6,
    },

    field: {
        position: "relative",

        height: 54,

        borderWidth: 2,

        borderColor: "#d6d6d6",

        borderRadius: 10,

        backgroundColor: "#ffffff",

        overflow: "hidden",
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

    fieldDisabled: {
        backgroundColor: "#f1f3f1",
    },

    picker: {
        width: "100%",

        height: 54,

        color: "#333333",

        marginTop: 5,
    },

    label: {
        position: "absolute",

        left: 14,

        top:-5,

        fontSize: 15,

        color: "#666666",

        backgroundColor: "#ffffff",

        paddingHorizontal: 4,

        pointerEvents: "none",
    },

    labelActive: {
        top: -7,

        fontSize: 12,
    },

    labelFocused: {
        color: "#3c6a48",
    },

    labelError: {
        color: "#b42318",
    },

    labelDisabled: {
        color: "#777777",

        backgroundColor: "#f1f3f1",
    },

    errorMessage: {
        fontSize: 13,

        color: "#b42318",

        paddingLeft: 4,
    },
});