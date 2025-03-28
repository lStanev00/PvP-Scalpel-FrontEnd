import httpFetch from "../../../helpers/httpFetch.js";
export default function BlitzBtn({  setData, setPage, setContent  }){
    const clickHandler = async (event) => {
        const res = await httpFetch(`/LDB/blitz`);
        // const res = await fetch(`http://localhost:59534/LDB/blitz`);
        let reqData = await res.json();
        let rank = 1;
        const paginatedData = [];
    
        for (let i = 0; i < reqData.length; i += 25) {
            const page = reqData.slice(i, i + 25);
            let pageMap = []
                for (const char of page) {
                    let XP = undefined;
                    
                    const achieves = char?.achieves?.BG;
                    if(achieves){
                        for (const { name, description, _id } of achieves) {
                            
                            if ((name).includes(`Hero of the Alliance`) || (name).includes(`Hero of the Horde`)) {
                                XP = {
                                    _id: _id,
                                    name: name,
                                }
                                break;
                            } else if(description.includes(`Earn a rating of`)) {
                                XP = {_id: _id, name: name};
                                const numXP = description.replace(`Earn a rating of `, ``)
                                .replace(` in either Rated Battlegrounds or Rated Battleground Blitz.`, ``);

                                XP.description = numXP;
                                break;
                            }
                        }
                        char.XP = XP
                        
                    };
                    char.ladderRank = rank;
                    pageMap.push(char)
                    rank = rank + 1;
                }
                paginatedData.push(pageMap);
            
            }
            setData(paginatedData);
            setPage(paginatedData[0]);
            setContent(`blitzContent`);
    }
    return(
        <button onClick={clickHandler} id="blitz" className="bracket-btn">Blitz BG</button>
    )
}