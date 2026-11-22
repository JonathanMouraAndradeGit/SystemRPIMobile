import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { io, Socket } from "socket.io-client";

import ErrMsg from "../Alerts/ErrMsg";
import OKMsg from "../Alerts/OKMsg";
import apiFetch from "../FetchFunc/APIFetch";
import PageItemSelector from "../PageItemSelector/PageItemSelector";
interface User {
  id: string | number;
  name: string;
  email: string;
  active: boolean;
  roles?: string[];
}

interface UserListSectionProps {
  setSelectedUser: (user: User | any) => void;
  setModalOpen: (open: boolean) => void;
  re?: any;
}

export default function UserListSection({
  setSelectedUser,
  setModalOpen,
}: UserListSectionProps) {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState("");

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    //async () => {
      void load(page, filter);
    //}
  }, [page, filter]);

  useEffect(() => {
    let cancelled = false;
    let socket: Socket | null = null;

    async function setupSocket() {
      try {
        const storedUser = await AsyncStorage.getItem("user");

        if (!storedUser || cancelled) {
          return;
        }

        const user = JSON.parse(storedUser);

        socket = io(process.env.EXPO_PUBLIC_BACK_ROUTE as string);

        socketRef.current = socket;

        socket.on("connect", () => {
          if (cancelled) return;

          console.log("Socket conectado:", socket?.id);

          if (user?.roles?.includes("admin")) {
            socket?.emit("join:usrLst");
          }
        });

        socket.on("usrlst:change", async () => {
          console.log("Socket: usrlst:change recebido");

          await load(page, filter);
        });

        socket.on("connect_error", (error) => {
          console.error("Erro no Socket.IO:", error);
        });
      } catch (error) {
        console.error("Erro ao configurar socket:", error);
      }
    }

    void setupSocket();

    return () => {
      cancelled = true;

      if (socket) {
        socket.off("connect");
        socket.off("usrlst:change");
        socket.off("connect_error");
        socket.disconnect();
      }

      if (socketRef.current === socket) {
        socketRef.current = null;
      }
    };
  }, []);

  async function load(
    pageNumber = page,
    searchValue = filter
  ) {
    try {
      const params = new URLSearchParams({
        page: pageNumber.toString(),
        limit: "5",
      });

      if (searchValue.trim()) {
        params.append("search", searchValue.trim());
      }

      const response = await apiFetch(
        `${process.env.EXPO_PUBLIC_BACK_ROUTE}/users/filter2?${params.toString()}`
      );

      const data = await response.json();

      setUsers(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    }
  }

  async function remove(id: string | number) {
    /*Alert.alert(
      "Excluir usuário",
      "Deseja realmente excluir este usuário?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {*/
    try {
      await apiFetch(
        `${process.env.EXPO_PUBLIC_BACK_ROUTE}/users/${id}`,
        {
          method: "DELETE",
        }
      );
      void OKMsg("usuário excluido")

      void load(page, filter);
    } catch (error) {
      void ErrMsg("Erro ao excluir usuário:")
      console.error("Erro ao excluir usuário:", error);
    }/*
          },
        },
      ]
    );*/
  }

  function editarUsuario(user: User) {
    setSelectedUser(user);
    setModalOpen(true);
  }

  function novoUsuario() {
    setSelectedUser(null);
    setModalOpen(true);
  }

  const filteredUsers = users.filter((user) =>
    user.name
      ?.toLowerCase()
      .includes(filter.toLowerCase())
  );

  function renderUser({ item }: { item: User }) {
    return (
      <View style={styles.card}>

        {/* Informações */}
        <View style={styles.info}>
          <Text style={styles.userName}>
            {item.name}
          </Text>

          <Text style={styles.infoText}>
            <Text style={styles.bold}>
              Email:
            </Text>{" "}
            {item.email}
          </Text>

          <Text style={styles.infoText}>
            <Text style={styles.bold}>
              Status:
            </Text>{" "}
            {item.active ? "Ativo" : "Inativo"}
          </Text>
        </View>

        {/* Ações */}
        <View style={styles.actions}>

          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.edit,
            ]}
            activeOpacity={0.8}
            onPress={() => editarUsuario(item)}
          >
            <FontAwesome5
              name="pencil-alt"
              size={14}
              color="#ffffff"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.delete,
            ]}
            activeOpacity={0.8}
            onPress={() => remove(item.id)}
          >
            <FontAwesome5
              name="trash"
              size={14}
              color="#ffffff"
            />
          </TouchableOpacity>

        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>

        <Text style={styles.title}>
          Usuários
        </Text>

        <TouchableOpacity
          style={styles.newButton}
          activeOpacity={0.8}
          onPress={novoUsuario}
        >
          <FontAwesome5
            name="plus"
            size={14}
            color="#ffffff"
          />

          <Text style={styles.newButtonText}>
            Novo
          </Text>
        </TouchableOpacity>

      </View>

      {/* Filtro */}
      <TextInput
        style={styles.filter}
        placeholder="Pesquisar usuário..."
        placeholderTextColor="#999999"
        value={filter}
        onChangeText={(text) => {
          setFilter(text);
          setPage(1);
        }}
      />

      {/* Lista */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) =>
          item.id.toString()
        }
        renderItem={renderUser}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Nenhum usuário encontrado.
          </Text>
        }
      />

      {/* Paginação */}
      <PageItemSelector
        page={page}
        func1={() => {
          if (page > 1) {
            setPage(page - 1);
          }
        }}
        func2={() => {
          if (page < totalPages) {
            setPage(page + 1);
          }
        }}
        totalPages={totalPages}
      />

    </View>
  );
}

const styles = StyleSheet.create({

  /*
   * .Container
   */
  container: {
    width: "100%",
    flex: 1,

    padding: 15,

    backgroundColor: "#f7f8f7",
  },

  /*
   * .header
   */
  header: {
    flexDirection: "row",

    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: 15,
  },

  /*
   * .header h2
   */
  title: {
    color: "#333333",

    fontSize: 22,
    fontWeight: "700",
  },

  /*
   * .newButton
   */
  newButton: {
    flexDirection: "row",

    alignItems: "center",

    gap: 8,

    backgroundColor: "#3c6a48",

    borderRadius: 8,

    paddingVertical: 10,
    paddingHorizontal: 18,
  },

  newButtonText: {
    color: "#ffffff",

    fontWeight: "600",

    fontSize: 14,
  },

  /*
   * .filter
   */
  filter: {
    width: "100%",

    padding: 12,

    borderWidth: 1,
    borderColor: "#d6d6d6",

    borderRadius: 8,

    marginBottom: 20,

    backgroundColor: "#ffffff",

    color: "#333333",

    fontSize: 15,
  },

  /*
   * .list
   */
  list: {
    gap: 15,

    paddingBottom: 20,
  },

  /*
   * .card
   */
  card: {
    flexDirection: "row",

    justifyContent: "space-between",
    alignItems: "center",

    backgroundColor: "#ffffff",

    padding: 18,

    borderRadius: 12,

    borderWidth: 1,

    borderColor: "rgba(102, 102, 102, 0.10)",

    /*
     * Equivalente aproximado ao:
     *
     * box-shadow:
     * 0 2px 10px rgba(0,0,0,.06)
     */

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 10,

    elevation: 2,
  },

  /*
   * .info
   */
  info: {
    flex: 1,

    alignItems: "flex-start",
    justifyContent: "flex-start",

    gap: 5,
  },

  /*
   * .info h3
   */
  userName: {
    color: "#3c6a48",

    fontSize: 18,

    fontWeight: "700",

    marginBottom: 2,
  },

  /*
   * .info p
   */
  infoText: {
    color: "#666666",

    fontSize: 14,
  },

  bold: {
    fontWeight: "700",
  },

  /*
   * .actions
   */
  actions: {
    flexDirection: "row",

    gap: 10,

    marginLeft: 10,
  },

  /*
   * .actions button
   */
  actionButton: {
    width: 42,
    height: 42,

    borderRadius: 21,

    justifyContent: "center",
    alignItems: "center",
  },

  /*
   * .edit
   */
  edit: {
    backgroundColor: "#3c6a48",
  },

  /*
   * .delete
   */
  delete: {
    backgroundColor: "#b42318",
  },

  empty: {
    textAlign: "center",

    color: "#666666",

    marginTop: 30,

    fontSize: 15,
  },
});