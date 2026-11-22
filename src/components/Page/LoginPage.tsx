import { useState } from "react";

import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    useWindowDimensions,
    View,
} from "react-native";

import { router } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { FontAwesome5 } from "@expo/vector-icons";


import RegisterModal from "../RegisterUser/RegisterUser";

const INITIAL_FORM = {
    cpf: "",
    password: "",
};

export default function LoginPage({
    userAuth,
    setUserAuth,
}: any) {
    //const router = useRouter();

    const { width, height } =
        useWindowDimensions();

    const isSmallScreen = width <= 700;
    const isVerySmallScreen = width <= 380;

    const [showRegisterModal, setShowRegisterModal] =
        useState(false);

    const [form, setForm] =
        useState(INITIAL_FORM);

    const [errors, setErrors] = useState<{
        cpf?: string;
        password?: string;
    }>({});

    const [loading, setLoading] =
        useState(false);

    function handleChange(
        name: "cpf" | "password",
        value: string
    ) {
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    }

    function validate() {
        const newErrors: {
            cpf?: string;
            password?: string;
        } = {};

        if (!form.cpf.trim()) {
            newErrors.cpf =
                "Informe o CPF.";
        }

        if (!form.password.trim()) {
            newErrors.password =
                "Informe a senha.";
        }

        setErrors(newErrors);

        return (
            Object.keys(newErrors)
                .length === 0
        );
    }

    async function submit() {
        if (!validate()) {
            return;
        }

        try {
            setLoading(true);

            const BACK_ROUTE = process.env.EXPO_PUBLIC_BACK_ROUTE;
            if (!BACK_ROUTE) {
                throw new Error("A variável EXPO_PUBLIC_BACK_ROUTE não está configurada.");
            }

            const response = await fetch(
                `${BACK_ROUTE}/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        cpf: form.cpf,
                        password: form.password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Erro ao realizar login."
                );
            }

            await AsyncStorage.setItem(
                "token",
                data.access_token
            );

            await AsyncStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );
            if (setUserAuth) {
                setUserAuth({});
            }
            Alert.alert("Sucesso","Login realizado com sucesso!",
                [{text: "OK"/*,onPress: () => {router.replace("/");}*/,},]
            );
            router.replace("/");
        } catch (err: any) {
            Alert.alert("Erro",err?.message || "Erro ao realizar login.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView
            style={styles.loginPageContainer}
            behavior={
                Platform.OS === "ios"
                    ? "padding"
                    : undefined
            }
        >
            <ScrollView
                contentContainerStyle={[
                    styles.scrollContent,

                    isSmallScreen &&
                    styles.scrollContentSmall,

                    isVerySmallScreen &&
                    styles.scrollContentVerySmall,
                ]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View
                    style={[
                        styles.mainContent,

                        isSmallScreen &&
                        styles.mainContentSmall,

                        isVerySmallScreen &&
                        styles.mainContentVerySmall,
                    ]}
                >
                    {/* =========================
                        LOGO
                    ========================== */}

                    <View
                        style={[
                            styles.sideContent,

                            isSmallScreen &&
                            styles.sideContentSmall,

                            isVerySmallScreen &&
                            styles.sideContentVerySmall,
                        ]}
                    >
                        <Image
                            source={require(
                                "../../../assets/SECRETARIA SAÚDE__HORIZONTAL SEC SAÚDE_HORIZONTAL_ MONOCROM_BRANCO.png"
                            )}
                            style={[
                                styles.logo,

                                isSmallScreen &&
                                styles.logoSmall,

                                isVerySmallScreen &&
                                styles.logoVerySmall,
                            ]}
                            resizeMode="contain"
                        />
                    </View>

                    {/* =========================
                        FORMULÁRIO
                    ========================== */}

                    <View
                        style={[
                            styles.mainForm,

                            isSmallScreen &&
                            styles.mainFormSmall,

                            isVerySmallScreen &&
                            styles.mainFormVerySmall,
                        ]}
                    >
                        <Text
                            style={[styles.title,
                            isSmallScreen && styles.titleSmall,
                            ]}
                        >Login</Text>

                        {/* CPF */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>CPF</Text>
                            <View style={[styles.inputWrapper,
                            errors.cpf && styles.inputWrapperError,
                            ]}>
                                
                                <FontAwesome5
                                    name="user"
                                    size={isVerySmallScreen ? 15 : 17}
                                    color="#3c6a48"
                                    style={styles.inputIcon}
                                />

                                <TextInput
                                    style={styles.input}
                                    value={form.cpf}
                                    onChangeText={(value) => handleChange("cpf", value)}
                                    placeholder="Digite seu CPF"
                                    placeholderTextColor="#999999"
                                    keyboardType="numeric"
                                    autoCapitalize="none"
                                    editable={!loading}
                                />
                            </View>

                            {//errors.cpf 
                            typeof errors.cpf === "string" && errors.cpf.length > 2 && (
                                <Text style={styles.errorText}>
                                    {errors.cpf}
                                </Text>
                            )}
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Senha</Text>
                            <View
                                style={[styles.inputWrapper,
                                errors.password && styles.inputWrapperError,
                                ]}>
                                <FontAwesome5
                                    name="lock"
                                    size={isVerySmallScreen ? 15 : 17}
                                    color="#3c6a48"
                                    style={styles.inputIcon}
                                />

                                <TextInput
                                    style={styles.input}
                                    value={form.password}
                                    onChangeText={(value) =>handleChange("password",value)
                                    }
                                    placeholder="Digite sua senha"
                                    placeholderTextColor="#999999"
                                    secureTextEntry
                                    autoCapitalize="none"
                                    editable={
                                        !loading
                                    }
                                />
                            </View>

                            {typeof errors.password === "string" && errors.password.length > 2 && (
                                <Text style={styles.errorText}>
                                    {errors.password}
                                </Text>
                            )}
                        </View>

                        {/* BOTÃO */}

                        <Pressable
                            style={({ pressed }) => [
                                styles.button,

                                loading &&
                                styles.buttonDisabled,

                                pressed &&
                                !loading &&
                                styles.buttonPressed,
                            ]}
                            onPress={submit}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <ActivityIndicator size="small" color="#ffffff"/>
                                    <Text style={styles.buttonText}>Entrando...</Text>
                                </>
                            ) : (
                                <Text style={styles.buttonText}>Entrar</Text>)}
                        </Pressable>

                        {/* CADASTRO */}

                        <Pressable
                            onPress={() =>setShowRegisterModal(true)}
                            disabled={loading}
                            style={styles.registerButton}
                        >
                            <Text style={styles.cad}>
                                Cadastro
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>

            {/* MODAL */}

            {showRegisterModal && (
                <RegisterModal
                    onClose={() =>
                        setShowRegisterModal(
                            false
                        )
                    }
                />
            )}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    loginPageContainer: {
        flex: 1,

        backgroundColor: "#f3f7f4",
    },

    /*
    ========================================
    SCROLL
    ========================================
    */

    scrollContent: {
        flexGrow: 1,

        justifyContent: "center",

        alignItems: "center",

        padding: 30,
    },

    scrollContentSmall: {
        padding: 16,

        justifyContent: "center",
    },

    scrollContentVerySmall: {
        padding: 10,
    },

    /*
    ========================================
    CONTAINER PRINCIPAL
    ========================================
    */

    mainContent: {
        width: "100%",

        maxWidth: 900,

        minHeight: 550,

        flexDirection: "row",

        borderRadius: 18,

        overflow: "hidden",

        backgroundColor: "#ffffff",

        borderWidth: 1,

        borderColor:
            "rgba(102, 102, 102, 0.10)",

        shadowColor: "#000000",

        shadowOffset: {
            width: 0,

            height: 18,
        },

        shadowOpacity: 0.12,

        shadowRadius: 22,

        elevation: 10,
    },

    /*
    ========================================
    CONTAINER MOBILE
    ========================================
    */

    mainContentSmall: {
        width: "100%",

        maxWidth: 430,

        minHeight: 0,

        flexDirection: "column",

        borderRadius: 16,
    },

    mainContentVerySmall: {
        maxWidth: 360,

        borderRadius: 12,
    },

    /*
    ========================================
    LADO VERDE
    ========================================
    */

    sideContent: {
        flex: 1,

        minHeight: 550,

        backgroundColor: "#3c6a48",

        justifyContent: "center",

        alignItems: "center",

        padding: 40,
    },

    /*
    MOBILE
    */

    sideContentSmall: {
        flex: 0,

        width: "100%",

        minHeight: 150,

        height: 180,

        padding: 25,
    },

    sideContentVerySmall: {
        minHeight: 120,

        height: 140,

        padding: 18,
    },

    /*
    ========================================
    LOGO
    ========================================
    */

    logo: {
        width: "100%",

        height: "100%",

        maxWidth: 350,

        maxHeight: 250,
    },

    logoSmall: {
        width: "85%",

        height: 120,

        maxWidth: 300,

        maxHeight: 120,
    },

    logoVerySmall: {
        width: "90%",

        height: 90,

        maxWidth: 260,

        maxHeight: 90,
    },

    /*
    ========================================
    FORMULÁRIO
    ========================================
    */

    mainForm: {
        width: 380,

        minHeight: 550,

        padding: 50,

        justifyContent: "center",

        backgroundColor: "#ffffff",

        gap: 20,
    },

    /*
    MOBILE
    */

    mainFormSmall: {
        width: "100%",

        minHeight: 0,

        padding: 28,

        gap: 16,
    },

    mainFormVerySmall: {
        padding: 20,

        gap: 14,
    },

    /*
    ========================================
    TÍTULO
    ========================================
    */

    title: {
        marginBottom: 5,

        textAlign: "center",

        color: "#3c6a48",

        fontSize: 28,

        fontWeight: "700",
    },

    titleSmall: {
        fontSize: 24,

        marginBottom: 2,
    },

    /*
    ========================================
    INPUT
    ========================================
    */

    inputGroup: {
        width: "100%",
    },

    label: {
        color: "#3c6a48",

        fontSize: 14,

        fontWeight: "600",

        marginBottom: 7,
    },

    inputWrapper: {
        width: "100%",

        height: 45,

        flexDirection: "row",

        alignItems: "center",

        backgroundColor: "#ffffff",

        borderWidth: 1,

        borderColor: "#d5ddd7",

        borderRadius: 8,

        paddingHorizontal: 12,
    },

    inputWrapperError: {
        borderColor: "#d33",
    },

    inputIcon: {
        marginRight: 10,
    },

    input: {
        flex: 1,

        height: "100%",

        color: "#333333",

        fontSize: 15,

        paddingVertical: 0,
    },

    errorText: {
        color: "#d33",

        fontSize: 12,

        marginTop: 5,
    },

    /*
    ========================================
    BOTÃO
    ========================================
    */

    button: {
        width: "100%",

        height: 45,

        borderRadius: 8,

        backgroundColor: "#3c6a48",

        alignItems: "center",

        justifyContent: "center",

        flexDirection: "row",

        gap: 10,

        marginTop: 2,
    },

    buttonPressed: {
        backgroundColor: "#2f573a",

        transform: [
            {
                translateY: 2,
            },
        ],

        elevation: 4,
    },

    buttonDisabled: {
        opacity: 0.7,
    },

    buttonText: {
        color: "#ffffff",

        fontSize: 16,

        fontWeight: "700",
    },

    /*
    ========================================
    CADASTRO
    ========================================
    */

    registerButton: {
        alignItems: "center",

        justifyContent: "center",

        paddingVertical: 5,

        minHeight: 30,
    },

    cad: {
        color: "#3c6a48",

        fontSize: 15,

        fontWeight: "500",
    },
});