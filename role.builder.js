var roleUpgrader = require('role.upgrader');
var sourceSelector = require('sourceSelector');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
	    }
	    
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('🚧 build');
	    }

	    if(creep.memory.building) {
            
            var targets = creep.room.find(FIND_MY_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_WALL ||
                                structure.structureType == STRUCTURE_ROAD ||
                                structure.structureType == STRUCTURE_RAMPART) && structure.hits < structure.hitsMax;
                    }
                })

            if (targets.length) {
                if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else {                
                targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                
                if(targets.length) {
                    if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                } else {
                	roleUpgrader.run(creep);
                }
            }
	    }
	    else {
            sourceSelector.harvest(creep);
	    }
	}
};

module.exports = roleBuilder;