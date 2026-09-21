import * as XLSX from "xlsx";
export default function exportarOcorrenciasExcel2(ocorrencias, field, label) {

    const dados = ocorrencias.map((ocorrencia) => ({

        Categoria: ocorrencia[field].categoria.nome,

        [label]: ocorrencia[field].nome,

        Micro: ocorrencia.endereco.microArea.codigo,

        Equipe: ocorrencia.endereco.microArea.equipe,

        Logradouro: ocorrencia.endereco.logradouro,

        Número: ocorrencia.endereco.numero,

        UBS: ocorrencia.endereco.microArea.ubs.nome,

        Cidade: ocorrencia.endereco.microArea.ubs.cidade,

        Data: new Date(
            ocorrencia.dataReferencia
        ).toLocaleDateString("pt-BR"),

        GeoCode: `${ocorrencia.endereco.latitude},${ocorrencia.endereco.longitude}`

    }));

    const worksheet = XLSX.utils.json_to_sheet(dados);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Ocorrências"
    );

    worksheet["!cols"] = [
        { wch: 20 }, // Categoria
        { wch: 25 }, // Campo dinâmico
        { wch: 10 }, // Micro
        { wch: 18 }, // Equipe
        { wch: 30 }, // Logradouro
        { wch: 10 }, // Número
        { wch: 25 }, // UBS
        { wch: 18 }, // Cidade
        { wch: 15 }, // Data
        { wch: 30 }, // GeoCode
    ];

    XLSX.writeFile(workbook, "ocorrencias.xlsx");

}
/*


import * as XLSX from "xlsx";

function criarSheetOcorrencias(ocorrencias, field, label) {
    const dados = ocorrencias.map((ocorrencia) => ({
        Categoria: ocorrencia[field].categoria.nome,

        [label]: ocorrencia[field].nome,

        Micro: ocorrencia.endereco.microArea.codigo,

        Equipe: ocorrencia.endereco.microArea.equipe,

        Logradouro: ocorrencia.endereco.logradouro,

        Número: ocorrencia.endereco.numero,

        UBS: ocorrencia.endereco.microArea.ubs.nome,

        Cidade: ocorrencia.endereco.microArea.ubs.cidade,

        Data: new Date(
            ocorrencia.dataReferencia
        ).toLocaleDateString("pt-BR"),

        GeoCode: `${ocorrencia.endereco.latitude},${ocorrencia.endereco.longitude}`
    }));

    const worksheet = XLSX.utils.json_to_sheet(dados);

    worksheet["!cols"] = [
        { wch: 20 }, // Categoria
        { wch: 25 }, // Campo dinâmico
        { wch: 10 }, // Micro
        { wch: 18 }, // Equipe
        { wch: 30 }, // Logradouro
        { wch: 10 }, // Número
        { wch: 25 }, // UBS
        { wch: 18 }, // Cidade
        { wch: 15 }, // Data
        { wch: 30 }, // GeoCode
    ];

    return worksheet;
}

export function exportarOcorrenciasExcel(
    riscos,
    potencialidades,
    indicadores
) {
    const workbook = XLSX.utils.book_new();

    // Sheet de Riscos
    const sheetRiscos = criarSheetOcorrencias(
        riscos,
        "risco",
        "Risco"
    );

    XLSX.utils.book_append_sheet(
        workbook,
        sheetRiscos,
        "Riscos"
    );

    // Sheet de Potencialidades
    const sheetPotencialidades = criarSheetOcorrencias(
        potencialidades,
        "potencialidade",
        "Potencialidade"
    );

    XLSX.utils.book_append_sheet(
        workbook,
        sheetPotencialidades,
        "Potencialidades"
    );

    // Sheet de Indicadores
    const sheetIndicadores = criarSheetOcorrencias(
        indicadores,
        "indicadorSaude",
        "Indicador de Saúde"
    );

    XLSX.utils.book_append_sheet(
        workbook,
        sheetIndicadores,
        "Indicadores"
    );

    XLSX.writeFile(
        workbook,
        "ocorrencias.xlsx"
    );
}*/