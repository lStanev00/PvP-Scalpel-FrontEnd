


export default function CharXP({  XP  }) {
       
    if (XP) {
        if (XP.description) {
            return (
                
                    <td key={XP._id}>{XP.name}<br /><b>{XP.description}</b></td>
                
            )
        } else {
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