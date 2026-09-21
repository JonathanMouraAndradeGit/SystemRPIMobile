
import { FontAwesome } from "@expo/vector-icons";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";
/*
import {
    FaEdit,
    FaTrash,
} from "react-icons/fa";
*/
export default function OcorrenciaTable({
    ocorrencias,
    loading,
    onEdit,
    onDelete,
    config,
}: any) {

    const { width } = useWindowDimensions();

    const isMobile = width <= 768;
    const isSmallMobile = width <= 480;

    /*
     * =========================
     * LOADING
     * =========================
     */

    if (loading) {
        return (
            <View style={styles.loading}>

                <ActivityIndicator
                    size="large"
                    color="#3c6a48"
                />

                <Text style={styles.loadingText}>
                    Carregando ocorrências...
                </Text>

            </View>
        );
    }

    /*
     * =========================
     * VAZIO
     * =========================
     */

    if (!ocorrencias || ocorrencias.length === 0) {
        return (
            <View style={styles.emptyContainer}>

                <Text style={styles.empty}>
                    Nenhuma ocorrência encontrada.
                </Text>

            </View>
        );
    }

    /*
     * =========================
     * TIPO
     * =========================
     */

    const getTipo = (ocorrencia: any) =>
        ocorrencia[config.tipoRelation];

    /*
     * =========================
     * DATA
     * =========================
     */

    function formatDate(date: string) {

        if (!date) {
            return "-";
        }

        try {
            return new Date(
                date
            ).toLocaleDateString(
                "pt-BR"
            );
        } catch {
            return "-";
        }
    }

    /*
     * =========================
     * MOBILE
     * =========================
     */

    if (isMobile) {

        return (
            <View
                style={[
                    styles.container,
                    {
                        borderRadius:
                            isSmallMobile
                                ? 10
                                : 14,
                    },
                ]}
            >

                {ocorrencias.map(
                    (ocorrencia: any) => {

                        const tipo =
                            getTipo(
                                ocorrencia
                            );

                        const micro =
                            ocorrencia
                                .endereco
                                ?.microArea;

                        const ubs =
                            micro?.ubs;

                        return (
                            <View
                                key={
                                    ocorrencia.id
                                }
                                style={[
                                    styles.card,
                                    {
                                        padding:
                                            isSmallMobile
                                                ? 12
                                                : 16,
                                    },
                                ]}
                            >

                                {/* =========================
                                    CABEÇALHO
                                ========================= */}

                                <View
                                    style={
                                        styles.cardHeader
                                    }
                                >

                                    <View
                                        style={
                                            styles.titleContainer
                                        }
                                    >

                                        <Text
                                            style={
                                                styles.category
                                            }
                                            numberOfLines={
                                                1
                                            }
                                        >
                                            {
                                                tipo
                                                    ?.categoria
                                                    ?.nome
                                            }
                                        </Text>

                                        <Text
                                            style={
                                                styles.type
                                            }
                                            numberOfLines={
                                                1
                                            }
                                        >
                                            {
                                                tipo?.nome
                                            }
                                        </Text>

                                    </View>

                                    <Text
                                        style={
                                            styles.date
                                        }
                                    >
                                        {formatDate(
                                            ocorrencia.dataReferencia
                                        )}
                                    </Text>

                                </View>

                                {/* =========================
                                    ENDEREÇO
                                ========================= */}

                                <View
                                    style={
                                        styles.infoBlock
                                    }
                                >

                                    <Text
                                        style={
                                            styles.infoLabel
                                        }
                                    >
                                        Endereço
                                    </Text>

                                    <Text
                                        style={
                                            styles.infoValue
                                        }
                                        numberOfLines={
                                            2
                                        }
                                    >
                                        {
                                            ocorrencia
                                                .endereco
                                                ?.logradouro
                                        }
                                        {", "}
                                        {
                                            ocorrencia
                                                .endereco
                                                ?.numero
                                        }
                                    </Text>

                                </View>

                                {/* =========================
                                    LOCALIZAÇÃO
                                ========================= */}

                                <View
                                    style={
                                        styles.locationRow
                                    }
                                >

                                    <View
                                        style={
                                            styles.locationItem
                                        }
                                    >

                                        <Text
                                            style={
                                                styles.infoLabel
                                            }
                                        >
                                            Micro
                                        </Text>

                                        <Text
                                            style={
                                                styles.infoValue
                                            }
                                        >
                                            {
                                                micro?.codigo
                                            }
                                        </Text>

                                    </View>

                                    <View
                                        style={
                                            styles.locationItem
                                        }
                                    >

                                        <Text
                                            style={
                                                styles.infoLabel
                                            }
                                        >
                                            Equipe
                                        </Text>

                                        <Text
                                            style={
                                                styles.infoValue
                                            }
                                            numberOfLines={
                                                1
                                            }
                                        >
                                            {
                                                micro?.equipe
                                            }
                                        </Text>

                                    </View>

                                </View>

                                {/* =========================
                                    UBS / CIDADE
                                ========================= */}

                                <View
                                    style={
                                        styles.locationRow
                                    }
                                >

                                    <View
                                        style={
                                            styles.locationItem
                                        }
                                    >

                                        <Text
                                            style={
                                                styles.infoLabel
                                            }
                                        >
                                            UBS
                                        </Text>

                                        <Text
                                            style={
                                                styles.infoValue
                                            }
                                            numberOfLines={
                                                1
                                            }
                                        >
                                            {
                                                ubs?.nome
                                            }
                                        </Text>

                                    </View>

                                    <View
                                        style={
                                            styles.locationItem
                                        }
                                    >

                                        <Text
                                            style={
                                                styles.infoLabel
                                            }
                                        >
                                            Cidade
                                        </Text>

                                        <Text
                                            style={
                                                styles.infoValue
                                            }
                                            numberOfLines={
                                                1
                                            }
                                        >
                                            {
                                                ubs?.cidade
                                            }
                                        </Text>

                                    </View>

                                </View>

                                {/* =========================
                                    AÇÕES
                                ========================= */}

                                <View
                                    style={
                                        styles.actions
                                    }
                                >

                                    <TouchableOpacity
                                        style={[
                                            styles.actionButton,
                                            styles.edit,
                                        ]}
                                        onPress={() =>
                                            onEdit(
                                                ocorrencia
                                            )
                                        }
                                        activeOpacity={
                                            0.8
                                        }
                                    >

                                        {/*<FaEdit
                                            color="#ffffff"
                                        />*/}

                                        <Text
                                            style={
                                                styles.actionText
                                            }
                                        >
                                            Editar
                                        </Text>

                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[
                                            styles.actionButton,
                                            styles.delete,
                                        ]}
                                        onPress={() =>
                                            onDelete(
                                                ocorrencia.id
                                            )
                                        }
                                        activeOpacity={
                                            0.8
                                        }
                                    >

                                        {/*<FaTrash
                                            color="#ffffff"
                                        />*/}

                                        <Text
                                            style={
                                                styles.actionText
                                            }
                                        >
                                            Excluir
                                        </Text>

                                    </TouchableOpacity>

                                </View>

                            </View>
                        );
                    }
                )}

            </View>
        );
    }

    /*
     * =========================
     * TABLET / DESKTOP
     * =========================
     *
     * No React Native não temos <table>.
     * Aqui usamos linhas simulando uma tabela.
     */

    return (
        <View style={styles.container}>

            {/* HEADER */}

            <View style={styles.tableHeader}>

                <Text
                    style={[
                        styles.headerCell,
                        styles.categoryColumn,
                    ]}
                >
                    Categoria
                </Text>

                <Text
                    style={[
                        styles.headerCell,
                        styles.typeColumn,
                    ]}
                >
                    {config.tipoLabel}
                </Text>

                <Text
                    style={[
                        styles.headerCell,
                        styles.microColumn,
                    ]}
                >
                    Micro
                </Text>

                <Text
                    style={[
                        styles.headerCell,
                        styles.teamColumn,
                    ]}
                >
                    Equipe
                </Text>

                <Text
                    style={[
                        styles.headerCell,
                        styles.addressColumn,
                    ]}
                >
                    Logradouro
                </Text>

                <Text
                    style={[
                        styles.headerCell,
                        styles.numberColumn,
                    ]}
                >
                    Nº
                </Text>

                <Text
                    style={[
                        styles.headerCell,
                        styles.ubsColumn,
                    ]}
                >
                    UBS
                </Text>

                <Text
                    style={[
                        styles.headerCell,
                        styles.cityColumn,
                    ]}
                >
                    Cidade
                </Text>

                <Text
                    style={[
                        styles.headerCell,
                        styles.dateColumn,
                    ]}
                >
                    Data
                </Text>

                <Text
                    style={[
                        styles.headerCell,
                        styles.actionsColumn,
                    ]}
                >
                    Ações
                </Text>

            </View>

            {/* ROWS */}

            {ocorrencias.map(
                (ocorrencia: any) => {

                    const tipo =
                        getTipo(
                            ocorrencia
                        );

                    const micro =
                        ocorrencia
                            .endereco
                            ?.microArea;

                    const ubs =
                        micro?.ubs;

                    return (
                        <View
                            key={
                                ocorrencia.id
                            }
                            style={
                                styles.tableRow
                            }
                        >

                            <Text
                                style={[
                                    styles.cell,
                                    styles.categoryColumn,
                                ]}
                                numberOfLines={
                                    1
                                }
                            >
                                {
                                    tipo
                                        ?.categoria
                                        ?.nome
                                }
                            </Text>

                            <Text
                                style={[
                                    styles.cell,
                                    styles.typeColumn,
                                ]}
                                numberOfLines={
                                    1
                                }
                            >
                                {
                                    tipo?.nome
                                }
                            </Text>

                            <Text
                                style={[
                                    styles.cell,
                                    styles.microColumn,
                                ]}
                            >
                                {
                                    micro?.codigo
                                }
                            </Text>

                            <Text
                                style={[
                                    styles.cell,
                                    styles.teamColumn,
                                ]}
                                numberOfLines={
                                    1
                                }
                            >
                                {
                                    micro?.equipe
                                }
                            </Text>

                            <Text
                                style={[
                                    styles.cell,
                                    styles.addressColumn,
                                ]}
                                numberOfLines={
                                    1
                                }
                            >
                                {
                                    ocorrencia
                                        .endereco
                                        ?.logradouro
                                }
                            </Text>

                            <Text
                                style={[
                                    styles.cell,
                                    styles.numberColumn,
                                ]}
                            >
                                {
                                    ocorrencia
                                        .endereco
                                        ?.numero
                                }
                            </Text>

                            <Text
                                style={[
                                    styles.cell,
                                    styles.ubsColumn,
                                ]}
                                numberOfLines={
                                    1
                                }
                            >
                                {
                                    ubs?.nome
                                }
                            </Text>

                            <Text
                                style={[
                                    styles.cell,
                                    styles.cityColumn,
                                ]}
                                numberOfLines={
                                    1
                                }
                            >
                                {
                                    ubs?.cidade
                                }
                            </Text>

                            <Text
                                style={[
                                    styles.cell,
                                    styles.dateColumn,
                                ]}
                            >
                                {formatDate(
                                    ocorrencia
                                        .dataReferencia
                                )}
                            </Text>

                            <View
                                style={[
                                    styles.actions,
                                    styles.actionsColumn,
                                ]}
                            >

                                <TouchableOpacity
                                    style={[
                                        styles.iconButton,
                                        styles.edit,
                                    ]}
                                    onPress={() =>
                                        onEdit(
                                            ocorrencia
                                        )
                                    }
                                >
                                    <FontAwesome
                                        name="pencil"
                                        size={17}
                                        color="#ffffff"
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.iconButton,
                                        styles.delete,
                                    ]}
                                    onPress={() =>
                                        onDelete(
                                            ocorrencia.id
                                        )
                                    }
                                >
                                    <FontAwesome
                                        name="trash"
                                        size={17}
                                        color="#ffffff"
                                    />
                                </TouchableOpacity>

                            </View>

                        </View>
                    );
                }
            )}

        </View>
    );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({

    /* =========================
       CONTAINER
    ========================= */

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

        overflow: "hidden",
    },

    /* =========================
       MOBILE CARD
    ========================= */

    card: {
        backgroundColor: "#ffffff",

        borderBottomWidth: 1,

        borderBottomColor:
            "#e5e5e5",

        gap: 12,
    },

    cardHeader: {
        flexDirection: "row",

        alignItems: "flex-start",

        justifyContent:
            "space-between",

        gap: 10,
    },

    titleContainer: {
        flex: 1,
    },

    category: {
        color: "#3c6a48",

        fontSize: 15,

        fontWeight: "700",

        marginBottom: 3,
    },

    type: {
        color: "#444444",

        fontSize: 13,

        fontWeight: "500",
    },

    date: {
        color: "#666666",

        fontSize: 12,

        fontWeight: "600",

        backgroundColor:
            "#f3f7f4",

        paddingHorizontal: 8,

        paddingVertical: 5,

        borderRadius: 6,
    },

    infoBlock: {
        width: "100%",
    },

    infoLabel: {
        color: "#888888",

        fontSize: 11,

        fontWeight: "600",

        marginBottom: 3,

        textTransform: "uppercase",
    },

    infoValue: {
        color: "#444444",

        fontSize: 13,

        fontWeight: "500",
    },

    locationRow: {
        flexDirection: "row",

        gap: 20,
    },

    locationItem: {
        flex: 1,

        minWidth: 0,
    },

    /* =========================
       MOBILE ACTIONS
    ========================= */

    actions: {
        flexDirection: "row",

        alignItems: "center",

        justifyContent: "center",

        gap: 8,
    },

    actionButton: {
        flex: 1,

        height: 40,

        borderRadius: 8,

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "center",

        gap: 7,
    },

    actionText: {
        color: "#ffffff",

        fontSize: 13,

        fontWeight: "600",
    },

    /* =========================
       CORES
    ========================= */

    edit: {
        backgroundColor: "#3c6a48",
    },

    delete: {
        backgroundColor: "#b42318",
    },

    /* =========================
       TABLE HEADER
    ========================= */

    tableHeader: {
        minHeight: 50,

        flexDirection: "row",

        alignItems: "center",

        backgroundColor: "#3c6a48",
    },

    headerCell: {
        color: "#ffffff",

        fontSize: 12,

        fontWeight: "700",

        paddingHorizontal: 8,
    },

    /* =========================
       TABLE ROW
    ========================= */

    tableRow: {
        minHeight: 55,

        flexDirection: "row",

        alignItems: "center",

        borderBottomWidth: 1,

        borderBottomColor:
            "#e5e5e5",
    },

    cell: {
        color: "#444444",

        fontSize: 12,

        paddingHorizontal: 8,
    },

    /* =========================
       COLUNAS
    ========================= */

    categoryColumn: {
        flex: 1.2,
    },

    typeColumn: {
        flex: 1.2,
    },

    microColumn: {
        flex: 0.65,
    },

    teamColumn: {
        flex: 1,
    },

    addressColumn: {
        flex: 1.5,
    },

    numberColumn: {
        flex: 0.5,
    },

    ubsColumn: {
        flex: 1.2,
    },

    cityColumn: {
        flex: 1,
    },

    dateColumn: {
        flex: 0.8,
    },

    actionsColumn: {
        flex: 1,
    },

    /* =========================
       TABLE ACTIONS
    ========================= */

    iconButton: {
        width: 32,

        height: 32,

        borderRadius: 7,

        alignItems: "center",

        justifyContent: "center",
    },

    /* =========================
       EMPTY
    ========================= */

    emptyContainer: {
        minHeight: 180,

        backgroundColor: "#ffffff",

        borderRadius: 16,

        borderWidth: 1,

        borderColor:
            "rgba(102, 102, 102, 0.10)",

        alignItems: "center",

        justifyContent: "center",

        padding: 30,
    },

    empty: {
        color: "#666666",

        fontSize: 14,

        textAlign: "center",
    },

    /* =========================
       LOADING
    ========================= */

    loading: {
        minHeight: 250,

        backgroundColor: "#ffffff",

        borderRadius: 16,

        borderWidth: 1,

        borderColor:
            "rgba(102, 102, 102, 0.10)",

        alignItems: "center",

        justifyContent: "center",

        flexDirection: "row",

        gap: 15,
    },

    loadingText: {
        color: "#3c6a48",

        fontSize: 14,

        fontWeight: "600",
    },
});