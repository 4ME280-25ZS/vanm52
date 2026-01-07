// Supabase config
const SUPABASE_URL = 'https://iubsexdrmgpgkbwmgrqi.supabase.co';
const SUPABASE_KEY = 'sb_publishable_HII35U4kVlPJx7MHaflMyw_5kVHG0ly';

const { createClient } = window.supabase;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Local gifts array (pro fallback)
let gifts = [];

// Seznam zvířátek
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
        const { data, error } = await supabase
            .from('gifts')
            .select('*')
            .order('id');
        
        if (error) throw error;
        
        gifts = data || [];
        displayGifts();
        subscribeToChanges();
    } catch (error) {
        console.error('Chyba při načítání:', error);
        alert('Chyba při připojení k databázi');
    }
}

function subscribeToChanges() {
    supabase
        .channel('gifts-changes')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'gifts' },
            (payload) => {
                console.log('Změna v databázi:', payload);
                loadGifts();
            }
        )
        .subscribe();
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
        } else if (gift.is_bought && gift.bought_by === myAnimal) {
            status = `<span class="gift-status status-taken">❌ Zabrané - tvé (${myAnimal})</span>`;
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
        const { error } = await supabase
            .from('gifts')
            .update({ is_bought: true, bought_by: myAnimal })
            .eq('id', giftId);
        
        if (error) throw error;
        
        console.log('Dar koupen!');
    } catch (error) {
        console.error('Chyba:', error);
        alert('Chyba při koupi!');
    }
}

async function cancelPurchase(giftId) {
    if (!confirm('Chceš zrušit koupi tohoto daru?')) return;
    
    try {
        const { error } = await supabase
            .from('gifts')
            .update({ is_bought: false, bought_by: null })
            .eq('id', giftId);
        
        if (error) throw error;
        
        console.log('Koupi zrušena!');
    } catch (error) {
        console.error('Chyba:', error);
        alert('Chyba při zrušení!');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('myAnimal').textContent = getMyAnimal();
    loadGifts();
});
