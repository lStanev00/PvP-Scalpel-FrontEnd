export default function CharXP({  XP  }) {
       
    if (XP) {
        if (XP.description) {
            return (
                
                    <td key={XP._id}>{XP.name}<br /><b>{XP.description}</b></td>
                
            )
        } else if(XP.name){
            return (
                
                    <td key={XP._id}>{XP.name}</td>
                
            )
        }
    } else {
        return (
            
                <td>No XP Yet</td>
            
        )
    }
}