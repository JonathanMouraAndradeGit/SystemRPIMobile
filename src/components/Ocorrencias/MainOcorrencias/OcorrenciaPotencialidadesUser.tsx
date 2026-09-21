
//import Ocorrencias from "../MainOcorrenciasv3/mainOcorrencias";
import OcorrenciasUser from "./MainOcorrenciasUser";
export default function OcorrenciaPotencialidadeUser() {
    let obj = {
        pageTitle: "Cadastro de Potencialidades",

        newButtonLabel: "Nova Potencialidade",

        exportTitle: "Potencialidades",

        ocorrenciaEndpoint: "ocorrencias-potencialidades",

        categoriaEndpoint: "categorias-potencialidades",

        tipoEndpoint: "tipos-potencialidade",

        tipoField: "tipoPotencialidadeId",

        tipoRelation: "tipoPotencialidade",

        tipoLabel: "Tipo de Potencialidade"
    }
    return <OcorrenciasUser config={obj}></OcorrenciasUser>
}