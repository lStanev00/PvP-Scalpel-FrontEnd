export default function ShuffleBTN({  setData, setPage, setContent  }) {
    const clickHandler = async (event) => {
        const res = await fetch(`https://api.pvpscalpel.com/LDB/solo`);
        let reqData = await res.json();
        let rank = 1;
        const paginatedData = [];
        
        for (let i = 0; i < reqData.length; i += 25) {
            const page = reqData.slice(i, i + 25);
            let pageMap = [];

            for (const char of page) {
                char.ladderRank = rank;
                pageMap.push(char)
                rank = rank + 1;
            };

            paginatedData.push(pageMap);
        }

        setData(paginatedData);
        setPage(paginatedData[0]);
        setContent(`shuffleContent`);
    }

    return (
        <button onClick={clickHandler} id="shuffle" className="bracket-btn">Solo Shuffle</button>
    )
}