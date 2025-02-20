import { html, render } from 'https://unpkg.com/lit-html'

export async function searchEngine(data) {
    
    const textEl = document.querySelector(`#searchInput`);
    const findBtn = document.querySelector(`#find-btn`);
    const sugEl = document.querySelector(`#suggestions`);
    const intelisense = []; data.forEach(element => {intelisense.push(element.name)});
    console.log(intelisense);
    
    textEl.addEventListener(`input`, (e) => {
        const searchValue = e.target.value.toLowerCase().trim();
        render(html``, sugEl)

        if (searchValue === ``) return;

        const prediction = intelisense.filter(char => {char.toLowerCase().includes(searchValue)});

        const template = html`${prediction.map(char => {
            return html` <li
                        class="suggestion-item"
                        @click=${() => handleSuggestionClick(char)}
                    >
                        ${char}
                    </li>`
        })}`;

        render (template, sugEl)
    })
    function handleSuggestionClick(char) {
        searchInput.value = char;
        render(html``, suggestionsList); 
    }

    document.addEventListener(`click`, (e) => {if (!e.target.closest(`.search-container`)) {clearField()};})
    function clearField(){render(html``, sugEl); console.log(`done`);
    }
}
