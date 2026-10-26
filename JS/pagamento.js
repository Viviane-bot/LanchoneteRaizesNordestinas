
document.addEventListener("DOMContentLoaded", () => {
    const CHAVE_PEDIDOS = "raizesPedidosDemo";

    const parametros = new URLSearchParams(window.location.search);
    const pedidoId = parametros.get("pedido");

    const resumo = document.querySelector("#resumo-pagamento");
    const formulario = document.querySelector("#form-pagamento");
    const retorno = document.querySelector("#retorno-pagamento");

    function lerPedidos() {
        try {
            const dados = JSON.parse(
                localStorage.getItem(CHAVE_PEDIDOS) || "[]"
            );
            return Array.isArray(dados) ? dados : [];
        } catch {
            return [];
        }
    }

    function formatarValor(valor) {
        return Number(valor).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    const pedidos = lerPedidos();
    const pedido = pedidos.find(item => item.id === pedidoId);

    if (!pedido) {
        resumo.textContent =
            "Pedido não encontrado. Volte para Meus Pedidos.";
        return;
    }

    const titulo = document.createElement("h2");
    titulo.textContent = "Pedido " + pedido.id;

    const valor = document.createElement("p");
    valor.textContent = "Total: " + formatarValor(pedido.total);

    const estado = document.createElement("p");
    estado.textContent =
        "Pagamento atual: " +
        (pedido.pagamento?.status || "Não iniciado");

    resumo.append(titulo, valor, estado);
    formulario.hidden = false;

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const metodo = document.querySelector("#metodo").value;
        const resultado = document.querySelector("#resultado").value;

        if (!metodo || !resultado) return;

        const todos = lerPedidos();
        const indice = todos.findIndex(
            item => item.id === pedidoId
        );

        if (indice === -1) {
            retorno.textContent = "Pedido não encontrado.";
            return;
        }

        // Simula o envio e a resposta de um provedor externo.
        todos[indice].pagamento = {
            metodo: metodo,
            status: resultado,
            data: new Date().toISOString(),
            provedor: "Gateway demonstrativo"
        };

        localStorage.setItem(
            CHAVE_PEDIDOS,
            JSON.stringify(todos)
        );

        const mensagens = {
            Aprovado: "Pagamento aprovado com sucesso!",
            Pendente: "Pagamento pendente de confirmação.",
            Recusado: "Pagamento recusado. Tente novamente."
        };

        retorno.replaceChildren();

        const mensagem = document.createElement("p");
        mensagem.className =
            "resultado-pagamento " + resultado.toLowerCase();
        mensagem.textContent = mensagens[resultado];

        const detalhes = document.createElement("p");
        detalhes.textContent =
            "Forma de pagamento: " + metodo;

        const voltar = document.createElement("a");
        voltar.href = "meus-pedidos.html";
        voltar.className = "button button-primary";
        voltar.textContent = "Ver meus pedidos";

        retorno.append(mensagem, detalhes, voltar);

        estado.textContent = "Pagamento atual: " + resultado;
        formulario.hidden = true;
    });
});
