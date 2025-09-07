import { useContext } from 'react';
import Style from '../../Styles/modular/StatsChart.module.css';
import { CharacterContext } from '../../pages/CharDetails';


export default function StatsChart () {
    const {data} = useContext(CharacterContext);
    const rawUserStats = data.equipmentStats;

    const stats = {
        main: {
            [rawUserStats?.Primary[0]]: rawUserStats?.Primary[1],
            Stamina: rawUserStats?.Stamina,
            Armor: rawUserStats?.Armor
        },
        secondary: [
            ["Versatility", rawUserStats?.Versatility],
            ['Critical Strike', rawUserStats?.CriticalStrike],
            ["Haste", rawUserStats?.Haste],
            ['Mastery', rawUserStats?.Mastery],
        ],
    };

    stats.secondary = stats.secondary.sort((a, b) => {
        if(!a[1] ) a[1] = "0%" 
        if(!b[1] ) b[1] = "0%";
        if(!a && !b) return;
        const valA = Number(a[1].replace(`%`, ``));
        const valB = Number(b[1].replace(`%`, ``));
        return valB - valA; 
    });
    

    
    return (
        <section className={Style.section}>
            <h2>Stats Priority</h2>

            <div className={Style.content}>

                <div className={Style.graph}>

                    {stats.secondary.map(([name, statValue]) => {
                        return <DivStat key={`${name}/GRAPH`} name={name} statValue={statValue} />
                    })}

                    
                </div>

            </div>

        </section>
    )
}

function DivStat({name, statValue}) { 
    let statValueNumber = Number(statValue.replace(`%`, ``)) 

    try {
        statValueNumber = Number(statValue.replace(`%`, ``)) 
    } catch (error) {
        statValueNumber = 0;
    }
    let divSize = statValueNumber * 10 / 2

    return (
    <div>

        <h3>{name}</h3>

        <div>
            
            <p>
                {statValue}
            </p>

            <div title={name} style={{ maxHeight: "290px", height: `${divSize}px`, background: 'linear-gradient(to bottom, #ffcc00, #0ea5e9)', width: "20px"}}></div>

        </div>


    </div>
    )
    
}