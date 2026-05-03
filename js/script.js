// =============================================================================
// script.js — SportClima Dashboard
// =============================================================================
// Fluxo geral de execução:
//   1. Tema é aplicado imediatamente para evitar flash de tela branca
//   2. DOM é referenciado e dados das páginas são declarados
//   3. loadPage("home") renderiza a tela inicial
//   4. Módulos de UI (notificações, perfil, tema, feedback) são inicializados
//   5. API_KEY e inputs de busca são declarados
//   6. Funções de clima, gráfico, resumo e análise são declaradas
//   7. Listeners de busca são registrados POR ÚLTIMO (dependem das funções acima)
//   8. Geolocalização é solicitada ao usuário e carrega o clima real
// =============================================================================

// ─── 1. TEMA — Aplicação imediata antes do render ────────────────────────────
// Roda antes de qualquer render para evitar o "flash" de tema errado.
// Lê o localStorage e adiciona ou remove a classe "dark" no <html>.
(function applyThemeOnLoad() {
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
})();


// ─── 2. SPA — Referências DOM e dados das páginas ────────────────────────────────

// Referências persistentes ao container principal e à sidebar direita
const spaContent = document.getElementById("spaContent");
const spaSidebarRight = document.getElementById("spaSidebarRight");
const sportButtons = document.querySelectorAll(".sport-btn");
const sportSidebarButtons = document.querySelectorAll(".sport-btn-sidebar");

// Dados estáticos de cada esporte: imagem hero, título, descrição e
// placeholders de métricas. Os valores reais são preenchidos pela API
// assim que atualizarClimaNaTela() termina de rodar.
const pages = {
    home: {
        heroImg: "https://images.unsplash.com/photo-1607962837359-5e7e89f86776?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        titulo: "Visão Geral — Esportes & Clima",
        desc: "Escolha um esporte para ver a análise climática personalizada.",
        metrics: {
            temp: "—",
            vento: "—",
            umidade: "—",
            sensacao: "—"
        },
        sidebar: {
            melhorHorario: "—",
            descricao: "Selecione um esporte na barra lateral.",
            evitar: "—"
        }
    },

    corrida: {
        heroImg: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        titulo: "Condições perfeitas para corrida de trilha",
        desc: "Clima seco, boa visibilidade e temperatura ideal para longas distâncias.",
        metrics: {
            temp: "18°C",
            vento: "5 km/h",
            umidade: "45%",
            sensacao: "—"
        },
        sidebar: {
            melhorHorario: "06:00 - 09:00",
            descricao: "Ar fresco, pouca umidade e ventos fracos.",
            evitar: "13:00 - 16:00"
        }
    },

    ciclismo: {
        heroImg: "https://plus.unsplash.com/premium_photo-1684820878202-52781d8e0ea9?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        titulo: "Dia ideal para pedalar nas montanhas",
        desc: "Estradas secas, ventos estáveis e clima propício para ciclismo de performance.",
        metrics: {
            temp: "21°C",
            vento: "12 km/h",
            umidade: "38%",
            sensacao: "—"
        },
        sidebar: {
            melhorHorario: "07:00 - 10:00",
            descricao: "Baixa intensidade UV e temperatura amena.",
            evitar: "12:00 - 15:00"
        }
    },

    surf: {
        heroImg: "https://images.unsplash.com/photo-1530870110042-98b2cb110834?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        titulo: "Ondas consistentes e swell perfeito",
        desc: "Condições excelentes com ventos offshore e boa formação.",
        metrics: {
            temp: "26°C",
            vento: "9 km/h",
            umidade: "60%",
            sensacao: "—"
        },
        sidebar: {
            melhorHorario: "05:40 - 08:20",
            descricao: "Ondas longas e vento ideal para manobras.",
            evitar: "11:30 - 15:30"
        }
    }
};

// Dados das criadoras do projeto — usados na página "Sobre o Projeto"
const criadoras = [
    {
        nome: "Adriele Mesquita de Oliveira",
        cargo: "Estudante de Engenharia de Computação",
        descricao: "Apaixonada por resolver problemas reais através da tecnologia, transformando ideias em soluções que fazem a diferença. Sempre em movimento, sempre aprendendo.",
        github: "https://github.com/adriele-oliveira",
        linkedin: "https://www.linkedin.com/in/adriele-mesquita-de-oliveira-5ba8591b3/",
        foto: "assets/profile_pic_adriele.jpg"
    },
    {
        nome: "Gabriela Lissa Nogami",
        cargo: "Estudante de Engenharia de Computação",
        descricao: "Sempre a procura de novos desafios, buscando unir minha paixão por esportes e tecnologia para criar soluções inovadoras.",
        github: "https://github.com/gabriela-lissa",
        linkedin: "https://www.linkedin.com/in/gabriela-nogami-940604263/",
        foto: "assets/profile_pic_gabriela.jpg"
    },
    {
        nome: "Isabella Valim",
        cargo: "Estudante de Engenharia de Computação",
        descricao: "Técnica em Informática movida a aprendizado constante, café e linhas de código. Dedicada a aprimorar minhas habilidades a cada novo projeto.",
        github: "https://github.com/IsabellaValim",
        linkedin: "https://www.linkedin.com/in/isabella-valim-de-carvalho-aba21b287/",
        foto: "assets/profile_pic_isabella.jpeg"
    }
];

// Mapeamento de cidades próximas para sugestões
const cidadesProximas = {
    "Sorocaba": ["São Paulo", "Campinas", "Jundiaí", "Piracicaba", "Itu"],
    "São Paulo": ["Sorocaba", "Campinas", "Santo André", "Osasco", "Guarulhos"],
    "Campinas": ["São Paulo", "Sorocaba", "Jundiaí", "Piracicaba", "Limeira"],
    "Rio de Janeiro": ["Niterói", "São Gonçalo", "Duque de Caxias", "Nova Iguaçu", "Belford Roxo"],
    "Belo Horizonte": ["Contagem", "Betim", "Nova Lima", "Ribeirão das Neves", "Sabará"],
    "Salvador": ["Lauro de Freitas", "Camaçari", "Simões Filho", "Vera Cruz", "Dias d'Ávila"],
    "Brasília": ["Taguatinga", "Ceilândia", "Samambaia", "Planaltina", "Águas Claras"],
    "Curitiba": ["São José dos Pinhais", "Pinhais", "Colombo", "Araucária", "Almirante Tamandaré"],
    "Porto Alegre": ["Canoas", "Viamão", "São Leopoldo", "Novo Hamburgo", "Gravataí"],
    "Recife": ["Jaboatão dos Guararapes", "Olinda", "Paulista", "Camaragibe", "São Lourenço da Mata"]
};

// ---------------------------------------------------------------------------
// Dicas e alertas fixos exibidos na sidebar de cada esporte
// ---------------------------------------------------------------------------
        const dicasEsporte = {
            corrida: {
                icone: "directions_run",
                dica: "Hidrate-se bem antes de sair. Em dias quentes, prefira horários mais frescos e use roupas leves.",
                alerta: "Evite correr com índice UV acima de 8 ou temperaturas acima de 32°C."
            },
            ciclismo: {
                icone: "directions_bike",
                dica: "Verifique a previsão de vento. Vento lateral acima de 40 km/h pode ser perigoso em descidas.",
                alerta: "Chuva deixa a pista escorregadia — evite pedalar durante ou logo após precipitações."
            },
            surf: {
                icone: "surfing",
                dica: "Acompanhe a direção do vento: offshore (terra→mar) melhora a formação das ondas.",
                alerta: "Trovoadas e raios são emergências — saia da água imediatamente."
            }
        };


// ─── 3. SPA — Renderização das páginas ───────────────────────────────────────

// Renderiza o conteúdo principal e a sidebar para o esporte recebido.
// Chamada sempre que o usuário clica em um esporte na sidebar ou nos cards da home.
// Renderiza a página SPA de acordo com o esporte selecionado
function atualizarVisibilidadeSurf() {
    const btnSurf = document.querySelector('[data-sport="surf"]');
    if (!btnSurf) return;
    if (window._cidadeLitoranea) {
        btnSurf.classList.remove('hidden');
    } else {
        btnSurf.classList.add('hidden');
    }
}

async function loadPage(sport) {
    const data = pages[sport];

    // Garante que a sidebar direita fique visível ao navegar
    spaSidebarRight.classList.remove('hidden');
    spaContent.classList.remove('lg:col-span-full');

    // Injeta o HTML completo da página no container principal
    spaContent.innerHTML = `
        <div class="spa-hero group">
            <div class="spa-hero-bg" style="background-image: linear-gradient(to top,rgba(0,0,0,.8),rgba(0,0,0,.2)), url('${data.heroImg}')"></div>
            <div class="spa-hero-content">
                <span class="px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase rounded-full">${sport}</span>
                <h1 class="text-white text-4xl font-black mt-3">${data.titulo}</h1>
                <p class="text-white/80 text-lg mt-2">${data.desc}</p>
            </div>
        </div>

        <!-- Métricas climáticas — preenchidas pela API após o render -->
        <div id="weatherMetrics" class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div class="metric-card">
                <p class="text-sm text-slate-500 dark:text-slate-400">Temperatura</p>
                <h4 id="temp" class="text-2xl font-bold mt-1 dark:text-slate-100">${data.metrics.temp}</h4>
            </div>
            <div class="metric-card">
                <p class="text-sm text-slate-500 dark:text-slate-400">Vento</p>
               <h4 id="vento" class="text-2xl font-bold mt-1 dark:text-slate-100">${data.metrics.vento}</h4>
            </div>
            <div class="metric-card">
                <p class="text-sm text-slate-500 dark:text-slate-400">Umidade</p>
                <h4 id="umidade" class="text-2xl font-bold mt-1 dark:text-slate-100">${data.metrics.umidade}</h4>
            </div>
            <div class="metric-card">
                <p class="text-sm text-slate-500 dark:text-slate-400">Sensação</p>
                <h4 id="sensacao" class="text-2xl font-bold mt-1 dark:text-slate-100">${data.metrics.temp}</h4>
            </div>
        </div>

        <!-- Condições Agora — visível apenas em esportes específicos -->
        ${sport !== "home" ? `
        <div id="condicoesAgora" class="mt-6 p-6 rounded-2xl bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/15 border border-primary/20 dark:border-primary/30">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-black text-primary flex items-center gap-2">
                    <span class="material-symbols-outlined">analytics</span>
                    Condições Agora
                </h3>
                <div id="scoreDisplay" class="text-right">
                    <div class="text-3xl font-black text-slate-900 dark:text-slate-100" id="scoreValue">--</div>
                    <div class="text-sm text-slate-500 dark:text-slate-400" id="scoreLabel">Carregando...</div>
                </div>
            </div>
            <div class="w-full bg-slate-200 dark:bg-surface-2 rounded-full h-4 mb-4">
                <div id="scoreBar" class="bg-primary h-4 rounded-full transition-all duration-1000" style="width: 0%"></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary">thermostat</span>
                    <span class="text-slate-600 dark:text-slate-300">Temperatura: <strong id="tempCond">${data.metrics.temp}</strong></span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary">air</span>
                    <span class="text-slate-600 dark:text-slate-300">Vento: <strong id="ventoCond">${data.metrics.vento}</strong></span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary">water_drop</span>
                    <span class="text-slate-600 dark:text-slate-300">Chuva: <strong id="chuvaCond">0mm</strong></span>
                </div>
            </div>
        </div>
        ` : ""}

         <!-- Cards de esportes clicáveis — visíveis apenas na home -->
        ${sport === "home" ? `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div class="rounded-2xl overflow-hidden relative group cursor-pointer shadow-md"
                onclick="loadPage('corrida')">
                <img src="https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600&auto=format&fit=crop"
                    class="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" alt="Corrida">
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                    <p class="text-white font-black text-lg">Corrida</p>
                    <p class="text-white/70 text-xs mt-0.5">Ideal com temperatura entre 15°C e 22°C, vento até 10 km/h e sem chuva.</p>
                </div>
            </div>

            <div class="rounded-2xl overflow-hidden relative group cursor-pointer shadow-md"
                onclick="loadPage('ciclismo')">
                <img src="https://plus.unsplash.com/premium_photo-1684820878202-52781d8e0ea9?w=600&auto=format&fit=crop"
                    class="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" alt="Ciclismo">
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                    <p class="text-white font-black text-lg">Ciclismo</p>
                    <p class="text-white/70 text-xs mt-0.5">Melhor com temperatura entre 18°C e 25°C, vento até 15 km/h e pista seca.</p>
                </div>
            </div>

            ${window._cidadeLitoranea ? `
            <div class="rounded-2xl overflow-hidden relative group cursor-pointer shadow-md"
                onclick="loadPage('surf')">
                <img src="https://images.unsplash.com/photo-1530870110042-98b2cb110834?w=600&auto=format&fit=crop"
                    class="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" alt="Surf">
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                    <p class="text-white font-black text-lg">Surf</p>
                    <p class="text-white/70 text-xs mt-0.5">Ventos entre 10-25 km/h e temperatura entre 20°C e 28°C para melhores ondas.</p>
                </div>
            </div>
            ` : ""}
        </div>
        ` : ""}

        <!-- Gráfico de variação horária com botões de alternância de tipo -->
        <div class="chart-container mt-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold dark:text-slate-100">Variação Horária</h3>
                <div class="flex gap-2">
                    <button onclick="mudarGrafico('temp')" id="btnGraficoTemp"
                        class="chart-tab-btn active-chart-tab px-3 py-1 rounded-full text-xs font-bold transition-all">
                        🌡 Temperatura
                    </button>
                    <button onclick="mudarGrafico('chuva')" id="btnGraficoChuva"
                        class="chart-tab-btn px-3 py-1 rounded-full text-xs font-bold transition-all">
                        🌧 Chuva
                    </button>
                    <button onclick="mudarGrafico('vento')" id="btnGraficoVento"
                        class="chart-tab-btn px-3 py-1 rounded-full text-xs font-bold transition-all">
                        💨 Vento
                    </button>
                </div>
            </div>
            <div id="chartBars" class="flex items-end h-32 gap-1"></div>
            <div id="chartLabels" class="flex gap-1 mt-1"></div>
        </div>
        <div id="weatherHourly" class="mt-6"></div>


    `;

    // Sidebar direita — conteúdo diferente para home e para cada esporte
    if (sport === "home") {

        // Na home: mostra clima atual e resumo do dia por esporte
        spaSidebarRight.innerHTML = `
            <div class="spa-sidebar-card">
                <h3 class="text-primary flex items-center gap-2">
                    <span class="material-symbols-outlined">wb_sunny</span>
                    Clima Agora
                </h3>
                <div id="analiseEsporte" class="mt-3 text-xs text-slate-500 dark:text-slate-400">
                    <p class="italic">Carregando dados da sua região...</p>
                </div>
            </div>
            <div class="spa-sidebar-card mt-4" id="resumoDiarioCard">
                <h3 class="text-primary flex items-center gap-2">
                    <span class="material-symbols-outlined">checklist</span>
                    Resumo do Dia
                </h3>
                <div id="resumoDiario" class="mt-3 text-xs text-slate-400 italic">
                    <p>Carregando resumo...</p>
                </div>
            </div>
        `;
    } else {
        // Em cada esporte: mostra análise dinâmica + dica fixa do esporte
        const info = dicasEsporte[sport] || { icone: "sports", dica: "", alerta: "" };

        spaSidebarRight.innerHTML = `
            <div class="spa-sidebar-card">
                <h3 class="text-primary flex items-center gap-2">
                    <span class="material-symbols-outlined">schedule</span>
                    Análise para ${sport.charAt(0).toUpperCase() + sport.slice(1)}
                </h3>
                <div id="analiseEsporte" class="mt-3 text-xs text-slate-500 dark:text-slate-400">
                    <p class="italic">Carregando análise...</p>
                </div>
            </div>

            <div class="spa-sidebar-card mt-4">
                <h3 class="text-primary flex items-center gap-2">
                    <span class="material-symbols-outlined">${info.icone}</span>
                    Dica de ${sport.charAt(0).toUpperCase() + sport.slice(1)}
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    ${info.dica}
                </p>
                <p class="text-xs text-amber-600 dark:text-amber-400 mt-3 leading-relaxed font-semibold">
                    ⚠️ ${info.alerta}
                </p>
            </div>
        `;
    }

    // Remove destaque do botão "Sobre o Projeto" ao navegar para qualquer esporte
    const sobreBtn = document.getElementById('sobreProjetoBtn');
    if (sobreBtn) sobreBtn.classList.remove('sobre-btn-active');

    // Busca dados climáticos reais — usa a cidade salva ou Sorocaba como fallback
    const cidadeParaCarregar = window._cidadeAtual || "Sorocaba";
    await atualizarClimaNaTela(cidadeParaCarregar);
    analisarEsporte(sport);
    atualizarVisibilidadeSurf();
}

// Renderiza a home ao iniciar o app
loadPage("home");

// ─── 4. SOBRE O PROJETO ──────────────────────────────────────────────────────
// Renderiza a página de criadoras, ocultando a sidebar direita e
// expandindo o conteúdo principal para ocupar toda a largura.
function loadSobreProjeto() {
    spaSidebarRight.innerHTML = "";
    spaSidebarRight.classList.add('hidden');
    spaContent.classList.add('lg:col-span-full');

    const cardsHtml = criadoras.map(c => `
        <div class="sobre-creator-card flex flex-col items-center text-center p-6 rounded-2xl
                    bg-white dark:bg-surface-2
                    border border-slate-100 dark:border-surface-3
                    shadow-sm hover:shadow-md dark:hover:shadow-black/30
                    transition-shadow duration-300">

            <div class="sobre-foto-placeholder w-24 h-24 rounded-full mb-5 overflow-hidden
                        border-4 border-primary/20 dark:border-primary/30
                        bg-slate-100 dark:bg-surface-3
                        flex items-center justify-center shrink-0">
                ${c.foto
                    ? `<img src="${c.foto}" alt="Foto de ${c.nome}" class="w-full h-full object-cover" />`
                    : `<span class="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600">account_circle</span>`
                }
            </div>

            <h3 class="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">${c.nome}</h3>
            <p class="text-xs font-semibold text-primary uppercase tracking-wider mb-3">${c.cargo}</p>
            <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6 flex-1">${c.descricao}</p>

            <div class="w-full flex flex-col gap-2 mt-auto">
                <a href="${c.github}" target="_blank" rel="noopener noreferrer"
                    class="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl
                           bg-primary hover:bg-orange-600 active:scale-95
                           text-white text-sm font-bold
                           shadow-sm shadow-primary/20
                           transition-all duration-200">
                    <span class="material-symbols-outlined text-[18px]">code</span>
                    GitHub
                </a>
                <a href="${c.linkedin}" target="_blank" rel="noopener noreferrer"
                    class="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl
                           bg-primary/15 hover:bg-primary/25 active:scale-95
                           text-primary dark:text-orange-300 text-sm font-bold
                           transition-all duration-200">
                    <span class="material-symbols-outlined text-[18px]">person</span>
                    LinkedIn
                </a>
            </div>
        </div>
    `).join('');

    spaContent.innerHTML = `
        <div class="w-full max-w-4xl mx-auto">
        <div class="text-center py-8 px-4">
            <h1 class="text-4xl font-black text-primary mb-2 tracking-tight">SportClima</h1>
            <p class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-8">Sobre o Projeto</p>
            <p class="text-base font-semibold text-slate-700 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Este é um projeto acadêmico focado no monitoramento climático para atletas de alta performance,
                unindo tecnologia e esporte para proporcionar insights precisos.
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 pb-6">
            ${cardsHtml}
        </div>

        <div class="flex items-center justify-between pt-4 pb-2 border-t border-slate-100 dark:border-surface-3 px-1">
            <p class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                © 2026 SportClima Academic
            </p>
            <div class="flex items-center gap-3 text-primary/50">
                <span class="material-symbols-outlined text-[18px]">show_chart</span>
                <span class="material-symbols-outlined text-[18px]">thunderstorm</span>
                <span class="material-symbols-outlined text-[18px]">device_thermostat</span>
            </div>
        </div>
        </div>
    `;
}

// Inicializa o botão "Sobre o Projeto" — remove destaque dos esportes ao clicar
(function initSobreProjeto() {
    const sobreBtn = document.getElementById('sobreProjetoBtn');
    if (!sobreBtn) return;

    sobreBtn.addEventListener('click', () => {
        const sidebarItems = document.querySelectorAll('.sport-btn-sidebar');
        sidebarItems.forEach(item => {
            item.classList.remove('sidebar-active');
            item.style.removeProperty('background-color');
            item.style.removeProperty('color');
            item.classList.remove('shadow-lg');
            const icon = item.querySelector('.material-symbols-outlined');
            const text = item.querySelector('p');
            if (icon) icon.style.removeProperty('color');
            if (text) text.style.removeProperty('color');
        });

        sobreBtn.classList.add('sobre-btn-active');
        loadSobreProjeto();
    });
})();

// ─── 5. NAVEGAÇÃO — Busca por esporte no header ───────────────────────────────

// Permite navegar por esporte digitando no input do header.
// Suporta sinônimos como "bike" → ciclismo, "surfe" → surf, etc.
const searchInput = document.querySelector('input[placeholder="Buscar esporte ou localização..."]');

if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            let query = searchInput.value.toLowerCase().trim();

            const synonyms = {
                "surfe": "surf",
                "pedalar": "ciclismo",
                "bike": "ciclismo",
                "correr": "corrida",
                "inicio": "home",
                "dashboard": "home"
            };

            if (synonyms[query]) query = synonyms[query];

            if (pages[query]) {
                loadPage(query);
                searchInput.value = "";
            } else {
                alert("Esporte não encontrado. Tente: corrida, surf ou ciclismo.");
            }
        }
    });
}


// ─── 6. NOTIFICAÇÕES — Drawer lateral ────────────────────────────────────────
(function initNotifications() {
    const bellBtn = document.getElementById('notificationBtn');
    const drawer = document.getElementById('notificationDrawer');
    const overlay = document.getElementById('notificationOverlay');
    const closeBtn = document.getElementById('closeNotifications');
    const markReadBtn = document.getElementById('markAllReadBtn');
    const clearBtn = document.getElementById('clearNotifsBtn');
    const emptyState = document.getElementById('emptyState');
    const badge = document.getElementById('notifBadge');
    const listArea = document.querySelector('#notificationDrawer .flex-1.overflow-y-auto');

    if (!bellBtn || !drawer || !overlay) return;

    // Abre o drawer com animação de slide + fade no overlay
    function openDrawer() {
        overlay.classList.remove('hidden');
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                overlay.classList.add('opacity-100');
                drawer.classList.remove('translate-x-[120%]');
            });
        });
    }

    // Fecha o drawer e aguarda a animação terminar antes de ocultar o overlay
    function closeDrawer() {
        drawer.classList.add('translate-x-[120%]');
        overlay.classList.remove('opacity-100');
        setTimeout(() => overlay.classList.add('hidden'), 300);
    }

    function hideBadge() {
        if (badge) badge.classList.add('hidden');
    }

    function getNotificationPreferences() {
        return JSON.parse(localStorage.getItem('sportclima_notif_prefs') || JSON.stringify({
            vento: true,
            corrida: true,
            surf: true
        }));
    }

    function saveNotificationPreferences(prefs) {
        localStorage.setItem('sportclima_notif_prefs', JSON.stringify(prefs));
    }

    function updateBadgeCount() {
        if (!badge || !listArea) return;
        const visibleNotifications = listArea.querySelectorAll('[data-alert-type]:not(.hidden)');
        if (visibleNotifications.length === 0) {
            badge.classList.add('hidden');
        } else {
            badge.textContent = visibleNotifications.length;
            badge.classList.remove('hidden');
        }
    }

    function updateEmptyStateVisibility() {
        if (!listArea || !emptyState) return;
        const visibleNotifications = listArea.querySelectorAll('[data-alert-type]:not(.hidden)');
        if (visibleNotifications.length === 0) {
            emptyState.classList.remove('hidden');
            emptyState.classList.add('flex');
        } else {
            emptyState.classList.add('hidden');
            emptyState.classList.remove('flex');
        }
    }

    function applyNotificationPreferences() {
        if (!listArea) return;
        const prefs = getNotificationPreferences();
        listArea.querySelectorAll('[data-alert-type]').forEach(card => {
            const alertType = card.getAttribute('data-alert-type');
            if (alertType && prefs[alertType] === false) {
                card.classList.add('hidden');
            } else {
                card.classList.remove('hidden');
            }
        });
        updateEmptyStateVisibility();
        updateBadgeCount();
    }

    function renderNotificationPreferences() {
        const windCheckbox = document.getElementById('notifPrefWind');
        const runningCheckbox = document.getElementById('notifPrefRunning');
        const surfCheckbox = document.getElementById('notifPrefSurf');
        const prefs = getNotificationPreferences();

        if (windCheckbox) {
            windCheckbox.checked = prefs.vento;
            windCheckbox.addEventListener('change', () => {
                prefs.vento = windCheckbox.checked;
                saveNotificationPreferences(prefs);
                applyNotificationPreferences();
            });
        }

        if (runningCheckbox) {
            runningCheckbox.checked = prefs.corrida;
            runningCheckbox.addEventListener('change', () => {
                prefs.corrida = runningCheckbox.checked;
                saveNotificationPreferences(prefs);
                applyNotificationPreferences();
            });
        }

        if (surfCheckbox) {
            surfCheckbox.checked = prefs.surf;
            surfCheckbox.addEventListener('change', () => {
                prefs.surf = surfCheckbox.checked;
                saveNotificationPreferences(prefs);
                applyNotificationPreferences();
            });
        }
    }

    // Marca todas as notificações como lidas removendo o destaque laranja
    function applyReadStyle() {
        if (!listArea) return;
        const highlighted = listArea.querySelectorAll('[class*="bg-orange"]');
        highlighted.forEach(card => {
            card.classList.remove('bg-orange-50/50', 'bg-orange-50', 'border-orange-100');
            card.classList.add('opacity-70');
            const dot = card.querySelector('.bg-primary.rounded-full');
            if (dot) dot.remove();
        });
        hideBadge();
        localStorage.setItem('sportclima_notifs_status', 'read');
    }

    // Remove todas as notificações e exibe o estado vazio
    function applyClearState() {
        if (!listArea || !emptyState) return;
        const groups = listArea.querySelectorAll('div:not(#emptyState)');
        groups.forEach(g => g.remove());
        emptyState.classList.remove('hidden');
        emptyState.classList.add('flex');
        hideBadge();
        updateBadgeCount();
        localStorage.setItem('sportclima_notifs_status', 'cleared');
    }

    // Restaura o estado salvo ao recarregar a página
    const savedStatus = localStorage.getItem('sportclima_notifs_status');
    if (savedStatus === 'cleared') setTimeout(applyClearState, 50);
    else if (savedStatus === 'read') setTimeout(applyReadStyle, 50);

    if (savedStatus && badge) badge.classList.add('hidden');

    bellBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (markReadBtn) markReadBtn.addEventListener('click', applyReadStyle);
    if (clearBtn) clearBtn.addEventListener('click', applyClearState);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeDrawer();
    });

    renderNotificationPreferences();
    applyNotificationPreferences();

})();


// ─── 7. MENU DE PERFIL — Dropdown do header ──────────────────────────────────
(function initProfileMenu() {
    const trigger = document.getElementById('profileTrigger');
    const menu = document.getElementById('profileMenu');

    if (!trigger || !menu) return;

    // Abre/fecha o dropdown ao clicar no avatar
    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('hidden');
        if (!menu.classList.contains('hidden')) {
            menu.style.animation = 'profileFadeIn 0.2s ease-out';
        }
    });

    // Fecha o menu ao clicar em qualquer lugar fora dele
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && e.target !== trigger) {
            menu.classList.add('hidden');
        }
    });
})();


// ─── 8. TEMA TOGGLE — Botão claro/escuro do header ───────────────────────────
(function initThemeToggle() {
    const toggleBtn = document.getElementById('dark-mode-toggle');
    const darkIcon = document.getElementById('dark-icon');
    const html = document.documentElement;

    if (!toggleBtn) return;

    // Sincroniza o ícone com o tema que já foi aplicado no módulo 1
    if (localStorage.getItem('theme') === 'dark' && darkIcon) {
        darkIcon.textContent = 'light_mode';
    }

    toggleBtn.addEventListener('click', () => {
        const isDark = html.classList.toggle('dark');
        if (isDark) {
            localStorage.setItem('theme', 'dark');
            if (darkIcon) darkIcon.textContent = 'light_mode';
        } else {
            localStorage.setItem('theme', 'light');
            if (darkIcon) darkIcon.textContent = 'dark_mode';
        }
    });
})();


// ─── 9. NAVEGAÇÃO LATERAL — Destaque ativo nos botões de esporte ─────────────
(function initSidebarNav() {
    const items = document.querySelectorAll('.sport-btn-sidebar');
    const topSearch = document.querySelector('header input');
    let currentActive = document.querySelector('[data-sport="home"]') || items[0];

    // Remove o destaque de todos os itens e aplica no elemento recebido
    function applyActiveStyle(element) {
        if (!element) return;

        items.forEach(item => {
            item.classList.remove('sidebar-active');
            item.style.removeProperty('background-color');
            item.style.removeProperty('color');
            item.classList.remove('shadow-lg');
            const icon = item.querySelector('.material-symbols-outlined');
            const text = item.querySelector('p');
            if (icon) icon.style.removeProperty('color');
            if (text) text.style.removeProperty('color');
        });

        // Remove também o destaque do botão "Sobre o Projeto"
        const sobreBtn = document.getElementById('sobreProjetoBtn');
        if (sobreBtn) sobreBtn.classList.remove('sobre-btn-active');

        element.classList.add('sidebar-active');
        currentActive = element;
    }

    // Cada botão da sidebar aplica o estilo ativo e carrega a página do esporte
    items.forEach(item => {
        item.addEventListener('click', () => {
            const sport = item.getAttribute('data-sport');
            if (sport) {
                applyActiveStyle(item);
                loadPage(sport);
            }
        });
    });

    // Aplica o destaque inicial no botão home ao carregar a página
    applyActiveStyle(currentActive);
})();


// ─── 10. FEEDBACK MODAL — Envio via EmailJS ──────────────────────────────────
emailjs.init({
    publicKey: "4VsEjc_Hr6MccvJBz",
});

(function initFeedbackModal() {
    const menuBtn = document.getElementById('feedbackMenuBtn');
    const cardBtn = document.getElementById('enviarFeedbackCardBtn');
    const modal = document.getElementById('feedbackModal');
    const closeBtn = document.getElementById('closeFeedbackModal');
    const cancelBtn = document.getElementById('cancelFeedbackBtn');
    const submitBtn = document.getElementById('feedbackSubmitBtn');
    const profileMenu = document.getElementById('profileMenu');

    if (!modal) return;

    function openModal() {
        if (profileMenu) profileMenu.classList.add('hidden');
        modal.classList.remove('hidden');
        modal.classList.add('modal-open');
        document.body.classList.add('modal-lock');
    }

    function closeModal() {
        modal.classList.remove('modal-open');
        modal.classList.add('hidden');
        document.body.classList.remove('modal-lock');
    }

    // Limpa todos os campos do formulário após envio ou cancelamento
    function clearForm() {
        const nome = document.getElementById('feedbackNome');
        const email = document.getElementById('feedbackEmail');
        const assunto = document.getElementById('feedbackAssunto');
        const mensagem = document.getElementById('feedbackMensagem');

        if (nome) nome.value = '';
        if (email) email.value = '';
        if (assunto) assunto.value = '';
        if (mensagem) mensagem.value = '';
    }

    function handleSubmit(event) {
        if (event) event.preventDefault();

        const nomeInput = document.getElementById('feedbackNome');
        const emailInput = document.getElementById('feedbackEmail');
        const assuntoInput = document.getElementById('feedbackAssunto');
        const mensagemInput = document.getElementById('feedbackMensagem');

        const nome = nomeInput?.value.trim();
        const email = emailInput?.value.trim();
        const assunto = assuntoInput?.value.trim();
        const mensagem = mensagemInput?.value.trim();

        // Destaca em vermelho os campos obrigatórios que estão vazios
        if (!nome || !email || !mensagem) {
            [nomeInput, emailInput, mensagemInput].forEach(el => {
                if (el && !el.value.trim()) {
                    el.style.borderColor = '#ef4444';
                    setTimeout(() => el.style.removeProperty('border-color'), 1800);
                }
            });
            return;
        }

        // Desabilita o botão e mostra spinner enquanto aguarda o EmailJS
        if (submitBtn) {
            submitBtn.innerHTML = `
                <span class="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                <span>Enviando...</span>`;
            submitBtn.disabled = true;
        }

        const formData = {
            nome: nome,
            email: email,
            assunto: assunto,
            mensagem: mensagem
        };

        const serviceID = "service_qz0wtwq";
        const templateID = "template_ma91mtj";

        emailjs.send(serviceID, templateID, formData)
            .then(() => {
                if (submitBtn) {
                    submitBtn.innerHTML = `
                        <span class="material-symbols-outlined filled text-[18px]">check_circle</span>
                        <span>Enviado com sucesso!</span>`;
                    submitBtn.classList.add('bg-green-500', 'shadow-green-500/20');
                    submitBtn.classList.remove('bg-primary', 'shadow-primary/20');
                }

                // Fecha o modal e reseta o botão após 1.6s
                setTimeout(() => {
                    closeModal();
                    clearForm();

                    if (submitBtn) {
                        submitBtn.innerHTML = `<span>Enviar Feedback</span>
                            <span class="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">send</span>`;
                        submitBtn.disabled = false;
                        submitBtn.classList.remove('bg-green-500', 'shadow-green-500/20');
                        submitBtn.classList.add('bg-primary', 'shadow-primary/20');
                    }
                }, 1600);
            })
            .catch(() => {
                alert("Erro ao enviar feedback. Tente novamente.");

                if (submitBtn) {
                    submitBtn.innerHTML = `<span>Enviar Feedback</span>
                        <span class="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">send</span>`;
                    submitBtn.disabled = false;
                }
            });
    }

    if (menuBtn) menuBtn.addEventListener('click', openModal);
    if (cardBtn) cardBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (submitBtn) submitBtn.addEventListener('click', handleSubmit);

    // Fecha ao clicar no backdrop escuro
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    // Fecha com a tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('modal-open')) closeModal();
    });
})();


// ─── 11. MODAL DE PERFIL — Preenchimento e persistência ──────────────────────

/**
 * Lê o usuário ativo do localStorage e preenche os campos do modal.
 * O apelido é gerado automaticamente pelo primeiro nome caso não
 * tenha sido definido anteriormente.
 */
function preencherModalPerfil() {
    const session = JSON.parse(localStorage.getItem('sportclima_session') || 'null');
    if (!session) return;

    // Busca os dados completos do usuário no array de cadastros
    const users = JSON.parse(localStorage.getItem('sportclima_users') || '[]');
    const user = users.find(u => u.email === session.email) || {};

    // Separa o nome completo em primeiro nome e sobrenome para campos individuais
    const partes = (user.name || session.name || '').trim().split(' ');
    const primeiroNome = partes[0] || '';
    const sobrenome = partes.slice(1).join(' ') || '';

    const inputNome = document.getElementById('modalNome');
    const inputSobrenome = document.getElementById('modalSobrenome');
    const inputApelido = document.getElementById('modalApelido');
    const inputEmail = document.getElementById('modalEmail');
    const inputData = document.getElementById('modalDataNascimento');

    if (inputNome) inputNome.value = primeiroNome;
    if (inputSobrenome) inputSobrenome.value = sobrenome;
    // Exibe o apelido salvo ou gera um baseado no primeiro nome
    if (inputApelido) inputApelido.value = user.apelido || primeiroNome;
    if (inputEmail) inputEmail.value = session.email || '';
    if (inputData) {
        inputData.value = user.dataNascimento || '';
        // Define a data máxima para impedir datas de pessoas com menos de 12 anos
        const today = new Date();
        const maxDate = new Date(today.getFullYear() - 12, today.getMonth(), today.getDate());
        inputData.max = maxDate.toISOString().split('T')[0];
    }
}

/**
 * Salva as alterações do modal no localStorage e atualiza
 * o nome exibido no menu de perfil sem recarregar a página.
 */
function salvarAlteracoesPerfil() {
    const session = JSON.parse(localStorage.getItem('sportclima_session') || 'null');
    if (!session) { fecharModal(); return; }

    const primeiroNome = document.getElementById('modalNome')?.value.trim() || '';
    const sobrenome = document.getElementById('modalSobrenome')?.value.trim() || '';
    const apelido = document.getElementById('modalApelido')?.value.trim() || '';
    const dataNascimento = document.getElementById('modalDataNascimento')?.value || '';

    // Validação da data de nascimento: deve ter pelo menos 12 anos
    if (dataNascimento) {
        const birthDate = new Date(dataNascimento);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        if (age < 12) {
            alert('A data de nascimento deve corresponder a uma pessoa com pelo menos 12 anos.');
            return;
        }
    }

    // Reconstrói o nome completo a partir dos campos separados
    const nomeCompleto = [primeiroNome, sobrenome].filter(Boolean).join(' ');

    // Atualiza o objeto do usuário no array persistido
    const users = JSON.parse(localStorage.getItem('sportclima_users') || '[]');
    const idx = users.findIndex(u => u.email === session.email);

    if (idx !== -1) {
        if (nomeCompleto) users[idx].name = nomeCompleto;
        users[idx].apelido = apelido;
        users[idx].dataNascimento = dataNascimento;
        localStorage.setItem('sportclima_users', JSON.stringify(users));
    }

    // Atualiza a sessão ativa com o novo nome
    const updatedSession = { ...session, name: nomeCompleto || session.name };
    localStorage.setItem('sportclima_session', JSON.stringify(updatedSession));

    // Reflete o novo nome no menu de perfil sem recarregar a página
    const profileUserName = document.getElementById('profileUserName');
    if (profileUserName) profileUserName.textContent = updatedSession.name;

    fecharModal();
}


// ─── 12. FUNÇÕES GLOBAIS DO MODAL ────────────────────────────────────────────
// Chamadas diretamente pelo HTML via atributos onclick

// Alterna visibilidade do menu dropdown de perfil
function toggleMenu() {
    const menu = document.getElementById('profileMenu');
    if (menu) menu.classList.toggle('hidden');
}

// Abre o modal de perfil e preenche os campos com dados do usuário logado
function abrirModalPerfil() {
    const menu = document.getElementById('profileMenu');
    const modal = document.getElementById('modalPerfil');

    if (menu) menu.classList.add('hidden');
    if (modal) {
        preencherModalPerfil();
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

// Fecha o modal de perfil e restaura o scroll da página
function fecharModal() {
    const modal = document.getElementById('modalPerfil');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}


// ─── 13. FOTO DE PERFIL — Upload e exibição imediata ─────────────────────────

/**
 * Lê o arquivo selecionado, converte para Base64, salva no localStorage
 * vinculado ao e-mail da sessão e atualiza todos os avatares na interface
 * (header, modal grande e modal pequeno) sem precisar recarregar.
 */
function processarNovaFoto(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const novaImagemUrl = e.target.result;

            const session = JSON.parse(localStorage.getItem('sportclima_session') || 'null');
            if (session) {
                localStorage.setItem(`sportclima_foto_${session.email}`, novaImagemUrl);
            }

            const profileTrigger = document.getElementById('profileTrigger');
            if (profileTrigger) profileTrigger.style.backgroundImage = `url("${novaImagemUrl}")`;

            const fotoPerfilGrande = document.getElementById('fotoPerfilGrande');
            const placeholderFotoGrande = document.getElementById('placeholderFotoGrande');
            if (fotoPerfilGrande) { fotoPerfilGrande.src = novaImagemUrl; fotoPerfilGrande.classList.remove('hidden'); }
            if (placeholderFotoGrande) placeholderFotoGrande.classList.add('hidden');

            const fotoPerfilPequena = document.getElementById('fotoPerfilPequena');
            const placeholderFotoPequena = document.getElementById('placeholderFotoPequena');
            if (fotoPerfilPequena) { fotoPerfilPequena.src = novaImagemUrl; fotoPerfilPequena.classList.remove('hidden'); }
            if (placeholderFotoPequena) placeholderFotoPequena.classList.add('hidden');
        };

        reader.readAsDataURL(input.files[0]);
    }
}


// ─── 14. SESSÃO — Estado de login na interface ───────────────────────────────

function initLoginPromptOverlay() {
    const overlay = document.getElementById('loginPromptOverlay');
    const session = JSON.parse(localStorage.getItem('sportclima_session') || 'null');
    if (!overlay) return;

    if (!session) {
        overlay.classList.remove('hidden');
        return;
    }

    overlay.classList.add('hidden');
}

/**
 * Verifica se existe uma sessão ativa no localStorage.
 * Se sim: exibe nome/email do usuário, oculta o botão de login,
 * mostra o botão de logout e restaura a foto de perfil salva.
 */
(function initSession() {
    initLoginPromptOverlay();
    const session = JSON.parse(localStorage.getItem('sportclima_session') || 'null');

    if (!session) return;

    const profileUserName = document.getElementById('profileUserName');
    const profileUserEmail = document.getElementById('profileUserEmail');
    const profileLoginLink = document.getElementById('profileLoginLink');
    const profileLoginPrompt = document.getElementById('profileLoginPrompt');
    const profileLogoutLink = document.getElementById('profileLogoutLink');
    const profileLogoutBtn = document.getElementById('profileLogoutBtn');
    const profileTrigger = document.getElementById('profileTrigger');
    const menuAvatarBtn = document.getElementById('menuAvatarBtn');
    const fotoPerfilPequena = document.getElementById('fotoPerfilPequena');
    const placeholderFotoPequena = document.getElementById('placeholderFotoPequena');
    const fotoPerfilGrande = document.getElementById('fotoPerfilGrande');
    const placeholderFotoGrande = document.getElementById('placeholderFotoGrande');

    if (profileUserName) profileUserName.textContent = session.name;
    if (profileUserEmail) profileUserEmail.textContent = session.email;
    if (profileLoginLink) profileLoginLink.classList.add('hidden');
    if (profileLoginPrompt) profileLoginPrompt.classList.add('hidden');
    if (profileLogoutLink) profileLogoutLink.classList.remove('hidden');

    // Logout: remove a sessão e recarrega para limpar a interface
    if (profileLogoutBtn) {
        profileLogoutBtn.addEventListener('click', () => {
            localStorage.removeItem('sportclima_session');
            window.location.reload();
        });
    }

    // Restaura a foto de perfil salva para o e-mail da sessão
    const savedPhoto = localStorage.getItem(`sportclima_foto_${session.email}`);
    if (savedPhoto) {
        if (profileTrigger) profileTrigger.style.backgroundImage = `url("${savedPhoto}")`;
        if (fotoPerfilPequena) { fotoPerfilPequena.src = savedPhoto; fotoPerfilPequena.classList.remove('hidden'); }
        if (placeholderFotoPequena) placeholderFotoPequena.classList.add('hidden');
        if (fotoPerfilGrande) { fotoPerfilGrande.src = savedPhoto; fotoPerfilGrande.classList.remove('hidden'); }
        if (placeholderFotoGrande) placeholderFotoGrande.classList.add('hidden');
    }

    if (menuAvatarBtn) {
        menuAvatarBtn.title = 'Clique para alterar sua foto de perfil';
        menuAvatarBtn.classList.add('cursor-pointer', 'hover:opacity-80', 'transition-opacity');
        menuAvatarBtn.addEventListener('click', () => {
            document.getElementById('inputFotoPerfil')?.click();
        });
    }
})();

// ─── 15. API DO CLIMA ─────────────────────────────────────────────────────────
const inputCidade = document.getElementById("inputCidade");
const btnBuscar = document.getElementById("btnBuscarCidade");

// ─── 16. FUNÇÕES DE CLIMA, GRÁFICO, RESUMO E ANÁLISE ─────────────────────────
// Declaradas ANTES dos listeners de busca para garantir que existam
// quando o usuário interagir com o input pela primeira vez.

// Consulta a Nominatim (OpenStreetMap) para verificar se há linha costeira
// num raio de 50km da cidade. Sem chave, sem hardcoding.
async function verificarCidadeLitoranea(lat, lon) {
    try {
        // Open-Meteo Marine API: só retorna wave_height se houver oceano
        // nas coordenadas. Em cidades do interior retorna erro ou campo vazio.
        const url = `https://marine-api.open-meteo.com/v1/marine` +
            `?latitude=${lat}&longitude=${lon}&hourly=wave_height&forecast_days=1`;
        const res = await fetch(url);
        const data = await res.json();
        // Se vier erro da API (ponto não está sobre o oceano) → não é litoral
        if (data.error || !data.hourly?.wave_height) return false;
        // Se todos os valores forem null → coordenada fora do mar
        const temDados = data.hourly.wave_height.some(v => v !== null);
        return temDados;
    } catch (e) {
        console.warn("Não foi possível verificar litoral:", e);
        return false;
    }
}

async function atualizarClimaNaTela(cidade = "Sorocaba", forceReload = false) {
    // Mostra estado de carregamento nas métricas enquanto aguarda a API
    ["temp", "vento", "umidade", "sensacao"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = `<span class="animate-pulse text-slate-300 dark:text-slate-600">···</span>`;
    });

    const cidadeNormalizada = cidade.trim().toLowerCase();
    const cached = window._dadosClimaAPI?.city?.name?.toLowerCase();
    let dados;

if (!forceReload && cached === cidadeNormalizada && window._dadosClimaAPI) {
        dados = window._dadosClimaAPI;
    } else {
        try {
            // Etapa 1: resolve o nome para coordenadas, priorizando BR
            const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cidade)}&limit=5&appid=${API_KEY}`;
            const geoRes = await fetch(geoUrl);
            const geoData = await geoRes.json();

            let forecastUrl;
            if (geoData && geoData.length > 0) {
                // Prioriza Brasil se o usuário não especificou país
                const temPais = /,\s*[A-Z]{2}$/.test(cidade.trim());
                const resultado = temPais
                    ? geoData[0]
                    : (geoData.find(r => r.country === "BR") || geoData[0]);
                forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${resultado.lat}&lon=${resultado.lon}&appid=${API_KEY}&units=metric&lang=pt_br`;
            } else {
                // Fallback: busca direta por nome
                forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cidade)}&appid=${API_KEY}&units=metric&lang=pt_br`;
            }

            const res = await fetch(forecastUrl);
            dados = await res.json();
        } catch (erro) {
            console.error("Erro clima:", erro);
            dados = null;
        }
    }

    if (!dados || dados.cod === "404" || !dados.list) {
        const elTemp = document.getElementById("temp");
        if (elTemp) {
            elTemp.closest('#weatherMetrics')
                ?.querySelectorAll('h4')
                .forEach(el => el.textContent = "—");
        }
        const barsEl = document.getElementById("chartBars");
        if (barsEl) barsEl.innerHTML = `
            <p class="text-xs text-red-400 italic w-full text-center py-4">
                Cidade não encontrada. Verifique o nome e tente novamente.
            </p>`;
        return;
    }

    // Salva globalmente — gráfico, resumo e análise leem daqui
    window._dadosClimaAPI = dados;
    // Reseta o status litorâneo enquanto a verificação está em andamento,
    // para evitar que um resultado antigo (de outra cidade) vaze
    window._cidadeLitoranea = false;

    const atual = dados.list[0];

        const elTemp = document.getElementById("temp");
        const elVento = document.getElementById("vento");
        const elUmidade = document.getElementById("umidade");

        if (elTemp) elTemp.textContent = Math.round(atual.main.temp) + "°C";
        if (elVento) elVento.textContent = Math.round(atual.wind.speed * 3.6) + " km/h";
        if (elUmidade) elUmidade.textContent = atual.main.humidity + "%";

        const elSensacao = document.getElementById("sensacao");
        if (elSensacao) elSensacao.textContent = Math.round(atual.main.feels_like) + "°C";

        // Atualiza o título do hero com o nome da cidade
        const heroTitle = document.querySelector('.spa-hero-content h1');
        if (heroTitle && dados.city?.name) {
            const sportAtivoBadge = document.querySelector('.spa-hero-content span');
            const sportNome = sportAtivoBadge?.textContent?.trim()?.toLowerCase() || 'home';
            const titulosEsporte = {
                corrida: `Corrida em ${dados.city.name}`,
                ciclismo: `Ciclismo em ${dados.city.name}`,
                surf:     `Surf em ${dados.city.name}`,
                home:     `Condições em ${dados.city.name}`
            };
            heroTitle.textContent = titulosEsporte[sportNome] || `Condições climáticas em ${dados.city.name}`;
        }

        // Renderiza o gráfico padrão de temperatura
        renderizarGrafico("temp");

        // Atualiza resumo diário se estiver na home
        const sportAtivoAgora = document.querySelector('.sport-btn-sidebar.sidebar-active');
        const sportAtual = sportAtivoAgora?.getAttribute('data-sport') || 'home';
        if (sportAtual === 'home') {
            atualizarResumoDiario();
        }

        // Verifica litoral em paralelo — não bloqueia o render
        // Usa um token para ignorar resultados de chamadas antigas (race condition)
        const tokenAtual = Symbol();
        atualizarClimaNaTela._tokenLitoral = tokenAtual;
        const { lat, lon } = dados.city.coord;
        verificarCidadeLitoranea(lat, lon).then(ehLitoral => {
            if (atualizarClimaNaTela._tokenLitoral !== tokenAtual) return;
            window._cidadeLitoranea = ehLitoral;
            atualizarVisibilidadeSurf();
            if (sportAtual === 'home') {
                atualizarResumoDiario();
            }
        });
}


// Troca o tipo de dado exibido no gráfico e marca o botão correspondente como ativo
function mudarGrafico(tipo) {
    ["temp", "chuva", "vento"].forEach(t => {
        const btn = document.getElementById(`btnGrafico${t.charAt(0).toUpperCase() + t.slice(1)}`);
        if (btn) {
            btn.classList.remove("active-chart-tab");
        }
    });
    const ativo = document.getElementById(`btnGrafico${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
    if (ativo) ativo.classList.add("active-chart-tab");
    renderizarGrafico(tipo);
}

// Desenha as barras do gráfico usando os dados salvos em window._dadosClimaAPI.
// A altura de cada barra é proporcional ao valor máximo do conjunto (escala relativa).
function renderizarGrafico(tipo) {
    const dados = window._dadosClimaAPI;
    const barsEl = document.getElementById("chartBars");
    const labelsEl = document.getElementById("chartLabels");

    if (!dados || !barsEl) return;

    const fatias = dados.list.slice(0, 8); // próximas 8 janelas de 3h = 24h

    const valores = fatias.map(item => {
        if (tipo === "temp")  return Math.round(item.main.temp);
        if (tipo === "chuva") return Math.round((item.rain?.["3h"] || 0) * 10) / 10;
        if (tipo === "vento") return Math.round(item.wind.speed * 3.6);
        return 0;
    });

    const unidades = { temp: "°C", chuva: "mm", vento: "km/h" };
    const cores = {
        temp:  "bg-orange-400",
        chuva: "bg-blue-400",
        vento: "bg-teal-400"
    };

    const max = Math.max(...valores, 1); // evita divisão por zero

    barsEl.innerHTML = fatias.map((_, i) => {
        const altura = Math.max(8, Math.round((valores[i] / max) * 120));
        return `
            <div class="flex-1 flex flex-col items-center gap-1 group">
                <span class="text-[9px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    ${valores[i]}${unidades[tipo]}
                </span>
                <div class="${cores[tipo]} rounded-t-md w-full transition-all duration-500"
                     style="height:${altura}px"></div>
            </div>`;
    }).join("");

    if (labelsEl) {
        labelsEl.innerHTML = fatias.map(item => `
            <div class="flex-1 text-center text-[9px] text-slate-400">
                ${item.dt_txt.slice(11, 16)}
            </div>`).join("");
    }
}

// Exibe na sidebar da home o status de condições para cada esporte no dia atual.
// "✅" = 2+ janelas boas | "⚠️" = apenas 1 | "❌" = nenhuma.
// Chamada automaticamente por atualizarClimaNaTela quando a home está ativa.
function atualizarResumoDiario() {
    const dados = window._dadosClimaAPI;
    const el = document.getElementById("resumoDiario");
    if (!dados || !el) return;

    // Filtra apenas os blocos de previsão do dia atual
    const hoje = dados.list.filter(item => {
        const diaItem = item.dt_txt.slice(0, 10);
        const diaHoje = dados.list[0].dt_txt.slice(0, 10);
        return diaItem === diaHoje;
    });

    // Critérios de "boa condição" para cada esporte
     const ehLitoranea = window._cidadeLitoranea ?? false;

    const esportes = [
        {
            nome: "Corrida",
            icone: "🏃",
            sport: "corrida",
            ok: (i) => i.main.temp >= 10 && i.main.temp <= 25 && i.wind.speed * 3.6 <= 20 && !(i.rain?.["3h"] > 0)
        },
        {
            nome: "Ciclismo",
            icone: "🚴",
            sport: "ciclismo",
            ok: (i) => i.main.temp >= 12 && i.main.temp <= 28 && i.wind.speed * 3.6 <= 30 && !(i.rain?.["3h"] > 0)
        },
        ...(ehLitoranea ? [{
            nome: "Surf",
            icone: "🏄",
            sport: "surf",
            ok: (i) => i.wind.speed * 3.6 >= 10 && i.main.temp >= 18
        }] : [])
    ];

    el.innerHTML = esportes.map(e => {
        const horasBoas = hoje.filter(e.ok);
        const primeiraHoraBoa = horasBoas[0]?.dt_txt.slice(11, 16);
        const status = horasBoas.length >= 2 ? "✅" : horasBoas.length === 1 ? "⚠️" : "❌";
        const desc = horasBoas.length >= 2
            ? `Bom a partir de ${primeiraHoraBoa}`
            : horasBoas.length === 1
            ? `Apenas às ${primeiraHoraBoa}`
            : "Não recomendado hoje";

        return `
            <div class="flex items-center justify-between py-2 border-b border-slate-100 dark:border-surface-3 last:border-0 cursor-pointer hover:bg-slate-50 dark:hover:bg-surface-3 rounded-lg px-1 transition-colors"
                 onclick="loadPage('${e.sport}')">
                <div class="flex items-center gap-2">
                    <span class="text-base">${e.icone}</span>
                    <span class="font-semibold text-slate-700 dark:text-slate-200">${e.nome}</span>
                </div>
                <div class="text-right">
                    <span class="text-base">${status}</span>
                    <p class="text-[10px] text-slate-400 mt-0.5">${desc}</p>
                </div>
            </div>`;
    }).join('');
}
// Calcula e exibe na sidebar: score 0-100, melhor horário, horário a evitar
// e previsão dos próximos dias para o esporte selecionado.
function analisarEsporte(sport) {
    const dados = window._dadosClimaAPI;
    const el = document.getElementById("analiseEsporte");

        // Retry automático: se a API ainda não respondeu, tenta até 5 vezes com 1s de intervalo    if (!dados || !el) {
        if (!dados || !el) {       
        analisarEsporte._tentativas = (analisarEsporte._tentativas || 0) + 1;
        if (analisarEsporte._tentativas < 5) {
            setTimeout(() => analisarEsporte(sport), 1000);
        } else {
            analisarEsporte._tentativas = 0;
            if (el) el.innerHTML = `<p class="text-red-400 italic">Não foi possível carregar os dados climáticos.</p>`;
        }
        return;
    }
    analisarEsporte._tentativas = 0;

    const fatias = dados.list.slice(0, 16); // próximas 48h em blocos de 3h
    
    // Lê as condições do momento atual para calcular o score    const agora = dados.list[0];
    const agora = dados.list[0];
    const tempAtual = agora.main.temp;
    const ventoAtual = agora.wind.speed * 3.6;
    const chuvaAtual = agora.rain?.["3h"] || 0;

    // Score de condições (0–100): cada esporte tem pesos diferentes
    // para temperatura, vento e chuva
    const calcScore = {
        corrida: () => {
            let s = 100;
            // Temperatura ideal: 15-22°C
            if (tempAtual < 15) s -= Math.min(50, (15 - tempAtual) * 5);
            else if (tempAtual > 22) s -= Math.min(50, (tempAtual - 22) * 3);
            // Vento ideal: <10km/h
            if (ventoAtual > 10) s -= Math.min(30, (ventoAtual - 10) * 2);
            // Chuva: qualquer quantidade penaliza
            if (chuvaAtual > 0) s -= 40;
            return Math.max(0, Math.round(s));
        },
        ciclismo: () => {
            let s = 100;
            // Temperatura ideal: 18-25°C
            if (tempAtual < 18) s -= Math.min(40, (18 - tempAtual) * 4);
            else if (tempAtual > 25) s -= Math.min(40, (tempAtual - 25) * 2);
            // Vento ideal: <15km/h
            if (ventoAtual > 15) s -= Math.min(35, (ventoAtual - 15) * 2.5);
            // Chuva: penaliza fortemente
            if (chuvaAtual > 0) s -= 45;
            return Math.max(0, Math.round(s));
        },
        surf: () => {
            let s = 0;
            // Vento ideal: 10-25km/h
            if (ventoAtual >= 10 && ventoAtual <= 25) s += 50;
            else if (ventoAtual > 25) s += Math.max(0, 50 - (ventoAtual - 25) * 2);
            // Temperatura ideal: 20-28°C
            if (tempAtual >= 20 && tempAtual <= 28) s += 40;
            else if (tempAtual < 20) s += Math.max(0, (tempAtual - 15) * 8);
            else s += Math.max(0, 40 - (tempAtual - 28) * 5);
            // Chuva: penaliza
            if (chuvaAtual > 0) s -= 30;
            return Math.max(0, Math.min(100, Math.round(s)));
        },
        home: () => {
            let s = 100;
            if (chuvaAtual > 0) s -= 30;
            if (tempAtual > 32 || tempAtual < 8) s -= 30;
            if (ventoAtual > 40) s -= 20;
            return Math.max(0, Math.round(s));
        }
    };

    const score = (calcScore[sport] || calcScore.home)();
    const scoreCor = score >= 75 ? "text-green-500" : score >= 50 ? "text-yellow-500" : score >= 25 ? "text-orange-500" : "text-red-500";
    const scoreLabel = score >= 75 ? "Excelente" : score >= 50 ? "Bom" : score >= 25 ? "Regular" : "Ruim";
    const scoreBg = score >= 75 ? "bg-green-500" : score >= 50 ? "bg-yellow-400" : score >= 25 ? "bg-orange-400" : "bg-red-500";

    // Atualizar a seção Condições Agora no conteúdo principal (se existir)
    const scoreValueEl = document.getElementById("scoreValue");
    const scoreLabelEl = document.getElementById("scoreLabel");
    const scoreBarEl = document.getElementById("scoreBar");
    const tempCondEl = document.getElementById("tempCond");
    const ventoCondEl = document.getElementById("ventoCond");
    const chuvaCondEl = document.getElementById("chuvaCond");

    if (scoreValueEl) scoreValueEl.textContent = score;
    if (scoreLabelEl) {
        scoreLabelEl.textContent = scoreLabel;
        scoreLabelEl.className = `text-sm ${scoreCor}`;
    }
    if (scoreBarEl) {
        scoreBarEl.style.width = `${score}%`;
        scoreBarEl.className = `h-4 rounded-full transition-all duration-1000 ${scoreBg}`;
    }
    if (tempCondEl) tempCondEl.textContent = `${Math.round(tempAtual)}°C`;
    if (ventoCondEl) ventoCondEl.textContent = `${Math.round(ventoAtual)} km/h`;
    if (chuvaCondEl) chuvaCondEl.textContent = `${chuvaAtual}mm`;
   
    // Critérios idênticos ao resumo diário — usados para encontrar melhor e pior janela
    const criterios = {
        corrida: (item) => item.main.temp >= 15 && item.main.temp <= 22
            && item.wind.speed * 3.6 <= 10
            && (item.rain?.["3h"] || 0) === 0,

        ciclismo: (item) => item.main.temp >= 18 && item.main.temp <= 25
            && item.wind.speed * 3.6 <= 15
            && (item.rain?.["3h"] || 0) === 0,

        surf: (item) => item.wind.speed * 3.6 >= 10 && item.wind.speed * 3.6 <= 25
            && item.main.temp >= 20 && item.main.temp <= 28,

        home: (item) => item.main.temp >= 15 && item.main.temp <= 30
            && (item.rain?.["3h"] || 0) === 0
    };

    const criterio = criterios[sport] || criterios.home;

    const bons = fatias.filter(criterio);
    const ruins = fatias.filter(i => !criterio(i));

    const melhor = bons[0];
    const pior = ruins[0];

    function formatHora(dtTxt) {
        return dtTxt ? dtTxt.slice(11, 16) : "—";
    }

    // Gera uma frase explicativa do motivo da escolha de horário
    function gerarMotivo(item, sport, bom) {
        if (!item) return "Dados insuficientes.";
        const temp = Math.round(item.main.temp);
        const vento = Math.round(item.wind.speed * 3.6);
        const chuva = item.rain?.["3h"] || 0;

        if (bom) {
            if (sport === "surf") return `Vento de ${vento} km/h favorece as ondas.`;
            if (chuva === 0 && temp <= 25) return `Sem chuva e temperatura agradável de ${temp}°C.`;
            return `Condições equilibradas: ${temp}°C, vento ${vento} km/h.`;
        } else {
            if (chuva > 0) return `Chuva prevista (${chuva}mm) — evite sair.`;
            if (temp > 30) return `Calor excessivo: ${temp}°C — risco de desidratação.`;
            if (vento > 35) return `Vento forte: ${vento} km/h — perigoso para ciclismo e corrida.`;
            return `Condições desfavoráveis: ${temp}°C, vento ${vento} km/h.`;
        }
    }

    el.innerHTML = `
        <div class="flex flex-col gap-3">

            <!-- Score de condições com barra de progresso colorida -->
            <div class="p-3 rounded-xl bg-slate-50 dark:bg-surface-3 border border-slate-100 dark:border-surface-3">
                <div class="flex items-center justify-between mb-2">
                    <p class="text-xs font-bold text-slate-600 dark:text-slate-300">Condições agora</p>
                    <span class="text-lg font-black ${scoreCor}">${score}/100 · ${scoreLabel}</span>
                </div>
                <div class="w-full bg-slate-200 dark:bg-surface-2 rounded-full h-2">
                    <div class="${scoreBg} h-2 rounded-full transition-all duration-700"
                         style="width: ${score}%"></div>
                </div>
            </div>

            <!-- Melhor janela de horário para o esporte -->
            <div class="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
                <p class="font-bold text-green-700 dark:text-green-400 flex items-center gap-1">
                    <span class="material-symbols-outlined text-[14px]">check_circle</span>
                    Melhor horário
                </p>
                <p class="mt-1 text-slate-700 dark:text-slate-300 font-semibold">
                    ${formatHora(melhor?.dt_txt)}
                </p>
                <p class="mt-0.5 text-slate-500 dark:text-slate-400">
                    ${gerarMotivo(melhor, sport, true)}
                </p>
            </div>

            <!-- Janela de horário a evitar -->
            <div class="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800">
                <p class="font-bold text-red-600 dark:text-red-400 flex items-center gap-1">
                    <span class="material-symbols-outlined text-[14px]">cancel</span>
                    Evitar
                </p>
                <p class="mt-1 text-slate-700 dark:text-slate-300 font-semibold">
                    ${formatHora(pior?.dt_txt)}
                </p>
                <p class="mt-0.5 text-slate-500 dark:text-slate-400">
                    ${gerarMotivo(pior, sport, false)}
                </p>
            </div>
        </div>

           <!-- Previsão resumida dos próximos 3 dias -->
            <div class="mt-1">
                <p class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Próximos dias</p>
                ${(() => {
                    // Agrupa previsões por dia
                    const porDia = {};
                    dados.list.forEach(item => {
                        const dia = item.dt_txt.slice(0, 10);
                        if (!porDia[dia]) porDia[dia] = [];
                        porDia[dia].push(item);
                    });

                    return Object.entries(porDia).slice(0, 3).map(([dia, items]) => {
                        const maxTemp = Math.max(...items.map(i => i.main.temp_max));
                        const minTemp = Math.min(...items.map(i => i.main.temp_min));
                        const temChuva = items.some(i => (i.rain?.["3h"] || 0) > 0);
                        const temVentoForte = items.some(i => i.wind.speed * 3.6 > 30);
                        const descDia = new Date(dia + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric' });
                        const icone = temChuva ? '🌧' : temVentoForte ? '💨' : '☀️';

                        return `
                            <div class="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-surface-3 last:border-0">
                                <span class="text-xs text-slate-500 dark:text-slate-400 capitalize w-20">${descDia}</span>
                                <span class="text-base">${icone}</span>
                                <span class="text-xs font-bold text-slate-700 dark:text-slate-200">
                                    ${Math.round(maxTemp)}° / <span class="font-normal text-slate-400">${Math.round(minTemp)}°</span>
                                </span>
                            </div>`;
                    }).join('');
                })()}
            </div>
        </div>
    `;
}
// ─── 17. LISTENERS DE BUSCA POR CIDADE ───────────────────────────────────────
// Registrados aqui no final, APÓS todas as funções serem declaradas,
// para garantir que atualizarClimaNaTela e analisarEsporte já existam.

// Função para detectar se o termo de busca é um esporte e retornar o esporte correspondente
function detectarEsporte(termo) {
    const termoLower = termo.toLowerCase().trim();
    const mapeamentoEsportes = {
        corrida: ['corrida', 'running', 'correr', 'trail', 'maratona', 'jogging'],
        ciclismo: ['ciclismo', 'cycling', 'bike', 'bicicleta', 'pedalar', 'mountain bike'],
        surf: ['surf', 'surfing', 'onda', 'praia', 'surfar', 'prancha'],
        home: ['home', 'geral', 'visão geral', 'overview']
    };

    for (const [esporte, keywords] of Object.entries(mapeamentoEsportes)) {
        if (keywords.some(keyword => termoLower.includes(keyword))) {
            return esporte;
        }
    }
    return null;
}

// Clique no botão: verifica se é esporte ou cidade, e age accordingly
btnBuscar.addEventListener("click", async () => {
    const termo = inputCidade.value.trim();
    if (!termo) return;

    const esporteDetectado = detectarEsporte(termo);
    if (esporteDetectado) {
        // Se for esporte, muda para a aba correspondente
        const sportBtn = document.querySelector(`[data-sport="${esporteDetectado}"]`);
        if (sportBtn) {
            sportBtn.click(); // Simula clique no botão do esporte
        }
        return;
    }

    // Se não for esporte, trata como cidade
    window._cidadeAtual = termo;
    await atualizarClimaNaTela(termo);

    // Dispara análise para o esporte que está ativo no momento da busca
    const sportAtivo = document.querySelector('.sport-btn-sidebar.sidebar-active');
    const sport = sportAtivo?.getAttribute('data-sport') || 'home';
    analisarEsporte(sport);
});

// Enter no input aciona o mesmo comportamento do clique no botão
inputCidade.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        btnBuscar.click();
    }
});

// Foco no input mostra sugestões de cidades próximas
inputCidade.addEventListener("focus", () => {
    mostrarSugestoes();
});

// Clique fora do input e sugestões oculta as sugestões
document.addEventListener("click", (e) => {
    const suggestions = document.getElementById("suggestions");
    const input = document.getElementById("inputCidade");
    if (!input.contains(e.target) && !suggestions.contains(e.target)) {
        suggestions.classList.add("hidden");
    }
});

// Função para mostrar sugestões de cidades próximas
function mostrarSugestoes() {
    const suggestions = document.getElementById("suggestions");
    const cidadeAtual = window._cidadeAtual || "Sorocaba";
    const proximas = cidadesProximas[cidadeAtual] || [];

    if (proximas.length === 0) {
        suggestions.classList.add("hidden");
        return;
    }

    suggestions.innerHTML = proximas.map(cidade => `
        <div class="px-4 py-2 hover:bg-slate-100 dark:hover:bg-surface-3 cursor-pointer text-sm" onclick="selecionarSugestao('${cidade}')">
            ${cidade}
        </div>
    `).join("");

    suggestions.classList.remove("hidden");
}

// Função para selecionar uma sugestão
function selecionarSugestao(cidade) {
    inputCidade.value = cidade;
    document.getElementById("suggestions").classList.add("hidden");
    btnBuscar.click();
}


// ─── 18. GEOLOCALIZAÇÃO — Solicita permissão e carrega clima local ────────────
// Registrado por último pois chama atualizarClimaNaTela e analisarEsporte.
// Se o usuário autorizar: detecta a cidade e carrega o clima real.
// Se negar ou sem suporte: usa "Sorocaba" como fallback silencioso.
(function initGeolocation() {
    //Aguarda o DOM estar pronto antes de tentar geolocalização
    if (!navigator.geolocation) {
        // Navegador não suporta geolocalização — vai direto para o fallback
        window._cidadeAtual = "Sorocaba";
        setTimeout(() => atualizarClimaNaTela("Sorocaba"), 100);
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (pos) => {
            const { latitude, longitude } = pos.coords;
            const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=pt_br`;
            try {
                const res = await fetch(url);
                const dados = await res.json();

                if (!dados || !dados.list) throw new Error("Dados inválidos");

                // Aproveita os dados já buscados por lat/lon — sem segunda chamada à API
                window._cidadeAtual = dados.city?.name || "Sua localização";
                window._dadosClimaAPI = dados;
                window._cidadeLitoranea = false;

                // Dispara verificação de litoral em paralelo com token anti-race
                const tokenAtual = Symbol();
                atualizarClimaNaTela._tokenLitoral = tokenAtual;
                const { lat, lon } = dados.city.coord;
                verificarCidadeLitoranea(lat, lon).then(ehLitoral => {
                    if (atualizarClimaNaTela._tokenLitoral !== tokenAtual) return;
                    window._cidadeLitoranea = ehLitoral;
                    atualizarVisibilidadeSurf();
                    atualizarResumoDiario();
                });

                // Renderiza os dados diretamente sem nova chamada à API
                const atual = dados.list[0];
                const elTemp = document.getElementById("temp");
                const elVento = document.getElementById("vento");
                const elUmidade = document.getElementById("umidade");
                const elSensacao = document.getElementById("sensacao");
                if (elTemp) elTemp.textContent = Math.round(atual.main.temp) + "°C";
                if (elVento) elVento.textContent = Math.round(atual.wind.speed * 3.6) + " km/h";
                if (elUmidade) elUmidade.textContent = atual.main.humidity + "%";
                if (elSensacao) elSensacao.textContent = Math.round(atual.main.feels_like) + "°C";

                const heroTitle = document.querySelector('.spa-hero-content h1');
                if (heroTitle) heroTitle.textContent = `Condições em ${window._cidadeAtual}`;

                renderizarGrafico("temp");
                atualizarResumoDiario();

                const sportAtivo = document.querySelector('.sport-btn-sidebar.sidebar-active');
                const sport = sportAtivo?.getAttribute('data-sport') || 'home';
                setTimeout(() => analisarEsporte(sport), 200);

            } catch (e) {
                // Erro na requisição (sem internet, API fora, etc.) — usa fallback
                window._cidadeAtual = "Sorocaba";
                atualizarClimaNaTela("Sorocaba");
            }
        },
        (err) => {
            // Usuário negou ou erro — usa fallback silencioso sem alertas
            console.warn("Geolocalização negada, usando Sorocaba como padrão.");
            atualizarClimaNaTela("Sorocaba");
        },
        {
            timeout: 8000,        // desiste após 8s
            maximumAge: 300000    // reusa posição cacheada por até 5 min
        }
    );
})();