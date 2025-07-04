const itemInput = document.getElementById('item-input');
const quantityInput = document.getElementById('item-quantity');
const priceInput = document.getElementById('item-price');
const addItemButton = document.getElementById('add-item');
const shoppingList = document.getElementById('shopping-list');
const removeAllBtn = document.getElementById('remove-all');
const removeBoughtBtn = document.getElementById('remove-bought');
const removeUnboughtBtn = document.getElementById('remove-unbought');

// 1. Ao carregar o conteúdo da página, carrega os itens salvos no localStorage e atualiza o total geral
window.addEventListener('DOMContentLoaded', () => {
    loadItemsFromStorage();
    atualizarTotalGeral();
});

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
    atualizarTotalGeral();
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

// 2. Ao clicar no botão "Adicionar item", adiciona um novo item à lista
addItemButton.addEventListener('click', addItem);
// 3. Ao pressionar Enter no campo de nome do item, adiciona um novo item
itemInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addItem(); });
// 4. Ao pressionar Enter no campo de quantidade, adiciona um novo item
quantityInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addItem(); });
// 5. Ao pressionar Enter no campo de preço, adiciona um novo item
priceInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addItem(); });

// 6. Ao clicar no botão "Remover todos", remove todos os itens da lista
removeAllBtn.addEventListener('click', () => {
    shoppingList.innerHTML = '';
    saveItemsToStorage();
    atualizarTotalGeral();
});

// 7. Ao clicar no botão "Remover comprados", remove apenas os itens marcados como comprados
removeBoughtBtn.addEventListener('click', () => {
    document.querySelectorAll('.item').forEach(item => {
        if (item.querySelector('.item-name').classList.contains('bought')) {
            shoppingList.removeChild(item);
        }
    });
    saveItemsToStorage();
    atualizarTotalGeral();
});

// 8. Ao clicar no botão "Remover não comprados", remove apenas os itens que ainda não foram marcados como comprados
removeUnboughtBtn.addEventListener('click', () => {
    document.querySelectorAll('.item').forEach(item => {
        if (!item.querySelector('.item-name').classList.contains('bought')) {
            shoppingList.removeChild(item);
        }
    });
    saveItemsToStorage();
    atualizarTotalGeral();
});

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
