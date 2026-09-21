import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import apiFetch from "@/components/FetchFunc/APIFetch";
import TipoSimplesForm from "@/components/Form/TipoSimplesForm/TipoSimplesForm";
import SwitchScreen from "@/components/SwitchScreen/SwitchScreen";
import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io, Socket } from "socket.io-client";

interface TipoSimplesListSectionProps {
  endpoint: string;
  titulo: string;
  categoriaEndpoint1: string;
  sok: string;
}

interface TipoItem {
  id: number;
  nome: string;
  categoria?: {
    id: number;
    nome: string;
  };
}

export default function TipoSimplesListSection({
  endpoint,
  titulo,
  categoriaEndpoint1,
  sok,
}: TipoSimplesListSectionProps) {
  const [lista, setLista] = useState<TipoItem[]>([]);
  const [selected, setSelected] = useState<TipoItem | null>(null);
  const [filter, setFilter] = useState("");

  const [open, setOpen] = useState(false);

  const socketRef = useRef<Socket | null>(null);

  const loadTypeRef = useRef<(() => void) | null>(null);

  /*
   * ==========================================================
   * CARREGAR DADOS
   * ==========================================================
   */

  const loadData = useCallback(async () => {
    try {
      const response = await apiFetch(
        `${process.env.EXPO_PUBLIC_BACK_ROUTE}/${endpoint}`
      );

      if (!response.ok) {
        throw new Error("Erro ao carregar dados");
      }

      const data = await response.json();

      setLista(data);

      /*
       * Opcional:
       * salva uma cópia local para funcionar como cache.
       */
      await AsyncStorage.setItem(
        `tipo-list-${endpoint}`,
        JSON.stringify(data)
      );
    } catch (err) {
      console.error("Erro ao carregar dados:", err);

      /*
       * Se a API falhar, tenta carregar o cache.
       */
      try {
        const cached = await AsyncStorage.getItem(
          `tipo-list-${endpoint}`
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
   * Mantém a referência atualizada para o Socket.IO
   */
  useEffect(() => {
    loadTypeRef.current = loadData;
  }, [loadData]);

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
         * Recupera usuário do AsyncStorage
         */
        const userString =
          await AsyncStorage.getItem("user");

        if (!userString) {
          /*
           * Mesmo sem usuário, podemos carregar os dados.
           */
          loadData();
          return;
        }

        const user = JSON.parse(userString);

        if (cancelled) {
          return;
        }

        const socket = io(
          process.env.EXPO_PUBLIC_BACK_ROUTE as string,
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
              "Entrando na room admins:",
              sok
            );

            socket.emit("join:type", {
              category: sok,
            });

            loadData();
          }
        });

        /*
         * ==========================================
         * ALTERAÇÃO
         * ==========================================
         */

        socket.on(
          `type:change${sok}`,
          () => {
            console.log(
              "Socket: type:change recebido"
            );

            if (loadTypeRef.current) {
              loadTypeRef.current();
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
          "Erro ao inicializar socket:",
          error
        );

        /*
         * Mesmo se o socket falhar,
         * carrega os dados normalmente.
         */
        loadData();
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
          `type:change${sok}`
        );
        socket.off("connect_error");

        socket.disconnect();

        socketRef.current = null;
      }
    };
  }, [sok, loadData]);

  /*
   * ==========================================================
   * EXCLUIR
   * ==========================================================
   */

  async function remove(id: number) {
    try {
      const response = await apiFetch(
        `${process.env.EXPO_PUBLIC_BACK_ROUTE}/${endpoint}/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Erro ao excluir item"
        );
      }

      /*
       * Remove imediatamente da lista.
       */
      setLista((prev) =>
        prev.filter(
          (item) => item.id !== id
        )
      );

      /*
       * Atualiza o cache.
       */
      setLista((currentList) => {
        AsyncStorage.setItem(
          `tipo-list-${endpoint}`,
          JSON.stringify(currentList)
        );

        return currentList;
      });
    } catch (err) {
      console.error(err);

      Alert.alert(
        "Erro",
        "Não foi possível excluir o item."
      );
    }
    /*
    Alert.alert(
      "Excluir item",
      "Deseja excluir este item?",
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
              const response = await apiFetch(
                `${process.env.EXPO_PUBLIC_BACK_ROUTE}/${endpoint}/${id}`,
                {
                  method: "DELETE",
                }
              );

              if (!response.ok) {
                throw new Error(
                  "Erro ao excluir item"
                );
              }
              setLista((prev) =>
                prev.filter(
                  (item) => item.id !== id
                )
              );
              setLista((currentList) => {
                AsyncStorage.setItem(
                  `tipo-list-${endpoint}`,
                  JSON.stringify(currentList)
                );

                return currentList;
              });
            } catch (err) {
              console.error(err);

              Alert.alert(
                "Erro",
                "Não foi possível excluir o item."
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

  const filtered = lista.filter((item) =>
    item.nome
      ?.toLowerCase()
      .includes(filter.toLowerCase())
  );

  /*
   * ==========================================================
   * RENDER ITEM
   * ==========================================================
   */

  function renderItem({
    item,
  }: {
    item: TipoItem;
  }) {
    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>
            {item.nome}
          </Text>

          {item.categoria?.nome && (
            <Text style={styles.category}>
              {item.categoria.nome}
            </Text>
          )}
        </View>

        <View style={styles.actions}>
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
              size={14}
              color="#fff"
            />
          </Pressable>

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
              size={14}
              color="#fff"
            />
          </Pressable>
        </View>
      </View>
    );
  }

  /*
   * ==========================================================
   * TELA
   * ==========================================================
   */

  return (
    <View style={styles.container}>
      <SwitchScreen
        open={open}
        setOpen={setOpen}
        sidebar={
          <TipoSimplesForm
            categoriaEndpoint={
              categoriaEndpoint1
            }
            categoriaLabel="Categoria"
            endpoint={endpoint}
            titulo={titulo}
            obj={selected}
            onSuccess={() => {
              setSelected(null);
              setOpen(false);

              /*
               * Atualiza a lista após cadastrar/editar.
               */
              loadData();
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
            data={filtered}
            keyExtractor={(item) =>
              String(item.id)
            }
            renderItem={renderItem}
            contentContainerStyle={
              styles.list
            }
            ListEmptyComponent={
              <Text style={styles.empty}>
                Nenhum registro encontrado.
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
    marginRight: 12,
  },

  newButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#2563eb",

    paddingHorizontal: 14,
    paddingVertical: 10,

    borderRadius: 8,

    gap: 8,
  },

  newButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  filter: {
    height: 46,

    backgroundColor: "#fff",

    borderWidth: 1,
    borderColor: "#ddd",

    borderRadius: 8,

    paddingHorizontal: 14,

    fontSize: 15,

    marginBottom: 14,
  },

  list: {
    paddingBottom: 30,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#fff",

    borderRadius: 10,

    padding: 15,

    marginBottom: 10,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,

    elevation: 2,
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },

  category: {
    marginTop: 5,
    fontSize: 13,
    color: "#777",
  },

  actions: {
    flexDirection: "row",
    gap: 8,
    marginLeft: 12,
  },

  actionButton: {
    width: 38,
    height: 38,

    borderRadius: 8,

    alignItems: "center",
    justifyContent: "center",
  },

  editButton: {
    backgroundColor: "#2563eb",
  },

  deleteButton: {
    backgroundColor: "#dc2626",
  },

  empty: {
    textAlign: "center",
    color: "#888",
    fontSize: 15,
    marginTop: 30,
  },
});