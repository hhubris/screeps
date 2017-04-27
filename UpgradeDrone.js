let AbstractDrone = require('AbstractDrone');

class UpgradeDrone extends AbstractDrone {
	
	constructor(creep) {
		super(creep);
	}

	upgradeController(creep) {
      
       if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
        }

        return true;
	}

	run() {
		super.run(this.upgradeController);
	}
}

module.exports = UpgradeDrone;