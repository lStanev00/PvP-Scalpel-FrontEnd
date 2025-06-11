const legacyData = [
    "World of Warcraft",
    "The Burning Crusade",
    "Wrath of the Lich King",
    "Cataclysm",
    "Mists of Pandaria",
    "Warlords of Draenor",
    "Legion",
    "Battle for Azeroth"
];
const cheatSheat = [`Elite:`, `Duelist:`, `Rival II:`, "Rival I:", `Challenger II:`, `Challenger I:`, `Combatant II:`, `Combatant I:`].reverse();
const legacyCheatSeat = [`Elite:`, `Duelist:`, "Rival:", `Challenger:`, `Combatant:`].reverse();

function filterAchieves(mapArr) {

    if (!(mapArr instanceof Map)) {
        throw new TypeError("Expected mapArr to be a Map");
    }

}