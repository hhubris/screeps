let AbstractDrone = require('AbstractDrone');

class ConstructFillerDrone extends AbstractDrone {

    fillConstructs(creep) {

        let targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER) && 
                    structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
            }
        });

        // console.log('filler: ' + JSON.stringify(targets));

        if(targets.length > 0) {
            if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }

            return true;
        }


        return false;
    }

    run() {
        super.run(this.fillConstructs.bind(this));
    }

}

module.exports = ConstructFillerDrone;
