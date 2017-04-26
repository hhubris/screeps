

var sourceSelector = {

	harvest: function(creep) {

        var sources = creep.room.find(FIND_SOURCES);
        
        // console.log("source: " + creep.memory.source);

        if (sources.length > 1 && typeof creep.memory.source == 'undefined') {

        	var counts = new Array(sources.length);

        	for (var i = 0; i < sources.length; i++) {
        		counts[i] = 0;
        	}

		    for(var name in Game.creeps) {
        		var otherCreep = Game.creeps[name];

        		if (typeof otherCreep.memory.source != 'undefined') {
        			counts[otherCreep.memory.source]++;
        		}
        	}

        	minId = 0;
        	minVal = counts[0];

        	for (var i = 0; i < sources.length; i++) {
        		if (counts[i] < minVal) {
        			minId = i;
        			minVal = counts[i];
        		}
        	}

        	creep.memory.source = minId;
        	console.log("Set creep " + creep.name + " to source " + minId);
        }

        const sourceId = creep.memory.source ? creep.memory.source : 0;

        if(creep.harvest(sources[sourceId]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[sourceId], {visualizePathStyle: {stroke: '#ffaa00'}});
        }

	}
}

module.exports = sourceSelector;