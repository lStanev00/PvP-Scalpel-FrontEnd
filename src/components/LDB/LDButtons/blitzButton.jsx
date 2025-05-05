import httpFetch from "../../../helpers/httpFetch.js";
export default function BlitzBtn({  setData, setPage, setContent  }){
    const clickHandler = async (event) => {
        const res = await httpFetch(`/LDBtest/blitz`);
        // const res = await fetch(`http://localhost:59534/LDB/blitz`);
        let reqData = await res.json();
        let rank = 1;
        const paginatedData = [];
    
        for (let i = 0; i < reqData.length; i += 25) {
            const page = reqData.slice(i, i + 25);
            let pageMap = []
                for (const char of page) {
                    let XP = undefined;
                    
                    const blitzAchieves = char?.achieves?.Blitz;
                    console.log(blitzAchieves)

                    if (blitzAchieves){

                        const name = blitzAchieves.XP.name;
                        const description = blitzAchieves.XP.description;
                        let strategistCheckup = blitzAchieves?.WINS?.name;

                        if (strategistCheckup == undefined) strategistCheckup = "";

                        
                        if ((strategistCheckup).includes(`Strategist`) || (name).includes(`Hero of the Horde`)) {
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
                        
                    pageMap.push(char)
                    rank = rank + 1;
                }
                paginatedData.push(pageMap);
            
            }
            console.log(paginatedData)
            setData(paginatedData);
            setPage(paginatedData[0]);
            setContent(`blitzContent`);
    }
    return(
        <button onClick={clickHandler} id="blitz" className="bracket-btn">Blitz BG</button>
    )
}