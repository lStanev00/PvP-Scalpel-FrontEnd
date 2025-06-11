const legacyData = [
    "World of Warcraft",
    "The Burning Crusade",
    "Wrath of the Lich King",
    "Cataclysm",
    "Mists of Pandaria",
    "Warlords",
    "Legion",
    "Battle for Azeroth"
];
const cheatSheat = [`Elite:`, `Duelist:`, `Rival II:`, "Rival I:", `Challenger II:`, `Challenger I:`, `Combatant II:`, `Combatant I:`].reverse();
const legacyCheatSheat = [`Elite:`, `Duelist:`, "Rival:", `Challenger:`, `Combatant:`].reverse();

function filterAchieves(mapArr) {

    if (!(mapArr instanceof Map)) {
        throw new TypeError("Expected mapArr to be a Map");
    }

    for (const [expansion, seasonList] of mapArr.entries()) {
        if (expansion == "noSeason") continue;

        const legacyChecker = legacyData.indexOf(expansion);

        if(legacyChecker == -1)
        for (const [seasonIndex, ssAches] of Object.entries(seasonList)) {
            let biggest = null;
            for (const title of cheatSheat) {
                const titleIndex = ssAches.findIndex(ach => ach.name.includes(title));
                if(titleIndex != -1) biggest = ssAches.splice(titleIndex, 1)[0]
            }
            if(biggest != null) ssAches.push(biggest)
        }
    }


}