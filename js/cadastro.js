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
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('confirm-password');
    const passwordStrength = document.getElementById('passwordStrength');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    const emailError = document.getElementById('emailError');
    const submitBtn = document.getElementById('btnCadastrar');
    const formMessage = document.getElementById('formMessage');
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

    const showError = (input, element, msg) => {
        if (!element) return;
        element.textContent = msg;
        element.classList.remove('hidden');
        input?.classList.add('ring-2', 'ring-red-400');
    };

    const clearError = (input, element) => {
        if (element) element.classList.add('hidden');
        input?.classList.remove('ring-2', 'ring-red-400');
    };

    const showFormMessage = (msg, type = 'error') => {
        if (!formMessage) return;
        formMessage.textContent = msg;
        formMessage.classList.remove('hidden', 'text-red-500', 'text-green-500');
        formMessage.classList.add(type === 'success' ? 'text-green-500' : 'text-red-500');
    };

    const clearFormMessage = () => {
        if (!formMessage) return;
        formMessage.textContent = '';
        formMessage.classList.add('hidden');
    };

    const evaluatePasswordStrength = (password) => {
        let score = 0;
        if (password.length >= 8) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;

        if (score <= 1) return { label: 'Fraca', classes: 'text-red-500' };
        if (score === 2) return { label: 'Média', classes: 'text-amber-500' };
        return { label: 'Forte', classes: 'text-emerald-500' };
    };

    const updatePasswordStrength = () => {
        if (!passwordStrength || !passwordInput) return;
        const strength = evaluatePasswordStrength(passwordInput.value);
        passwordStrength.textContent = `Força da senha: ${strength.label}`;
        passwordStrength.className = `text-xs mt-1 ${strength.classes}`;
    };

    const toggleVisibility = (input, button) => {
        if (!input || !button) return;
        const visible = input.type === 'text';
        input.type = visible ? 'password' : 'text';
        const icon = button.querySelector('.material-symbols-outlined');
        if (icon) icon.textContent = visible ? 'visibility' : 'visibility_off';
    };

    emailInput?.addEventListener('input', () => clearError(emailInput, emailError));
    passwordInput?.addEventListener('input', () => {
        clearError(passwordInput, passwordError);
        updatePasswordStrength();
        if (confirmInput?.value) {
            if (passwordInput.value !== confirmInput.value) {
                showError(confirmInput, confirmPasswordError, 'As senhas não coincidem.');
            } else {
                clearError(confirmInput, confirmPasswordError);
            }
        }
    });
    confirmInput?.addEventListener('input', () => {
        clearError(confirmInput, confirmPasswordError);
        if (passwordInput?.value !== confirmInput.value) {
            showError(confirmInput, confirmPasswordError, 'As senhas não coincidem.');
        }
    });

    togglePassword?.addEventListener('click', () => toggleVisibility(passwordInput, togglePassword));
    toggleConfirmPassword?.addEventListener('click', () => toggleVisibility(confirmInput, toggleConfirmPassword));

    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        clearFormMessage();
        clearError(emailInput, emailError);
        clearError(passwordInput, passwordError);
        clearError(confirmInput, confirmPasswordError);

        const name = document.getElementById('name').value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmInput.value;

        if (!name) {
            showFormMessage('Informe seu nome completo.');
            return;
        }

        if (!emailRegex.test(email)) {
            showError(emailInput, emailError, 'Insira um e-mail válido. Ex: nome@dominio.com');
            return;
        }

        if (password.length < 8) {
            showError(passwordInput, passwordError, 'A senha deve ter pelo menos 8 caracteres.');
            return;
        }

        if (password !== confirmPassword) {
            showError(confirmInput, confirmPasswordError, 'As senhas não coincidem.');
            return;
        }

        const users = JSON.parse(localStorage.getItem('sportclima_users') || '[]');
        if (users.find(u => u.email === email)) {
            showError(emailInput, emailError, 'Este e-mail já está cadastrado.');
            return;
        }

        users.push({ name, email, password });
        localStorage.setItem('sportclima_users', JSON.stringify(users));

        if (submitBtn) {
            submitBtn.innerHTML = `<span class="material-symbols-outlined align-middle text-[20px]">check_circle</span> Conta criada!`;
            submitBtn.disabled = true;
            submitBtn.classList.remove('bg-primary', 'hover:shadow-primary/40', 'hover:-translate-y-0.5');
            submitBtn.classList.add('bg-green-500', 'cursor-not-allowed');
        }

        showFormMessage('Cadastro realizado com sucesso! Redirecionando para login...', 'success');

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2500);
    });
});