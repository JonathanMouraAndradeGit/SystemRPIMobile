import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { io } from 'socket.io-client';

import OcorrenciaFilterMap from '../Ocorrencias/OcorrenciasFilterUser/OcorrenciasFilterMap';

import apiFetch from '../FetchFunc/APIFetch';

import Graphs from '../Graphs/Graphs';


// ======================================================
// CONFIGURAÇÃO DA API
// ======================================================

// Desenvolvimento:
// Android Emulator:
// http://10.0.2.2:4000

// Android físico:
// http://IP_DO_COMPUTADOR:4000

// iOS Simulator:
// http://localhost:4000

const BACK_ROUTE = process.env.EXPO_PUBLIC_BACK_ROUTE //'http://192.168.0.100:4000';


// ======================================================
// CONFIGURAÇÕES DOS DASHBOARDS
// ======================================================

const CONFIGS = [
  {
    id: 1,

    pageTitle: 'Riscos',

    newButtonLabel: 'Nova Ocorrência',

    exportTitle: 'Ocorrências',

    ocorrenciaEndpoint: 'ocorrencias',

    categoriaEndpoint: 'categorias-risco',

    tipoEndpoint: 'tipos-risco',

    tipoField: 'tipoRiscoId',

    tipoRelation: 'tipoRisco',

    tipoLabel: 'Tipo de Risco',
  },

  {
    id: 2,

    pageTitle: 'Indicadores de Saúde',

    newButtonLabel: 'Novo Indicador',

    exportTitle: 'Indicadores de Saúde',

    ocorrenciaEndpoint: 'ocorrencias-indicadores-saude',

    categoriaEndpoint: 'categorias-indicadores-saude',

    tipoEndpoint: 'tipos-indicadores-saude',

    tipoField: 'tipoIndicadorSaudeId',

    tipoRelation: 'tipoIndicadorSaude',

    tipoLabel: 'Tipo de Indicador',
  },

  {
    id: 3,

    pageTitle: 'Potencialidades',

    newButtonLabel: 'Nova Potencialidade',

    exportTitle: 'Potencialidades',

    ocorrenciaEndpoint: 'ocorrencias-potencialidades',

    categoriaEndpoint: 'categorias-potencialidades',

    tipoEndpoint: 'tipos-potencialidade',

    tipoField: 'tipoPotencialidadeId',

    tipoRelation: 'tipoPotencialidade',

    tipoLabel: 'Tipo de Potencialidade',
  },
];


// ======================================================
// COMPONENTE
// ======================================================

export default function DashFilter() {

  // ====================================================
  // STATES
  // ====================================================

  const [dashboard, setDashboard] = useState<any>(null);

  const [config, setConfig] = useState<any>(CONFIGS[0]);

  const [filters, setFilters] = useState<any>(
    createInitialFilter(CONFIGS[0].tipoField)
  );

  const [loading, setLoading] = useState<any>(false);

  const [isCommonUser, setIsCommonUser] = useState<any>(false);


  // ====================================================
  // REFS
  // ====================================================

  const socketRef = useRef<any>(null);

  const loadOcorrenciasRef = useRef<any>(null);


  // ====================================================
  // FILTRO INICIAL
  // ====================================================

  function createInitialFilter(tipoField:any) {

    return {
      ubsId: '',
      microAreaId: '',
      enderecoId: '',
      categoriaId: '',
      [tipoField]: '',
      dataInicial: '',
      dataFinal: '',
    };

  }


  // ====================================================
  // BUSCAR USUÁRIO
  // ====================================================

  async function getCurrentUser() {

    try {

      const userString =
        await AsyncStorage.getItem('user');

      if (!userString) {
        return null;
      }

      return JSON.parse(userString);

    } catch (error) {

      console.error(
        'Erro ao recuperar usuário:',
        error
      );

      return null;

    }

  }


  // ====================================================
  // BUSCAR UBS DO USUÁRIO
  // ====================================================

  async function loadCurrentUserUBS(cpf:any) {

    const response = await apiFetch(
      `${BACK_ROUTE}/users/ubs/${cpf}`
    );

    if (!response.ok) {

      throw new Error(
        'Erro ao buscar UBS do usuário'
      );

    }

    return await response.json();

  }


  // ====================================================
  // CARREGAR DASHBOARD
  // ====================================================

  const loadOcorrencias = useCallback(
    async () => {

      try {

        setLoading(true);

        const params = new URLSearchParams();


        // UBS
        if (filters.ubsId) {

          params.append(
            'ubsId',
            filters.ubsId
          );

        }


        // MICROÁREA
        if (filters.microAreaId) {

          params.append(
            'microAreaId',
            filters.microAreaId
          );

        }


        // ENDEREÇO
        if (filters.enderecoId) {

          params.append(
            'enderecoId',
            filters.enderecoId
          );

        }


        // CATEGORIA
        if (filters.categoriaId) {

          params.append(
            'categoriaId',
            filters.categoriaId
          );

        }


        // TIPO
        if (filters[config.tipoField]) {

          params.append(
            config.tipoField,
            filters[config.tipoField]
          );

        }


        // DATA INICIAL
        if (filters.dataInicial) {

          params.append(
            'dataInicial',
            filters.dataInicial
          );

        }


        // DATA FINAL
        if (filters.dataFinal) {

          params.append(
            'dataFinal',
            filters.dataFinal
          );

        }


        const url =
          `${BACK_ROUTE}/${config.ocorrenciaEndpoint}/dashboard/?${params.toString()}`;


        console.log(
          'Buscando dashboard:',
          url
        );


        const response =
          await apiFetch(url);


        if (!response.ok) {

          throw new Error(
            'Erro ao carregar ocorrências'
          );

        }


        const data =
          await response.json();


        console.log(
          'Dashboard recebido:',
          data
        );


        setDashboard(data);

      } catch (error) {

        console.error(
          'Erro ao carregar ocorrências:',
          error
        );

      } finally {

        setLoading(false);

      }

    },
    [filters, config]
  );


  // ====================================================
  // MANTER REFERÊNCIA DA FUNÇÃO
  // ====================================================

  useEffect(() => {

    loadOcorrenciasRef.current =
      loadOcorrencias;

  }, [loadOcorrencias]);


  // ====================================================
  // SOCKET.IO
  // ====================================================

  useEffect(() => {

    let cancelled = false;

    let socket:any;


    async function initializeSocket() {

      const user =
        await getCurrentUser();


      if (!user) {

        console.log(
          'Usuário não encontrado'
        );

        return;

      }


      // ================================================
      // CRIAR SOCKET
      // ================================================

      socket = io(BACK_ROUTE, {

        transports: ['websocket'],

      });


      socketRef.current =
        socket;


      // ================================================
      // CONECTADO
      // ================================================

      socket.on(
        'connect',
        async () => {

          if (cancelled) {
            return;
          }


          console.log(
            'Socket conectado:',
            socket.id
          );


          // ==========================================
          // USUÁRIO COMUM
          // ==========================================

          if (
            user?.roles?.includes('user')
          ) {

            setIsCommonUser(true);


            try {

              const ubs =
                await loadCurrentUserUBS(
                  user.cpf
                );


              if (cancelled) {
                return;
              }


              const ubsId =
                Number(ubs?.id);


              if (!ubsId) {

                console.error(
                  'UBS inválida para o usuário'
                );

                return;

              }


              // ======================================
              // DEFINIR FILTRO DA UBS
              // ======================================

              setFilters(
                (previous:any) => ({

                  ...previous,

                  ubsId: String(ubsId),

                })
              );


              // ======================================
              // ENTRAR NA ROOM DA UBS
              // ======================================

              console.log(
                'Entrando na room:',
                `ubs:${ubsId}`
              );


              socket.emit(
                'join:ubs',
                {
                  ubsId,
                }
              );


            } catch (error) {

              if (!cancelled) {

                console.error(
                  'Erro ao buscar UBS:',
                  error
                );

              }

            }

          }


          // ==========================================
          // ADMIN
          // ==========================================

          if (
            user?.roles?.includes('admin')
          ) {

            console.log(
              'Entrando na room admins'
            );


            socket.emit(
              'join:admin'
            );

          }

        }
      );


      // ================================================
      // OCORRÊNCIA ALTERADA
      // ================================================

      socket.on(
        'ocorrencia:changed',
        () => {

          console.log(
            'Socket: ocorrencia:changed recebido'
          );


          if (
            loadOcorrenciasRef.current
          ) {

            loadOcorrenciasRef.current();

          }

        }
      );


      // ================================================
      // ERRO
      // ================================================

      socket.on(
        'connect_error',
        (error:any) => {

          console.error(
            'Erro no Socket.IO:',
            error
          );

        }
      );

    }


    initializeSocket().then(logs => console.log(logs))
    .catch(error => reportError(error));


    // ==================================================
    // CLEANUP
    // ==================================================

    return () => {

      cancelled = true;


      if (socket) {

        console.log(
          'Desconectando socket:',
          socket.id
        );


        socket.off('connect');

        socket.off(
          'ocorrencia:changed'
        );

        socket.off(
          'connect_error'
        );

        socket.disconnect();

      }


      if (
        socketRef.current === socket
      ) {

        socketRef.current = null;

      }

    };

  }, []);


  // ====================================================
  // RECARREGAR QUANDO FILTROS MUDAM
  // ====================================================

  useEffect(() => {

    const timer =
      setTimeout(() => {

        loadOcorrencias();

      }, 300);


    return () => {

      clearTimeout(timer);

    };

  }, [loadOcorrencias]);


  // ====================================================
  // ALTERAR FILTRO
  // ====================================================

  function handleFilterChange(
    name:any,
    value:any
  ) {

    setFilters(
      (previous:any) => ({

        ...previous,

        [name]: value,

      })
    );

  }


  // ====================================================
  // LIMPAR FILTROS
  // ====================================================

  async function limparFiltros() {

    const user =
      await getCurrentUser();


    // ================================================
    // USUÁRIO COMUM
    // Mantém sua UBS
    // ================================================

    if (
      user?.roles?.includes('user')
    ) {

      setFilters(
        (previous:any) => ({

          ...createInitialFilter(
            config.tipoField
          ),

          ubsId: previous.ubsId,

        })
      );

    }

    // ================================================
    // ADMIN
    // ================================================

    else {

      setFilters(
        createInitialFilter(
          config.tipoField
        )
      );

    }

  }


  // ====================================================
  // RENDER
  // ====================================================

  return (

    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.contentContainer
      }
    >

      {/* ============================================
          HEADER
      ============================================= */}

      <View style={styles.header}>

        <Text style={styles.headerTitle}>
          {config.pageTitle}
        </Text>

      </View>


      {/* ============================================
          FILTROS
      ============================================= */}

      <View style={styles.filterContainer}>

        <OcorrenciaFilterMap

          filters={filters}

          onChange={
            handleFilterChange
          }

          onSearch={
            loadOcorrencias
          }

          onClear={
            limparFiltros
          }

          isCommonUser={
            isCommonUser
          }

          config={config}

          configOpt={CONFIGS}

          selectedConf={config}

          setSelectedConf={
            setConfig
          }

        />

      </View>


      {/* ============================================
          LOADING
      ============================================= */}

      {loading && !dashboard && (

        <View style={styles.loadingContainer}>

          <ActivityIndicator
            size="large"
          />

          <Text style={styles.loadingText}>
            Carregando dashboard...
          </Text>

        </View>

      )}


      {/* ============================================
          GRÁFICOS
      ============================================= */}

      <View style={styles.content}>

        <Graphs

          dashboard={dashboard}

          setDashboard={setDashboard}

        />

      </View>

    </ScrollView>

  );

}


// ======================================================
// ESTILOS
// ======================================================

const styles = StyleSheet.create({

  container: {

    flex: 1,

    backgroundColor: '#F5F5F5',

  },


  contentContainer: {

    paddingBottom: 40,

  },


  header: {

    paddingHorizontal: 20,

    paddingTop: 20,

    paddingBottom: 15,

    backgroundColor: '#FFFFFF',

    borderBottomWidth: 1,

    borderBottomColor: '#E5E5E5',

  },


  headerTitle: {

    fontSize: 26,

    fontWeight: 'bold',

    color: '#333333',

  },


  filterContainer: {

    margin: 16,

    padding: 16,

    backgroundColor: '#FFFFFF',

    borderRadius: 12,

    elevation: 3,

    shadowColor: '#000',

    shadowOffset: {

      width: 0,

      height: 2,

    },

    shadowOpacity: 0.1,

    shadowRadius: 4,

  },


  content: {

    marginHorizontal: 16,

  },


  loadingContainer: {

    alignItems: 'center',

    justifyContent: 'center',

    padding: 30,

  },


  loadingText: {

    marginTop: 10,

    fontSize: 16,

    color: '#666666',

  },

});