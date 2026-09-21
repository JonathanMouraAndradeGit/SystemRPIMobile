import React from "react";

import {
    View,
    Text,
    Pressable,
    StyleSheet,
    ScrollView,
} from "react-native";

import {
    FontAwesome5,
} from "@expo/vector-icons";

export default function HomeSection() {

    function acessarSistema() {
        console.log("Acessar Sistema");
    }

    function saibaMais() {
        console.log("Saiba Mais");
    }


    return (

        <ScrollView
            style={styles.HomeCon}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >

            <View style={styles.HomeContainer}>
                <View style={styles.Left}>

                    {/* Badge */}

                    <View style={styles.Badge}>

                        <Text style={styles.BadgeText}>
                            Sistema Inteligente de Gestão
                        </Text>

                    </View>


                    {/* Título */}

                    <Text style={styles.Title}>

                        Controle de{" "}

                        <Text style={styles.TitleHighlight}>
                            Ocorrências
                        </Text>

                        , Indicadores de Saúde e Gestão de Riscos

                    </Text>


                    {/* Descrição */}

                    <Text style={styles.Description}>

                        Centralize o registro, acompanhamento e análise
                        de riscos, potencialidades e indicadores de saúde
                        em uma única plataforma. Tenha informações
                        organizadas para apoiar a tomada de decisões,
                        monitorar ocorrências e fortalecer a prevenção.

                    </Text>


                    {/* Botões */}

                    <View style={styles.Buttons}>

                        <Pressable
                            style={({ pressed }) => [
                                styles.Primary,
                                pressed && styles.PrimaryPressed,
                            ]}
                            onPress={acessarSistema}
                        >

                            <Text style={styles.PrimaryText}>
                                Acessar Sistema
                            </Text>

                        </Pressable>


                        <Pressable
                            style={({ pressed }) => [
                                styles.Secondary,
                                pressed && styles.SecondaryPressed,
                            ]}
                            onPress={saibaMais}
                        >

                            <Text
                                style={
                                    styles.SecondaryText
                                }
                            >
                                Saiba Mais
                            </Text>

                        </Pressable>

                    </View>

                </View>


                {/* =====================================================
                    LADO DIREITO
                ===================================================== */}

                <View style={styles.Right}>

                    {/* CARD 1 

                    <FeatureCard
                        icon="shield-alt"
                        title="Gestão de Riscos"
                        description={
                            "Registre, classifique e acompanhe " +
                            "ocorrências de risco."
                        }
                    />

                    <FeatureCard
                        icon="clipboard-list"
                        title="Potencialidades"
                        description={
                            "Documente oportunidades de melhoria " +
                            "e boas práticas."
                        }
                    />

                    <FeatureCard
                        icon="chart-bar"
                        title="Indicadores"
                        description={
                            "Monitore métricas e acompanhe " +
                            "a evolução dos dados."
                        }
                        fullWidth
                    />*/}

                </View>

            </View>

        </ScrollView>
    );
}


const styles = StyleSheet.create({

    /*
    |--------------------------------------------------------------------------
    | CONTAINER PRINCIPAL
    |--------------------------------------------------------------------------
    */

    HomeCon: {
        flex: 1,

        backgroundColor: "#f7f8f7",
    },


    scrollContent: {
        flexGrow: 1,

        backgroundColor: "#f7f8f7",
    },


    /*
    |--------------------------------------------------------------------------
    | HERO
    |--------------------------------------------------------------------------
    */

    HomeContainer: {
        width: "100%",

        minHeight: 700,

        paddingHorizontal: 24,

        paddingVertical: 55,

        alignItems: "stretch",

        justifyContent: "center",

        gap: 45,
    },


    HomeContainerTablet: {
        paddingHorizontal: 55,

        paddingVertical: 70,

        gap: 55,
    },


    HomeContainerDesktop: {
        minHeight: 700,

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "space-between",

        paddingHorizontal: "8%",

        paddingVertical: 70,

        gap: 60,
    },


    /*
    |--------------------------------------------------------------------------
    | LEFT
    |--------------------------------------------------------------------------
    */

    Left: {
        width: "100%",

        alignItems: "flex-start",

        justifyContent: "center",

        gap: 22,
    },


    LeftDesktop: {
        width: "50%",

        maxWidth: 700,
    },


    /*
    |--------------------------------------------------------------------------
    | BADGE
    |--------------------------------------------------------------------------
    */

    Badge: {
        alignSelf: "flex-start",

        paddingHorizontal: 16,

        paddingVertical: 8,

        borderRadius: 50,

        backgroundColor:
            "rgba(60, 106, 72, 0.10)",

        borderWidth: 1,

        borderColor:
            "rgba(60, 106, 72, 0.15)",
    },


    BadgeText: {
        color: "#3c6a48",

        fontSize: 14,

        fontWeight: "600",

        letterSpacing: 0.1,
    },


    /*
    |--------------------------------------------------------------------------
    | TÍTULO
    |--------------------------------------------------------------------------
    */

    Title: {
        width: "100%",

        color: "#333333",

        fontSize: 36,

        lineHeight: 44,

        fontWeight: "700",

        letterSpacing: -0.5,
    },


    TitleTablet: {
        fontSize: 43,

        lineHeight: 52,
    },


    TitleDesktop: {
        fontSize: 56,

        lineHeight: 64,

        letterSpacing: -1,
    },


    TitleHighlight: {
        color: "#3c6a48",
    },


    /*
    |--------------------------------------------------------------------------
    | DESCRIÇÃO
    |--------------------------------------------------------------------------
    */

    Description: {
        width: "100%",

        color: "#666666",

        fontSize: 16,

        lineHeight: 27,

        fontWeight: "400",
    },


    DescriptionDesktop: {
        maxWidth: 650,

        fontSize: 17,

        lineHeight: 30,
    },


    /*
    |--------------------------------------------------------------------------
    | BOTÕES
    |--------------------------------------------------------------------------
    */

    Buttons: {
        flexDirection: "row",

        flexWrap: "wrap",

        alignItems: "center",

        gap: 16,

        marginTop: 10,
    },


    /*
    |--------------------------------------------------------------------------
    | BOTÃO PRIMÁRIO
    |--------------------------------------------------------------------------
    */

    Primary: {
        minHeight: 52,

        paddingHorizontal: 30,

        paddingVertical: 14,

        borderRadius: 12,

        alignItems: "center",

        justifyContent: "center",

        backgroundColor: "#3c6a48",

        borderWidth: 2,

        borderColor: "#3c6a48",

        elevation: 5,

        shadowColor: "#3c6a48",

        shadowOffset: {
            width: 0,

            height: 8,
        },

        shadowOpacity: 0.25,

        shadowRadius: 15,
    },


    PrimaryPressed: {
        backgroundColor: "#2f573a",

        borderColor: "#2f573a",

        transform: [
            {
                translateY: 2,
            },
        ],

        elevation: 2,
    },


    PrimaryText: {
        color: "#ffffff",

        fontSize: 16,

        fontWeight: "600",
    },


    /*
    |--------------------------------------------------------------------------
    | BOTÃO SECUNDÁRIO
    |--------------------------------------------------------------------------
    */

    Secondary: {
        minHeight: 52,

        paddingHorizontal: 30,

        paddingVertical: 14,

        borderRadius: 12,

        alignItems: "center",

        justifyContent: "center",

        backgroundColor: "#ffffff",

        borderWidth: 2,

        borderColor: "#3c6a48",
    },


    SecondaryPressed: {
        backgroundColor: "#3c6a48",

        transform: [
            {
                translateY: 2,
            },
        ],
    },


    SecondaryText: {
        color: "#3c6a48",

        fontSize: 16,

        fontWeight: "600",
    },


    SecondaryTextPressed: {
        color: "#ffffff",
    },


    /*
    |--------------------------------------------------------------------------
    | RIGHT
    |--------------------------------------------------------------------------
    */

    Right: {
        width: "100%",

        gap: 22,
    },


    RightDesktop: {
        width: "45%",

        maxWidth: 620,

        gap: 22,
    },


    /*
    |--------------------------------------------------------------------------
    | CARDS
    |--------------------------------------------------------------------------
    */

    CardRow: {
        width: "100%",

        flexDirection: "row",

        gap: 22,
    },


    CardColumn: {
        flexDirection: "column",

        gap: 22,
    },


    Card: {
        flex: 1,

        minHeight: 190,

        padding: 30,

        borderRadius: 18,

        backgroundColor: "#ffffff",

        borderWidth: 1,

        borderColor:
            "rgba(102, 102, 102, 0.10)",

        elevation: 4,

        shadowColor: "#000000",

        shadowOffset: {
            width: 0,

            height: 8,
        },

        shadowOpacity: 0.07,

        shadowRadius: 18,
    },


    CardDesktop: {
        minHeight: 200,
    },


    CardPressed: {
        transform: [
            {
                translateY: 3,
            },
        ],

        borderColor:
            "rgba(60, 106, 72, 0.18)",

        elevation: 2,

        shadowOpacity: 0.04,
    },


    /*
    |--------------------------------------------------------------------------
    | ÍCONE DO CARD
    |--------------------------------------------------------------------------
    */

    CardIconContainer: {
        width: 54,

        height: 54,

        borderRadius: 14,

        alignItems: "center",

        justifyContent: "center",

        marginBottom: 18,

        backgroundColor:
            "rgba(60, 106, 72, 0.08)",
    },


    /*
    |--------------------------------------------------------------------------
    | CONTEÚDO DO CARD
    |--------------------------------------------------------------------------
    */

    CardContent: {
        flex: 1,
    },


    CardTitle: {
        color: "#333333",

        fontSize: 20,

        lineHeight: 25,

        fontWeight: "700",

        marginBottom: 10,
    },


    CardDescription: {
        color: "#666666",

        fontSize: 15,

        lineHeight: 25,

        fontWeight: "400",
    },


    /*
    |--------------------------------------------------------------------------
    | INTERSECT
    |--------------------------------------------------------------------------
    */

    IntersectContainer: {
        width: "100%",

        backgroundColor: "#f7f8f7",
    },

});