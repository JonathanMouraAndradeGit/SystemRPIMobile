import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
} from "react-native";

import ResponsiveButton from "@/components/ResponsiveForm/ResponsiveForm";
import SelectInput from "@/components/SelectInput/SelectInput";
import TxtInput from "@/components/TXTInput/TxtInput";

import apiFetch from "@/components/FetchFunc/APIFetch";

const INITIAL_FORM = {
  nome: "",
  categoriaId: "",
};

export default function TipoSimplesForm({
  endpoint,
  categoriaEndpoint,
  titulo,
  categoriaLabel,
  obj,
  onSuccess,
}:any) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [categoriaList, setCategoriaList] = useState([]);
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const getCacheKey = useCallback(
    () => `categorias_${categoriaEndpoint}`,
    [categoriaEndpoint]
  );

  const loadCategorias = useCallback(async () => {
    try {
      const cacheKey = getCacheKey();

      // Primeiro tenta carregar do AsyncStorage
      const cached = await AsyncStorage.getItem(cacheKey);

      if (cached) {
        setCategoriaList(JSON.parse(cached));
      }

      // Depois busca os dados atualizados da API
      const response = await apiFetch(
        `${process.env.EXPO_PUBLIC_BACK_ROUTE}/${categoriaEndpoint}`
      );

      if (!response.ok) {
        throw new Error("Erro ao carregar categorias");
      }

      const data = await response.json();

      setCategoriaList(data);

      // Salva no AsyncStorage para utilização futura
      await AsyncStorage.setItem(cacheKey, JSON.stringify(data));
    } catch (err) {
      console.error("Erro ao carregar categorias:", err);

      // Se a API falhar, tenta utilizar o cache
      try {
        const cached = await AsyncStorage.getItem(getCacheKey());

        if (cached) {
          setCategoriaList(JSON.parse(cached));
        }
      } catch (cacheError) {
        console.error("Erro ao carregar cache:", cacheError);
      }
    }
  }, [categoriaEndpoint, getCacheKey]);

  useEffect(() => {
    loadCategorias();

    if (obj) {
      setForm({
        nome: obj.nome ?? "",
        categoriaId: obj.categoria?.id
          ? String(obj.categoria.id)
          : "",
      });
    } else {
      setForm(INITIAL_FORM);
    }

    setErrors({});
  }, [obj, loadCategorias]);

  function handleNomeChange(value:any) {
    setForm((prev) => ({
      ...prev,
      nome: value,
    }));

    setErrors((prev:any) => ({
      ...prev,
      nome: "",
    }));
  }

  function handleCategoriaChange(value:any) {
    setForm((prev) => ({
      ...prev,
      categoriaId: value,
    }));

    setErrors((prev:any) => ({
      ...prev,
      categoriaId: "",
    }));
  }

  function validate() {
    const err:any = {};

    if (!form.nome.trim()) {
      err.nome = "Campo obrigatório";
    }

    if (!form.categoriaId) {
      err.categoriaId = "Selecione uma categoria";
    }

    setErrors(err);

    return Object.keys(err).length === 0;
  }

  async function submit() {
    if (!validate()) {
      return;
    }

    const url = obj
      ? `${process.env.EXPO_PUBLIC_BACK_ROUTE}/${endpoint}/${obj.id}`
      : `${process.env.EXPO_PUBLIC_BACK_ROUTE}/${endpoint}`;

    const method = obj ? "PATCH" : "POST";

    try {
      setLoading(true);

      const response = await apiFetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: form.nome.trim(),
          categoriaId: Number(form.categoriaId),
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar registro");
      }

      Alert.alert(
        "Sucesso",
        "Registro salvo com sucesso!"
      );

      setForm(INITIAL_FORM);
      setErrors({});

      onSuccess?.();
    } catch (err) {
      console.error(err);

      Alert.alert(
        "Erro",
        "Erro ao salvar o registro."
      );
    } finally {
      setLoading(false);
    }
  }

  const options = categoriaList.map((categoria:any) => ({
    value: String(categoria.id),
    label: categoria.nome,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {titulo}
      </Text>

      <TxtInput
        id="nome"
        name="nome"
        label="Nome"
        value={form.nome}
        onChangeText={handleNomeChange}
        error={errors.nome}
      />

      <SelectInput
        id="categoriaId"
        name="categoriaId"
        label={categoriaLabel}
        value={form.categoriaId}
        onChange={handleCategoriaChange}
        error={errors.categoriaId}
        options={options}
      />

      <View style={styles.buttons}>
        <ResponsiveButton
          disabled={loading}
          onPress={submit}
        >
          {loading
            ? "Salvando..."
            : obj
              ? "Atualizar"
              : "Cadastrar"}
        </ResponsiveButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: "#222",
  },

  buttons: {
    marginTop: 20,
  },
});