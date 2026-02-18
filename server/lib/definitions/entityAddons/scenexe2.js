// An addon is guaranteed to run only after all groups are loaded.
// This is helpful, if your group relies on all other definitions already being loaded.
// Addons that are dependant on other addons should be named something like
// "[PARENT ADDON NAME]-[EXTENSION NAME].js", to make sure that it would run after that addon ran.

const { combineStats, makeMenu, makeAura, makeDeco, LayeredBoss, weaponArray, makeRadialAuto, makeTurret, makeAuto } = require('../facilitators.js');
const { makeRelic, makeCrasher, makeLaby } = require('../facilitators.js');
const { makeRarities, makePresent } = require("../facilitators");
const { base, basePolygonDamage, basePolygonHealth, dfltskl, statnames } = require('../constants.js')
const g = require('../gunvals.js')
// This addon is disabled by default.
// You can also disable addons by not making them end with '.js'
// If you want to enable, simply make the line below just not run.
//return;
c = 299_792_458

let MAX_CHILDREN = 0,
	GUNS = [],
	TURRETS = [],

alreadySeen = [],
next = ['basic'],

// We don't loop infinitely, because that's a bad idea if someone makes a circular upgrade path.
// Also, RECURSION BAD. RECURSION BAD. RECURSION BAD. RECURSION BAD. RECURSION BAD. RECURSION BAD.
limit = 1000;
while (next.length && limit--) {
	let current = next;
	next = [];
	for (let i = 0; i < current.length; i++) {

		// Handle string definition references
		let now = ensureIsClass(current[i]);

		// Handles tanks with multiple ways to upgrade to them, like Overgunner.
		if (alreadySeen.includes(now.LABEL)) continue;
		alreadySeen.push(now.LABEL);

		// Add guns, turrets and additional max child count to our current list of stuff for our abomination to have.
		if (now.MAX_CHILDREN) MAX_CHILDREN += now.MAX_CHILDREN;
		if (now.GUNS) GUNS.push(...now.GUNS);
		if (now.TURRETS) TURRETS.push(...now.TURRETS);

		// Add upgrades of current tank to next iteration
		for (let key of Object.keys(now)) if (key.startsWith('UPGRADES_TIER_')) next.push(...now[key]);
	}
}
//Consts go here!
const baseScenexe = {
	FOV: base.FOV * 1.6
}

Class.SCENEXEsentryAutoTurret = {
	PARENT: 'autoTankGun',
	INDEPENDENT: true,
	GUNS: [{
		POSITION: { LENGTH: 25, WIDTH: 10 },
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.auto]),
			TYPE: 'bullet'
		}
	}]
}

Class.SCENEXEabysslingAutoTurret = {
	PARENT: 'autoTankGun',
	INDEPENDENT: true,
	GUNS: [{
		POSITION: { LENGTH: 25, WIDTH: 10 },
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.auto,g.pounder,g.pounder]),
			TYPE: 'bullet'
		}
	}]
}
//Special Entites
Class.abyssling = {
	PARENT: "genericTank",
	LABEL: "Abyssling",
	SHAPE: 6,
	SIZE: 34,
	COLOR: 3,
	BODY: {
		SPEED: 1.5,
		HEALTH: base.HEALTH * 55,
		DAMAGE: base.DAMAGE * 2.5,
		FOV: base.FOV * 1.5,
	},
	GUNS: [
	{
		POSITION: [20, 8, 1, 0, 0, 0, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.basic,g.pounder,g.destroyer]),
			TYPE: "bullet",
		},
	},
	{
		POSITION: [12, 5, 1, 0, 0, -60, 0],
	},
	{
		POSITION: [12, 5, 1, 0, 0, -120, 0],
	},
	{
		POSITION: [12, 5, 1, 0, 0, -180, 0],
	},
	{
		POSITION: [12, 5, 1, 0, 0, 120, 0],
	},
	{
		POSITION: [12, 5, 1, 0, 0, 60, 0],
	},
	{
		POSITION: [4, 5, 1.8, 10, 0, -60, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.basic,g.pounder,g.pounder,g.pounder]),
			TYPE: "agTrap",
		},
	},
	{
		POSITION: [4, 5, 1.8, 10, 0, -120, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.basic,g.pounder,g.pounder,g.pounder]),
			TYPE: "agTrap",
		},
	},
	{
		POSITION: [4, 5, 1.8, 10, 0, -180, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.basic,g.pounder,g.pounder,g.pounder]),
			TYPE: "agTrap",
		},
	},
	{
		POSITION: [4, 5, 1.8, 10, 0, 120, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.basic,g.pounder,g.pounder,g.pounder]),
			TYPE: "agTrap",
		},
	},
	{
		POSITION: [4, 5, 1.8, 10, 0, 60, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.basic,g.pounder,g.pounder,g.pounder]),
			TYPE: "agTrap",
		},
	},
	],
	TURRETS: [{
		POSITION: { SIZE: 8, LAYER: 1 },
		TYPE: 'SCENEXEabysslingAutoTurret'
	}]
	// Add rotating visual ring effect
}
for (let i = 0; i < 12; i++) {
	let spawnDelay = Math.random() * 252;
	if (spawnDelay < 20) spawnDelay = Math.random() * 4;

	Class.abyssling.GUNS.push({
		POSITION: [2, 4/3*3.2, 1, 0, 0, 360 / 60 * i, spawnDelay],
		PROPERTIES: {
			LAYER: 22,
			SHOOT_SETTINGS: combineStats([
				g.basic,
				{ shudder: 0, speed: 1.1, spray: 0, reload: 0.8, recoil: 0, range: 0.15 },
			]),
			SYNCS_SKILLS: true,
			AUTOFIRE: true,
			DRAW_FILL: false,
			BORDERLESS: true,
			NO_LIMITATIONS: true,
			TYPE: [
				"bullet",
				{
					NO_COLLISIONS: true,
					ALPHA: 0,
					ON: [{
						event: "tick",
						handler: ({ body }) => {
							if (body.alpha < 0.9) body.alpha += 0.06;
							else body.alpha = 0;
						}
					}]
				}
			],
		},
	});
}

//Special Weapons
Class.peacekeeper0 = {
	PARENT: "genericTank",
	LABEL: "Peacekeeper0",
	AI: {
		FULL_VIEW: true,
		SKYNET: true,
		BLIND: true,
		CHASE: true,
	},
	isRadiant: true,
	CONTROLLERS: [["nearestDifferentMaster", { lockThroughWalls: true }], "mapTargetToGoal"],
	COLOR: ['rainbow','trans'],
	SHAPE: 3,
	UPGRADES_TIER_7: [
		['peacekeeper1','crasher1']
	],
	GUNS: [
	{
		POSITION: [18, 8, 1, 0, 0, 0, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.basic]),
			TYPE: "bullet",
		},
	},
	{
		POSITION: [10, 8, 1.5, 0, 0, -180, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.basic]),
			TYPE: "setTrap",
		},
	},
	],
	TURRETS: [{
		POSITION: { SIZE: 8, LAYER: 1 },
		TYPE: 'SCENEXEsentryAutoTurret'
	}]
}
Class.peacekeeper1 = {
	PARENT: "genericTank",
	LABEL: "Peacekeeper1",
	AI: {
		FULL_VIEW: true,
		SKYNET: true,
		BLIND: true,
		CHASE: true,
	},
	isRadiant: true,
	CONTROLLERS: [["nearestDifferentMaster", { lockThroughWalls: true }], "mapTargetToGoal"],
	COLOR: ['rainbow','trans'],
	SHAPE: 3,
	UPGRADES_TIER_7: [
		"menu_tanks"
	],
	GUNS: [
		{
			POSITION: [18, 8, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic,g.pounder]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [10, 8, 1.5, 0, 0, -180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "setTrap",
			},
		},
	],
	TURRETS: [{
		POSITION: { SIZE: 8, LAYER: 1 },
		TYPE: 'SCENEXEsentryAutoTurret'
	}]
}
//Special Bodies
Class.crasher0 = {
	PARENT: "food",
	LABEL: "Crasher0",
	VALUE: 120,
	SHAPE: 3,
	SIZE: 1,
	BODY: {
		DAMAGE: 1,
		DENSITY: 6,
		HEALTH: 3 * basePolygonHealth,
		RESIST: 1.15,
		PENETRATION: 1.5,
		ACCELERATION: 1.18*2.4
	},
	DRAW_HEALTH: true,
		isRadiant: true,
};
Class.crasher1 = {
	PARENT: "food",
	LABEL: "Crasher1",
	VALUE: 120,
	SHAPE: 3,
	SIZE: 1,
	BODY: {
		DAMAGE: 1,
		DENSITY: 6,
		HEALTH: 13.3 * basePolygonHealth,
		RESIST: 1.15,
		PENETRATION: 1.5,
		ACCELERATION: 2*2.4,
		FOV: 25,
	},
	DRAW_HEALTH: true,
	isRadiant: true,
};
//What to set spawn class.
Config.SPAWN_CLASS = ['SCENEXEnode', 'SCENEXEbase']
//IMPORTANT DO NOT TOUCH!
Class.SCENEXEnode = {
	PARENT: 'genericTank',
	REROOT_UPGRADE_TREE: 'SCENEXEnode',
	LABEL: 'Node',
}
Class.SCENEXEbase = {
	PARENT: 'genericTank',
	REROOT_UPGRADE_TREE: 'SCENEXEbase',
	LABEL: 'Base',
	BODY: {
		FOV: baseScenexe.FOV
	},
}

// This adds the tank to the definitions and to the fun menu
Class.node = {
	PARENT: "genericTank",
	LABEL: "Node",
}

Class.mono = {
	PARENT: "genericTank",
	LABEL: "Mono-Base",
	GUNS: [
	{
		POSITION: [18, 8, 1, 0, 0, 0, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.basic]),
			TYPE: "bullet",
		},
	},
	],
}
Class.mono2 = {
	PARENT: "genericTank",
	LABEL: "Mono-Wall",
	SHAPE: 6,
	BODY: {
		HEALTH: 24
	},
	GUNS: [
		{
			POSITION: [18, 8, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "bullet",
			},
		},
	],
}
Class.mono3 = {
	PARENT: "genericTank",
	LABEL: "Mono-Smasher",
	BODY: {
		HEALTH: 20,
		SPEED: 1.2,
	},
	GUNS: [
		{
			POSITION: [18, 8, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "bullet",
			},
		},
	],
	TURRETS: [
		{
			POSITION: [21.5, 0, 0, 0, 360, 0],
			TYPE: "smasherBody"
		}
	]
}
//CELESTIALS
const scenCel = { HEALTH: 1500, DAMAGE: 8, REGEN: 0.025, SPEED: 1.8 };
Class.genericCel = Class.scenCel = {
	PARENT: ["genericTank"],
	LABEL: 'Nova-Celestial',
	SHAPE: 3, COLOR: 5, SIZE: 30,
	REROOT_UPGRADE_TREE: "scenCel",
	BODY: { ...scenCel },
	GUNS: [], TURRETS: []
};
Class.scenCelP = Class.scenCel = {
	PARENT: ["genericTank"],
	LABEL: 'Nova-Celestial',
	SHAPE: 3, COLOR: 5, SIZE: 30,
	REROOT_UPGRADE_TREE: "scenCel",
		EXTRA_SKILL: 18,
	BODY: { ...scenCel },
	GUNS: [], TURRETS: []
};
Class.pulsar = {
	PARENT: "genericCel",
	LABEL: "Pulsar-Celestial",
	TYPE: "tank",
	SHAPE: 3,
	DAMAGE_CLASS: 2,
	DANGER: 5,
	MOTION_TYPE: 'motor',
	FACING_TYPE: 'toTarget',
	SIZE: 30,
	MAX_CHILDREN: 0,
	DAMAGE_EFFECTS: false,
	COLOR: 5,
		BODY: { ...scenCel },
	GUNS: [
	{
		POSITION: [8, 5, 1, 4, -3.5, -60, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.pulsar]),
			TYPE: "bullet",
		},
	},
	{
		POSITION: [8, 5, 1, 4, 3.5, -60, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.pulsar]),
			TYPE: "bullet",
		},
	},
	{
		POSITION: [8, 5, 1, 4, 3.5, -180, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.pulsar]),
			TYPE: "bullet",
		},
	},
	{
		POSITION: [8, 5, 1, 4, 3.5, 60, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.pulsar]),
			TYPE: "bullet",
		},
	},
	{
		POSITION: [8, 5, 1, 4, -3.5, -180, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.pulsar]),
			TYPE: "bullet",
		},
	},
	{
		POSITION: [8, 5, 1, 4, -3.5, 60, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.pulsar]),
			TYPE: "bullet",
		},
	},
	],
}
Class.pulsar2 = {
	PARENT: "genericCel",
	LABEL: "Pulsar-Chasm",
	TYPE: "tank",
	SHAPE: 3,
	DAMAGE_CLASS: 2,
	DANGER: 5,
	MOTION_TYPE: 'motor',
	FACING_TYPE: 'toTarget',
	SIZE: 30,
	MAX_CHILDREN: 0,
	DAMAGE_EFFECTS: false,
	COLOR: 5,
		BODY: { SPEED: 1, ...scenCel },
		GUNS: [
			{
				POSITION: [8, 5, 1, 4, -3.5, -60, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.pulsar]),
					TYPE: "bullet",
				},
			},
			{
				POSITION: [8, 5, 1, 4, 3.5, -60, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.pulsar]),
					TYPE: "bullet",
				},
			},
			{
				POSITION: [8, 5, 1, 4, 3.5, -180, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.pulsar]),
					TYPE: "bullet",
				},
			},
			{
				POSITION: [8, 5, 1, 4, 3.5, 60, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.pulsar]),
					TYPE: "bullet",
				},
			},
			{
				POSITION: [8, 5, 1, 4, -3.5, -180, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.pulsar]),
					TYPE: "bullet",
				},
			},
			{
				POSITION: [8, 5, 1, 4, -3.5, 60, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.pulsar]),
					TYPE: "bullet",
				},
			},
		],
	PROPS: [{
		POSITION: [22, 0, 0, 0, 1],
		TYPE: "celetriangle"
	},
		{
			POSITION: [18, 0, 0, 0, 1],
			TYPE: "crasher"
		},		{
			POSITION: [10, 0, 0, 0, 1],
			TYPE: "crasher"
		},
	]
}
Class.pulsar3 = {
	PARENT: "genericCel",
	LABEL: "Pulsar-Exosphere",
	TYPE: "tank",
	SHAPE: 3,
	DAMAGE_CLASS: 2,
	DANGER: 5,
	MOTION_TYPE: 'motor',
	FACING_TYPE: 'toTarget',
	SIZE: 30,
	MAX_CHILDREN: 0,
	DAMAGE_EFFECTS: false,
	COLOR: 5,
	BODY: { SPEED: 1, ...scenCel },
	GUNS: [
		{
			POSITION: [8, 5, 1, 4, -3.5, -60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [8, 5, 1, 4, 3.5, -60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [8, 5, 1, 4, 3.5, -180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [8, 5, 1, 4, 3.5, 60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [8, 5, 1, 4, -3.5, -180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [8, 5, 1, 4, -3.5, 60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
	],
	TURRETS: [
		...weaponArray({
			POSITION: [3.5, 9.5, 0, 120, 180, 2],
			TYPE: "trinoughtSmallAura",
		}, 3),
		{
			POSITION: [8.5, 0, 0, 0, 360, 2],
			TYPE: "trinoughtBigAura",
		},
	],
	PROPS: [
	{
		POSITION: [10, 0, 0, 0, 1],
		TYPE: "crasher"
	}
	]
}
Class.pulsar4 = {
	PARENT: "genericCel",
	LABEL: "Pulsar-Corvus",
	TYPE: "tank",
	SHAPE: 3,
	DAMAGE_CLASS: 2,
	DANGER: 5,
	MOTION_TYPE: 'motor',
	FACING_TYPE: 'toTarget',
	SIZE: 30,
	MAX_CHILDREN: 0,
	DAMAGE_EFFECTS: false,
	COLOR: 5,
	BODY: { SPEED: 1, ...scenCel },
	GUNS: [
		{
			POSITION: [8, 5, 1, 4, -3.5, -60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [8, 5, 1, 4, 3.5, -60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [8, 5, 1, 4, 3.5, -180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [8, 5, 1, 4, 3.5, 60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [8, 5, 1, 4, -3.5, -180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [8, 5, 1, 4, -3.5, 60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
	],
	TURRETS: [
		{
			POSITION: [11, 0, 0, 0, 360, 2],
			TYPE: "thermosphereAuraOfficialV2",
		},
	],
	PROPS: [
		{
			POSITION: [10, 0, 0, 0, 1],
			TYPE: "crasher"
		}
	]
}
Class.pulsar5 = {
	PARENT: "genericCel",
	LABEL: "Pulsar-Nebula",
	TYPE: "tank",
	SHAPE: 3,
	DAMAGE_CLASS: 2,
	DANGER: 5,
	MOTION_TYPE: 'motor',
	FACING_TYPE: 'toTarget',
	SIZE: 30,
	MAX_CHILDREN: 0,
	DAMAGE_EFFECTS: false,
	COLOR: 5,
	BODY: { SPEED: 1, ...scenCel },
	GUNS: [
		{
			POSITION: [8, 5, 1, 4, -3.5, -60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [8, 5, 1, 4, 3.5, -60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [8, 5, 1, 4, 3.5, -180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [8, 5, 1, 4, 3.5, 60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [8, 5, 1, 4, -3.5, -180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [8, 5, 1, 4, -3.5, 60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
	],
	TURRETS: [
		{
			POSITION: [7, 0, 0, 0, 360, 2],
			TYPE: "bigAutoTankGun",
		}, 		...weaponArray({
			POSITION: [3.5, 10.5, 0, 120, 180, 2],
			TYPE: "autoTankGun",
		}, 3),
	],
	PROPS: [
		{
			POSITION: [10, 0, 0, 0, 1],
			TYPE: "crasher"
		}
	]
}
Class.celetriangle = {
	SHAPE: 3,
	SIZE: 10,
	COLOR: "#5F676C",
	BODY: {
		DAMAGE: basePolygonDamage,
		DENSITY: 6,
		HEALTH: 3 * basePolygonHealth,
		RESIST: 1.15,
		PENETRATION: 1.5,
		ACCELERATION: 0.005
	},
	DRAW_HEALTH: true,
};
Class.satellite = {
	PARENT: "genericCel",
	LABEL: "Satellite-Celestial",
	TYPE: "tank",
	SHAPE: 3,
	DAMAGE_CLASS: 2,
	DANGER: 5,
	MOTION_TYPE: 'motor',
	FACING_TYPE: 'toTarget',
	SIZE: 30,
	MAX_CHILDREN: 0,
	DAMAGE_EFFECTS: false,
	COLOR: 5,
	GUNS: [
	{
		POSITION: [12, 4, 1.4, 0, 0, -60, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.basic]),
			TYPE: "drone", MAX_CHILDREN: 3,
		},
	},
	{
		POSITION: [12, 4, 1.4, 0, 0, -180, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.basic]),
			TYPE: "drone", MAX_CHILDREN: 3,
		},
	},
	{
		POSITION: [12, 4, 1.4, 0, 0, 60, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.basic]),
			TYPE: "drone", MAX_CHILDREN: 3,
		},
	},
	{
		POSITION: [10, 1, 1.4, 0, -5, -60, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.basic]),
			TYPE: "drone", MAX_CHILDREN: 3,
		},
	},
	{
		POSITION: [10, 1, 1.4, 0, -5, -180, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.basic]),
			TYPE: "drone", MAX_CHILDREN: 3,
		},
	},
	{
		POSITION: [10, 1, 1.4, 0, -5, 60, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.basic]),
			TYPE: "drone", MAX_CHILDREN: 3,
		},
	},
	{
		POSITION: [10, 1, 1.4, 0, 5, 60, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.basic]),
			TYPE: "drone", MAX_CHILDREN: 3,
		},
	},
	{
		POSITION: [10, 1, 1.4, 0, 5, -180, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.basic]),
			TYPE: "drone", MAX_CHILDREN: 3,
		},
	},
	{
		POSITION: [10, 1, 1.4, 0, 5, -60, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.basic]),
			TYPE: "drone", MAX_CHILDREN: 3,
		},
	},
	],
}
Class.satellite2 = {
	PARENT: "genericCel",
	LABEL: "Satellite-Chasm",
	TYPE: "tank",
	SHAPE: 3,
	DAMAGE_CLASS: 2,
	DANGER: 5,
	MOTION_TYPE: 'motor',
	FACING_TYPE: 'toTarget',
	SIZE: 30,
	MAX_CHILDREN: 0,
	DAMAGE_EFFECTS: false,
	COLOR: 5,
	GUNS: [
		{
			POSITION: [12, 4, 1.4, 0, 0, -60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "drone", MAX_CHILDREN: 3,
			},
		},
		{
			POSITION: [12, 4, 1.4, 0, 0, -180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "drone", MAX_CHILDREN: 3,
			},
		},
		{
			POSITION: [12, 4, 1.4, 0, 0, 60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "drone", MAX_CHILDREN: 3,
			},
		},
		{
			POSITION: [10, 1, 1.4, 0, -5, -60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "drone", MAX_CHILDREN: 3,
			},
		},
		{
			POSITION: [10, 1, 1.4, 0, -5, -180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "drone", MAX_CHILDREN: 3,
			},
		},
		{
			POSITION: [10, 1, 1.4, 0, -5, 60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "drone", MAX_CHILDREN: 3,
			},
		},
		{
			POSITION: [10, 1, 1.4, 0, 5, 60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "drone", MAX_CHILDREN: 3,
			},
		},
		{
			POSITION: [10, 1, 1.4, 0, 5, -180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "drone", MAX_CHILDREN: 3,
			},
		},
		{
			POSITION: [10, 1, 1.4, 0, 5, -60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "drone", MAX_CHILDREN: 3,
			},
		},
	],
	PROPS: [{
		POSITION: [22, 0, 0, 0, 1],
		TYPE: "celetriangle"
	},
	{
		POSITION: [18, 0, 0, 0, 1],
		TYPE: "crasher"
	},		{
		POSITION: [10, 0, 0, 0, 1],
		TYPE: "crasher"
	},
	]
}
Class.satellite3 = {
	PARENT: "genericCel",
	LABEL: "Satellite-Exosphere",
	TYPE: "tank",
	SHAPE: 3,
	DAMAGE_CLASS: 2,
	DANGER: 5,
	MOTION_TYPE: 'motor',
	FACING_TYPE: 'toTarget',
	SIZE: 30,
	MAX_CHILDREN: 0,
	DAMAGE_EFFECTS: false,
	COLOR: 5,
	GUNS: [
		{
			POSITION: [12, 4, 1.4, 0, 0, -60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "drone", MAX_CHILDREN: 3,
			},
		},
		{
			POSITION: [12, 4, 1.4, 0, 0, -180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "drone", MAX_CHILDREN: 3,
			},
		},
		{
			POSITION: [12, 4, 1.4, 0, 0, 60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "drone", MAX_CHILDREN: 3,
			},
		},
		{
			POSITION: [10, 1, 1.4, 0, -5, -60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "drone", MAX_CHILDREN: 3,
			},
		},
		{
			POSITION: [10, 1, 1.4, 0, -5, -180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "drone", MAX_CHILDREN: 3,
			},
		},
		{
			POSITION: [10, 1, 1.4, 0, -5, 60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "drone", MAX_CHILDREN: 3,
			},
		},
		{
			POSITION: [10, 1, 1.4, 0, 5, 60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "drone", MAX_CHILDREN: 3,
			},
		},
		{
			POSITION: [10, 1, 1.4, 0, 5, -180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "drone", MAX_CHILDREN: 3,
			},
		},
		{
			POSITION: [10, 1, 1.4, 0, 5, -60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "drone", MAX_CHILDREN: 3,
			},
		},
	],
	TURRETS: [
		...weaponArray({
			POSITION: [3.5, 9.5, 0, 120, 180, 2],
			TYPE: "trinoughtSmallAura",
		}, 3),
		{
			POSITION: [8.5, 0, 0, 0, 360, 2],
			TYPE: "trinoughtBigAura",
		},
	],
	PROPS: [
		{
			POSITION: [10, 0, 0, 0, 1],
			TYPE: "crasher"
		}
	]
}
Class.satellite4 = {
	PARENT: "genericCel",
	LABEL: "Satellite-Corvus",
	TYPE: "tank",
	SHAPE: 3,
	DAMAGE_CLASS: 2,
	DANGER: 5,
	MOTION_TYPE: 'motor',
	FACING_TYPE: 'toTarget',
	SIZE: 30,
	MAX_CHILDREN: 0,
	DAMAGE_EFFECTS: false,
	COLOR: 5,
	GUNS: [
		{
			POSITION: [12, 4, 1.4, 0, 0, -60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "drone", MAX_CHILDREN: 3,
			},
		},
		{
			POSITION: [12, 4, 1.4, 0, 0, -180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "drone", MAX_CHILDREN: 3,
			},
		},
		{
			POSITION: [12, 4, 1.4, 0, 0, 60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "drone", MAX_CHILDREN: 3,
			},
		},
		{
			POSITION: [10, 1, 1.4, 0, -5, -60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "drone", MAX_CHILDREN: 3,
			},
		},
		{
			POSITION: [10, 1, 1.4, 0, -5, -180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "drone", MAX_CHILDREN: 3,
			},
		},
		{
			POSITION: [10, 1, 1.4, 0, -5, 60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "drone", MAX_CHILDREN: 3,
			},
		},
		{
			POSITION: [10, 1, 1.4, 0, 5, 60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "drone", MAX_CHILDREN: 3,
			},
		},
		{
			POSITION: [10, 1, 1.4, 0, 5, -180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "drone", MAX_CHILDREN: 3,
			},
		},
		{
			POSITION: [10, 1, 1.4, 0, 5, -60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "drone", MAX_CHILDREN: 3,
			},
		},
	],
	TURRETS: [
		{
			POSITION: [11, 0, 0, 0, 360, 2],
			TYPE: "thermosphereAuraOfficialV2",
		},
	],
	PROPS: [
		{
			POSITION: [10, 0, 0, 0, 1],
			TYPE: "crasher"
		}
	]
}
Class.satellite5 = {
	PARENT: "genericCel",
	LABEL: "Satellite-Nebula",
	TYPE: "tank",
	SHAPE: 3,
	DAMAGE_CLASS: 2,
	DANGER: 5,
	MOTION_TYPE: 'motor',
	FACING_TYPE: 'toTarget',
	SIZE: 30,
	MAX_CHILDREN: 0,
	DAMAGE_EFFECTS: false,
	COLOR: 5,
	GUNS: [
		{
			POSITION: [12, 4, 1.4, 0, 0, -60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "drone", MAX_CHILDREN: 3,
			},
		},
		{
			POSITION: [12, 4, 1.4, 0, 0, -180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "drone", MAX_CHILDREN: 3,
			},
		},
		{
			POSITION: [12, 4, 1.4, 0, 0, 60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "drone", MAX_CHILDREN: 3,
			},
		},
		{
			POSITION: [10, 1, 1.4, 0, -5, -60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "drone", MAX_CHILDREN: 3,
			},
		},
		{
			POSITION: [10, 1, 1.4, 0, -5, -180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "drone", MAX_CHILDREN: 3,
			},
		},
		{
			POSITION: [10, 1, 1.4, 0, -5, 60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "drone", MAX_CHILDREN: 3,
			},
		},
		{
			POSITION: [10, 1, 1.4, 0, 5, 60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "drone", MAX_CHILDREN: 3,
			},
		},
		{
			POSITION: [10, 1, 1.4, 0, 5, -180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "drone", MAX_CHILDREN: 3,
			},
		},
		{
			POSITION: [10, 1, 1.4, 0, 5, -60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "drone", MAX_CHILDREN: 3,
			},
		},
	],
	TURRETS: [
		{
			POSITION: [7, 0, 0, 0, 360, 2],
			TYPE: "bigAutoTankGun",
		}, 		...weaponArray({
			POSITION: [3.5, 10.5, 0, 120, 180, 2],
			TYPE: "autoTankGun",
		}, 3),
	],
	PROPS: [
		{
			POSITION: [10, 0, 0, 0, 1],
			TYPE: "crasher"
		}
	]
}
Class.blasar = {
	PARENT: "genericCel",
	LABEL: "Blasar",
	SHAPE: 3,
	SIZE: 30,
	COLOR: 5,
	GUNS: [
		{
			POSITION: [12, 5, 1, 0, 0, -60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [12, 5, 1, 0, 0, -180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [12, 5, 1, 0, 0, 60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [10, 5, 1, 0, -4, -60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [10, 5, 1, 0, -4, 180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [10, 5, 1, 0, 4, -60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [10, 5, 1, 0, 4, 180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [10, 5, 1, 0, 4, 60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [10, 5, 1, 0, -4, 60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
	],
}
Class.blasar2 = {
	PARENT: "genericCel",
	LABEL: "Blasar-Chasm",
	SHAPE: 3,
	SIZE: 30,
	COLOR: 5,
	GUNS: [
		{
			POSITION: [12, 5, 1, 0, 0, -60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [12, 5, 1, 0, 0, -180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [12, 5, 1, 0, 0, 60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [10, 5, 1, 0, -4, -60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [10, 5, 1, 0, -4, 180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [10, 5, 1, 0, 4, -60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [10, 5, 1, 0, 4, 180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [10, 5, 1, 0, 4, 60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [10, 5, 1, 0, -4, 60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
	],
	PROPS: [{
		POSITION: [22, 0, 0, 0, 1],
		TYPE: "celetriangle"
	},
	{
		POSITION: [18, 0, 0, 0, 1],
		TYPE: "crasher"
	},		{
		POSITION: [10, 0, 0, 0, 1],
		TYPE: "crasher"
	},
	]
}
Class.blasar3 = {
	PARENT: "genericCel",
	LABEL: "Blasar-Exosphere",
	SHAPE: 3,
	SIZE: 30,
	COLOR: 5,
	GUNS: [
		{
			POSITION: [12, 5, 1, 0, 0, -60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [12, 5, 1, 0, 0, -180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [12, 5, 1, 0, 0, 60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [10, 5, 1, 0, -4, -60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [10, 5, 1, 0, -4, 180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [10, 5, 1, 0, 4, -60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [10, 5, 1, 0, 4, 180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [10, 5, 1, 0, 4, 60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [10, 5, 1, 0, -4, 60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
	],
	TURRETS: [
		...weaponArray({
			POSITION: [3.5, 9.5, 0, 120, 180, 2],
			TYPE: "trinoughtSmallAura",
		}, 3),
		{
			POSITION: [8.5, 0, 0, 0, 360, 2],
			TYPE: "trinoughtBigAura",
		},
	],
	PROPS: [
		{
			POSITION: [10, 0, 0, 0, 1],
			TYPE: "crasher"
		}
	]
}
Class.blasar4 = {
	PARENT: "genericCel",
	LABEL: "Blasar-Corvus",
	SHAPE: 3,
	SIZE: 30,
	COLOR: 5,
	GUNS: [
		{
			POSITION: [12, 5, 1, 0, 0, -60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [12, 5, 1, 0, 0, -180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [12, 5, 1, 0, 0, 60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [10, 5, 1, 0, -4, -60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [10, 5, 1, 0, -4, 180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [10, 5, 1, 0, 4, -60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [10, 5, 1, 0, 4, 180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [10, 5, 1, 0, 4, 60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [10, 5, 1, 0, -4, 60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
	],
	TURRETS: [
		{
			POSITION: [11, 0, 0, 0, 360, 2],
			TYPE: "thermosphereAuraOfficialV2",
		},
	],
	PROPS: [
		{
			POSITION: [10, 0, 0, 0, 1],
			TYPE: "crasher"
		}
	]
}
Class.blasar5 = {
	PARENT: "genericCel",
	LABEL: "Blasar-Nebula",
	SHAPE: 3,
	SIZE: 30,
	COLOR: 5,
	GUNS: [
		{
			POSITION: [12, 5, 1, 0, 0, -60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [12, 5, 1, 0, 0, -180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [12, 5, 1, 0, 0, 60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [10, 5, 1, 0, -4, -60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [10, 5, 1, 0, -4, 180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [10, 5, 1, 0, 4, -60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [10, 5, 1, 0, 4, 180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [10, 5, 1, 0, 4, 60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [10, 5, 1, 0, -4, 60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
	],
	TURRETS: [
		{
			POSITION: [7, 0, 0, 0, 360, 2],
			TYPE: "bigAutoTankGun",
		}, 		...weaponArray({
			POSITION: [3.5, 10.5, 0, 120, 180, 2],
			TYPE: "autoTankGun",
		}, 3),
	],
	PROPS: [
		{
			POSITION: [10, 0, 0, 0, 1],
			TYPE: "crasher"
		}
	]
}
Class.bv = {
	PARENT: "genericCel",
	LABEL: "Blasar-Void",
	SHAPE: 3,
	SIZE: 30,
	COLOR: 5,
	BODY: {HEALTH: 2500, DAMAGE: 8, REGEN: 0.025, SPEED: 1.4},
	GUNS: [
		{
			POSITION: [12, 5, 1, 0, 0, -60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [12, 5, 1, 0, 0, -180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [12, 5, 1, 0, 0, 60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [10, 5, 1, 0, -4, -60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [10, 5, 1, 0, -4, 180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [10, 5, 1, 0, 4, -60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [10, 5, 1, 0, 4, 180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [10, 5, 1, 0, 4, 60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [10, 5, 1, 0, -4, 60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.pulsar]),
				TYPE: "bullet",
			},
		},
	],
	PROPS: [{
		POSITION: [22, 0, 0, 0, 1],
		TYPE: "celetriangle"
	},
	{
		POSITION: [18, 0, 0, 0, 1],
		TYPE: "crasher"
	},		{
		POSITION: [10, 0, 0, 0, 1],
		TYPE: "crasher"
	},{
		POSITION: [5, 0, 0, 0, 1],
		TYPE: "crasher"
	},
	]
}
Class.portal = {
	PARENT: "genericTank",
	LABEL: "Wormhole",
	COLOR: 19,
}
Class.primeCelestial = {
	PARENT: "genericTank",
	LABEL: "Prime Celestial",
	SHAPE: 3,
	SIZE: 445,
	LEVEL: 233,
	COLOR: 5,
		BODY: { HEALTH: 8e12, DAMAGE: 5e9 },
	PROPS: [		{
		POSITION: [14, 0, 0, 0, 1],
		TYPE: ['triangle', {COLOR: 9}]
	}, {
		POSITION: [24, 0, 0, 0, 0],
		TYPE: ['triangle', {COLOR: 9}]
	},
	{
		POSITION: [12, 0, 0, 0, 1],
		TYPE: ['crasher', {COLOR: 9}]
	}, {
		POSITION: [10, 0, 0, 0, 1],
		TYPE: ['triangle', {COLOR: 9}]
	},],
	GUNS: [
		{
			POSITION: [8, 8, 2, 1, 0, -60, 0],
		},
		{
			POSITION: [8, 8, 2, 1, 0, -180, 0],
		},
		{
			POSITION: [8, 8, 2, 1, 0, 60, 0],
		},
		{
			POSITION: [1, 12, 0.5, 12, 0, -60, 0],
		},
		{
			POSITION: [1, 12, 0.5, 12, 0, -180, 0],
		},
		{
			POSITION: [1, 12, 0.5, 12, 0, 60, 0],
		},
		{
			POSITION: [2, 12, 1.4, 7, 0, -60, 0],
		},
		{
			POSITION: [2, 12, 1.4, 7, 0, -180, 0],
		},
		{
			POSITION: [2, 12, 1.4, 7, 0, 60, 0],
		},
		{
			POSITION: [3, 2, 0.7, 6, 7, 60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic,g.pounder,g.destroyer]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [3, 2, 0.7, 6, 7, -180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic,g.pounder,g.destroyer]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [3, 2, 0.7, 6, 7, -60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic,g.pounder,g.destroyer]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [3, 2, 0.7, 6, -7, -60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic,g.pounder,g.destroyer]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [3, 2, 0.7, 6, -7, 180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic,g.pounder,g.destroyer]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [3, 2, 0.7, 6, -7, 60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic,g.pounder,g.destroyer]),
				TYPE: "bullet",
			},
		},
	],
}
/*
 *  ----------------------------------------------------------------
 *  `scenexe.js` IS ENABLED BY DEFAULT
 *  You can disable it by uncommenting line 48
 *
 *  Additionally c.SPAWN_CLASS is Node-Base by default
 *  You can disable it by commenting line 53
 *
 *  THIS IS STILL IN BETA!
 *  THIS IS STILL IN BETA!
 *  THIS IS STILL IN BETA!
 *  ----------------------------------------------------------------
 */



addHearth = (damageFactor = 1, sizeFactor = 1, opacity = 0.3, auraColor) => {
	let isHeal = damageFactor < 0;
	let auraType = isHeal ? "healAura" : "aura";
	auraColor = auraColor ?? (isHeal ? 'lime' : 'red');
	return {
		PARENT: ["genericTank"],
		INDEPENDENT: true,
		LABEL: "",
		COLOR: 'gray',
		GUNS: [
			{
				POSITION: [0, 20, 1, 0, 0, 0, 0,],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.aura, { size: sizeFactor, damage: damageFactor }]),
					TYPE: [auraType, { COLOR: auraColor, ALPHA: opacity }],
					MAX_CHILDREN: 1,
					AUTOFIRE: true,
					SYNCS_SKILLS: true,
				},
			},
		],
		TURRETS: [
			{
				POSITION: [8.5, 0, 0, 0, 360, 1],
				TYPE: ['genericEntity', { COLOR: auraColor, INDEPENDENT: true }],
			},
		]
	};
}

/**
 *
 * @param {Object} params
 * @param {import("../../../..").Tanks} params.Class
 */
module.exports = ({ Config }) => {

	//return console.log('Addon [scenexe.js] is disabled')

	Config.SPAWN_CLASS = ['SCENEXEnode', 'SCENEXEbase']
	Class.SCENEXEnode = {
		PARENT: 'genericTank',
		REROOT_UPGRADE_TREE: 'SCENEXEnode',
		LABEL: 'Node',
	}
	Class.SCENEXEbase = {
		PARENT: 'genericTank',
		REROOT_UPGRADE_TREE: 'SCENEXEbase',
		LABEL: 'Base',
		BODY: {
			FOV: baseScenexe.FOV
		},
	}

	// -------------------------------------------------------------------
	// -----------------------------WEAPONS-------------------------------
	// -------------------------------------------------------------------
	// MONO BRANCH
	Class.SCENEXEmono = {
		PARENT: 'SCENEXEnode',
		LABEL: 'Mono',
		GUNS: [{
			POSITION: { LENGTH: 20, WIDTH: 10 },
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: 'bullet'
			}
		}]
	}

	Class.SCENEXEduo = {
		PARENT: 'SCENEXEnode',
		LABEL: 'Duo',
		GUNS: [{
			POSITION: { LENGTH: 20, WIDTH: 8, Y: 5.1 },
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
				TYPE: 'bullet'
			}
		}, {
			POSITION: { LENGTH: 20, WIDTH: 8, Y: -5.1, DELAY: 0.5 },
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
				TYPE: 'bullet'
			}
		}]
	}
	Class.SCENEXEtrio = {
		PARENT: "SCENEXEnode",
		LABEL: "Trio",
		GUNS: [
		{
			POSITION: { LENGTH: 18, WIDTH: 8, Y: 5, DELAY: 0.5 },
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic,g.twin]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: { LENGTH: 18, WIDTH: 8, Y: -5, DELAY: 0.5 },
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic,g.twin]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [22, 8, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic,g.twin]),
				TYPE: "bullet",
			},
		},
		],
	}


	Class.SCENEXEflank = {
		PARENT: 'SCENEXEnode',
		LABEL: 'Flank',
		GUNS: [{
			POSITION: { LENGTH: 20, WIDTH: 9.5 },
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flank]),
				TYPE: 'bullet'
			}
		}, {
			POSITION: { LENGTH: 15, WIDTH: 9.5, ANGLE: 180 },
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flank]),
				TYPE: 'bullet'
			}
		}]
	}

	Class.SCENEXEsplit = {
		PARENT: 'SCENEXEnode',
		LABEL: 'Split',
		GUNS: [
			{
				POSITION: { LENGTH: 15, WIDTH: 5, ANGLE: 35, DELAY: 0.5 },
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, {damage: 0.75, pen: 1.15 }]),
					TYPE: 'bullet'
				}
			},
			{
				POSITION: { LENGTH: 15, WIDTH: 5, ANGLE: -35, DELAY: 1 },
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, { damage: 0.75, pen: 1.15 }]),
					TYPE: 'bullet'
				}
			},
			{...Class.SCENEXEmono.GUNS[0]},
		]
	}

	Class.SCENEXEsingle = {
		PARENT: 'SCENEXEnode',
		LABEL: 'Single',
		GUNS: [{
			POSITION: { LENGTH: 21.5, WIDTH: 12.5 },
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pound]),
				TYPE: 'bullet'
			}
		}]
	}

	/*
	 *        Class.alloy = { under SCENEXEcommander }
	 */

	/*
	 *        Class.guard = { under SCENEXEtrapper }
	 */

	Class.SCENEXEsniper = {
		PARENT: 'SCENEXEnode',
		LABEL: 'Sniper',
		BODY: {
			FOV: baseScenexe.FOV * 1.1
		},
		GUNS: [{
			POSITION: { LENGTH: 25, WIDTH: 9.5 },
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.sniper]),
				TYPE: 'bullet'
			}
		}]
	}

	// COMMANDER BRANCH

	Class.SCENEXEcommander = {
		PARENT: 'SCENEXEnode',
		LABEL: 'Commander',
		GUNS: [{
			POSITION: { LENGTH: 20, WIDTH: 9.5, ASPECT: -0.5, X: -4 },
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.drone]),
				TYPE: 'drone',
				MAX_CHILDREN: 3,
				SYNCS_SKILLS: true
			}
		}]
	}

	Class.SCENEXEdirector = {
		PARENT: 'SCENEXEnode',
		LABEL: 'Director',
		GUNS: [{
			POSITION: { LENGTH: 25, WIDTH: 14.5, ASPECT: -0.5, X: -4 },
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.drone, {damage: 2, reload: 1.15, pen: 2}]),
				TYPE: 'drone',
				MAX_CHILDREN: 3,
				SYNCS_SKILLS: true
			}
		}]
	}

	Class.SCENEXEoverseer = {
		PARENT: 'SCENEXEnode',
		LABEL: 'Overseer',
		GUNS: [
			{
				POSITION: { ...Class.SCENEXEcommander.GUNS[0].POSITION },
				PROPERTIES: { ...Class.SCENEXEcommander.GUNS[0].PROPERTIES, MAX_CHILDREN: 4 },
			},
			{
				POSITION: {...Class.SCENEXEcommander.GUNS[0].POSITION, ANGLE: 180},
				PROPERTIES: {...Class.SCENEXEcommander.GUNS[0].PROPERTIES, MAX_CHILDREN: 4},
			},
		]
	}

	Class.SCENEXEalloy = {
		PARENT: 'SCENEXEnode',
		LABEL: 'Alloy',
		GUNS: [
			{ ...Class.SCENEXEmono.GUNS[0] },
			{
				POSITION: { ...Class.SCENEXEcommander.GUNS[0].POSITION, ANGLE: 180 },
				PROPERTIES: {...Class.SCENEXEcommander.GUNS[0].PROPERTIES}
			}
		]
	}

	/*
	 *        Class.SCENEXEfusion = { under SCENEXEtrapper }
	 */

	// TRAPPER BRANCH

	Class.SCENEXEtrap = {
		PARENT: 'trap',
		SHAPE: 4,
		FACING_TYPE: 'withMotion',
		BODY: {
			HEALTH: 5
		}
	}

	Class.SCENEXEtrapper = {
		PARENT: 'SCENEXEnode',
		LABEL: 'Trapper',
		GUNS: [{
			POSITION: { LENGTH: 5, WIDTH: 12, ASPECT: -0.4, X: 15 },
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, { reload: 1.4, damage: 0.8, speed: 0.35, pen: 2, size: 1.1 }]),
				TYPE: 'SCENEXEtrap'
			}
		}, {
			POSITION: { LENGTH: 15, WIDTH: 6 }
		}]
	}

	Class.SCENEXEgamma = {
		PARENT: 'SCENEXEnode',
		LABEL: 'Gamma',
		GUNS: [{
			POSITION: { LENGTH: 5, WIDTH: 14, ASPECT: -0.4, X: 15 },
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, { reload: 1.6, damage: 2, speed: 0.2, pen: 1.5, size: 1.25 }]),
				TYPE: 'SCENEXEtrap'
			}
		}, {
			POSITION: { LENGTH: 15, WIDTH: 8 }
		}]
	}

	Class.SCENEXEblockade = {
		PARENT: 'SCENEXEnode',
		LABEL: 'Blockade',
		GUNS: [
			{...Class.SCENEXEtrapper.GUNS[0]},
			{
				POSITION: {...Class.SCENEXEtrapper.GUNS[0].POSITION, ANGLE: 180},
				PROPERTIES: {...Class.SCENEXEtrapper.GUNS[0].PROPERTIES}
			},
			{ ...Class.SCENEXEtrapper.GUNS[1] },
			{
				POSITION: { ...Class.SCENEXEtrapper.GUNS[1].POSITION, ANGLE: 180 },
			}
		]
	}

	Class.SCENEXErubble = {
		PARENT: 'SCENEXEnode',
		LABEL: 'Rubble',
		GUNS: (() => {
			let output = []
			for (let i = 0; i < 4; i++) output.push({
				POSITION: { LENGTH: 3, WIDTH: 9, ASPECT: -0.4, X: 12, ANGLE: (360/4)*i },
													PROPERTIES: {
														SHOOT_SETTINGS: combineStats([g.trap, { reload: 1.4, damage: 0.5, speed: 0.35, pen: 2, size: 1.1 }]),
													TYPE: 'SCENEXEtrap'
													}
			}, {
				POSITION: { LENGTH: 12, WIDTH: 4, ANGLE: (360/4)*i }
			})
				return output
		})()
	}

	Class.SCENEXEfusion = {
		PARENT: 'SCENEXEnode',
		LABEL: 'Fusion',
		GUNS: [
			{ ...Class.SCENEXEtrapper.GUNS[0] },
			{ ...Class.SCENEXEtrapper.GUNS[1] },
			{
				POSITION: { ...Class.SCENEXEcommander.GUNS[0].POSITION, ANGLE: 180 },
				PROPERTIES: { ...Class.SCENEXEcommander.GUNS[0].PROPERTIES }
			}
		]
	}

	Class.SCENEXEguard = {
		PARENT: 'SCENEXEnode',
		LABEL: 'Guard',
		GUNS: [
			{ ...Class.SCENEXEmono.GUNS[0] },
			{
				POSITION: { ...Class.SCENEXEtrapper.GUNS[0].POSITION, ANGLE: 180 },
				PROPERTIES: {...Class.SCENEXEtrapper.GUNS[0].PROPERTIES}
			},
			{
				POSITION: { ...Class.SCENEXEtrapper.GUNS[1].POSITION, ANGLE: 180 },
			}
		]
	}

	// -------------------------------------------------------------------
	// -----------------------------BODIES-------------------------------
	// -------------------------------------------------------------------
	Class.SCENEXEsmasher = {
		PARENT: 'SCENEXEbase',
		LABEL: 'Smasher',
		BODY: {...Class.smasher.BODY},
		TURRETS: [{
			POSITION: { SIZE: 26 },
			TYPE: 'smasherBody'
		}],
	}

	Class.SCENEXEsentry = {
		PARENT: 'SCENEXEbase',
		LABEL: 'Sentry',
		TURRETS: [{
			POSITION: { SIZE: 8, LAYER: 1 },
			TYPE: 'SCENEXEsentryAutoTurret'
		}]
	}

	Class.SCENEXEwall = {
		PARENT: 'SCENEXEbase',
		LABEL: 'Wall',
		BODY: {
			HEALTH: base.HEALTH * 1.75,
			SPEED: base.SPEED * 0.2
		},
		TURRETS: [{ POSITION: { SIZE: 21, LAYER: 1 }, TYPE: ['hexagon', { COLOR: -1, MIRROR_MASTER_ANGLE: true }] }]
	}

	Class.SCENEXEhearthAura = addHearth(1, 1.25)
	Class.SCENEXEhearth = {
		PARENT: 'SCENEXEbase',
		LABEL: 'Hearth',
		TURRETS: [{
			POSITION: { SIZE: 12.5, LAYER: 1 },
			TYPE: 'SCENEXEhearthAura'
		}]
	}

	Class.SCENEXEhangarDroneSpawner = {
		PARENT: 'genericTank',
		LABEL: '',
		SHAPE: 4,
		GUNS: [{
			POSITION: { LENGTH: 15, WIDTH: 15, X: -8 },
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.drone, {size: 1.2}]),
				MAX_CHILDREN: 3,
				TYPE: 'drone',
				SYNCS_SKILLS: true,
				AUTOFIRE: true
			}
		}]
	}

	Class.SCENEXEhangar = {
		PARENT: 'SCENEXEbase',
		LABEL: 'Hangar',
		TURRETS: [{
			POSITION: { SIZE: 10, LAYER: 1 },
			TYPE: ['SCENEXEhangarDroneSpawner', { COLOR: 'gray', MIRROR_MASTER_ANGLE: true }]
		}]
	}

	Class.SCENEXEnode.UPGRADES_TIER_1 = ['SCENEXEmono', 'SCENEXEcommander', 'SCENEXEtrapper']
	Class.SCENEXEmono.UPGRADES_TIER_2 = ['SCENEXEduo', 'SCENEXEflank', 'SCENEXEsplit', 'SCENEXEsingle', 'SCENEXEalloy', 'SCENEXEguard', 'SCENEXEsniper']
		Class.SCENEXEduo.UPGRADES_TIER_3 = ['SCENEXEtrio']
	Class.SCENEXEcommander.UPGRADES_TIER_2 = ['SCENEXEdirector', 'SCENEXEoverseer', 'SCENEXEalloy', 'SCENEXEfusion']
	Class.SCENEXEtrapper.UPGRADES_TIER_2 = ['SCENEXEgamma', 'SCENEXEblockade', 'SCENEXErubble', 'SCENEXEguard', 'SCENEXEfusion']
	Class.SCENEXEbase.UPGRADES_TIER_1 = ['SCENEXEsmasher', 'SCENEXEsentry', 'SCENEXEwall', 'SCENEXEhearth', 'SCENEXEhangar']

	Class.administrator.UPGRADES_TIER_0.push(['SCENEXEnode', 'SCENEXEbase'])
}

Class.exampleAddon = makeMenu("Scenexe2")
Class.exampleAddon.UPGRADES_TIER_0 = ["node","scenCelP"]
Class.node.UPGRADES_TIER_0 = ["mono","mono2","mono3"]
Class.scenCelP.UPGRADES_TIER_1 = ["pulsar","satellite"]
Class.pulsar.UPGRADES_TIER_1 = ["pulsar2","pulsar3","pulsar4","pulsar5"]
Class.satellite.UPGRADES_TIER_1 = ["satellite2","satellite3","satellite4","satellite5"]
Class.pulsar.UPGRADES_TIER_2 = ["blasar"]
Class.pulsar2.UPGRADES_TIER_2 = ["blasar2"]
Class.pulsar3.UPGRADES_TIER_2 = ["blasar3"]
Class.pulsar4.UPGRADES_TIER_2 = ["blasar4"]
Class.pulsar5.UPGRADES_TIER_2 = ["blasar5"]
Class.blasar.UPGRADES_TIER_2 = ["blasar2","blasar3","blasar4","blasar5"]
Class.blasar2.UPGRADES_TIER_2 = ["bv"]
Class.menu_addons.UPGRADES_TIER_0.push("exampleAddon",['SCENEXEnode', 'SCENEXEbase']);

