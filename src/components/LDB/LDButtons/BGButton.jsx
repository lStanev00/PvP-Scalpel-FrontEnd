import httpFetch from "../../../helpers/httpFetch.js";
export default function BGBtn({  setData, setPage, setContent  }){
    const clickHandler = async () => {
        setData(() => undefined);
        let reqData;
        const res = await httpFetch(`/LDB/BG`);
        reqData = await res.json();
        let rank = 1;
        const paginatedData = [];
    
        for (let i = 0; i < reqData.length; i += 25) {
            const page = reqData.slice(i, i + 25);
            let pageMap = []
                for (const char of page) {
                    let XP = undefined;
                    
                    const achieves = char?.achieves?.RBG?.XP;
                    if(achieves){

                        let name = achieves?.name;
                        let description = achieves.description;

                        if (name == undefined) name = "";
                        if (description == undefined) description = "";

                        XP = {name: name};

                        const numXP = description
                            .replace(`Earn a rating of `, ``)
                            .replace(` in either Rated Battlegrounds or Rated Battleground Blitz.`, ``);

                        XP.description = numXP;

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
            setContent(`BGContent`);
    }
    return(
        <button onClick={clickHandler} id="rbg" className="bracket-btn">RATED BG</button>
    )
}