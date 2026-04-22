// ─────────────────────────────────────────────────────────────────────────────
// script.js — SportClima Dashboard
// Organização dos módulos:
//   1. Tema (aplicação imediata)
//   2. Dados e páginas SPA (pages, loadPage, loadSobreProjeto)
//   3. Navegação lateral (initSobreProjeto, busca, initSidebarNav)
//   4. Notificações (initNotifications)
//   5. Menu de Perfil (initProfileMenu)
//   6. Tema Toggle (initThemeToggle)
//   7. Feedback Modal (initFeedbackModal)
//   8. Modal de Perfil — Preenchimento e Persistência
//   9. Funções globais do modal (toggleMenu, abrirModalPerfil, fecharModal)
//  10. Foto de Perfil (processarNovaFoto)
//  11. Sessão (initSession)
// ─────────────────────────────────────────────────────────────────────────────


// ─── 1. TEMA — Aplicação imediata antes do render ────────────────────────────
(function applyThemeOnLoad() {
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
})();


// ─── 2. SPA — Referências e dados das páginas ────────────────────────────────
const spaContent = document.getElementById("spaContent");
const spaSidebarRight = document.getElementById("spaSidebarRight");
const sportButtons = document.querySelectorAll(".sport-btn");
const sportSidebarButtons = document.querySelectorAll(".sport-btn-sidebar");


const pages = {
    home: {
        heroImg: "https://images.unsplash.com/photo-1607962837359-5e7e89f86776?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        titulo: "Visão Geral — Esportes & Clima",
        desc: "Escolha um esporte para ver a análise climática personalizada.",
        metrics: {
            temp: "—",
            vento: "—",
            umidade: "—",
            uv: "—"
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
            uv: "2"
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
            uv: "4"
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
            uv: "8"
        },
        sidebar: {
            melhorHorario: "05:40 - 08:20",
            descricao: "Ondas longas e vento ideal para manobras.",
            evitar: "11:30 - 15:30"
        }
    }
};


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


// Renderiza a página SPA de acordo com o esporte selecionado
function loadPage(sport) {
    const data = pages[sport];

    spaSidebarRight.classList.remove('hidden');
    spaContent.classList.remove('lg:col-span-full');

    spaContent.innerHTML = `
        <div class="spa-hero group">
            <div class="spa-hero-bg" style="background-image: linear-gradient(to top,rgba(0,0,0,.8),rgba(0,0,0,.2)), url('${data.heroImg}')"></div>
            <div class="spa-hero-content">
                <span class="px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase rounded-full">${sport}</span>
                <h1 class="text-white text-4xl font-black mt-3">${data.titulo}</h1>
                <p class="text-white/80 text-lg mt-2">${data.desc}</p>
            </div>
        </div>

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
                <p class="text-sm text-slate-500 dark:text-slate-400">Índice UV</p>
                <h4 id="uv" class="text-2xl font-bold mt-1 dark:text-slate-100">${data.metrics.uv}</h4>
            </div>
        </div>

        ${sport === "home" ? `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div class="rounded-2xl overflow-hidden relative group cursor-pointer shadow-md"
                onclick="loadPage('corrida')">
                <img src="https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600&auto=format&fit=crop"
                    class="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" alt="Corrida">
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                    <p class="text-white font-black text-lg">Corrida</p>
                    <p class="text-white/70 text-xs mt-0.5">Ideal com temperatura entre 10°C e 25°C, vento fraco e sem chuva.</p>
                </div>
            </div>

            <div class="rounded-2xl overflow-hidden relative group cursor-pointer shadow-md"
                onclick="loadPage('ciclismo')">
                <img src="https://plus.unsplash.com/premium_photo-1684820878202-52781d8e0ea9?w=600&auto=format&fit=crop"
                    class="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" alt="Ciclismo">
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                    <p class="text-white font-black text-lg">Ciclismo</p>
                    <p class="text-white/70 text-xs mt-0.5">Melhor com vento até 30 km/h, temperatura amena e pista seca.</p>
                </div>
            </div>

            <div class="rounded-2xl overflow-hidden relative group cursor-pointer shadow-md"
                onclick="loadPage('surf')">
                <img src="https://images.unsplash.com/photo-1530870110042-98b2cb110834?w=600&auto=format&fit=crop"
                    class="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" alt="Surf">
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                    <p class="text-white font-black text-lg">Surf</p>
                    <p class="text-white/70 text-xs mt-0.5">Ventos acima de 10 km/h e temperatura do mar favorável fazem a diferença.</p>
                </div>
            </div>
        </div>
        ` : ""}
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

    // Sidebar diferente para home e para esportes
    if (sport === "home") {
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
            <div class="spa-sidebar-card mt-4">
                <h3 class="text-primary flex items-center gap-2">
                    <span class="material-symbols-outlined">info</span>
                    Como usar
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    Escolha um esporte na barra lateral para ver análise climática personalizada com melhor e pior horário para praticar hoje.
                </p>
            </div>
        `;
    } else {
        // Sidebar com ícone e dica específica do esporte
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

    // Dispara análise após dados da API chegarem
    setTimeout(() => analisarEsporte(sport), 1800);
    atualizarClimaNaTela();

    sportButtons.forEach(btn => btn.classList.remove("active"));
    sportSidebarButtons.forEach(btn => btn.classList.remove("sidebar-active"));
    document.querySelector(`[data-sport="${sport}"]`)?.classList.add("sidebar-active");

    const sobreBtn = document.getElementById('sobreProjetoBtn');
    if (sobreBtn) sobreBtn.classList.remove('sobre-btn-active');
}

loadPage("home");

// ─── 3. NAVEGAÇÃO — Sobre o Projeto e busca por localização ──────────────────

// Renderiza a seção "Sobre o Projeto" com os cards das criadoras
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


// Busca por localização na barra de pesquisa do header
const searchInput = document.querySelector('input[placeholder="Buscar localização..."]');

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


// ─── 4. NOTIFICAÇÕES — Drawer lateral ────────────────────────────────────────
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

    function openDrawer() {
        overlay.classList.remove('hidden');
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                overlay.classList.add('opacity-100');
                drawer.classList.remove('translate-x-[120%]');
            });
        });
    }

    function closeDrawer() {
        drawer.classList.add('translate-x-[120%]');
        overlay.classList.remove('opacity-100');
        setTimeout(() => overlay.classList.add('hidden'), 300);
    }

    function hideBadge() {
        if (badge) badge.classList.add('hidden');
    }

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

    function applyClearState() {
        if (!listArea || !emptyState) return;
        const groups = listArea.querySelectorAll('div:not(#emptyState)');
        groups.forEach(g => g.remove());
        emptyState.classList.remove('hidden');
        emptyState.classList.add('flex');
        hideBadge();
        localStorage.setItem('sportclima_notifs_status', 'cleared');
    }

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
})();


// ─── 5. MENU DE PERFIL — Dropdown do header ───────────────────────────────────
(function initProfileMenu() {
    const trigger = document.getElementById('profileTrigger');
    const menu = document.getElementById('profileMenu');

    if (!trigger || !menu) return;

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('hidden');
        if (!menu.classList.contains('hidden')) {
            menu.style.animation = 'profileFadeIn 0.2s ease-out';
        }
    });

    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && e.target !== trigger) {
            menu.classList.add('hidden');
        }
    });
})();


// ─── 6. TEMA TOGGLE — Botão claro/escuro do header ───────────────────────────
(function initThemeToggle() {
    const toggleBtn = document.getElementById('dark-mode-toggle');
    const darkIcon = document.getElementById('dark-icon');
    const html = document.documentElement;

    if (!toggleBtn) return;

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


// ─── 3b. NAVEGAÇÃO LATERAL — Destaque ativo e busca integrada ────────────────
(function initSidebarNav() {
    const items = document.querySelectorAll('.sport-btn-sidebar');
    const topSearch = document.querySelector('header input');
    let currentActive = document.querySelector('[data-sport="home"]') || items[0];

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

        const sobreBtn = document.getElementById('sobreProjetoBtn');
        if (sobreBtn) sobreBtn.classList.remove('sobre-btn-active');

        element.classList.add('sidebar-active');
        currentActive = element;
    }

    items.forEach(item => {
        item.addEventListener('click', () => applyActiveStyle(item));
    });

    if (topSearch) {
        topSearch.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const query = topSearch.value.toLowerCase().trim();
                if (query.length === 0) return;

                const match = Array.from(items).find(i =>
                    i.getAttribute('data-sport')?.toLowerCase().includes(query) ||
                    i.textContent.toLowerCase().includes(query)
                );

                if (match) {
                    applyActiveStyle(match);
                    topSearch.value = "";
                    topSearch.blur();
                } else {
                    alert(`Nenhum esporte encontrado para: "${topSearch.value}"`);
                    topSearch.value = "";
                    topSearch.blur();
                    applyActiveStyle(currentActive);
                }
            }
        });
    }

    applyActiveStyle(currentActive);
})();


// ─── 7. FEEDBACK MODAL — Envio via EmailJS ───────────────────────────────────
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

        if (!nome || !email || !mensagem) {
            [nomeInput, emailInput, mensagemInput].forEach(el => {
                if (el && !el.value.trim()) {
                    el.style.borderColor = '#ef4444';
                    setTimeout(() => el.style.removeProperty('border-color'), 1800);
                }
            });
            return;
        }

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

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('modal-open')) closeModal();
    });
})();


// ─── 8. MODAL DE PERFIL — Preenchimento dinâmico e persistência ──────────────

/**
 * Lê o usuário ativo do localStorage e preenche os campos
 * do modal de perfil com os dados reais. O apelido é gerado
 * automaticamente pelo primeiro nome caso não tenha sido
 * definido pelo usuário anteriormente.
 */
function preencherModalPerfil() {
    const session = JSON.parse(localStorage.getItem('sportclima_session') || 'null');
    if (!session) return;

    // Busca os dados completos do usuário no array de cadastros
    const users = JSON.parse(localStorage.getItem('sportclima_users') || '[]');
    const user = users.find(u => u.email === session.email) || {};

    // Separa o nome completo em primeiro nome e sobrenome
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
    if (inputData) inputData.value = user.dataNascimento || '';
}

/**
 * Lê os valores editados no modal, atualiza o objeto do usuário
 * no array 'sportclima_users' no localStorage e sincroniza
 * a sessão ativa e os elementos visuais do menu de perfil.
 */
function salvarAlteracoesPerfil() {
    const session = JSON.parse(localStorage.getItem('sportclima_session') || 'null');
    if (!session) { fecharModal(); return; }

    const primeiroNome = document.getElementById('modalNome')?.value.trim() || '';
    const sobrenome = document.getElementById('modalSobrenome')?.value.trim() || '';
    const apelido = document.getElementById('modalApelido')?.value.trim() || '';
    const dataNascimento = document.getElementById('modalDataNascimento')?.value || '';

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


// ─── 9. FUNÇÕES GLOBAIS DO MODAL DE PERFIL ───────────────────────────────────

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


// ─── 10. FOTO DE PERFIL — Upload e exibição imediata ─────────────────────────

/**
 * Processa a imagem selecionada pelo usuário, salva em Base64
 * no localStorage vinculado ao e-mail da sessão e atualiza
 * todos os elementos visuais de avatar na interface.
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


// ─── 11. SESSÃO — Inicialização do estado de login na interface ───────────────

/**
 * Verifica se existe uma sessão ativa no localStorage e, caso exista,
 * exibe o nome e e-mail do usuário no menu de perfil, oculta o botão
 * de login, exibe o botão de logout e carrega a foto de perfil salva.
 */
(function initSession() {
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

// ─── 12. FUNÇÃO PARA API ───────────────────────────────────────────────────────────────────────────

const API_KEY = "acf0f9a2de62c1192e03cccf429be48d";
const inputCidade = document.getElementById("inputCidade");
const btnBuscar = document.getElementById("btnBuscarCidade");


// Listener único de busca — atualiza clima E análise de esporte
btnBuscar.addEventListener("click", async () => {
    const cidade = inputCidade.value.trim();
    if (!cidade) return;

    window._cidadeAtual = cidade;
    await atualizarClimaNaTela(cidade);

    // Reatualiza a análise para o esporte atualmente ativo
    const sportAtivo = document.querySelector('.sport-btn-sidebar.sidebar-active');
    const sport = sportAtivo?.getAttribute('data-sport') || 'home';
    setTimeout(() => analisarEsporte(sport), 300);
});

inputCidade.addEventListener("keypress", (e) => {
    if (e.key === "Enter") btnBuscar.click();
});

//──────────────────── FUNÇÃO PARA ATUALIZAR O CLIMA NA TELA ────────────────────────────────────────────────

async function atualizarClimaNaTela(cidade = "Sorocaba") {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cidade}&appid=${API_KEY}&units=metric&lang=pt_br`;

    try {
        const res = await fetch(url);
        const dados = await res.json();

        window._dadosClimaAPI = dados; // salva globalmente para o gráfico

        const atual = dados.list[0];

        const elTemp = document.getElementById("temp");
        const elVento = document.getElementById("vento");
        const elUmidade = document.getElementById("umidade");
        const elUv = document.getElementById("uv");

        if (elTemp) elTemp.textContent = Math.round(atual.main.temp) + "°C";
        if (elVento) elVento.textContent = Math.round(atual.wind.speed * 3.6) + " km/h";
        if (elUmidade) elUmidade.textContent = atual.main.humidity + "%";
        if (elUv) elUv.textContent = "—";

        // Renderiza o gráfico padrão de temperatura
        renderizarGrafico("temp");

    } catch (erro) {
        console.error("Erro clima:", erro);
    }
}

// Alterna o tipo do gráfico e destaca o botão ativo
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

// Desenha as barras do gráfico com base no tipo selecionado
function renderizarGrafico(tipo) {
    const dados = window._dadosClimaAPI;
    const barsEl = document.getElementById("chartBars");
    const labelsEl = document.getElementById("chartLabels");

    if (!dados || !barsEl) return;

    const fatias = dados.list.slice(0, 8);

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

    const max = Math.max(...valores, 1);

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
    // ─── 13. ANÁLISE DE ESPORTE COM BASE NA API ──────────────────────────────────
function analisarEsporte(sport) {
    const dados = window._dadosClimaAPI;
    const el = document.getElementById("analiseEsporte");

    // Se os dados ainda não chegaram, tenta novamente em 1s (até 5 tentativas)
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

    // Critérios por esporte
    const criterios = {
        corrida: (item) => item.main.temp >= 10 && item.main.temp <= 25
            && item.wind.speed * 3.6 <= 20
            && (item.rain?.["3h"] || 0) === 0,

        ciclismo: (item) => item.main.temp >= 12 && item.main.temp <= 28
            && item.wind.speed * 3.6 <= 30
            && (item.rain?.["3h"] || 0) === 0,

        surf: (item) => item.wind.speed * 3.6 >= 10
            && item.main.temp >= 18,

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
    `;
}


btnBuscar.addEventListener("click", () => {
    const cidade = inputCidade.value.trim();

    if (cidade !== "") {
        atualizarClimaNaTela(cidade);
    }
});

// ─── 14. GEOLOCALIZAÇÃO — Solicita permissão e carrega clima local ────────────
(function initGeolocation() {
    if (!navigator.geolocation) {
        // Navegador não suporta — usa fallback
        atualizarClimaNaTela("Sorocaba");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (pos) => {
            const { latitude, longitude } = pos.coords;
            const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=pt_br`;
            try {
                const res = await fetch(url);
                const dados = await res.json();
                window._cidadeAtual = dados.city?.name || "Sua localização";
                await atualizarClimaNaTela(window._cidadeAtual);

                // Atualiza o hero APENAS se ainda estiver na página home
                const sportAtivo = document.querySelector('.sport-btn-sidebar.sidebar-active');
                const sport = sportAtivo?.getAttribute('data-sport') || 'home';
                if (sport === 'home') {
                    const heroTitle = document.querySelector('.spa-hero-content h1');
                    if (heroTitle) heroTitle.textContent = `Condições em ${window._cidadeAtual}`;
                }
            } catch (e) {
                atualizarClimaNaTela("Sorocaba");
            }
        },
        (err) => {
            // Usuário negou ou erro — usa fallback silencioso
            console.warn("Geolocalização negada, usando Sorocaba como padrão.");
            atualizarClimaNaTela("Sorocaba");
        },
        {
            timeout: 8000,        // desiste após 8s
            maximumAge: 300000    // reusa posição cacheada por até 5 min
        }
    );
})();