import { useEffect, useState } from "react";

import {
    ActivityIndicator,
    Alert,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { AntDesign, EvilIcons } from "@expo/vector-icons";
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import CpfInput from "../CpfInput/CPFInput";
import SelectInput from "../SelectInput/SelectInput";
import TxtInput from "../TXTInput/TxtInput";

///import TxtInput from "../../Component/TxtInput/TxtInput";
//import SelectInput from "../../Component/SelectInput/SelectInput";
//import CpfInput from "../../Component/CpfInput/CpfInput";

import apiFetch from "../FetchFunc/APIFetch";


const INITIAL_FORM = {
    name: "",
    cpf: "",
    email: "",
    password: "",
    ubsId: "",
    role: "1",
    active: true,
};


export default function UserForm({
    user,
    onClose,
    onSuccess,
    setRe,
}:any) {

    const [form, setForm] = useState<any>(INITIAL_FORM);

    const [ubsList, setUbsList] = useState<any>([]);

    const [loading, setLoading] = useState<any>(false);

    const [errors, setErrors] = useState<any>({});


    const editing = Boolean(user);


    /*
    |--------------------------------------------------------------------------
    | CARREGAR UBS
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        void loadUBS();
    }, []);


    /*
    |--------------------------------------------------------------------------
    | PREENCHER FORMULÁRIO AO EDITAR
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (!user) {
            setForm(INITIAL_FORM);
            setErrors({});
            return;
        }


        const roleId = user.roles?.[0]?.id;


        setForm({
            name: user.name ?? "",

            cpf: user.cpf ?? "",

            email: user.email ?? "",

            password: "",

            ubsId: user.ubs?.id
                ? String(user.ubs.id)
                : "",

            role: roleId
                ? String(roleId)
                : "1",

            active: Boolean(user.active),
        });


        setErrors({});

    }, [user]);


    /*
    |--------------------------------------------------------------------------
    | CARREGAR UBS
    |--------------------------------------------------------------------------
    */

    async function loadUBS() {

        try {

            const response = await apiFetch(
                `${process.env.REACT_APP_BACK_ROUTE}/ubs`
            );


            const data = await response.json();


            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Erro ao carregar UBS."
                );
            }


            setUbsList(data);

        } catch (error:any) {

            console.error(
                "Erro ao carregar UBS:",
                error
            );


            Alert.alert(
                "Erro",
                error.message ||
                "Erro ao carregar UBS."
            );
        }
    }
    function handleChange(name:any, value:any) {
        setForm((prev:any) => ({
            ...prev,
            [name]: value,
        }));
        setErrors((prev:any) => ({
            ...prev,
            [name]: "",
        }));
    }
    function validate() {
        const newErrors:any = {};
        const cpf = form.cpf.replace(/\D/g, "");
        if (!form.name.trim()) {
            newErrors.name = "Campo obrigatório";
        }
        if (!cpf) {
            newErrors.cpf = "Campo obrigatório";
        } else if (cpf.length !== 11) {
            newErrors.cpf = "CPF inválido";
        }
        if (!form.email.trim()) {
            newErrors.email = "Campo obrigatório";
        } else if (//!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
            /^\S+@\S+\.\S+$/.test(form.email)) {
            newErrors.email ="E-mail inválido";
        }
        if (!editing &&!form.password.trim()) {
            newErrors.password = "Campo obrigatório";
        } else if (form.password && form.password.length < 6) {
            newErrors.password = "A senha deve possuir no mínimo 6 caracteres";
        }
        if (!form.ubsId) {
            newErrors.ubsId = "Campo obrigatório";
        }
        if (!form.role) {
            newErrors.role = "Campo obrigatório";
        }
        setErrors(newErrors);
        return (Object.keys(newErrors).length === 0);
    }
    async function submit() {
        if (!validate()) {
            return;
        }
        try {
            setLoading(true);
            const payload:any = {
                name: form.name.trim(),
                cpf: form.cpf.replace(/\D/g, ""),
                email: form.email.trim(),
                ubsId: Number(form.ubsId),
                active: form.active,
                roles: [Number(form.role),],
            };
            if (form.password.trim()) {
                payload.password = form.password;
            }
            console.log("Payload enviado:",payload);
            const url = editing
                ? `${process.env.REACT_APP_BACK_ROUTE}/users/${user.id}`
                : `${process.env.REACT_APP_BACK_ROUTE}/users`;
            const response = await apiFetch(
                url,
                {
                    method: editing ? "PUT" : "POST",
                    headers: {"Content-Type":"application/json",},
                    body: JSON.stringify(payload),
                }
            );
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Erro ao salvar usuário.");
            }
            Alert.alert("Sucesso",editing ? "Usuário atualizado!" : "Usuário cadastrado!");
            setRe?.({});
            onSuccess?.();
            setForm(INITIAL_FORM);
            setErrors({});
        } catch (error:any) {
            console.error("Erro ao salvar usuário:",error);
            Alert.alert("Erro",error.message || "Ocorreu um erro ao salvar o usuário.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal
            visible={true}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >

            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <Text style={styles.title}>
                        {editing
                            ? "Editar Usuário"
                            : "Novo Usuário"}
                    </Text>
                    <Pressable
                        onPress={onClose}
                        style={styles.closeButton}
                        disabled={loading}
                    >
                        <Text style={styles.closeText}>
                            ×
                        </Text>
                    </Pressable>
                    <View style={styles.form}>
                        <TxtInput
                            id="name"
                            label="Nome"
                            value={form.name}
                            onChangeText={(value:any) =>
                                handleChange("name",value)
                            }
                            logo={
                                <FontAwesome name="user" size={24} color="black" />
                            }
                            error={errors.name}
                        />
                        <CpfInput
                            id="cpf"
                            label="CPF"
                            value={form.cpf}
                            onChange={(value:any) =>
                                handleChange(
                                    "cpf",
                                    value
                                )
                            }
                            error={errors.cpf}
                        />
                        <TxtInput
                            id="email"
                            label="Email"
                            value={form.email}
                            onChangeText={(value:any) =>
                                handleChange(
                                    "email",
                                    value
                                )
                            }
                            keyboardType="email-address"
                            autoCapitalize="none"
                            logo={
                                <EvilIcons name="envelope" size={24} color="black" />
                            }
                            error={errors.email}
                        />
                        <TxtInput
                            id="password"
                            label={
                                editing
                                    ? "Nova senha (opcional)"
                                    : "Senha"
                            }
                            value={form.password}
                            onChangeText={(value:any) =>
                                handleChange(
                                    "password",
                                    value
                                )
                            }
                            secureTextEntry
                            logo={
                                <AntDesign name="lock" size={24} color="black" />
                            }
                            error={errors.password}
                        />


                        {/* UBS */}

                        <SelectInput
                            id="ubsId"
                            label="UBS"
                            value={form.ubsId}
                            onChange={(value:any) =>
                                handleChange(
                                    "ubsId",
                                    value
                                )
                            }
                            logo={
                               <FontAwesome5 name="hospital" size={24} color="black" />
                            }
                            options={ubsList.map(
                                (ubs:any) => ({
                                    value:
                                        String(
                                            ubs.id
                                        ),

                                    label:
                                        ubs.nome,
                                })
                            )}
                            error={errors.ubsId}
                        />


                        {/* PERFIL */}

                        <SelectInput
                            id="role"
                            label="Perfil"
                            value={form.role}
                            onChange={(value:any) =>
                                handleChange(
                                    "role",
                                    value
                                )
                            }
                            logo={
                                <Feather name="shield" size={24} color="black" />
                            }
                            options={[
                                {
                                    value: "1",
                                    label: "Usuário",
                                },
                                {
                                    value: "2",
                                    label: "Administrador",
                                },
                            ]}
                            error={errors.role}
                        />
                        <SelectInput
                            id="active"
                            label="Status"
                            value={String(
                                form.active
                            )}
                            onChange={(value:any) => {

                                handleChange(
                                    "active",
                                    value === "true"
                                );

                            }}
                            options={[
                                {
                                    value: "true",
                                    label: "Ativo",
                                },
                                {
                                    value: "false",
                                    label: "Inativo",
                                },
                            ]}
                        />
                        <View style={styles.buttons}>

                            <Pressable
                                onPress={submit}
                                disabled={loading}
                                style={[
                                    styles.submitButton,

                                    loading &&
                                        styles.submitDisabled,
                                ]}
                            >

                                {loading ? (

                                    <ActivityIndicator
                                        color="#ffffff"
                                        size="small"
                                    />

                                ) : (

                                    <Text
                                        style={
                                            styles.submitText
                                        }
                                    >
                                        {editing
                                            ? "Atualizar"
                                            : "Cadastrar"}
                                    </Text>
                                )}

                            </Pressable>

                        </View>

                    </View>

                </View>

            </View>

        </Modal>
    );
}
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor:
            "rgba(0, 0, 0, 0.45)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modal: {
        width: "100%",
        maxWidth: 500,
        maxHeight: "90%",
        backgroundColor: "#ffffff",
        borderRadius: 10,
        padding: 20,
        position: "relative",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        color: "#333333",
        textAlign: "center",
        marginBottom: 20,
    },
    closeButton: {
        position: "absolute",
        right: 10,
        top: 5,
        width: 42,
        height: 42,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
    },
    closeText: {
        fontSize: 38,
        lineHeight: 40,
        color: "#222222",
        fontWeight: "300",
    },
    form: {
        width: "100%",
        gap: 8,
    },
    buttons: {
        width: "100%",
        alignItems: "flex-end",
        marginTop: 10,
    },
    submitButton: {
        minWidth: 120,
        height: 44,
        paddingHorizontal: 18,
        borderRadius: 6,
        backgroundColor: "#3c6a48",
        alignItems: "center",
        justifyContent: "center",
    },
    submitDisabled: {
        opacity: 0.6,
    },
    submitText: {
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "600",
    },
})