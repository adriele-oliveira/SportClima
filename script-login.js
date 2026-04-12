// =============================================================
// sportclima — script-login.js
// controla: formulário de login e alternância de tema
// =============================================================


// -------------------------------------------------------------
// 1. aplicação imediata do tema (evita flash ao navegar)
// -------------------------------------------------------------
(function applyThemeOnLoad() {
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
})();


// -------------------------------------------------------------
// 2. sincronização do ícone do botão de tema ao carregar
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const darkIcon = document.getElementById('dark-icon');
    if (darkIcon && localStorage.getItem('theme') === 'dark') {
        darkIcon.textContent = 'light_mode';
    }
});


// -------------------------------------------------------------
// 3. alternância de tema com persistência no localstorage
// -------------------------------------------------------------
(function initThemeToggle() {
    const toggleBtn = document.getElementById('dark-mode-toggle');
    const darkIcon  = document.getElementById('dark-icon');
    const html      = document.documentElement;

    if (!toggleBtn) return;

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
// 4. lógica do formulário de login
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (!loginForm) return;

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email    = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // validação básica de campos
        if (!email || !password) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        // simulação de autenticação bem-sucedida
        console.log('tentativa de login com:', email);
        alert('Login realizado com sucesso!');

        // redireciona para o dashboard mantendo o tema atual
        window.location.href = 'index.html';
    });
});