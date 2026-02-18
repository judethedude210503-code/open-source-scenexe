let spawnPermanentSmasher = (loc, gameManager) => {
    let o = new Entity(loc);
    o.define('peacekeeperbase');
    o.define({
        BODY: { FOV: 1.5, },
        FACING_TYPE: "spinWhenIdle",
        VALUE: 100000,
        LEVEL: 60,
        COLOR: "rainbow",
        DANGER: 20,
        CAN_GO_OUTSIDE_ROOM: true,
                            SKILL: Array(10).fill(9),
        AI: {
            FULL_VIEW: true,
             SKYNET: true,
             BLIND: true,
             CHASE: true,
        },
                            CONTROLLERS: [["nearestDifferentMaster", { lockThroughWalls: false }], "mapTargetToGoal"],
    })
    o.team = TEAM_DREADNOUGHTS;
    o.SIZE = 25;

    o.on('dead', () => spawnPermanentSmasher(loc, gameManager));
};
tileClass.deathBorder = new Tile({
    COLOR: "white",
    TICK: tile => {
        for (let i = 0; i < tile.entities.length; i++) {
            let entity = tile.entities[i];
            if (
                !entity.isArenaCloser
            ) entity.destroy();
        }
    }
});

tileClass.hungrysmasher = new Tile({
    COLOR: "white",
    NAME: "Smasher Tile",
    INIT: (tile, room, gameManager) => spawnPermanentSmasher(tile.loc, gameManager)
})

tileClass.labywall = new Tile({
    COLOR: "white",
    NAME: "labywall",
    INIT: (tile, room) => {
        let o = new Entity(tile.loc);
        o.define("labywall");
        o.team = TEAM_ROOM;
        o.SIZE = room.tileWidth / 2 / lazyRealSizes[4] * Math.SQRT2 - 2;
        o.protect();
        o.life();
        makeHitbox(o);
        walls.push(o);
        o.on("dead", () => {
            util.remove(walls, walls.indexOf(o));
        })
        if (Config.spookyTheme) {
            let eyeSize = 12 * (Math.random() + 0.75);
            let spookyEye = new Entity({ x: wall.x + (wall.size - eyeSize * 2) * Math.random() - wall.size / 2, y: wall.y + (wall.size - eyeSize * 2) * Math.random() - wall.size / 2 })
            spookyEye.define("hwEye");
            spookyEye.define({FACING_TYPE: ["manual", {angle: ran.randomAngle()}]})
            spookyEye.SIZE = eyeSize;
            spookyEye.minimapColor = 49;
        }
    }
});
