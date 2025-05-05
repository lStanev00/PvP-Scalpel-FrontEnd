import httpFetch from "../../../helpers/httpFetch.js";
export default function TwosBTN({  setData, setPage, setContent  }){
    const clickHandler = async (event) => {
        const res = await httpFetch(`/LDBtest/2v2`);
        let reqData = await res.json();
        let rank = 1;
        const paginatedData = [];
    
        for (let i = 0; i < reqData.length; i += 25) {
            const page = reqData.slice(i, i + 25);
            let pageMap = []
                for (const char of page) {
                   
                   const achieves = char?.achieves?.['2s'] ?? undefined;


                    if(achieves){

                        try {
                            const description = (achieves.description)
                                .replace("Earn a ", "")
                                .replace(" personal rating in the 2v2 bracket of the arena.", "");
                            
                            char.XP = {
                                name: "Just the Two of Us:",
                                description
                            }
                            
                        } catch (error) {
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
            setContent(`2v2Content`);
    }
    return(
        <button onClick={clickHandler} id="twos" className="bracket-btn">2v2 Arena</button>
    )
}