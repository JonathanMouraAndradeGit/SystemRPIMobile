import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io, Socket } from "socket.io-client";

import MicroAreaFormUser from "@/components/Form/MicroAreaFormUser/MicroAreaFormUser";
import PageItemSelector from "../../PageItemSelector/PageItemSelector";
import SwitchScreen from "../../SwitchScreen/SwitchScreen";

import apiFetch from "@/components/FetchFunc/APIFetch";

import ErrMsg from "../../Alerts/ErrMsg";

const BACK_ROUTE =
    process.env.EXPO_PUBLIC_BACK_ROUTE;

export default function MicroAreaListSectionUser() {

    const [total, setTotal] = useState(0);

    const [page, setPage] = useState(1);

    const [totalPages, setTotalPages] = useState(1);

    const [microAreaList, setMicroAreaList] =
        useState<any[]>([]);

    const [selectedMicroArea, setSelectedMicroArea] =
        useState<any>(null);

    const [filter, setFilter] =
        useState("");

    const [open, setOpen] =
        useState(false);

    const [loading, setLoading] =
        useState(false);
    const loadMicroArea = useCallback(
        async (
            pageNumber = page,
            searchValue = filter
        ) => {

            try {

                setLoading(true);

                const params = new URLSearchParams({
                    page: pageNumber.toString(),
                    limit: "30",
                });

                if (searchValue.trim()) {
                    params.append(
                        "search",
                        searchValue.trim()
                    );
                }

                const userString =
                    await AsyncStorage.getItem("user");

                const user = userString
                    ? JSON.parse(userString)
                    : null;

                if (!user) {
                    return;
                }

                let response;

                if (user?.roles?.includes("user")) {

                    response = await apiFetch(
                        `${BACK_ROUTE}/users/ubsmicro2/${user.cpf}?${params.toString()}`
                    );

                    const result =
                        await response.json();

                    const data =
                        result?.data ?? [];

                    setMicroAreaList(data);

                    setTotalPages(
                        result?.totalPages || 1
                    );

                    setTotal(
                        result?.total || 0
                    );

                }

                else {

                    response = await apiFetch(
                        `${BACK_ROUTE}/micro-areas/filter2?${params.toString()}`
                    );

                    const result =
                        await response.json();

                    setMicroAreaList(
                        result?.data ?? []
                    );

                    setTotalPages(
                        result?.totalPages || 1
                    );

                    setTotal(
                        result?.total || 0
                    );
                }

            } catch (err) {

                console.error(err);

                await ErrMsg(
                    "Erro ao carregar microáreas."
                );

            } finally {

                setLoading(false);

            }

        },
        [page, filter]
    );

    useEffect(() => {

        const timer = setTimeout(() => {

            setPage(1);

            loadMicroArea(1, filter);

        }, 400);

        return () => {
            clearTimeout(timer);
        };

    }, [filter]);

    useEffect(() => {

        let socket: Socket | null = null;

        async function initialize() {

            await loadMicroArea(1, "");

            const userString =
                await AsyncStorage.getItem("user");

            const user = userString
                ? JSON.parse(userString)
                : null;

            if (!user) {
                return;
            }

            socket = io(BACK_ROUTE);
            if (
                user?.roles?.includes("user") &&
                user?.ubsId
            ) {

                console.log(
                    "Entrando na room:",
                    `ubs:${user.ubsId}`
                );

                socket.emit("join:ubs", {
                    ubsId: user.ubsId,
                });

                socket.on(
                    "micro:changed",
                    () => {

                        console.log(
                            "Microárea da minha UBS foi alterada!"
                        );

                        loadMicroArea(
                            page,
                            filter
                        );
                    }
                );
            }
            if (user?.roles?.includes("admin")) {

                console.log(
                    "Entrando na room admins"
                );

                socket.emit("join:admin");

                socket.on(
                    "micro:changed",
                    () => {

                        console.log(
                            "Microárea alterada!"
                        );

                        loadMicroArea(
                            page,
                            filter
                        );
                    }
                );
            }
        }

        initialize();

        return () => {

            if (socket) {

                socket.off("micro:changed");

                socket.disconnect();

            }

        };

    }, []);

    async function deleteMicroArea(id: number) {
        try {

            const response =
                await apiFetch(
                    `${BACK_ROUTE}/micro-areas/${id}`,
                    {
                        method: "DELETE",
                    }
                );

            if (!response.ok) {
                throw new Error(
                    "Não foi possível excluir a microárea."
                );
            }

            /*
            await OKMsg(
                "O registro foi excluído com sucesso."
            );*/

            await loadMicroArea(
                page,
                filter
            );

        } catch (err: any) {

            console.error(err);

            /*
            await ErrMsg(
                err?.message ||
                "Erro ao excluir microárea."
            );*/
        }
        /*
        await ConfirmMsg(
            "Deseja realmente excluir esta Microárea?",
            async () => {

                try {

                    const response =
                        await apiFetch(
                            `${BACK_ROUTE}/micro-areas/${id}`,
                            {
                                method: "DELETE",
                            }
                        );

                    if (!response.ok) {
                        throw new Error(
                            "Não foi possível excluir a microárea."
                        );
                    }

                    await OKMsg(
                        "O registro foi excluído com sucesso."
                    );

                    await loadMicroArea(
                        page,
                        filter
                    );

                } catch (err: any) {

                    console.error(err);

                    await ErrMsg(
                        err?.message ||
                        "Erro ao excluir microárea."
                    );
                }
            }
        );*/
    }

    function newMicroArea() {

        setSelectedMicroArea(null);

        setOpen(true);
    }

    function editMicroArea(item: any) {

        console.log(
            "Editando microárea:",
            item
        );

        setSelectedMicroArea({
            ...item,
        });

        setOpen(true);
    }
    async function handleFormSuccess() {

        setSelectedMicroArea(null);

        setOpen(false);

        await loadMicroArea(
            page,
            filter
        );
    }
    const renderItem = ({
        item,
    }: {
        item: any;
    }) => {

        return (
            <View style={styles.card}>

                {/* INFORMAÇÕES */}

                <View style={styles.info}>

                    <Text style={styles.codigo}>
                        {item.codigo}
                    </Text>

                    <Text style={styles.infoText}>
                        <Text style={styles.label}>
                            Equipe:
                        </Text>{" "}
                        {item.equipe}
                    </Text>

                    {item?.ubs?.nome && (
                        <Text style={styles.infoText}>
                            <Text style={styles.label}>
                                UBS:
                            </Text>{" "}
                            {item.ubs.nome}
                        </Text>
                    )}

                </View>

                {/* AÇÕES */}

                <View style={styles.actions}>

                    {/* EDITAR */}

                    <Pressable
                        style={[
                            styles.actionButton,
                            styles.editButton,
                        ]}
                        onPress={() =>
                            editMicroArea(item)
                        }
                    >
                        <FontAwesome
                            name="pencil"
                            size={17}
                            color="#ffffff"
                        />
                    </Pressable>

                    {/* EXCLUIR */}

                    <Pressable
                        style={[
                            styles.actionButton,
                            styles.deleteButton,
                        ]}
                        onPress={() =>
                            deleteMicroArea(item.id)
                        }
                    >
                        <FontAwesome
                            name="trash"
                            size={17}
                            color="#ffffff"
                        />
                    </Pressable>

                </View>

            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>

                <Text style={styles.title}>
                    Microáreas
                </Text>

                <Pressable
                    style={styles.newButton}
                    onPress={newMicroArea}
                >
                    <FontAwesome
                        name="plus"
                        size={14}
                        color="#ffffff"
                    />

                    <Text style={styles.newButtonText}>
                        Nova
                    </Text>
                </Pressable>

            </View>
            <TextInput
                style={styles.filter}
                placeholder="Pesquisar..."
                placeholderTextColor="#999999"
                value={filter}
                onChangeText={setFilter}
                autoCapitalize="none"
                autoCorrect={false}
            />
            <View style={styles.totalContainer}>

                <Text style={styles.totalText}>
                    {total}{" "}
                    {total === 1
                        ? "microárea"
                        : "microáreas"}
                </Text>

            </View>

            {loading && microAreaList.length === 0 ? (

                <View style={styles.loading}>
                    <ActivityIndicator
                        size="large"
                        color="#3c6a48"
                    />
                </View>

            ) : (

                <FlatList
                    data={microAreaList}
                    keyExtractor={(item) =>
                        String(item.id)
                    }
                    renderItem={renderItem}

                    contentContainerStyle={
                        styles.listContent
                    }

                    showsVerticalScrollIndicator={false}

                    keyboardShouldPersistTaps="handled"

                    ListEmptyComponent={
                        <View
                            style={styles.empty}
                        >
                            <FontAwesome
                                name="search"
                                size={35}
                                color="#aaaaaa"
                            />

                            <Text
                                style={
                                    styles.emptyText
                                }
                            >
                                Nenhuma microárea
                                encontrada.
                            </Text>
                        </View>
                    }
                />

            )}

            <View style={styles.pagination}>

                <PageItemSelector
                    page={page}
                    totalPages={totalPages}

                    func1={() => {

                        if (page <= 1) {
                            return;
                        }

                        const newPage =
                            page - 1;

                        setPage(newPage);

                        loadMicroArea(
                            newPage,
                            filter
                        );
                    }}

                    func2={() => {

                        if (
                            page >= totalPages
                        ) {
                            return;
                        }

                        const newPage =
                            page + 1;

                        setPage(newPage);

                        loadMicroArea(
                            newPage,
                            filter
                        );
                    }}
                />

            </View>

            <SwitchScreen
                open={open}
                setOpen={setOpen}

                sidebar={<MicroAreaFormUser
                    obj={selectedMicroArea}

                    onSuccess={handleFormSuccess}

                    onCancel={() => {

                        setSelectedMicroArea(
                            null
                        );

                        setOpen(false);
                    }} />} children={undefined} />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

        backgroundColor: "#f7f8f7",

        paddingHorizontal: 10,

        paddingTop: 10,
    },
    header: {
        width: "100%",

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "space-between",

        marginBottom: 12,
    },

    title: {
        fontSize: 23,

        fontWeight: "700",

        color: "#333333",
    },
    newButton: {
        minHeight: 44,

        paddingHorizontal: 13,

        borderRadius: 9,

        backgroundColor: "#3c6a48",

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "center",

        gap: 7,

        elevation: 2,
    },

    newButtonText: {
        color: "#ffffff",

        fontSize: 13,

        fontWeight: "700",
    },

    filter: {
        width: "100%",

        height: 48,

        paddingHorizontal: 15,

        borderWidth: 1,

        borderColor: "#d6d6d6",

        borderRadius: 9,

        backgroundColor: "#ffffff",

        color: "#333333",

        fontSize: 15,

        marginBottom: 5,
    },

    totalContainer: {
        width: "100%",

        paddingHorizontal: 4,

        paddingVertical: 5,
    },

    totalText: {
        color: "#777777",

        fontSize: 13,
    },

    listContent: {
        paddingTop: 5,

        paddingBottom: 10,

        gap: 12,
    },

    card: {
        width: "100%",

        minHeight: 100,

        padding: 15,

        borderRadius: 12,

        backgroundColor: "#ffffff",

        borderWidth: 1,

        borderColor: "rgba(102, 102, 102, 0.10)",

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "space-between",

        elevation: 2,

        shadowColor: "#000000",

        shadowOffset: {
            width: 0,
            height: 2,
        },

        shadowOpacity: 0.06,

        shadowRadius: 5,
    },

    info: {
        flex: 1,

        paddingRight: 10,

        gap: 5,

        alignItems: "flex-start",

        justifyContent: "center",
    },

    codigo: {
        fontSize: 18,

        fontWeight: "700",

        color: "#3c6a48",

        marginBottom: 2,
    },

    infoText: {
        fontSize: 14,

        color: "#666666",

        lineHeight: 20,
    },

    label: {
        fontWeight: "700",

        color: "#555555",
    },

    actions: {
        flexDirection: "row",

        alignItems: "center",

        gap: 8,
    },

    actionButton: {
        width: 42,

        height: 42,

        borderRadius: 21,

        alignItems: "center",

        justifyContent: "center",

        elevation: 2,
    },

    editButton: {
        backgroundColor: "#3c6a48",
    },

    deleteButton: {
        backgroundColor: "#b42318",
    },

    loading: {
        flex: 1,

        alignItems: "center",

        justifyContent: "center",
    },

    empty: {
        alignItems: "center",

        justifyContent: "center",

        paddingVertical: 60,
    },

    emptyText: {
        marginTop: 12,

        fontSize: 15,

        color: "#888888",

        textAlign: "center",
    },

    pagination: {
        width: "100%",

        paddingVertical: 5,

        backgroundColor: "#f7f8f7",
    },
});