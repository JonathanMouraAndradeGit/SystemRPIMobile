import { useEffect, useState } from "react";

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

import MapComp from "../MapComp/MapComp";

interface MapInputProps {
    onChange?: (value: any) => void;
    placeName?: any;
}

interface AddressResult {
    lat: string;
    lon: string;
    display_name: string;

    address?: {
        road?: string;
        pedestrian?: string;
        footway?: string;
        path?: string;

        house_number?: string;

        suburb?: string;
        neighbourhood?: string;
        city_district?: string;

        city?: string;
        town?: string;
        village?: string;

        state?: string;

        postcode?: string;

        country?: string;
    };
}

interface SelectedAddress {
    latitude: number;
    longitude: number;

    logradouro: string;
    numero: string;

    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
    pais?: string;

    enderecoCompleto: string;
}

export default function MapInput({
    onChange,
    placeName,
}: MapInputProps) {

    const [search, setSearch] =
        useState("");

    const [resultsAddr, setResultAddr] =
        useState(true);

    const [addrLst, setAddrLst] =
        useState<AddressResult[]>([]);

    const [selectedAddr, setSelectedAddr] =
        useState<SelectedAddress | null>(null);

    const [loading, setLoading] =
        useState(false);
    async function subs() {

        const location = search.trim();

        if (!location) {
            return;
        }

        try {

            setLoading(true);

            setResultAddr(true);

            const url =
                `https://nominatim.openstreetmap.org/search?` +
                `format=json` +
                `&addressdetails=1` +
                `&limit=5` +
                `&q=${encodeURIComponent(location)}`;

            const response = await fetch(
                url,
                {
                    headers: {
                        "Accept":
                            "application/json",

                        /*
                         * Nominatim recomenda
                         * identificar o cliente.
                         */
                        "User-Agent":
                            "MeuAplicativoReactNative/1.0",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Erro ao consultar endereço."
                );
            }

            const data: AddressResult[] =
                await response.json();

            if (
                data &&
                data.length > 0
            ) {

                setAddrLst(data);

                setResultAddr(true);

            } else {

                setAddrLst([]);

                setResultAddr(false);
            }

        } catch (err) {

            console.error(
                "Erro ao buscar endereço:",
                err
            );

            setAddrLst([]);

            setResultAddr(false);

        } finally {

            setLoading(false);
        }
    }
    function selectedPlace(
        place: AddressResult
    ) {

        const addr =
            place.address ?? {};

        const endereco: SelectedAddress = {

            latitude:
                Number(place.lat),

            longitude:
                Number(place.lon),

            logradouro:
                addr.road ??
                addr.pedestrian ??
                addr.footway ??
                addr.path ??
                "",

            numero:
                addr.house_number ??
                "",

            bairro:
                addr.suburb ??
                addr.neighbourhood ??
                addr.city_district ??
                "",

            cidade:
                addr.city ??
                addr.town ??
                addr.village ??
                "",

            estado:
                addr.state ??
                "",

            cep:
                addr.postcode ??
                "",

            pais:
                addr.country ??
                "",

            enderecoCompleto:
                place.display_name,
        };
        onChange?.(endereco);
        setSelectedAddr(endereco);
        setAddrLst([]);
        setResultAddr(true);
        setSearch("");
    }
    useEffect(() => {

        if (
            placeName &&
            placeName.logradouro &&
            placeName.numero
        ) {

            setSelectedAddr({

                latitude:
                    Number(
                        placeName.latitude
                    ),

                longitude:
                    Number(
                        placeName.longitude
                    ),

                logradouro:
                    placeName.logradouro,

                numero:
                    placeName.numero,

                bairro:
                    placeName.bairro ??
                    "",

                cidade:
                    placeName.cidade ??
                    "",

                estado:
                    placeName.estado ??
                    "",

                cep:
                    placeName.cep ??
                    "",

                pais:
                    placeName.pais ??
                    "",

                enderecoCompleto:
                    placeName.enderecoCompleto ??
                    `${placeName.logradouro}, ${placeName.numero}`,
            });
        }

    }, [placeName]);
    function renderResult({
        item,
    }: {
        item: AddressResult;
    }) {

        return (
            <Pressable
                style={styles.resultItem}
                onPress={() =>
                    selectedPlace(item)
                }
            >

                <FontAwesome
                    name="map-marker"
                    size={18}
                    color="#3c6a48"
                />

                <Text
                    style={styles.resultText}
                >
                    {item.display_name}
                </Text>

            </Pressable>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Selecione um endereço
            </Text>
            <View style={styles.searchBox}>

                <TextInput
                    value={search}

                    onChangeText={setSearch}

                    placeholder="Digite um endereço..."

                    placeholderTextColor="#999999"

                    style={styles.input}

                    autoCapitalize="none"

                    autoCorrect={false}

                    returnKeyType="search"

                    onSubmitEditing={subs}
                />

                <Pressable
                    style={styles.searchBtn}

                    onPress={subs}

                    disabled={loading}
                >

                    {loading ? (

                        <ActivityIndicator
                            size="small"
                            color="#ffffff"
                        />

                    ) : (

                        <>
                            <FontAwesome
                                name="search"
                                size={15}
                                color="#ffffff"
                            />

                            <Text
                                style={
                                    styles.searchBtnText
                                }
                            >
                                Buscar
                            </Text>
                        </>
                    )}

                </Pressable>

            </View>
            {loading && (
                <View
                    style={
                        styles.loadingContainer
                    }
                >
                    <ActivityIndicator
                        size="small"
                        color="#3c6a48"
                    />

                    <Text
                        style={styles.loading}
                    >
                        Procurando localização...
                    </Text>
                </View>
            )}
            {!loading &&
                addrLst.length > 0 && (
                    <View style={styles.results}>
                        <FlatList
                            data={addrLst}
                            keyExtractor={(
                                item : any,
                                index
                            )=>
                                `${item.place_id ?? index}`
                            }

                            renderItem={
                                renderResult
                            }

                            keyboardShouldPersistTaps="handled"

                            nestedScrollEnabled

                            showsVerticalScrollIndicator={
                                true
                            }

                            style={
                                styles.resultsList
                            }
                        />

                    </View>
                )}
            {!loading &&
                !resultsAddr && (

                    <Text
                        style={
                            styles.notFound
                        }
                    >
                        Nenhum endereço encontrado.
                    </Text>
                )}
            {selectedAddr && (

                <View
                    style={
                        styles.selectedCard
                    }
                >

                    <Text
                        style={
                            styles.selectedTitle
                        }
                    >
                        Endereço selecionado
                    </Text>

                    <Text
                        style={
                            styles.selectedText
                        }
                    >
                        {selectedAddr.enderecoCompleto}
                    </Text>

                    {selectedAddr.bairro ? (
                        <Text
                            style={
                                styles.detailText
                            }
                        >
                            <Text
                                style={
                                    styles.bold
                                }
                            >
                                Bairro:
                            </Text>{" "}
                            {selectedAddr.bairro}
                        </Text>
                    ) : null}

                    {selectedAddr.cidade ? (
                        <Text
                            style={
                                styles.detailText
                            }
                        >
                            <Text
                                style={
                                    styles.bold
                                }
                            >
                                Cidade:
                            </Text>{" "}
                            {selectedAddr.cidade}
                        </Text>
                    ) : null}

                </View>
            )}
            {
                selectedAddr?.latitude != null &&
                selectedAddr?.longitude != null && (

                    <View
                        style={
                            styles.mapWrapper
                        }
                    >

                        <MapComp
                            key={
                                `${selectedAddr.latitude}-${selectedAddr.longitude}`
                            }

                            lat={
                                selectedAddr.latitude
                            }

                            lon={
                                selectedAddr.longitude
                            }

                            display_name={
                                selectedAddr.enderecoCompleto
                            }
                        />

                    </View>
                )
            }

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",

        flexDirection: "column",

        gap: 12,

        paddingBottom: 10,
    },
    title: {
        color: "#333333",

        fontSize: 18,

        fontWeight: "600",

        marginBottom: 2,
    },
    searchBox: {
        width: "100%",

        flexDirection: "row",

        alignItems: "center",

        gap: 8,
    },

    input: {
        flex: 1,

        height: 48,

        paddingHorizontal: 15,

        borderWidth: 2,

        borderColor: "#d6d6d6",

        borderRadius: 12,

        backgroundColor: "#ffffff",

        color: "#333333",

        fontSize: 15,
    },

    searchBtn: {
        height: 48,

        paddingHorizontal: 15,

        borderRadius: 12,

        backgroundColor: "#3c6a48",

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "center",

        gap: 7,
    },

    searchBtnText: {
        color: "#ffffff",

        fontSize: 14,

        fontWeight: "600",
    },
    loadingContainer: {
        flexDirection: "row",

        alignItems: "center",

        gap: 8,

        paddingVertical: 5,
    },

    loading: {
        color: "#666666",

        fontSize: 14,
    },
    results: {
        width: "100%",

        maxHeight: 250,

        borderWidth: 1,

        borderColor: "#d6d6d6",

        borderRadius: 12,

        backgroundColor: "#ffffff",

        overflow: "hidden",

        elevation: 3,

        shadowColor: "#000000",

        shadowOffset: {
            width: 0,

            height: 3,
        },

        shadowOpacity: 0.08,

        shadowRadius: 5,
    },

    resultsList: {
        width: "100%",
    },

    resultItem: {
        minHeight: 60,

        paddingHorizontal: 14,

        paddingVertical: 12,

        flexDirection: "row",

        alignItems: "center",

        gap: 10,

        borderBottomWidth: 1,

        borderBottomColor: "#eeeeee",
    },

    resultText: {
        flex: 1,

        color: "#444444",

        fontSize: 14,

        lineHeight: 20,
    },

    notFound: {
        color: "#b42318",

        fontSize: 14,

        fontWeight: "500",

        paddingVertical: 5,
    },
    selectedCard: {
        width: "100%",

        padding: 14,

        borderRadius: 16,

        backgroundColor: "#f3f7f4",

        borderWidth: 1,

        borderColor:
            "rgba(60, 106, 72, 0.18)",

        elevation: 2,

        shadowColor: "#000000",

        shadowOffset: {
            width: 0,

            height: 2,
        },

        shadowOpacity: 0.05,

        shadowRadius: 4,
    },

    selectedTitle: {
        color: "#333333",

        fontSize: 15,

        fontWeight: "700",

        marginBottom: 7,
    },

    selectedText: {
        color: "#666666",

        fontSize: 14,

        lineHeight: 21,

        marginBottom: 5,
    },

    detailText: {
        color: "#666666",

        fontSize: 13,

        lineHeight: 20,
    },

    bold: {
        fontWeight: "700",

        color: "#555555",
    },

    /*
     * =====================================================
     * MAPA
     * =====================================================
     */

    mapWrapper: {
        width: "100%",

        height: 220,

        borderRadius: 16,

        borderWidth: 2,

        borderColor: "#d6d6d6",

        backgroundColor: "#ffffff",

        overflow: "hidden",

        elevation: 3,

        shadowColor: "#000000",

        shadowOffset: {
            width: 0,

            height: 4,
        },

        shadowOpacity: 0.07,

        shadowRadius: 8,

        marginTop: 3,
    },
});