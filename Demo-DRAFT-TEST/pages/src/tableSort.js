function sortTable(columnIndex) {
    const tbody = document.querySelector("#leaderboard-table tbody");
    const rows = Array.from(tbody.querySelectorAll("tr")); // Convert NodeList to an array

    // Sort rows based on cell content
    rows.sort((rowA, rowB) => {
        const cellA = rowA.children[columnIndex].textContent.trim();
        const cellB = rowB.children[columnIndex].textContent.trim();

        // Check for numerical or alphabetical sorting
        return isNaN(cellA) || isNaN(cellB)
            ? cellA.localeCompare(cellB) // Alphabetical sort
            : Number(cellA) - Number(cellB); // Numerical sort
    });

    // Define lit-html template for sorted rows
    const tableTemplate = html`
        ${rows.map((row) => {
            const cells = Array.from(row.children); // Get each <td> element
            return html`
                <tr>
                    ${cells.map((cell) => html`<td>${cell.textContent}</td>`)}
                </tr>
            `;
        })}
    `;

    // Render the sorted rows back into the tbody
    render(tableTemplate, tbody);
}