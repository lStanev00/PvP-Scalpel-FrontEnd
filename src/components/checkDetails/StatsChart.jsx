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
        secondary: {
            Versatility: rawUserStats.Versatility,
            CriticalStrike: rawUserStats.CriticalStrike,
            Haste: rawUserStats.Haste,
            Mastery: rawUserStats.Mastery,
        },
    };

    
    return (
        <section className={Style.section}>
            <h2>Stats Priority</h2>

            <div>

                
            </div>
        </section>
    )
}