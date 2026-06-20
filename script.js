function atualizarTempo() {
    const agora = new Date();

    // Formata a data no padrão brasileiro (DD/MM/AAAA)
    const opcoesData = {weekday: 'long', day: '2-digit', month: '2-digit', year:'numeric' };
    const dataBruta = agora.toLocaleDateString('pt-BR', opcoesData).toUpperCase();
    const dataFormatada = dataBruta.charAt(0).toUpperCase() + dataBruta.slice(1);

    // Formata a hora (HH:MM:SS)
    const opcoesHora = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const horaFormatada = agora.toLocaleTimeString('pt-BR', opcoesHora);

    // Insere os valores formatados dentro do HTML
    document.getElementById('data').textContent = dataFormatada;
    document.getElementById('hora').textContent = horaFormatada;
}

// Executa a função imediatamente ao carregar a página
atualizarTempo();

// Atualiza a função a cada 1 segundo (1000 milissegundos)
setInterval(atualizarTempo, 1000);

function gerarCalendario() {
  const calendario = document.getElementById("calendario");
  const hoje = new Date();
  const diaAtual = hoje.getDate();
  const mes = hoje.getMonth();
  const ano = hoje.getFullYear();

  // Último dia do mês
  const ultimoDia = new Date(ano, mes + 1, 0).getDate();

  for (let dia = 1; dia <= ultimoDia; dia++) {
    const divDia = document.createElement("div");
    divDia.textContent = dia;

    if (dia === diaAtual) {
      divDia.classList.add("hoje");
    }

    calendario.appendChild(divDia);
  }
}

gerarCalendario();

