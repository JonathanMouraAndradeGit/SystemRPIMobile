import ErrMsg from "@/components/Alerts/ErrMsg2";
import apiFetch from "@/components/FetchFunc/APIFetch";
import ResponsiveButton from "@/components/ResponsiveForm/ResponsiveForm";
import SelectInput from "@/components/SelectInput/SelectInput2";
import TxtInput from "@/components/TXTInput/TxtInput";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View
} from "react-native";
import OKMsg from "../../Alerts/OKMsg2";

const INITIAL_FORM = {
    nome: "",
    cidade: "",
    subprefeitura: "",
    supervisao:""
};

type UBSData = {
    id?: number | string;
    nome?: string;
    cidade?: string;
    subprefeitura?: string;
    supervisao?: string
};

type UBSFormProps = {
    data?: UBSData | null;
    onSuccess?: () => void;
    onCancel?: () => void;
};

export default function UBSForm({
    data,
    onSuccess,
    onCancel,
}: UBSFormProps) {
    const [form, setForm] = useState(INITIAL_FORM);
    const [errors, setErrors] = useState<
        Partial<typeof INITIAL_FORM>
    >({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (data) {
            setForm({
                nome: data.nome ?? "",
                cidade: data.cidade ?? "",
                subprefeitura: data.subprefeitura ?? "",
                supervisao: data.supervisao ?? ""
            });
        } else {
            setForm(INITIAL_FORM);
        }

        setErrors({});
    }, [data]);

    function handleChange(
        name: keyof typeof INITIAL_FORM,
        value: string
    ) {
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    }

    function validate() {
        const newErrors: Partial<typeof INITIAL_FORM> = {};

        if (!form.nome.trim()) {
            newErrors.nome = "Campo obrigatório";
        }

        if (!form.cidade.trim()) {
            newErrors.cidade = "Campo obrigatório";
        }

        if (!form.subprefeitura.trim()) {
            newErrors.subprefeitura = "Campo obrigatório";
        }

        if (!form.supervisao.trim()) {
            newErrors.supervisao = "Campo obrigatório";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    async function submit() {
        if (!validate()) {
            return;
        }

        setLoading(true);

        try {
            const token = await AsyncStorage.getItem("token");

            const baseUrl = process.env.EXPO_PUBLIC_BACK_ROUTE;

            const url = data
                ? `${baseUrl}/ubs/${data.id}`
                : `${baseUrl}/ubs`;

            const response = await apiFetch(url, {
                method: data ? "PUT" : "POST",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },

                body: JSON.stringify(form),
            });

            if (!response.ok) {
                throw new Error();
            }

            OKMsg("Operação realizada com sucesso!");

            onSuccess?.();
        } catch (err) {
            console.error(err);
            ErrMsg("Erro ao realizar operação.");
        } finally {
            setLoading(false);
        }
    }

    function handleCancel() {
        setForm(INITIAL_FORM);
        setErrors({});

        onCancel?.();
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {data ? "Editar UBS" : "Nova UBS"}
            </Text>

            <TxtInput
                id="nome"
                label="Nome"
                value={form.nome}
                onChangeText={(value: string) =>
                    handleChange("nome", value)
                }
                logo={
                    <MaterialCommunityIcons
                        name="hospital-building"
                        size={25}
                        color="#3c6a48"
                    />
                }
                error={errors.nome}
            />

            <TxtInput
                id="cidade"
                label="Cidade"
                value={form.cidade}
                onChangeText={(value: string) =>
                    handleChange("cidade", value)
                }
                logo={
                    <MaterialCommunityIcons
                        name="city"
                        size={25}
                        color="#3c6a48"
                    />
                }
                error={errors.cidade}
            />

            <TxtInput
                id="subprefeitura"
                label="Subprefeitura"
                value={form.subprefeitura}
                onChangeText={(value: string) =>
                    handleChange("subprefeitura", value)
                }
                logo={
                    <MaterialCommunityIcons
                        name="map-marker-radius"
                        size={25}
                        color="#3c6a48"
                    />
                }
                error={errors.subprefeitura}
            />
            <SelectInput
                id="supervisaoId"
                name="supervisao"
                label="Supervisão"
                value={form.supervisao}
                onChange={(value: string) =>
                    handleChange("supervisao", value)}
                logo={<MaterialCommunityIcons
                        name="hospital-building"
                        size={25}
                        color="#3c6a48"
                    />}
                error={errors.supervisao}
                options={[
                    {
                        value: "STS Ermelino Matarazzo",
                        label: "STS Ermelino Matarazzo"
                    },
                    {
                        value: "STS Guaianases",
                        label: "STS Guaianases"
                    },
                    {
                        value: "STS Itaim Paulista",
                        label: "STS Itaim Paulista"
                    },
                    {
                        value: "STS Itaquera",
                        label: "STS Itaquera"
                    },
                    {
                        value: "STS São Mateus",
                        label: "STS São Mateus"
                    },
                    {
                        value: "STS São Miguel Paulista",
                        label: "STS São Miguel Paulista"
                    }
                ]}
            />

            <View style={styles.buttons}>
                <ResponsiveButton
                    disabled={loading}
                    onPress={submit}
                >
                    {loading ? (
                        "Salvando..."
                    ) : (
                        data ? "Atualizar" : "Cadastrar"
                    )}
                </ResponsiveButton>

                <ResponsiveButton
                    disabled={loading}
                    onPress={handleCancel}
                >
                    Cancelar
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
        marginTop: 5,
    },

    button: {
        flex: 1,
        minHeight: 48,

        alignItems: "center",
        justifyContent: "center",

        paddingHorizontal: 12,

        backgroundColor: "#4f46e5",

        borderRadius: 10,
    },

    cancelButton: {
        backgroundColor: "#6b7280",
    },

    buttonDisabled: {
        opacity: 0.6,
    },

    buttonText: {
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "600",
    },
});