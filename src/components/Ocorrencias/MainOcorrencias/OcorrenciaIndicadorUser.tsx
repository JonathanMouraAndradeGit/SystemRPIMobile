//import Ocorrencias from "../MainOcorrenciasv3/mainOcorrencias";
import OcorrenciasUser from "./MainOcorrenciasUser";
export default function OcorrenciaIndicadorUser() {
    let obj = {
        pageTitle: "Cadastro de Indicadores de Saúde",

        newButtonLabel: "Novo Indicador",

        exportTitle: "Indicadores de Saúde",

        ocorrenciaEndpoint: "ocorrencias-indicadores-saude",

        categoriaEndpoint: "categorias-indicadores-saude",

        tipoEndpoint: "tipos-indicadores-saude",

        tipoField: "tipoIndicadorSaudeId",

        tipoRelation: "tipoIndicadorSaude",

        tipoLabel: "Tipo de Indicador"
    }
    return <OcorrenciasUser config={obj}></OcorrenciasUser>
}