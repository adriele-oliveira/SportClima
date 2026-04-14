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
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const html = document.documentElement;

    const syncIcon = () => {
        if (themeIcon) {
            themeIcon.innerText = html.classList.contains('dark') ? 'light_mode' : 'dark_mode';
        }
    };

    syncIcon();

    themeToggle?.addEventListener('click', () => {
        const isDark = html.classList.toggle('dark');
        isDark ? html.classList.remove('light') : html.classList.add('light');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        syncIcon();
    });

    const form = document.getElementById('formCadastro');
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const submitBtn = document.getElementById('btnCadastrar');
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

    form?.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = emailInput.value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (!emailRegex.test(email)) {
            showEmailError('Insira um e-mail válido. Ex: nome@dominio.com');
            return;
        }

        if (password !== confirmPassword) {
            alert('As senhas não coincidem.');
            return;
        }

        const users = JSON.parse(localStorage.getItem('sportclima_users') || '[]');

        if (users.find(u => u.email === email)) {
            showEmailError('Este e-mail já está cadastrado.');
            return;
        }

        users.push({ name, email, password });
        localStorage.setItem('sportclima_users', JSON.stringify(users));

        if (submitBtn) {
            submitBtn.innerHTML = `<span class="material-symbols-outlined align-middle text-[20px]">check_circle</span> Cadastro realizado!`;
            submitBtn.disabled = true;
            submitBtn.classList.remove('bg-primary', 'hover:shadow-primary/40', 'hover:-translate-y-0.5');
            submitBtn.classList.add('bg-green-500', 'cursor-not-allowed');
        }

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 3000);
    });
});