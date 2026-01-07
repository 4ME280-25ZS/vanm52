// Lokální dary
const gifts = [
    { id: 1, title: 'Příslušenství na notebook', price: 250 },
    { id: 2, title: 'USB hub', price: 350 },
    { id: 3, title: 'Bezdrátová myš', price: 280 },
    { id: 4, title: 'Klávesnice mechanická', price: 500 },
    { id: 5, title: 'Monitor stojánek', price: 400 },
    { id: 6, title: 'Pouzdro na laptop', price: 320 },
    { id: 7, title: 'Webkamera HD', price: 380 },
    { id: 8, title: 'Myš mat na tiskárnu', price: 150 },
    { id: 9, title: 'Sluchátka on-ear', price: 420 },
    { id: 10, title: 'Kabel lightning', price: 180 },
    { id: 11, title: 'Adaptér USB-C', price: 200 },
    { id: 12, title: 'Počítač stůl deska', price: 800 },
    { id: 13, title: 'Židle kancelářská', price: 1200 },
    { id: 14, title: 'Lampička LED', price: 420 },
    { id: 15, title: 'Desk pad látka', price: 350 },
    { id: 16, title: 'Hodinky inteligentní', price: 1500 },
    { id: 17, title: 'Tablet 10"', price: 2500 },
    { id: 18, title: 'E-reader', price: 2000 },
    { id: 19, title: 'Fotoaparát kompakt', price: 2800 },
    { id: 20, title: 'Kamera sport', price: 1800 },
    { id: 21, title: 'Reproduktor Bluetooth', price: 900 },
    { id: 22, title: 'Bezdrátové nabíječky', price: 850 },
    { id: 23, title: 'Powerbank 20000', price: 650 },
    { id: 24, title: 'Selfie tyč', price: 280 },
];

const animals = ['🐯', '🦁', '🐻', '🦊', '🦝', '🐻‍❄️', '🐼', '🐨', '🦘', '🦌', '🦬', '🐄', '🐂', '🐃', '🐅', '🦒', '🦓', '🦏', '🐘', '🦛', '🦗', '🦍', '🦧', '🐺'];

function getMyAnimal() {
    let animal = localStorage.getItem('myAnimal');
    if (!animal) {
        animal = animals[Math.floor(Math.random() * animals.length)];
        localStorage.setItem('myAnimal', animal);
    }
    return animal;
}

function getMyPurchases() {
    const purchases = localStorage.getItem('myPurchases');
    return purchases ? JSON.parse(purchases) : [];
}

function saveMyPurchases(purchases) {
    localStorage.setItem('myPurchases', JSON.stringify(purchases));
}

function displayGifts() {
function displayGifts() {
    const grid = document.getElementById('giftsGrid');
    const myPurchases = getMyPurchases();
    
    grid.innerHTML = '';
    
    gifts.forEach(gift => {
        const isMyPurchase = myPurchases.includes(gift.id);
        
        const card = document.createElement('div');
        card.className = 'gift-card';
        
        let status = '';
        if (isMyPurchase) {
            status = '<span class="gift-status status-taken">❌ Zabrané - tvé</span>';
        } else {
            status = '<span class="gift-status status-available">✅ Volné</span>';
        }
        
        let actionButton = '';
        if (isMyPurchase) {
            actionButton = `<button class="btn-cancel" onclick="cancelPurchase(${gift.id})">Zrušit koupi</button>`;
        } else {
            actionButton = `<button class="btn-buy" onclick="buyGift(${gift.id})">Koupit</button>`;
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
    let myPurchases = getMyPurchases();
    if (!myPurchases.includes(giftId)) {
        myPurchases.push(giftId);
        saveMyPurchases(myPurchases);
    }
    
    displayGifts();
}

function cancelPurchase(giftId) {
    if (!confirm('Chceš zrušit koupi tohoto daru?')) return;
    
    let myPurchases = getMyPurchases();
    myPurchases = myPurchases.filter(id => id !== giftId);
    saveMyPurchases(myPurchases);
    
    displayGifts();
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('myAnimal').textContent = getMyAnimal();
    displayGifts();
});
