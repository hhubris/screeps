let AbstractDrone = require('AbstractDrone');

class RepairDrone extends AbstractDrone {

	scheduleRepair(name, pos) {

		if (!Memory.repairTargets[name]) {
			Memory.repairTargets[name] = {};
		}

		Memory.repairTargets[name].x = pos.x;
		Memory.repairTargets[name].y = pos.y;

		console.log("scheduledRepair for " + JSON.Stringify(Memory.repairTargets[name]));
	}
	
	repairAlreadyScheduled(target) {

		const tarPos = target.pos;

		for (const name in Memory.repairTargets) {

			const site = Memory.repairTargets[name]
			if (site.x == tarPos.x && site.y == tarPos.y) {
				return true;
			}
		}

		return false;
	}

	repairObjects(creep) {

		const structureFilter = {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_WALL ||
                        structure.structureType == STRUCTURE_ROAD ||
                        structure.structureType == STRUCTURE_RAMPART) && structure.hits < structure.hitsMax;
            }
		};

		console.log(creep.name + " looking for something to repair");

		// anything I can repair without moving?
		var targets = creep.pos.findInRange(FIND_STRUCTURES, structureFilter);

		console.log(targets.length);

		// if not, find the next closest one I can repair
		if (targets.length == 0) {
        	targets = creep.room.find(FIND_STRUCTURES, structureFilter);
    	}

		console.log(targets.length);

	    if (targets.length) {

    		var target = targets[0];

	    	for (var i = 0; i < targets.length; i++) {
	            // console.log(i + " : " + target.hits);
	    		if (targets[i].hits < target.hits && repairAlreadyScheduled(targets[i])) {
	    			target = targets[i];
	    		}
	    	}

	    	this.scheduleRepair(creep.name, target.pos);

	        // console.log(target.pos.x + "," + target.pos.y + " " + target.hits);

	        if (false) {
	        	console.log("Repairing " + target.structureType + " at " + target.pos.x + "," + target.pos.y + 
	        		" current hits " + target.hits + " hitsMax " + target.hitsMax);
	        }

    	    if(creep.repair(target) == ERR_NOT_IN_RANGE) {
        	    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        	}

        	return true;
        }

        return false;
	}

	run() {
		super.run(this.repairObjects);
	}
}

module.exports = RepairDrone;