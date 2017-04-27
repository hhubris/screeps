let AbstractDrone = require('AbstractDrone');

class RepairDrone extends AbstractDrone {
	
	repairObjects(creep) {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_WALL ||
                        structure.structureType == STRUCTURE_ROAD ||
                        structure.structureType == STRUCTURE_RAMPART) && structure.hits < structure.hitsMax;
            }
        })


	    if (targets.length) {

    		var target = targets[0];

	    	for (var i = 0; i < targets.length; i++) {
	            // console.log(i + " : " + target.hits);
	    		if (targets[i].hits < target.hits) {
	    			target = targets[i];
	    		}
	    	}

	        // console.log(target.pos.x + "," + target.pos.y + " " + target.hits);

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