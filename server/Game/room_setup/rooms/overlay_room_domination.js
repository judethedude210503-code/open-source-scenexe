let room = Array(15).fill(() => Array(15).fill()).map(x => x());

// 8 dominator positions
room[7][3]  = tileClass.dominationTile;  // top
room[3][7]  = tileClass.dominationTile;  // left
room[11][7] = tileClass.dominationTile;  // right
room[7][11] = tileClass.dominationTile;  // bottom

room[4][4]  = tileClass.dominationTile;  // top-left
room[10][4] = tileClass.dominationTile;  // top-right
room[4][10] = tileClass.dominationTile;  // bottom-left
room[10][10]= tileClass.dominationTile;  // bottom-right

let domination_room = room;

module.exports = domination_room;
