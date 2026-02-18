module.exports = {
    maze_type: 1,
    level_cap: 1000,
    growth: true,
    defineLevelSkillPoints: level => {
        if (level <= 40) return 1;
        if (level <= 45 && (level & 1) == 1) return 1;
        if (level <= 51 && (level % 2) == 1) return 1;
        if (level % 10 == 1) return 1;
        return 0;
    },
       arms_race: true,
           random_body_colors: true,
}
