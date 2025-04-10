import { useContext } from 'react';
import Style from '../../Styles/modular/StatsChart.module.css';
import { CharacterContext } from '../../pages/CharDetails';


export default function StatsChart () {
    const {data} = useContext(CharacterContext);
    const rawUserStats = data.equipmentStats;

    const stats = {
        main: {
            [rawUserStats.Primary[0]]: rawUserStats.Primary[1],
            Stamina: rawUserStats.Stamina,
            Armor: rawUserStats.Armor
        },
        secondary: [
            ["Versatility", rawUserStats.Versatility],
            ['Critical Strike', rawUserStats.CriticalStrike],
            ["Haste", rawUserStats.Haste],
            ['Mastery', rawUserStats.Mastery],
        ],
    };

    stats.secondary = stats.secondary.sort((a, b) => {
        const valA = Number(a[1].replace(`%`, ``));
        const valB = Number(b[1].replace(`%`, ``));
        return valB - valA; 
    });
    

    
    return (
        <section className={Style.section}>
            <h2>Stats Priority</h2>

            <div className={Style.graph}>

                <div>
                    <h3>{stats.secondary[0][0]}</h3>
                    <div  style={{height: "50px", backgroundColor:'red'}}>D</div>
                </div>
                <div>
                    <h3>{stats.secondary[1][0]}</h3>
                </div>
                <div>
                    <h3>{stats.secondary[2][0]}</h3>
                </div>
                <div>
                    <h3>{stats.secondary[3][0]}</h3>
                </div>
                
            </div>
        </section>
    )
}