import { html, render } from 'https://unpkg.com/lit-html'
const data = await(await fetch(`/LDB`)).json();

(async function laodRoasters() {
    const roleMap = { // Guild roles
        0: "Guild Master",
        1: "Officer",
        2: "Veteran",
        3: "Blood Sniffer",
        4: "BGs & Arena",
        5: "BGs",
        6: "Arena",
        7: "Member",
        8: "Gear team",
        9: `Initiate`,
    };
    
    const container = document.querySelector(".roster-container");
    
    const template = (data) => html`${data.map(char => {
        return html`
                    <div class="character-card" id="${char.innerID}">
                        <img src="${char.media?.banner}" alt="No img in blizzard's API">
                        <div class="character-details">
                            <h3>${char.name}</h3>
                            <p>Guild Rank: ${roleMap[char.rank]}</p>
                        </div>
                    </div>`})}`



    render(template(data), container);


})()

const intelisense = [];

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
                        id="${char[1]}"
                        class="suggestion-item"
                        @click=${() => handleSuggestionClick(char)}
                    >
                        ${char[0]}
                    </li>
                `
            )}
        `;

        render(suggestionsTemplate, suggestionsList);
        
        // const liEl = suggestionsList.querySelector(`li`);
        // if (liEl) liEl.focus();
    }
});
let searchID = null;
function handleSuggestionClick(char) {
    searchInput.value = char[0];
    render(html``, suggestionsList); 
    searchID = char[1];
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
        render(html``, suggestionsList); 
    }
});



document.querySelector("#searchBtn").addEventListener(`click`, async (e) => {
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
        erMsg.textContent = `The character is missing, please check your input & try again.`;
        erMsg.style.display = `flex`;
        searchID = null
        return
    }
    
    const srEl = document.getElementById(searchID);
    srEl.scrollIntoView({behavior: "smooth", block: "center"});
    srEl.style.boxShadow = "0 0 10px #1abc9c";
    setTimeout(()=>{srEl.style.boxShadow = ""}, 3000)
})