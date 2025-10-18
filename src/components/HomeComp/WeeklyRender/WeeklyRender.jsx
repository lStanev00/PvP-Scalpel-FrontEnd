export default function WeeklyRender({ weeklyData }) {
    const twosTop = weeklyData?.["2v2"];
    const shuffleTop = weeklyData?.["shuffle"];
    const thresTop = weeklyData?.["3v3"];
    const blitzTop = weeklyData?.["blitz"];
    const RBGTop = weeklyData?.["RBG"];
    const lastUpdated = weeklyData?.["lastUpdated"];
    

    if (weeklyData === null) return null;

    return (
        <div>

        </div>
    )
}