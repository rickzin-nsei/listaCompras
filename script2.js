
const itemInput = document.getElementById('item-input');
const quantityInput = document.getElementById('item-quantity');
const priceInput = document.getElementById('item-price');
const addItemButton = document.getElementById('add-item');
const shoppingList = document.getElementById('shopping-list');
const removeAllBtn = document.getElementById('remove-all');
const removeBoughtBtn = document.getElementById('remove-bought');
const removeUnboughtBtn = document.getElementById('remove-unbought');
const clickCounter = document.getElementById('click-counter');
const colormodeBtn = document.getElementById('colormode');
const redmodeBtn = document.getElementById('redmode');
const h1 = document.getElementById("h1");

let clickCount = parseInt(localStorage.getItem("clickCount")) || 0;

// 1. Carrega conteúdo salvo no localStorage
window.addEventListener('DOMContentLoaded', () => {
    loadItemsFromStorage();
    atualizarTotalGeral();

    // Aplica visuais salvos
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    if (localStorage.getItem('redMode') === 'true') {
        document.body.classList.add('redmode');
        h1.style.color = "rgb(255, 255, 255)";
    }

    // Aplica contador
    atualizarContador();
});

// Atualiza contador na tela e localStorage
function atualizarContador() {
    clickCounter.textContent = `Clique no botão "Adicionar": ${clickCount} ${clickCount === 1 ? 'vez' : 'vezes'}`;
    localStorage.setItem("clickCount", clickCount.toString());
}

// Salva itens no localStorage
function saveItemsToStorage() {
    const items = [];
    document.querySelectorAll('.item').forEach(item => {
        const name = item.querySelector('.item-name').textContent;
        const quantity = item.querySelector('.item-quantity')?.textContent.replace(/\D/g, '') || '1';
        const price = item.querySelector('.item-price')?.textContent.replace(/[^\d,]/g, '') || '0,00';
        const isBought = item.querySelector('.item-name').classList.contains('bought');
        items.push({ name, quantity, price, bought: isBought });
    });
    localStorage.setItem('shoppingList', JSON.stringify(items));
}

function loadItemsFromStorage() {
    const saved = localStorage.getItem('shoppingList');
    if (!saved) return;
    const items = JSON.parse(saved);
    items.forEach(({ name, quantity, price, bought }) => {
        createItem(name, quantity, price, bought);
    });
}

function createItem(name, quantity = '1', price = '0,00', isBought = false) {
    const listItem = document.createElement('li');
    listItem.className = 'item';

    const infoWrapper = document.createElement('div');
    infoWrapper.className = 'item-info';

    const itemName = document.createElement('span');
    itemName.className = 'item-name';
    itemName.textContent = name;
    if (isBought) itemName.classList.add('bought');

    const qtd = parseInt(quantity) || 1;
    const precoNumerico = parseFloat(price.replace(',', '.')) || 0;
    const totalItem = qtd * precoNumerico;

    const itemDetails = document.createElement('span');
    itemDetails.className = 'item-details';
    itemDetails.innerHTML = `
        <span class="item-quantity">Qtd: ${qtd}</span> |
        <span class="item-price">Preço: R$${precoNumerico.toFixed(2).replace('.', ',')}</span> |
        <span class="item-total">Total: R$${totalItem.toFixed(2).replace('.', ',')}</span>
    `;

    infoWrapper.appendChild(itemName);
    infoWrapper.appendChild(itemDetails);

    const boughtButton = document.createElement('button');
    boughtButton.textContent = 'Comprado';
    boughtButton.className = 'bought-button';
    boughtButton.addEventListener('click', () => {
        itemName.classList.toggle('bought');
        saveItemsToStorage();
        atualizarTotalGeral();
    });

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remover';
    removeButton.className = 'remove-item';
    removeButton.addEventListener('click', () => {
        shoppingList.removeChild(listItem);
        saveItemsToStorage();
        atualizarTotalGeral();
    });

    listItem.appendChild(infoWrapper);
    listItem.appendChild(boughtButton);
    listItem.appendChild(removeButton);
    shoppingList.appendChild(listItem);
}

function addItem() {
    const name = itemInput.value.trim();
    const quantity = quantityInput.value.trim();
    const price = priceInput.value.trim();

    if (!name) return;

    createItem(name, quantity, price);
    itemInput.value = '';
    quantityInput.value = '';
    priceInput.value = '';
    itemInput.focus();
    saveItemsToStorage();
    atualizarTotalGeral();
}

// Eventos de adicionar item
addItemButton.addEventListener('click', () => {
    addItem();
    clickCount++;
    atualizarContador();
});
itemInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addItemButton.click(); });
quantityInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addItemButton.click(); });
priceInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addItemButton.click(); });

// Botões de remoção
removeAllBtn.addEventListener('click', () => {
    shoppingList.innerHTML = '';
    saveItemsToStorage();
    atualizarTotalGeral();
});
removeBoughtBtn.addEventListener('click', () => {
    document.querySelectorAll('.item').forEach(item => {
        if (item.querySelector('.item-name').classList.contains('bought')) {
            shoppingList.removeChild(item);
        }
    });
    saveItemsToStorage();
    atualizarTotalGeral();
});
removeUnboughtBtn.addEventListener('click', () => {
    document.querySelectorAll('.item').forEach(item => {
        if (!item.querySelector('.item-name').classList.contains('bought')) {
            shoppingList.removeChild(item);
        }
    });
    saveItemsToStorage();
    atualizarTotalGeral();
});

// Total geral
function atualizarTotalGeral() {
    let total = 0;
    document.querySelectorAll('.item').forEach(item => {
        const qtdText = item.querySelector('.item-quantity')?.textContent || 'Qtd: 1';
        const precoText = item.querySelector('.item-price')?.textContent || 'Preço: R$0,00';
        const quantidade = parseInt(qtdText.replace(/\D/g, '')) || 1;
        const preco = parseFloat(precoText.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
        total += quantidade * preco;
    });

    const totalGeralElement = document.getElementById('total-geral');
    if (totalGeralElement) {
        totalGeralElement.textContent = `Total Geral: R$${total.toFixed(2).replace('.', ',')}`;
    }
}

// Alterna modo claro/escuro
colormodeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

// Alterna modo vermelho
redmodeBtn.addEventListener('click', () => {
    document.body.classList.toggle('redmode');
    h1.style.color = document.body.classList.contains('redmode') ? "rgb(255, 255, 255)" : "";
    localStorage.setItem('redMode', document.body.classList.contains('redmode'));
});
