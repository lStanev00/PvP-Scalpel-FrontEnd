import { useContext } from 'react';
import Style from '../../Styles/modular/StatsChart.module.css';
import { CharacterContext } from '../../pages/CharDetails';


export default function StatsChart () {
    const {data} = useContext(CharacterContext);
    const userStats = data.equipmentStats;
    return (
        <section className={Style.section}>
            <h2>Stats Priority</h2>
            <div>

                
            </div>
        </section>
    )
}