import OcorrenciasUser from "./MainOcorrenciasUser";
export default function OcorrenciaRiscoUser() {
    let obj = {
        pageTitle: "Cadastro de Risco",

        newButtonLabel: "Novo Risco",

        exportTitle: "Riscos",

        ocorrenciaEndpoint: "ocorrencias",

        categoriaEndpoint: "categorias-risco",

        tipoEndpoint: "tipos-risco",

        tipoField: "tipoRiscoId",

        tipoRelation: "tipoRisco",

        tipoLabel: "Tipo de Risco"

        //ocorrenciaEndpoint: "ocorrencias-potencialidades",

        //categoriaEndpoint: "categorias-potencialidades",

        //tipoEndpoint: "tipos-potencialidade",

        //tipoField: "tipoPotencialidadeId",

        //tipoRelation: "tipoPotencialidade",

        //tipoLabel: "Tipo de Potencialidade"
    }
    return <OcorrenciasUser config={obj}></OcorrenciasUser>
}
