import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View
} from "react-native";

import apiFetch from "@/components/FetchFunc/APIFetch";
import ResponsiveButton from "@/components/ResponsiveForm/ResponsiveForm";
import TxtInput from "@/components/TXTInput/TxtInput";

const INITIAL_FORM = {
    nome: "",
};

type Categoria = {
    id?: number | string;
    nome?: string;
};

type CategoriaFormProps = {
    endpoint: string;
    titulo: string;
    obj?: Categoria | null;
    onSuccess?: () => void;
};

export default function CategoriaForm({
    endpoint,
    titulo,
    obj,
    onSuccess,
}: CategoriaFormProps) {
    const [form, setForm] = useState(INITIAL_FORM);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (obj) {
            setForm({
                nome: obj.nome ?? "",
            });
        } else {
            setForm(INITIAL_FORM);
        }
    }, [obj]);

    function handleChange(value: string) {
        setForm({
            nome: value,
        });
    }

    async function submit() {
        if (!form.nome.trim()) {
            return;
        }

        const method = obj ? "PATCH" : "POST";

        const baseUrl = process.env.EXPO_PUBLIC_BACK_ROUTE;

        const url = obj
            ? `${baseUrl}/${endpoint}/${obj.id}`
            : `${baseUrl}/${endpoint}`;

        setLoading(true);

        try {
            const token = await AsyncStorage.getItem("token");

            const response = await apiFetch(url, {
                method,

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },

                body: JSON.stringify(form),
            });

            if (!response.ok) {
                throw new Error();
            }

            setForm(INITIAL_FORM);

            onSuccess?.();
        } catch (error) {
            console.error("Erro ao salvar categoria:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {titulo}
            </Text>

            <TxtInput
                id="nome"
                label="Nome"
                value={form.nome}
                onChangeText={handleChange}
            />

            <View style={styles.buttons}>
                <ResponsiveButton
                    disabled={loading}
                    onPress={submit}
                >
                    {loading ? "Salvando..." : "Salvar"}
                </ResponsiveButton>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",

        padding: 30,

        gap: 18,

        backgroundColor: "#ffffff",

        borderRadius: 15,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.08,
        shadowRadius: 10,

        elevation: 4,
    },

    title: {
        textAlign: "center",

        color: "#333333",

        fontSize: 22,

        fontWeight: "600",

        marginBottom: 5,
    },

    buttons: {
        width: "100%",

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "center",

        gap: 5,
    },

    button: {
        width: "100%",

        minHeight: 48,

        alignItems: "center",

        justifyContent: "center",

        paddingHorizontal: 14,

        borderRadius: 10,

        backgroundColor: "#4f46e5",
    },

    buttonDisabled: {
        opacity: 0.6,
    },

    buttonText: {
        color: "#ffffff",

        fontSize: 15,

        fontWeight: "600",
    },

    loadingContainer: {
        flexDirection: "row",

        alignItems: "center",

        justifyContent: "center",

        gap: 8,
    },
});