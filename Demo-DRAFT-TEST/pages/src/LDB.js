import { html, render } from 'https://unpkg.com/lit-html'
import { unsafeHTML } from 'https://cdn.skypack.dev/lit-html/directives/unsafe-html.js';
const data = await (
    await fetch(`/LDB`, {
        method: 'GET',
        cache: 'no-store' 
    })
).json();

const tableSection = document.querySelector(`.leaderboard-container`);
const tableEl = document.querySelector(`.leaderboard-table`);

const shuffleBtn = document.querySelector(`#shuffle`)
const twosBtn = document.querySelector("#twos");
const threBtn = document.querySelector("#threes");
const blitzBtn = document.querySelector("#blitz");
const rbgBtn = document.querySelector("#rbg");


twosBtn.addEventListener(`click`, async (e) => {
    tableSection.style.display = `block`;
    document.querySelector(`#bracket-title`).textContent = "-\\\* 2V2 */-";
    let count = 1;

    const template = (data) => html`
                <thead>
                <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Spec</th>
                    <th>2v2 Rating</th>
                    <th>Arena XP</th>
                </tr>
            </thead>
            <tbody id="leaderboard-body">  
                ${data.map(char => {
                    if (!char.achieves[`2s`].name && !char.rating["2v2"]) return
                    return html`
            <tr class="counter" id="${char.innerID}">
                <td><img style="width: 3rem; height: 3rem;" src="${char.media?.avatar}" alt="Char IMG"></td>
                <td><b>${count++}.</b> ${char.name}</td>
                <td><b>${char.spec}</b>(${char.class})</td>
                <td>${char.rating?.["2v2"] || 0}</td>
                <td>${char.achieves[`2s`]?.name || `No XP yet`}</td>
            </tr>`
                })}
            </tbody>
    `
    const rankOrder = {
        "Gladiator": 5,
        "Duelist": 4,
        "Rival": 3,
        "Challenger": 2,
        "0": 1
    };
    
    data.sort((a, b) => {
        const ratingA = b.rating?.["2v2"] || 0;
        const ratingB = a.rating?.["2v2"] || 0;
    
        if (ratingA !== ratingB) {
            return ratingA - ratingB; 
        } else {
            const achieveA = a.achieves?.["2s"]?.name || "Unranked"; 
            const achieveB = b.achieves?.["2s"]?.name || "Unranked";
    
            const rankA = rankOrder[achieveA] || 1; 
            const rankB = rankOrder[achieveB] || 1;
    
            return rankB - rankA; 
        }
    });
    

    render(template(data), tableEl)

})

shuffleBtn.addEventListener(`click`, async (e) => {
    tableSection.style.display = `block`;
    document.querySelector(`#bracket-title`).textContent = "-\\\* Solo Shuffle */-";
    let count = 1;
    const template = (data) => html`
                <thead>
                <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Spec</th>
                    <th>Solo Shuffle Rating</th>
                </tr>
            </thead>
            <tbody id="leaderboard-body">  
                ${data.map(char => {
                    if (!char.rating["solo"]) return
                    return html`
            <tr id="${char.innerID}">
                <td><img style="width: 3rem; height: 3rem;" src="${char.media?.avatar}" alt="Char IMG"></td>
                <td><b>${count++}.</b> ${char.name}</td>
                <td><b>${char.spec}</b>(${char.class})</td>
                <td><b>${char.rating?.["solo"] || 0}</b></td>
            </tr>`
                })}
            </tbody>
    `

    data.sort((a, b) => {
        const ratingA = b.rating?.["solo"] || 0;
        const ratingB = a.rating?.["solo"] || 0;
    
        if (ratingA !== ratingB) {
            return ratingA - ratingB; 
        }
    });
    
    render(template(data), tableEl)
});

threBtn.addEventListener(`click`, async (e) => {
    tableSection.style.display = `block`;
    document.querySelector(`#bracket-title`).textContent = "-\\\* 3V3 */-";
    let count = 1;
    let achev;

    const template = (data) => html`
                <thead>
                <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Spec</th>
                    <th>3v3 Rating</th>
                    <th>3's XP</th>
                </tr>
            </thead>
            <tbody id="leaderboard-body">  
                ${data.map(char => {
                    if (!char.achieves[`3s`].name && !char.rating["3v3"]) return
                    if (char.achieves[`3s`].name) {
                        achev = (char.achieves[`3s`].name).split(/^(Three's Company):\s*(\d+)$/);
                        achev.pop();
                        achev.shift();
                        achev = unsafeHTML(`${achev[0]}: <b>${achev[1]}</b>`)
                    } else {
                        achev = `No XP yet`;
                    }
                    
                    return html`
            <tr id="${char.innerID}">
                <td><img style="width: 3rem; height: 3rem;" src="${char.media?.avatar}" alt="Char IMG"></td>
                <td><b>${count++}.</b> ${char.name}</td>
                <td><b>${char.spec}</b>(${char.class})</td>
                <td>${char.rating?.["3v3"] || 0}</td>
                <td>${achev}</td>
            </tr>`
                })}
            </tbody>
    `
    const rankOrder = {
        "Three's Company: 2700": 7,
        "Three's Company: 2400": 6,
        "Three's Company: 2200": 5,
        "Three's Company: 2000": 4,
        "Three's Company: 1750": 3,
        "Three's Company: 1550": 2,
        "0": 1
    };
    
    data.sort((a, b) => {
        const ratingA = b.rating?.["3v3"] || 0;
        const ratingB = a.rating?.["3v3"] || 0;
    
        if (ratingA !== ratingB) {
            return ratingA - ratingB; 
        } else {
            const achieveA = a.achieves?.["3s"]?.name || "Unranked"; 
            const achieveB = b.achieves?.["3s"]?.name || "Unranked";
    
            const rankA = rankOrder[achieveA] || 1; 
            const rankB = rankOrder[achieveB] || 1;
    
            return rankB - rankA; 
        }
    });
    

    render(template(data), tableEl)

})


blitzBtn.addEventListener(`click`, async (e) => {
    tableSection.style.display = `block`;
    document.querySelector(`#bracket-title`).textContent = "-\\\* Blitz BG */-";
    let count = 1;

    const template = (data) => html`
        <thead>
            <tr>
                <th></th>
                <th>Name</th>
                <th>Spec</th>
                <th>Blitz Rating</th>
                <th>BG XP</th>
            </tr>
        </thead>
        <tbody id="leaderboard-body">
            ${data.map((char) => {
                let acheiv = undefined;
                if (char.achieves[`BG`]) {
                    let trig = undefined;
                    
                    for (const { name : name, description: desc } of char.achieves[`BG`]) {
                        if (name.includes(`Hero of the Alliance`) || name.includes(`Hero of the Horde`)) {
                            trig = true;
                            acheiv = unsafeHTML(`<b>${name}</b>`)
                        }
                    }

                    for (const { name, description: desc } of char.achieves[`BG`]) {
                        if (trig) break
                        if (desc.includes(`Earn a rating of`)) {
                            acheiv = unsafeHTML(
                                `${name}<br><b>${desc
                                    .replace(`Earn a rating of`, ``)
                                    .replace(` in either Rated Battlegrounds or Rated Battleground Blitz.`, ``)}</b>`
                            );
                            break;
                        }
                    }
                }
                if (!acheiv && !char.rating["solo_bg"]) return;
    
                return html`
                    <tr id="${char.innerID}">
                        <td>
                            <img style="width: 3rem; height: 3rem;" src="${char.media?.avatar}" alt="Char IMG">
                        </td>
                        <td><b>${count++}.</b> ${char.name}</td>
                        <td><b>${char.spec}</b> (${char.class})</td>
                        <td>${char.rating?.["solo_bg"] || 0}</td>
                        <td>${acheiv ? acheiv : `No XP yet`}</td>
                    </tr>
                `;
            })}
        </tbody>
    `;
    

    data.sort((a, b) => {
        // 1. Primary Criteria: solo_bg rating
        const ratingA = b.rating?.["solo_bg"] || 0;
        const ratingB = a.rating?.["solo_bg"] || 0;
    
        if (ratingA !== ratingB) {
            return ratingA - ratingB; // Higher solo_bg rating comes first
        }
    
        // 2. Secondary Criteria: Achievements
        const getPriority = (char) => {
            // Check for Hero of the Alliance/Horde
            const heroAchieve = char.achieves?.["BG"]?.find(({ name }) =>
                ["Hero of the Alliance", "Hero of the Horde"].includes(name)
            );
    
            if (heroAchieve) return Infinity; // Hero achievements have the highest priority
    
            // Check for "Earn a rating of X in Rated BG/Blitz"
            const ratingAchieve = char.achieves?.["BG"]?.find(({ description }) =>
                description.includes("Earn a rating of")
            );
    
            if (ratingAchieve) {
                const ratingMatch = ratingAchieve.description.match(/Earn a rating of (\d+)/);
                return ratingMatch ? parseInt(ratingMatch[1], 10) : 0; // Extract and return the numeric rating
            }
    
            return 0; // Default priority if no matching achievements
        };
    
        const priorityA = getPriority(a);
        const priorityB = getPriority(b);
    
        if (priorityA !== priorityB) {
            return priorityB - priorityA; // Higher priority (rating or Hero) comes first
        }
    
        return 0; // If everything is equal, maintain original order
    });
    
    

    render(template(data), tableEl)
})


blitzBtn.click()

rbgBtn.addEventListener(`click`, async (e) => {
    tableSection.style.display = `block`;
    let count = 1;
    document.querySelector(`#bracket-title`).textContent = "-\\\* Rated BG */-";


    const template = (data) => html`
        <thead>
            <tr>
                <th></th>
                <th>Name</th>
                <th>Spec</th>
                <th>Rated BG Rating</th>
                <th>BG XP</th>
            </tr>
        </thead>
        <tbody id="leaderboard-body">
            ${data.map((char) => {
                let acheiv = undefined;
                if (char.achieves[`BG`]) {
                    let trig = undefined;
                    
                    for (const { name : name, description: desc } of char.achieves[`BG`]) {
                        if (name.includes(`Hero of the Alliance`) || name.includes(`Hero of the Horde`)) {
                            trig = true;
                            acheiv = unsafeHTML(`<b>${name}</b>`)
                        }
                    }

                    for (const { name, description: desc } of char.achieves[`BG`]) {
                        if (trig) break
                        if (desc.includes(`Earn a rating of`)) {
                            acheiv = unsafeHTML(
                                `${name}<br><b>${desc
                                    .replace(`Earn a rating of`, ``)
                                    .replace(` in either Rated Battlegrounds or Rated Battleground Blitz.`, ``)}</b>`
                            );
                            break;
                        }
                    }
                }
                if (!acheiv && !char.rating["rbg"]) return;
    
                return html`
                    <tr id="${char.innerID}">
                        <td>
                            <img style="width: 3rem; height: 3rem;" src="${char.media?.avatar}" alt="Char IMG">
                        </td>
                        <td><b>${count++}.</b> ${char.name}</td>
                        <td><b>${char.spec}</b> (${char.class})</td>
                        <td>${char.rating?.["rbg"] || 0}</td>
                        <td>${acheiv ? acheiv : `No XP yet`}</td>
                    </tr>
                `;
            })}
        </tbody>
    `;
    

    data.sort((a, b) => {
        // 1. Primary Criteria: solo_bg rating
        const ratingA = b.rating?.["rbg"] || 0;
        const ratingB = a.rating?.["rbg"] || 0;
    
        if (ratingA !== ratingB) {
            return ratingA - ratingB; // Higher solo_bg rating comes first
        }
    
        // 2. Secondary Criteria: Achievements
        const getPriority = (char) => {
            // Check for Hero of the Alliance/Horde
            const heroAchieve = char.achieves?.["BG"]?.find(({ name }) =>
                ["Hero of the Alliance", "Hero of the Horde"].includes(name)
            );
    
            if (heroAchieve) return Infinity; // Hero achievements have the highest priority
    
            // Check for "Earn a rating of X in Rated BG/Blitz"
            const ratingAchieve = char.achieves?.["BG"]?.find(({ description }) =>
                description.includes("Earn a rating of")
            );
    
            if (ratingAchieve) {
                const ratingMatch = ratingAchieve.description.match(/Earn a rating of (\d+)/);
                return ratingMatch ? parseInt(ratingMatch[1], 10) : 0; // Extract and return the numeric rating
            }
    
            return 0; // Default priority if no matching achievements
        };
    
        const priorityA = getPriority(a);
        const priorityB = getPriority(b);
    
        if (priorityA !== priorityB) {
            return priorityB - priorityA; // Higher priority (rating or Hero) comes first
        }
    
        return 0; // If everything is equal, maintain original order
    });
    
    

    render(template(data), tableEl)
})

const intelisense = [];
let focusIndex = -1;
for (const char of data) {
    intelisense.push([char.name, char.innerID])
}

const searchInput = document.getElementById('searchInput');
const suggestionsList = document.getElementById('suggestions');

searchInput.addEventListener('input', (e) => {
    const inputValue = e.target.value.toLowerCase().trim();
    let tab = 0
    render(html``, suggestionsList);

    if (inputValue !== "") {
        const filteredCharacters = intelisense.filter((char) =>
            char[0].toLowerCase().includes(inputValue)
        );

        const suggestionsTemplate = html`
            ${filteredCharacters.map(
                (char) => html`
                    <li
                        tabindex="${tab++}"
                        class="suggestion-item"
                        @click=${() => handleSuggestionClick(char)}
                    >
                        ${char[0]}
                    </li>
                `
            )}
        `;

        render(suggestionsTemplate, suggestionsList);
    }
});
const searchBtn = document.querySelector("#searchBtn");
let searchID = null;
function handleSuggestionClick(char) {
    searchInput.value = char[0];
    render(html``, suggestionsList); 
    searchID = char[1];
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
        render(html``, suggestionsList); 
        focusIndex = -1;
    }
});

searchBtn.addEventListener(`click`, async (e) => {
    e.preventDefault();
    const erMsg = document.querySelector(`.error-msg`);
    erMsg.style.display = `none`;
    const search = document.querySelector("#searchInput");
    const searchVal = search.value;
    if (searchVal === ``) {
        erMsg.textContent = `Please fill the box`;
        erMsg.style.display = `flex`;
        searchID = null;
        return
    }
    search.value= ``;

    if (!searchID) {
        erMsg.textContent = `Please select a character from the dropdown`;
        erMsg.style.display = `flex`;
        searchID = null
        return
    }
    
    const srEl = document.getElementById(searchID);
    if (srEl) {
        const originalStyles = {
            backgroundColor: srEl.style.backgroundColor,
            color: srEl.style.color,
            transition: srEl.style.transition,
        };
        
        // Apply new styles
        srEl.scrollIntoView({ behavior: "smooth", block: "center" });
        srEl.style.backgroundColor = '#1abc9c';
        srEl.style.color = '#1c1c2e';
        srEl.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        
        // Revert styles after 3 seconds
        setTimeout(() => {
            srEl.style.backgroundColor = originalStyles.backgroundColor || '';
            srEl.style.color = originalStyles.color || '';
            srEl.style.transition = originalStyles.transition || '';
        }, 3000);
    } else {
        erMsg.style.display = `flex`;
        erMsg.textContent = `This member have no records for this leaderboard`;
    }
})


function handleKeyPress(e) {
    const trigEl = document.querySelectorAll("#suggestions > li");

    if (!trigEl) return;
    let element
    const listLength = trigEl.length - 1;
    
    switch (e.key) {
        case 'ArrowUp':
            e.preventDefault();
            if (focusIndex != 0) focusIndex--;
            element = suggestionsList.querySelector(`[tabindex="${focusIndex}"]`);
            element.focus();
            searchInput.value = (element.textContent).trim();
            console.log('Up arrow key pressed');
            break;
        case 'ArrowDown':
            e.preventDefault();
            if (focusIndex >= listLength) break;
            // if (focusIndex == 0) {
            //     element = suggestionsList.querySelector(`[tabindex="${focusIndex}"]`);
            //     element.focus();
            //     focusIndex++;
            //     searchInput.value = (element.textContent).trim();
            //     break;                
            // }
            focusIndex++;
            element = suggestionsList.querySelector(`[tabindex="${focusIndex}"]`);
            searchInput.value = (element.textContent).trim();
            element.focus();
            console.log('Down arrow key pressed');
            break;
        case 'Enter':
            e.preventDefault();
            element = suggestionsList.querySelector(`[tabindex="${focusIndex}"]`);
            if (!element) {
                focusIndex--;
                element = suggestionsList.querySelector(`[tabindex="${focusIndex}"]`);
            }
            element.click();
            setTimeout(() => {searchBtn.click()}, 5)
            focusIndex = 0
            console.log('Enter key pressed');
            break;
        default : break;
    }
}

document.addEventListener('keydown', handleKeyPress);
