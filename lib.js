
let lib = {

    indexForMinVal(arr, i, j) {
        return arr[i] > arr[j] ? j : i;
    },

    findIndex(arr, cmp) {
        if (arr.length < 2) {
            return 0;
        }

        let minIdx = 0;

        for (let i = 1; i < arr.length; i++) {
            minIdx = cmp(arr, minIdx, i);
        }

        return minIdx;
    },

    findIndexForMinVal(arr) {
        return this.findIndex(arr, this.indexForMinVal);
    },

    findCreepsByRoleAndRoom(role, room) {
        let roomFilter = {'room': room};
        let roleFilter = {'memory': {'role': role}};

        return _(Game.creeps).filter(roleFilter).filter(roomFilter).value();
    },

    findCreepsInSameRoomWithSameRole(creep) {
        return this.findCreepsByRoleAndRoom(creep.memory.role, creep.room);
    },

    countBySource(result, otherCreep) {
        const source = otherCreep.memory.source;

        if (typeof source != 'undefined') {
            result[source]++;
        }
    },

    getRole(creep) {
        return creep.memory.role;
    },

    bodyPartCost(part) {
        const name = part.toLowerCase();
        const cost = BODYPART_COST[name];

        if (!cost) {
            throw 'Invalid body part ' + name;
        }

        return cost;
    },

    totalBodyCost(parts) {
        return parts.reduce((pv, cv) => pv + this.bodyPartCost(cv), 0);
    },

    createBody(parts) {
        return _.map(parts, function createPart(value) {
            // console.log('v: ' + JSON.stringify(value));
            return _.fill(Array(value[1]), value[0]);
        });
    },
    
    displayCreep(creep) {
        var desc = creep.name + ' is a ' + creep.memory.role;

        if (typeof creep.memory.source != 'undefined') {
            desc += ' using source ' + creep.memory.source;
        }

        console.log(desc);
    },

    displayCreeps() {
        let sortedCreeps = _.sortBy(Game.creeps, this.getRole);
        _.each(sortedCreeps, this.displayCreep);
    },

    displayRoom(room) {
        console.log(room.name + ' energy ' + room.energyAvailable + '/' + room.energyCapacityAvailable);
    },

    displayRooms() {
        _.forEach(Game.rooms, this.displayRoom);

    },

    creepDump() {
        this.displayRooms();
        this.displayCreeps();
    }
};

module.exports = lib;
