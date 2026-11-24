// Ajudantes para trabalhar com data/hora no formato brasileiro.
// A API usa ISO 8601 (2027-01-15T17:30:00.000Z); a tela usa DD/MM/AAAA e HH:MM.

const dois = (numero: number) => String(numero).padStart(2, "0");

// Enquanto o usuário digita "25122026" vira "25/12/2026"
export function mascaraData(texto: string): string {
    const n = texto.replace(/\D/g, "").slice(0, 8);
    if (n.length <= 2) return n;
    if (n.length <= 4) return `${n.slice(0, 2)}/${n.slice(2)}`;
    return `${n.slice(0, 2)}/${n.slice(2, 4)}/${n.slice(4)}`;
}

// "1430" vira "14:30"
export function mascaraHora(texto: string): string {
    const n = texto.replace(/\D/g, "").slice(0, 4);
    if (n.length <= 2) return n;
    return `${n.slice(0, 2)}:${n.slice(2)}`;
}

// Junta "25/12/2026" + "14:30" (hora local do celular) em uma data ISO para a API.
// Lança um Error com mensagem amigável se algo estiver errado.
export function dataHoraParaISO(dataTexto: string, horaTexto: string): string {
    const d = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dataTexto);
    const h = /^(\d{2}):(\d{2})$/.exec(horaTexto);

    if (!d) throw new Error("Informe a data no formato DD/MM/AAAA");
    if (!h) throw new Error("Informe a hora no formato HH:MM");

    const dia = Number(d[1]);
    const mes = Number(d[2]);
    const ano = Number(d[3]);
    const hora = Number(h[1]);
    const minuto = Number(h[2]);

    const data = new Date(ano, mes - 1, dia, hora, minuto, 0, 0);

    // O JavaScript "corrige" datas impossíveis (31/02 vira 03/03), então conferimos:
    const valida =
        data.getFullYear() === ano &&
        data.getMonth() === mes - 1 &&
        data.getDate() === dia &&
        hora <= 23 &&
        minuto <= 59;

    if (!valida) throw new Error("Data ou hora inválida");

    return data.toISOString();
}

// ISO da API -> campos de data e hora (hora local do celular) para o formulário
export function isoParaCampos(iso: string): { data: string; hora: string } {
    const d = new Date(iso);
    return {
        data: `${dois(d.getDate())}/${dois(d.getMonth() + 1)}/${d.getFullYear()}`,
        hora: `${dois(d.getHours())}:${dois(d.getMinutes())}`,
    };
}

export function formatarDataHora(iso: string): string {
    const { data, hora } = isoParaCampos(iso);
    return `${data} às ${hora}`;
}

export function formatarPreco(valor: number): string {
    return `R$ ${valor.toFixed(2).replace(".", ",")}`;
}
