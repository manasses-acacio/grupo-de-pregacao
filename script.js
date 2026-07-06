// ==========================================
// 1. O SEU RELÓGIO (Não mexemos aqui)
// ==========================================
function atualizarTempo() {
  const agora = new Date();
  const opcoesData = { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' };
  const dataBruta = agora.toLocaleDateString('pt-BR', opcoesData);
  const dataFormatada = dataBruta.charAt(0).toUpperCase() + dataBruta.slice(1);

  const opcoesHora = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const horaFormatada = agora.toLocaleTimeString('pt-BR', opcoesHora);

  document.getElementById('data').textContent = dataFormatada;
  document.getElementById('hora').textContent = horaFormatada;
}

atualizarTempo();
setInterval(atualizarTempo, 1000); // Atualiza a cada 1 segundo

// ==========================================
// 2. O SEU CALENDÁRIO (Desenha os dias)
// ==========================================

// Variáveis para controlar qual mês/ano estamos visualizando no momento
let dataView = new Date();
let mesAtualView = dataView.getMonth();
let anoAtualView = dataView.getFullYear();

function gerarCalendario() {
  const calendario = document.getElementById("calendario");
  calendario.innerHTML = ""; // Limpa os dias anteriores antes de desenhar o novo mês

  const hoje = new Date();
  
  // Descobre quantos dias tem o mês atual
  const ultimoDia = new Date(anoAtualView, mesAtualView + 1, 0).getDate();
  
  // Descobre em qual dia da semana cai o dia 1º (0 = Domingo, 1 = Segunda, ..., 6 = Sábado)
  const diaSemanaInicio = new Date(anoAtualView, mesAtualView, 1).getDay(); 

  // Exibe o Nome do Mês e o Ano no HTML
  const nomeMes = new Date(anoAtualView, mesAtualView).toLocaleDateString('pt-BR', { month: 'long' });
  document.getElementById("mes-ano-display").textContent = nomeMes;

  // --- PASSO 1: Cabeçalho com os nomes dos dias da semana ---
  const diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  for (let i = 0; i < 7; i++) {
    const divDiaSemana = document.createElement("div");
    divDiaSemana.textContent = diasDaSemana[i];
    divDiaSemana.style.fontWeight = "bold";
    divDiaSemana.style.fontSize = "0.8rem"; // Letra um pouco menor para caber na grade
    
    // Se for o primeiro dia (Domingo, índice 0), pinta de vermelho
    if (i === 0) {
      divDiaSemana.style.color = "red";
    }
    
    calendario.appendChild(divDiaSemana);
  }

  // --- PASSO 2: Espaços em branco antes do dia 1º ---
  // Isso empurra o dia 1º para cair na coluna correta da semana
  for (let i = 0; i < diaSemanaInicio; i++) {
    const divVazia = document.createElement("div");
    calendario.appendChild(divVazia);
  }

  // --- PASSO 3: Preencher os números dos dias do mês ---
  for (let dia = 1; dia <= ultimoDia; dia++) {
    const divDia = document.createElement("div");
    divDia.textContent = dia;

    // A matemática abaixo descobre se a coluna atual é Domingo. Se for, pinta de vermelho.
    if ((diaSemanaInicio + dia - 1) % 7 === 0) {
      divDia.style.color = "red";
      divDia.style.fontWeight = "bold";
    }

    // Marca o dia de "hoje" com a sua classe CSS
    if (dia === hoje.getDate() && mesAtualView === hoje.getMonth() && anoAtualView === hoje.getFullYear()) {
      divDia.classList.add("hoje");
    }

    calendario.appendChild(divDia);
  }
}

// Evento para voltar um mês
document.getElementById("btn-mes-anterior").addEventListener("click", () => {
  mesAtualView--;
  if (mesAtualView < 0) {
    mesAtualView = 11; // Volta para dezembro
    anoAtualView--;    // Volta um ano
  }
  gerarCalendario();
});

// Evento para avançar um mês
document.getElementById("btn-mes-proximo").addEventListener("click", () => {
  mesAtualView++;
  if (mesAtualView > 11) {
    mesAtualView = 0;  // Vai para janeiro
    anoAtualView++;    // Avança um ano
  }
  gerarCalendario();
});

gerarCalendario();

// ==========================================
// 3. A NOVA AGENDA (O modelo que você gostou)
// ==========================================

// Ao clicar em qualquer lugar do calendário, abre o modal
document.getElementById('calendario').addEventListener('click', function() {
    document.getElementById('modal-agenda').style.display = 'flex';
});

// Fechar o modal
function fecharModal() {
    document.getElementById('modal-agenda').style.display = 'none';
}

// Salvar o lembrete
function salvarLembrete() {
    const inputDataHora = document.getElementById('data-hora-lembrete').value;
    const inputMensagem = document.getElementById('mensagem-lembrete').value;
    const inputAnotacoes = document.getElementById('anotacoes-lembrete').value; 

    if (!inputDataHora || !inputMensagem) {
        alert("⚠️ Por favor, preencha pelo menos a data e o aviso principal!");
        return;
    }

    let lembretes = JSON.parse(localStorage.getItem('minhaAgenda')) || [];
    
    lembretes.push({
        tempoEmMilissegundos: new Date(inputDataHora).getTime(),
        texto: inputMensagem,
        anotacoes: inputAnotacoes, 
        jaFoiAvisado: false
    });

    localStorage.setItem('minhaAgenda', JSON.stringify(lembretes));
    alert("✅ Lembrete salvo com sucesso!");
    fecharModal();
    
    // Limpa os campos para o próximo agendamento
    document.getElementById('data-hora-lembrete').value = "";
    document.getElementById('mensagem-lembrete').value = "";
    document.getElementById('anotacoes-lembrete').value = "";
}

// O relógio oculto que checa os alarmes a cada 10 segundos
setInterval(function() {
    let lembretes = JSON.parse(localStorage.getItem('minhaAgenda')) || [];
    let tempoAtual = new Date().getTime(); 
    let teveAlteracao = false;

    lembretes.forEach(lembrete => {
        if (tempoAtual >= lembrete.tempoEmMilissegundos && lembrete.jaFoiAvisado === false) {
            
            let mensagemDoAlerta = "⏰ AVISO DA AGENDA:\n\n" + lembrete.texto;
            
            if (lembrete.anotacoes && lembrete.anotacoes.trim() !== "") {
                mensagemDoAlerta += "\n\n📝 ANOTAÇÕES:\n" + lembrete.anotacoes;
            }
            
            alert(mensagemDoAlerta);
            
            lembrete.jaFoiAvisado = true; 
            teveAlteracao = true;
        }
    });

    if (teveAlteracao) {
        localStorage.setItem('minhaAgenda', JSON.stringify(lembretes));
    }
}, 10000);

// Listas em minúsculo
const pioneirosRegulares = ["andré almeida de souza", "alessandra dionisio dos santos", "ana carolina", "manassés acácio"];

const grupoPermitido = ["andré almeida de souza", "alessandra dionisio dos santos", "ana carolina", "amanda santos", "anacilia araujo", "analice santos", "edilene matos", "elisangela santos", "enzo dionisio dos santos", "erik ferreira", "gicelia peron de santana", "ivanice lira", "josé ailton lira", "larissa guedes", "larissa lira", "lucas bittencourt", "manassés acácio", "marcia pereira", "roque santos", "vanuza lira"];

// Alterna formulário
document.getElementById("relatorio").addEventListener("click", () => {
  const formContainer = document.getElementById("form-container");
  formContainer.style.display = formContainer.style.display === "none" ? "block" : "none";
});

// Validação
document.getElementById("formulario").addEventListener("submit", function(event) {
  event.preventDefault();
  const nome = document.getElementById("nome").value.trim().toLowerCase();

  document.getElementById("limpar").addEventListener("click", function() {
    document.getElementById("mensagem").innerText = "";
    document.getElementById("mensagem").style.color = "";
    document.getElementById("mensagem").className = "";
  });

  // Primeiro: só quem está no grupo permitido pode enviar
  if (!grupoPermitido.includes(nome)) {
    document.getElementById("mensagem").innerText = "Você não é deste grupo.";
    document.getElementById("mensagem").style.color = "red";
    return;
  }

  // Pega os valores preenchidos nos campos de horas
  const horasPioneiroReg = document.getElementById("pioneiroReg").value.trim();
  const horasPioneiroAux = document.getElementById("pioneiroAux").value.trim();

  // Se NÃO for pioneiro regular e tentou enviar horas no campo de Pioneiro Regular
  if (!pioneirosRegulares.includes(nome) && horasPioneiroReg !== "") {
    document.getElementById("mensagem").innerText = "Você Não É Pioneiro Regular";
    document.getElementById("mensagem").style.color = "red";
    return;
  }

  // Se FOR pioneiro regular, não pode marcar publicador nem preencher Pioneiro Auxiliar
  if (pioneirosRegulares.includes(nome)) {
    // Aqui usamos .checked apenas no publicador, pois ele é do tipo checkbox no HTML
    if (document.getElementById("publicador").checked || horasPioneiroAux !== "") {
      document.getElementById("mensagem").innerText = "Você é Pioneiro Regular e não pode enviar como Publicador ou Auxiliar";
      document.getElementById("mensagem").className = "mensagem-amarela"; // amarelo
      return;
    }
  }
    // --- ADICIONE ESTE BLOCO ---

    // Impede o Pioneiro Regular de enviar em branco ou com zero horas
  if (pioneirosRegulares.includes(nome) && (horasPioneiroReg === "" || horasPioneiroReg === "0")) {
    document.getElementById("mensagem").innerText = "Você deve preencher suas horas de Pioneiro Regular Corretamente!";
    
    // Remove qualquer classe que possa estar atrapalhando
    document.getElementById("mensagem").className = ""; 
    
    // Usa um amarelo mostarda/laranja
    document.getElementById("mensagem").style.color = "#d4b200"; 
    return;
  }
  
  // Se passou em todas as regras
  document.getElementById("mensagem").style.color = "green";
  document.getElementById("mensagem").innerText = "Formulário enviado com sucesso!";
  this.reset();
});
// =========================================================
// BLOQUEIO DINÂMICO DOS CAMPOS DE RELATÓRIO
// =========================================================

// 1. O campo de pioneiro regular começa bloqueado por padrão (pois o campo de nome começa vazio)
document.getElementById("pioneiroReg").disabled = true;

// 2. Escuta cada letra digitada no nome
document.getElementById("nome").addEventListener("input", function() {
  const nomeDigitado = this.value.trim().toLowerCase();
  
  const campoPioneiroReg = document.getElementById("pioneiroReg");
  const campoPioneiroAux = document.getElementById("pioneiroAux");
  const campoPublicador = document.getElementById("publicador");

  // SE FOR PIONEIRO REGULAR:
  if (pioneirosRegulares.includes(nomeDigitado)) {
    // Destrava o campo dele
    campoPioneiroReg.disabled = false;
    
    // Trava os outros campos e apaga o que tiver neles
    campoPioneiroAux.disabled = true;
    campoPioneiroAux.value = ""; 
    
    campoPublicador.disabled = true;
    campoPublicador.checked = false; // checkbox se limpa com "checked = false"
  } 
  // SE NÃO FOR PIONEIRO REGULAR:
  else {
    // Trava o campo de pioneiro regular e apaga o que tiver lá
    campoPioneiroReg.disabled = true;
    campoPioneiroReg.value = ""; 

    // Libera os campos para publicador e pioneiro auxiliar
    campoPioneiroAux.disabled = false;
    campoPublicador.disabled = false;
  }
});