import { Alert } from "react-native";

export default function OKMsg(
    msg: string = "Operação realizada com sucesso!"
): Promise<void> {

    return new Promise((resolve:any) => {

        Alert.alert(
            "Sucesso!",
            msg,
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