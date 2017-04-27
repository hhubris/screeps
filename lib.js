
var lib = {

        indexForMinVal(arr, i, j) {
            return arr[i] < arr[j] ? i : j;
        },

        findIndex(arr, cmp) {
            if (arr.length == 1) {
                return 0;
            }

            let minIdx = 0;

            for (var i = 1; i < arr.length; i++) {
                minIdx = cmp(arr, minIdx, i);
            }

            return minIdx;
        },

        findIndexForMinVal(arr) {
        	return this.findIndex(arr, this.indexForMinVal);
        },

        findCreepsByRoleAndRoom(role, room) {
        	let roomFilter = { 'room': room };
        	let roleFilter = { 'memory': { 'role': role }};

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
        }
}

module.exports = lib;