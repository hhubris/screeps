let lib = require('lib');

let spawner = {

    energyMap: {
        300: {
            'upgradeDrone': {
                'min': 2,
                'body': [WORK, CARRY, MOVE, MOVE]
            },
            'buildDrone': {
                'min': 2,
                'body': [WORK, CARRY, MOVE, MOVE]
            },
            'repairDrone': {
                'min': 2,
                'body': [WORK, CARRY, MOVE, MOVE]
            }
        },

        400: {
            'upgradeDrone': {
                'min': 2,
                'body': [WORK, WORK, CARRY, MOVE, MOVE, MOVE]
            },
            'buildDrone': {
                'min': 2,
                'body': [WORK, WORK, CARRY, MOVE, MOVE, MOVE]
            },
            'repairDrone': {
                'min': 2,
                'body': [WORK, WORK, CARRY, MOVE, MOVE, MOVE]
            }           
        },
        650: {
            'upgradeDrone': {
                'min': 2,
                'body': [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE]
            },
            'buildDrone': {
                'min': 2,
                'body': [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE]
            },
            'repairDrone': {
                'min': 2,
                'body': [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE]
            }                       
        },
        750: {
            'upgradeDrone': {
                'min': 2,
                'body': [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
            },
            'buildDrone': {
                'min': 3,
                'body': [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
            },
            'repairDrone': {
                'min': 3,
                'body': [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
            },
            'constructFillerDrone': {
                'min': 2,
                'body': [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
            }                       
        },
        900: {
            'upgradeDrone': {
                'min': 2,
                'body': [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
            },
            'buildDrone': {
                'min': 4,
                'body': [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
            },
            'repairDrone': {
                'min': 3,
                'body': [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
            },
            'constructFillerDrone': {
                'min': 3,
                'body': [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
            }                               
        }
    },

    getEnergyMap(room, maxEnergyOnly) {

        const keys = Object.keys(this.energyMap).reverse();

        if (maxEnergyOnly) {
            const energy = keys[0];
            return room.energyCapacityAvailable >= energy ? this.energyMap[energy] : undefined;
        }
        else {
            for (let i = 0; i < keys.length; i++) {
                if (keys[i] <= room.energyAvailable) {
                    return this.energyMap[keys[i]];
                }
            }

            return undefined;
        }
    },

    createCreepMap(room) {
        let result = {};

        for (const i in Game.creeps) {
            const creep = Game.creeps[i];

            if (creep.room == room) {
                // console.log(creep + ' is in my room ' + room);
                if (creep.memory.role in result) {
                    result[creep.memory.role] += 1;
                }
                else {
                    result[creep.memory.role] = 1;
                }
            }

        }

        return result;
    },

    nextRoleToSpawn(room, goalMap, creepMap) {
        for (const role in goalMap) {
            const currCnt = (role in creepMap) ? creepMap[role] : 0;
            // console.log(currCnt + ' ' + role);

            if (goalMap[role].min > currCnt) {
                const cost = lib.totalBodyCost(goalMap[role].body);
                // console.log(cost + ' ' + room.energyAvailable);
                if (cost <= room.energyAvailable) {
                    return role;
                }
            }
        }

        return undefined;
    },

    spawnCreep(spawn) {

        if (spawn.spawning) {
            // console.log('spawning...');
            return;
        }

        const room = spawn.room;
        const creepMap = this.createCreepMap(room);
        const goalMap = this.getEnergyMap(room, true);

        // console.log(JSON.stringify(goalMap));

        if (!goalMap) {
            console.log('Unable to find goal map');
            return;
        }

        const roleToSpawn = this.nextRoleToSpawn(room, goalMap, creepMap);
        // console.log(roleToSpawn);

        if (roleToSpawn) {
            const data = goalMap[roleToSpawn];
            let newName = spawn.createCreep(data.body, undefined, {role: roleToSpawn});
            console.log('spawning ' + newName + ' [' + roleToSpawn + ']');
            lib.creepDump();
        }
    },

    forceSpawn(spawn, roleToSpawn) {
        if (spawn.spawning) {
            // console.log('spawning...');
            return;
        }

        const room = spawn.room;
        const goalMap = this.getEnergyMap(room, false);

        console.log(JSON.stringify(goalMap));

        if (!goalMap) {
            console.log('Unable to find goal map');
            return;
        }

        const data = goalMap[roleToSpawn];

        if (!data) {
            console.log('Unable to find data for role ' + roleToSpawn);
            return;
        }

        const cost = lib.totalBodyCost(data.body);

        if (cost < room.energyAvailable) {
            let newName = spawn.createCreep(data.body, undefined, {role: roleToSpawn});
            console.log('spawning ' + newName + ' [' + roleToSpawn + ']');
            lib.creepDump();
        }

    }

};

module.exports = spawner;
