import { useState } from "react";
import {
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

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
    const [open, setOpen] = useState(false);

    const selectedOption = options.find(
        (option:any) => option.value === value
    );

    const hasValue =
        value !== undefined &&
        value !== null &&
        value !== "";

    const active = hasValue || open;

    const handleSelect = (option:any) => {
        setOpen(false);

        if (onChange) {
            onChange(option.value);
        }
    };

    return (
        <>
            <View style={styles.container}>

                {/* Ícone */}
                {logo && (
                    <View
                        style={[
                            styles.icon,
                        ]}
                    >
                        {logo}
                    </View>
                )}

                <View style={styles.fieldWrapper}>

                    {/* Campo */}
                    <View
                        style={[
                            styles.field,

                            open && styles.fieldFocused,

                            error && styles.fieldError,

                            disabled && styles.fieldDisabled,
                        ]}
                    >

                        <Pressable
                            nativeID={id}
                            disabled={disabled}
                            onPress={() => setOpen(true)}
                            style={styles.select}
                        >

                            {/* Valor */}
                            <Text
                                style={[
                                    styles.value,

                                    !hasValue &&
                                        styles.placeholder,

                                    disabled &&
                                        styles.valueDisabled,
                                ]}
                                numberOfLines={1}
                            >
                                {selectedOption?.label ||
                                    //"Selecione..."
                                    ""}
                            </Text>

                            {/* Seta */}
                            <Text
                                style={[
                                    styles.arrow,
                                    open && styles.arrowOpen,
                                    disabled &&
                                        styles.arrowDisabled,
                                ]}
                            >
                                ▼
                            </Text>

                        </Pressable>

                        {/* Label */}
                        <Text
                            style={[
                                styles.label,

                                active &&
                                    styles.labelActive,

                                open &&
                                    styles.labelFocused,

                                error &&
                                    styles.labelError,

                                disabled &&
                                    styles.labelDisabled,
                            ]}
                        >
                            {label}
                        </Text>

                    </View>

                    {/* Erro */}
                    {error && (
                        <Text style={styles.errorMessage}>
                            {error}
                        </Text>
                    )}

                </View>
            </View>

            {/* Modal das opções */}
            <Modal
                visible={open}
                transparent
                animationType="fade"
                onRequestClose={() => setOpen(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setOpen(false)}
                >
                    <Pressable
                        style={styles.modalContainer}
                        onPress={(event) =>
                            event.stopPropagation()
                        }
                    >

                        {/* Cabeçalho */}
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {label}
                            </Text>

                            <Pressable
                                onPress={() => setOpen(false)}
                            >
                                <Text style={styles.close}>
                                    ×
                                </Text>
                            </Pressable>
                        </View>

                        {/* Opções */}
                        <FlatList
                            data={options}
                            keyExtractor={(item) =>
                                String(item.value)
                            }
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => {

                                const selected =
                                    item.value === value;

                                return (
                                    <Pressable
                                        onPress={() =>
                                            handleSelect(item)
                                        }
                                        style={[
                                            styles.option,

                                            selected &&
                                                styles.optionSelected,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.optionText,

                                                selected &&
                                                    styles.optionTextSelected,
                                            ]}
                                        >
                                            {item.label}
                                        </Text>

                                        {selected && (
                                            <Text
                                                style={
                                                    styles.check
                                                }
                                            >
                                                ✓
                                            </Text>
                                        )}
                                    </Pressable>
                                );
                            }}
                        />

                    </Pressable>
                </Pressable>
            </Modal>
        </>
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
        justifyContent: "center",
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
    select: {
        width: "100%",
        height: "100%",
        paddingHorizontal: 14,
        paddingTop: 14,
        paddingBottom: 4,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    value: {
        flex: 1,
        fontSize: 15,
        color: "#333333",
        paddingRight: 10,
    },
    placeholder: {
        color: "#666666",
    },
    valueDisabled: {
        color: "#777777",
    },
    arrow: {
        fontSize: 12,

        color: "#666666",
    },
    arrowOpen: {
        color: "#3c6a48",

        transform: [
            {
                rotate: "180deg",
            },
        ],
    },
    arrowDisabled: {
        color: "#777777",
    },
    label: {
        position: "absolute",
        left: 14,
        top: 20,
        fontSize: 15,
        color: "#666666",
        backgroundColor: "#ffffff",
        paddingHorizontal: 4,
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
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.35)",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    modalContainer: {
        width: "100%",
        maxHeight: "70%",
        backgroundColor: "#ffffff",
        borderRadius: 14,
        overflow: "hidden",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    modalHeader: {
        height: 58,
        paddingHorizontal: 18,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: "#eeeeee",
    },
    modalTitle: {
        fontSize: 17,

        fontWeight: "600",

        color: "#333333",
    },
    close: {
        fontSize: 30,

        lineHeight: 30,

        color: "#666666",

        fontWeight: "300",
    },
    option: {
        minHeight: 52,

        paddingHorizontal: 18,

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "space-between",

        borderBottomWidth: 1,

        borderBottomColor: "#f1f1f1",
    },

    optionSelected: {
        backgroundColor: "#f1f6f2",
    },

    optionText: {
        fontSize: 15,

        color: "#333333",
    },

    optionTextSelected: {
        color: "#3c6a48",

        fontWeight: "600",
    },

    check: {
        fontSize: 18,

        color: "#3c6a48",

        fontWeight: "bold",
    },
});