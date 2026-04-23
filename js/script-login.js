(function () {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
    } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    const darkIcon = document.getElementById('dark-icon');
    const toggleBtn = document.getElementById('dark-mode-toggle');
    const html = document.documentElement;

    if (darkIcon && localStorage.getItem('theme') === 'dark') {
        darkIcon.textContent = 'light_mode';
    }

    toggleBtn?.addEventListener('click', () => {
        const isDark = html.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        if (darkIcon) darkIcon.textContent = isDark ? 'light_mode' : 'dark_mode';
    });

    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.getElementById('loginPasswordToggle');
    const rememberMe = document.getElementById('rememberMe');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

    const showError = (element, msg) => {
        if (!element) return;
        element.textContent = msg;
        element.classList.remove('hidden');
        element.previousElementSibling?.classList?.add('ring-2', 'ring-red-400');
    };

    const clearError = (element) => {
        if (!element) return;
        element.classList.add('hidden');
        element.previousElementSibling?.classList?.remove('ring-2', 'ring-red-400');
    };

    emailInput?.addEventListener('input', () => clearError(emailError));
    passwordInput?.addEventListener('input', () => clearError(passwordError));

    passwordToggle?.addEventListener('click', () => {
        if (!passwordInput) return;
        const visible = passwordInput.type === 'text';
        passwordInput.type = visible ? 'password' : 'text';
        const icon = passwordToggle.querySelector('.material-symbols-outlined');
        if (icon) icon.textContent = visible ? 'visibility' : 'visibility_off';
    });

    loginForm?.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        clearError(emailError);
        clearError(passwordError);

        if (!emailRegex.test(email)) {
            showError(emailError, 'Insira um e-mail válido. Ex: nome@dominio.com');
            emailInput.focus();
            return;
        }

        if (!password) {
            showError(passwordError, 'Senha obrigatória.');
            passwordInput.focus();
            return;
        }

        const users = JSON.parse(localStorage.getItem('sportclima_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            showError(emailError, 'E-mail ou senha incorretos.');
            return;
        }

        if (rememberMe?.checked) {
            localStorage.setItem('sportclima_keep_connected', 'true');
        } else {
            localStorage.removeItem('sportclima_keep_connected');
        }

        localStorage.setItem('sportclima_session', JSON.stringify({ name: user.name, email: user.email }));
        window.location.href = 'index.html';
    });

    emailInput?.focus();
});