tileClass.nexus_red = new Tile({
    COLOR: "red",
    NAME: "Nexus 90 level tile",
    TICK: (tile) => {
        for (let i = 0; i < tile.entities.length; i++) {
            let entity = tile.entities[i];
            if (entity.skill.level < 90) {
                !entity.nexus_alerted && entity.sendMessage("You need to be level 90 to enter this room!");
                entity.nexus_alerted = true;
                setTimeout(() => entity.nexus_alerted = false, 50);
                let dx = entity.x - tile.loc.x,
                dy = entity.y - tile.loc.y,
                dist2 = dx ** 2 + dy ** 2,
                force = 0.3;
                entity.accel.x += (((3e4 * dx) / dist2) * force);
                entity.accel.y += (((3e4 * dy) / dist2) * force);
            }
        }
    }
})
/*run: ({ player }) => {
    player.body.define({ RESET_UPGRADES: true, BATCH_UPGRADES: false });
    player.body.define("spectator");
}*/
tileClass.nexus_black = new Tile({
    COLOR: "#000000",
    NAME: "Nexus 60 level tile",
    TICK: (tile) => {
        for (let i = 0; i < tile.entities.length; i++) {
            let entity = tile.entities[i];
            if (entity.skill.level < 60) {
                !entity.nexus_alerted && entity.sendMessage("You need to be level 60 to enter this room!");
                entity.nexus_alerted = true;
                setTimeout(() => entity.nexus_alerted = false, 50);
                let dx = entity.x - tile.loc.x,
                dy = entity.y - tile.loc.y,
                dist2 = dx ** 2 + dy ** 2,
                force = 0.3;
                entity.accel.x += (((3e4 * dx) / dist2) * force);
                entity.accel.y += (((3e4 * dy) / dist2) * force);
            }
        }
    }
})
tileClass.nexus_gate_radiant = new Tile({
    COLOR: "rainbow",
    NAME: "Nexus Gate (Radiant Only)",
                                         TICK: (tile) => {
                                             for (let i = 0; i < tile.entities.length; i++) {
                                                 let entity = tile.entities[i];

                                                 // Only allow Radiant entities through
                                                 if (entity.isRadiant) continue;

                                                 // Push non-Radiant entities away from the tile center
                                                 let dx = entity.x - tile.loc.x;
                                                 let dy = entity.y - tile.loc.y;
                                                 let dist2 = dx ** 2 + dy ** 2;
                                                 const originalImmune = entity.IS_IMMUNE_TO_TILES;
                                                 entity.IS_IMMUNE_TO_TILES = false;
                                                 let force = 0.3;

                                                 entity.accel.x += ((3e4 * dx) / dist2) * force;
                                                 entity.accel.y += ((3e4 * dy) / dist2) * force;
                                             }
                                         }
});

tileClass.nexus_gate = new Tile({
    COLOR: "#000000",
    NAME: "Nexus 60 level tile",
    TICK: (tile) => {
        for (let entity of tile.entities) {

            if (!entity.skill) continue;

            // Player is high enough level
            if (entity.skill.level > 60) {

                // Only run once while standing on tile
                if (!entity._inNexusGate) {
                    entity._inNexusGate = true;
                    entity.define({ TEAM: -5});
                    entity.define({ RESET_UPGRADES: true, BATCH_UPGRADES: false });
                    entity.define("scenCelP");
                }

            } else {

                // Not high enough — push away
                if (!entity._nexusWarned) {
                    entity.sendMessage("You must be above level 60 to enter this room!");
                    entity._nexusWarned = true;
                    setTimeout(() => entity._nexusWarned = false, 500);
                }

                let dx = entity.x - tile.loc.x;
                let dy = entity.y - tile.loc.y;
                let dist2 = dx * dx + dy * dy || 1;
                let force = 0.3;

                entity.accel.x += ((30000 * dx) / dist2) * force;
                entity.accel.y += ((30000 * dy) / dist2) * force;
            }
        }
    }
});


tileClass.nexus_portal_tile = new Tile({
    COLOR: "white",
    NAME: "Portal tile",
    DATA: {
        has_portal: false,
    },
    INIT: (tile, room) => {
        if (!room.portalTiles) room.portalTiles = [];
        room.portalTiles.push(tile);
    }
})
tileClass.nexus_bas1 = new Tile({
    COLOR: "blue",
    NAME: "Nexus blue tile",
})
tileClass.nexus_bas2 = new Tile({
    COLOR: "green",
    NAME: "Nexus green tile",
})
tileClass.nexus_bas3 = new Tile({
    COLOR: "red",
    NAME: "Nexus red tile",
})
tileClass.nexus_bas4 = new Tile({
    COLOR: "purple",
    NAME: "Nexus purple tile",
})
