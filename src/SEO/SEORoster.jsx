import { Helmet } from "react-helmet-async";

export default function SEORoster() {
    return (
        <Helmet>
            <title>PvP Scalpel — Guild Members</title>
            <meta
                name="description"
                content="Meet the PvP Scalpel guild — elite WoW PvP players united by precision, performance, and power."
            />
            <link rel="canonical" href="https://pvpscalpel.com/roster" />
        </Helmet>
    );
}
