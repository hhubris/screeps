
let UpgradeDrone = require('UpgradeDrone');
let BuildDrone = require('BuildDrone');
let RepairDrone = require('RepairDrone');

let DroneFactory = {
	
	build(creep) {
		// console.log(creep.memory.role);
		switch(creep.memory.role) {
			case "upgradeDrone" : return new UpgradeDrone(creep);
			case "buildDrone" : return new BuildDrone(creep);
			case "repairDrone" : return new RepairDrone(creep);
			default: throw "Invalid drone type " + creep.memory.role;
		}
	}
}

module.exports = DroneFactory;