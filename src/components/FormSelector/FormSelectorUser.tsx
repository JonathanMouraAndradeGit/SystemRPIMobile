import { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

import { FontAwesome5 } from "@expo/vector-icons";

import SideProgress from "../SideProgress/SideProgress";

import EnderecoListSectionUser from "../ListSection/EnderecoListSection/EnderecoListSection";
import MicroAreaListSectionUser from "../ListSection/MicroAreaListSection/MicroAreaListSection";

import FormSelector3 from "../FormSelector3/FormSelector3";

import OcorrenciaIndicadorUser from "../Ocorrencias/MainOcorrencias/OcorrenciaIndicadorUser";
import OcorrenciaPotencialidadeUser from "../Ocorrencias/MainOcorrencias/OcorrenciaPotencialidadesUser";
import OcorrenciaRiscoUser from "../Ocorrencias/MainOcorrencias/OcorrenciaRiscoUser";

export default function FormSelectorUser() {
  const [select, setSelect] = useState(0);

  const { width } = useWindowDimensions();

  const isMobile = width <= 768;

  const forms = [
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
        return <MicroAreaListSectionUser />;

      case 1:
        return <EnderecoListSectionUser />;

      case 2:
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
        {/* MENU LATERAL */}
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

        {/* ÁREA PRINCIPAL */}
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