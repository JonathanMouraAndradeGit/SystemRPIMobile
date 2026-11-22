import {
    useEffect,
    useState,
} from "react";

import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import {
    Ionicons,
} from "@expo/vector-icons";

import UBSForm from "@/components/Form/UBSForm/UBSForm";
import SwitchScreen from "@/components/SwitchScreen/SwitchScreen";

import apiFetch from "@/components/FetchFunc/APIFetch";
import PageItemSelector from "@/components/PageItemSelector/PageItemSelector";

import ErrMsg from "@/components/Alerts/ErrMsg";


const INITIAL_FORM = {
    nome: null,
    cidade: null,
    subprefeitura: null,
};

const BACK_ROUTE =
    process.env.EXPO_PUBLIC_BACK_ROUTE;


export default function UbsListSection() {

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [ubsList, setUbsList] = useState<any[]>([]);

    const [selectedUBS, setSelectedUBS] =
        useState<any | null>(null);

    const [filter, setFilter] =
        useState("");

    const [open, setOpen] =
        useState(false);


    // ==========================================
    // CARREGAR UBS
    // ==========================================

    async function loadUBS(
        pageNumber: number,
        searchValue: string
    ) {

        try {

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


            const response = await apiFetch(
                `${BACK_ROUTE}/ubs/filter2?${params.toString()}`
            );


            if (!response.ok) {

                throw new Error(
                    "Erro ao carregar UBS"
                );

            }


            const data =
                await response.json();


            console.log(
                "UBS:",
                data
            );


            setUbsList(
                data?.data || []
            );


            setTotalPages(
                data?.totalPages || 1
            );

        }
        catch (err) {

            await ErrMsg(
                "Erro ao Carregar"
            );

            console.error(err);

        }

    }


    // ==========================================
    // EXCLUIR UBS
    // ==========================================

    async function deleteUBS(
        id: number | string
    ) {
        try {

            const response =
                await apiFetch(
                    `${BACK_ROUTE}/ubs/${id}`,
                    {
                        method: "DELETE",
                    }
                );


            if (
                response.status !== 200 &&
                !response.ok
            ) {

                throw new Error(
                    "Erro ao realizar operação"
                );

            }


            /*
            await OKMsg(
                "O registro foi excluído com sucesso."
            );*/
            console.log("loading ubs!")


            await loadUBS(
                page,
                filter
            );

        }
        catch (err: any) {

            await ErrMsg(
                err?.message ||
                "Erro ao excluir UBS"
            );

            console.error(err);

        }
    /*

    await ConfirmMsg(
        "Você não poderá desfazer essa ação!",
        async () => {

            try {

                const response =
                    await apiFetch(
                        `${BACK_ROUTE}/ubs/${id}`,
                        {
                            method: "DELETE",
                        }
                    );


                if (
                    response.status !== 200 &&
                    !response.ok
                ) {

                    throw new Error(
                        "Erro ao realizar operação"
                    );

                }


                await OKMsg(
                    "O registro foi excluído com sucesso."
                );


                await loadUBS(
                    page,
                    filter
                );

            }
            catch (err: any) {

                await ErrMsg(
                    err?.message ||
                    "Erro ao excluir UBS"
                );

                console.error(err);

            }

        }
    );*/

}


// ==========================================
// NOVA UBS
// ==========================================

function newUBS() {

    setSelectedUBS(null);

    setOpen(true);

}


// ==========================================
// EDITAR UBS
// ==========================================

function editUBS(
    item: any
) {

    setSelectedUBS(item);

    setOpen(true);

}


// ==========================================
// RECARREGAR QUANDO FILTRO/PÁGINA MUDAR
// ==========================================

useEffect(() => {

    const timer = setTimeout(() => {

        void loadUBS(
            page,
            filter
        );

    }, 400);


    return () => {

        clearTimeout(timer);

    };

}, [filter, page]);


// ==========================================
// RENDER CARD
// ==========================================

function renderUBS({
    item,
}: {
    item: any;
}) {

    return (

        <View style={styles.card}>

            <View style={styles.info}>

                <Text style={styles.name}>
                    {item.nome}
                </Text>


                <Text style={styles.detail}>

                    <Text style={styles.label}>
                        Cidade:
                    </Text>

                    {" "}

                    {item.cidade || "-"}

                </Text>


                <Text style={styles.detail}>

                    <Text style={styles.label}>
                        Subprefeitura:
                    </Text>

                    {" "}

                    {item.subprefeitura || "-"}

                </Text>

            </View>


            <View style={styles.actions}>

                <TouchableOpacity
                    style={[
                        styles.actionButton,
                        styles.editButton,
                    ]}
                    onPress={() =>
                        editUBS(item)
                    }
                    activeOpacity={0.7}
                >

                    <Ionicons
                        name="create-outline"
                        size={20}
                        color="#FFFFFF"
                    />

                </TouchableOpacity>


                <TouchableOpacity
                    style={[
                        styles.actionButton,
                        styles.deleteButton,
                    ]}
                    onPress={() =>
                        deleteUBS(item.id)
                    }
                    activeOpacity={0.7}
                >

                    <Ionicons
                        name="trash-outline"
                        size={20}
                        color="#FFFFFF"
                    />

                </TouchableOpacity>

            </View>

        </View>

    );

}


// ==========================================
// RENDER
// ==========================================

return (

    <SwitchScreen
        open={open}
        setOpen={setOpen}
        sidebar={

            <UBSForm
                data={selectedUBS}

                onSuccess={() => {

                    void loadUBS(
                        page,
                        filter
                    );

                    setSelectedUBS(null);

                    setOpen(false);

                }}

                onCancel={newUBS}
            />

        }
    >

        <View style={styles.container}>

            {/* ==============================
                    HEADER
                ============================== */}

            <View style={styles.header}>

                <Text style={styles.title}>
                    UBS Cadastradas
                </Text>


                <TouchableOpacity
                    style={styles.newButton}
                    onPress={newUBS}
                    activeOpacity={0.8}
                >

                    <Ionicons
                        name="add"
                        size={20}
                        color="#FFFFFF"
                    />

                    <Text style={styles.newButtonText}>
                        Nova UBS
                    </Text>

                </TouchableOpacity>

            </View>


            {/* ==============================
                    FILTRO
                ============================== */}

            <View style={styles.filterContainer}>

                <Ionicons
                    name="search-outline"
                    size={20}
                    color="#777777"
                />

                <TextInput
                    style={styles.filter}
                    placeholder={
                        "Pesquisar por nome, cidade ou " +
                        "subprefeitura..."
                    }
                    placeholderTextColor="#999999"
                    value={filter}
                    onChangeText={(value) => {

                        setFilter(value);

                        setPage(1);

                    }}
                    returnKeyType="search"
                />

                {filter.length > 0 && (

                    <TouchableOpacity
                        onPress={() =>
                            setFilter("")
                        }
                    >

                        <Ionicons
                            name="close-circle"
                            size={20}
                            color="#999999"
                        />

                    </TouchableOpacity>

                )}

            </View>


            {/* ==============================
                    LISTA
                ============================== */}

            <FlatList
                data={ubsList}
                keyExtractor={(item) =>
                    String(item.id)
                }
                renderItem={renderUBS}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={
                    styles.listContent
                }

                ListEmptyComponent={

                    <View style={styles.emptyContainer}>

                        <Ionicons
                            name="business-outline"
                            size={48}
                            color="#AAAAAA"
                        />

                        <Text style={styles.emptyText}>
                            Nenhuma UBS encontrada.
                        </Text>

                    </View>

                }
            />


            {/* ==============================
                    PAGINAÇÃO
                ============================== */}

            <PageItemSelector
                page={page}
                totalPages={totalPages}

                func1={() => {

                    if (page > 1) {

                        setPage(
                            prev => prev - 1
                        );

                    }

                }}

                func2={() => {

                    if (
                        page < totalPages
                    ) {

                        setPage(
                            prev => prev + 1
                        );

                    }

                }}
            />

        </View>

    </SwitchScreen>

);

}
const styles = StyleSheet.create({

    // ==========================================
    // CONTAINER PRINCIPAL
    // ==========================================

    container: {
        flex: 1,
        width: "100%",
        backgroundColor: "#F7F8F7",

        paddingHorizontal: 14,
        paddingTop: 12,
        paddingBottom: 8,
    },


    // ==========================================
    // HEADER
    // ==========================================

    header: {
        width: "100%",

        flexDirection: "row",

        justifyContent: "space-between",
        alignItems: "center",

        marginBottom: 12,

        gap: 10,
    },


    title: {
        flex: 1,

        color: "#333333",

        fontSize: 21,

        fontWeight: "700",

        lineHeight: 26,
    },


    // ==========================================
    // BOTÃO NOVA UBS
    // ==========================================

    newButton: {
        height: 42,
        minWidth: 42,

        paddingHorizontal: 13,

        borderRadius: 9,

        backgroundColor: "#3C6A48",

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "center",

        gap: 6,

        elevation: 2,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.12,
        shadowRadius: 3,
    },


    newButtonText: {
        color: "#FFFFFF",

        fontSize: 13,

        fontWeight: "600",
    },


    // ==========================================
    // FILTRO
    // ==========================================

    filterContainer: {
        width: "100%",

        height: 46,

        flexDirection: "row",

        alignItems: "center",

        paddingHorizontal: 12,

        marginBottom: 12,

        backgroundColor: "#FFFFFF",

        borderWidth: 1,

        borderColor: "#D6D6D6",

        borderRadius: 9,
    },


    filter: {
        flex: 1,

        height: "100%",

        marginLeft: 8,

        paddingVertical: 0,

        color: "#333333",

        fontSize: 14,
    },


    // ==========================================
    // LISTA
    // ==========================================

    listContent: {
        paddingTop: 2,

        paddingBottom: 10,

        gap: 10,
    },


    // ==========================================
    // CARD
    // ==========================================

    card: {
        width: "100%",

        minHeight: 110,

        padding: 14,

        backgroundColor: "#FFFFFF",

        borderWidth: 1,

        borderColor: "rgba(102, 102, 102, 0.10)",

        borderRadius: 12,

        flexDirection: "row",

        justifyContent: "space-between",

        alignItems: "center",

        elevation: 2,

        shadowColor: "#000000",

        shadowOffset: {
            width: 0,
            height: 2,
        },

        shadowOpacity: 0.06,

        shadowRadius: 5,
    },


    // ==========================================
    // INFORMAÇÕES DA UBS
    // ==========================================

    info: {
        flex: 1,

        paddingRight: 10,

        minWidth: 0,
    },


    name: {
        marginBottom: 8,

        color: "#3C6A48",

        fontSize: 16,

        fontWeight: "700",

        lineHeight: 21,
    },


    detail: {
        marginBottom: 4,

        color: "#666666",

        fontSize: 13,

        lineHeight: 18,
    },


    label: {
        color: "#444444",

        fontWeight: "700",
    },


    // ==========================================
    // BOTÕES DE AÇÃO
    // ==========================================

    actions: {
        flexDirection: "row",

        alignItems: "center",

        gap: 8,
    },


    actionButton: {
        width: 40,

        height: 40,

        borderRadius: 20,

        alignItems: "center",

        justifyContent: "center",
    },


    editButton: {
        backgroundColor: "#3C6A48",
    },


    deleteButton: {
        backgroundColor: "#B42318",
    },


    // ==========================================
    // LISTA VAZIA
    // ==========================================

    emptyContainer: {
        alignItems: "center",

        justifyContent: "center",

        paddingVertical: 45,
    },
    emptyText: {
        marginTop: 10,
        color: "#888888",
        fontSize: 14,
        textAlign: "center",
    },

});