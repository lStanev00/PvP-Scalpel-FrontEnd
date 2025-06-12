import TableStyle from '../../Styles/modular/checkDetailsPvPTable.module.css'
export default function PvPCards({ title, bracketData, Style }) {
    if (bracketData?.currentSeason?.rating == 0) bracketData.currentSeason.rating = null;
    console.log(title, bracketData)
    if(bracketData?.achieves && bracketData.currentSeason.title?.media )return (
            <div className={Style["pvp-card"]}>
                <section className={Style["inner-section"]}>

                    
                <div className={Style["spec-border-div"]}>
                    <p className={Style["spec-title"]}>{title}</p>
                </div>
                <div className={Style["pvp-spec"]}>
                {/* This Season */}
                    {bracketData.currentSeason && bracketData.currentSeason.rating && bracketData.currentSeason.title?.media && (
                    <div className={Style["pvp-details"]}>
                        <p>Rating</p>
                        <img src={bracketData?.currentSeason?.title?.media || ""} alt="PvP Rank Icon" />
                        <div className={Style["pvp-card-info"]}>
                            <strong>{bracketData.currentSeason?.title?.name}</strong>
                            <span className={Style["pvp-rating"]}> {bracketData.currentSeason?.rating == 0 ? null : bracketData.currentSeason?.rating}</span>  
                        </div>

                    </div>

                    )}
                    {/* XP */}

                    {bracketData?.achieves && (
                        <div className={Style["pvp-details"]}>
                            <p>Record</p>
                            <img src={bracketData.achieves.media} alt="PvP Rank Icon" />
                            <div className={Style['pvp-card-info']}>
                                <strong>{bracketData.achieves.name}</strong>
                                {bracketData.record && (<span className={Style["pvp-rating"]}> {bracketData.record}</span>)}
                            </div>
                        </div>

                    )}
                </div>

                {/* Matches Played Stats */}
                {bracketData.currentSeason.title?.media && (

                    <table className={TableStyle["pvp-table"]}>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Weekly</th>
                                <th>Season</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>Played</td>
                                    <td>{bracketData?.currentSeason?.weeklyMatchStatistics?.played ?? 0}</td>
                                    <td>{bracketData?.currentSeason?.seasonMatchStatistics?.played ?? 0}</td>
                            </tr>
                            <tr>
                                <td>Won</td>
                                <td>{bracketData?.currentSeason?.weeklyMatchStatistics?.won ?? 0}</td>
                                <td>{bracketData?.currentSeason?.seasonMatchStatistics?.won ?? 0}</td>
                            </tr>
                            <tr>
                                <td>Lost</td>
                                <td>{bracketData?.currentSeason?.weeklyMatchStatistics?.lost ?? 0}</td>
                                <td>{bracketData?.currentSeason?.seasonMatchStatistics?.lost ?? 0}</td>
                            </tr>
                        </tbody>
                    </table>
                )}
                </section>

            </div>
    );
}