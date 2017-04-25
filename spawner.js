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
		}
	},

	getEnergyMap : function(energy) {

		const keys = Object.keys(this.energyMap).reverse();

		for (var i = 0; i < keys.length; i++) {

			if (keys[i] <= energy) {
				return this.energyMap[keys[i]];
			}
		}

		return undefined;
	},

	bodyPartCost: function(part) {
		const name = part.toLowerCase();
		const cost = BODYPART_COST[name];

		if (!cost) {
			throw "Invalid body part " + name;
		}

		return cost;
	},

	totalBodyCost: function(parts) {
		return parts.reduce((pv, cv) => pv+ this.bodyPartCost(cv), 0);
	},
	
	createCreepMap: function(room) {
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

	nextRoleToSpawn: function(room, goalMap, creepMap) {
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

	spawnCreep: function(spawn) {

		if (spawn.spawning) {
			// console.log("spawning...");
			return;
		}

		const room = spawn.room;
		const creepMap = this.createCreepMap(room);
		const goalMap = this.getEnergyMap(room.energyCapacityAvailable);

		// console.log(JSON.stringify(goalMap));

		if (!goalMap) {
			console.log("Unable to find goal map");
			return;
		}

		const roleToSpawn = this.nextRoleToSpawn(room, goalMap, creepMap);
		// console.log(roleToSpawn);

		if (roleToSpawn) {
			data = goalMap[roleToSpawn];
			var newName = spawn.createCreep(data.body, undefined, {role: roleToSpawn});
			console.log("spawning "  + newName + " [" + roleToSpawn + "]");
		}

	}

}

module.exports = spawner;