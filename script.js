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
// 3. REGISTRO DE ATIVIDADES MENSAL
// ==========================================

const chaveRegistroAtividades = 'minhasAtividadesRegistro';
const tiposServicoAtividades = ['Campo', 'Estudo', 'Carrinho', 'Informal','Outro'];
let viewMesAtividades = new Date();
let mesAtividadesAtual = viewMesAtividades.getMonth();
let anoAtividadesAtual = viewMesAtividades.getFullYear();

function carregarRegistrosAtividades() {
  try {
    return JSON.parse(localStorage.getItem(chaveRegistroAtividades)) || {};
  } catch (error) {
    return {};
  }
}

function salvarRegistrosAtividades(registros) {
  localStorage.setItem(chaveRegistroAtividades, JSON.stringify(registros));
}

function gerarChaveDiaAtividades(ano, mes, dia) {
  return `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
}



function atualizarRegistroAtividade(elemento) {
  const chaveDia = elemento.dataset.dia;
  const periodo = elemento.dataset.periodo;
  const registros = carregarRegistrosAtividades();

  if (!registros[chaveDia]) {
    registros[chaveDia] = {
      manha: { servico: '', horas: '' },
      tarde: { servico: '', horas: '' }
    };
  }

  if (elemento.classList.contains('atividade-select')) {
    registros[chaveDia][periodo].servico = elemento.value;
  } else {
    const valor = elemento.value === '' ? '' : Number(elemento.value);
    registros[chaveDia][periodo].horas = valor;
  }

  salvarRegistrosAtividades(registros);
  renderizarAtividades();
}

function limparDiaAtividades() {
  const diaTexto = prompt('Qual dia deste mês você deseja limpar? (Digite um número, ex: 15)');
  
  if (!diaTexto) return; // Se o usuário clicar em Cancelar, não faz nada
  
  const dia = Number(diaTexto);
  const ultimoDia = new Date(anoAtividadesAtual, mesAtividadesAtual + 1, 0).getDate();
  
  if (isNaN(dia) || dia < 1 || dia > ultimoDia) {
    alert('Dia inválido.');
    return;
  }

  const confirmar = confirm(`Tem certeza que deseja limpar TODAS as atividades do dia ${dia}?`);
  if (!confirmar) return;

  const registros = carregarRegistrosAtividades();
  const chaveDia = gerarChaveDiaAtividades(anoAtividadesAtual, mesAtividadesAtual, dia);

  if (registros[chaveDia]) {
    delete registros[chaveDia]; // Apaga o registro do dia escolhido
    salvarRegistrosAtividades(registros); // Salva as alterações
    renderizarAtividades(); // Atualiza a tela
    alert(`O dia ${dia} foi limpo com sucesso!`);
  } else {
    alert(`O dia ${dia} já estava vazio.`);
  }
}

function copiarResumoAtividades() {
  const registros = carregarRegistrosAtividades();
  const resumo = [];
  const nomeMes = new Date(anoAtividadesAtual, mesAtividadesAtual).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  for (let dia = 1; dia <= new Date(anoAtividadesAtual, mesAtividadesAtual + 1, 0).getDate(); dia++) {
    const chaveDia = gerarChaveDiaAtividades(anoAtividadesAtual, mesAtividadesAtual, dia);
    const registroDia = registros[chaveDia] || {
      manha: { servico: '', horas: '' },
      tarde: { servico: '', horas: '' }
    };

    const totalDia = Number(registroDia.manha.horas || 0) + Number(registroDia.tarde.horas || 0);
    if (totalDia > 0) {
      resumo.push(`${dia}/${mesAtividadesAtual + 1}: Manhã ${registroDia.manha.servico || '-'} ${registroDia.manha.horas || 0}h | Tarde ${registroDia.tarde.servico || '-'} ${registroDia.tarde.horas || 0}h | Total ${totalDia.toFixed(1)}h`);
    }
  }

  const texto = [`Resumo de ${nomeMes}`, '', ...resumo].join('\n');

  navigator.clipboard.writeText(texto).then(() => {
    alert('Resumo copiado para a área de transferência.');
  }).catch(() => {
    alert('Não foi possível copiar o resumo.');
  });
}

function renderizarAtividades() {
  const container = document.getElementById('atividades-mes');
  if (!container) return; // Só para se o container principal não existir

  const journalContainer = document.getElementById('atividades-journal');
  const checklistContainer = document.getElementById('atividades-checklist');
  const historicoContainer = document.getElementById('atividades-historico');
  const semanalContainer = document.getElementById('atividades-semanal');
  const totalMesElemento = document.getElementById('total-mes-atividades');
  const resumoTiposElemento = document.getElementById('resumo-tipos-atividades');
  const diasPreenchidosElemento = document.getElementById('dias-preenchidos-atividades');
  const diasVaziosElemento = document.getElementById('dias-vazios-atividades');
  const progressoMesElemento = document.getElementById('progresso-mes-atividades');
  const barraProgressoElemento = document.getElementById('barra-progresso-atividades');
  const mediaDiariaElemento = document.getElementById('media-diaria-atividades');

  const registros = carregarRegistrosAtividades();
  const ultimoDia = new Date(anoAtividadesAtual, mesAtividadesAtual + 1, 0).getDate();
  const nomeMes = new Date(anoAtividadesAtual, mesAtividadesAtual).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric'
  });

  textContent = nomeMes;
  container.innerHTML = '';
  if (journalContainer) journalContainer.innerHTML = '';
  if (checklistContainer) checklistContainer.innerHTML = '';
  if (historicoContainer) historicoContainer.innerHTML = '';
  if (semanalContainer) semanalContainer.innerHTML = '';

  let totalHorasMes = 0;
  const resumoPorTipo = {};
  let diasPreenchidos = 0;
  let diasVazios = 0;

  for (let dia = 1; dia <= ultimoDia; dia++) {
    const chaveDia = gerarChaveDiaAtividades(anoAtividadesAtual, mesAtividadesAtual, dia);
    const registroDia = registros[chaveDia] || {
      manha: { servico: '', horas: '' },
      tarde: { servico: '', horas: '' }
    };

    const totalDia = Number(registroDia.manha.horas || 0) + Number(registroDia.tarde.horas || 0);
    totalHorasMes += totalDia;

    if (totalDia > 0) {
      diasPreenchidos++;
    } else {
      diasVazios++;
    }

    [registroDia.manha, registroDia.tarde].forEach((periodo) => {
      if (periodo.servico) {
        resumoPorTipo[periodo.servico] = (resumoPorTipo[periodo.servico] || 0) + Number(periodo.horas || 0);
      }
    });

    const linha = document.createElement('div');
    linha.className = 'atividade-linha';

    const hoje = new Date();
    if (dia === hoje.getDate() && mesAtividadesAtual === hoje.getMonth() && anoAtividadesAtual === hoje.getFullYear()) {
      linha.classList.add('hoje');
    }

    if (totalDia > 0) {
      const temManha = Number(registroDia.manha.horas || 0) > 0;
      const temTarde = Number(registroDia.tarde.horas || 0) > 0;
      if (temManha && temTarde) {
        linha.classList.add('completo');
      } else {
        linha.classList.add('parcial');
      }
        } else {
      linha.classList.add('vazio');
    }

    // Verifica se o dia atual do laço é um domingo (0 = Domingo)
    const dataDesseDia = new Date(anoAtividadesAtual, mesAtividadesAtual, dia);
    const estiloDomingo = dataDesseDia.getDay() === 0 ? 'style="background-color: red; font-weight: bold;"' : '';

    linha.innerHTML = `
      <div class="atividade-dia-numero" ${estiloDomingo}>${dia}</div>
      
      <div class="atividade-periodo">
        <select class="atividade-select" data-dia="${chaveDia}" data-periodo="manha">
          <option value="">Manhã</option>
          ${tiposServicoAtividades.map((tipo) => `<option value="${tipo}" ${registroDia.manha.servico === tipo ? 'selected' : ''}>${tipo}</option>`).join('')}
        </select>
        <input class="atividade-input" type="number" min="0" step="0.5" value="${registroDia.manha.horas ?? ''}" data-dia="${chaveDia}" data-periodo="manha" placeholder="h">
      </div>

      <div class="atividade-periodo">
        <select class="atividade-select" data-dia="${chaveDia}" data-periodo="tarde">
          <option value="">Tarde</option>
          ${tiposServicoAtividades.map((tipo) => `<option value="${tipo}" ${registroDia.tarde.servico === tipo ? 'selected' : ''}>${tipo}</option>`).join('')}
        </select>
        <input class="atividade-input" type="number" min="0" step="0.5" value="${registroDia.tarde.horas ?? ''}" data-dia="${chaveDia}" data-periodo="tarde" placeholder="h">
      </div>
    `;

    container.appendChild(linha);

    if (journalContainer) {
      const cardJournal = document.createElement('div');
      cardJournal.className = 'atividade-journal-card';
      const nota = registroDia.nota || '';
      cardJournal.innerHTML = `
        <div class="atividade-journal-topo">
          <span>Dia ${dia}</span>
          <span>${totalDia.toFixed(1)}h</span>
        </div>
        <div class="atividade-journal-resumo">
          <span class="atividade-journal-chip">Manhã: ${registroDia.manha.servico || '—'} ${registroDia.manha.horas || 0}h</span>
          <span class="atividade-journal-chip">Tarde: ${registroDia.tarde.servico || '—'} ${registroDia.tarde.horas || 0}h</span>
        </div>
        <textarea class="atividade-journal-nota" data-dia="${chaveDia}" placeholder="Escreva uma observação para este dia...">${nota}</textarea>
      `;
      journalContainer.appendChild(cardJournal);
    }

    if (checklistContainer) {
      const checklistItem = document.createElement('div');
      checklistItem.className = 'atividade-checklist-item';
      checklistItem.innerHTML = `
        <span>Dia ${dia} • ${registroDia.manha.servico || '—'} / ${registroDia.tarde.servico || '—'}</span>
        <strong>${totalDia.toFixed(1)}h</strong>
      `;
      checklistContainer.appendChild(checklistItem);
    }

    if (historicoContainer) {
      const historicoItem = document.createElement('div');
      historicoItem.className = 'atividade-historico-item';
      historicoItem.innerHTML = `<strong>${dia}/${mesAtividadesAtual + 1}</strong><br>${registroDia.manha.servico || '—'} (${registroDia.manha.horas || 0}h) • ${registroDia.tarde.servico || '—'} (${registroDia.tarde.horas || 0}h) • Total ${totalDia.toFixed(1)}h`;
      historicoContainer.appendChild(historicoItem);
    }
  }

  if (semanalContainer) {
    const semanas = [];
    let semanaAtual = [];
    for (let dia = 1; dia <= ultimoDia; dia++) {
      const chaveDia = gerarChaveDiaAtividades(anoAtividadesAtual, mesAtividadesAtual, dia);
      const registroDia = registros[chaveDia] || { manha: { servico: '', horas: '' }, tarde: { servico: '', horas: '' } };
      const totalDia = Number(registroDia.manha.horas || 0) + Number(registroDia.tarde.horas || 0);
      semanaAtual.push({ dia, totalDia });
      if (semanaAtual.length === 7 || dia === ultimoDia) {
        semanas.push(semanaAtual);
        semanaAtual = [];
      }
    }

    semanas.forEach((grupo, index) => {
      const totalSemana = grupo.reduce((sum, item) => sum + item.totalDia, 0);
      const item = document.createElement('div');
      item.className = 'atividade-semana-item';
      item.innerHTML = `<span>Semana ${index + 1}</span><strong>${totalSemana.toFixed(1)}h</strong>`;
      semanalContainer.appendChild(item);
    });
  }

  const itensResumo = Object.entries(resumoPorTipo)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([tipo, horas]) => `<span class="resumo-tipo-item">${tipo}: ${horas.toFixed(1)}h</span>`)
    .join('');

  if (resumoTiposElemento) resumoTiposElemento.innerHTML = itensResumo || '<span class="resumo-tipo-item">Nenhum serviço registrado</span>';
  if (totalMesElemento) totalMesElemento.textContent = `${totalHorasMes.toFixed(1)} h`;
  if (diasPreenchidosElemento) diasPreenchidosElemento.textContent = diasPreenchidos;
  if (diasVaziosElemento) diasVaziosElemento.textContent = diasVazios;

    // --- INÍCIO DA BARRA DE PROGRESSO DE HORAS ---
  const META_DE_HORAS = 50; // <--- COLOQUE AQUI A SUA META DE HORAS
  
  const percentual = META_DE_HORAS > 0 ? Math.round((totalHorasMes / META_DE_HORAS) * 100) : 0;
  
  if (progressoMesElemento) progressoMesElemento.textContent = `${percentual}%`;
  
  if (barraProgressoElemento) {
    if (percentual <= 100) {
      // Se não bateu a meta, a barra cresce normal, toda em azul
      barraProgressoElemento.style.width = `${percentual}%`;
      barraProgressoElemento.style.background = 'linear-gradient(90deg, #4b2fb5 0%, #7c6fd6 100%)';
    } else {
      // Se passou da meta, a barra enche 100% e dividimos as cores: azul (meta) e verde (extra)
      barraProgressoElemento.style.width = '100%';
      const limiteAzul = (100 / percentual) * 100;
      barraProgressoElemento.style.background = `linear-gradient(90deg, #4b2fb5 0%, #7c6fd6 ${limiteAzul}%, #10b981 ${limiteAzul}%, #059669 100%)`;
    }
  }
  // --- FIM DA BARRA DE PROGRESSO DE HORAS ---
 
  if (mediaDiariaElemento) mediaDiariaElemento.textContent = `${(totalHorasMes / Math.max(diasPreenchidos, 1)).toFixed(1)}h`;
}

function salvarAtividadeRapida() {
  const diaEl = document.getElementById('selecionar-dia-atividade');
  const servicoEl = document.getElementById('servico-rapido-atividade');
  const horasEl = document.getElementById('horas-rapido-atividade');
  const periodoEl = document.getElementById('periodo-rapido-atividade');

  // Proteção: Se o HTML da atividade rápida não existir, não faz nada
  if (!diaEl || !servicoEl || !horasEl || !periodoEl) return;

  const dia = Number(diaEl.value);
  const servico = servicoEl.value;
  const horas = horasEl.value;
  const periodo = periodoEl.value;

  if (!dia || !servico || !horas) {
    alert('Preencha dia, serviço e horas para salvar.');
    return;
  }

  if (dia < 1 || dia > new Date(anoAtividadesAtual, mesAtividadesAtual + 1, 0).getDate()) {
    alert('Dia inválido para este mês.');
    return;
  }

  const registros = carregarRegistrosAtividades();
  const chaveDia = gerarChaveDiaAtividades(anoAtividadesAtual, mesAtividadesAtual, dia);

  if (!registros[chaveDia]) {
    registros[chaveDia] = {
      manha: { servico: '', horas: '' },
      tarde: { servico: '', horas: '' }
    };
  }

  registros[chaveDia][periodo] = {
    servico,
    horas: Number(horas)
  };

  salvarRegistrosAtividades(registros);
  renderizarAtividades();

  diaEl.value = '';
  servicoEl.value = '';
  horasEl.value = '';
  periodoEl.value = 'manha';
}

function inicializarAtividades() {
  const container = document.getElementById('atividades-mes');
  if (!container) {
    return;
  }

  const cilindroMes = document.getElementById('cilindro-mes');
  const cilindroAno = document.getElementById('cilindro-ano');
  
  if (!cilindroMes || !cilindroAno) return;

  // 1. Array fixo com o nome dos meses em texto
  const nomesMeses = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];
  
  cilindroMes.innerHTML = nomesMeses
    .map(mes => `<div class="cylinder-item">${mes}</div>`)
    .join('');

  // 2. Array infinito de Anos (Gerando de 2020 até 2050, você pode aumentar se quiser)
  const anosDisponiveis = [];
  for (let ano = 2020; ano <= 2050; ano++) {
    anosDisponiveis.push(ano);
  }

  cilindroAno.innerHTML = anosDisponiveis
    .map(ano => `<div class="cylinder-item">${ano}</div>`)
    .join('');

  // 3. Função inteligente que detecta qual roleta girou
  let scrollTimeout;
  function aoRolarCilindros() {
    clearTimeout(scrollTimeout);
    
    scrollTimeout = setTimeout(() => {
      // Descobre quem parou no meio (divide o tanto rolado pela altura de 30px)
      const indexMes = Math.round(cilindroMes.scrollTop / 30);
      const indexAno = Math.round(cilindroAno.scrollTop / 30);

      const mesSelecionado = indexMes; // o número do mês bate com o índice (0 a 11)
      const anoSelecionado = anosDisponiveis[indexAno];

      // Se os valores existirem, atualiza a tela
      if (mesSelecionado >= 0 && mesSelecionado <= 11 && anoSelecionado !== undefined) {
        
        mesAtividadesAtual = mesSelecionado;
        anoAtividadesAtual = anoSelecionado;
        
        // Manda desenhar os dias
        renderizarAtividades();
      }
    }, 150);
  }

  // Acopla a inteligência nas duas roletas
  cilindroMes.addEventListener('scroll', aoRolarCilindros);
  cilindroAno.addEventListener('scroll', aoRolarCilindros);

  // 4. Quando a página carregar, gira a roleta para a data atual de hoje
  setTimeout(() => {
    // Posiciona o Mês (ex: 6 = Julho)
    cilindroMes.scrollTop = mesAtividadesAtual * 30; 
    
    // Posiciona o Ano (Calcula quantos passos ele tem que dar desde o 2020)
    const indexDoAno = anosDisponiveis.indexOf(anoAtividadesAtual);
    if (indexDoAno !== -1) {
       cilindroAno.scrollTop = indexDoAno * 30;
    }
  }, 150);
  

   document.getElementById('btn-limpar-mes-atividades')?.addEventListener('click', () => {
    limparDiaAtividades();
  });

  document.getElementById('btn-copiar-resumo-atividades')?.addEventListener('click', () => {
    copiarResumoAtividades();
  });

  document.getElementById('btn-salvar-atividade-rapida')?.addEventListener('click', () => {
    salvarAtividadeRapida();
  });

  document.getElementById('btn-mostrar-checklist')?.addEventListener('click', () => {
    const journal = document.getElementById('atividades-journal');
    const checklist = document.getElementById('atividades-checklist');
    const historico = document.getElementById('atividades-historico');
    if (journal) journal.style.display = 'none';
    if (checklist) checklist.style.display = 'flex';
    if (historico) historico.style.display = 'none';
  });

  document.getElementById('btn-mostrar-historico')?.addEventListener('click', () => {
    const journal = document.getElementById('atividades-journal');
    const checklist = document.getElementById('atividades-checklist');
    const historico = document.getElementById('atividades-historico');
    const semanal = document.getElementById('atividades-semanal');
    if (journal) journal.style.display = 'none';
    if (checklist) checklist.style.display = 'none';
    if (historico) historico.style.display = 'flex';
    if (semanal) semanal.style.display = 'none';
  });

  document.getElementById('btn-mostrar-semanal')?.addEventListener('click', () => {
    const journal = document.getElementById('atividades-journal');
    const checklist = document.getElementById('atividades-checklist');
    const historico = document.getElementById('atividades-historico');
    const semanal = document.getElementById('atividades-semanal');
    if (journal) journal.style.display = 'none';
    if (checklist) checklist.style.display = 'none';
    if (historico) historico.style.display = 'none';
    if (semanal) semanal.style.display = 'flex';
  });

  container.addEventListener('change', (event) => {
    if (event.target.classList.contains('atividade-select') || event.target.classList.contains('atividade-input')) {
      atualizarRegistroAtividade(event.target);
    }
  });

  renderizarAtividades();
}


inicializarAtividades();
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
// --- AUTO SCROLL PARA O DIA ATUAL (COLE NO FINAL DO ARQUIVO) ---
window.addEventListener('load', () => {
  setTimeout(() => {
    const diaAtualEl = document.querySelector('#atividades-mes .hoje');
    if (diaAtualEl) {
      diaAtualEl.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest', 
        inline: 'center' 
      });
    }
  }, 500);
});