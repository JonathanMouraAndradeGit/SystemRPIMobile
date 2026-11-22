import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";

import apiFetch from "@/components/FetchFunc/APIFetch";
import TxtInput from "@/components/TXTInput/TxtInput";
import SelectInput from "../../SelectInput/SelectInput";

export default function OcorrenciaFilterMap({
    filters,
    onChange,
    onSearch,
    onClear,
    config,
    isCommonUser,
    configOpt,
    selectedConf,
    setSelectedConf,
    user,
}:any) {
    const { width } = useWindowDimensions();

    const [ubsList, setUbsList] = useState<any>([]);
    const [microAreaList, setMicroAreaList] = useState<any>([]);
    const [enderecoList, setEnderecoList] = useState<any>([]);
    const [categoriaList, setCategoriaList] = useState<any>([]);
    const [tipoList, setTipoList] = useState<any>([]);

    /*
     * ============================================================
     * RESPONSIVIDADE
     * ============================================================
     */

    const isSmallMobile = width <= 480;
    const isMobile = width <= 768;
    const isTablet = width <= 992;

    /*
     * ============================================================
     * CARREGAR UBS
     * ============================================================
     */

    useEffect(() => {
        async function initializeUBS() {
            /*
             * O user deve vir do seu contexto,
             * Redux, AsyncStorage, etc.
             *
             * Passe a prop "user" para este componente.
             */

            if (user?.roles?.includes("user")) {
                try {
                    const ubs:any = await loadCurrentUserUBS(user.cpf);

                    if (!ubs) {
                        return;
                    }
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
                    console.error(
                        "Erro ao carregar UBS do usuário:",
                        err
                    );
                }
            } else {
                await loadUBS();
            }
        }

        void initializeUBS();
    }, []);

    /*
     * ============================================================
     * CARREGAR CATEGORIAS
     * ============================================================
     */

    useEffect(() => {
        if (!config?.categoriaEndpoint) {
            return;
        }

        void loadCategorias();
    }, [config?.categoriaEndpoint]);

    /*
     * ============================================================
     * CARREGAR MICRO ÁREAS
     * ============================================================
     */

    useEffect(() => {
        if (!filters.ubsId) {
            setMicroAreaList([]);
            setEnderecoList([]);
            return;
        }

        void loadMicroAreas(filters.ubsId);
    }, [filters.ubsId]);

    /*
     * ============================================================
     * CARREGAR ENDEREÇOS
     * ============================================================
     */

    useEffect(() => {
        if (!filters.microAreaId) {
            setEnderecoList([]);
            return;
        }

        let rs = async ()=>{await loadEnderecos(filters.microAreaId);}
        void rs()
    }, [filters.microAreaId]);

    /*
     * ============================================================
     * CARREGAR TIPOS
     * ============================================================
     */

    useEffect(() => {
        if (
            !filters.categoriaId ||
            !config?.tipoEndpoint
        ) {
            setTipoList([]);
            return;
        }

        void loadTipos(filters.categoriaId);
    }, [
        filters.categoriaId,
        config?.tipoEndpoint,
    ]);

    /*
     * ============================================================
     * UBS DO USUÁRIO
     * ============================================================
     */

    async function loadCurrentUserUBS(cpf:any) {
        const response = await apiFetch(
            `${process.env.EXPO_PUBLIC_BACK_ROUTE}/users/ubs/${cpf}`
        );

        if (!response.ok) {
            throw new Error(
                "Erro ao buscar UBS do usuário"
            );
        }

        return await response.json();
    }

    /*
     * ============================================================
     * TODAS AS UBS
     * ============================================================
     */

    async function loadUBS() {
        try {
            const response = await apiFetch(
                `${process.env.EXPO_PUBLIC_BACK_ROUTE}/ubs`
            );

            if (!response.ok) {
                throw new Error(
                    `Erro ${response.status}: ${response.statusText}`
                );
            }

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

    /*
     * ============================================================
     * CATEGORIAS
     * ============================================================
     */

    async function loadCategorias() {
        try {
            const response = await apiFetch(
                `${process.env.EXPO_PUBLIC_BACK_ROUTE}/${config.categoriaEndpoint}/`
            );

            if (!response.ok) {
                throw new Error(
                    `Erro ${response.status}: ${response.statusText}`
                );
            }

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

    /*
     * ============================================================
     * MICRO ÁREAS
     * ============================================================
     */

    async function loadMicroAreas(id:any) {
        try {
            const response = await apiFetch(
                `${process.env.EXPO_PUBLIC_BACK_ROUTE}/micro-areas/ubs/${id}`
            );

            if (!response.ok) {
                throw new Error(
                    `Erro ${response.status}: ${response.statusText}`
                );
            }

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

    /*
     * ============================================================
     * ENDEREÇOS
     * ============================================================
     */

    async function loadEnderecos(id:any) {
        try {
            const response = await apiFetch(
                `${process.env.EXPO_PUBLIC_BACK_ROUTE}/enderecos/micro-area/${id}`
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

    /*
     * ============================================================
     * TIPOS
     * ============================================================
     */

    async function loadTipos(id:any) {
        try {
            const response = await apiFetch(
                `${process.env.EXPO_PUBLIC_BACK_ROUTE}/${config.tipoEndpoint}/categoria/${id}`
            );

            if (!response.ok) {
                if (response.status === 404) {
                    setTipoList([]);
                    return;
                }

                throw new Error(
                    `Erro ${response.status}: ${response.statusText}`
                );
            }

            const data:any[] = await response.json();
            setTipoList(Array.isArray(data)
                    ? data
                    : []
            );
        } catch (err) {
            console.error(
                "Erro ao carregar tipos:",
                err
            );

            setTipoList([]);
        }
    }

    /*
     * ============================================================
     * TROCAR CONFIGURAÇÃO
     * ============================================================
     */

    function handleConfigChange(value:any) {
        const selected = configOpt.find(
            (item:any) =>
                String(item.id) ===
                String(value)
        );

        if (!selected) {
            return;
        }

        setSelectedConf(selected);

        onChange("microAreaId", "");
        onChange("enderecoId", "");
        onChange("categoriaId", "");
        onChange(selected.tipoField, "");
        onChange("dataInicial", "");
        onChange("dataFinal", "");

        setCategoriaList([]);
        setTipoList([]);
    }

    /*
     * ============================================================
     * ALTERAÇÃO DOS FILTROS
     * ============================================================
     */

    function handle(name:any, value:any) {
        /*
         * UBS
         */

        if (name === "ubsId") {
            if (isCommonUser) {
                return;
            }

            onChange("ubsId", value);
            onChange("microAreaId", "");
            onChange("enderecoId", "");

            return;
        }

        /*
         * MICRO ÁREA
         */

        if (name === "microAreaId") {
            onChange("microAreaId", value);
            onChange("enderecoId", "");

            return;
        }

        /*
         * CATEGORIA
         */

        if (name === "categoriaId") {
            onChange("categoriaId", value);
            onChange(config.tipoField, "");

            return;
        }

        /*
         * DEMAIS FILTROS
         */

        onChange(name, value);
    }

    /*
     * ============================================================
     * ESTILOS RESPONSIVOS
     * ============================================================
     */

    const containerStyle = [
        styles.container,

        isTablet && styles.containerTablet,

        isMobile && styles.containerMobile,

        isSmallMobile &&
            styles.containerSmallMobile,
    ];

    const gridStyle = [
        styles.grid,

        isTablet && styles.gridTablet,

        isMobile && styles.gridMobile,

        isSmallMobile &&
            styles.gridSmallMobile,
    ];

    /*
     * ============================================================
     * RENDER
     * ============================================================
     */

    return (
        <View style={containerStyle}>

            {/* =================================================
                CAMPOS
            ================================================= */}

            <View style={gridStyle}>

                {/* OCORRÊNCIA */}

                <View style={styles.field}>

                    <SelectInput
                        id="ocorrenciaId"
                        name="ocorrenciaId"
                        label="Ocorrência"
                        logo={
                            <FontAwesome
                                name="folder"
                                size={18}
                                color="#555"
                            />
                        }
                        value={
                            selectedConf?.id || ""
                        }
                        onChange={
                            handleConfigChange
                        }
                        disabled={false}
                        options={
                            configOpt.map((item:any) => ({
                                    value: item.id,
                                    label: item.pageTitle,
                                })
                            )
                        }
                    />

                </View>

                {/* UBS */}

                <View style={styles.field}>

                    <SelectInput
                        id="ubsId"
                        name="ubsId"
                        label="UBS"
                        logo={
                            <FontAwesome
                                name="hospital-o"
                                size={18}
                                color="#555"
                            />
                        }
                        value={
                            filters.ubsId || ""
                        }
                        onChange={(value:any) =>
                            handle("ubsId",value)
                        }
                        disabled={
                            isCommonUser
                        }
                        options={
                            ubsList.map(
                                (ubs:any) => ({
                                    value: ubs.id,
                                    label: ubs.nome,
                                })
                            )
                        }
                    />

                </View>

                {/* MICRO ÁREA */}

                <View style={styles.field}>

                    <SelectInput
                        id="microAreaId"
                        name="microAreaId"
                        label="Micro Área"
                        logo={
                            <FontAwesome
                                name="map-signs"
                                size={18}
                                color="#555"
                            />
                        }
                        value={
                            filters.microAreaId ||
                            ""
                        }
                        onChange={(value:any) =>
                            handle("microAreaId",value)
                        }
                        options={
                            microAreaList.map((microArea:any) => ({
                                    value: microArea.id,
                                    label: `${microArea.codigo} - ${microArea.equipe}`,
                                })
                            )
                        }
                    />

                </View>

                {/* ENDEREÇO */}

                <View style={styles.field}>

                    <SelectInput
                        id="enderecoId"
                        name="enderecoId"
                        label="Endereço"
                        logo={
                            <FontAwesome
                                name="map-marker"
                                size={18}
                                color="#555"
                            />
                        }
                        value={filters.enderecoId ||""}
                        onChange={(value:any) =>handle("enderecoId",value)
                        }
                        options={
                            enderecoList.map(
                                (endereco:any) => ({
                                    value: endereco.id,
                                    label: `${endereco.logradouro}, ${endereco.numero}`,
                                })
                            )
                        }
                    />

                </View>

                {/* CATEGORIA */}

                <View style={styles.field}>

                    <SelectInput
                        id="categoriaId"
                        name="categoriaId"
                        label="Categoria"
                        logo={
                            <FontAwesome
                                name="th-large"
                                size={18}
                                color="#555"
                            />
                        }
                        value={filters.categoriaId || ""}
                        onChange={(value:any) =>handle("categoriaId",value)}
                        options={
                            categoriaList.map((categoria:any) => ({
                                    value: categoria.id,
                                    label: categoria.nome,
                                })
                            )
                        }
                    />

                </View>

                {/* TIPO */}

                <View style={styles.field}>

                    <SelectInput
                        id={
                            config.tipoField
                        }
                        name={
                            config.tipoField
                        }
                        label={
                            config.tipoLabel
                        }
                        logo={
                            <FontAwesome
                                name="warning"
                                size={18}
                                color="#555"
                            />
                        }
                        value={filters[config.tipoField] || ""}
                        onChange={(value:any) =>handle(config.tipoField,value)}
                        options={
                            tipoList.map((tipo:any) => ({
                                    value: tipo.id,
                                    label: tipo.nome,
                                })
                            )
                        }
                    />

                </View>

                {/* DATA INICIAL */}

                <View style={styles.field}>

                    <TxtInput
                        id="dataInicial"
                        name="dataInicial"
                        type="date"
                        label="Data Inicial"
                        value={
                            filters.dataInicial ||
                            ""
                        }
                        onChange={(value:any) =>
                            handle(
                                "dataInicial",
                                value
                            )
                        }
                    />

                </View>

                {/* DATA FINAL */}

                <View style={styles.field}>

                    <TxtInput
                        id="dataFinal"
                        name="dataFinal"
                        type="date"
                        label="Data Final"
                        value={
                            filters.dataFinal ||
                            ""
                        }
                        onChange={(value:any) =>
                            handle(
                                "dataFinal",
                                value
                            )
                        }
                    />

                </View>

            </View>

            {/* =================================================
                AÇÕES
            ================================================= */}

            <View
                style={[
                    styles.actions,

                    isMobile &&
                        styles.actionsMobile,

                    isSmallMobile &&
                        styles.actionsSmallMobile,
                ]}
            >

                {/* PESQUISAR */}

                <TouchableOpacity
                    activeOpacity={0.8}
                    style={[
                        styles.searchButton,

                        isMobile &&
                            styles.buttonMobile,

                        isSmallMobile &&
                            styles.buttonSmallMobile,
                    ]}
                    onPress={onSearch}
                    accessibilityLabel="Pesquisar"
                >

                    <FontAwesome
                        name="search"
                        size={17}
                        color="#fff"
                    />

                    {!isSmallMobile && (
                        <Text
                            style={
                                styles.btnSpan
                            }
                        >
                            Pesquisar
                        </Text>
                    )}

                </TouchableOpacity>

                {/* LIMPAR */}

                <TouchableOpacity
                    activeOpacity={0.8}
                    style={[
                        styles.clearButton,

                        isMobile &&
                            styles.buttonMobile,

                        isSmallMobile &&
                            styles.buttonSmallMobile,
                    ]}
                    onPress={onClear}
                    accessibilityLabel="Limpar filtros"
                >

                    <FontAwesome
                        name="eraser"
                        size={17}
                        color="#555"
                    />

                    {!isSmallMobile && (
                        <Text
                            style={
                                styles.clearText
                            }
                        >
                            Limpar filtros
                        </Text>
                    )}

                </TouchableOpacity>

            </View>

        </View>
    );
}

/*
 * ================================================================
 * STYLES
 * ================================================================
 */

const styles = StyleSheet.create({

    /*
     * ------------------------------------------------------------
     * CONTAINER
     * ------------------------------------------------------------
     */

    container: {
        width: "100%",

        backgroundColor: "#ffffff",

        padding: 25,

        borderRadius: 16,

        borderWidth: 1,

        borderColor:
            "rgba(102, 102, 102, 0.10)",

        /*
         * Equivalente aproximado ao:
         *
         * box-shadow:
         * 0 6px 20px rgba(0, 0, 0, .07)
         */

        shadowColor: "#000",

        shadowOffset: {
            width: 0,
            height: 6,
        },

        shadowOpacity: 0.07,

        shadowRadius: 20,

        elevation: 4,

        gap: 25,
    },

    /*
     * ------------------------------------------------------------
     * CONTAINER TABLET
     * ------------------------------------------------------------
     */

    containerTablet: {
        padding: 22,

        gap: 22,
    },

    /*
     * ------------------------------------------------------------
     * CONTAINER CELULAR
     * ------------------------------------------------------------
     */

    containerMobile: {
        padding: 18,

        gap: 18,

        borderRadius: 14,
    },

    /*
     * ------------------------------------------------------------
     * CONTAINER CELULAR PEQUENO
     * ------------------------------------------------------------
     */

    containerSmallMobile: {
        padding: 14,

        gap: 16,

        borderRadius: 12,
    },

    /*
     * ------------------------------------------------------------
     * GRID
     * ------------------------------------------------------------
     *
     * No CSS:
     *
     * repeat(auto-fit, minmax(260px, 1fr))
     *
     * No RN usamos flexWrap.
     */

    grid: {
        width: "100%",

        flexDirection: "row",

        flexWrap: "wrap",

        gap: 20,
    },

    /*
     * Cada campo ocupa aproximadamente
     * 1/3 em telas grandes.
     */

    field: {
        flexGrow: 1,

        flexShrink: 1,

        flexBasis: 260,

        minWidth: 260,
    },

    /*
     * ------------------------------------------------------------
     * GRID TABLET
     * ------------------------------------------------------------
     */

    gridTablet: {
        gap: 16,
    },

    /*
     * Dois campos por linha.
     */

    /*
     * ------------------------------------------------------------
     * GRID CELULAR
     * ------------------------------------------------------------
     */

    gridMobile: {
        flexDirection: "column",

        flexWrap: "nowrap",

        gap: 14,
    },

    fieldMobile: {
        width: "100%",
    },

    /*
     * ------------------------------------------------------------
     * GRID CELULAR PEQUENO
     * ------------------------------------------------------------
     */

    gridSmallMobile: {
        gap: 12,
    },

    /*
     * ------------------------------------------------------------
     * ACTIONS
     * ------------------------------------------------------------
     */

    actions: {
        width: "100%",

        flexDirection: "row",

        justifyContent: "flex-end",

        alignItems: "center",

        gap: 15,
    },

    /*
     * ------------------------------------------------------------
     * BOTÃO PESQUISAR
     * ------------------------------------------------------------
     */

    searchButton: {
        height: 45,

        paddingHorizontal: 20,

        borderRadius: 10,

        backgroundColor: "#3c6a48",

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "center",

        gap: 10,

        shadowColor: "#3c6a48",

        shadowOffset: {
            width: 0,
            height: 3,
        },

        shadowOpacity: 0.15,

        shadowRadius: 8,

        elevation: 3,
    },

    /*
     * ------------------------------------------------------------
     * BOTÃO LIMPAR
     * ------------------------------------------------------------
     */

    clearButton: {
        height: 45,

        paddingHorizontal: 20,

        borderRadius: 10,

        borderWidth: 1,

        borderColor: "#d6d6d6",

        backgroundColor: "#f3f4f3",

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "center",

        gap: 10,
    },

    /*
     * ------------------------------------------------------------
     * TEXTO DO BOTÃO
     * ------------------------------------------------------------
     */

    btnSpan: {
        color: "#ffffff",

        fontSize: 14,

        fontWeight: "600",
    },

    clearText: {
        color: "#555555",

        fontSize: 14,

        fontWeight: "600",
    },

    /*
     * ------------------------------------------------------------
     * TABLET / MOBILE ACTIONS
     * ------------------------------------------------------------
     */

    actionsMobile: {
        flexWrap: "wrap",

        gap: 12,
    },

    /*
     * ------------------------------------------------------------
     * BOTÕES MOBILE
     * ------------------------------------------------------------
     */

    buttonMobile: {
        flex: 1,

        paddingHorizontal: 18,

        minWidth: 120,
    },

    /*
     * ------------------------------------------------------------
     * CELULAR PEQUENO
     * ------------------------------------------------------------
     */

    actionsSmallMobile: {
        display: "flex",

        flexDirection: "row",

        gap: 10,
    },

    buttonSmallMobile: {
        flex: 1,

        width: "100%",

        height: 44,

        paddingHorizontal: 12,
    },
});