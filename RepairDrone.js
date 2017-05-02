let AbstractDrone = require('AbstractDrone');

class RepairDrone extends AbstractDrone {

    particpatesInFillingContainers() {
        return false;
    }

    clearRepair(creep) {

        let name = creep.name;

        if (typeof Memory.repairTargets[name] != 'undefined' && creep.carry.energy == 0) {
            console.log('Clearing repair target for ' + name);
            delete Memory.repairTargets[name];
        }
    }

    scheduleRepair(name, pos) {

        if (!Memory.repairTargets[name]) {
            Memory.repairTargets[name] = {};
        }

        Memory.repairTargets[name].x = pos.x;
        Memory.repairTargets[name].y = pos.y;

        // console.log(name + ' scheduled repair for ' + JSON.stringify(Memory.repairTargets[name]));
    }
    
    repairAlreadyScheduled(creepName, target) {

        const tarPos = target.pos;

        for (const name in Memory.repairTargets) {

            if (name != creepName) {
                const site = Memory.repairTargets[name];
                // console.log('found site for ' + name + ' at ' + site.x + ',' + site.y);
                if (site.x == tarPos.x && site.y == tarPos.y) {
                    return true;
                }
            }
        }

        return false;
    }

    findRepairTarget(creep) {

        const EMERGENCY_TURN_COUNT = 10;

        const EMERGENCY_FILTER = {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER && 
                    structure.hits < CONTAINER_DECAY * EMERGENCY_TURN_COUNT) ||
                    
                    (structure.structureType == STRUCTURE_RAMPART && 
                        structure.hits < RAMPART_DECAY_AMOUNT * EMERGENCY_TURN_COUNT) ||

                    (structure.structureType == STRUCTURE_ROAD && 
                        structure.hits < ROAD_DECAY_AMOUNT * EMERGENCY_TURN_COUNT);
            }
        };

        const CONTAINER_FILTER = {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER) && structure.hits < structure.hitsMax;
            }
        };

        const ROAD_FILTER = {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_ROAD && structure.hits < structure.hitsMax;
            }
        };

        const RAMPART_FILTER = {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_RAMPART) && 
                        structure.hits < structure.hitsMax;
            }            
        };

        const WALL_FILTER = {
            filter: (structure) => {
                return (
                    structure.structureType == STRUCTURE_WALL) && 
                        structure.hits < structure.hitsMax;
            }
        };

        const REPAIR_PRIORITY = [EMERGENCY_FILTER, CONTAINER_FILTER, ROAD_FILTER, RAMPART_FILTER, WALL_FILTER];

        for (var filterIdx = 0; filterIdx < REPAIR_PRIORITY.length; filterIdx++) {
            let filter = REPAIR_PRIORITY[filterIdx];

            let targets = [];

            // anything I can repair without moving?
            if (filter == EMERGENCY_FILTER) {
                targets = creep.room.find(FIND_STRUCTURES, filter);
            }
            else {
                targets = creep.pos.findInRange(FIND_STRUCTURES, 3, filter);

                // if not, find the next closest one I can repair
                if (targets.length == 0) {
                    let tmp = creep.pos.findClosestByPath(FIND_STRUCTURES, filter);

                    if (tmp) {
                        targets = [tmp];
                    }
                }
            }

            if (targets.length) {

                let target = undefined;

                /*
                _.each(_.filter(targets, !this.repairAlreadyScheduled(creep.name)), function foo() {
                    console.log(JSON.stringify(this));
                });
                */

                for (var i = 0; i < targets.length; i++) {

                    if (filter == EMERGENCY_FILTER) {
                        console.log(targets[i].hits + ' / ' + targets[i].hitsMax + ' = ' + 
                            (targets[i].hits / targets[i].hitsMax) + ' @ ' +
                            targets[i].pos.x + ',' + targets[i].pos.y);
                    }

                    if (!this.repairAlreadyScheduled(creep.name, targets[i])) {
                        if (target == undefined || target.hits > targets[i].hits) {
                            target = targets[i];
                        }
                    }
                }

                if (target) {
                    console.log(creep.name + '[' + creep.pos.x + ',' + creep.pos.y +
                        '] scheduled repair for a ' + target.structureType + ' at ' +
                        target.pos.x + ',' + target.pos.y + ' hits ' + target.hits + ' / ' + target.hitsMax);
                    return target;
                }
            }
        }

        return undefined;
    }

    repairObjects(creep) {

        const target = this.findRepairTarget(creep);

        if (target) {
            this.scheduleRepair(creep.name, target.pos);

            if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }

            return true;
        }

        return false;
    }

    run() {
        this.clearRepair(this.creep);
        super.run(this.repairObjects.bind(this));
    }
}

module.exports = RepairDrone;
