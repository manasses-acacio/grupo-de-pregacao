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
setInterval(atualizarTempo, 1000);

function gerarCalendario() {
  const calendario = document.getElementById("calendario");
  const hoje = new Date();
  const diaAtual = hoje.getDate();
  const mes = hoje.getMonth();
  const ano = hoje.getFullYear();

  const ultimoDia = new Date(ano, mes + 1, 0).getDate();

  for (let dia = 1; dia <= ultimoDia; dia++) {
    const divDia = document.createElement("div");
    divDia.textContent = dia;

    if (dia === diaAtual) {
      divDia.classList.add("hoje");
    }

    calendario.appendChild(divDia);
    divDia.addEventListener("click", () => abrirAgenda(dia));
  }
}

gerarCalendario();

function abrirAgenda(dia) {
  document.getElementById("agendaDia").textContent = "Anotações do dia " + dia;
  document.getElementById("agendaModal").style.display = "block";

  const notaSalva = localStorage.getItem("nota_" + dia);
  document.getElementById("nota").value = notaSalva || "";
}

function fecharAgenda() {
  document.getElementById("agendaModal").style.display = "none";
}

function salvarNota() {
  const dia = document.getElementById("agendaDia").textContent.split(" ")[3];
  const texto = document.getElementById("nota").value;
  localStorage.setItem("nota_" + dia, texto);
  alert("Nota salva para o dia " + dia);
  fecharAgenda();
}

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