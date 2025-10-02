$(document).ready(function() {
    console.log("document successfully loaded");
    // load game state and update UI
    const gs = loadGameState();
    updateUI(gs);

    // event listener for the cookie button
    $('#fortune-button').on('click', () => {
        console.log('Fortune clicked');
        if (gs != null && gs.upgrades != null) {
            gs.totalFortunes += gs.upgrades.fortunePerClick;
        }
        else {
            console.error('Game state or upgrades not initialized properly.');
        }
        saveGameState(gs);
        updateUI(gs);
    });

    // EL for menu icon
    $('#main-menu-icon').on('click', () => {
        $('#main-menu').toggleClass('active');
        console.log("btn clicked");
    });
    //EL for menu back btn
    $('#main-menu-back').on('click', () => {
        $('#main-menu').toggleClass('active');
    });

    //EL for upgrade purchase
    $('#upg-btn-1').on('click', () => {
        //Use the current price as the cost
        const cost = gs.upgrades.fortunePerClickPrice;
        if (gs.totalFortunes < cost) {
            console.log('Not enough fortunes to purchase upgrade');
            return;
        }
        // Deduct cost first
        gs.totalFortunes = gs.totalFortunes - cost;
        // Increase per-click and then raise the price for next level
        gs.upgrades.fortunePerClick = gs.upgrades.fortunePerClick + 1;
        // New price is previous price multiplied (round to integer)
        gs.upgrades.fortunePerClickPrice = Math.floor(cost * 1.5);
        saveGameState(gs);
        updateUI(gs);
    });
    $('#upg-btn-2').on('click', () => {
        //Use the current price as the cost
        const cost = Number(gs.upgrades.fortunePerSecPrice);
        if (gs.totalFortunes < cost) {
            console.log('Not enough fortunes to purchase upgrade');
            return;
        }
        // Deduct cost first
        gs.totalFortunes -= cost;
        // Increase per-click and then raise the price for next level
        gs.upgrades.fortunePerSec += 1;
        // New price is previous price multiplied (round to integer)
        gs.upgrades.fortunePerSecPrice = cost + 50;
        saveGameState(gs);
        updateUI(gs);
    });
    $('#upg-btn-3').on('click', () => {
        //Use the current price as the cost
        const cost = Number(gs.upgrades.crackFortunePrice);
        if (gs.upgrades.crackFortune === false) {
            if (gs.totalFortunes < cost) {
                console.log('Not enough fortunes to purchase upgrade');
                return;
            }
            // Deduct cost first
            gs.totalFortunes -= cost;
            //owned upgrades are true
            gs.upgrades.crackFortune = true;
        }
        saveGameState(gs);
        updateUI(gs);
    });

    // Second Menu EL
    $('#sec-menu-btn').on('click', () => {
        $('#sec-menu').toggle();
    });
    $('#sec-menu-back').on('click', () => {
        $('#sec-menu').toggle();
    });
    //Reset button EL
    $('#reset-btn').on('click', () => {
        localStorage.removeItem('gameState');
        location.reload(); // reload page to reinit state
    });
    $('#cheat-btn').on('click', () => {
        gs.totalFortunes += 100000000;
        saveGameState(gs);
        updateUI(gs);
    });

    //Time loop for upgrade 2
    setInterval(function() {
        if (gs) {
            gs.totalFortunes += gs.upgrades.fortunePerSec;
            saveGameState(gs);
            updateUI(gs);
        }
    }, 1000);
});

// Load game state from local storage or initialize if not present
function loadGameState() {
    $('#main-menu').removeClass('active');
    $('#sec-menu').hide();
    // Check if gameState exists in local storage
    if (localStorage.getItem('gameState') == null) {
        // Initialize default game state
        const defaultState = {
            totalFortunes: 0,
            upgrades: {
                fortunePerClick: 1,
                fortunePerClickPrice: 10,
                fortunePerSec: 0,
                fortunePerSecPrice: 100,
                crackFortune: false,
                crackFortunePrice: 10000
            }
        };
        // JSON method turns the object back into a string for local storage
        localStorage.setItem('gameState', JSON.stringify(defaultState));
    }
    
    // Load game state from local storage
    const local = localStorage.getItem('gameState');
    if (local) {
        // turns the local string into object so I can use its attributes
        const gs = JSON.parse(local);
        console.log('Loaded game state:', gs);
        return gs;
    }
}

function saveGameState(gs) {
    localStorage.setItem('gameState', JSON.stringify(gs));
    console.log('Game state saved:', gs);
}

function updateUI(gs) {
    //fortune count
    $('#fortune-count').text(gs.totalFortunes);
    //upgrade UI
    $('#upgrade-1 .upgCount').text(gs.upgrades.fortunePerClick);
    $('#upgrade-1 .upgPrice').text(gs.upgrades.fortunePerClickPrice);
    
    $('#upgrade-2 .upgCount').text(gs.upgrades.fortunePerSec);
    $('#upgrade-2 .upgPrice').text(gs.upgrades.fortunePerSecPrice);

    if (gs.upgrades.crackFortune === true) {
        $('#upgrade-3 .upgCount').text("1/1");
        $('#upgrade-3 .upgPrice').text("Sold Out");
    }
    else {
        $('#upgrade-3 .upgCount').text("0/1");
        $('#upgrade-3 .upgPrice').text(gs.upgrades.crackFortunePrice);
    }
    console.log('UI updated');
}