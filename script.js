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
    divDia.addEventListener("click", () => abrirAgenda(dia));

  }
}

gerarCalendario();
function abrirAgenda(dia) {
  document.getElementById("agendaDia").textContent = "Anotações do dia " + dia;
  document.getElementById("agendaModal").style.display = "block";

  // Carregar nota salva (se existir)
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
window.addEventListener("scroll", () => {
  const card3 = document.querySelector(".card.overlap:nth-of-type(3)");
  const card4 = document.querySelector(".card.overlap:nth-of-type(4)");

  const rect3 = card3.getBoundingClientRect();
  const rect4 = card4.getBoundingClientRect();

  // Quando o Card 4 chega perto do Card 3, aplica a sobreposição
  if (rect4.top < rect3.bottom - 40) {
    card4.style.zIndex = 20; // Card 4 por cima
    card3.style.zIndex = 10; // Card 3 por baixo
  } else {
    card4.style.zIndex = 10; // volta ao normal
    card3.style.zIndex = 20;
  }
});
window.addEventListener("scroll", () => {
  const card3 = document.querySelector(".card.overlap:nth-of-type(3)");
  const card4 = document.querySelector(".card.overlap:nth-of-type(4)");

  const rect3 = card3.getBoundingClientRect();
  const rect4 = card4.getBoundingClientRect();

  // Quando o Card 4 se aproxima do Card 3
  if (rect4.top < rect3.bottom - 40) {
    card4.style.zIndex = 20;
    card4.style.opacity = 1;          // aparece totalmente
    card4.style.transform = "translateY(0)"; // posição normal
    card3.style.opacity = 0.6;        // fica mais transparente
    card3.style.transform = "scale(0.98)"; // leve redução
  } else {
    card4.style.zIndex = 10;
    card4.style.opacity = 0.8;        // começa mais suave
    card4.style.transform = "translateY(20px)"; // leve deslocamento
    card3.style.opacity = 1;          // volta ao normal
    card3.style.transform = "scale(1)";
  }
});


