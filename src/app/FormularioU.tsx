import FormSelectorUser from "@/components/FormSelector/FormSelectorUser";
import NavBar from "@/components/NavBar/NavBar";
import { StyleSheet, View } from "react-native";

export default function FormularioU() {
  return (
    <View style={styles.container}>
      {/* Barra superior */}
      <View style={styles.navbar}>
        <NavBar />
      </View>

      {/* Área limitada para os formulários */}
      <View style={styles.content}>
        <FormSelectorUser />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#f5f7f5",
  },

  navbar: {
    width: "100%",
    flexShrink: 0,
  },

  content: {
    flex: 1,

    width: "100%",

    /*
     * Fundamental para ScrollView dos filhos.
     * Permite que o conteúdo interno encolha
     * dentro da área disponível.
     */
    minHeight: 0,
    minWidth: 0,

    overflow: "hidden",
  },
});