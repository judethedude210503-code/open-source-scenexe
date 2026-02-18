let spawnPermanentCel = (loc, team) => {
    let o = new Entity(loc);
    o.define('primeCelestial');
    o.team = team;
    o.color.base = getTeamColor(team);
    o.on('dead', () => spawnPermanentCel(loc, team));
},
teamCheck = (tile, team) => {
    for (let i = 0; i < tile.entities.length; i++) {
        let entity = tile.entities[i];
        if (entity.team !== team && !entity.ac && !entity.master.master.ac && !entity.isArenaCloser && !entity.master.master.isArenaCloser) {
            entity.kill()
        };
    }
},
teamRoomCheck = (tile, team, room) => {
    if (!room.spawnable[team]) room.spawnable[team] = [];
    room.spawnable[team].push(tile);
};

tileClass.baseprotected5 = new Tile({
    COLOR: 5,
    VISIBLE_FROM_BLACKOUT: true,
    INIT: (tile, room) => {
        teamRoomCheck(tile, TEAM_CELESTIALS, room),
                                    spawnPermanentCel(tile.loc, TEAM_CELESTIALS);
    },
    TICK: tile => teamCheck(tile, TEAM_BLUE)
})
// IMAGE TESTING
tileClass.imagetest = new Tile({
    COLOR: "white",
    IMAGE: "/round.png",
    NAME: "Image Tile",
});
tileClass.imagetest2 = new Tile({
    COLOR: "white",
    IMAGE: "/tileGrass1.jpg",
    NAME: "Image Tile",
});
tileClass.imagetest3 = new Tile({
    COLOR: "white",
    IMAGE: "/Grass_c_0.png",
    NAME: "Image Tile",
});
tileClass.imagetest4 = new Tile({
    COLOR: "white",
    IMAGE: "/Grass_c_0.svg",
    NAME: "Image Tile",
});
tileClass.imagetesterror = new Tile({
    COLOR: "white",
    IMAGE: "/noneofyourbusiness.png", // TODO: Hardcode the new missing tile texture as an svg instead of just pointing to a file
    NAME: "Missing Tile",
});
