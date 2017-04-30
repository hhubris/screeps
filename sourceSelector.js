var lib = require('lib');

var sourceSelector = {

    harvest(creep) {

        var sources = creep.room.find(FIND_SOURCES);
        
        // console.log("source: " + creep.memory.source);

        // does this creep already have an source?
        if (sources.length > 1 && typeof creep.memory.source == 'undefined') {

            var counts = _.transform(lib.findCreepsInSameRoomWithSameRole(creep), lib.countBySource,
                _.fill(new Array(sources.length), 0));

            console.log(counts);

            // and save it for next time
            creep.memory.source = lib.findIndexForMinVal(counts);
            console.log('Set creep ' + creep.name + ' to source ' + creep.memory.source);
        }

        // if we have saved source, use that, else use the first one for safety
        const sourceId = creep.memory.source ? creep.memory.source : 0;

        if(creep.harvest(sources[sourceId]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[sourceId], {visualizePathStyle: {stroke: '#ffaa00'}});
        }

    }
};

module.exports = sourceSelector;
