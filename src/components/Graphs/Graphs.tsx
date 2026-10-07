import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
    BarChart,
    LineChart,
    PieChart,
} from 'react-native-gifted-charts';

const { width } = Dimensions.get('window');

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#845EC2',
  '#D65DB1',
];

export default function Graphs({ dashboard, setDashboard }:any) {
  if (!dashboard) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  const graficos = dashboard.graficos;

  /*
   * Converte os dados da API para o formato
   * utilizado pelo react-native-gifted-charts.
   */

  const categoriaData = (graficos?.categoria || []).map(
    (item:any, index:any) => ({
      value: Number(item.total),
      color: COLORS[index % COLORS.length],
      text: item.categoria,
    })
  );

  const ubsData = (graficos?.ubs || []).map((item:any) => ({
    value: Number(item.total),
    label: item.ubs,
  }));

  const mesData = (graficos?.mes || []).map((item:any) => ({
    value: Number(item.total),
    label: item.mes,
  }));

  const tipoData = (graficos?.tipo || []).map(
    (item:any, index:any) => ({
      value: Number(item.total),
      color: COLORS[index % COLORS.length],
      text: item.tipo,
    })
  );

  const cidadeData = (graficos?.cidade || []).map((item:any) => ({
    value: Number(item.total),
    label: item.cidade,
  }));

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >

      {/* ==============================
          OCORRÊNCIAS POR CATEGORIA
      =============================== */}

      <View style={styles.box}>
        <Text style={styles.title}>
          Ocorrências por Categoria
        </Text>

        {categoriaData.length > 0 ? (
          <View style={styles.chartContainer}>
            <PieChart
              data={categoriaData}
              radius={100}
              textColor="#FFFFFF"
              textSize={12}
              showText
              focusOnPress
            />
          </View>
        ) : (
          <Text style={styles.noData}>
            Nenhum dado disponível
          </Text>
        )}
      </View>

      {/* ==============================
          OCORRÊNCIAS POR UBS
      =============================== */}

      <View style={styles.box}>
        <Text style={styles.title}>
          Ocorrências por UBS
        </Text>

        {ubsData.length > 0 ? (
          <View style={styles.chartContainer}>
            <BarChart
              data={ubsData}
              width={width - 80}
              height={220}
              barWidth={30}
              spacing={20}
              frontColor="#00C49F"
              roundedTop
              hideRules={false}
              yAxisTextStyle={styles.axisText}
              xAxisLabelTextStyle={styles.axisText}
              noOfSections={5}
              isAnimated
            />
          </View>
        ) : (
          <Text style={styles.noData}>
            Nenhum dado disponível
          </Text>
        )}
      </View>

      {/* ==============================
          EVOLUÇÃO MENSAL
      =============================== */}

      <View style={styles.box}>
        <Text style={styles.title}>
          Evolução Mensal
        </Text>

        {mesData.length > 0 ? (
          <View style={styles.chartContainer}>
            <LineChart
              data={mesData}
              width={width - 80}
              height={220}
              color="#0088FE"
              thickness={3}
              dataPointsColor="#0088FE"
              dataPointsRadius={5}
              curved
              hideRules={false}
              yAxisTextStyle={styles.axisText}
              xAxisLabelTextStyle={styles.axisText}
              noOfSections={5}
              isAnimated
            />
          </View>
        ) : (
          <Text style={styles.noData}>
            Nenhum dado disponível
          </Text>
        )}
      </View>

      {/* ==============================
          TIPOS DE RISCO
      =============================== */}

      <View style={styles.box}>
        <Text style={styles.title}>
          Tipos de Risco
        </Text>

        {tipoData.length > 0 ? (
          <View style={styles.chartContainer}>
            <PieChart
              data={tipoData}
              radius={80}
              textColor="#FFFFFF"
              textSize={12}
              showText
              focusOnPress
            />
          </View>
        ) : (
          <Text style={styles.noData}>
            Nenhum dado disponível
          </Text>
        )}
      </View>

      {/* ==============================
          CIDADES
      =============================== */}

      <View style={styles.box}>
        <Text style={styles.title}>
          Cidades
        </Text>

        {cidadeData.length > 0 ? (
          <View style={styles.chartContainer}>
            <BarChart
              data={cidadeData}
              width={width - 80}
              height={220}
              barWidth={30}
              spacing={20}
              frontColor="#FF8042"
              roundedTop
              hideRules={false}
              yAxisTextStyle={styles.axisText}
              xAxisLabelTextStyle={styles.axisText}
              noOfSections={5}
              isAnimated
            />
          </View>
        ) : (
          <Text style={styles.noData}>
            Nenhum dado disponível
          </Text>
        )}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  box: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,

    elevation: 3,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
  },

  chartContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  axisText: {
    color: '#666666',
    fontSize: 10,
  },

  noData: {
    textAlign: 'center',
    color: '#888888',
    paddingVertical: 40,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    fontSize: 18,
    color: '#666666',
  },
});