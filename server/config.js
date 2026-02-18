module.exports = {
    // Main Menu
    main_menu: "index.html", // Where the main menu is located (in the /public folder).
    host: "localhost:3000", // Game server domain. If the host is 'localhost:NUMBER', the NUMBER must be the port setting.
    port: 3000, // Which port to run the web server on.

    // Server
    visible_list_interval: 250, // How often to update the list of the entities that players can see. Has effects of when entities are activated.
    startup_logs: true, // Enable startup logs and log speed loop warnings in the terminal
    load_all_mockups: false, // Set to true if you want every mockup to be loaded when the server starts. May noticeably slow down server startup.

    servers: [ // Make sure to change the HOST, PORT and SERVER_ID between servers!
        {
            share_client_server: false, // Only one server at a time can have this enabled.
            // The above is required if your VM (the machine that hosts the website stuff) doesn't support multi-ports and forces everything through the main server.
            // This also overrides the below HOST and PORT settings to be identical to the main server's HOST/PORT (by default, 3000).

            host: "172.67.174.146:3001", // Server host location.
            port: 3001, // The port on the server.
            id: "loc", // (<host>/#<id>)
            featured: false,

            region: "local", // The region the server is on.
            gamemode: ["labyrinth"], // The selected gamemode.
            player_cap: 80, // The maximum number of players that can join the server. Not including bots.

            properties: { // This overrides settings in the config.js file, providing the selected gamemode doesn't also override it.
                teams: 4,
                bot_cap: 32,
                                ALLOW_SERVER_TRAVEL: true,
                SERVER_TRAVEL_PROPERTIES: {
                    LOOP_INTERVAL: 10000, // how often the portal loop executes
                    AMOUNT: 2, // amount of portals to spawn
                },
                SERVER_TRAVEL: [
                    {
                        IP: "172.67.174.146", // destination server IP, don't add "https://" or any slashes to it
                        PORTAL_PROPERTIES: {
                            SPAWN_CHANCE: 100, // chance for a portal to spawn somewhere in the map each loop iteration (higher = more chances)
                            COLOR: "yellow", // portal color
                        }
                    }
                ]
            }
        },
        {
            share_client_server: false, // Only one server at a time can have this enabled.
            // The above is required if your VM (the machine that hosts the website stuff) doesn't support multi-ports and forces everything through the main server.
            // This also overrides the below HOST and PORT settings to be identical to the main server's HOST/PORT (by default, 3000).

            host: "localhost:3002", // Server host location.
            port: 3002, // The port on the server.
            id: "lod", // (<HOST>/#<SERVER_ID>)
            featured: true,

            region: "local", // The region the server is on.
            gamemode: ["event"], // The selected gamemode.
            player_cap: 80, // Not including bots.

            properties: { // This overrides settings in the config.js file, providing the selected gamemode doesn't also override it.
                bot_cap: 16,
                ALLOW_SERVER_TRAVEL: true,
                daily_tank: {
                    tank: "whirlwind",
                    tier: 3,
                    ads: {
                        enabled: true,
                        source: [
                            {
                                file: "testadvideo.mp4",
                                use_regular_ad_size: true,
                            },
                            {
                                file: "testadimage.png",
                                image_wait_time: 3,
                                use_regular_ad_size: true,
                            }
                        ]
                    }
                },
            }
        },
    ],

    // Web Server
    allow_ACAO: false, // Access-Control-Allow-Origin, allows any server/client to access data from the WebServer.

    // Map
    map_tile_width: 1500,
    map_tile_height: 1500,

    // The message that appears once a player spawns.
    spawn_message: "You have spawned! Welcome to the game.\n"
                 + "You will be invulnerable until you move or shoot.\n"
                 + "Please report any bugs you encounter!",

    chat_message_duration: 15_000, // How long a chat message lasts in milliseconds. Includes the fade-out period.
    popup_message_duration: 10_000, // How long (in milliseconds) a popup message lasts before fading out.
    sanitize_chat_input: true, // If you don't want your players to color their messages. They get sanitized after addons interpret them, but before they're added to the chat message dictionary.

    // Seasonal
    spooky_theme: false, // Toggles the seasonal Halloween theme (adds eyes to walls and replaces rocks to pumpkins)

    // Gameplay
    game_speed: 1, // General game speed.
    run_speed: 1.5, // General multiplier for acceleration and max speeds.
    max_heartbeat_interval: 300_000, // How long (in milliseconds) a socket can be disconnected before their tank self-destructs.
    respawn_delay: 0, // How long you have to wait to respawn in seconds. Set to 0 to disable.

    bullet_spawn_offset: 1, // Where the bullet spawns, where 1 is fully outside the barrel and -1 is fully inside the barrel, and 0 is halfway between.
    damage_multiplier: 1, // General damage multiplier everytime damage is dealt.
    knockback_multiplier: 1.1, // General knockback multiplier everytime knockback is applied.
    glass_health_factor: 2, // TODO: Figure out how the math behind this works.
    room_bound_force: 0.01,// How strong the force is that confines entities to the map and portals apply to entities.
    soft_max_skill: 0.59, // TODO: Find out what the intention behind the implementation of this configuration is.

    // When an entity reaches a level, this function is called and returns how many skill points that entity gets for reaching that level.
    defineLevelSkillPoints: level => (level < 2 || level > 91) ? 0 : 1,


    level_cap: 45, // Maximum normally achievable level.
    level_cap_cheat: 45, // Maximum level via the level-up key and auto-level-up.

    skill_cap: 9, // Default skill caps.
    tier_cap: 9, // Amount of tank tiers.
    tier_multiplier: 15, // Level difference between each tier.

    // Bots
    bot_cap: 0, // Maximum number of bots that can be on the server. Set to 0 to disable bots.
    bot_xp_gain: 60, // How much XP bots get until they reach level_cap.
    bot_start_level: 45, // How much XP bots will receive when first created.
    bot_skill_upgrade_chances: [
        1,  // Health Regen (low)
        1,  // Max Health (low)
        4,  // Body Damage (ram bots)
        5,  // Bullet Speed (aim consistency)
        6,  // Bullet Penetration (very important)
        6,  // Bullet Damage (very important)
        6,  // Reload (DPS)
        3,  // Movement Speed
        1,  // Shield Regen
        1   // Shield Capacity
    ],

    bot_class_upgrade_chances: [
        0,  // 0 upgrades (never)
        2,  // 1 upgrade
        10, // 2 upgrades
        44, // 3 upgrades
        44  // 4 upgrades (maxed bots common)
    ],

    bot_name_prefix: "", // This is prefixed before the bot's randomly chosen name.

    // The class that players and bots spawn as.
    spawn_class: ['SCENEXEnode', 'SCENEXEbase'],

    // How every entity regenerates their health.
    regenerate_tick: 100,

    // Food
    food_types: [ // Possible food types outside the nest
        [1, [
 [4096, "triangle"], [1024, "square"], [256, "pentagon"], [64, "hexagon"]
        ]],
        [1/50000, [
            [625, "gem"], [125, "shinyTriangle"], [25, "shinySquare"], [5, "shinyPentagon"], [1, "shinyHexagon"]
        ]],
        [1/1000000, [
            [1296, "jewel"], [216, "legendaryTriangle"], [36, "legendarySquare"], [6, "legendaryPentagon"], [1, "legendaryHexagon"]
        ]]
    ],
    food_types_nest: [ // Possible food types in the nest
        [1, [
            [520, "rainbowTriangle"],[220, "rainbowSquare"],[110, "rainbowPentagon"]
        ]]
    ],
    enemy_types_nest: [ // Possible enemy food types in the nest
        [1, [
            [1, "crasher"], [1, 'peacekeeper0', 'crasher0']

        ]],
        [1/20, [
            [1, "sentryGun"], [1, "sentrySwarm"], [1, "sentryTrap"]
        ]]
    ],

    food_cap: 900, // Maximum number of regular food at any time.
    food_cap_nest: 300, // Maximum number of nest food at any time.
    enemy_cap_nest: 10, // Maximum number of enemy nest food at any time.
    food_group_cap: 30, // Number of foods that random food groups spawn with

    // Bosses
    bosses_spawn: true,
    boss_spawn_cooldown: 260, // The delay (in seconds) between boss spawns.
    boss_spawn_delay: 6, // The delay (in seconds) between the boss spawn being announced and the boss(es) actually spawning.
    boss_types: [{
        bosses: ["eliteDestroyer", "eliteGunner", "eliteSprayer", "eliteBattleship", "eliteSpawner"],
        amount: [5, 5, 4, 2, 1], chance: 2, nameType: "a",
    },{
        bosses: ["roguePalisade"],
        amount: [4, 1], chance: 1, nameType: "castle",
        message: "A strange trembling...",
    },{
        bosses: ["summoner", "eliteSkimmer", "nestKeeper"],
        amount: [2, 2, 1], chance: 1, nameType: "a",
        message: "A strange trembling...",
    },{
        bosses: ["paladin", "freyja", "zaphkiel", "nyx", "theia"],
        amount: [1], chance: 0.01,
        message: "The world tremors as the celestials are reborn anew!",
    },{
        bosses: ["julius", "genghis", "napoleon"],
        amount: [1], chance: 0.1,
        message: "The darkness arrives as the realms are torn apart!",
    }],

    // How many members a team can have in comparison to an unweighed team.
    // Example: We have team A and B. If the weight of A is 2 and B is 1, then the game will try to give A twice as many members as B.
    // Check gamemodeconfigs to see how this works.
    team_weights: {},

    // Fun
    random_body_colors: false,

    // These are the default values for gamemode related things.
    // If you want to change them, copy the values you want to change to the server's properties. Changing them here could break stuff!
    enable_food: true,
    gamemode_name_prefixes: [],
    special_boss_spawns: false,
    use_limited_waves: false,
    mothership: false,
    domination: false,
    tiered_food: false,
    arena_shape: "rect",
    blackout: false,
    space_physics: false,
    arms_race: true,
    clan_wars: false,
    growth: false,
    groups: false,
    train: false,
    mode: "ffa",
    tag: false,
    teams: 4,
    spawn_confinement: {},

    // Room setup
    room_setup: ["room_default"],
}
