
document.addEventListener("DOMContentLoaded", () => {
    const CHAVE_CARRINHO = "raizesNordestinasCart";
    const CHAVE_PEDIDOS = "raizesPedidosDemo";

    const ler = (chave) => {
        try {
            return JSON.parse(localStorage.getItem(chave) || "[]");
        } catch {
            return [];
        }
    };

    const dinheiro = (valor) =>
        Number(valor).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

    // Captura o envio do formulário existente no carrinho.
    const carrinho = document.querySelector("#cart-content");

    if (carrinho) {
        carrinho.addEventListener("submit", (evento) => {
            if (evento.target.id !== "checkout-form") return;

            evento.preventDefault();
            evento.stopImmediatePropagation();

            const formulario = evento.target;
            if (!formulario.reportValidity()) return;

            const dados = new FormData(formulario);
            const itens = ler(CHAVE_CARRINHO);

            if (!itens.length) {
                alert("Adicione produtos ao carrinho.");
                return;
            }

            const entrega = dados.get("delivery");
            const endereco = String(dados.get("address") || "").trim();

            if (entrega === "Entrega" && !endereco) {
                alert("Informe o endereço para entrega.");
                return;
            }

            const total = itens.reduce(
                (soma, item) =>
                    soma + Number(item.price) * Number(item.quantity),
                0
            );

            const pedido = {
                id: "RN-" + Date.now(),
                cliente: String(dados.get("customer")).trim(),
                telefone: String(dados.get("phone")).trim(),
                entrega,
                endereco,
                observacoes: String(dados.get("notes") || ""),
                itens: itens.map(item => ({ ...item })),
                total,
                status: "Recebido",
                data: new Date().toISOString()
            };

            const pedidos = ler(CHAVE_PEDIDOS);
            pedidos.push(pedido);

            localStorage.setItem(
                CHAVE_PEDIDOS,
                JSON.stringify(pedidos)
            );

            localStorage.removeItem(CHAVE_CARRINHO);

            window.location.href = "meus-pedidos.html";
        }, true);
    }

    // Exibe o histórico na página de pedidos.
    const lista = document.querySelector("#lista-pedidos");

    if (lista) {
        const pedidos = ler(CHAVE_PEDIDOS).reverse();

        if (!pedidos.length) {
            lista.textContent = "Você ainda não possui pedidos.";
            return;
        }

        pedidos.forEach((pedido) => {
            const artigo = document.createElement("article");
            artigo.className = "pedido-card";

            const titulo = document.createElement("h2");
            titulo.textContent = "Pedido " + pedido.id;

            const data = document.createElement("p");
            data.textContent = new Date(
                pedido.data
            ).toLocaleString("pt-BR");

            const produtos = document.createElement("p");
            produtos.textContent = pedido.itens
                .map(item => `${item.quantity}x ${item.name}`)
                .join(", ");

            const total = document.createElement("p");
            total.textContent = "Total: " + dinheiro(pedido.total);

            const status = document.createElement("p");
            status.textContent = "Status: " + pedido.status;

            const botao = document.createElement("button");
            botao.className = "button button-primary";
            botao.type = "button";
            botao.textContent = "Avançar status (simulação)";

            const etapas = [
                "Recebido",
                "Em preparo",
                "Pronto",
                "Entregue"
            ];

            if (pedido.status === "Entregue") {
                botao.disabled = true;
            }

            botao.addEventListener("click", () => {
                const todos = ler(CHAVE_PEDIDOS);
                const encontrado = todos.find(p => p.id === pedido.id);

                if (!encontrado) return;

                const indice = etapas.indexOf(encontrado.status);

                if (indice < etapas.length - 1) {
                    encontrado.status = etapas[indice + 1];
                    localStorage.setItem(
                        CHAVE_PEDIDOS,
                        JSON.stringify(todos)
                    );
                    window.location.reload();
                }
            });

            const pagamento = document.createElement("p");
            pagamento.textContent =
                "Pagamento: " +
                (pedido.pagamento?.status || "Não iniciado");

            const linkPagamento = document.createElement("a");
            linkPagamento.className = "button button-primary";
            linkPagamento.href =
                "pagamento.html?pedido=" + encodeURIComponent(pedido.id);

            linkPagamento.textContent =
                pedido.pagamento?.status === "Aprovado"
                    ? "Consultar pagamento"
                    : "Realizar pagamento";

            artigo.append(
                titulo,
                data,
                produtos,
                total,
                status,
                pagamento,
                botao,
                linkPagamento
            );
            
            
            lista.appendChild(artigo);
        });
    }
});
