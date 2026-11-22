import Toast from 'react-native-toast-message';
export default function OKMsg(msg) {
    //console.log("Acessar Sistema");
    Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: `${msg}`,
        position: "top",
        visibilityTime: 4000,
    });
}