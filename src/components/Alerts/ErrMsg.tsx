import { Alert } from "react-native";

export default function ErrMsg(
    error: any = "Ocorreu um erro inesperado."
): Promise<void> {

    const message =
        error instanceof Error
            ? error.message
            : typeof error === "string"
                ? error
                : error?.response?.data?.message ||
                  error?.message ||
                  "Ocorreu um erro inesperado.";

    return new Promise((resolve:any) => {

        Alert.alert(
            "Erro!",
            message,
            [
                {
                    text: "OK",
                    onPress: resolve,
                },
            ],
            {
                cancelable: false,
            }
        );

    });
}