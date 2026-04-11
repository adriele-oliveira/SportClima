// Seletores principais
const spaContent = document.getElementById("spaContent");
const spaSidebarRight = document.getElementById("spaSidebarRight");
const sportButtons = document.querySelectorAll(".sport-btn");
const sportSidebarButtons = document.querySelectorAll(".sport-btn-sidebar");


// ----------------------------
// DADOS DAS PÁGINAS DE ESPORTE
// ----------------------------

const pages = {
        home: {
            heroImg: "https://images.unsplash.com/photo-1607962837359-5e7e89f86776?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            titulo: "Condições Ideais em Boulder",
            desc: "Céu limpo, brisa leve e temperaturas moderadas.",
            sidebar: "06h–09h",
            metrics: {
            temp: "18°C",
            vento: "5 km/h",
            umidade: "45%",
            uv: "2"
        },
        //mapImg: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?q=80&w=1000",
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
      //  mapImg: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?q=80&w=1000",
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
       // mapImg: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1000",
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
      //  mapImg: "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?q=80&w=1000",
        sidebar: {
            melhorHorario: "05:40 - 08:20",
            descricao: "Ondas longas e vento ideal para manobras.",
            evitar: "11:30 - 15:30"
        }
    }
};


// ----------------------------
// FUNÇÃO PRINCIPAL DA SPA
// ----------------------------

function loadPage(sport) {
    const data = pages[sport];

    // ----------------------------
    // CENTRAL
    // ----------------------------
    spaContent.innerHTML = `
        <div class="spa-hero group">
            <div class="spa-hero-bg" style="background-image: linear-gradient(to top,rgba(0,0,0,.8),rgba(0,0,0,.2)), url('${data.heroImg}')"></div>
            <div class="spa-hero-content">
                <span class="px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase rounded-full">${sport}</span>
                <h1 class="text-white text-4xl font-black mt-3">${data.titulo}</h1>
                <p class="text-white/80 text-lg mt-2">${data.desc}</p>
            </div>
        </div>

        <!-- MÉTRICAS -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div class="metric-card">
                <p class="text-sm text-slate-500">Temperatura</p>
                <h4 class="text-2xl font-bold mt-1">${data.metrics.temp}</h4>
            </div>
            <div class="metric-card">
                <p class="text-sm text-slate-500">Vento</p>
                <h4 class="text-2xl font-bold mt-1">${data.metrics.vento}</h4>
            </div>
            <div class="metric-card">
                <p class="text-sm text-slate-500">Umidade</p>
                <h4 class="text-2xl font-bold mt-1">${data.metrics.umidade}</h4>
            </div>
            <div class="metric-card">
                <p class="text-sm text-slate-500">Índice UV</p>
                <h4 class="text-2xl font-bold mt-1">${data.metrics.uv}</h4>
            </div>
        </div>

        <!-- GRÁFICO -->
        <div class="chart-container mt-6">
            <h3 class="text-lg font-bold mb-4">Variação Horária</h3>
            <div class="flex items-end h-32">
                <div class="chart-bar" style="height:80px"></div>
                <div class="chart-bar" style="height:110px"></div>
                <div class="chart-bar" style="height:70px"></div>
                <div class="chart-bar" style="height:95px"></div>
                <div class="chart-bar" style="height:60px"></div>
                <div class="chart-bar" style="height:120px"></div>
            </div>
        </div>

        <!-- MAPA 
        <div class="map-box mt-6" style="background-image:url('${data.mapImg}')">
            <div class="map-overlay">
                <div class="map-ping"></div>
            </div>
        </div>-->
    `;


    // ----------------------------
    // SIDEBAR DIREITO VARIÁVEL
    // ----------------------------
    spaSidebarRight.innerHTML = `
        <div class="spa-sidebar-card">
            <h3 class="text-primary flex items-center gap-2">
                <span class="material-symbols-outlined">schedule</span>
                Horários Ideais
            </h3>

            <p class="text-xs text-slate-600 mt-2">
                <strong>Melhor horário:</strong> ${data.sidebar.melhorHorario}
            </p>

            <p class="text-xs text-slate-600 mt-1">${data.sidebar.descricao}</p>

            <p class="text-xs text-red-600 mt-3">
                <strong>Evitar:</strong> ${data.sidebar.evitar}
            </p>
        </div>
    `;

    

    // Atualiza botões ativos
    sportButtons.forEach(btn => btn.classList.remove("active"));
    sportSidebarButtons.forEach(btn => btn.classList.remove("active"));

    document.querySelector(`[data-sport="${sport}"]`)?.classList.add("active");
}


// ----------------------------
// EVENTOS
// ----------------------------

sportButtons.forEach(btn =>
    btn.addEventListener("click", () => loadPage(btn.dataset.sport))
);

sportSidebarButtons.forEach(btn =>
    btn.addEventListener("click", () => loadPage(btn.dataset.sport))
);


// ----------------------------
// CARREGAR PÁGINA INICIAL PADRÃO
// ----------------------------
loadPage("home");

// ----------------------------
// LOGICA DE PESQUISA COM SINÔNIMOS
// ----------------------------

const searchInput = document.querySelector('input[placeholder="Buscar localização..."]');

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

        if (synonyms[query]) {
            query = synonyms[query];
        }

        if (pages[query]) {
            loadPage(query);
            searchInput.value = ""; 
        } else {
            alert("Esporte não encontrado. Tente: corrida, surf ou ciclismo.");
        }
    }
});
// ----------------------------
// CONTROLE DE NOTIFICAÇÕES (VERSÃO CORRIGIDA)
// ----------------------------

const openBtn = document.getElementById('notificationBtn');
const closeBtn = document.getElementById('closeNotifications');
const drawer = document.getElementById('notificationDrawer');
const overlay = document.getElementById('notificationOverlay');

function openNav() {
    overlay.classList.remove('hidden');
    // Pequeno delay para a animação do Tailwind funcionar
    setTimeout(() => {
        drawer.classList.remove('translate-x-full');
    }, 10);
}

function closeNav() {
    drawer.classList.add('translate-x-full');
    setTimeout(() => {
        overlay.classList.add('hidden');
    }, 300); // Tempo da transição do CSS
}

// Eventos de clique
if (openBtn) {
    openBtn.onclick = openNav;
}

if (closeBtn) {
    closeBtn.onclick = closeNav;
}

if (overlay) {
    overlay.onclick = closeNav;
}
// ---------------------------------------------------------
// SISTEMA DE NOTIFICAÇÕES PERSISTENTE - SPORTCLIMA
// ---------------------------------------------------------
(function initPersistentNotifications() {
    const bellBtn = Array.from(document.querySelectorAll('.material-symbols-outlined'))
                         .find(el => el.textContent.trim() === 'notifications');
    const drawer = document.getElementById('notificationDrawer');
    const overlay = document.getElementById('notificationOverlay');
    const closeBtn = document.getElementById('closeNotifications');
    const container = document.querySelector('#notificationDrawer .flex-1.overflow-y-auto');

    // Seleção dos botões de ação
    const clearBtn = Array.from(document.querySelectorAll('button, span')).find(el => el.textContent.trim() === 'Limpar');
    const markReadBtn = Array.from(document.querySelectorAll('button, span')).find(el => el.textContent.trim() === 'Marcar todas como lidas');

    if (!bellBtn || !drawer || !overlay || !container) return;

    // --- 1. FUNÇÕES DE ESTADO (UI) ---

    const removeBellBadge = () => {
        const badge = bellBtn.querySelector('.notification-badge');
        if (badge) badge.remove();
    };

    const applyReadStyle = () => {
        // Encontra todos os cards de notificação dentro do container
        const cards = container.querySelectorAll('.bg-white, .bg-orange-50');
        
        cards.forEach(card => {
            // Aplica o fundo verde claro e remove o destaque de "não lido"
            card.classList.remove('bg-orange-50', 'bg-white');
            card.classList.add('bg-green-50', 'border-l-4', 'border-green-400');

            // Adiciona o ícone de Check se não existir
            if (!card.querySelector('.check-done')) {
                const check = document.createElement('span');
                check.className = 'material-symbols-outlined check-done text-green-500 text-sm ml-auto';
                check.textContent = 'done_all';
                // Tenta inserir ao lado do título ou no topo do card
                const header = card.querySelector('.flex') || card;
                header.appendChild(check);
            }

            // Remove o pontinho laranja/vermelho de notificação nova
            const dot = card.querySelector('.bg-orange-500, .rounded-full');
            if (dot) dot.remove();
        });

        removeBellBadge();
        localStorage.setItem('sportclima_notifs_status', 'read');
    };

    const applyClearState = () => {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full text-center p-8">
                <span class="material-symbols-outlined text-5xl text-gray-300 mb-2">notifications_off</span>
                <p class="text-gray-500 font-medium text-sm">Nenhuma notificação por aqui</p>
                <p class="text-gray-400 text-xs mt-1">Tudo limpo no seu dashboard!</p>
            </div>
        `;
        removeBellBadge();
        localStorage.setItem('sportclima_notifs_status', 'cleared');
    };

    // --- 2. CARREGAMENTO INICIAL (PERSISTÊNCIA) ---

    const savedStatus = localStorage.getItem('sportclima_notifs_status');
    
    // Adiciona o badge apenas se nunca foi lido ou limpo
    if (!savedStatus && !bellBtn.querySelector('.notification-badge')) {
        bellBtn.style.position = 'relative';
        const badge = document.createElement('span');
        badge.className = 'notification-badge absolute -top-1 -right-1 flex h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white';
        bellBtn.appendChild(badge);
    }

    // Aplica o estado salvo ao carregar a página
    if (savedStatus === 'cleared') applyClearState();
    else if (savedStatus === 'read') applyReadStyle();

    // --- 3. EVENTOS DE CLIQUE ---

    if (markReadBtn) {
        markReadBtn.onclick = (e) => {
            e.preventDefault();
            applyReadStyle();
        };
    }

    if (clearBtn) {
        clearBtn.onclick = (e) => {
            e.preventDefault();
            applyClearState();
        };
    }

    // Lógica de abrir/fechar a aba (reutilizada do anterior)
    bellBtn.onclick = () => {
        overlay.classList.remove('hidden');
        setTimeout(() => {
            overlay.classList.add('opacity-100');
            drawer.classList.remove('translate-x-[120%]');
        }, 10);
    };

    const closeNav = () => {
        drawer.classList.add('translate-x-[120%]');
        overlay.classList.remove('opacity-100');
        setTimeout(() => { if (drawer.classList.contains('translate-x-[120%]')) overlay.classList.add('hidden'); }, 300);
    };

    if (closeBtn) closeBtn.onclick = closeNav;
    overlay.onclick = (e) => { if (e.target === overlay) closeNav(); };
})();
