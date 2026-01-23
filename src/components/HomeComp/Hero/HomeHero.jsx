import { FaDiscord, FaDownload } from "react-icons/fa";
import { GiBroadsword } from "react-icons/gi";
import Style from "./HomeHero.module.css";

export default function HomeHero() {
    return (
        <section className={Style.hero}>
            <div className={Style.overlay}></div>

            <div className={Style.content}>
                <img className={Style.logo} src="/logo/logo_resized.png" alt="PvP Scalpel Logo" />
                <h1 >PvP Scalpel</h1>
                <p className={Style.p}>
                    Precision. Performance. Power.
                    <br />
                    Built by players — evolving into the ultimate PvP companion.
                </p>

                <div className={Style.actions}>
                    {/* <a href="/download" className={`${Style.btn} ${Style.download}`}>
                        <span>Download</span>
                        <FaDownload className={Style.icon} />
                    </a> */}

                    <a
                        href="https://discord.gg/2h45zpyJdb"
                        target="_blank"
                        rel="noreferrer"
                        className={`${Style.btn} ${Style.discord}`}>
                        <span>Join Discord</span>
                        <FaDiscord className={Style.icon} />
                    </a>

                    <a href="/joinGuild" className={`${Style.btn} ${Style.guild}`}>
                        <span>Join the Guild</span>
                        <GiBroadsword className={Style.icon} />
                    </a>
                </div>
            </div>
        </section>
    );
}
