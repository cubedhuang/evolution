const creation = new Vue({
	el: "#app",

	mounted() {
		numberformat.default.opts = {
			flavor: "short",
			format: "standard",
			sigfigs: 5,
			backend: "decimal.js",
			Decimal
		}
		
		this.update();
	},

	data: {
		creationAlert: true,

		energy: new Decimal(10),
		flucs: new Decimal(1),
		prevEnergy: new Decimal(0),
		totalNow: new Decimal(0),
		total: new Decimal(0),
		
		menu: 0,
		fluctuatorMenu: 0,
		
		prevTime: 0,

		evolveReq: new Decimal(1000),
		stage: 0,
		stages: CONSTANTS.stages,
		highestStage: 0,
		
		level: new Decimal(1),
		ascensions: 0,

		fluctuators: [
			{
				name: [
					"Force",
					"Gravity",
					"Gravity",
					"Gravity",
					"Gravity",
					"Metabolism Process",
					"Metabolism Process",
					"Metabolism Process",
					"Metabolism Process",
					"Energy Source",
				],
				amount: new Decimal(0),
				fps: new Decimal(1),
				cost: new Decimal(10),
				ocost: new Decimal(10),
				unlocked: 0
			},
			{
				name: [
					"NOT SHOWN",
					"Electrostrong Force",
					"Electroweak Force",
					"Electroweak Force",
					"Weak Force",
					"Nerve",
					"Nerve Group",
					"Brain Nerve Group",
					"Brain Nerve Group",
					"Neural Network Node",
				],
				amount: new Decimal(0),
				fps: new Decimal(5),
				cost: new Decimal(100000),
				ocost: new Decimal(100000),
				unlocked: 1
			},
			{
				name: [
					"NOT SHOWN",
					"NOT SHOWN",
					"Strong Force",
					"Strong Force",
					"Strong Force",
					"Protein Builder",
					"Protein Builder",
					"Protein Builder",
					"Protein Builder",
					"Learning Algorithm",
				],
				amount: new Decimal(0),
				fps: new Decimal(20),
				cost: new Decimal(10000000), // 10 Million
				ocost: new Decimal(10000000),
				unlocked: 2
			},
			{
				name: [
					"NOT SHOWN",
					"NOT SHOWN",
					"NOT SHOWN",
					"NOT SHOWN",
					"Electromagnetic Force",
					"Protein Builder",
					"Protein Builder",
					"Protein Builder",
					"Protein Builder",
					"Learning Algorithm",
				],
				amount: new Decimal(0),
				fps: new Decimal(50),
				cost: new Decimal(10000000), // 10 Million
				ocost: new Decimal(10000000),
				unlocked: 4
			},
		],

		Decimal: Decimal
	},

	computed: {
		advMult() {
			return Decimal.pow(5, this.stage);
		},

		levelGain() {
			return this.total.div(1000000).plus(1).cbrt().minus(this.level).floor();
		},

		currentUpgrade() {
			return this.upgrades[this.upgradeMenu];
		},

		currentFluctuator() {
			return this.fluctuators[this.fluctuatorMenu];
		}
	},

	watch: {
		energy(val) {
			val = val.toString();
			if (this.energy.gt(this.prevEnergy)) {
				const diff = this.energy.minus(this.prevEnergy);
				this.total = this.total.plus(diff);
				this.totalNow = this.totalNow.plus(diff);
			}
			this.prevEnergy = this.energy;
		}
	},

	methods: {
		format: numberformat.format,

		evolve() {
			this.evolveReq = this.evolveReq.times(1000);
			this.stage++;
			if (this.stage > this.highestStage) this.highestStage = this.stage;
		},

		ascend() {
			this.energy = new Decimal(10);
			this.flucs = new Decimal(1);
			this.evolveReq = new Decimal(1000);
			this.totalNow = new Decimal(0);
			this.stage = 0;
			
			this.fluctuatorMenu = 0;
			
			for (let i = 0; i < this.fluctuators.length; i++) {
				this.fluctuators[i].amount = new Decimal(0);
				this.fluctuators[i].cost = new Decimal(this.fluctuators[i].ocost);
			}
			
			this.ascensions++;
			this.level = this.level.plus(this.levelGain);
		},

		update(now) {
			let diff = (now - this.prevTime) / 1000 || 0;

			this.energy = this.energy.plus(this.flucs.times(this.advMult).times(diff));
			for (let i = 0; i < this.fluctuators.length; i++) {
				const gain = this.fluctuators[i].fps.times(this.fluctuators[i].amount).times(this.level).times(diff);
				this.flucs = this.flucs.plus(gain);
			}

			this.prevTime = now;
			requestAnimationFrame(this.update);
		},

		getFluctuator() {
			const auto = this.currentFluctuator;

			this.energy = this.energy.minus(auto.cost);
			auto.cost = auto.cost.times(1.25).floor();
			auto.amount = auto.amount.plus(1);
		}
	}
});
