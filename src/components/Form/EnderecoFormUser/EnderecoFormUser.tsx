import {
    useEffect,
    useState,
} from "react";

import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import {
    FontAwesome,
} from "@expo/vector-icons";

import TxtInput from "@/components/TXTInput/TxtInput";
import MapInput from "../../MapInput/MapInput";
import SelectInput from "../../SelectInput/SelectInput";

import ErrMsg from "@/components/Alerts/ErrMsg";
import apiFetch from "@/components/FetchFunc/APIFetch";
import AsyncStorage from "@react-native-async-storage/async-storage";

import OKMsg from "@/components/Alerts/OKMsg2";

const INITIAL_FORM = {
    id: null as number | null,

    place: null as any,

    logradouro: "",

    numero: "",

    latitude: null as number | null,

    longitude: null as number | null,

    ubs: "",

    microAreaId: "",
};

const BACK_ROUTE = process.env.EXPO_PUBLIC_BACK_ROUTE;
interface EnderecoFormUserProps {
    obj?: any;

    onSuccess?: () => void;

    onCancel?: () => void;
}


export default function EnderecoFormUser({
    obj,
    onSuccess,
    onCancel,
}: EnderecoFormUserProps) {
    const [form, setForm] = useState(INITIAL_FORM);
    const [loading, setLoading] = useState(false);
    const [ubsList, setUbsList] = useState<any[]>([]);
    const [microAreaList, setMicroAreaList] = useState<any[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [isCommonUser, setIsCommonUser] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        void  initialize()//.catch(error => reportError(error));;
    }, []);


    async function initialize() {
        try {
            const user: any = await AsyncStorage.getItem("user");
            if (!user) {
                return;
            }
            setCurrentUser(user);
            if (!user?.roles?.includes("user")) {

                await loadUBS();

                return;
            }
            setIsCommonUser(true);
            const [ubsResponse, microResponse,] = await Promise.all([
                apiFetch(
                    `${BACK_ROUTE}/users/ubs/${user.cpf}`
                ),
                apiFetch(
                    `${BACK_ROUTE}/users/microareas/${user.cpf}`
                ),

            ]);


            const ubs =
                await ubsResponse.json();


            const microAreas =
                await microResponse.json();


            setUbsList([ubs,]);
            setMicroAreaList(microAreas);
            setForm(prev => ({ ...prev, ubs: String(ubs.id), }));
        } catch (err) {

            console.error(
                "Erro ao inicializar formulário:",
                err
            );

        }

    }
    useEffect(() => {
        if (!obj) {
            setForm(INITIAL_FORM);
            setMicroAreaList([]);
            return;
        }
        setShowAdvanced(true);
        const ubsId = obj.microArea?.ubs?.id;
        setForm({
            id: obj.id,
            place: null,
            logradouro: obj.logradouro ?? "",
            numero: obj.numero ?? "",
            latitude: obj.latitude ?? null,
            longitude: obj.longitude ?? null,
            ubs: String(ubsId ?? ""),
            microAreaId: String(obj.microArea?.id ?? ""),
        });
        if (ubsId && !isCommonUser) {
            void loadMicroArea(ubsId);
        }
    }, [obj]);

    function handleChange(name: string, value: any) {
        setForm(prev => ({ ...prev, [name]: value, }));
        setErrors(prev => ({ ...prev, [name]: "", }));
        if (name === "ubs") {
            setForm(prev => ({ ...prev, microAreaId: "", }));
            void loadMicroArea(value)
            //.catch(error => reportError(error));
        }

    }
    function handleAddress(address: any) {
        if (!address) {
            return;
        }
        setForm(prev => ({
            ...prev,
            place: address,
            logradouro: address.logradouro ?? "",
            numero: address.numero ?? "",
            latitude: address.latitude ?? null,
            longitude: address.longitude ?? null,
        }));

        if (!address.logradouro || !address.numero) {
            setShowAdvanced(true);
        }
    }
    async function loadUBS() {
        try {
            const response = await apiFetch(`${BACK_ROUTE}/ubs`);
            const data = await response.json();
            setUbsList(data);
        } catch (err) {
            console.error("Erro ao carregar UBS:", err);
        }
    }
    async function loadMicroArea(ubsId: any) {
        if (!ubsId) {
            setMicroAreaList([]);
            return;
        }
        try {
            const response = await apiFetch(`${BACK_ROUTE}/micro-areas/ubs/${ubsId}`);
            const data = await response.json();
            setMicroAreaList(data);
        } catch (err) {
            console.error("Erro ao carregar Micro Áreas:", err);
        }
    }

    async function submit() {

        console.log("submitting here")
        if (!form.logradouro?.trim() || !String(form.numero ?? "").trim()
        ) {
            console.log("Selecione um endereço e informe o número.")
            void ErrMsg("Selecione um endereço e informe o número.");
            return;
        }
        if (!form.microAreaId) {
            console.log("Selecione uma Micro Área.")
            void ErrMsg("Selecione uma Micro Área.");
            return;
        }

        const body = {
            logradouro:
                form.logradouro,

            numero:
                form.numero,

            latitude:
                Number(
                    form.latitude
                ),

            longitude:
                Number(
                    form.longitude
                ),

            microAreaId:
                Number(
                    form.microAreaId
                ),

        };


        const method =
            form.id
                ? "PATCH"
                : "POST";


        const url =
            form.id

                ? `${BACK_ROUTE}/enderecos/${form.id}`

                : `${BACK_ROUTE}/enderecos`;


        try {

            setLoading(true);


            const response =
                await apiFetch(
                    url,
                    {

                        method,

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body:
                            JSON.stringify(
                                body
                            ),
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Erro na requisição"
                );

            }


            /*
            await OKMsg(

                form.id

                    ? "Endereço atualizado com sucesso!"

                    : "Endereço cadastrado com sucesso!"

            );*/


            /*
             * Limpa formulário
             */

            setForm(INITIAL_FORM);
            setMicroAreaList([]);
            setShowAdvanced(false);
            OKMsg("sucesso")
            onSuccess?.();
        } catch (error) {

            console.error(
                error
            );


            await ErrMsg("Erro ao realizar operação.");


        } finally {

            setLoading(false);
        }

    }

    function cancelEdit() {
        setForm(INITIAL_FORM);
        setMicroAreaList([]);
        setShowAdvanced(false);
        onCancel?.();
    }

    return (

        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >

            {!showAdvanced && (
                <MapInput
                    placeName={form}
                    onChange={handleAddress}
                />

            )}

            <Pressable
                style={styles.advancedButton}
                onPress={() => setShowAdvanced(prev => !prev)
                }
            >
                <Text
                    style={
                        styles.advancedButtonText
                    }
                >

                    {showAdvanced

                        ? "▲  Ocultar ajustes avançados"

                        : "▼  Ajustes avançados"

                    }

                </Text>

            </Pressable>

            {showAdvanced && (

                <View
                    style={
                        styles.advancedContainer
                    }
                >

                    <TxtInput
                        id="logradouro"

                        name="logradouro"

                        label="Logradouro"

                        value={
                            form.logradouro
                        }
                        onChangeText={(value: String) => {
                            handleChange("logradouro", value)
                        }
                        }

                        logo={
                            <FontAwesome
                                name="map-marker"
                                size={18}
                                color="#3c6a48"
                            />
                        }

                        error={
                            errors.logradouro
                        }
                    />


                    <TxtInput
                        id="numero"

                        name="numero"

                        label="Número"

                        value={
                            form.numero
                        }

                        onChangeText={(
                            value: any
                        ) =>
                            handleChange(
                                "numero",
                                value
                            )
                        }

                        logo={
                            <FontAwesome
                                name="hashtag"
                                size={18}
                                color="#3c6a48"
                            />
                        }

                        error={
                            errors.numero
                        }
                    />


                    <TxtInput
                        id="latitude"

                        name="latitude"

                        label="Latitude"

                        value={
                            form.latitude ??
                            ""
                        }

                        onChangeText={(
                            value: any
                        ) =>
                            handleChange(
                                "latitude",
                                value
                            )
                        }

                        logo={
                            <FontAwesome
                                name="map-marker"
                                size={18}
                                color="#3c6a48"
                            />
                        }
                    />


                    <TxtInput
                        id="longitude"

                        name="longitude"

                        label="Longitude"

                        value={
                            form.longitude ??
                            ""
                        }

                        onChangeText={(
                            value: any
                        ) =>
                            handleChange(
                                "longitude",
                                value
                            )
                        }

                        logo={
                            <FontAwesome
                                name="map-marker"
                                size={18}
                                color="#3c6a48"
                            />
                        }
                    />

                </View>

            )}


            <SelectInput
                id="ubs"
                name="ubs"
                label="UBS"
                value={form.ubs}
                onChange={(value: any) => handleChange("ubs", value)
                }
                logo={
                    <FontAwesome
                        name="hospital-o"
                        size={18}
                        color="#3c6a48"
                    />
                }
                disabled={isCommonUser}
                options={
                    ubsList.map(
                        ubs => ({
                            value: String(ubs.id),
                            label: ubs.nome,
                        })
                    )
                }
                error={errors.ubs}
            />

            {microAreaList.length > 0 && (

                <>
                    <SelectInput
                        id="microAreaId"
                        name="microAreaId"
                        label="Micro Área"
                        value={form.microAreaId}
                        onChange={(value: any) =>
                            handleChange("microAreaId", value)
                        }
                        logo={
                            <FontAwesome
                                name="hospital-o"
                                size={18}
                                color="#3c6a48"
                            />
                        }
                        options={microAreaList.map(
                            (micro) => ({
                                value: String(micro.id),
                                label: `${micro.codigo} - ${micro.equipe}`,
                            })
                        )}
                        error={errors.microAreaId}
                    />
                    {/*<SelectInput

                    id="microAreaId"

                    name="microAreaId"

                    label="Micro Área"

                    value={
                        form.microAreaId
                    }

                    onChangeText={(
                        value: any
                    ) =>
                        handleChange(
                            "microAreaId",
                            value
                        )
                    }

                    logo={
                        <FontAwesome
                            name="hospital-o"
                            size={18}
                            color="#3c6a48"
                        />
                    }
                    options={
                        microAreaList.map(
                            micro => ({
                                value: String(micro.id),
                                label: `${micro.codigo} - ${micro.equipe}`,
                            })
                        )
                    }
                    error={errors.microAreaId}
                />*/}
                </>

            )}

            <View style={styles.buttons}>
                <Pressable
                    style={[styles.button,
                    loading && styles.buttonDisabled,
                    ]}
                    onPress={submit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator
                            color="#ffffff"
                            size="small"
                        />
                    ) : (
                        <Text style={styles.buttonText}>
                            {form.id ? "Atualizar"
                                : "Cadastrar"
                            }
                        </Text>
                    )}
                </Pressable>
                {form.id && (
                    <Pressable style={styles.cancelButton}
                        onPress={cancelEdit}>
                        <Text style={styles.cancelButtonText}>
                            Cancelar
                        </Text>
                    </Pressable>

                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({

    container: {

        width: "100%",

        flex: 1,

        backgroundColor:
            "#ffffff",

    },


    content: {

        width: "100%",

        padding: 15,

        gap: 15,

        paddingBottom: 30,

    },


    /*
     * Ajustes avançados
     */

    advancedButton: {

        width: "100%",

        minHeight: 48,

        paddingHorizontal: 12,

        paddingVertical: 10,

        borderRadius: 8,

        backgroundColor:
            "#f3f4f6",

        justifyContent:
            "center",

        alignItems:
            "center",

    },


    advancedButtonText: {

        color: "#333333",

        fontSize: 14,

        fontWeight: "600",

    },


    advancedContainer: {

        width: "100%",

        padding: 15,

        gap: 15,

        borderWidth: 1,

        borderColor:
            "#dddddd",

        borderRadius: 10,

        backgroundColor:
            "#fafafa",

    },


    /*
     * Botões
     */

    buttons: {

        width: "100%",

        flexDirection:
            "row",

        alignItems:
            "center",

        justifyContent:
            "center",

        gap: 8,

        marginTop: 5,

    },


    button: {

        minHeight: 48,

        minWidth: 130,

        paddingHorizontal: 18,

        borderRadius: 10,

        backgroundColor:
            "#4f46e5",

        alignItems:
            "center",

        justifyContent:
            "center",

    },


    buttonDisabled: {

        opacity: 0.6,

    },


    buttonText: {

        color: "#ffffff",

        fontSize: 15,

        fontWeight: "600",

    },


    cancelButton: {

        minHeight: 48,

        minWidth: 100,

        paddingHorizontal: 18,

        borderRadius: 10,

        backgroundColor:
            "#6b7280",

        alignItems:
            "center",

        justifyContent:
            "center",

    },


    cancelButtonText: {

        color: "#ffffff",

        fontSize: 15,

        fontWeight: "600",

    },

});