
const CHAVE_CLIENTE = "raizesClienteDemo";
const CHAVE_SESSAO = "raizesSessaoDemo";

// Cadastro demonstrativo
const formCadastro = document.querySelector("#form-cadastro");

if (formCadastro) {
    formCadastro.addEventListener("submit", function(event) {
        event.preventDefault();

        const cliente = {
            nome: document.querySelector("#nome").value.trim(),
            email: document.querySelector("#email").value.trim().toLowerCase(),
            telefone: document.querySelector("#telefone").value.trim()
        };

        localStorage.setItem(
            CHAVE_CLIENTE,
            JSON.stringify(cliente)
        );

        document.querySelector("#mensagem-cadastro").textContent =
            "Cadastro demonstrativo realizado com sucesso!";

        window.location.href = "login.html";
    });
}

// Entrada demonstrativa pelo e-mail cadastrado
const formLogin = document.querySelector("#form-login");

if (formLogin) {
    formLogin.addEventListener("submit", function(event) {
        event.preventDefault();

        const email = document.querySelector("#email-login")
            .value.trim().toLowerCase();

        const cliente = JSON.parse(
            localStorage.getItem(CHAVE_CLIENTE) || "null"
        );

        const mensagem = document.querySelector("#mensagem-login");

        if (cliente && cliente.email === email) {
            sessionStorage.setItem(CHAVE_SESSAO, cliente.email);

            mensagem.textContent =
                `Bem-vindo(a), ${cliente.nome}!`;

            window.location.href = "cardapio.html";
        } else {
            mensagem.textContent =
                "E-mail não encontrado. Faça seu cadastro.";
        }
    });
}
