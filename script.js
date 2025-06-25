const itemInput = document.getElementById('item-input');
const addItemButton = document.getElementById('add-item');
const shoppingList = document.getElementById('shopping-list');
const removeAllBtn = document.getElementById('remove-all');
const removeBoughtBtn = document.getElementById('remove-bought');
const removeUnboughtBtn = document.getElementById('remove-unbought');

// Carrega a lista do localStorage ao iniciar
window.addEventListener('DOMContentLoaded', loadItemsFromStorage);

// Salva a lista atual no localStorage
function saveItemsToStorage() {
    const items = [];
    document.querySelectorAll('.item').forEach(item => {
        const text = item.querySelector('span').textContent;
        const isBought = item.querySelector('span').classList.contains('bought');
        items.push({ text, bought: isBought });
    });
    localStorage.setItem('shoppingList', JSON.stringify(items));
}

// Carrega itens salvos
function loadItemsFromStorage() {
    const saved = localStorage.getItem('shoppingList');
    if (!saved) return;
    const items = JSON.parse(saved);
    items.forEach(({ text, bought }) => {
        createItem(text, bought);
    });
}

// Cria um novo item na lista
function createItem(text, isBought = false) {
    const listItem = document.createElement('li');
    listItem.className = 'item';

    const itemLabel = document.createElement('span');
    itemLabel.textContent = text;
    if (isBought) itemLabel.classList.add('bought');

    const boughtButton = document.createElement('button');
    boughtButton.textContent = 'Comprado';
    boughtButton.className = 'bought-button';
    boughtButton.addEventListener('click', () => {
        itemLabel.classList.toggle('bought');
        saveItemsToStorage();
    });

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remover';
    removeButton.className = 'remove-item';
    removeButton.addEventListener('click', () => {
        shoppingList.removeChild(listItem);
        saveItemsToStorage();
    });

    listItem.appendChild(itemLabel);
    listItem.appendChild(boughtButton);
    listItem.appendChild(removeButton);
    shoppingList.appendChild(listItem);
}

// Adiciona item novo
function addItem() {
    const itemText = itemInput.value.trim();
    if (!itemText) return;
    createItem(itemText);
    itemInput.value = '';
    itemInput.focus();
    saveItemsToStorage();
}

addItemButton.addEventListener('click', addItem);
itemInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addItem();
    }
});

// 🧹 Botões de ação em massa

// Remover todos os itens
removeAllBtn.addEventListener('click', () => {
    shoppingList.innerHTML = '';
    saveItemsToStorage();
});

// Remover apenas os comprados
removeBoughtBtn.addEventListener('click', () => {
    document.querySelectorAll('.item').forEach(item => {
        const label = item.querySelector('span');
        if (label.classList.contains('bought')) {
            shoppingList.removeChild(item);
        }
    });
    saveItemsToStorage();
});

// Remover apenas os não comprados
removeUnboughtBtn.addEventListener('click', () => {
    document.querySelectorAll('.item').forEach(item => {
        const label = item.querySelector('span');
        if (!label.classList.contains('bought')) {
            shoppingList.removeChild(item);
        }
    });
    saveItemsToStorage();
});
