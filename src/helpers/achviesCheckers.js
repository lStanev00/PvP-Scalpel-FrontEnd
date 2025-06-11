import { syncIndexes } from "mongoose";

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

export default function filterAchieves(mapArr) {

    if (!(mapArr instanceof Map)) {
        throw new TypeError("Expected mapArr to be a Map");
    }

    for (const [expansion, seasonList] of mapArr.entries()) {
        if (expansion == "noSeason") continue;

        let legacyChecker = legacyData.indexOf(expansion);
        
        for (const [seasonIndex, ssAches] of Object.entries(seasonList)) {

            if (expansion === "Shadowlands" && seasonIndex == "1") legacyChecker = 1
            if (expansion === "Shadowlands" && seasonIndex !== "1") legacyChecker = -1;

            let biggest = null;
            const checker = legacyChecker == -1 ? cheatSheat : legacyCheatSheat;

            for (const title of checker) {
                const titleIndex = ssAches.findIndex(ach => ach.name.includes(title));
                if(titleIndex != -1) biggest = ssAches.splice(titleIndex, 1)[0]
            }

            if(biggest != null) ssAches.push(biggest)
        }

    }

    const wowExpansions = [
    "noSeason",
    undefined,
    "World of Warcraft",
    "The Burning Crusade",
    "Wrath of the Lich King",
    "Cataclysm",
    "Mists of Pandaria",
    "Warlords",
    "Legion",
    "Battle for Azeroth",
    "Shadowlands",
    "Dragonflight",
    "The War Within",
    "Midnight",
    "The Last Titan"
    ].reverse();


    const sortedMap = new Map([...mapArr.entries()].sort((a, b) => {
        const expansion1 = a[0];
        const expansion2 = b[0];

        const hierarchyIndex1 = wowExpansions.indexOf(expansion1);
        const hierarchyIndex2 = wowExpansions.indexOf(expansion2);
        
        return hierarchyIndex1 - hierarchyIndex2;
    }))
    
    console.log(sortedMap)

    return sortedMap

}