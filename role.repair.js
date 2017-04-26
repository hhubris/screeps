var roleUpgrader = require('role.upgrader');
var sourceSelector = require('sourceSelector');

var roleRepair = {
	
	    run: function(creep) {

    	    if(creep.memory.building && creep.carry.energy == 0) {
                creep.memory.building = false;
                creep.say('🔄 harvest');
    	    }
    	    
            if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
    	        creep.memory.building = true;
    	        creep.say('🚧 repair');
    	    }

    	    if(creep.memory.building) {
                
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
                }
                else {                
                	roleUpgrader.run(creep);
                }
    	    }
    	    else {
                sourceSelector.harvest(creep);
    	    }
    	}
};

module.exports = roleRepair;