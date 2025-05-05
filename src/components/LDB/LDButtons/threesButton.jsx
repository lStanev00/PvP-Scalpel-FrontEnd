import httpFetch from "../../../helpers/httpFetch.js";
export default function ThreesBTN({  setData, setPage, setContent  }){
    const clickHandler = async (event) => {
        const res = await httpFetch(`/LDBtest/3v3`);
        // const res = await fetch(`http://localhost:59534/LDB/3v3`);

        let reqData = await res.json();
        let rank = 1;
        const paginatedData = [];
    
        for (let i = 0; i < reqData.length; i += 25) {
            const page = reqData.slice(i, i + 25);
            let pageMap = []
                for (const char of page) {
                   
                   const achieves = char?.achieves?.['3s'] ?? undefined;

                    if(achieves){
                        let XPRate;
                        let XPName = undefined;

                        if (achieves.name) {
                            XPRate = achieves.name ? achieves.name.replace(`Three's Company: `, ``): achieves;
                            XPName = `Three's Company: `;
                        } else {
                            XPRate = achieves
                        }

                        char.XP = {
                            name: XPName,
                            description: XPRate
                        }
                        if(XPName == undefined) {
                            char.XP = undefined
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