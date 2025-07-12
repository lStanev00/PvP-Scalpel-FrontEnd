import httpFetch from "../../../helpers/httpFetch.js";
export default function BlitzBtn({  setData, setPage, setContent  }){
    const clickHandler = async () => {
        const res = await httpFetch(`/LDB/blitz`);
        setData(() => undefined);

        let reqData = await res.json();
        let rank = 1;
        const paginatedData = [];
    
        for (let i = 0; i < reqData.length; i += 25) {
            const page = reqData.slice(i, i + 25);
            let pageMap = []
                for (const char of page) {
                    let XP = undefined;
                    
                    const blitzAchieves = char?.achieves?.Blitz;
                    let [ bracket, bracketClass, bracketSpec] = ((Object.keys(char.rating))[0]).split(`-`);
                    char["class"] = bracketClass.replace(/^./, c => c.toUpperCase());
                    char["spec"] = bracketSpec.replace(/^./, c => c.toUpperCase());


                    if (blitzAchieves){

                        let name = blitzAchieves?.XP?.name;
                        let description = blitzAchieves.XP?.description;
                        let strategistCheckup = blitzAchieves?.WINS?.name;

                        if (strategistCheckup == undefined) strategistCheckup = "";
                        if (name == undefined) name = "";
                        if (description == undefined) description = "";

                        
                        if ((strategistCheckup).includes(`Strategist`) || (name).includes(`Hero of the Horde`) || (name).includes(`Hero of the Alliance`)) {
                            XP = {};

                            if((strategistCheckup).includes(`Strategist`)) XP.name = "Strategist"
                            else if ((name).includes(`Hero of the Horde`)) XP.name = "Hero of the Horde"
                            else if ((name).includes(`Hero of the Alliance`)) XP.name = "Hero of the Alliance"

                            // break;

                        } else if(description.includes(`Earn a rating of`)) {

                            XP = {name: name};

                            const numXP = description.replace(`Earn a rating of `, ``)
                            .replace(` in either Rated Battlegrounds or Rated Battleground Blitz.`, ``);

                            XP.description = numXP;

                            // break;
                        }
                    }


                    char.XP = XP
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