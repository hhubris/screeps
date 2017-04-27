var spawner = {

	energyMap: {
		300: {
			'harvester' : {
				'min': 2,
				'body': [WORK,CARRY,CARRY,MOVE,MOVE]
			},
			'upgrader' : {
				'min': 1,
				'body': [WORK,CARRY,MOVE]
			},
			'builder' : {
				'min': 2,
				'body': [WORK,CARRY,MOVE]
			}
		}, 
		350: {
			'harvester' : {
				'min': 2,
				'body': [WORK,CARRY,CARRY,MOVE,MOVE,MOVE]
			},
			'upgrader' : {
				'min': 1,
				'body': [WORK,CARRY,CARRY,MOVE,MOVE,MOVE]
			},
			'builder' : {
				'min': 2,
				'body': [WORK,CARRY,CARRY,MOVE,MOVE,MOVE]
			}			
		},
		500: {
			'harvester' : {
				'min': 3,
				'body': [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE]
			},
			'upgrader' : {
				'min': 2,
				'body': [WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE]
			},
			'builder' : {
				'min': 2,
				'body': [WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE]
			},
			'repair' : {
				'min': 1,
				'body': [WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE]
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
			for (var i = 0; i < keys.length; i++) {
				if (keys[i] > room.energyAvailable) {
					return this.energyMap[i];
				}
			}

			return undefined;
		}
	},

	bodyPartCost(part) {
		const name = part.toLowerCase();
		const cost = BODYPART_COST[name];

		if (!cost) {
			throw "Invalid body part " + name;
		}

		return cost;
	},

	totalBodyCost(parts) {
		return parts.reduce((pv, cv) => pv + this.bodyPartCost(cv), 0);
	},
	
	createCreepMap(room) {
		var result = {};

		for (const i in Game.creeps) {
			const creep = Game.creeps[i];

			if (creep.room == room) {
				// console.log(creep + " is in my room " + room);
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
			// console.log(currCnt + " " + role);

			if (goalMap[role].min > currCnt) {
				const cost = this.totalBodyCost(goalMap[role].body);
			    // console.log(cost + " " + room.energyAvailable);
				if (cost <= room.energyAvailable) {
					return role;
	        	}
			}
		}

		return undefined;
	},

	creepDump() {

		for (const i in Game.creeps) {
			const creep = Game.creeps[i];
			console.log(creep.name + " is a " + creep.memory.role);
		}
	},

	spawnCreep(spawn) {

		if (spawn.spawning) {
			// console.log("spawning...");
			return;
		}

		const room = spawn.room;
		const creepMap = this.createCreepMap(room);
		const goalMap = this.getEnergyMap(room, true);

		// console.log(JSON.stringify(goalMap));

		if (!goalMap) {
			console.log("Unable to find goal map");
			return;
		}

		const roleToSpawn = this.nextRoleToSpawn(room, goalMap, creepMap);
		// console.log(roleToSpawn);

		if (roleToSpawn) {
			const data = goalMap[roleToSpawn];
			var newName = spawn.createCreep(data.body, undefined, {role: roleToSpawn});
			console.log("spawning "  + newName + " [" + roleToSpawn + "]");
			this.creepDump();
		}
	},

	forceSpawn(spawn, roleToSpawn) {
		if (spawn.spawning) {
			// console.log("spawning...");
			return;
		}

		const room = spawn.room;
		const creepMap = this.createCreepMap(room);
		const goalMap = this.getEnergyMap(room, false);

		// console.log(JSON.stringify(goalMap));

		if (!goalMap) {
			console.log("Unable to find goal map");
			return;
		}

		const data = goalMap[roleToSpawn];
		const cost = this.totalBodyCost(goalMap[roleToSpawn].body);

		if (cost < room.energyAvailable) {
			var newName = spawn.createCreep(data.body, undefined, {role: roleToSpawn});
			console.log("spawning "  + newName + " [" + roleToSpawn + "]");
			this.creepDump();
		}

	}

}

module.exports = spawner;