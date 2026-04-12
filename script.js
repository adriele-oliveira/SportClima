// =============================================================
// sportclima — script.js
// controla: spa, navegação, busca, notificações, perfil e tema
// =============================================================


// -------------------------------------------------------------
// 1. aplicação imediata do tema (evita flash ao carregar)
// -------------------------------------------------------------
(function applyThemeOnLoad() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
})();


// -------------------------------------------------------------
// 2. seletores principais da spa
// -------------------------------------------------------------
const spaContent       = document.getElementById("spaContent");
const spaSidebarRight  = document.getElementById("spaSidebarRight");
const sportButtons     = document.querySelectorAll(".sport-btn");
const sportSidebarButtons = document.querySelectorAll(".sport-btn-sidebar");


// -------------------------------------------------------------
// 3. dados das páginas de esporte
// -------------------------------------------------------------
const pages = {
    home: {
        heroImg: "https://images.unsplash.com/photo-1607962837359-5e7e89f86776?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        titulo: "Condições Ideais em Boulder",
        desc: "Céu limpo, brisa leve e temperaturas moderadas.",
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


// -------------------------------------------------------------
// 4. função principal da spa — renderiza conteúdo central e sidebar
// -------------------------------------------------------------
function loadPage(sport) {
    const data = pages[sport];

    // conteúdo central: hero, métricas e gráfico
    spaContent.innerHTML = `
        <div class="spa-hero group">
            <div class="spa-hero-bg" style="background-image: linear-gradient(to top,rgba(0,0,0,.8),rgba(0,0,0,.2)), url('${data.heroImg}')"></div>
            <div class="spa-hero-content">
                <span class="px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase rounded-full">${sport}</span>
                <h1 class="text-white text-4xl font-black mt-3">${data.titulo}</h1>
                <p class="text-white/80 text-lg mt-2">${data.desc}</p>
            </div>
        </div>

        <!-- cards de métricas climáticas -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div class="metric-card">
                <p class="text-sm text-slate-500 dark:text-slate-400">Temperatura</p>
                <h4 class="text-2xl font-bold mt-1 dark:text-slate-100">${data.metrics.temp}</h4>
            </div>
            <div class="metric-card">
                <p class="text-sm text-slate-500 dark:text-slate-400">Vento</p>
                <h4 class="text-2xl font-bold mt-1 dark:text-slate-100">${data.metrics.vento}</h4>
            </div>
            <div class="metric-card">
                <p class="text-sm text-slate-500 dark:text-slate-400">Umidade</p>
                <h4 class="text-2xl font-bold mt-1 dark:text-slate-100">${data.metrics.umidade}</h4>
            </div>
            <div class="metric-card">
                <p class="text-sm text-slate-500 dark:text-slate-400">Índice UV</p>
                <h4 class="text-2xl font-bold mt-1 dark:text-slate-100">${data.metrics.uv}</h4>
            </div>
        </div>

        <!-- gráfico de variação horária -->
        <div class="chart-container mt-6">
            <h3 class="text-lg font-bold mb-4 dark:text-slate-100">Variação Horária</h3>
            <div class="flex items-end h-32">
                <div class="chart-bar" style="height:80px"></div>
                <div class="chart-bar" style="height:110px"></div>
                <div class="chart-bar" style="height:70px"></div>
                <div class="chart-bar" style="height:95px"></div>
                <div class="chart-bar" style="height:60px"></div>
                <div class="chart-bar" style="height:120px"></div>
            </div>
        </div>
    `;

    // sidebar direita: horários ideais
    spaSidebarRight.innerHTML = `
        <div class="spa-sidebar-card">
            <h3 class="text-primary flex items-center gap-2">
                <span class="material-symbols-outlined">schedule</span>
                Horários Ideais
            </h3>
            <p class="text-xs text-slate-600 dark:text-slate-400 mt-2">
                <strong>Melhor horário:</strong> ${data.sidebar.melhorHorario}
            </p>
            <p class="text-xs text-slate-600 dark:text-slate-400 mt-1">${data.sidebar.descricao}</p>
            <p class="text-xs text-red-600 dark:text-red-400 mt-3">
                <strong>Evitar:</strong> ${data.sidebar.evitar}
            </p>
        </div>
    `;

    // atualiza estado ativo dos botões de navegação
    sportButtons.forEach(btn => btn.classList.remove("active"));
    sportSidebarButtons.forEach(btn => btn.classList.remove("active"));
    document.querySelector(`[data-sport="${sport}"]`)?.classList.add("active");
}


// -------------------------------------------------------------
// 5. eventos dos botões de esporte na sidebar e no conteúdo
// -------------------------------------------------------------
sportButtons.forEach(btn =>
    btn.addEventListener("click", () => loadPage(btn.dataset.sport))
);

sportSidebarButtons.forEach(btn =>
    btn.addEventListener("click", () => loadPage(btn.dataset.sport))
);


// -------------------------------------------------------------
// 6. carregamento da página inicial padrão
// -------------------------------------------------------------
loadPage("home");


// -------------------------------------------------------------
// 7. lógica de busca por localização com sinônimos
// -------------------------------------------------------------
const searchInput = document.querySelector('input[placeholder="Buscar localização..."]');

if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            let query = searchInput.value.toLowerCase().trim();

            const synonyms = {
                "surfe":     "surf",
                "pedalar":   "ciclismo",
                "bike":      "ciclismo",
                "correr":    "corrida",
                "inicio":    "home",
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


// -------------------------------------------------------------
// 8. controle do drawer de notificações
// -------------------------------------------------------------
(function initNotifications() {
    const bellBtn      = document.getElementById('notificationBtn');
    const drawer       = document.getElementById('notificationDrawer');
    const overlay      = document.getElementById('notificationOverlay');
    const closeBtn     = document.getElementById('closeNotifications');
    const markReadBtn  = document.getElementById('markAllReadBtn');
    const clearBtn     = document.getElementById('clearNotifsBtn');
    const emptyState   = document.getElementById('emptyState');
    const badge        = document.getElementById('notifBadge');
    const listArea     = document.querySelector('#notificationDrawer .flex-1.overflow-y-auto');

    if (!bellBtn || !drawer || !overlay) return;

    // abre o drawer com animação
    function openDrawer() {
        overlay.classList.remove('hidden');
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                overlay.classList.add('opacity-100');
                drawer.classList.remove('translate-x-[120%]');
            });
        });
    }

    // fecha o drawer com animação
    function closeDrawer() {
        drawer.classList.add('translate-x-[120%]');
        overlay.classList.remove('opacity-100');
        setTimeout(() => overlay.classList.add('hidden'), 300);
    }

    // esconde o badge do sino
    function hideBadge() {
        if (badge) badge.classList.add('hidden');
    }

    // aplica estado "lidas" às notificações com destaque
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

    // limpa todas as notificações e exibe estado vazio
    function applyClearState() {
        if (!listArea || !emptyState) return;
        // remove todos os grupos de notificações
        const groups = listArea.querySelectorAll('div:not(#emptyState)');
        groups.forEach(g => g.remove());
        // exibe mensagem de lista vazia
        emptyState.classList.remove('hidden');
        emptyState.classList.add('flex');
        hideBadge();
        localStorage.setItem('sportclima_notifs_status', 'cleared');
    }

    // restaura o estado salvo no localstorage ao carregar
    const savedStatus = localStorage.getItem('sportclima_notifs_status');
    if (savedStatus === 'cleared') {
        // aguarda o dom estar pronto
        setTimeout(applyClearState, 50);
    } else if (savedStatus === 'read') {
        setTimeout(applyReadStyle, 50);
    }

    // esconde o badge se já lido ou limpo
    if (savedStatus && badge) badge.classList.add('hidden');

    // eventos
    bellBtn.addEventListener('click', openDrawer);
    if (closeBtn)    closeBtn.addEventListener('click', closeDrawer);
    if (markReadBtn) markReadBtn.addEventListener('click', applyReadStyle);
    if (clearBtn)    clearBtn.addEventListener('click', applyClearState);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeDrawer();
    });
})();


// -------------------------------------------------------------
// 9. controle do menu de perfil (dropdown do avatar)
// -------------------------------------------------------------
(function initProfileMenu() {
    const trigger = document.getElementById('profileTrigger');
    const menu    = document.getElementById('profileMenu');

    if (!trigger || !menu) return;

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('hidden');
        if (!menu.classList.contains('hidden')) {
            menu.style.animation = 'profileFadeIn 0.2s ease-out';
        }
    });

    // fecha o menu ao clicar fora dele
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && e.target !== trigger) {
            menu.classList.add('hidden');
        }
    });
})();


// -------------------------------------------------------------
// 10. alternância de tema claro/escuro com persistência
// -------------------------------------------------------------
(function initThemeToggle() {
    const toggleBtn = document.getElementById('dark-mode-toggle');
    const darkIcon  = document.getElementById('dark-icon');
    const html      = document.documentElement;

    if (!toggleBtn) return;

    // sincroniza o ícone com o tema atual ao carregar
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


// -------------------------------------------------------------
// 11. navegação ativa na sidebar com estilos visuais
// -------------------------------------------------------------
(function initSidebarNav() {
    const items = document.querySelectorAll('.sport-btn-sidebar');
    const topSearch = document.querySelector('header input');
    let currentActive = document.querySelector('[data-sport="home"]') || items[0];

    function applyActiveStyle(element) {
        if (!element) return;

        items.forEach(item => {
            item.style.backgroundColor = 'transparent';
            item.style.color = '';
            item.classList.remove('shadow-lg');
            const icon = item.querySelector('.material-symbols-outlined');
            const text = item.querySelector('p');
            if (icon) {
                icon.style.removeProperty('color');
                icon.classList.remove('filled');
            }
            if (text) text.style.removeProperty('color');
        });

        element.style.backgroundColor = '#f97316';
        element.style.color = 'white';
        element.classList.add('shadow-lg');
        const activeIcon = element.querySelector('.material-symbols-outlined');
        const activeText = element.querySelector('p');
        if (activeIcon) {
            activeIcon.style.setProperty('color', 'white', 'important');
            activeIcon.classList.add('filled');
        }
        if (activeText) activeText.style.setProperty('color', 'white', 'important');
        currentActive = element;
    }

    items.forEach(item => {
        item.addEventListener('click', () => applyActiveStyle(item));
    });

    // busca no campo do header também ativa o item da sidebar
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