import { useContext } from "react";
import { CharacterContext } from "../../pages/CharDetails";
import { GiSwordman, GiSpeedometer, GiShieldReflect, GiCrystalBars } from "react-icons/gi";
import Style from "../../Styles/modular/StatsChart.module.css";

export default function StatsChart() {
  const { data } = useContext(CharacterContext);
  const rawUserStats = data.equipmentStats;

  const stats = {
    main: {
      [rawUserStats?.Primary[0]]: rawUserStats?.Primary[1],
      Stamina: rawUserStats?.Stamina,
      Armor: rawUserStats?.Armor,
    },
    secondary: [
      ["Versatility", rawUserStats?.Versatility],
      ["Critical Strike", rawUserStats?.CriticalStrike],
      ["Haste", rawUserStats?.Haste],
      ["Mastery", rawUserStats?.Mastery],
    ],
  };

  stats.secondary = stats.secondary.sort((a, b) => {
    const valA = Number(a[1]?.replace("%", "")) || 0;
    const valB = Number(b[1]?.replace("%", "")) || 0;
    return valB - valA;
  });

  const icons = {
    Mastery: <GiCrystalBars />,
    Versatility: <GiSwordman />,
    Haste: <GiSpeedometer />,
    "Critical Strike": <GiShieldReflect />,
  };

  return (
    <section className={Style.section}>
      <h2>Stats Priority</h2>
      <div className={Style.chartContainer}>
        {stats.secondary.map(([name, value]) => (
          <div className={Style.statBox} key={name}>
            <div className={Style.icon}>{icons[name]}</div>
            <span className={Style.name}>{name}</span>
            <div className={Style.barContainer}>
              <div
                className={Style.bar}
                style={{
                  height: `${(Number(value?.replace("%", "")) || 0) * 2.6}px`,
                }}
              />
            </div>
            <p className={Style.value}>{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
