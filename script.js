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
  const pioneiroRegHoras = document.getElementById("pioneiroReg").value;

  if (!grupoPermitido.includes(nome)) {
    document.getElementById("mensagem").innerText = "Você não é deste grupo.";
    document.getElementById("mensagem").style.color = "red";
    return;
  }

  if (pioneiroRegHoras && !pioneirosRegulares.includes(nome)) {
    document.getElementById("mensagem").innerText = "Você não é pioneiro regular.";
    document.getElementById("mensagem").style.color = "red";
    return;
  }

  document.getElementById("mensagem").style.color = "green";
  document.getElementById("mensagem").innerText = "Formulário enviado com sucesso!";
  this.reset();
});
