$(document).ready(function() {
    console.log("document successfully loaded");
    // load game state and update UI
    const gs = loadGameState();
    updateUI(gs);

    // event listener for the cookie button
    $('#fortune-button').on('click', () => {
        clickFortune(gs);
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
});

// Load game state from local storage or initialize if not present
function loadGameState() {
    $('#main-menu').removeClass('active');
    // Check if gameState exists in local storage
    if (localStorage.getItem('gameState') == null) {
        // Initialize default game state
        const defaultState = {
            totalFortunes: 0,
            upgrades: {
                fortunePerClick: 1,
                fortunePerClickPrice: 10,
                fortunePerSecond: 0,
                crackFortune: false
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

function clickFortune(gs) {
    console.log('Fortune button clicked');
    if (gs != null && gs.upgrades != null) {
        gs.totalFortunes += gs.upgrades.fortunePerClick;
    }
    else {
        console.error('Game state or upgrades not initialized properly.');
    }
}

function saveGameState(gs) {
    localStorage.setItem('gameState', JSON.stringify(gs));
    console.log('Game state saved:', gs);
}

function updateUI(gs) {
    const fortuneCount = document.getElementById('fortune-count');
    if (fortuneCount) {
        fortuneCount.textContent = gs.totalFortunes;
    }
    // // Update upgrade UI elements here
    // const upgradeList = document.getElementById('upgrade-list');
    // if (upgradeList) {
    //     upgradeList.innerHTML = ''; // Clear existing upgrades
    //     // Upgrade for fortune per click
    //     if (gs.upgrades.fortunePerClick < 20) {
    //         // Create upgrade item html element
    //         const upgradeItem = document.createElement('a');
    //         upgradeItem.className = 'dropdown-item';
    //         upgradeItem.href = 'javascript:void(0)';
    //         upgradeItem.textContent = `Fortune Per Click Current Level: ${gs.upgrades.fortunePerClick} - Cost: ${gs.upgrades.fortunePerClickPrice}`;
    //         // event listener for upgrade click
    //         upgradeItem.addEventListener('click', () => {
    //             // Use the current price as the cost
    //             const cost = Number(gs.upgrades.fortunePerClickPrice);
    //             if (gs.totalFortunes < cost) {
    //                 console.log('Not enough fortunes to purchase upgrade');
    //                 return;
    //             }
    //             // Deduct cost first
    //             gs.totalFortunes = Number(gs.totalFortunes) - cost;
    //             // Increase per-click and then raise the price for next level
    //             gs.upgrades.fortunePerClick = Number(gs.upgrades.fortunePerClick) + 1;
    //             // New price is previous price multiplied (round to integer)
    //             gs.upgrades.fortunePerClickPrice = Math.floor(cost * 2);
    //             saveGameState(gs);
    //             updateUI(gs);
    //         });
    //         upgradeList.appendChild(upgradeItem);
    //     }
    //     // TODO: Add more upgrades
    //}
    console.log('UI updated');
}