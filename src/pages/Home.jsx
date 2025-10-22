import { useEffect, useState, useContext } from "react";
import { UserContext } from "../hooks/ContextVariables";
import WeeklyRender from "../components/HomeComp/WeeklyRender/WeeklyRender";
import HomeHero from "../components/HomeComp/Hero/HomeHero";
import Style from "../Styles/modular/Home.module.css";
import TopRatedRender from "../components/HomeComp/TopRatedRender/TopRatedRender";
import SEOHome from "../SEO/SEOHome";

export default function Home() {
    const { httpFetch } = useContext(UserContext);
    const [weeklyData, setWeeklyData] = useState(null);
    const [topData, setTopData] = useState(null);

    useEffect(() => {
        const loadWeekly = async () => {
            const req = await httpFetch("/weekly");
            if (req.ok && req.status === 200 && req.data) {
                setWeeklyData(req.data);
            }
        };
        const LDBTops = async () => {
            const req = await httpFetch("/LDB/topAll");
            if (req.ok && req.status === 200 && req.data) {
                setTopData(req.data);
            }
        };
        loadWeekly();
        LDBTops()
    }, []);

    return (
        <main className={Style.mainGrid}>
            <SEOHome />
            <div className={Style.lightSweep}></div>
            <HomeHero />
            <div className={Style["section-separator"]}></div>
            <TopRatedRender topData={topData} />
            <WeeklyRender weeklyData={weeklyData} />
        </main>
    );
}
