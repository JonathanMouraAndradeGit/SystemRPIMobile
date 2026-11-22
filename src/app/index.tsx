
/*
import HomeSection from "./page/Main/Main";
import LoginPage from "./page/LoginPage/LoginPage";

import Usuarios from "./Component/UserList/UserModal";
import FormSelector from "./Component/FormSelector/FormSelector";
import FormSelector2 from "./Component/Form2/FormSelector2";
import FormSelectorUser from "./Component/FormSelector/FormSelectorUser";

import DashFilter from "./page/DashFilter/DashFilter";
import InfoMapComp from "./page/InfoMapComp/InfoMapComp";
*/
import HomeSection from "@/components/HomeScreen/HomeScreen";
import NavBar from "@/components/NavBar/NavBar";
import Toast from "react-native-toast-message";

export default function App() {

    return (
        <>
            <NavBar />
            {/* HOME */}
            <HomeSection />
            {/* LOGIN 
                <Stack.Screen
                    name="Login"
                    component={LoginPage}
                />
                 USUÁRIOS 

                <Stack.Screen
                    name="UserList"
                    component={Usuarios}
                />
                 FORMULÁRIO ADMIN
                <Stack.Screen
                    name="AdminForm"
                    component={FormSelector}
                />
                 FORMULÁRIO USUÁRIO
                <Stack.Screen
                    name="UserForm"
                    component={FormSelectorUser}
                />
                 FORMULÁRIO 2 
                <Stack.Screen
                    name="Form2"
                    component={FormSelector2}
                />
                 DASHBOARD 
                <Stack.Screen
                    name="Dashboard"
                    component={DashFilter}
                />
                 MAPA 
                <Stack.Screen
                    name="Map"
                    component={InfoMapComp}
                />
                */}
                <Toast></Toast>
        </>
    );
}