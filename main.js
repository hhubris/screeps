var reaper = require('reaper');
var spawner = require('spawner');
var droneFactory = require('DroneFactory');

module.exports.loop = function () {

    /* global Game */
    "use strict";
    reaper.reap();

    for (let i in Game.spawns) {
        spawner.spawnCreep(Game.spawns[i]);
    }

    for(let name in Game.creeps) {
        var creep = Game.creeps[name];

        if (creep.memory.role.endsWith('Drone')) {
            droneFactory.build(creep).run();
        }
    }

    // console.log("limit: " + Game.cpu.limit + " tickLimit: " + Game.cpu.tickLimit + " bucket: " + Game.cpu.bucket);
 }