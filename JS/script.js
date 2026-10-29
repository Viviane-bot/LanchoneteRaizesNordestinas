document.addEventListener('DOMContentLoaded', () => {
  const CART_KEY = 'raizesNordestinasCart';
  // Troque pelo WhatsApp comercial com código do país e DDD, apenas números. Ex.: 5511999999999
  const WHATSAPP_NUMBER = '';
  const readCart = () => { try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch { return []; } };
  const saveCart = cart => { localStorage.setItem(CART_KEY, JSON.stringify(cart)); updateCartBadges(); };
  const money = value => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => { const open = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu'); toggle.textContent = open ? '×' : '☰'; });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Abrir menu'); toggle.textContent = '☰'; }));
  }
  const filterButtons = document.querySelectorAll('[data-filter]');
  const menuCards = document.querySelectorAll('[data-category]');
  filterButtons.forEach(button => button.addEventListener('click', () => { const filter = button.dataset.filter; filterButtons.forEach(item => { const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); }); menuCards.forEach(card => { card.hidden = filter !== 'todos' && card.dataset.category !== filter; }); }));
  document.querySelectorAll('.current-year').forEach(node => node.textContent = new Date().getFullYear());
  function updateCartBadges() { const count = readCart().reduce((sum, item) => sum + item.quantity, 0); document.querySelectorAll('.cart-count').forEach(node => { node.textContent = count; node.setAttribute('aria-label', `${count} itens no carrinho`); }); }
  document.querySelectorAll('.add-to-cart').forEach(button => button.addEventListener('click', () => { const cart = readCart(); const name = button.dataset.name; const price = Number(button.dataset.price); const existing = cart.find(item => item.name === name); if (existing) existing.quantity += 1; else cart.push({ name, price, quantity: 1 }); saveCart(cart); const old = button.textContent; button.textContent = 'Adicionado ✓'; button.setAttribute('aria-live', 'polite'); window.setTimeout(() => { button.textContent = old; }, 1100); }));
  const cartRoot = document.querySelector('#cart-content');
  function renderCart() {
    if (!cartRoot) return;
    const cart = readCart();
    if (!cart.length) { cartRoot.innerHTML = '<div class="empty-cart"><div class="food-icon icon-yellow" style="margin:0 auto 12px">🛒</div><h2>Seu carrinho está vazio</h2><p>Explore o cardápio e adicione os sabores que deseja pedir.</p><a class="button button-primary" href="cardapio.html">Ver cardápio</a></div>'; return; }
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartRoot.innerHTML = `<h2>Itens do pedido (${cart.reduce((sum, item) => sum + item.quantity, 0)})</h2><div class="cart-list">${cart.map((item, index) => `<article class="cart-item"><div><h2>${escapeHTML(item.name)}</h2><p>${money(item.price)} por unidade · <strong>${money(item.price * item.quantity)}</strong></p></div><div class="cart-controls"><button class="qty-btn" type="button" data-action="minus" data-index="${index}" aria-label="Diminuir ${escapeHTML(item.name)}">−</button><strong>${item.quantity}</strong><button class="qty-btn" type="button" data-action="plus" data-index="${index}" aria-label="Aumentar ${escapeHTML(item.name)}">+</button><button class="remove-btn" type="button" data-action="remove" data-index="${index}">Remover</button></div></article>`).join('')}</div><div class="cart-summary"><div class="summary-line"><span>Subtotal</span><strong>${money(subtotal)}</strong></div><div class="summary-line"><span>Entrega</span><span>A combinar</span></div><div class="summary-line summary-total"><span>Total parcial</span><strong>${money(subtotal)}</strong></div><p>O valor da entrega e a forma de pagamento serão confirmados com a lanchonete.</p></div><form class="checkout-form" id="checkout-form"><label>Seu nome<input name="customer" autocomplete="name" required placeholder="Como podemos te chamar?"></label><label>Telefone para contato<input name="phone" autocomplete="tel" required inputmode="tel" placeholder="(DDD) 99999-9999"></label><label class="full-width">Retirada ou entrega<select name="delivery" required><option value="">Selecione uma opção</option><option>Retirada no local</option><option>Entrega</option></select></label><label class="full-width">Endereço (se for entrega)<input name="address" autocomplete="street-address" placeholder="Rua, número, bairro e complemento"></label><label class="full-width">Observações<textarea name="notes" rows="3" placeholder="Ponto de referência, preferências ou observações"></textarea></label><button class="button button-primary full-width" type="submit">Finalizar pedido demonstrativo → 
<label for="cupom">Cupom de desconto</label>
<input
    id="cupom"
    name="cupom"
    type="text"
    placeholder="Digite seu cupom"
    autocomplete="off"
>
<small>Experimente RAIZES10 ou NORDESTE5</small>
</button></form><p class="cart-notice" id="checkout-feedback" role="status"></p>`;
    cartRoot.querySelectorAll('[data-action]').forEach(button => button.addEventListener('click', () => { const next = readCart(); const index = Number(button.dataset.index); if (button.dataset.action === 'plus') next[index].quantity += 1; if (button.dataset.action === 'minus') next[index].quantity -= 1; if (button.dataset.action === 'remove' || next[index].quantity <= 0) next.splice(index, 1); saveCart(next); renderCart(); }));
    cartRoot.querySelector('#checkout-form').addEventListener('submit', event => { event.preventDefault(); const form = new FormData(event.currentTarget); const latest = readCart(); const total = latest.reduce((sum, item) => sum + item.price * item.quantity, 0); const lines = latest.map(item => `• ${item.quantity}x ${item.name} — ${money(item.price * item.quantity)}`).join('\n'); const message = `Olá! Gostaria de fazer um pedido na Raízes Nordestinas.\n\n${lines}\n\nSubtotal: ${money(total)}\nNome: ${form.get('customer')}\nTelefone: ${form.get('phone')}\nOpção: ${form.get('delivery')}\nEndereço: ${form.get('address') || 'Não informado'}\nObservações: ${form.get('notes') || 'Nenhuma'}\n\nPor favor, confirme disponibilidade, entrega e pagamento.`; if (!WHATSAPP_NUMBER) { const feedback = document.querySelector('#checkout-feedback'); feedback.textContent = 'Quase pronto! Para abrir o WhatsApp, configure o número comercial na constante WHATSAPP_NUMBER do arquivo JS/script.js.'; const copyButton = document.createElement('button'); copyButton.type = 'button'; copyButton.className = 'button button-dark'; copyButton.textContent = 'Copiar resumo do pedido'; copyButton.addEventListener('click', async () => { try { await navigator.clipboard.writeText(message); feedback.textContent = 'Resumo copiado. Configure o WhatsApp para concluir a integração.'; } catch { feedback.textContent = message; } }); feedback.after(copyButton); return; } window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer'); });
  }
  function escapeHTML(value) { return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char])); }
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) contactForm.addEventListener('submit', event => { event.preventDefault(); const feedback = document.querySelector('#form-feedback'); if (feedback) feedback.textContent = 'Este formulário está em modo demonstrativo. Conecte-o a um serviço de recebimento antes de publicar.'; });
  updateCartBadges(); renderCart();
});
