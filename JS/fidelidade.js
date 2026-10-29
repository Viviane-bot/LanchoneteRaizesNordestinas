
document.addEventListener("DOMContentLoaded", () => {
    const elementoPontos =
        document.querySelector("#total-pontos");

    const elementoBeneficio =
        document.querySelector("#proximo-beneficio");

    let pedidos = [];

    try {
        const dados = JSON.parse(
            localStorage.getItem("raizesPedidosDemo") || "[]"
        );

        if (Array.isArray(dados)) {
            pedidos = dados;
        }
    } catch {
        pedidos = [];
    }

    // Somente pedidos entregues e pagos geram pontos.
    const pedidosValidos = pedidos.filter(pedido =>
        pedido.status === "Entregue" &&
        pedido.pagamento?.status === "Aprovado"
    );

    const pontos = pedidosValidos.reduce((total, pedido) => {
        return total + Math.floor(Number(pedido.total) || 0);
    }, 0);

    elementoPontos.textContent = pontos + " pontos";

    const faltam = Math.max(0, 200 - pontos);

    elementoBeneficio.textContent = faltam === 0
        ? "Você alcançou 200 pontos!"
        : `Faltam ${faltam} pontos para atingir 200 pontos.`;
});
