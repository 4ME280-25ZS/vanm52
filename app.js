// Supabase nastavení
const SUPABASE_URL = 'https://iubsexdrmgpgkbwmgrqi.supabase.co';
const SUPABASE_KEY = 'sb_publishable_HII35U4kVlPJx7MHaflMyw_5kVHG0ly';

const { createClient } = window.supabase;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Seznam zvířátek
const animals = ['🐯', '🦁', '🐻', '🦊', '🦝', '🐻‍❄️', '🐼', '🐨', '🦘', '🦌', '🦬', '🐄', '🐂', '🐃', '🐅', '🦒', '🦓', '🦏', '🐘', '🦛', '🦗', '🦘', '🐃', '🦍', '🦧'];

// Generování či načtení zvířátka
function getOrCreateAnimal() {
    let animal = localStorage.getItem('userAnimal');
    if (!animal) {
        animal = animals[Math.floor(Math.random() * animals.length)];
        localStorage.setItem('userAnimal', animal);
    }
    return animal;
}

// Získání seznamu mých koupiků z localStorage
function getMyPurchases() {
    const purchases = localStorage.getItem('myPurchases');
    return purchases ? JSON.parse(purchases) : [];
}

// Uložení koupiků do localStorage
function saveMyPurchases(purchases) {
    localStorage.setItem('myPurchases', JSON.stringify(purchases));
}

// Zobrazení zvířátka v headeru
function displayAnimal() {
    const animal = getOrCreateAnimal();
    document.querySelector('.animal-display').textContent = animal;
}

// Načtení darů z Supabase
async function loadGifts() {
    try {
        const { data, error } = await supabase
            .from('gifts')
            .select('*')
            .order('id');
        
        if (error) throw error;
        
        displayGifts(data);
        
        // Real-time subscription
        subscribeToGifts();
    } catch (error) {
        console.error('Chyba při načtení darů:', error);
        document.getElementById('giftsGrid').innerHTML = '<p class="loading">Chyba při načtení darů 😞</p>';
    }
}

// Real-time listener
function subscribeToGifts() {
    const subscription = supabase
        .channel('gifts-changes')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'gifts' },
            (payload) => {
                console.log('Změna v databázi:', payload);
                loadGifts(); // Znovu načti všechny dary
            }
        )
        .subscribe();
}

// Zobrazení darů
function displayGifts(gifts) {
    const grid = document.getElementById('giftsGrid');
    const myPurchases = getMyPurchases();
    
    grid.innerHTML = '';
    
    gifts.forEach(gift => {
        const isMyPurchase = myPurchases.includes(gift.id);
        const isBought = gift.is_bought;
        
        const card = document.createElement('div');
        card.className = 'gift-card';
        
        const status = isBought 
            ? '<span class="gift-status status-taken">❌ Zabrané</span>'
            : '<span class="gift-status status-available">✅ Volné</span>';
        
        let actionButton = '';
        if (isBought && isMyPurchase) {
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

// Koupi daru
async function buyGift(giftId) {
    try {
        // Aktualizuj v Supabase
        const { error } = await supabase
            .from('gifts')
            .update({ is_bought: true })
            .eq('id', giftId);
        
        if (error) throw error;
        
        // Ulož do localStorage
        let myPurchases = getMyPurchases();
        if (!myPurchases.includes(giftId)) {
            myPurchases.push(giftId);
            saveMyPurchases(myPurchases);
        }
        
        console.log('Dar koupen!');
    } catch (error) {
        console.error('Chyba při koupi:', error);
        alert('Chyba při koupi! Zkus to znovu.');
    }
}

// Zrušení koupi
async function cancelPurchase(giftId) {
    if (!confirm('Chceš zrušit koupi tohoto daru?')) return;
    
    try {
        // Aktualizuj v Supabase
        const { error } = await supabase
            .from('gifts')
            .update({ is_bought: false })
            .eq('id', giftId);
        
        if (error) throw error;
        
        // Odeber z localStorage
        let myPurchases = getMyPurchases();
        myPurchases = myPurchases.filter(id => id !== giftId);
        saveMyPurchases(myPurchases);
        
        console.log('Koupi zrušena!');
    } catch (error) {
        console.error('Chyba při zrušení:', error);
        alert('Chyba při zrušení! Zkus to znovu.');
    }
}

// Inicializace
document.addEventListener('DOMContentLoaded', () => {
    displayAnimal();
    loadGifts();
});
