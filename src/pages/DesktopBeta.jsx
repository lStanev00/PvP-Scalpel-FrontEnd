import Style from "../Styles/modular/DesktopBeta.module.css";
import SEODesktopBeta from "../SEO/SEODesktopBeta";

export default function DesktopBeta() {
    return (
        <main className={Style.container}>
            <SEODesktopBeta />
            <div className={Style.header}>
                <img
                    src="/logo/logo_resized.png"
                    alt="PvP Scalpel Logo"
                    className={Style.logo}
                />
                <h1 className={Style.title}>PvP Scalpel Desktop — Closed Beta</h1>
                <p className={Style.subtitle}>Private beta invite information</p>
            </div>

            <div className={Style.content}>
                <section className={Style.card}>
                    <h2>Availability</h2>
                    <div className={Style.availability}>
                        <div>
                            Total beta spots: <strong>5</strong>
                        </div>
                        <div>
                            Spots remaining: <strong>1</strong>
                        </div>
                        <div>Guild members are prioritized</div>
                    </div>
                </section>

                <section className={Style.card}>
                    <h2>What is PvP Scalpel Desktop?</h2>
                    <p>
                        PvP Scalpel Desktop is a companion application for PvP players who want
                        clear insight into their rated matches without distractions or extra steps.
                    </p>
                    <p>
                        It runs quietly in the background while you play and organizes match data
                        after the game ends.
                    </p>
                    <p>
                        It does not coach, predict, or guess. It simply presents what actually
                        happened in your matches.
                    </p>
                </section>

                <section className={Style.card}>
                    <h2>How it works (player view)</h2>
                    <ol>
                        <li>Install the PvP Scalpel addon</li>
                        <li>Run the PvP Scalpel Desktop app</li>
                        <li>Play rated PvP (Solo Shuffle, arenas, etc.)</li>
                        <li>
                            After the match, type <strong>/reload</strong> in-game
                        </li>
                        <li>
                            Open the desktop app to review:
                            <ul>
                                <li>Match history</li>
                                <li>Rating and MMR changes</li>
                                <li>Player and team performance</li>
                                <li>Key match moments</li>
                            </ul>
                        </li>
                    </ol>
                    <p>No manual data entry. No mid-game actions.</p>
                </section>

                <section className={Style.card}>
                    <h2>What the beta is for</h2>
                    <ul>
                        <li>Validate clarity and usability</li>
                        <li>
                            Confirm that the workflow feels natural for real PvP sessions
                        </li>
                        <li>Gather feedback from active PvP players</li>
                    </ul>
                    <p>
                        This is a beta — expect rough edges. Bugs, missing polish, and occasional
                        quirks are normal at this stage.
                    </p>
                    <p>
                        Your perspective helps us most: what feels confusing, what feels slow,
                        what should be simpler, and what you wish existed from a player’s point
                        of view.
                    </p>
                    <p>
                        Please share ideas for missing features in both the desktop app and the
                        in‑game addon — especially anything that would make post‑match review
                        faster, clearer, or more useful.
                    </p>
                    <p>The focus is on <strong>experience</strong>, not technical testing.</p>
                </section>

                <section className={Style.card}>
                    <h2>Beta tester recognition</h2>
                    <ul>
                        <li>
                            Explicit credit as a <strong>Beta Tester</strong> in the PvP Scalpel
                            project
                        </li>
                        <li>Early access to upcoming features</li>
                        <li>Priority consideration for future testing phases</li>
                    </ul>
                    <p>
                        You also get a real chance to shape the app and its features so they’re
                        genuinely useful for your own PvP workflow.
                    </p>
                </section>

                <section className={Style.card}>
                    <h2>How to participate</h2>
                    <p>This page does not contain sign-up forms.</p>
                    <p>If you are interested in joining the beta:</p>
                    <ul>
                        <li>Contact the PvP Scalpel team directly via Discord DM</li>
                        <li>Guild members are considered first</li>
                    </ul>
                    <p>
                        When you reach out, tell us what you want to track, what doesn’t work
                        today, and any ideas for improvements in the app or addon.
                    </p>
                </section>

                <div className={Style.note}>
                    This page is informational only and is shared by direct link.
                </div>
            </div>
        </main>
    );
}
