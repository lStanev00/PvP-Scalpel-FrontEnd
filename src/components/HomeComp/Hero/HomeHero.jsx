import Style from "./HomeHero.module.css";

export default function HomeHero() {
    return (
        <section className={Style.hero}>
            <div className={Style.overlay}></div>

            <div className={Style.content}>
                <img
                    className={Style.logo}
                    src="/logo/logo_resized.png"
                    alt="PvP Scalpel Logo"
                />
                <h1>PvP Scalpel</h1>
                <p>
                    Precision. Performance. Power.  
                    <br />
                    Built by players — evolving into the ultimate PvP companion.
                </p>
            </div>
        </section>
    );
}
