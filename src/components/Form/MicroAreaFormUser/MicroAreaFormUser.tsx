import { useEffect, useState } from "react";

import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { FontAwesome5 } from "@expo/vector-icons";

import apiFetch from "@/components/FetchFunc/APIFetch";
import TxtInput from "@/components/TXTInput/TxtInput";
import SelectInput from "../../SelectInput/SelectInput";

import ErrMsg from "@/components/Alerts/ErrMsg";
import OKMsg from "@/components/Alerts/OKMsg";


const INITIAL_FORM = {
    codigo: "",
    equipe: "",
    ubs: "",
};


export default function MicroAreaFormUser({
    obj,
    onSuccess,
    onCancel,
}: any) {

    const [form, setForm] =
        useState(INITIAL_FORM);

    const [ubsList, setUbsList] =
        useState<any[]>([]);

    const [errors, setErrors] =
        useState<{
            codigo?: string;
            equipe?: string;
            ubs?: string;
        }>({});

    const [loading, setLoading] =
        useState(false);

    const [isCommonUser, setIsCommonUser] =
        useState(false);


    /* =========================
       INICIALIZAÇÃO
    ========================== */

    useEffect(() => {

        async function initialize() {

            try {

                const data =
                    await AsyncStorage.getItem(
                        "user"
                    );

                const user =
                    data
                        ? JSON.parse(data)
                        : null;


                /*
                 * USUÁRIO COMUM
                 */

                if (
                    user?.roles?.includes("user")
                ) {

                    setIsCommonUser(true);

                    try {

                        const ubs =
                            await loadCurrentUserUBS(
                                user.cpf
                            );

                        setUbsList([ubs]);

                        setForm({
                            codigo:
                                obj?.codigo ?? "",

                            equipe:
                                obj?.equipe ?? "",

                            ubs:
                                String(
                                    obj?.ubs?.id ??
                                    ubs?.id ??
                                    ""
                                ),
                        });

                    } catch (error) {

                        console.error(
                            "Erro ao carregar UBS do usuário:",
                            error
                        );

                    }

                }

                /*
                 * ADMIN / OUTROS
                 */

                else {

                    setIsCommonUser(false);

                    await loadUBS();

                    if (obj) {

                        setForm({
                            codigo:
                                obj.codigo ?? "",

                            equipe:
                                obj.equipe ?? "",

                            ubs:
                                String(
                                    obj?.ubs?.id ??
                                    ""
                                ),
                        });

                    } else {

                        setForm(
                            INITIAL_FORM
                        );

                    }

                }

            } catch (error) {

                console.error(
                    "Erro ao inicializar formulário:",
                    error
                );

            }

        }

        initialize();

    }, [obj]);


    /* =========================
       UBS DO USUÁRIO
    ========================== */

    async function loadCurrentUserUBS(
        cpf: string
    ) {

        const response =
            await apiFetch(
                `${process.env.EXPO_PUBLIC_BACK_ROUTE}/users/ubs/${cpf}`
            );

        if (!response.ok) {

            throw new Error(
                "Erro ao carregar UBS do usuário."
            );

        }

        return await response.json();
    }


    /* =========================
       TODAS AS UBS
    ========================== */

    async function loadUBS() {

        try {

            const response =
                await apiFetch(
                    `${process.env.EXPO_PUBLIC_BACK_ROUTE}/ubs`
                );

            if (!response.ok) {

                throw new Error(
                    "Erro ao carregar UBS."
                );

            }

            const data =
                await response.json();

            setUbsList(data);

        } catch (error) {

            console.error(
                "Erro ao carregar UBS:",
                error
            );

        }

    }


    /* =========================
       ALTERAÇÃO DOS CAMPOS
    ========================== */

    function handleChange(
        name: string,
        value: string
    ) {

        setForm(prev => ({
            ...prev,
            [name]: value,
        }));

        setErrors(prev => ({
            ...prev,
            [name]: "",
        }));

    }


    /* =========================
       VALIDAÇÃO
    ========================== */

    function validate() {

        const newErrors: {
            codigo?: string;
            equipe?: string;
            ubs?: string;
        } = {};


        if (!form.codigo.trim()) {

            newErrors.codigo =
                "Campo obrigatório";

        }


        if (!form.equipe.trim()) {

            newErrors.equipe =
                "Campo obrigatório";

        }


        if (!form.ubs) {

            newErrors.ubs =
                "Selecione uma UBS";

        }


        setErrors(newErrors);

        return (
            Object.keys(newErrors)
                .length === 0
        );

    }


    /* =========================
       ENVIO
    ========================== */

    async function submit() {

        if (!validate()) {
            return;
        }


        const BACK_ROUTE =
            process.env.EXPO_PUBLIC_BACK_ROUTE;


        if (!BACK_ROUTE) {

            await ErrMsg(
                "A variável EXPO_PUBLIC_BACK_ROUTE não está configurada."
            );

            return;

        }


        const url = obj?.id

            ? `${BACK_ROUTE}/micro-areas/${obj.id}`

            : `${BACK_ROUTE}/micro-areas`;


        const method =
            obj?.id
                ? "PATCH"
                : "POST";


        try {

            setLoading(true);


            const response =
                await apiFetch(
                    url,
                    {
                        method,

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body:
                            JSON.stringify({
                                codigo:
                                    form.codigo,

                                equipe:
                                    form.equipe,

                                ubsId:
                                    Number(
                                        form.ubs
                                    ),
                            }),
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Erro ao realizar operação."
                );

            }

            OKMsg("Operação realizada com sucesso!");
            onSuccess?.();
            setForm(INITIAL_FORM);
            setErrors({});
            


            /*
             * Limpa o formulário
             */
        } catch (error) {

            console.error(
                "Erro:",
                error
            );


            await ErrMsg(
                "Erro ao realizar operação."
            );


        } finally {

            setLoading(false);

        }

    }


    /* =========================
       RENDER
    ========================== */

    return (

        <View style={styles.container}>

            {/* TÍTULO */}

            <Text style={styles.title}>
                Cadastro de Microárea
            </Text>


            {/* CÓDIGO */}

            <TxtInput
                id="codigo"
                label="Código"
                value={form.codigo}

                onChangeText={(value: string) =>
                    handleChange(
                        "codigo",
                        value
                    )
                }

                logo={
                    <FontAwesome5
                        name="map-signs"
                        size={17}
                        color="#3c6a48"
                    />
                }

                error={
                    errors.codigo
                }

                editable={!loading}
            />


            {/* EQUIPE */}

            <TxtInput
                id="equipe"
                label="Equipe"
                value={form.equipe}

                onChangeText={(value: string) =>
                    handleChange(
                        "equipe",
                        value
                    )
                }

                logo={
                    <FontAwesome5
                        name="users"
                        size={17}
                        color="#3c6a48"
                    />
                }

                error={
                    errors.equipe
                }

                editable={!loading}
            />


            {/* UBS */}

            <SelectInput
                id="ubs"
                name="ubs"
                label="UBS"

                value={form.ubs}

                onChange={(value: any) =>
                    handleChange(
                        "ubs",
                        String(value)
                    )
                }

                logo={
                    <FontAwesome5
                        name="hospital"
                        size={17}
                        color="#3c6a48"
                    />
                }

                error={
                    errors.ubs
                }

                disabled={
                    isCommonUser ||
                    loading
                }

                options={
                    ubsList.map(
                        (ubs: any) => ({
                            value:
                                String(
                                    ubs.id
                                ),

                            label:
                                ubs.nome,
                        })
                    )
                }
            />


            {/* BOTÃO */}

            <Pressable
                onPress={submit}
                disabled={loading}

                style={({ pressed }) => [
                    styles.button,

                    loading &&
                        styles.buttonDisabled,

                    pressed &&
                        !loading &&
                        styles.buttonPressed,
                ]}
            >

                {loading ? (

                    <View
                        style={
                            styles.loadingContainer
                        }
                    >

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

                    </View>

                ) : (

                    <Text
                        style={
                            styles.buttonText
                        }
                    >
                        {obj?.id
                            ? "Salvar alterações"
                            : "Cadastrar"}
                    </Text>

                )}

            </Pressable>

        </View>
    );
}


/* =========================
   STYLES
========================= */

const styles = StyleSheet.create({

    container: {

        width: "100%",

        padding: 30,

        backgroundColor:
            "#ffffff",

        borderRadius: 15,

        shadowColor: "#000000",

        shadowOffset: {
            width: 0,
            height: 5,
        },

        shadowOpacity: 0.08,

        shadowRadius: 10,

        elevation: 3,

        gap: 18,

    },


    /* =========================
       TÍTULO
    ========================== */

    title: {

        width: "100%",

        textAlign: "center",

        color: "#333333",

        fontSize: 22,

        fontWeight: "700",

        marginBottom: 4,

    },


    /* =========================
       BOTÃO
    ========================== */

    button: {

        width: "100%",

        minHeight: 48,

        borderRadius: 10,

        backgroundColor:
            "#4f46e5",

        alignItems: "center",

        justifyContent: "center",

        paddingHorizontal: 18,

        marginTop: 2,

    },


    buttonPressed: {

        backgroundColor:
            "#4338ca",

        transform: [
            {
                translateY: 1,
            },
        ],

        elevation: 4,

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

        gap: 10,

    },

});