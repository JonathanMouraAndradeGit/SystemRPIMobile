import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

interface PageItemSelectorProps {
    page: number;
    totalPages: number;
    func1: () => void;
    func2: () => void;
}

export default function PageItemSelector({
    page,
    totalPages,
    func1,
    func2,
}: PageItemSelectorProps) {
    const isFirstPage = page === 1;
    const isLastPage = page === totalPages;

    return (
        <View style={styles.pagination}>

            {/* Página anterior */}
            <Pressable
                disabled={isFirstPage}
                onPress={func1}
                style={[
                    styles.button,
                    isFirstPage && styles.buttonDisabled,
                ]}
            >
                <Text style={styles.buttonText}>
                    {"←"}
                </Text>
            </Pressable>

            {/* Indicador */}
            <Text style={styles.pageText}>
                Página {page} de {totalPages}
            </Text>

            {/* Próxima página */}
            <Pressable
                disabled={isLastPage}
                onPress={func2}
                style={[
                    styles.button,
                    isLastPage && styles.buttonDisabled,
                ]}
            >
                <Text style={styles.buttonText}>
                    {"→"}
                </Text>
            </Pressable>

        </View>
    );
}

const styles = StyleSheet.create({
    pagination: {
        width: "100%",

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "center",

        paddingVertical: 5,

        gap: 8,
    },

    button: {
        width: 36,
        height: 36,

        borderRadius: 18,

        alignItems: "center",
        justifyContent: "center",

        backgroundColor: "#2f573a",

        elevation: 2,
    },

    buttonDisabled: {
        backgroundColor: "#b8b8b8",

        opacity: 0.5,
    },

    buttonText: {
        color: "#ffffff",

        fontSize: 22,

        fontWeight: "600",

        lineHeight: 24,
    },

    pageText: {
        color: "#333333",

        fontSize: 14,

        fontWeight: "500",

        minWidth: 100,

        textAlign: "center",
    },
});