import { useSEO } from "../hooks/useSEO";

export default function SEORoster() {
    useSEO({
        title: "PvP Scalpel — Guild Members",
        description:
            "Meet the PvP Scalpel guild — elite WoW PvP players united by precision, performance, and power.",
        canonical: "https://pvpscalpel.com/roster",
    });

    return null;
}
