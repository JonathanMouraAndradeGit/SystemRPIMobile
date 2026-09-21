import { Alert } from "react-native";

export default function ConfirmMsg(
  msg: string = "Tem certeza que deseja continuar?",
  onConfirm?: () => void | Promise<void>
): void {
  Alert.alert(
    "Tem certeza?",
    msg,
    [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sim, continuar",
        style: "destructive",
        onPress: () => {
          if (onConfirm) {
            Promise.resolve(onConfirm()).catch((error) => {
              console.error("Erro no onConfirm:", error);
            });
          }
        },
      },
    ],
    {
      cancelable: false,
    }
  );
}