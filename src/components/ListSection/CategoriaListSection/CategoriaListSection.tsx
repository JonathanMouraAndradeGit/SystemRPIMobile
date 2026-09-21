import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

import apiFetch from "@/components/FetchFunc/APIFetch";
import CategoriaForm from "@/components/Form/CategoriaForm/CategoriaForm";
import SwitchScreen from "@/components/SwitchScreen/SwitchScreen";
import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io, Socket } from "socket.io-client";

interface CategoriaListSectionProps {
  endpoint: string;
  titulo: string;
  sok: string;
}

interface Categoria {
  id: number;
  nome: string;
}

export default function CategoriaListSection({
  endpoint,
  titulo,
  sok,
}: CategoriaListSectionProps) {
  const [lista, setLista] = useState<Categoria[]>([]);
  const [selected, setSelected] =
    useState<Categoria | null>(null);

  const [filter, setFilter] = useState("");

  const [open, setOpen] = useState(false);

  const socketRef = useRef<Socket | null>(null);

  const loadCatRef =
    useRef<(() => void) | null>(null);

  /*
   * ==========================================================
   * CARREGAR CATEGORIAS
   * ==========================================================
   */

  const load = useCallback(async () => {
    try {
      const response = await apiFetch(
        `${process.env.EXPO_PUBLIC_BACK_ROUTE}/${endpoint}`
      );

      if (!response.ok) {
        throw new Error(
          "Erro ao carregar categorias"
        );
      }

      const data: Categoria[] =
        await response.json();

      setLista(data);

      /*
       * Salva no cache local
       */
      await AsyncStorage.setItem(
        `categorias-list-${endpoint}`,
        JSON.stringify(data)
      );
    } catch (err) {
      console.error(
        "Erro ao carregar categorias:",
        err
      );

      /*
       * Caso a API esteja indisponível,
       * tenta utilizar o cache.
       */
      try {
        const cached =
          await AsyncStorage.getItem(
            `categorias-list-${endpoint}`
          );

        if (cached) {
          setLista(JSON.parse(cached));
        }
      } catch (cacheError) {
        console.error(
          "Erro ao carregar cache:",
          cacheError
        );
      }
    }
  }, [endpoint]);

  /*
   * Mantém a referência atualizada
   * para o Socket.IO
   */
  useEffect(() => {
    loadCatRef.current = load;
  }, [load]);

  /*
   * ==========================================================
   * SOCKET.IO
   * ==========================================================
   */

  useEffect(() => {
    let cancelled = false;

    async function initializeSocket() {
      try {
        /*
         * No React Native usamos AsyncStorage
         * no lugar de localStorage.
         */
        const userString =
          await AsyncStorage.getItem("user");

        /*
         * Carrega os dados mesmo se não houver
         * usuário salvo.
         */
        if (!userString) {
          load();
          return;
        }

        const user = JSON.parse(userString);

        if (cancelled) {
          return;
        }

        const socket = io(
          process.env.EXPO_PUBLIC_BACK_ROUTE as string,///REACT_APP_BACK_ROUTE as string,
          {
            transports: ["websocket"],
          }
        );

        socketRef.current = socket;

        /*
         * ==========================================
         * CONECTOU
         * ==========================================
         */

        socket.on("connect", () => {
          if (cancelled) {
            return;
          }

          console.log(
            "Socket conectado:",
            socket.id
          );

          if (
            user?.roles?.includes("admin")
          ) {
            console.log(
              "Entrando na room:",
              sok
            );

            socket.emit("join:cat", {
              category: sok,
            });

            load();
          }
        });

        /*
         * ==========================================
         * CATEGORIA ALTERADA
         * ==========================================
         */

        socket.on(
          `cat:change${sok}`,
          () => {
            console.log(
              "Socket: cat:change recebido"
            );

            if (loadCatRef.current) {
              loadCatRef.current();
            }
          }
        );

        /*
         * ==========================================
         * ERRO
         * ==========================================
         */

        socket.on(
          "connect_error",
          (error) => {
            console.error(
              "Erro no Socket.IO:",
              error
            );
          }
        );
      } catch (error) {
        console.error(
          "Erro ao inicializar Socket.IO:",
          error
        );

        load();
      }
    }

    initializeSocket();

    /*
     * ==========================================
     * CLEANUP
     * ==========================================
     */

    return () => {
      cancelled = true;

      const socket = socketRef.current;

      if (socket) {
        console.log(
          "Desconectando socket:",
          socket.id
        );

        socket.off("connect");

        socket.off(
          `cat:change${sok}`
        );

        socket.off("connect_error");

        socket.disconnect();

        socketRef.current = null;
      }
    };
  }, [sok, load]);

  /*
   * ==========================================================
   * EXCLUIR
   * ==========================================================
   */

  async function remove(id: number) {
    console.log("remove")
    try {
      const response =
        await apiFetch(
          `${process.env.EXPO_PUBLIC_BACK_ROUTE}/${endpoint}/${id}`,
          {
            method: "DELETE",
          }
        );

      if (!response.ok) {
        throw new Error(
          "Erro ao excluir categoria"
        );
      }
      setLista((prev) =>
        prev.filter(
          (item) =>
            item.id !== id
        )
      );
      const updatedList =
        lista.filter(
          (item) =>
            item.id !== id
        );

      await AsyncStorage.setItem(
        `categorias-list-${endpoint}`,
        JSON.stringify(
          updatedList
        )
      );
    } catch (err) {
      console.error(err);
    }
    /*
    Alert.alert(
      "Excluir categoria",
      "Deseja excluir?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },

        {
          text: "Excluir",
          style: "destructive",

          onPress: async () => {
            try {
              const response =
                await apiFetch(
                  `${process.env.EXPO_PUBLIC_BACK_ROUTE}/${endpoint}/${id}`,
                  {
                    method: "DELETE",
                  }
                );

              if (!response.ok) {
                throw new Error(
                  "Erro ao excluir categoria"
                );
              }
              setLista((prev) =>
                prev.filter(
                  (item) =>
                    item.id !== id
                )
              );
              const updatedList =
                lista.filter(
                  (item) =>
                    item.id !== id
                );

              await AsyncStorage.setItem(
                `categorias-list-${endpoint}`,
                JSON.stringify(
                  updatedList
                )
              );
            } catch (err) {
              console.error(err);

              Alert.alert(
                "Erro",
                "Não foi possível excluir a categoria."
              );
            }
          },
        },
      ]
    );*/
  }

  /*
   * ==========================================================
   * FILTRO
   * ==========================================================
   */

  const filteredList = lista.filter(
    (item) =>
      item.nome
        ?.toLowerCase()
        .includes(
          filter.toLowerCase()
        )
  );

  /*
   * ==========================================================
   * ITEM DA LISTA
   * ==========================================================
   */

  function renderItem({
    item,
  }: {
    item: Categoria;
  }) {
    return (
      <View style={styles.card}>
        <View style={styles.info}>
          <Text style={styles.cardTitle}>
            {item.nome}
          </Text>
        </View>

        <View style={styles.actions}>
          {/* EDITAR */}

          <Pressable
            style={[
              styles.actionButton,
              styles.editButton,
            ]}
            onPress={() => {
              setSelected(item);
              setOpen(true);
            }}
          >
            <FontAwesome5
              name="pen"
              size={15}
              color="#333"
            />
          </Pressable>

          {/* EXCLUIR */}

          <Pressable
            style={[
              styles.actionButton,
              styles.deleteButton,
            ]}
            onPress={() =>
              remove(item.id)
            }
          >
            <FontAwesome5
              name="trash"
              size={15}
              color="#fff"
            />
          </Pressable>
        </View>
      </View>
    );
  }

  /*
   * ==========================================================
   * RENDER
   * ==========================================================
   */

  return (
    <View style={styles.container}>
      <SwitchScreen
        open={open}
        setOpen={setOpen}
        sidebar={
          <CategoriaForm
            endpoint={endpoint}
            titulo={titulo}
            obj={selected}
            onSuccess={() => {
              setSelected(null);
              setOpen(false);

              /*
               * Atualiza a lista.
               */
              load();
            }}
          />
        }
      >
        <View style={styles.listSection}>
          {/* HEADER */}

          <View style={styles.header}>
            <Text style={styles.title}>
              {titulo}
            </Text>

            <Pressable
              style={styles.newButton}
              onPress={() => {
                setSelected(null);
                setOpen(true);
              }}
            >
              <FontAwesome5
                name="plus"
                size={14}
                color="#fff"
              />

              <Text style={styles.newButtonText}>
                Novo
              </Text>
            </Pressable>
          </View>

          {/* FILTRO */}

          <TextInput
            style={styles.filter}
            placeholder="Pesquisar..."
            placeholderTextColor="#999"
            value={filter}
            onChangeText={setFilter}
          />

          {/* LISTA */}

          <FlatList
            data={filteredList}
            keyExtractor={(item) =>
              String(item.id)
            }
            renderItem={renderItem}
            contentContainerStyle={
              styles.list
            }
            showsVerticalScrollIndicator={
              false
            }
            ListEmptyComponent={
              <Text style={styles.empty}>
                Nenhuma categoria encontrada.
              </Text>
            }
          />
        </View>
      </SwitchScreen>
    </View>
  );
}

/*
 * ============================================================
 * STYLES
 * ============================================================
 */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  listSection: {
    flex: 1,
    padding: 16,
  },

  header: {
    width: "100%",

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    marginBottom: 4,
  },

  title: {
    flex: 1,

    color: "#2c3e50",

    fontSize: 22,

    fontWeight: "700",

    marginRight: 10,
  },

  newButton: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 8,

    backgroundColor: "#3c6a48",

    paddingHorizontal: 18,

    paddingVertical: 10,

    borderRadius: 8,
  },

  newButtonText: {
    color: "#fff",

    fontSize: 14,

    fontWeight: "600",
  },

  filter: {
    width: "100%",

    height: 46,

    backgroundColor: "#fff",

    borderWidth: 1,

    borderColor: "#dcdcdc",

    borderRadius: 8,

    paddingHorizontal: 16,

    fontSize: 15,

    marginVertical: 15,

    color: "#222",
  },

  list: {
    paddingBottom: 30,

    gap: 15,
  },

  card: {
    width: "100%",

    minHeight: 76,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    padding: 18,

    backgroundColor: "#fff",

    borderRadius: 12,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.08,

    shadowRadius: 10,

    elevation: 2,
  },

  info: {
    flex: 1,

    marginRight: 12,
  },

  cardTitle: {
    color: "#2563eb",

    fontSize: 16,

    fontWeight: "600",
  },

  actions: {
    flexDirection: "row",

    alignItems: "center",

    gap: 10,
  },

  actionButton: {
    width: 42,

    height: 42,

    borderRadius: 21,

    alignItems: "center",

    justifyContent: "center",
  },

  editButton: {
    backgroundColor: "#facc15",
  },

  deleteButton: {
    backgroundColor: "#ef4444",
  },

  empty: {
    textAlign: "center",

    color: "#888",

    fontSize: 15,

    marginTop: 30,
  },
});