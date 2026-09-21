import { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

import { FontAwesome5 } from "@expo/vector-icons";

import SideProgress from "../SideProgress/SideProgress";

/*
// LIST SECTIONS
import UbsListSection from "../ListSection/UbsListSection/UbsListSection";
import MicroAreaListSectionUser from "../ListSection/MicroAreaListSection/MicroAreaListSectionUser";
import EnderecoListSectionUser from "../ListSection/EnderecoListSection/EnderecoListSectionUser";

import CategoriaRisco2 from "../ListSection/CategoriaRisco2/CategoriaRisco2";
import TipoRiscoPage from "../ListSection/TipoRisco2/TipoRisco2";

import CategoriaIndicador from "../ListSection/CategoriaListIndicador/CategoriaListIndicador";
import TipoIndicadorSaudePage from "../ListSection/TipoIndicador/TipoIndicador";

import CategoriaPotencialidade from "../ListSection/CategoriaListPotencialidade/CategoriaListPotencialidade";
import TipoPotencialidadePage from "../ListSection/TipoPotencialidade/TipoPotencialidade";

// OCORRÊNCIAS
import OcorrenciasGeralSlim from "../Ocorrenciasv3/MainOcorrenciasv3/mainOcorrenciasUserGeralSlim";

import OcorrenciaIndicadorUser from "../Ocorrenciasv3/OcorrenciaIndicador/OcorrenciaIndicadorUser";
import OcorrenciaPotencialidadeUser from "../Ocorrenciasv3/OcorrenciaPotencialidade/OcorrenciaPotencialidadeUser";
import OcorrenciaRiscoUser from "../Ocorrenciasv3/OcorrenciaRisco/OcorrenciaRisco";

// SELECTORS
import FormSelector2 from "../FormSelector2/FormSelector2";
import FormSelector3 from "../FormSelector3/FormSelector3";
*/

import FormSelector2 from "../FormSelector2/FormSelector2";
import FormSelector3 from "../FormSelector3/FormSelector3";
import CategoriaIndicador from "../ListSection/CategoriaListSection/CategoriaIndicador";
import CategoriaRisco2 from "../ListSection/CategoriaListSection/CategoriaRisco2";
import CategoriaPotencialidade from "../ListSection/CategoriaListSection/CategorisPotencialidade";
import EnderecoListSectionUser from "../ListSection/EnderecoListSection/EnderecoListSection";
import MicroAreaListSectionUser from "../ListSection/MicroAreaListSection/MicroAreaListSection";
import TipoIndicadorSaudePage from "../ListSection/TipoSimplesListSection/TipoIndicador";
import TipoPotencialidadePage from "../ListSection/TipoSimplesListSection/TipoPotencialidade";
import TipoRiscoPage from "../ListSection/TipoSimplesListSection/TipoRIsco2";

import OcorrenciaIndicadorUser from "../Ocorrencias/MainOcorrencias/OcorrenciaIndicadorUser";
import OcorrenciaPotencialidadeUser from "../Ocorrencias/MainOcorrencias/OcorrenciaPotencialidadesUser";
import OcorrenciaRiscoUser from "../Ocorrencias/MainOcorrencias/OcorrenciaRiscoUser";

import UbsListSection from "../ListSection/UbsListSection/UbsListSection";

export default function FormSelector() {
  const [select, setSelect] = useState(0);

  const { width } = useWindowDimensions();

  const isMobile = width <= 768;

  const forms = [
    {
      title: "UBS",
      icon: (
        <FontAwesome5
          name="user"
          size={20}
          color="#ffffff"
        />
      ),
    },
    {
      title: "Micro Área",
      icon: (
        <FontAwesome5
          name="map-marker-alt"
          size={20}
          color="#ffffff"
        />
      ),
    },
    {
      title: "Endereço",
      icon: (
        <FontAwesome5
          name="file-alt"
          size={20}
          color="#ffffff"
        />
      ),
    },
    {
      title: "Risco",
      icon: (
        <FontAwesome5
          name="tag"
          size={20}
          color="#ffffff"
        />
      ),
    },
    {
      title: "Indicadores",
      icon: (
        <FontAwesome5
          name="tag"
          size={20}
          color="#ffffff"
        />
      ),
    },
    {
      title: "Potencialidades",
      icon: (
        <FontAwesome5
          name="tag"
          size={20}
          color="#ffffff"
        />
      ),
    },
    {
      title: "Ocorrência",
      icon: (
        <FontAwesome5
          name="layer-group"
          size={20}
          color="#ffffff"
        />
      ),
    },
  ];

  function selectFrm(status: number) {
    switch (status) {
      case 0:
        return <UbsListSection />;

      case 1:
        return <MicroAreaListSectionUser />;

      case 2:
        return <EnderecoListSectionUser />;

      case 3:
        return (
          <FormSelector2>
            <CategoriaRisco2 />
            <TipoRiscoPage />
          </FormSelector2>
        );

      case 4:
        return (
          <FormSelector2>
            <CategoriaIndicador />
            <TipoIndicadorSaudePage />
          </FormSelector2>
        );

      case 5:
        return (
          <FormSelector2>
            <CategoriaPotencialidade />
            <TipoPotencialidadePage />
          </FormSelector2>
        );

      case 6:
        return (
          <FormSelector3
            labels={[
              "Ocorrência Risco",
              "Ocorrência Indicador",
              "Ocorrência Potencialidade",
            ]}
          >
            <OcorrenciaRiscoUser />
            <OcorrenciaIndicadorUser />
            <OcorrenciaPotencialidadeUser />
          </FormSelector3>
        );
      default:
        return null;
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View
        style={[
          styles.container,
          isMobile && styles.containerMobile,
        ]}
      >
        <View
          style={[
            styles.sideProgress,
            isMobile && styles.sideProgressMobile,
          ]}
        >
          <SideProgress
            items={forms}
            selected={select}
            onSelect={setSelect}
          />
        </View>

        <View
          style={[
            styles.content,
            isMobile && styles.contentMobile,
          ]}
        >
          {selectFrm(select)}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  /*
   * A SafeAreaView precisa ocupar toda a área disponível.
   */
  safeArea: {
    flex: 1,
    width: "100%",
    backgroundColor: "#f5f7f5",
  },

  /*
   * O container define uma área física para os filhos.
   */
  container: {
    flex: 1,
    width: "100%",

    flexDirection: "row",

    alignItems: "stretch",
    justifyContent: "flex-start",

    minHeight: 0,
    minWidth: 0,

    backgroundColor: "#f5f7f5",
  },

  /*
   * MENU LATERAL
   */
  sideProgress: {
    width: 280,
    flexShrink: 0,

    backgroundColor: "#ffffff",

    borderRightWidth: 1,
    borderRightColor: "#e2e6e3",

    paddingVertical: 10,

    /*
     * Importante:
     * não usar height: "100%"
     */
    minHeight: 0,
  },

  /*
   * CONTEÚDO
   *
   * flex: 1 faz ocupar somente o espaço restante.
   *
   * minHeight: 0 permite que os ScrollViews
   * internos tenham uma área limitada.
   */
  content: {
    flex: 1,

    minWidth: 0,
    minHeight: 0,

    padding: 8,

    backgroundColor: "#f5f7f5",

    overflow: "hidden",
  },

  /*
   * MOBILE
   */
  containerMobile: {
    flexDirection: "row",
  },

  sideProgressMobile: {
    width: 64,
    minWidth: 64,

    paddingVertical: 5,

    borderRightWidth: 1,
    borderRightColor: "#e2e6e3",
  },

  contentMobile: {
    flex: 1,

    minWidth: 0,
    minHeight: 0,

    padding: 5,
  },
});