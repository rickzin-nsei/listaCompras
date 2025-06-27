const itemInput = document.getElementById('item-input');
const quantityInput = document.getElementById('item-quantity');
const priceInput = document.getElementById('item-price');
const addItemButton = document.getElementById('add-item');
const shoppingList = document.getElementById('shopping-list');
const removeAllBtn = document.getElementById('remove-all');
const removeBoughtBtn = document.getElementById('remove-bought');
const removeUnboughtBtn = document.getElementById('remove-unbought');

window.addEventListener('DOMContentLoaded', loadItemsFromStorage);

function saveItemsToStorage() {
    const items = [];
    document.querySelectorAll('.item').forEach(item => {
        const name = item.querySelector('.item-name').textContent;
        const quantity = item.querySelector('.item-quantity')?.textContent ?? '';
        const price = item.querySelector('.item-price')?.textContent ?? '';
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

function createItem(name, quantity = '', price = '', isBought = false) {
    const listItem = document.createElement('li');
    listItem.className = 'item';

    const infoWrapper = document.createElement('div');
    infoWrapper.className = 'item-info';

    const itemName = document.createElement('span');
    itemName.className = 'item-name';
    itemName.textContent = name;
    if (isBought) itemName.classList.add('bought');

    const itemDetails = document.createElement('span');
    itemDetails.className = 'item-details';
    itemDetails.innerHTML = `
        <span class="item-quantity">Qtd: ${quantity || 1}</span> |
        <span class="item-price">Preço: ${price || 'R$0,00'}</span>
    `;

    infoWrapper.appendChild(itemName);
    infoWrapper.appendChild(itemDetails);

    const boughtButton = document.createElement('button');
    boughtButton.textContent = 'Comprado';
    boughtButton.className = 'bought-button';
    boughtButton.addEventListener('click', () => {
        itemName.classList.toggle('bought');
        saveItemsToStorage();
    });

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remover';
    removeButton.className = 'remove-item';
    removeButton.addEventListener('click', () => {
        shoppingList.removeChild(listItem);
        saveItemsToStorage();
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
}

addItemButton.addEventListener('click', addItem);
itemInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addItem(); });
quantityInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addItem(); });
priceInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addItem(); });

// Remover todos
removeAllBtn.addEventListener('click', () => {
    shoppingList.innerHTML = '';
    saveItemsToStorage();
});

// Remover comprados
removeBoughtBtn.addEventListener('click', () => {
    document.querySelectorAll('.item').forEach(item => {
        if (item.querySelector('.item-name').classList.contains('bought')) {
            shoppingList.removeChild(item);
        }
    });
    saveItemsToStorage();
});

// Remover não comprados
removeUnboughtBtn.addEventListener('click', () => {
    document.querySelectorAll('.item').forEach(item => {
        if (!item.querySelector('.item-name').classList.contains('bought')) {
            shoppingList.removeChild(item);
        }
    });
    saveItemsToStorage();
});
