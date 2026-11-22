import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import SelectInput from "@/components/SelectInput/SelectInput";
import TxtInput from "@/components/TXTInput/TxtInput";

import DatePickerComp from "@/components/DataPickerComp/DatePickerComp";
import apiFetch from "@/components/FetchFunc/APIFetch";

export default function OcorrenciaModalUser({
    ocorrencia,
    onClose,
    onSuccess,
    config,
}:any) {
    const [form, setForm] = useState(
        createInitialForm(config.tipoField)
    );

    const [ubsList, setUbsList] = useState<any>([]);
    const [microAreaList, setMicroAreaList] = useState<any>([]);
    const [enderecoList, setEnderecoList] = useState<any>([]);
    const [categoriaList, setCategoriaList] = useState<any>([]);
    const [tipoList, setTipoList] = useState<any>([]);

    const [saving, setSaving] = useState(false);
    const [isCommonUser, setIsCommonUser] = useState(false);

    /*
     * Inicialização
     */
    useEffect(() => {
        async function initialize() {
            try {
                await loadCategorias();

                const userStorage = await AsyncStorage.getItem("user");

                const user = userStorage
                    ? JSON.parse(userStorage)
                    : null;

                if (user?.roles?.includes("user")) {
                    setIsCommonUser(true);

                    try {
                        const ubs = await loadCurrentUserUBS(user.cpf);

                        if (ubs) {
                            setUbsList([ubs]);

                            if (ocorrencia) {
                                await loadMicroAreas(ubs.id);
                            } else {
                                setForm((prev) => ({
                                    ...prev,
                                    ubsId: String(ubs.id),
                                }));

                                await loadMicroAreas(ubs.id);
                            }
                        }
                    } catch (err) {
                        console.error(
                            "Erro ao carregar UBS do usuário:",
                            err
                        );
                    }
                } else {
                    await loadUBS();
                }
            } catch (err) {
                console.error("Erro na inicialização:", err);
            }
        }

        void initialize();
    }, []);

    /*
     * Preenche formulário quando estiver editando
     */
    useEffect(() => {
        async function loadOcorrencia() {
            if (!ocorrencia) return;

            const tipo = ocorrencia[config.tipoRelation];

            const values = {
                ubsId: String(
                    ocorrencia.endereco.microArea.ubs.id
                ),

                microAreaId: String(
                    ocorrencia.endereco.microArea.id
                ),

                enderecoId: String(
                    ocorrencia.endereco.id
                ),

                categoriaId: String(
                    tipo.categoria.id
                ),

                [config.tipoField]: String(tipo.id),

                dataReferencia:
                    ocorrencia.dataReferencia?.substring(0, 10) || "",
            };

            setForm(values);

            await loadMicroAreas(values.ubsId);
            await loadEnderecos(values.microAreaId);
            await loadTipos(values.categoriaId);
        }

        void loadOcorrencia();
    }, [ocorrencia]);

    /*
     * Formulário inicial
     */
    function createInitialForm(tipoField:any) {
        return {
            ubsId: "",
            microAreaId: "",
            enderecoId: "",
            categoriaId: "",
            [tipoField]: "",
            dataReferencia: "",
        };
    }

    /*
     * Busca UBS do usuário
     */
    async function loadCurrentUserUBS(cpf:any) {
        const response = await apiFetch(
            `${process.env.EXPO_PUBLIC_BACK_ROUTE}/users/ubs/${cpf}`
        );

        if (!response.ok) {
            throw new Error(
                `Erro ao buscar UBS: ${response.status}`
            );
        }

        return await response.json();
    }

    /*
     * Função genérica para GET
     */
    async function fetchList(
        url:any,
        resourceName = "dados"
    ) {
        try {
            const response = await apiFetch(url);

            if (!response.ok) {
                if (response.status === 404) {
                    console.warn(
                        `Nenhum ${resourceName} encontrado.`
                    );

                    return [];
                }

                throw new Error(
                    `Erro ${response.status}: ${response.statusText}`
                );
            }

            const data = await response.json();

            return Array.isArray(data) ? data : [];
        } catch (err) {
            console.error(
                `Erro ao carregar ${resourceName}:`,
                err
            );

            return [];
        }
    }

    /*
     * UBS
     */
    async function loadUBS() {
        const data = await fetchList(
            `${process.env.EXPO_PUBLIC_BACK_ROUTE}/ubs`,
            "UBS"
        );

        setUbsList(data);
    }

    /*
     * Categorias
     */
    async function loadCategorias() {
        const data = await fetchList(
            `${process.env.EXPO_PUBLIC_BACK_ROUTE}/${config.categoriaEndpoint}`,
            "categorias"
        );

        setCategoriaList(data);
    }

    /*
     * Micro áreas
     */
    async function loadMicroAreas(id:any) {
        if (!id) {
            setMicroAreaList([]);
            return;
        }

        const data = await fetchList(
            `${process.env.EXPO_PUBLIC_BACK_ROUTE}/micro-areas/ubs/${id}`,
            "micro áreas"
        );

        setMicroAreaList(data);
    }

    /*
     * Endereços
     */
    async function loadEnderecos(id:any) {
        if (!id) {
            setEnderecoList([]);
            return;
        }

        const data = await fetchList(
            `${process.env.EXPO_PUBLIC_BACK_ROUTE}/enderecos/micro-area/${id}`,
            "endereços"
        );

        setEnderecoList(data);
    }

    /*
     * Tipos
     */
    async function loadTipos(id:any) {
        if (!id) {
            setTipoList([]);
            return;
        }

        const data:any = await fetchList(
            `${process.env.EXPO_PUBLIC_BACK_ROUTE}/${config.tipoEndpoint}/categoria/${id}`,
            config.tipoLabel?.toLowerCase() || "tipos"
        );

        setTipoList(data);
    }

    /*
     * Alteração dos campos
     *
     * No React Native não existe:
     *
     * e.target.name
     * e.target.value
     *
     * Por isso o SelectInput deve chamar:
     *
     * onChange(value)
     */
    async function handleChange(name:any, value:any) {
        let novo = {
            ...form,
            [name]: value,
        };

        /*
         * UBS
         */
        if (name === "ubsId") {
            if (isCommonUser) {
                return;
            }

            novo.microAreaId = "";
            novo.enderecoId = "";

            setForm(novo);

            await loadMicroAreas(value);

            setEnderecoList([]);

            return;
        }

        /*
         * Micro área
         */
        if (name === "microAreaId") {
            novo.enderecoId = "";

            setForm(novo);

            await loadEnderecos(value);

            return;
        }

        /*
         * Categoria
         */
        if (name === "categoriaId") {
            novo[config.tipoField] = "";

            setForm(novo);

            setTipoList([]);

            await loadTipos(value);

            return;
        }

        setForm(novo);
    }

    /*
     * Salvar
     */
    async function salvar() {
        try {
            setSaving(true);

            const body = {
                enderecoId: Number(form.enderecoId),

                [config.tipoField]: Number(
                    form[config.tipoField]
                ),

                dataReferencia: form.dataReferencia,
            };

            const url = ocorrencia
                ? `${process.env.EXPO_PUBLIC_BACK_ROUTE}/${config.ocorrenciaEndpoint}/${ocorrencia.id}`
                : `${process.env.EXPO_PUBLIC_BACK_ROUTE}/${config.ocorrenciaEndpoint}`;

            const response = await apiFetch(url, {
                method: ocorrencia ? "PATCH" : "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error(
                    `Erro ${response.status}`
                );
            }

            /*
            await OKMsg(
                "Operação realizada com sucesso!"
            );*/

            onSuccess?.();
        } catch (err) {
            console.error(err);

            /*
            await ErrMsg(
                "Erro ao realizar operação."
            );*/
        } finally {
            setSaving(false);
        }
    }

    return (
        <View style={styles.overlay}>
            <View style={styles.modal}>
                {/* HEADER */}
                <View style={styles.header}>
                    <Text style={styles.title}>
                        {ocorrencia
                            ? "Editar Ocorrência"
                            : "Nova Ocorrência"}
                    </Text>

                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                    >
                        <Ionicons
                            name="close"
                            size={26}
                            color="#333"
                        />
                    </TouchableOpacity>
                </View>

                {/* BODY */}
                <ScrollView
                    style={styles.body}
                    contentContainerStyle={
                        styles.bodyContent
                    }
                    keyboardShouldPersistTaps="handled"
                >
                    <SelectInput
                        name="ubsId"
                        label="UBS"
                        logo="business"
                        value={form.ubsId}
                        onChange={(value:any) =>
                            handleChange(
                                "ubsId",
                                value
                            )
                        }
                        disabled={isCommonUser}
                        options={ubsList.map((u:any) => ({
                            value: String(u.id),
                            label: u.nome,
                        }))}
                    />

                    <SelectInput
                        name="microAreaId"
                        label="Micro Área"
                        logo="map"
                        value={form.microAreaId}
                        onChange={(value:any) =>
                            handleChange(
                                "microAreaId",
                                value
                            )
                        }
                        options={microAreaList.map(
                            (m:any) => ({
                                value: String(m.id),
                                label: `${m.codigo} - ${m.equipe}`,
                            })
                        )}
                    />

                    <SelectInput
                        name="enderecoId"
                        label="Endereço"
                        logo="location"
                        value={form.enderecoId}
                        onChange={(value:any) =>
                            handleChange(
                                "enderecoId",
                                value
                            )
                        }
                        options={enderecoList.map(
                            (e:any) => ({
                                value: String(e.id),
                                label: `${e.logradouro}, ${e.numero}`,
                            })
                        )}
                    />

                    <SelectInput
                        name="categoriaId"
                        label="Categoria"
                        logo="layers"
                        value={form.categoriaId}
                        onChange={(value:any) =>
                            handleChange(
                                "categoriaId",
                                value
                            )
                        }
                        options={categoriaList.map(
                            (c:any) => ({
                                value: String(c.id),
                                label: c.nome,
                            })
                        )}
                    />

                    <SelectInput
                        name={config.tipoField}
                        label={config.tipoLabel}
                        logo="warning"
                        value={
                            form[config.tipoField]
                        }
                        onChange={(value:any) =>
                            handleChange(
                                config.tipoField,
                                value
                            )
                        }
                        options={tipoList.map(
                            (t:any) => ({
                                value: String(t.id),
                                label: t.nome,
                            })
                        )}
                    />

                    <TxtInput
                        name="dataReferencia"
                        label="Data da Ocorrência"
                        value={form.dataReferencia}
                        onChangeText={(value:any) =>
                            handleChange(
                                "dataReferencia",
                                value
                            )
                        }
                        placeholder="AAAA-MM-DD"
                    />
                    <DatePickerComp form={form} handleChange={handleChange}></DatePickerComp>
                </ScrollView>

                {/* FOOTER */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.cancel}
                        onPress={onClose}
                        disabled={saving}
                    >
                        <Text
                            style={
                                styles.cancelText
                            }
                        >
                            Cancelar
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.save,
                            saving &&
                                styles.saveDisabled,
                        ]}
                        onPress={salvar}
                        disabled={saving}
                    >
                        {saving ? (
                            <>
                                <ActivityIndicator
                                    color="#fff"
                                    size="small"
                                />

                                <Text
                                    style={
                                        styles.saveText
                                    }
                                >
                                    Salvando...
                                </Text>
                            </>
                        ) : (
                            <>
                                <Ionicons
                                    name="save-outline"
                                    size={19}
                                    color="#fff"
                                />

                                <Text
                                    style={
                                        styles.saveText
                                    }
                                >
                                    Salvar
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,

        backgroundColor: "rgba(0,0,0,0.45)",

        justifyContent: "center",
        alignItems: "center",

        zIndex: 999,
    },

    modal: {
        width: "92%",
        maxHeight: "90%",

        backgroundColor: "#fff",

        borderRadius: 10,

        overflow: "hidden",

        elevation: 8,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5,
    },

    header: {
        flexDirection: "row",

        justifyContent: "space-between",

        alignItems: "center",

        paddingHorizontal: 20,
        paddingVertical: 16,

        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },

    title: {
        fontSize: 20,
        fontWeight: "700",
        color: "#222",
    },

    closeButton: {
        padding: 4,
    },

    body: {
        paddingHorizontal: 20,
    },

    bodyContent: {
        paddingVertical: 20,
        gap: 18,
    },

    footer: {
        flexDirection: "row",

        justifyContent: "flex-end",

        alignItems: "center",

        gap: 10,

        padding: 20,

        borderTopWidth: 1,
        borderTopColor: "#ddd",
    },

    cancel: {
        backgroundColor: "#ccc",

        paddingVertical: 11,
        paddingHorizontal: 20,

        borderRadius: 6,
    },

    cancelText: {
        color: "#222",
        fontSize: 15,
        fontWeight: "600",
    },

    save: {
        backgroundColor: "#1b7d3d",

        paddingVertical: 11,
        paddingHorizontal: 20,

        borderRadius: 6,

        flexDirection: "row",
        alignItems: "center",

        gap: 8,
    },

    saveDisabled: {
        opacity: 0.7,
    },

    saveText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "600",
    },
});