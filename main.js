var reaper = require('reaper');
var spawner = require('spawner');
var droneFactory = require('DroneFactory');

module.exports.loop = function () {

    reaper.reap();

    for (const i in Game.spawns) {
        spawner.spawnCreep(Game.spawns[i]);
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];

        if (creep.memory.role.endsWith('Drone')) {
            droneFactory.build(creep).run();
        }
    }

    // console.log("limit: " + Game.cpu.limit + " tickLimit: " + Game.cpu.tickLimit + " bucket: " + Game.cpu.bucket);
 }