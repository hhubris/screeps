let AbstractDrone = require('AbstractDrone');

class RepairDrone extends AbstractDrone {

    scheduleRepair(name, pos) {

        if (!Memory.repairTargets[name]) {
            Memory.repairTargets[name] = {};
        }

        Memory.repairTargets[name].x = pos.x;
        Memory.repairTargets[name].y = pos.y;

        // console.log(name + " scheduled repair for " + JSON.stringify(Memory.repairTargets[name]));
    }
    
    repairAlreadyScheduled(creepName, target) {

        const tarPos = target.pos;

        for (const name in Memory.repairTargets) {

            if (name != creepName) {
                const site = Memory.repairTargets[name];
                // console.log("found site for " + name + " at " + site.x + "," + site.y);
                if (site.x == tarPos.x && site.y == tarPos.y) {
                    return true;
                }
            }
        }

        return false;
    }


    repairObjects(creep) {

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

        const WALL_FILTER = {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_WALL && structure.hits < structure.hitsMax;
            }
        };

        const REPAIR_PRIORITY = [CONTAINER_FILTER, ROAD_FILTER, WALL_FILTER];

        let target = undefined;

        for (var filterIdx = 0; filterIdx < REPAIR_PRIORITY.length; filterIdx++) {
            let filter = REPAIR_PRIORITY[filterIdx];

            // anything I can repair without moving?
            let targets = creep.pos.findInRange(FIND_STRUCTURES, 3, filter);

            // if not, find the next closest one I can repair
            if (targets.length == 0) {
                let tmp = creep.pos.findClosestByPath(FIND_STRUCTURES, filter);

                if (tmp) {
                    targets = [tmp];
                }
            }

            if (targets.length) {

                for (var i = 0; i < targets.length; i++) {
                    if (!this.repairAlreadyScheduled(creep.name, targets[i])) {
                        if (target == undefined || target.hits > targets[i].hits) {
                            target = targets[i];
                        }
                    }
                }

                if (target) {
                    this.scheduleRepair(creep.name, target.pos);
                    /*
                    console.log(creep.name + "[" + creep.pos.x + "," + creep.pos.y +
                        "] scheduled repair for a " + target.structureType + " at " +
                        target.pos.x + "," + target.pos.y);
                    */
                    break;
                }
            }
        }

        if (target) {

            if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }

            return true;
        }

        return false;
    }

    run() {
        super.run(this.repairObjects.bind(this));
    }
}

module.exports = RepairDrone;
