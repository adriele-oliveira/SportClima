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
    const emailError = document.getElementById('emailError');
    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

    const showEmailError = (msg) => {
        if (emailError) {
            emailError.textContent = msg;
            emailError.classList.remove('hidden');
        }
        emailInput?.classList.add('ring-2', 'ring-red-400');
    };

    const clearEmailError = () => {
        if (emailError) emailError.classList.add('hidden');
        emailInput?.classList.remove('ring-2', 'ring-red-400');
    };

    emailInput?.addEventListener('input', clearEmailError);

    loginForm?.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = document.getElementById('password').value;

        if (!emailRegex.test(email)) {
            showEmailError('Insira um e-mail válido. Ex: nome@dominio.com');
            return;
        }

        const users = JSON.parse(localStorage.getItem('sportclima_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            showEmailError('E-mail ou senha incorretos.');
            return;
        }

        localStorage.setItem('sportclima_session', JSON.stringify({ name: user.name, email: user.email }));
        window.location.href = 'index.html';
    });
});