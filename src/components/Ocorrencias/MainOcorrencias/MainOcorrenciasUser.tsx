import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io, Socket } from "socket.io-client";

import apiFetch from "@/components/FetchFunc/APIFetch";
import exportarOcorrenciasExcel2 from "../../../Service/exportarOcorrenciasExcel2";
import OcorrenciaModalUser from "../OcorrenciasModalUser/OcorrenciaModalUser";


import PageItemSelector from "@/components/PageItemSelector/PageItemSelector";
import OcorrenciaFiltersUser from "../OcorrenciasFilterUser/OcorrenciasFilterUser";
import OcorrenciaTable from "../OcorrenciasTable/OcorrenciasTable";
export default function OcorrenciasUser({ config }: any) {

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [filters, setFilters] = useState(
        createInitialFilter(config.tipoField)
    );

    const [ocorrencias, setOcorrencias] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedOcorrencia, setSelectedOcorrencia] =
        useState<any | null>(null);

    const [isCommonUser, setIsCommonUser] = useState(false);

    // ==========================================
    // REFS
    // ==========================================

    const socketRef = useRef<Socket | null>(null);

    const loadOcorrenciasRef = useRef<
        (() => void) | null
    >(null);


    // ==========================================
    // FILTROS INICIAIS
    // ==========================================

    function createInitialFilter(tipoField: string) {
        return {
            ubsId: "",
            microAreaId: "",
            enderecoId: "",
            categoriaId: "",
            [tipoField]: "",
            dataInicial: "",
            dataFinal: "",
        };
    }


    // ==========================================
    // BUSCAR UBS DO USUÁRIO
    // ==========================================

    async function loadCurrentUserUBS(cpf: string) {

        const response = await apiFetch(
            `/users/ubs/${cpf}`
        );

        if (!response.ok) {
            throw new Error(
                "Erro ao buscar UBS do usuário"
            );
        }

        return await response.json();
    }


    // ==========================================
    // CARREGAR OCORRÊNCIAS
    // ==========================================

    const loadOcorrencias = useCallback(
        async (pageNumber = page) => {

            try {

                setLoading(true);

                const params = new URLSearchParams();

                if (filters.ubsId) {
                    params.append(
                        "supervisao",
                        filters.supervisao
                    );
                }

                if (filters.ubsId) {
                    params.append(
                        "ubsId",
                        filters.ubsId
                    );
                }

                if (filters.microAreaId) {
                    params.append(
                        "microAreaId",
                        filters.microAreaId
                    );
                }

                if (filters.enderecoId) {
                    params.append(
                        "enderecoId",
                        filters.enderecoId
                    );
                }

                if (filters.categoriaId) {
                    params.append(
                        "categoriaId",
                        filters.categoriaId
                    );
                }

                if (filters[config.tipoField]) {
                    params.append(
                        config.tipoField,
                        filters[config.tipoField]
                    );
                }

                if (filters.dataInicial) {
                    params.append(
                        "dataInicial",
                        filters.dataInicial
                    );
                }

                if (filters.dataFinal) {
                    params.append(
                        "dataFinal",
                        filters.dataFinal
                    );
                }

                params.append(
                    "page",
                    pageNumber.toString()
                );

                params.append(
                    "limit",
                    "30"
                );


                const response = await apiFetch(
                    `${process.env
                    .EXPO_PUBLIC_BACK_ROUTE}/${config.ocorrenciaEndpoint}/spec2/?${params.toString()}`
                );


                if (!response.ok) {
                    throw new Error(
                        "Erro ao carregar ocorrências"
                    );
                }


                const data = await response.json();

                console.log(
                    "Ocorrências:",
                    data
                );


                setOcorrencias(
                    data?.data || []
                );

                setTotalPages(
                    data?.totalPages || 1
                );

            }
            catch (err) {
                console.log(err)
                //await ErrMsg(
                    //"Erro ao carregar ocorrências"
                //);

            }
            finally {

                setLoading(false);

            }

        },
        [filters, config, page]
    );


    // ==========================================
    // MANTER LOAD ATUALIZADO
    // ==========================================

    useEffect(() => {

        loadOcorrenciasRef.current =
            () => loadOcorrencias(page);

    }, [loadOcorrencias, page]);


    // ==========================================
    // SOCKET.IO
    // ==========================================

    useEffect(() => {

        let cancelled = false;

        async function connectSocket() {

            try {

                const userString =
                    await AsyncStorage.getItem("user");

                if (!userString) {
                    return;
                }

                const user =
                    JSON.parse(userString);


                const socket = io(
                    process.env.EXPO_PUBLIC_BACK_ROUTE ||
                    ""
                );

                socketRef.current = socket;


                // ==================================
                // CONNECT
                // ==================================

                socket.on("connect", async () => {

                    if (cancelled) {
                        return;
                    }


                    console.log(
                        "Socket conectado:",
                        socket.id
                    );


                    // ==============================
                    // USUÁRIO COMUM
                    // ==============================

                    if (
                        user?.roles?.includes("user")
                    ) {

                        setIsCommonUser(true);

                        try {

                            const ubs =
                                await loadCurrentUserUBS(
                                    user.cpf
                                );

                            if (cancelled) {
                                return;
                            }


                            const ubsId =
                                Number(ubs?.id);


                            if (!ubsId) {

                                console.error(
                                    "UBS inválida para o usuário"
                                );

                                return;
                            }


                            setFilters(prev => ({
                                ...prev,
                                ubsId:
                                    String(ubsId),
                            }));


                            console.log(
                                "Entrando na room:",
                                `ubs:${ubsId}`
                            );


                            socket.emit(
                                "join:ubs",
                                { ubsId }
                            );

                        }
                        catch (err) {

                            if (!cancelled) {

                                console.error(
                                    "Erro ao buscar UBS:",
                                    err
                                );

                            }

                        }

                    }


                    // ==============================
                    // ADMIN
                    // ==============================

                    if (
                        user?.roles?.includes("admin")
                    ) {

                        console.log(
                            "Entrando na room admins"
                        );

                        socket.emit(
                            "join:admin"
                        );

                    }

                });


                // ==================================
                // OCORRÊNCIA ALTERADA
                // ==================================

                socket.on(
                    "ocorrencia:changed",
                    () => {

                        console.log(
                            "Socket: ocorrencia:changed recebido"
                        );


                        if (
                            loadOcorrenciasRef.current
                        ) {

                            loadOcorrenciasRef.current();

                        }

                    }
                );


                // ==================================
                // ERRO
                // ==================================

                socket.on(
                    "connect_error",
                    error => {

                        console.error(
                            "Erro no Socket.IO:",
                            error
                        );

                    }
                );


                // ==================================
                // CLEANUP
                // ==================================

                return () => {

                    cancelled = true;

                    console.log(
                        "Desconectando socket:",
                        socket.id
                    );


                    socket.off("connect");

                    socket.off(
                        "ocorrencia:changed"
                    );

                    socket.off(
                        "connect_error"
                    );

                    socket.disconnect();


                    if (
                        socketRef.current ===
                        socket
                    ) {

                        socketRef.current = null;

                    }

                };

            }
            catch (err) {

                console.error(
                    "Erro ao iniciar Socket.IO:",
                    err
                );

            }

        }


        let cleanup:
            (() => void) | undefined;


        connectSocket().then(
            result => {
                cleanup = result;
            }
        );


        return () => {

            cancelled = true;

            if (cleanup) {
                cleanup();
            }

        };

    }, []);


    // ==========================================
    // RECARREGAR QUANDO FILTROS/PÁGINA MUDAM
    // ==========================================

    useEffect(() => {

        const timer = setTimeout(() => {

            loadOcorrencias(page);

        }, 300);


        return () => {

            clearTimeout(timer);

        };

    }, [loadOcorrencias, page]);


    // ==========================================
    // EXPORTAR
    // ==========================================

    async function expOcorrenciaBrief() {

        try {

            const params =
                new URLSearchParams();


            if (filters.ubsId) {
                params.append(
                    "ubsId",
                    filters.ubsId
                );
            }

            if (filters.microAreaId) {
                params.append(
                    "microAreaId",
                    filters.microAreaId
                );
            }

            if (filters.enderecoId) {
                params.append(
                    "enderecoId",
                    filters.enderecoId
                );
            }

            if (filters.categoriaId) {
                params.append(
                    "categoriaId",
                    filters.categoriaId
                );
            }

            if (filters[config.tipoField]) {

                params.append(
                    config.tipoField,
                    filters[config.tipoField]
                );

            }

            if (filters.dataInicial) {

                params.append(
                    "dataInicial",
                    filters.dataInicial
                );

            }

            if (filters.dataFinal) {

                params.append(
                    "dataFinal",
                    filters.dataFinal
                );

            }


            const response = await apiFetch(
                `/${config.ocorrenciaEndpoint}/spec/?${params.toString()}`
            );


            if (!response.ok) {

                throw new Error(
                    "Erro ao carregar ocorrências"
                );

            }


            const data =
                await response.json();


            await exportarOcorrenciasExcel2(
                data,
                config.tipoRelation,
                config.tipoLabel
            );

        }
        catch (err) {
            console.log(err)
            /*
            await ErrMsg(
                "Erro ao carregar ocorrências para excel"
            );*/

        }

    }


    // ==========================================
    // ALTERAR FILTRO
    // ==========================================

    function handleFilterChange(
        name: string,
        value: any
    ) {

        setFilters(prev => ({
            ...prev,
            [name]: value,
        }));

        setPage(1);

    }


    // ==========================================
    // LIMPAR FILTROS
    // ==========================================

    async function limparFiltros() {

        const userString =
            await AsyncStorage.getItem("user");

        const user =
            userString
                ? JSON.parse(userString)
                : null;


        if (
            user?.roles?.includes("user")
        ) {

            setFilters(prev => ({
                ...createInitialFilter(
                    config.tipoField
                ),
                ubsId: prev.ubsId,
            }));

        }
        else {

            setFilters(
                createInitialFilter(
                    config.tipoField
                )
            );

        }


        setPage(1);

    }


    // ==========================================
    // NOVO CADASTRO
    // ==========================================

    function novoCadastro() {

        setSelectedOcorrencia(null);

        setModalOpen(true);

    }


    // ==========================================
    // EDITAR
    // ==========================================

    function editarOcorrencia(
        ocorrencia: any
    ) {

        setSelectedOcorrencia(
            ocorrencia
        );

        setModalOpen(true);

    }


    // ==========================================
    // EXCLUIR
    // ==========================================

    async function excluirOcorrencia(
        id: number | string
    ) {

        //await ConfirmMsg(
            //"Deseja realmente excluir esta ocorrência?",
           // async () => {

                try {

                    const response =
                        await apiFetch(
                            `/${config.ocorrenciaEndpoint}/${id}`,
                            {
                                method: "DELETE",
                            }
                        );


                    if (!response.ok) {

                        throw new Error(
                            "Erro ao excluir ocorrência"
                        );

                    }


                    setPage(1);


                    //await OKMsg(
                        //"Operação realizada com sucesso!"
                    //);

                }
                catch (err) {

                    console.error(
                        "Erro ao excluir ocorrência:",
                        err
                    );


                    //await ErrMsg(
                        //"Erro ao excluir ocorrência."
                    //);

                }

            //}
        //);

    }


    // ==========================================
    // FECHAR MODAL
    // ==========================================

    function fecharModal() {

        setModalOpen(false);

        setSelectedOcorrencia(null);

    }


    // ==========================================
    // SALVAMENTO
    // ==========================================

    function salvarSucesso() {

        fecharModal();

        loadOcorrencias(page);

    }


    // ==========================================
    // PAGINAÇÃO
    // ==========================================

    function paginaAnterior() {

        if (page <= 1) {
            return;
        }

        setPage(prev => prev - 1);

    }


    function proximaPagina() {

        if (page >= totalPages) {
            return;
        }

        setPage(prev => prev + 1);

    }


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <View style={styles.container}>

            <View style={styles.header}>

                <Text style={styles.title}>
                    {config.pageTitle}
                </Text>


                <TouchableOpacity
                    style={styles.newButton}
                    onPress={novoCadastro}
                    activeOpacity={0.8}
                >

                    <Ionicons
                        name="add"
                        size={20}
                        color="#FFFFFF"
                    />

                    <Text style={styles.buttonText}>
                        {config.newButtonLabel}
                    </Text>

                </TouchableOpacity>

            </View>


            <OcorrenciaFiltersUser
                filters={filters}
                onChange={handleFilterChange}
                onSearch={() =>
                    loadOcorrencias(page)
                }
                onClear={limparFiltros}
                isCommonUser={isCommonUser}
                expOcorrencia={
                    expOcorrenciaBrief
                }
                config={config}
            />


            <OcorrenciaTable
                loading={loading}
                ocorrencias={ocorrencias}
                onEdit={editarOcorrencia}
                onDelete={excluirOcorrencia}
                config={config}
            />


            <PageItemSelector
                page={page}
                totalPages={totalPages}
                func1={paginaAnterior}
                func2={proximaPagina}
            />


            {modalOpen && (

                <OcorrenciaModalUser
                    ocorrencia={
                        selectedOcorrencia
                    }
                    onClose={fecharModal}
                    onSuccess={salvarSucesso}
                    config={config}
                />

            )}

        </View>

    );

}


// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({

    container: {

        width: "100%",

        padding: 18,

        display: "flex",

        flexDirection: "column",
        alignItems:"flex-start",
        justifyContent:"flex-start",

        gap: 20,

        backgroundColor: "#FFFFFF",

        flex: 1,

    },


    header: {

        width: "100%",

        flexDirection: "row",

        justifyContent: "space-between",

        alignItems: "center",

        gap: 12,

    },


    title: {

        flex: 1,

        color: "#333333",

        fontSize: 21,

        lineHeight: 27,

        fontWeight: "700",

    },


    newButton: {

        height: 42,

        minWidth: 42,

        paddingHorizontal: 15,

        borderRadius: 9,

        backgroundColor: "#3C6A48",

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "center",

        gap: 7,

    },


    buttonText: {

        color: "#FFFFFF",

        fontSize: 13,

        fontWeight: "600",

        flexShrink: 1,

    },

});