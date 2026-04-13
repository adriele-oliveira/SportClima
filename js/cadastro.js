document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const htmlElement = document.documentElement;

    // Função para atualizar o ícone baseado no estado atual
    const syncIcon = () => {
        if (themeIcon) {
            themeIcon.innerText = htmlElement.classList.contains('dark') ? 'light_mode' : 'dark_mode';
        }
    };

    // Sincroniza o ícone assim que a página abre
    syncIcon();

    // Evento de clique para trocar e salvar
    themeToggle?.addEventListener('click', () => {
        if (htmlElement.classList.contains('dark')) {
            htmlElement.classList.remove('dark');
            htmlElement.classList.add('light');
            localStorage.setItem('theme', 'light');
        } else {
            htmlElement.classList.add('dark');
            htmlElement.classList.remove('light');
            localStorage.setItem('theme', 'dark');
        }
        syncIcon();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const htmlElement = document.documentElement;

    // 1. Sincroniza o ícone do botão assim que a página abre
    const syncIcon = () => {
        if (themeIcon) {
            // Se a página está dark, mostra o ícone de sol (para voltar pro claro)
            // Se está light, mostra o ícone de lua (para ir pro escuro)
            themeIcon.innerText = htmlElement.classList.contains('dark') ? 'light_mode' : 'dark_mode';
        }
    };

    syncIcon(); // Executa ao carregar a página

    // 2. Lógica do Clique (O ajuste que serve para os dois lados)
    themeToggle?.addEventListener('click', () => {
        // Se estiver escuro, vira claro. Se estiver claro, vira escuro.
        const isDark = htmlElement.classList.toggle('dark');

        if (isDark) {
            htmlElement.classList.remove('light');
            localStorage.setItem('theme', 'dark');
        } else {
            htmlElement.classList.add('light');
            localStorage.setItem('theme', 'light');
        }

        syncIcon(); // Atualiza o ícone após a troca
        console.log("Tema ajustado para:", isDark ? "Escuro" : "Claro");
    });
});