document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Aqui você adicionaria a lógica de autenticação futuramente
        console.log('Tentativa de login com:', email);

        // Exemplo: Redirecionar de volta para a dashboard após "logar"
        alert('Login realizado com sucesso!');
        window.location.href = 'index.html';
    });
});
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // Simulação de login
    window.location.href = 'index.html';
});