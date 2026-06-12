// CONFIGURAÇÃO DO BANCO DE DADOS DA BASE - TOTALMENTE CONECTADO
const SUPABASE_URL = "https://wfzqaunhepnvvelkidpd.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmenFhdW5oZXBudnZlbGtpZHBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyMTMyMDksImV4cCI6MjA5Njc4OTIwOX0.5XapEN9w8T2t_hCa9lFSEuGUmXTaVapE0YSYhF6E1pw7";

// Inicializa o cliente do Supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Função para SALVAR uma nova conta no banco de dados.
 */
async function salvarNovaConta(nome, email, senha) {
    try {
        const { data, error } = await supabaseClient
            .from('agentes_base')
            .insert([{ nome: nome, email: email, senha: senha }])
            .select();

        if (error) throw error;

        // Guarda o ID do agente atual logado no navegador
        localStorage.setItem('agente_atual_id', data[0].id);
        return { numErro: null, dados: data[0] };
    } catch (error) {
        console.error("Erro ao transmitir dados para a Base de Sangue:", error.message);
        return { numErro: error.message, dados: null };
    }
}

/**
 * Função para ATUALIZAR e SALVAR tudo o que o mestre criar ou editar (sessões, pistas, imagens)
 */
async function salvarProgressoMestre(novosDados) {
    const agenteId = localStorage.getItem('agente_atual_id');
    
    if (!agenteId) {
        alert("Erro de autorização: Nenhum agente logado no terminal.");
        return;
    }

    try {
        const { data, error } = await supabaseClient
            .from('agentes_base')
            .update({ dados_criados: novosDados })
            .eq('id', agenteId);

        if (error) throw error;
        console.log("Alterações salvas com sucesso no servidor da Ordem!");
    } catch (error) {
        console.error("Falha ao salvar edições:", error.message);
    }
}

/**
 * Função para CARREGAR os dados salvos do mestre de verdade direto do banco de dados
 */
async function carregarDadosDoMestre() {
    const agenteId = localStorage.getItem('agente_atual_id');
    if (!agenteId) return null;

    try {
        const { data, error } = await supabaseClient
            .from('agentes_base')
            .select('*')
            .eq('id', agenteId)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erro ao recuperar arquivos confidenciais:", error.message);
        return null;
    }
}
