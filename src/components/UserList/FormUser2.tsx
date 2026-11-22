import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { FontAwesome5 } from "@expo/vector-icons";

import CpfInput from "../CpfInput/CPFInput";
import apiFetch from "../FetchFunc/APIFetch";
import SelectInput from "../SelectInput/SelectInput";
import TxtInput from "../TXTInput/TxtInput";

import ErrMsg from "../Alerts/ErrMsg2";
import OKMsg from "../Alerts/OKMsg2";
const INITIAL_FORM = {
  name: "",
  cpf: "",
  email: "",
  password: "",
  ubsId: "",
  role: "1",
  active: true,
};

interface UserFormProps {
  user?: any;
  onClose: () => void;
  onSuccess?: () => void;
  setRe?: (value: any) => void;
}

export default function UserForm({
  user,
  onClose,
  onSuccess,
  setRe,
}: UserFormProps) {
  const [form, setForm] = useState(INITIAL_FORM);

  const [ubsList, setUbsList] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const editing = Boolean(user);

  /*
   * Carrega as UBS
   */
  useEffect(() => {
    void loadUBS();
  }, []);

  /*
   * Preenche o formulário quando estiver editando
   */
  useEffect(() => {
    if (!user) {
      setForm(INITIAL_FORM);
      setErrors({});
      return;
    }

    console.log("Usuário recebido:", user);

    setForm({
      name: user.name ?? "",

      cpf: user.cpf ?? "",

      email: user.email ?? "",

      password: "",

      ubsId: user.ubs?.id
        ? String(user.ubs.id)
        : "",

      role: user.roles?.[0]?.id
        ? String(user.roles[0].id)
        : "1",

      active: Boolean(user.active),
    });

    setErrors({});
  }, [user]);

  /*
   * Carrega UBS
   */
  async function loadUBS() {
    try {
      const response = await apiFetch(
        `${process.env.EXPO_PUBLIC_BACK_ROUTE}/ubs`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Erro ao carregar UBS."
        );
      }

      setUbsList(data);
    } catch (error: any) {
      console.error(
        "Erro ao carregar UBS:",
        error
      );

      Alert.alert(
        "Erro",
        error?.message ||
        "Erro ao carregar UBS."
      );
    }
  }

  /*
   * Atualiza campo do formulário
   */

  /*
  function handleChange(
    name: string,
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
  }*/
  function handleChange(
    name: string,
    value: string | boolean
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

  /*
   * Validação
   */
  function validate() {
    const newErrors: Record<string, string> = {};

    const cpf = form.cpf.replace(
      /\D/g,
      ""
    );

    /*
     * Nome
     */
    if (!form.name.trim()) {
      newErrors.name = "Campo obrigatório";
    }

    /*
     * CPF
     */
    if (!cpf) {
      newErrors.cpf = "Campo obrigatório";
    } else if (cpf.length !== 11) {
      newErrors.cpf = "CPF inválido";
    }

    /*
     * Email
     */
    if (!form.email.trim()) {
      newErrors.email =
        "Campo obrigatório";
    } else if (
      //!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      ///^\S+@\S+\.\S+$/.test(form.email)
      !form.email.includes("@") ||
      form.email.indexOf("@") !== form.email.lastIndexOf("@") ||
      !form.email.split("@")[1].includes(".") ||
      form.email.split("@")[1].startsWith(".") ||
      form.email.split("@")[1].endsWith(".")
    ) {
      newErrors.email =
        "E-mail inválido";
    }

    /*
     * Senha
     */
    if (
      !editing &&
      !form.password.trim()
    ) {
      newErrors.password =
        "Campo obrigatório";
    } else if (
      form.password &&
      form.password.length < 6
    ) {
      newErrors.password =
        "A senha deve possuir no mínimo 6 caracteres";
    }

    /*
     * UBS
     */
    if (!form.ubsId) {
      newErrors.ubsId =
        "Campo obrigatório";
    }

    /*
     * Perfil
     */
    if (!form.role) {
      newErrors.role =
        "Campo obrigatório";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  }

  /*
   * Salvar usuário
   */
  async function submit() {
    if (!validate()) {
      return;
    }

    try {
      setLoading(true);

      const payload: any = {
        name: form.name.trim(),

        cpf: form.cpf.replace(
          /\D/g,
          ""
        ),

        email: form.email.trim(),

        ubsId: Number(form.ubsId),

        active: form.active,

        roles: [Number(form.role)],
      };

      /*
       * Só envia senha se estiver preenchida.
       */
      if (form.password.trim()) {
        payload.password =
          form.password;
      }

      console.log(
        "Payload enviado:",
        payload
      );

      const url = editing
        ? `${process.env.EXPO_PUBLIC_BACK_ROUTE}/users/${user.id}`
        : `${process.env.EXPO_PUBLIC_BACK_ROUTE}/users`;

      const response = await apiFetch(
        url,
        {
          method: editing
            ? "PUT"
            : "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            payload
          ),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Erro ao salvar usuário."
        );
      }

      OKMsg(editing
        ? "Usuário atualizado!"
        : "Usuário cadastrado!")
      setRe?.({});
      onSuccess?.();
      setForm(INITIAL_FORM);
      setErrors({});
      onClose();
      /*
      Alert.alert(
        "Sucesso",
        editing
          ? "Usuário atualizado!"
          : "Usuário cadastrado!",
        [
          {
            text: "OK",
            onPress: () => {
              setRe?.({});
              onSuccess?.();
              setForm(INITIAL_FORM);
              setErrors({});
              onClose();
            },
          },
        ]
      );*/
    } catch (error: any) {
      ErrMsg(error?.message ||
        "Ocorreu um erro ao salvar o usuário.")
      /*
      console.error(
        "Erro ao salvar usuário:",
        error
      );

      Alert.alert(
        "Erro",
        error?.message ||
        "Ocorreu um erro ao salvar o usuário."
      );*/
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>

        <View style={styles.modal}>

          {/*
           * Botão fechar
           */}
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <FontAwesome5
              name="times-circle"
              size={32}
              color="#222222"
            />
          </TouchableOpacity>

          {/*
           * Título
           */}
          <Text style={styles.title}>
            {editing
              ? "Editar Usuário"
              : "Novo Usuário"}
          </Text>

          {/*
           * Formulário
           */}
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={
              styles.form
            }
            showsVerticalScrollIndicator={
              false
            }
            keyboardShouldPersistTaps="handled"
          >

            {/*
             * Nome
             */}
            <TxtInput
              id="name"
              name="name"
              label="Nome"
              value={form.name}
              onChangeText={(value: string) =>
                handleChange(
                  "name",
                  value
                )
              }
              logo={
                <FontAwesome5
                  name="user"
                  size={16}
                  color="#3c6a48"
                />
              }
              error={errors.name}
            />

            {/*
            <CpfInput
              id="cpf"
              name="cpf"
              label="CPF"
              value={form.cpf}
              onChangeText={(value: string) =>
                handleChange(
                  "cpf",
                  value
                )
              }
              error={errors.cpf}
            />*/}
            <CpfInput
              id="cpf"
              name="cpf"
              label="CPF"
              value={form.cpf}
              onChange={(value: string) =>
                handleChange("cpf", value)
              }
              error={errors.cpf}
            />

            {/*
             * Email
             */}
            <TxtInput
              id="email"
              name="email"
              label="Email"
              value={form.email}
              onChangeText={(value: string) =>
                handleChange(
                  "email",
                  value
                )
              }
              logo={
                <FontAwesome5
                  name="envelope"
                  size={16}
                  color="#3c6a48"
                />
              }
              error={errors.email}
            />

            {/*
             * Senha
             */}
            <TxtInput
              id="password"
              name="password"
              type="password"
              label={
                editing
                  ? "Nova senha (opcional)"
                  : "Senha"
              }
              value={form.password}
              onChangeText={(value: string) =>
                handleChange(
                  "password",
                  value
                )
              }
              logo={
                <FontAwesome5
                  name="lock"
                  size={16}
                  color="#3c6a48"
                />
              }
              error={errors.password}
            />

            {/*
            <SelectInput
              id="ubsId"
              name="ubsId"
              label="UBS"
              value={form.ubsId}
              onChangeText={(value: string) =>
                handleChange(
                  "ubsId",
                  value
                )
              }
              logo={
                <FontAwesome5
                  name="hospital"
                  size={16}
                  color="#3c6a48"
                />
              }
              options={ubsList.map(
                (ubs) => ({
                  value: String(
                    ubs.id
                  ),
                  label: ubs.nome,
                })
              )}
              error={errors.ubsId}
            />*/}
            <SelectInput
              id="ubsId"
              name="ubsId"
              label="UBS"
              value={form.ubsId}
              onChange={(value: string) =>
                handleChange("ubsId", value)
              }
              logo={
                <FontAwesome5
                  name="hospital"
                  size={16}
                  color="#3c6a48"
                />
              }
              options={ubsList.map((ubs) => ({
                value: String(ubs.id),
                label: ubs.nome,
              }))}
              error={errors.ubsId}
            />

            {/*
            <SelectInput
              id="role"
              name="role"
              label="Perfil"
              value={form.role}
              onChangeText={(value: string) =>
                handleChange(
                  "role",
                  value
                )
              }
              logo={
                <FontAwesome5
                  name="user-shield"
                  size={16}
                  color="#3c6a48"
                />
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
            />*/}
            <SelectInput
              id="active"
              name="active"
              label="Status"
              value={String(form.active)}
              onChange={(value: string) => {
                setForm((prev) => ({
                  ...prev,
                  active: value === "true",
                }));

                setErrors((prev) => ({
                  ...prev,
                  active: "",
                }));
              }}
              options={[
                { value: "true", label: "Ativo" },
                { value: "false", label: "Inativo" },
              ]}
            />

            {/*
             
            <SelectInput
              id="active"
              name="active"
              label="Status"
              value={String(
                form.active
              )}
              onChangeText={(value: string) => {
                setForm((prev) => ({
                  ...prev,
                  active:
                    value === "true",
                }));

                setErrors((prev) => ({
                  ...prev,
                  active: "",
                }));
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
            />*/}

            {/*
             * Botão salvar
             */}
            <View style={styles.buttons}>

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  loading &&
                  styles.disabledButton,
                ]}
                disabled={loading}
                activeOpacity={0.8}
                onPress={submit}
              >
                {loading ? (
                  <>
                    <ActivityIndicator
                      size="small"
                      color="#ffffff"
                    />

                    <Text
                      style={
                        styles.saveButtonText
                      }
                    >
                      Salvando...
                    </Text>
                  </>
                ) : (
                  <Text
                    style={
                      styles.saveButtonText
                    }
                  >
                    {editing
                      ? "Atualizar"
                      : "Cadastrar"}
                  </Text>
                )}
              </TouchableOpacity>

            </View>

          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

/*
 * =====================================================
 * STYLES
 * =====================================================
 */

const styles = StyleSheet.create({

  /*
   * .overlay
   */
  overlay: {
    flex: 1,

    backgroundColor:
      "rgba(0, 0, 0, 0.45)",

    justifyContent: "center",

    alignItems: "center",

    padding: 15,
  },

  /*
   * .modal
   */
  modal: {
    width: "100%",

    maxWidth: 500,

    maxHeight: "90%",

    backgroundColor: "#ffffff",

    borderRadius: 10,

    padding: 10,

    position: "relative",

    gap: 15,
  },

  /*
   * Título
   */
  title: {
    color: "#333333",

    fontSize: 22,

    fontWeight: "700",

    textAlign: "center",

    marginTop: 5,
  },

  /*
   * .CloseBtn
   */
  closeBtn: {
    position: "absolute",

    right: 10,

    top: 10,

    width: 40,

    height: 40,

    alignItems: "center",

    justifyContent: "center",

    zIndex: 10,
  },

  /*
   * Área rolável do formulário
   */
  scroll: {
    width: "100%",
  },

  /*
   * form
   */
  form: {
    width: "100%",

    alignItems: "center",

    justifyContent: "center",

    gap: 5,

    paddingBottom: 10,
  },

  /*
   * .buttons
   */
  buttons: {
    width: "100%",

    flexDirection: "row",

    justifyContent: "flex-end",

    gap: 15,

    marginTop: 10,
  },

  /*
   * .buttons button
   */
  saveButton: {
    minWidth: 130,

    minHeight: 46,

    paddingVertical: 10,

    paddingHorizontal: 18,

    backgroundColor: "#3c6a48",

    borderRadius: 5,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 8,
  },

  saveButtonText: {
    color: "#ffffff",

    fontSize: 15,

    fontWeight: "600",
  },

  disabledButton: {
    opacity: 0.6,
  },
});