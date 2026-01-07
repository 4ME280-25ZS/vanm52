// Lokální dary
const gifts = [
    { id: 1, title: 'Příslušenství na notebook', price: 250, is_bought: false, bought_by: null },
    { id: 2, title: 'USB hub', price: 350, is_bought: false, bought_by: null },
    { id: 3, title: 'Bezdrátová myš', price: 280, is_bought: false, bought_by: null },
    { id: 4, title: 'Klávesnice mechanická', price: 500, is_bought: false, bought_by: null },
    { id: 5, title: 'Monitor stojánek', price: 400, is_bought: false, bought_by: null },
    { id: 6, title: 'Pouzdro na laptop', price: 320, is_bought: false, bought_by: null },
    { id: 7, title: 'Webkamera HD', price: 380, is_bought: false, bought_by: null },
    { id: 8, title: 'Myš mat na tiskárnu', price: 150, is_bought: false, bought_by: null },
    { id: 9, title: 'Sluchátka on-ear', price: 420, is_bought: false, bought_by: null },
    { id: 10, title: 'Kabel lightning', price: 180, is_bought: false, bought_by: null },
    { id: 11, title: 'Adaptér USB-C', price: 200, is_bought: false, bought_by: null },
    { id: 12, title: 'Počítač stůl deska', price: 800, is_bought: false, bought_by: null },
    { id: 13, title: 'Židle kancelářská', price: 1200, is_bought: false, bought_by: null },
    { id: 14, title: 'Lampička LED', price: 420, is_bought: false, bought_by: null },
    { id: 15, title: 'Desk pad látka', price: 350, is_bought: false, bought_by: null },
    { id: 16, title: 'Hodinky inteligentní', price: 1500, is_bought: false, bought_by: null },
    { id: 17, title: 'Tablet 10"', price: 2500, is_bought: false, bought_by: null },
    { id: 18, title: 'E-reader', price: 2000, is_bought: false, bought_by: null },
    { id: 19, title: 'Fotoaparát kompakt', price: 2800, is_bought: false, bought_by: null },
    { id: 20, title: 'Kamera sport', price: 1800, is_bought: false, bought_by: null },
    { id: 21, title: 'Reproduktor Bluetooth', price: 900, is_bought: false, bought_by: null },
    { id: 22, title: 'Bezdrátové nabíječky', price: 850, is_bought: false, bought_by: null },
    { id: 23, title: 'Powerbank 20000', price: 650, is_bought: false, bought_by: null },
    { id: 24, title: 'Selfie tyč', price: 280, is_bought: false, bought_by: null },
];

// Seznam zvířátek
const animals = ['🐯', '🦁', '🐻', '🦊', '🦝', '🐻‍❄️', '🐼', '🐨', '🦘', '🦌', '🦬', '🐄', '🐂', '🐃', '🐅', '🦒', '🦓', '🦏', '🐘', '🦛', '🦗', '🦍', '🦧', '🐺'];

function getMyPurchases() {
    const purchases = localStorage.getItem('myPurchases');
    return purchases ? JSON.parse(purchases) : [];
}

function saveMyPurchases(purchases) {
    localStorage.setItem('myPurchases', JSON.stringify(purchases));
}

function getMyAnimal() {
    let animal = localStorage.getItem('myAnimal');
    if (!animal) {
        animal = animals[Math.floor(Math.random() * animals.length)];
        localStorage.setItem('myAnimal', animal);
    }
    return animal;
}

function displayGifts() {
    const grid = document.getElementById('giftsGrid');
    const myPurchases = getMyPurchases();
    
    grid.innerHTML = '';
    
    gifts.forEach(gift => {
        const isMyPurchase = myPurchases.includes(gift.id);
        const isBought = gift.is_bought || isMyPurchase;
        
        const card = document.createElement('div');
        card.className = 'gift-card';
        
        let status = '';
        if (isBought && gift.bought_by) {
            status = `<span class="gift-status status-taken">❌ Zabrané - ${gift.bought_by}</span>`;
        } else if (isBought && isMyPurchase && !gift.bought_by) {
            status = `<span class="gift-status status-taken">❌ Zabrané - tvé</span>`;
        } else if (!isBought) {
            status = '<span class="gift-status status-available">✅ Volné</span>';
        } else {
            status = '<span class="gift-status status-taken">❌ Zabrané</span>';
        }
        
        let actionButton = '';
        if (isMyPurchase) {
            actionButton = `<button class="btn-cancel" onclick="cancelPurchase(${gift.id})">Zrušit koupi</button>`;
        } else if (!isBought) {
            actionButton = `<button class="btn-buy" onclick="buyGift(${gift.id})">Koupit</button>`;
        } else {
            actionButton = `<button class="btn-disabled" disabled>Zabrané</button>`;
        }
        
        card.innerHTML = `
            <div class="gift-title">${gift.title}</div>
            <div class="gift-price">${gift.price} Kč</div>
            ${status}
            <div class="gift-actions">
                ${actionButton}
            </div>
        `;
        
        grid.appendChild(card);
    });
}

function buyGift(giftId) {
    const gift = gifts.find(g => g.id === giftId);
    if (gift) {
        gift.is_bought = true;
        gift.bought_by = getMyAnimal();
    }
    
    let myPurchases = getMyPurchases();
    if (!myPurchases.includes(giftId)) {
        myPurchases.push(giftId);
        saveMyPurchases(myPurchases);
    }
    
    displayGifts();
}

function cancelPurchase(giftId) {
    if (!confirm('Chceš zrušit koupi tohoto daru?')) return;
    
    const gift = gifts.find(g => g.id === giftId);
    if (gift) {
        gift.is_bought = false;
        gift.bought_by = null;
    }
    
    let myPurchases = getMyPurchases();
    myPurchases = myPurchases.filter(id => id !== giftId);
    saveMyPurchases(myPurchases);
    
    displayGifts();
}

document.addEventListener('DOMContentLoaded', () => {
    // Zobraz tvoje zvířátko
    document.getElementById('myAnimal').textContent = getMyAnimal();
    
    // Zobraz dary
    displayGifts();
});
