export default function ThreesBTN({  setData, setPage, setContent  }){
    const clickHandler = async (event) => {
        const res = await fetch(`https://api.pvpscalpel.com/LDB/3v3`);
        let reqData = await res.json();
        let rank = 1;
        const paginatedData = [];
    
        for (let i = 0; i < reqData.length; i += 25) {
            const page = reqData.slice(i, i + 25);
            let pageMap = []
                for (const char of page) {
                   
                   const achieves = char?.achieves?.['3s'] ?? undefined;

                    if(achieves){
                        const XPRate = achieves.name.replace(`Three's Company: `, ``);
                        const XPName = `Three's Company: `;

                        char.XP = {
                            name: XPName,
                            description: XPRate
                        }
                        
                    };
                    char.ladderRank = rank;
                    pageMap.push(char)
                    rank = rank + 1;
                }
                paginatedData.push(pageMap);
            
            }
            setData(paginatedData);
            setPage(paginatedData[0]);
            setContent(`3v3Content`);
    }
    return(
        <button onClick={clickHandler} id="threes" className="bracket-btn">3v3 Arena</button>
    )
}