var spawner = require('spawner');

var reaper = {

	reap: function() {

		for (const i in Game.rooms) {
			const room = Game.rooms[i];
			room.memory.hasHarvester = false;
		}

	    for(var name in Memory.creeps) {
	        if(!Game.creeps[name]) {
	            delete Memory.creeps[name];
	            console.log('Clearing non-existing creep memory:', name);
	        }
	        else if (Game.creeps[name].memory.role == 'harvester') {
	        	Game.creeps[name].room.memory.hasHarvester = true;
	        }
	    }

		for (const i in Game.rooms) {
			const room = Game.rooms[i];
			const memEnergy = room.memory.maxEnergy;

			if (memEnergy && memEnergy != room.energyCapacityAvailable) {
				console.log("Room energy changed from " + memEnergy + " to " + room.energyCapacityAvailable);
			}

			room.memory.maxEnergy = room.energyCapacityAvailable;

			if (!room.memory.hasHarvester && room.energyAvailable > 299) {

				var spawn;
				for (const i in Game.spawns) {
					if (spawn.room == room) {
						spawn = Game.spawns[i];
					}
				}

				spawner.forceSpawn(spawn, 'harvester');
			}
		}

		if (Game.time % 100 == 0) {
			console.log("Creep dump...");

			for (const i in Game.creeps) {
				const creep = Game.creeps[i];
				console.log(creep.name + " is a " + creep.memory.role);
			}
		}
	}
};

module.exports = reaper;