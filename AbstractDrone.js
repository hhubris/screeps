var sourceSelector = require('sourceSelector');

class AbstractDrone {
    
    constructor(creep) {
        this.creep = creep;
    }

    particpatesInFillingContainers() {
        return true;
    }

    run(callback) {

        let creep = this.creep;

        if (creep.memory.acting && creep.carry.energy == 0) {
            creep.memory.acting = false;
        }

        if (!creep.acting && creep.carry.energy == creep.carryCapacity) {
            creep.memory.acting = true;         
        }

        if (creep.memory.acting) {

            // first try to fill empty containers
            let targets = [];
            if (this.particpatesInFillingContainers()) {
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN) &&
                                structure.energy < structure.energyCapacity;
                    }
                });
            }

            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else {
                if (!callback(creep)) {
                    if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }

        }
        else {
            sourceSelector.harvest(creep);
        }

    }
}

module.exports = AbstractDrone;
