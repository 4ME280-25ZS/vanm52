// Supabase config
const SUPABASE_URL = 'https://iubsexdrmgpgkbwmgrqi.supabase.co';
const SUPABASE_KEY = 'sb_publishable_HII35U4kVlPJx7MHaflMyw_5kVHG0ly';

let gifts = [];
const animals = ['🐯', '🦁', '🐻', '🦊', '🦝', '🐻‍❄️', '🐼', '🐨', '🦘', '🦌', '🦬', '🐄', '🐂', '🐃', '🐅', '🦒', '🦓', '🦏', '🐘', '🦛', '🦗', '🦍', '🦧', '🐺'];

function getMyAnimal() {
    let animal = localStorage.getItem('myAnimal');
    if (!animal) {
        animal = animals[Math.floor(Math.random() * animals.length)];
        localStorage.setItem('myAnimal', animal);
    }
    return animal;
}

async function loadGifts() {
    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/gifts?select=*&order=id.asc`,
            {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        gifts = await response.json();
        displayGifts();
        
        // Refresh každých 5 sekund
        setTimeout(loadGifts, 5000);
    } catch (error) {
        console.error('Chyba při načítání:', error);
        // Zkus znovu za 3 sekundy
        setTimeout(loadGifts, 3000);
    }
}

function displayGifts() {
    const grid = document.getElementById('giftsGrid');
    const myAnimal = getMyAnimal();
    
    grid.innerHTML = '';
    
    gifts.forEach(gift => {
        const card = document.createElement('div');
        card.className = 'gift-card';
        
        let status = '';
        if (gift.is_bought && gift.bought_by) {
            status = `<span class="gift-status status-taken">❌ Zabrané - ${gift.bought_by}</span>`;
        } else if (!gift.is_bought) {
            status = '<span class="gift-status status-available">✅ Volné</span>';
        } else {
            status = '<span class="gift-status status-taken">❌ Zabrané</span>';
        }
        
        let actionButton = '';
        if (gift.bought_by === myAnimal) {
            actionButton = `<button class="btn-cancel" onclick="cancelPurchase(${gift.id})">Zrušit koupi</button>`;
        } else if (!gift.is_bought) {
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

async function buyGift(giftId) {
    const myAnimal = getMyAnimal();
    
    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/gifts?id=eq.${giftId}`,
            {
                method: 'PATCH',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    is_bought: true,
                    bought_by: myAnimal
                })
            }
        );
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        console.log('Dar koupen!');
        loadGifts();
    } catch (error) {
        console.error('Chyba:', error);
        alert('Chyba při koupi!');
    }
}

async function cancelPurchase(giftId) {
    if (!confirm('Chceš zrušit koupi tohoto daru?')) return;
    
    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/gifts?id=eq.${giftId}`,
            {
                method: 'PATCH',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    is_bought: false,
                    bought_by: null
                })
            }
        );
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        console.log('Koupi zrušena!');
        loadGifts();
    } catch (error) {
        console.error('Chyba:', error);
        alert('Chyba při zrušení!');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('myAnimal').textContent = getMyAnimal();
    loadGifts();
});
