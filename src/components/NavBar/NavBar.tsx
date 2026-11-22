import { useEffect, useState } from "react";

import {
    Pressable,
    StyleSheet,
    Text,
    View,
    useWindowDimensions,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { FontAwesome5 } from "@expo/vector-icons";

import { usePathname, useRouter } from "expo-router";

export default function NavBar({
    userAuth,
    setUserAuth,
}: any) {
    const router: any = useRouter();
    const pathname = usePathname();

    const { width } = useWindowDimensions();

    const isSmallScreen = width < 600;

    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        loadUser();
    }, [userAuth]);

    async function loadUser() {
        try {
            const data = await AsyncStorage.getItem("user");

            if (data && data !== "null") {
                const obj = JSON.parse(data);
                setUser(obj);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error(
                "Erro ao carregar usuário:",
                error
            );

            setUser(null);
        }
    }

    async function logOut() {
        try {
            await AsyncStorage.multiRemove([
                "token",
                "user",
            ]);

            setUser(null);

            if (setUserAuth) {
                setUserAuth(false);
            }

            // Redireciona para a tela de Login
            router.replace("/Login");
        } catch (error) {
            console.error(
                "Erro ao sair:",
                error
            );
        }
    }

    function navigateTo(screen: string) {
        switch (screen) {
            case "Home":
                router.push("/");
                break;

            case "Login":
                router.push("/Login");
                break;

            case "FormularioU":
                router.push("/FormularioU");
                break;

            case "UserList":
                router.push("/UserList");
                break;

            case "FormularioA":
                router.push("/FormularioA");
                break;

            case "Dashboard":
                router.push("/Dashboard");
                break;

            case "Map":
                router.push("/map");
                break;

            default:
                console.warn(
                    `Rota "${screen}" não encontrada.`
                );
        }
    }

    function isActive(screen: string) {
        switch (screen) {
            case "Home":
                return pathname === "/";

            case "Login":
                return pathname === "/Login";

            case "FormularioU":
                return pathname === "/FormularioU";

            case "UserList":
                return pathname === "/UserList";

            case "FormularioA":
                return pathname === "/FormularioA";

            case "Dashboard":
                return pathname === "/Dashboard";

            case "Map":
                return pathname === "/map";

            default:
                return false;
        }
    }

    return (
        <View
            style={[
                styles.navCon,
                isSmallScreen && styles.navConSmall,
            ]}
        >
            {/* LOGO / HOME */}
            <Pressable
                style={[
                    styles.imgCon,
                    isSmallScreen && styles.imgConSmall,
                ]}
                onPress={() => navigateTo("Home")}
            >
                <Text style={styles.titleMain}>
                    SIGOPA
                </Text>
            </Pressable>

            {/* Tudo abaixo fica oculto em telas pequenas */}
            {true && (
                <>
                    {/* LOGIN */}
                    {!user && (
                        <NavItem
                            icon="user"
                            text={(!isSmallScreen) ? "Login" : ""}
                            active={isActive("Login")}
                            onPress={() =>
                                navigateTo("Login")
                            }
                        />
                    )}

                    {/* USUÁRIO */}
                    {user?.name &&
                        user?.roles?.[0] === "user" && (
                            <NavItem
                                icon="wpforms"
                                text={(!isSmallScreen) ? "Formulário" : ""}
                                active={isActive(
                                    "FormularioU"
                                )}
                                onPress={() =>
                                    navigateTo(
                                        "FormularioU"
                                    )
                                }
                            />
                        )}

                    {/* ADMIN - USUÁRIOS */}
                    {user?.name &&
                        user?.roles?.[0] === "admin" && (
                            <NavItem
                                icon="user"
                                text={(!isSmallScreen) ? "Usuários" : ""}
                                active={isActive(
                                    "UserList"
                                )}
                                onPress={() =>
                                    navigateTo(
                                        "UserList"
                                    )
                                }
                            />
                        )}

                    {/* ADMIN - FORMULÁRIO */}
                    {user?.name &&
                        user?.roles?.[0] === "admin" && (
                            <NavItem
                                icon="wpforms"
                                text={(!isSmallScreen) ? "Formulario" : ""}
                                active={isActive(
                                    "FormularioA"
                                )}
                                onPress={() =>
                                    navigateTo(
                                        "FormularioA"
                                    )
                                }
                            />
                        )}

                
                    {user?.name &&
                        user?.roles?.[0] === "admin" && (
                            <NavItem
                                icon="wpforms"
                                text={(!isSmallScreen) ? "Dashboard" : ""}
                                active={isActive(
                                    "Dashboard"
                                )}
                                onPress={() =>
                                    navigateTo(
                                        "Dashboard"
                                    )
                                }
                            />
                        )}
                    <View style={styles.spacer} />
                    {/* USUÁRIO LOGADO GraphsPage*/}
                    {user?.name && (
                        <>
                        {!isSmallScreen &&
                            <View style={styles.userInfo}>
                                <FontAwesome5
                                    name="user"
                                    size={16}
                                    color="#ffffff"
                                />
                                <Text style={styles.userName} numberOfLines={1}>
                                    {user.name}
                                </Text>
                            </View>}

                            <Pressable
                                style={({
                                    pressed,
                                }) => [
                                        styles.logout,
                                        pressed &&
                                        styles.logoutPressed,
                                    ]}
                                onPress={logOut}
                            >
                                <FontAwesome5
                                    name="sign-out-alt"
                                    size={17}
                                    color="#ffffff"
                                />
                            </Pressable>
                        </>
                    )}
                </>
            )}
        </View>
    );
}

function NavItem({
    icon,
    text,
    active,
    onPress,
}: any) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.link,

                active &&
                styles.active,

                pressed &&
                styles.linkPressed,
            ]}
        >
            <FontAwesome5
                name={icon}
                size={17}
                color={
                    active
                        ? "#ffffff"
                        : "rgba(255,255,255,0.75)"
                }
            />

            <Text
                style={[
                    styles.linkText,

                    active &&
                    styles.linkTextActive,
                ]}
            >
                {text}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    titleMain: {
        color: "#ffffff",

        textTransform: "uppercase",

        fontWeight: "bold",

        fontSize: 18,
    },

    navCon: {
        width: "100%",

        minHeight: 72,

        backgroundColor: "#3c6a48",

        flexDirection: "row",

        alignItems: "center",

        paddingHorizontal: 24,

        paddingVertical: 6,

        gap: 8,

        elevation: 5,

        shadowColor: "#000",

        shadowOffset: {
            width: 0,
            height: 4,
        },

        shadowOpacity: 0.18,

        shadowRadius: 8,
    },

    /*
     * Navbar para telas pequenas
     */
    navConSmall: {
        minHeight: 58,

        height: 58,

        paddingHorizontal: 0,

        paddingVertical: 0,

        justifyContent: "center",
    },

    imgCon: {
        height: 62,

        paddingHorizontal: 12,

        alignItems: "center",

        justifyContent: "center",

        flexShrink: 0,
    },

    /*
     * Logo centralizado no celular
     */
    imgConSmall: {
        height: 58,

        paddingHorizontal: 20,

        justifyContent: "center",

        alignItems: "center",
    },

    link: {
        minHeight: 42,

        paddingHorizontal: 14,

        paddingVertical: 8,

        borderRadius: 8,

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "center",

        gap: 8,
    },

    linkPressed: {
        backgroundColor:
            "rgba(255,255,255,0.10)",
    },

    linkText: {
        color:
            "rgba(255,255,255,0.82)",

        fontSize: 14,

        fontWeight: "500",
    },

    linkTextActive: {
        color: "#ffffff",

        fontWeight: "700",
    },

    active: {
        backgroundColor:
            "rgba(255,255,255,0.16)",
    },

    spacer: {
        flex: 1,
    },

    userInfo: {
        minHeight: 40,

        maxWidth: 180,

        paddingHorizontal: 13,

        paddingVertical: 8,

        borderRadius: 20,

        flexDirection: "row",

        alignItems: "center",

        gap: 8,

        backgroundColor:
            "rgba(255,255,255,0.10)",

        borderWidth: 1,

        borderColor:
            "rgba(255,255,255,0.14)",
    },

    userName: {
        color: "#ffffff",

        fontSize: 13,

        fontWeight: "500",

        flexShrink: 1,
    },

    logout: {
        width: 40,

        height: 40,

        marginLeft: 4,

        borderRadius: 20,

        borderWidth: 1,

        borderColor:
            "rgba(255,255,255,0.15)",

        backgroundColor:
            "rgba(255,255,255,0.10)",

        alignItems: "center",

        justifyContent: "center",
    },

    logoutPressed: {
        backgroundColor: "#ffffff",
    },
});