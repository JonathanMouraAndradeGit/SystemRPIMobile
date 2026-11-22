import Toast from 'react-native-toast-message';
export default function ErrMsg(msg) {
    //console.log("Acessar Sistema");
    Toast.show({
        type: "Error",
        text1: "Error",
        text2: `${msg}`,
        position: "top",
        visibilityTime: 4000,
    });
}