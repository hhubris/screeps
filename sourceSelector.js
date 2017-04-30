'use strict';

var lib = require('lib');

var sourceSelector = {

    hasSourceAssigned(creep) {
        return typeof creep.memory.source != 'undefined';
    },

    harvest(creep) {

        if (creep.room.energyAvailable < creep.room.energyCapacityAvailable) {

            // console.log(creep.name + ' is looking for a container with energy');

            const containerWithEnergy = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => structure.structureType == STRUCTURE_CONTAINER && 
                    structure.store[RESOURCE_ENERGY] > 0
            });

            if (containerWithEnergy != null) {
                if(creep.withdraw(containerWithEnergy, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(containerWithEnergy, {visualizePathStyle: {stroke: '#ffaa00'}});
                }

                return;
            }

        }

        var sources = creep.room.find(FIND_SOURCES);
        
        // console.log("source: " + creep.memory.source);

        // does this creep already have an source?
        if (sources.length > 1 && !this.hasSourceAssigned(creep)) {

            var counts = _.transform(lib.findCreepsInSameRoomWithSameRole(creep), lib.countBySource,
                _.fill(new Array(sources.length), 0));

            // console.log(counts);

            // and save it for next time
            creep.memory.source = lib.findIndexForMinVal(counts);
            console.log('Set ' + creep.name + ' to use source ' + creep.memory.source);
        }

        // if we have saved source, use that, else use the first one for safety
        const sourceId = creep.memory.source ? creep.memory.source : 0;

        if(creep.harvest(sources[sourceId]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[sourceId], {visualizePathStyle: {stroke: '#ffaa00'}});
        }

    }
};

module.exports = sourceSelector;
