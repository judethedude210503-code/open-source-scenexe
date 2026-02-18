const {
    normal: ____,
    base1: bas1,
    baseprotected1: bap1,
    base2: bas2,
    baseprotected2: bap2,
    base3: bas3,
    baseprotected3: bap3,
    base4: bas4,
    baseprotected4: bap4,
    nest,
    rock,
    roid,
    wall,
    labywall: laby,
    portal: port,
    nexus_black: BLAC,
        nexus_portal_tile: prtl,
        hungrysmasher: smas,
        atmg,
        nexus_gate: gate,
        base5: bas5,
        deathBorder: debo,
        nexus_gate_radiant: radg
} = tileClass;


let room_labyrinth = [
    [debo,debo,debo,debo,debo,debo,debo,debo,debo,debo,debo,debo,debo,debo,debo,debo,debo,debo,debo,debo,debo,debo,debo,debo,debo,debo,debo],

[debo,bas3,bas3,____,____,____,____,roid,roid,roid,____,____,____,____,bas2,bas2,wall,atmg,wall,atmg,wall,wall,wall,wall,wall,wall,debo],
[debo,bas3,bap3,laby,____,____,____,roid,roid,roid,____,____,____,laby,bap2,bas2,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,debo],
[debo,____,laby,laby,rock,____,____,____,____,____,____,____,rock,laby,laby,____,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,debo],
[debo,____,____,rock,rock,____,____,____,debo,____,radg,____,rock,rock,____,____,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,debo],
[debo,____,laby,laby,____,laby,____,____,____,____,____,____,____,____,____,____,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,debo],
[debo,____,____,____,____,____,laby,laby,gate,laby,laby,____,____,____,____,____,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,debo],
[debo,____,____,____,laby,laby,laby,bas5,bas5,bas5,laby,____,____,____,roid,roid,wall,smas,wall,nest,nest,nest,wall,nest,nest,wall,debo],
[debo,____,laby,____,laby,____,gate,bas5,port,bas5,gate,____,____,____,roid,roid,wall,nest,wall,nest,wall,nest,wall,nest,nest,port,debo],
[debo,____,laby,laby,laby,____,laby,bas5,bas5,bas5,laby,____,____,____,roid,roid,wall,nest,nest,nest,wall,nest,nest,nest,nest,wall,debo],
[debo,____,laby,____,laby,____,laby,laby,gate,laby,laby,____,____,____,____,____,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,debo],
[debo,____,laby,____,____,____,____,____,____,____,____,____,____,____,____,____,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,debo],
[debo,____,____,rock,rock,____,____,____,____,____,____,____,rock,rock,____,____,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,debo],
[debo,____,laby,laby,rock,____,____,____,____,____,____,____,rock,laby,laby,____,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,debo],
[debo,bas4,bap4,laby,____,____,____,roid,roid,roid,____,____,____,laby,bap1,bas1,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,debo],
[debo,bas4,bas4,____,____,____,____,roid,roid,roid,____,____,____,____,bas1,bas1,wall,atmg,wall,atmg,wall,wall,wall,wall,wall,wall,debo],

[debo,debo,debo,debo,debo,debo,debo,debo,debo,debo,debo,debo,debo,debo,debo,debo,debo,debo,debo,debo,debo,debo,debo,debo,debo,debo,debo]
];



module.exports = room_labyrinth;
