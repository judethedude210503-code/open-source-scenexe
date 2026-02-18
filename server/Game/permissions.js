// OPERATOR LEVELS
/*
{
    level: 1 // Whats used in sandbox.
    level: 2 // Usually Shiny Member or YT.
    level: 3 // Access to tank editor and code. Cannot promote users above its own level nor demote users level 3 or greater.
    level: 4 // All permissions. Can promote and demote users to any level.
} 
*/

// If your Discord username doesn't have a 4-digit tag anymore, leave it as #0000.

module.exports = [
    {
        key: process.env.SHINY,
        discordID: "0",
        nameColor: "#ffffff",
        class: "arrasMenu_shinyMember",
        level: 2,
        name: "unnamed#0000",
        note: "note here"
    },
    {
        key: process.env.YOUTUBER,
        discordID: "0",
        nameColor: "#ffffff",
        class: "arrasMenu_youtuber",
        level: 2,
        name: "unnamed#0000",
        note: "note here"
    },
    {
        key: process.env.BETA_TESTER,
        discordID: "0",
        nameColor: "#ffffff",
        class: "arrasMenu_betaTester",
        level: 3,
        name: "unnamed#0000",
        note: "note here"
    },
    {
        key: process.env.DEVELOPER,
        discordID: "0",
        nameColor: "#FFFFFF",
        class: "developer",
        administrator: true,
        level: 3,
        name: "unnamed#0000",
        note: "note here"
    },
{
    key: process.env.ADMINISTRATOR,
    discordID: "0",
    nameColor: "#EFBF04",
    class: "administrator",
    administrator: true,
    level: 4,
    name: "Catman",
    note: "Full admin priveleges. Used by the only developer."
},
{
    key: process.env.NOVA,
    discordID: "0",
    nameColor: "#EFBF04",
    class: "scenCelP",
    administrator: false,
    level: 1,
    name: "unnamed#0000",
    note: "Note here."
},
]
