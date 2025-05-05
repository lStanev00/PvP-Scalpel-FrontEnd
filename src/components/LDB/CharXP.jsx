export default function CharXP({  XP  }) {
       
    if (XP) {
        if (XP.description) {
            return (
                
                    <td >{XP.name}<br /><b>{XP.description}</b></td>
                
            )
        } else if(XP.name){
            return (
                
                    <td 
                        style={{
                            color: "#c7cf2b",
                            fontWeight: "bold"
                        }}
                    >

                        {XP.name}
                        
                    </td>
                    
                
            )
        }
    } else {
        return (
            
                <td>No XP Yet</td>
            
        )
    }
}