import { useEffect, useState } from "react";

import {
    ActivityIndicator,
    Alert,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { FontAwesome5 } from "@expo/vector-icons";

import SelectInput from "../SelectInput/SelectInput";
import TxtInput from "../TXTInput/TxtInput";

const INITIAL_FORM = {
    name: "",
    cpf: "",
    email: "",
    password: "",
    ubsId: "",
};

export default function RegisterModal({
    onClose,
}: {
    onClose: () => void;
}) {
    const [form, setForm] =
        useState(INITIAL_FORM);

    const [ubsList, setUbsList] =
        useState<any[]>([]);

    const [loading, setLoading] =
        useState(false);

    const [errors, setErrors] =
        useState<any>({});
    useEffect(() => {
        loadUBS();
    }, []);

    async function loadUBS() {
        try {
            const BACK_ROUTE =
                process.env.EXPO_PUBLIC_BACK_ROUTE;

            if (!BACK_ROUTE) {
                throw new Error(
                    "EXPO_PUBLIC_BACK_ROUTE não configurada."
                );
            }

            const response = await fetch(
                `${BACK_ROUTE}/ubs`
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Erro ao carregar UBS."
                );
            }

            setUbsList(data);
        } catch (error: any) {
            console.error(
                "Erro ao carregar UBS:",
                error
            );

            Alert.alert(
                "Erro",
                error?.message ||
                    "Não foi possível carregar as UBS."
            );
        }
    }
    function handleChange(
        name: keyof typeof INITIAL_FORM,
        value: string
    ) {
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev: any) => ({
            ...prev,
            [name]: "",
        }));
    }
    function formatCPF(value: string) {
        const numbers =
            value.replace(/\D/g, "");

        return numbers
            .slice(0, 11)
            .replace(
                /(\d{3})(\d)/,
                "$1.$2"
            )
            .replace(
                /(\d{3})(\d)/,
                "$1.$2"
            )
            .replace(
                /(\d{3})(\d{1,2})$/,
                "$1-$2"
            );
    }
    function validate() {
        const newErrors: any = {};

        const cpf =
            form.cpf.replace(/\D/g, "");

        if (!form.name.trim()) {
            newErrors.name =
                "Campo obrigatório";
        }

        if (!cpf) {
            newErrors.cpf =
                "Campo obrigatório";
        } else if (cpf.length !== 11) {
            newErrors.cpf =
                "CPF inválido";
        }

        if (!form.email.trim()) {
            newErrors.email =
                "Campo obrigatório";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                form.email
            )
        ) {
            newErrors.email =
                "E-mail inválido";
        }

        if (!form.password.trim()) {
            newErrors.password =
                "Campo obrigatório";
        } else if (
            form.password.length < 6
        ) {
            newErrors.password =
                "A senha deve possuir no mínimo 6 caracteres";
        }

        if (!form.ubsId) {
            newErrors.ubsId =
                "Campo obrigatório";
        }

        setErrors(newErrors);

        return (
            Object.keys(newErrors)
                .length === 0
        );
    }
    async function submit() {
        if (!validate()) {
            return;
        }

        try {
            setLoading(true);

            const BACK_ROUTE =
                process.env.EXPO_PUBLIC_BACK_ROUTE;

            if (!BACK_ROUTE) {
                throw new Error(
                    "EXPO_PUBLIC_BACK_ROUTE não configurada."
                );
            }

            const response = await fetch(
                `${BACK_ROUTE}/users`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        name: form.name,

                        cpf: form.cpf.replace(
                            /\D/g,
                            ""
                        ),

                        email: form.email,

                        password:
                            form.password,

                        ubsId: Number(
                            form.ubsId
                        ),
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Erro ao cadastrar."
                );
            }

            Alert.alert(
                "Sucesso",
                "Usuário cadastrado com sucesso!",
                [
                    {
                        text: "OK",
                        onPress: onClose,
                    },
                ]
            );
        } catch (error: any) {
            Alert.alert(
                "Erro",
                error?.message ||
                    "Erro ao cadastrar usuário."
            );
        } finally {
            setLoading(false);
        }
    }
    return (
        <Modal
            visible={true}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>

                <View style={styles.modal}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.closeBtn,

                            pressed &&
                                styles.closePressed,
                        ]}
                        onPress={onClose}
                    >
                        <FontAwesome5
                            name="times-circle"
                            size={38}
                            color="#111111"
                        />
                    </Pressable>
                    <Text
                        style={styles.title}
                    >
                        Novo Usuário
                    </Text>
                    <ScrollView
                        style={styles.scroll}
                        contentContainerStyle={
                            styles.form
                        }
                        showsVerticalScrollIndicator={
                            false
                        }
                        keyboardShouldPersistTaps="handled"
                    >
                        <TxtInput
                            id="name"
                            name="name"
                            label="Nome"
                            logo={
                                <FontAwesome5
                                    name="user"
                                    size={17}
                                    color="#3c6a48"
                                />
                            }
                            value={form.name}
                            onChangeText={(
                                value: string
                            ) =>
                                handleChange(
                                    "name",
                                    value
                                )
                            }
                            error={
                                errors.name
                            }
                            editable={!loading}
                        />
                        <TxtInput
                            id="cpf"
                            name="cpf"
                            label="CPF"
                            logo={
                                <FontAwesome5
                                    name="id-card"
                                    size={17}
                                    color="#3c6a48"
                                />
                            }
                            value={form.cpf}
                            onChangeText={(
                                value: string
                            ) =>
                                handleChange(
                                    "cpf",
                                    formatCPF(
                                        value
                                    )
                                )
                            }
                            error={
                                errors.cpf
                            }
                            keyboardType="numeric"
                            editable={!loading}
                        />
                        <TxtInput
                            id="email"
                            name="email"
                            label="Email"
                            logo={
                                <FontAwesome5
                                    name="envelope"
                                    size={17}
                                    color="#3c6a48"
                                />
                            }
                            value={form.email}
                            onChangeText={(
                                value: string
                            ) =>
                                handleChange(
                                    "email",
                                    value
                                )
                            }
                            error={
                                errors.email
                            }
                            keyboardType="email-address"
                            autoCapitalize="none"
                            editable={!loading}
                        />
                        <TxtInput
                            id="password"
                            name="password"
                            label="Senha"
                            logo={
                                <FontAwesome5
                                    name="lock"
                                    size={17}
                                    color="#3c6a48"
                                />
                            }
                            value={
                                form.password
                            }
                            onChangeText={(
                                value: string
                            ) =>
                                handleChange(
                                    "password",
                                    value
                                )
                            }
                            error={
                                errors.password
                            }
                            secureTextEntry
                            editable={!loading}
                        />
                        <SelectInput
                            id="ubsId"
                            name="ubsId"
                            label="UBS"
                            value={
                                form.ubsId
                            }
                            onChange={(
                                value: any
                            ) =>
                                handleChange(
                                    "ubsId",
                                    String(
                                        value
                                    )
                                )
                            }
                            logo={
                                <FontAwesome5
                                    name="hospital"
                                    size={17}
                                    color="#3c6a48"
                                />
                            }
                            options={ubsList.map(
                                (ubs) => ({
                                    value:
                                        String(
                                            ubs.id
                                        ),
                                    label:
                                        ubs.nome,
                                })
                            )}
                            error={
                                errors.ubsId
                            }
                            disabled={loading}
                        />
                        <View
                            style={
                                styles.buttons
                            }
                        >
                            <Pressable
                                onPress={submit}
                                disabled={
                                    loading
                                }
                                style={({
                                    pressed,
                                }) => [
                                    styles.button,

                                    loading &&
                                        styles.buttonDisabled,

                                    pressed &&
                                        !loading &&
                                        styles.buttonPressed,
                                ]}
                            >
                                {loading ? (
                                    <>
                                        <ActivityIndicator
                                            size="small"
                                            color="#ffffff"
                                        />

                                        <Text
                                            style={
                                                styles.buttonText
                                            }
                                        >
                                            Salvando...
                                        </Text>
                                    </>
                                ) : (
                                    <Text
                                        style={
                                            styles.buttonText
                                        }
                                    >
                                        Cadastrar
                                    </Text>
                                )}
                            </Pressable>
                        </View>

                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({

    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },

    modal: {
        width: "100%",
        maxWidth: 500,
        maxHeight: "90%",
        backgroundColor: "#ffffff",
        borderRadius: 10,
        padding: 20,
        position: "relative",
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 15,
    },

    title: {
        color: "#3c6a48",
        fontSize: 24,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 15,
        paddingTop: 5,
    },

    closeBtn: {
        position: "absolute",

        right: 10,

        top: 10,

        width: 45,

        height: 45,

        alignItems: "center",

        justifyContent: "center",

        zIndex: 10,
    },

    closePressed: {
        opacity: 0.45,
    },
    scroll: {
        width: "100%",
    },

    form: {
        width: "100%",

        gap: 8,

        paddingTop: 10,

        paddingBottom: 10,
    },
    buttons: {
        width: "100%",

        alignItems: "flex-end",

        marginTop: 8,
    },

    button: {
        minWidth: 130,

        height: 45,

        paddingHorizontal: 18,

        borderRadius: 5,

        backgroundColor: "#3c6a48",

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "center",

        gap: 8,

        elevation: 3,
    },

    buttonPressed: {
        backgroundColor: "#2f573a",

        transform: [
            {
                scale: 0.98,
            },
        ],
    },

    buttonDisabled: {
        opacity: 0.7,
    },

    buttonText: {
        color: "#ffffff",

        fontSize: 15,

        fontWeight: "700",
    },
});

