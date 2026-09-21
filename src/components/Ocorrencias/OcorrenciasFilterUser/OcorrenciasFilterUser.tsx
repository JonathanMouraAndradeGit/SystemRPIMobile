import { useEffect, useState } from "react";

import {
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";

import apiFetch from "@/components/FetchFunc/APIFetch";
import SelectInput from "@/components/SelectInput/SelectInput";
import TxtInput from "@/components/TXTInput/TxtInput";

import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
/*
import {
    FaEraser,
    FaFileAlt,
    FaHospital,
    FaLayerGroup,
    FaMapMarkerAlt,
    FaMapSigns,
    FaSearch,
    FaSkullCrossbones,
} from "react-icons/fa";*/


export default function OcorrenciaFiltersUser({
    filters,
    onChange,
    onSearch,
    onClear,
    expOcorrencia,
    config,
    isCommonUser,
}: any) {

    const { width } = useWindowDimensions();

    const isSmallMobile = width <= 480;
    const isMobile = width <= 768;
    const isTablet = width <= 992;

    const [ubsList, setUbsList] = useState<any[]>([]);
    const [microAreaList, setMicroAreaList] = useState<any[]>([]);
    const [enderecoList, setEnderecoList] = useState<any[]>([]);
    const [categoriaList, setCategoriaList] = useState<any[]>([]);
    const [tipoRiscoList, setTipoRiscoList] = useState<any[]>([]);

    const baseUrl = process.env.EXPO_PUBLIC_BACK_ROUTE;

    /* =========================
       RESPONSIVIDADE
    ========================= */

    const containerPadding = isSmallMobile
        ? 14
        : isMobile
            ? 18
            : isTablet
                ? 22
                : 25;

    const containerGap = isSmallMobile
        ? 16
        : isMobile
            ? 18
            : isTablet
                ? 22
                : 25;

    const fieldColumns = isMobile ? 1 : 2;

    /* =========================
       INICIALIZAÇÃO
    ========================= */

    useEffect(() => {
        async function initialize() {
            await loadCategorias();

            try {
                const userStorage =
                    await AsyncStorage.getItem("user");

                const user = userStorage
                    ? JSON.parse(userStorage)
                    : null;

                if (user?.roles?.includes("user")) {

                    try {
                        const ubs =
                            await loadCurrentUserUBS(user.cpf);

                        setUbsList([ubs]);

                        if (
                            String(filters.ubsId) !==
                            String(ubs.id)
                        ) {
                            onChange(
                                "ubsId",
                                String(ubs.id)
                            );
                        }

                    } catch (err) {
                        console.error(err);
                    }

                } else {
                    await loadUBS();
                }

            } catch (err) {
                console.error(
                    "Erro ao inicializar filtros:",
                    err
                );
            }
        }

        initialize();
    }, []);

    /* =========================
       UBS
    ========================= */

    useEffect(() => {

        if (filters.ubsId) {
            loadMicroAreas(filters.ubsId);
        } else {
            setMicroAreaList([]);
            setEnderecoList([]);
        }

    }, [filters.ubsId]);

    /* =========================
       MICRO ÁREA
    ========================= */

    useEffect(() => {

        if (filters.microAreaId) {
            loadEnderecos(filters.microAreaId);
        } else {
            setEnderecoList([]);
        }

    }, [filters.microAreaId]);

    /* =========================
       CATEGORIA
    ========================= */

    useEffect(() => {

        if (filters.categoriaId) {
            loadTipos(filters.categoriaId);
        } else {
            setTipoRiscoList([]);
        }

    }, [filters.categoriaId]);

    /* =========================
       API
    ========================= */

    async function loadCurrentUserUBS(cpf: string) {

        const response = await apiFetch(
            `${baseUrl}/users/ubs/${cpf}`
        );

        return await response.json();
    }

    async function loadUBS() {

        try {

            const response = await apiFetch(
                `${baseUrl}/ubs`
            );

            const data = await response.json();

            setUbsList(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {

            console.error(
                "Erro ao carregar UBS:",
                err
            );

            setUbsList([]);
        }
    }

    async function loadCategorias() {

        try {

            const response = await apiFetch(
                `${baseUrl}/${config.categoriaEndpoint}/`
            );

            const data = await response.json();

            setCategoriaList(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {

            console.error(
                "Erro ao carregar categorias:",
                err
            );

            setCategoriaList([]);
        }
    }

    async function loadMicroAreas(
        id: string | number
    ) {

        try {

            const response = await apiFetch(
                `${baseUrl}/micro-areas/ubs/${id}`
            );

            const data = await response.json();

            setMicroAreaList(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {

            console.error(
                "Erro ao carregar micro áreas:",
                err
            );

            setMicroAreaList([]);
        }
    }

    async function loadEnderecos(
        id: string | number
    ) {

        try {

            const response = await apiFetch(
                `${baseUrl}/enderecos/micro-area/${id}`
            );

            if (!response.ok) {

                if (response.status === 404) {
                    setEnderecoList([]);
                    return;
                }

                throw new Error(
                    `Erro ${response.status}: ${response.statusText}`
                );
            }

            const data = await response.json();

            setEnderecoList(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {

            console.error(
                "Erro ao carregar endereços:",
                err
            );

            setEnderecoList([]);
        }
    }

    async function loadTipos(
        id: string | number
    ) {

        try {

            const response = await apiFetch(
                `${baseUrl}/${config.tipoEndpoint}/categoria/${id}`
            );

            if (!response.ok) {

                if (response.status === 404) {
                    setTipoRiscoList([]);
                    return;
                }

                throw new Error(
                    `Erro ${response.status}: ${response.statusText}`
                );
            }

            const data = await response.json();

            setTipoRiscoList(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {

            console.error(
                "Erro ao carregar tipos de risco:",
                err
            );

            setTipoRiscoList([]);
        }
    }

    /* =========================
       HANDLERS
    ========================= */

    function handleUbsChange(value: string) {

        if (isCommonUser) {
            return;
        }

        onChange("ubsId", value);

        onChange("microAreaId", "");

        onChange("enderecoId", "");
    }

    function handleMicroAreaChange(
        value: string
    ) {

        onChange(
            "microAreaId",
            value
        );

        onChange(
            "enderecoId",
            ""
        );
    }

    function handleCategoriaChange(
        value: string
    ) {

        onChange(
            "categoriaId",
            value
        );

        onChange(
            config.tipoField,
            ""
        );
    }

    /* =========================
       RENDER
    ========================= */

    return (
        <View
            style={[
                styles.container,
                {
                    padding: containerPadding,
                    gap: containerGap,
                },
            ]}
        >

            {/* =========================
                FILTROS
            ========================= */}

            <View
                style={[
                    styles.grid,
                    {
                        gap: isSmallMobile
                            ? 12
                            : isMobile
                                ? 14
                                : 20,
                    },
                ]}
            >

                {/* UBS */}

                <View
                    style={{
                        width:
                            fieldColumns === 1
                                ? "100%"
                                : "48%",
                    }}
                >
                    <SelectInput
                        id="ubsId"
                        name="ubsId"
                        label="UBS"
                        /*logo={/*<FaHospital />}*/
                        value={filters.ubsId}
                        onChange={handleUbsChange}
                        disabled={isCommonUser}
                        options={ubsList.map(
                            (ubs) => ({
                                value:
                                    String(ubs.id),
                                label:
                                    ubs.nome,
                            })
                        )}
                    />
                </View>

                {/* MICRO ÁREA */}

                <View
                    style={{
                        width:
                            fieldColumns === 1
                                ? "100%"
                                : "48%",
                    }}
                >
                    <SelectInput
                        id="microAreaId"
                        name="microAreaId"
                        label="Micro Área"
                        /*logo={<FaMapSigns />}*/
                        value={
                            filters.microAreaId
                        }
                        onChange={
                            handleMicroAreaChange
                        }
                        options={
                            microAreaList.map(
                                (m) => ({
                                    value:
                                        String(m.id),
                                    label:
                                        `${m.codigo} - ${m.equipe}`,
                                })
                            )
                        }
                    />
                </View>

                {/* ENDEREÇO */}

                <View
                    style={{
                        width:
                            fieldColumns === 1
                                ? "100%"
                                : "48%",
                    }}
                >
                    <SelectInput
                        id="enderecoId"
                        name="enderecoId"
                        label="Endereço"
                        /*logo={
                            <FaMapMarkerAlt />
                        }*/
                        value={
                            filters.enderecoId
                        }
                        onChange={(
                            value: string
                        ) =>
                            onChange(
                                "enderecoId",
                                value
                            )
                        }
                        options={
                            enderecoList.map(
                                (e) => ({
                                    value:
                                        String(e.id),
                                    label:
                                        `${e.logradouro}, ${e.numero}`,
                                })
                            )
                        }
                    />
                </View>

                {/* CATEGORIA */}

                <View
                    style={{
                        width:
                            fieldColumns === 1
                                ? "100%"
                                : "48%",
                    }}
                >
                    <SelectInput
                        id="categoriaId"
                        name="categoriaId"
                        label="Categoria"
                        /*logo={
                            <FaLayerGroup />
                        }*/
                        value={
                            filters.categoriaId
                        }
                        onChange={
                            handleCategoriaChange
                        }
                        options={
                            categoriaList.map(
                                (c) => ({
                                    value:
                                        String(c.id),
                                    label:
                                        c.nome,
                                })
                            )
                        }
                    />
                </View>

                {/* TIPO */}

                <View
                    style={{
                        width:
                            fieldColumns === 1
                                ? "100%"
                                : "48%",
                    }}
                >
                    <SelectInput
                        id={config.tipoField}
                        name={config.tipoField}
                        label={config.tipoLabel}
                        value={
                            filters[
                                config.tipoField
                            ]
                        }
                        /*logo={
                            <FaSkullCrossbones />
                        }*/
                        onChange={(
                            value: string
                        ) =>
                            onChange(
                                config.tipoField,
                                value
                            )
                        }
                        options={
                            tipoRiscoList.map(
                                (t) => ({
                                    value:
                                        String(t.id),
                                    label:
                                        t.nome,
                                })
                            )
                        }
                    />
                </View>

                {/* DATA INICIAL */}

                <View
                    style={{
                        width:
                            fieldColumns === 1
                                ? "100%"
                                : "48%",
                    }}
                >
                    <TxtInput
                        id="dataInicial"
                        label="Data Inicial"
                        value={
                            filters.dataInicial
                        }
                        onChange={(
                            value: string
                        ) =>
                            onChange(
                                "dataInicial",
                                value
                            )
                        }
                    />
                </View>

                {/* DATA FINAL */}

                <View
                    style={{
                        width:
                            fieldColumns === 1
                                ? "100%"
                                : "48%",
                    }}
                >
                    <TxtInput
                        id="dataFinal"
                        label="Data Final"
                        value={
                            filters.dataFinal
                        }
                        onChange={(
                            value: string
                        ) =>
                            onChange(
                                "dataFinal",
                                value
                            )
                        }
                    />
                </View>

            </View>

            {/* =========================
                BOTÕES
            ========================= */}

            <View
                style={[
                    styles.actions,
                    {
                        flexDirection:
                            isSmallMobile
                                ? "row"
                                : "row",

                        gap: isSmallMobile
                            ? 10
                            : 12,
                    },
                ]}
            >

                {/* PESQUISAR */}

                <TouchableOpacity
                    style={[styles.button,styles.searchButton,
                        {
                            flex: isSmallMobile ? 1 : undefined,
                            paddingHorizontal: isSmallMobile ? 12 : 18,
                        },
                    ]}
                    onPress={onSearch}
                    activeOpacity={0.8}>
                    {/*<FaSearch color="#fff" />*/}
                    <FontAwesome
                        name="search"
                        size={14}
                        color="#ffffff"
                    />
                    {!isSmallMobile && (
                        <Text style={styles.buttonText}>
                            Pesquisar
                        </Text>
                    )}

                </TouchableOpacity>

                {/* LIMPAR */}

                <TouchableOpacity
                    style={[styles.button,styles.clearButton,{
                            flex: isSmallMobile ? 1 : undefined,
                            paddingHorizontal: isSmallMobile ? 12 : 18,
                        },
                    ]}
                    onPress={onClear}
                    activeOpacity={0.8}
                >

                    {/*<FaEraser color="#555" />*/}
                    <FontAwesome
                        name="eraser"
                        size={14}
                        color="#555"
                    />

                    {!isSmallMobile && (
                        <Text style={[styles.buttonText,styles.clearText,]}>
                            Limpar filtros
                        </Text>
                    )}

                </TouchableOpacity>

                {/* EXPORTAR */}

                <TouchableOpacity
                    style={[
                        styles.button,
                        styles.exportButton,
                        {
                            flex: isSmallMobile ? 1 : undefined,
                            paddingHorizontal: isSmallMobile ? 12 : 18,
                        },
                    ]}
                    onPress={expOcorrencia}
                    activeOpacity={0.8}
                >

                    {/*<FaFileAlt color="#fff" />*/}
                    <FontAwesome
                        name="file"
                        size={14}
                        color="#ffffff"
                    />

                    {!isSmallMobile && (
                        <Text style={styles.buttonText}>
                            Exportar para Excel
                        </Text>
                    )}

                </TouchableOpacity>

            </View>

        </View>
    );
}

/* =========================
   STYLES
========================= */

const styles = StyleSheet.create({

    container: {
        width: "100%",
        backgroundColor: "#ffffff",

        borderRadius: 16,

        borderWidth: 1,
        borderColor:
            "rgba(102, 102, 102, 0.10)",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.07,
        shadowRadius: 20,

        elevation: 3,

        flexDirection: "column",
    },

    grid: {
        width: "100%",

        flexDirection: "row",

        flexWrap: "wrap",

        justifyContent:
            "space-between",
    },

    actions: {
        width: "100%",

        flexDirection: "row",

        alignItems: "center",

        justifyContent:
            "flex-end",

        flexWrap: "wrap",
    },

    button: {
        minHeight: 45,

        borderRadius: 10,

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "center",

        gap: 10,
    },

    searchButton: {
        backgroundColor: "#3c6a48",
    },

    exportButton: {
        backgroundColor: "#3c6a48",
    },

    clearButton: {
        backgroundColor: "#f3f4f3",

        borderWidth: 1,

        borderColor: "#d6d6d6",
    },

    buttonText: {
        color: "#ffffff",

        fontSize: 14,

        fontWeight: "600",
    },

    clearText: {
        color: "#555555",
    },
});