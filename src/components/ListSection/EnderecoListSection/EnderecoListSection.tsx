import { useCallback, useEffect, useState } from "react";

import {
    ActivityIndicator,
    FlatList,
    Keyboard,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { io, Socket } from "socket.io-client";

import apiFetch from "@/components/FetchFunc/APIFetch";
import PageItemSelector from "../../PageItemSelector/PageItemSelector";
;

import ErrMsg from "@/components/Alerts/ErrMsg";
import OKMsg from "@/components/Alerts/OKMsg";
import EnderecoFormUser from "@/components/Form/EnderecoFormUser/EnderecoFormUser";

const BACK_ROUTE = process.env.EXPO_PUBLIC_BACK_ROUTE;

const LIMIT = 30;

export default function EnderecoListSectionUser() {

    const [enderecoList, setEnderecoList] = useState<any[]>([]);

    const [filter, setFilter] = useState("");

    const [page, setPage] = useState(1);

    const [totalPages, setTotalPages] = useState(1);

    const [total, setTotal] = useState(0);

    const [selectedEndereco, setSelectedEndereco] =
        useState<any>(null);

    const [open, setOpen] = useState(false);

    const [loading, setLoading] = useState(false);

    const [loadingDelete, setLoadingDelete] =
        useState(false);


    // =====================================================
    // CARREGAR ENDEREÇOS
    // =====================================================

    const loadEnderecos = useCallback(
        async (
            pageNumber = page,
            searchValue = filter
        ) => {

            try {

                setLoading(true);

                const user = JSON.parse(
                    // @ts-ignore
                    localStorage?.getItem("user") || "null"
                );

                if (!user) {
                    return;
                }

                const params = new URLSearchParams({
                    page: String(pageNumber),
                    limit: String(LIMIT),
                });

                if (searchValue?.trim()) {

                    params.append(
                        "search",
                        searchValue.trim()
                    );

                }

                let response;

                if (user?.roles?.includes("user")) {

                    response = await apiFetch(
                        `${BACK_ROUTE}/users/enderecos/${user.cpf}?${params.toString()}`
                    );

                } else {

                    response = await apiFetch(
                        `${BACK_ROUTE}/enderecos?${params.toString()}`
                    );

                }

                if (!response.ok) {
                    throw new Error(
                        "Erro ao carregar endereços."
                    );
                }

                const result = await response.json();

                setEnderecoList(
                    result?.data || []
                );

                setTotalPages(
                    result?.totalPages || 1
                );

                setTotal(
                    result?.total || 0
                );

            } catch (error) {

                console.error(error);

                setEnderecoList([]);

                await ErrMsg(
                    "Erro ao carregar endereços."
                );

            } finally {

                setLoading(false);

            }

        },
        [page, filter]
    );

    useEffect(() => {

        loadEnderecos(1, "");

        let socket: Socket | null = null;

        async function setupSocket() {

            try {

                const user = JSON.parse(
                    // @ts-ignore
                    localStorage?.getItem("user") || "null"
                );

                if (!user) {
                    return;
                }

                socket = io(BACK_ROUTE);

                if (
                    user?.roles?.includes("user") &&
                    user?.ubsId
                ) {

                    socket.emit(
                        "join:ubs",
                        {
                            ubsId: user.ubsId,
                        }
                    );

                    socket.on(
                        "endereco:changed",
                        () => {

                            loadEnderecos(
                                page,
                                filter
                            );

                        }
                    );

                }

                if (
                    user?.roles?.includes("admin")
                ) {

                    socket.emit(
                        "join:admin"
                    );

                    socket.on(
                        "endereco:changed",
                        () => {

                            loadEnderecos(
                                page,
                                filter
                            );

                        }
                    );

                }

            } catch (error) {

                console.error(
                    "Erro ao configurar socket:",
                    error
                );

            }

        }

        void setupSocket();

        return () => {

            if (socket) {

                socket.off(
                    "endereco:changed"
                );

                socket.disconnect();

            }

        };

    }, []);
    useEffect(() => {

        const timer = setTimeout(() => {

            setPage(1);

            loadEnderecos(
                1,
                filter
            );

        }, 400);

        return () => {

            clearTimeout(timer);

        };

    }, [filter]);
    function newEndereco() {

        Keyboard.dismiss();

        setSelectedEndereco(null);

        setOpen(true);

    }
    function editEndereco(
        item: any
    ) {

        Keyboard.dismiss();

        setSelectedEndereco({
            ...item,
        });

        setOpen(true);

    }
    function closeModal() {

        Keyboard.dismiss();

        setOpen(false);

        setSelectedEndereco(null);

    }
    async function deleteEndereco(
        id: number
    ) {
        try {

                    setLoadingDelete(true);

                    const response =
                        await apiFetch(
                            `${BACK_ROUTE}/enderecos/${id}`,
                            {
                                method: "DELETE",
                            }
                        );

                    if (!response.ok) {

                        throw new Error(
                            "Erro ao excluir endereço."
                        );

                    }

                    await OKMsg(
                        "O endereço foi excluído com sucesso."
                    );

                    await loadEnderecos(
                        page,
                        filter
                    );

                } catch (error: any) {

                    console.error(error);

                    await ErrMsg(
                        error?.message ||
                        "Erro ao excluir endereço."
                    );

                } finally {

                    setLoadingDelete(false);

                }

        /*
        await ConfirmMsg(
            "Deseja realmente excluir este endereço?",
            async () => {

                try {

                    setLoadingDelete(true);

                    const response =
                        await apiFetch(
                            `${BACK_ROUTE}/enderecos/${id}`,
                            {
                                method: "DELETE",
                            }
                        );

                    if (!response.ok) {

                        throw new Error(
                            "Erro ao excluir endereço."
                        );

                    }

                    await OKMsg(
                        "O endereço foi excluído com sucesso."
                    );

                    await loadEnderecos(
                        page,
                        filter
                    );

                } catch (error: any) {

                    console.error(error);

                    await ErrMsg(
                        error?.message ||
                        "Erro ao excluir endereço."
                    );

                } finally {

                    setLoadingDelete(false);

                }

            }
        );*/

    }
    function previousPage() {

        if (page <= 1) {
            return;
        }

        const newPage = page - 1;

        setPage(newPage);

        loadEnderecos(
            newPage,
            filter
        );

    }


    function nextPage() {

        if (page >= totalPages) {
            return;
        }

        const newPage = page + 1;

        setPage(newPage);

        loadEnderecos(
            newPage,
            filter
        );

    }
    function renderEndereco({
        item,
    }: {
        item: any;
    }) {

        return (

            <View style={styles.card}>

                <View style={styles.info}>

                    <Text
                        style={styles.addressTitle}
                    >
                        {item.logradouro}
                        {", "}
                        {item.numero}
                    </Text>


                    <Text style={styles.infoText}>

                        <Text style={styles.bold}>
                            Micro Área:
                        </Text>{" "}

                        {item.microArea?.codigo ||
                            "-"}

                    </Text>


                    <Text style={styles.infoText}>

                        <Text style={styles.bold}>
                            Equipe:
                        </Text>{" "}

                        {item.microArea?.equipe ||
                            "-"}

                    </Text>


                    <Text style={styles.infoText}>

                        <Text style={styles.bold}>
                            UBS:
                        </Text>{" "}

                        {item.microArea?.ubs?.nome ||
                            "-"}

                    </Text>


                    <Text style={styles.infoText}>

                        <Text style={styles.bold}>
                            Latitude:
                        </Text>{" "}

                        {item.latitude ?? "-"}

                    </Text>


                    <Text style={styles.infoText}>

                        <Text style={styles.bold}>
                            Longitude:
                        </Text>{" "}

                        {item.longitude ?? "-"}

                    </Text>

                </View>


                <View style={styles.actions}>

                    <Pressable
                        style={[
                            styles.actionButton,
                            styles.editButton,
                        ]}
                        onPress={() =>
                            editEndereco(item)
                        }
                    >

                        <Ionicons
                            name="pencil"
                            size={20}
                            color="#333"
                        />

                    </Pressable>


                    <Pressable
                        style={[
                            styles.actionButton,
                            styles.deleteButton,
                        ]}
                        onPress={() =>
                            deleteEndereco(item.id)
                        }
                        disabled={loadingDelete}
                    >

                        <Ionicons
                            name="trash"
                            size={20}
                            color="#fff"
                        />

                    </Pressable>

                </View>

            </View>

        );

    }


    return (

        <View style={styles.container}>
            <View style={styles.header}>

                <View>

                    <Text style={styles.title}>
                        Endereços
                    </Text>

                    <Text style={styles.total}>
                        {total} registro
                        {total !== 1 ? "s" : ""}
                    </Text>

                </View>


                <Pressable
                    style={styles.newButton}
                    onPress={newEndereco}
                >

                    <Ionicons
                        name="add"
                        size={22}
                        color="#fff"
                    />

                    <Text
                        style={styles.newButtonText}
                    >
                        Novo
                    </Text>

                </Pressable>

            </View>
            <View style={styles.searchContainer}>

                <Ionicons
                    name="search"
                    size={20}
                    color="#777"
                />

                <TextInput
                    style={styles.searchInput}
                    placeholder="Pesquisar endereço..."
                    placeholderTextColor="#999"
                    value={filter}
                    onChangeText={setFilter}
                    returnKeyType="search"
                />

                {filter.length > 0 && (

                    <Pressable
                        onPress={() =>
                            setFilter("")
                        }
                    >

                        <Ionicons
                            name="close-circle"
                            size={20}
                            color="#999"
                        />

                    </Pressable>

                )}

            </View>

            {loading && enderecoList.length === 0 ? (

                <View style={styles.loadingContainer}>

                    <ActivityIndicator
                        size="large"
                        color="#3c6a48"
                    />

                    <Text style={styles.loadingText}>
                        Carregando endereços...
                    </Text>

                </View>

            ) : enderecoList.length === 0 ? (

                <View style={styles.emptyContainer}>

                    <Ionicons
                        name="location-outline"
                        size={60}
                        color="#bbb"
                    />

                    <Text style={styles.emptyTitle}>
                        Nenhum endereço encontrado
                    </Text>

                    <Text style={styles.emptyText}>
                        Tente alterar sua pesquisa ou
                        cadastre um novo endereço.
                    </Text>

                </View>

            ) : (

                <FlatList
                    data={enderecoList}
                    keyExtractor={(item) =>
                        String(item.id)
                    }
                    renderItem={renderEndereco}
                    contentContainerStyle={
                        styles.listContent
                    }
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    refreshing={loading}
                    onRefresh={() =>
                        loadEnderecos(
                            page,
                            filter
                        )
                    }
                />

            )}

            {enderecoList.length > 0 && (

                <PageItemSelector
                    page={page}
                    totalPages={totalPages}
                    func1={previousPage}
                    func2={nextPage}
                />

            )}

            <Modal
                visible={open}
                animationType="slide"
                transparent={false}
                onRequestClose={closeModal}
            >

                <View style={styles.modalContainer}>

                    <View style={styles.modalHeader}>

                        <Text
                            style={styles.modalTitle}
                        >
                            {selectedEndereco
                                ? "Editar endereço"
                                : "Novo endereço"}
                        </Text>


                        <Pressable
                            style={styles.closeButton}
                            onPress={closeModal}
                        >

                            <Ionicons
                                name="close"
                                size={28}
                                color="#333"
                            />

                        </Pressable>

                    </View>

                    <FlatList
                        data={[1]}
                        keyExtractor={() => "form"}
                        renderItem={() => (

                            <View
                                style={
                                    styles.formContainer
                                }
                            >

                                {<EnderecoFormUser
                                    obj={
                                        selectedEndereco
                                    }

                                    onSuccess={() => {

                                        loadEnderecos(
                                            page,
                                            filter
                                        );

                                        setSelectedEndereco(
                                            null
                                        );

                                        setOpen(false);

                                    }}

                                    onCancel={() => {

                                        setSelectedEndereco(
                                            null
                                        );

                                        setOpen(false);

                                    }}
                                />}

                            </View>

                        )}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    />

                </View>

            </Modal>

        </View>

    );

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#f7f8f7",
        paddingHorizontal: 12,
        paddingTop: 10,
    },


    // HEADER

    header: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },

    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#2c3e50",
    },

    total: {
        marginTop: 2,
        fontSize: 13,
        color: "#777",
    },


    // NOVO

    newButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,

        backgroundColor: "#2f573a",

        paddingHorizontal: 14,
        paddingVertical: 10,

        borderRadius: 9,
    },

    newButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "700",
    },


    // SEARCH

    searchContainer: {
        width: "100%",
        height: 48,

        flexDirection: "row",
        alignItems: "center",

        backgroundColor: "#fff",

        borderWidth: 1,
        borderColor: "#dcdcdc",

        borderRadius: 10,

        paddingHorizontal: 14,

        marginBottom: 12,
    },

    searchInput: {
        flex: 1,

        height: "100%",

        marginLeft: 8,

        color: "#333",

        fontSize: 15,
    },


    // LISTA

    listContent: {
        paddingBottom: 15,
    },


    // CARD

    card: {
        width: "100%",

        flexDirection: "row",

        justifyContent: "space-between",
        alignItems: "center",

        backgroundColor: "#fff",

        borderRadius: 12,

        padding: 15,

        marginBottom: 12,

        shadowColor: "#000",

        shadowOffset: {
            width: 0,
            height: 2,
        },

        shadowOpacity: 0.08,

        shadowRadius: 5,

        elevation: 2,
    },


    info: {
        flex: 1,

        paddingRight: 10,
    },

    addressTitle: {
        color: "#3c6a48",

        fontSize: 17,

        fontWeight: "700",

        marginBottom: 8,
    },

    infoText: {
        color: "#555",

        fontSize: 14,

        marginBottom: 4,

        lineHeight: 19,
    },

    bold: {
        fontWeight: "700",
        color: "#444",
    },


    // AÇÕES

    actions: {
        flexDirection: "row",

        alignItems: "center",

        gap: 8,
    },

    actionButton: {
        width: 42,
        height: 42,

        borderRadius: 21,

        justifyContent: "center",
        alignItems: "center",
    },

    editButton: {
        backgroundColor: "#facc15",
    },

    deleteButton: {
        backgroundColor: "#ef4444",
    },


    // LOADING

    loadingContainer: {
        flex: 1,

        alignItems: "center",
        justifyContent: "center",
    },

    loadingText: {
        marginTop: 10,

        color: "#666",

        fontSize: 15,
    },


    // EMPTY

    emptyContainer: {
        flex: 1,

        alignItems: "center",
        justifyContent: "center",

        paddingHorizontal: 30,
    },

    emptyTitle: {
        marginTop: 12,

        fontSize: 18,

        fontWeight: "700",

        color: "#555",

        textAlign: "center",
    },

    emptyText: {
        marginTop: 6,

        fontSize: 14,

        color: "#888",

        textAlign: "center",

        lineHeight: 20,
    },


    // MODAL

    modalContainer: {
        flex: 1,

        backgroundColor: "#f7f8f7",
    },

    modalHeader: {
        height: 60,

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "space-between",

        paddingHorizontal: 16,

        backgroundColor: "#fff",

        borderBottomWidth: 1,

        borderBottomColor: "#e5e5e5",

        elevation: 3,

        shadowColor: "#000",

        shadowOffset: {
            width: 0,
            height: 2,
        },

        shadowOpacity: 0.08,

        shadowRadius: 3,
    },

    modalTitle: {
        fontSize: 19,

        fontWeight: "700",

        color: "#2c3e50",
    },

    closeButton: {
        width: 42,
        height: 42,

        borderRadius: 21,

        alignItems: "center",
        justifyContent: "center",

        backgroundColor: "#f1f1f1",
    },

    formContainer: {
        padding: 15,

        paddingBottom: 40,
    },

});