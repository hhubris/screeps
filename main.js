'use strict';

var reaper = require('reaper');
var spawner = require('spawner');
var droneFactory = require('DroneFactory');
var lib = require('lib');

global.creepDump = function creepDump() {
    lib.creepDump();
};

module.exports.loop = function mainLoop() {

    let start = Date.now();

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

    // console.log('limit: ' + Game.cpu.limit + ' tickLimit: ' + Game.cpu.tickLimit + ' bucket: ' + Game.cpu.bucket);
    let now = Date.now();
    console.log('Processing time: ' + (now - start) + ' Tick time: ' + (now - Memory.lastEndTime));
    Memory.lastEndTime = now;
};
