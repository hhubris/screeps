
var reaper = {

    reap: function reap() {

        /*
        for (const i in Game.rooms) {
            const room = Game.rooms[i];
        }
        */

        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.repairTargets[name];
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }

        for (const i in Game.rooms) {
            const room = Game.rooms[i];
            const memEnergy = room.memory.maxEnergy;

            if (memEnergy && memEnergy != room.energyCapacityAvailable) {
                console.log('Room energy changed from ' + memEnergy + ' to ' + room.energyCapacityAvailable);
            }

            room.memory.maxEnergy = room.energyCapacityAvailable;
        }
    }
};

module.exports = reaper;
