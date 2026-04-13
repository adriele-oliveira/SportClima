// =============================================================
// sportclima — script.js
// controla: spa, navegação, busca, notificações, perfil, tema
// e a aba "sobre o projeto"
// =============================================================


// -------------------------------------------------------------
// 1. aplicação imediata do tema (evita flash ao carregar)
// -------------------------------------------------------------
(function applyThemeOnLoad() {
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
})();


// -------------------------------------------------------------
// 2. seletores principais da spa
// -------------------------------------------------------------
const spaContent = document.getElementById("spaContent");
const spaSidebarRight = document.getElementById("spaSidebarRight");
const sportButtons = document.querySelectorAll(".sport-btn");
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
// 4. dados das criadoras do projeto
// -------------------------------------------------------------
const criadoras = [
    {
        nome: "Adriele Mesquita de Oliveira",
        cargo: "Estudante de Engenharia de Computação",
        descricao: "Especializada em análise de dados climáticos e sistemas de monitoramento em tempo real.",
        github: "https://github.com/adriele-oliveira",
        linkedin: "https://www.linkedin.com/in/adriele-mesquita-de-oliveira-5ba8591b3/",
        foto: ""
    },
    {
        nome: "Gabriela Lissa Nogami",
        cargo: "Estudante de Engenharia de Computação",
        descricao: "Focada em criar experiências intuitivas e acessíveis para atletas de alta performance.",
        github: "https://github.com/gabriela-nogami",
        linkedin: "https://www.linkedin.com/in/gabriela-nogami-940604263/",
        foto: ""
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


// -------------------------------------------------------------
// 5. função que renderiza a aba "sobre o projeto" na área central
// -------------------------------------------------------------
function loadSobreProjeto() {
    // limpa a sidebar direita (não é usada nesta aba) e expande o conteúdo central
    spaSidebarRight.innerHTML = "";
    spaSidebarRight.classList.add('hidden');
    spaContent.classList.add('lg:col-span-full');

    // constrói os cards das criadoras dinamicamente
    const cardsHtml = criadoras.map(c => `
        <div class="sobre-creator-card flex flex-col items-center text-center p-6 rounded-2xl
                    bg-white dark:bg-surface-2
                    border border-slate-100 dark:border-surface-3
                    shadow-sm hover:shadow-md dark:hover:shadow-black/30
                    transition-shadow duration-300">

            <!-- espaço reservado para a foto da criadora -->
            <div class="sobre-foto-placeholder w-24 h-24 rounded-full mb-5 overflow-hidden
                        border-4 border-primary/20 dark:border-primary/30
                        bg-slate-100 dark:bg-surface-3
                        flex items-center justify-center shrink-0">
                ${c.foto
            ? `<img src="${c.foto}" alt="Foto de ${c.nome}" class="w-full h-full object-cover" />`
            : `<span class="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600">account_circle</span>`
        }
            </div>

            <!-- nome e cargo da criadora -->
            <h3 class="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">${c.nome}</h3>
            <p class="text-xs font-semibold text-primary uppercase tracking-wider mb-3">${c.cargo}</p>

            <!-- descrição breve -->
            <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6 flex-1">${c.descricao}</p>

            <!-- botões de contato: github e linkedin -->
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

    // injeta o conteúdo completo da aba na área central
    spaContent.innerHTML = `
        <div class="w-full max-w-4xl mx-auto">
        <!-- cabeçalho da aba sobre o projeto -->
        <div class="text-center py-8 px-4">
            <h1 class="text-4xl font-black text-primary mb-2 tracking-tight">SportClima</h1>
            <p class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-8">Sobre o Projeto</p>
            <p class="text-base font-semibold text-slate-700 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Este é um projeto acadêmico focado no monitoramento climático para atletas de alta performance,
                unindo tecnologia e esporte para proporcionar insights precisos.
            </p>
        </div>

        <!-- grade de cards das criadoras -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 pb-6">
            ${cardsHtml}
        </div>

        <!-- rodapé da aba com copyright -->
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


// -------------------------------------------------------------
// 6. função principal da spa — renderiza conteúdo e sidebar por esporte
// -------------------------------------------------------------
function loadPage(sport) {
    const data = pages[sport];

    // restaura a sidebar direita caso estivesse oculta pela aba "sobre"
    spaSidebarRight.classList.remove('hidden');
    spaContent.classList.remove('lg:col-span-full');

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

    // sidebar direita: horários ideais para o esporte
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

    // atualiza estado ativo na sidebar
    sportButtons.forEach(btn => btn.classList.remove("active"));
    sportSidebarButtons.forEach(btn => btn.classList.remove("sidebar-active"));
    document.querySelector(`[data-sport="${sport}"]`)?.classList.add("sidebar-active");

    // remove destaque do botão "sobre o projeto" ao navegar para um esporte
    const sobreBtn = document.getElementById('sobreProjetoBtn');
    if (sobreBtn) sobreBtn.classList.remove('sobre-btn-active');
}


// -------------------------------------------------------------
// 7. eventos dos botões de esporte na sidebar
// -------------------------------------------------------------
sportButtons.forEach(btn =>
    btn.addEventListener("click", () => loadPage(btn.dataset.sport))
);

sportSidebarButtons.forEach(btn =>
    btn.addEventListener("click", () => loadPage(btn.dataset.sport))
);


// -------------------------------------------------------------
// 8. carregamento da página inicial padrão
// -------------------------------------------------------------
loadPage("home");


// -------------------------------------------------------------
// 9. evento do botão "sobre o projeto" na sidebar
// -------------------------------------------------------------
(function initSobreProjeto() {
    const sobreBtn = document.getElementById('sobreProjetoBtn');
    if (!sobreBtn) return;

    sobreBtn.addEventListener('click', () => {
        // remove o destaque de todos os itens de esporte via classe
        const sidebarItems = document.querySelectorAll('.sport-btn-sidebar');
        sidebarItems.forEach(item => {
            item.classList.remove('sidebar-active');
            item.style.removeProperty('background-color');
            item.style.removeProperty('color');
            item.classList.remove('shadow-lg');
            const icon = item.querySelector('.material-symbols-outlined');
            const text = item.querySelector('p');
            if (icon) { icon.style.removeProperty('color'); }
            if (text) { text.style.removeProperty('color'); }
        });

        // destaca o botão "sobre o projeto"
        sobreBtn.classList.add('sobre-btn-active');

        // renderiza o conteúdo da aba
        loadSobreProjeto();
    });
})();


// -------------------------------------------------------------
// 10. lógica de busca por localização com sinônimos
// -------------------------------------------------------------
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


// -------------------------------------------------------------
// 11. controle do drawer de notificações
// -------------------------------------------------------------
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

    // abre o drawer com animação suave
    function openDrawer() {
        overlay.classList.remove('hidden');
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                overlay.classList.add('opacity-100');
                drawer.classList.remove('translate-x-[120%]');
            });
        });
    }

    // fecha o drawer com animação suave
    function closeDrawer() {
        drawer.classList.add('translate-x-[120%]');
        overlay.classList.remove('opacity-100');
        setTimeout(() => overlay.classList.add('hidden'), 300);
    }

    // esconde o badge numérico do sino
    function hideBadge() {
        if (badge) badge.classList.add('hidden');
    }

    // marca todas as notificações como lidas visualmente
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
        const groups = listArea.querySelectorAll('div:not(#emptyState)');
        groups.forEach(g => g.remove());
        emptyState.classList.remove('hidden');
        emptyState.classList.add('flex');
        hideBadge();
        localStorage.setItem('sportclima_notifs_status', 'cleared');
    }

    // restaura o estado salvo no localstorage
    const savedStatus = localStorage.getItem('sportclima_notifs_status');
    if (savedStatus === 'cleared') setTimeout(applyClearState, 50);
    else if (savedStatus === 'read') setTimeout(applyReadStyle, 50);

    if (savedStatus && badge) badge.classList.add('hidden');

    // eventos do drawer
    bellBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (markReadBtn) markReadBtn.addEventListener('click', applyReadStyle);
    if (clearBtn) clearBtn.addEventListener('click', applyClearState);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeDrawer();
    });
})();


// -------------------------------------------------------------
// 12. controle do menu de perfil (dropdown do avatar)
// -------------------------------------------------------------
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

    // fecha o menu ao clicar fora
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && e.target !== trigger) {
            menu.classList.add('hidden');
        }
    });
})();


// -------------------------------------------------------------
// 13. alternância de tema claro/escuro com persistência
// -------------------------------------------------------------
(function initThemeToggle() {
    const toggleBtn = document.getElementById('dark-mode-toggle');
    const darkIcon = document.getElementById('dark-icon');
    const html = document.documentElement;

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
// 14. navegação ativa na sidebar com estilos visuais consistentes
// -------------------------------------------------------------
(function initSidebarNav() {
    const items = document.querySelectorAll('.sport-btn-sidebar');
    const topSearch = document.querySelector('header input');
    let currentActive = document.querySelector('[data-sport="home"]') || items[0];

    function applyActiveStyle(element) {
        if (!element) return;

        // reseta todos os itens: remove classe ativa, limpa qualquer inline style residual
        items.forEach(item => {
            item.classList.remove('sidebar-active');
            item.style.removeProperty('background-color');
            item.style.removeProperty('color');
            item.classList.remove('shadow-lg');
            const icon = item.querySelector('.material-symbols-outlined');
            const text = item.querySelector('p');
            if (icon) { icon.style.removeProperty('color'); }
            if (text) { text.style.removeProperty('color'); }
        });

        // remove destaque do botão "sobre o projeto"
        const sobreBtn = document.getElementById('sobreProjetoBtn');
        if (sobreBtn) sobreBtn.classList.remove('sobre-btn-active');

        // ativa o item clicado apenas via classe
        element.classList.add('sidebar-active');
        currentActive = element;
    }

    items.forEach(item => {
        item.addEventListener('click', () => applyActiveStyle(item));
    });

    // busca no header também ativa o item correspondente da sidebar
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


// -------------------------------------------------------------
// 15. modal de enviar feedback
// gatilhos: botão do menu de perfil + botão do card da sidebar
// -------------------------------------------------------------
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
        // fecha o menu de perfil se estiver aberto
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

    function handleSubmit() {
        const nome = document.getElementById('feedbackNome')?.value.trim();
        const email = document.getElementById('feedbackEmail')?.value.trim();
        const mensagem = document.getElementById('feedbackMensagem')?.value.trim();

        if (!nome || !email || !mensagem) {
            // destaca campos vazios com borda vermelha brevemente
            [document.getElementById('feedbackNome'),
            document.getElementById('feedbackEmail'),
            document.getElementById('feedbackMensagem')].forEach(el => {
                if (el && !el.value.trim()) {
                    el.style.borderColor = '#ef4444';
                    setTimeout(() => el.style.removeProperty('border-color'), 1800);
                }
            });
            return;
        }

        // feedback visual de sucesso no botão
        if (submitBtn) {
            submitBtn.innerHTML = `
                <span class="material-symbols-outlined filled text-[18px]">check_circle</span>
                <span>Enviado com sucesso!</span>`;
            submitBtn.disabled = true;
            submitBtn.classList.add('bg-green-500', 'shadow-green-500/20');
            submitBtn.classList.remove('bg-primary', 'shadow-primary/20');
        }

        setTimeout(() => {
            closeModal();
            clearForm();
            // restaura botão
            if (submitBtn) {
                submitBtn.innerHTML = `<span>Enviar Feedback</span>
                    <span class="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">send</span>`;
                submitBtn.disabled = false;
                submitBtn.classList.remove('bg-green-500', 'shadow-green-500/20');
                submitBtn.classList.add('bg-primary', 'shadow-primary/20');
            }
        }, 1600);
    }

    // gatilhos de abertura: menu de perfil e card da sidebar
    if (menuBtn) menuBtn.addEventListener('click', openModal);
    if (cardBtn) cardBtn.addEventListener('click', openModal);

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (submitBtn) submitBtn.addEventListener('click', handleSubmit);

    // fecha ao clicar no overlay
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // fecha com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('modal-open')) closeModal();
    });
})();

// Abrir/Fechar Menu do Topo
function toggleMenu() {
    const menu = document.getElementById('profileMenu');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

// Abrir o Modal de Perfil
function abrirModalPerfil() {
    const menu = document.getElementById('profileMenu');
    const modal = document.getElementById('modalPerfil');

    if (menu) menu.classList.add('hidden'); // Fecha o menu pequeno
    if (modal) {
        modal.classList.remove('hidden'); // Mostra o modal grande
        document.body.style.overflow = 'hidden'; // Trava o scroll do fundo
    }
}

// Fechar o Modal
function fecharModal() {
    const modal = document.getElementById('modalPerfil');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto'; // Destrava o scroll
    }
}

// Fechar menu ao clicar fora (Opcional, mas melhora a experiência)
window.onclick = function (event) {
    const menu = document.getElementById('profileMenu');
    const profileBtn = document.querySelector('[onclick="toggleMenu()"]'); // Seleciona o botão que abre o menu

    if (menu && !menu.contains(event.target) && event.target !== profileBtn) {
        menu.classList.add('hidden');
    }
}

// --- Função para processar o upload da nova foto ---
function processarNovaFoto(input) {
    // Verifica se um arquivo foi selecionado
    if (input.files && input.files[0]) {
        const reader = new FileReader();

        // Define o que acontece quando o arquivo for lido
        reader.onload = function (e) {
            // e.target.result contém a imagem em formato base64
            const novaImagemUrl = e.target.result;

            // 1. Atualizar o Modal de Perfil (Grande)
            document.getElementById('fotoPerfilGrande').src = novaImagemUrl; // Define a nova imagem
            document.getElementById('fotoPerfilGrande').classList.remove('hidden'); // Mostra a imagem
            document.getElementById('placeholderFotoGrande').classList.add('hidden'); // Esconde o ícone

            // 2. Atualizar o Menu Suspenso (Pequeno)
            document.getElementById('fotoPerfilPequena').src = novaImagemUrl; // Define a nova imagem
            document.getElementById('fotoPerfilPequena').classList.remove('hidden'); // Mostra a imagem
            document.getElementById('placeholderFotoPequena').classList.add('hidden'); // Esconde o ícone

            // Opcional: Atualizar o avatar do topo (Header) se tiver o mesmo esquema
            // document.getElementById('fotoPerfilHeader').src = novaImagemUrl;

            console.log("Foto de perfil atualizada com sucesso no SportClima!");
        };

        // Lê o arquivo como uma URL de dados (base64)
        reader.readAsDataURL(input.files[0]);
    }
}