const evolution = new Vue({
	el: "#app",

	created() {
		numberformat.default.opts = {
			sigfigs: 5,
			format: "standard",
			flavor: "short",
			backend: "decimal.js",
			Decimal: Decimal
		};

		this.update();
	},

	data: {
		eff: new Decimal(1),
		energy: new Decimal(0),
		prevEnergy: new Decimal(0),
		totalNow: new Decimal(0),
		total: new Decimal(0),
		speed: new Decimal(500),
		
		menu: 0,
		upgradeMenu: 0,
		fluctuatorMenu: 0,
		
		prevTime: 0,

		evolveReq: new Decimal(1000),
		stage: 0,
		stages: [
			"Planck Epoch",
			"Grand Unification Epoch",
			"Electroweak Epoch",
			"Inflationary Epoch",
			"Quark Epoch",
			"Phthinosuchus",
			"Ouranopithicus",
			"Homo Erectus",
			"Homo Sapiens Sapiens",
			"Artificial Intelligence",
			"Intelligent Energy",
			"Universe Creators",
			"Universe Corruptors",
			"Multiverse Protectors",
			"Omniverse Infinities",
			"Dimensional Seers",
			"Dimensional Shifters",
		],
		highestStage: 0,
		
		wisdom: new Decimal(1),
		ascensions: 0,

		upgrades: [
			{
				name: [
					"Useful Genes",
					"Useful Proteins",
					"Advanced Genes",
					"Advanced Proteins",
					"Bigger Size",
					"Complex Brains",
					"Complex Brains",
					"Complex Brains",
					"Complex Brains",
					"Improved Processing",
					"Improved Expansion",
					"Exotic Universes",
					"Faster Destruction",
					"Exotic Multiverses",
					// DO SOMETHING FOR INFINITIES VVV
				],
				level: new Decimal(1),
				effect: "More Energy Gain",
				cost: new Decimal(100),
				ocost: new Decimal(100),
				prgm: "gain"
			},
		],

		fluctuator: [
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
				fps: new Decimal(5),
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
				fps: new Decimal(5),
				cost: new Decimal(10000000), // 10 Million
				ocost: new Decimal(10000000),
				unlocked: 4
			},
		],

		Decimal: Decimal
	},

	computed: {
		evMult() {
			return Decimal.pow(5, this.stage);
		},

		wisdomGain() {
			return this.total.div(1000000).plus(1).cbrt().minus(this.wisdom).floor();
		},

		currentUpgrade() {
			return this.upgrades[this.upgradeMenu];
		},

		currentFluctuator() {
			return this.fluctuator[this.fluctuatorMenu];
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
			this.energy = new Decimal(0);
			this.eff = new Decimal(1);
			this.speed = new Decimal(1000);
			this.evolveReq = new Decimal(1000);
			this.totalNow = new Decimal(0);
			this.stage = 0;
			
			this.upgradeMenu = 0;
			this.fluctuatorMenu = 0;
			
			for (let i = 0; i < this.fluctuator.length; i++) {
				this.fluctuator[i].amount = new Decimal(0);
				this.fluctuator[i].cost = new Decimal(this.fluctuator[i].ocost);
			}
			
			for (let i = 0; i < this.upgrades.length; i++) {
				this.upgrades[i].level = new Decimal(1);
				this.upgrades[i].cost = new Decimal(this.upgrades[i].ocost);
			}
			
			this.ascensions++;
			this.wisdom = this.wisdom.plus(this.wisdomGain);
		},

		update(now) {
			let diff = (now - this.prevTime) / 1000 || 0;

			this.energy = this.energy.plus(this.eff.times(this.evMult).times(diff));
			for (let i = 0; i < this.fluctuator.length; i++) {
				const gain = this.fluctuator[i].fps.times(this.fluctuator[i].amount).times(this.wisdom).times(diff);
				this.eff = this.eff.plus(gain);
			}

			this.prevTime = now;
			requestAnimationFrame(this.update);
		},

		getUpgrade() {
			const upgrade = this.currentUpgrade;

			this.energy = this.energy.minus(upgrade.cost);
			upgrade.cost = upgrade.cost.times(10);
			upgrade.level = upgrade.level.plus(1);

			switch (upgrade.prgm) {
				case "speed":
					this.speed = this.speed.times(0.6);
					break;
				case "gain":
					//this.gain = this.gain.times(2);
			}
		},

		getFluctuator() {
			const auto = this.currentFluctuator;

			this.energy = this.energy.minus(auto.cost);
			auto.cost = auto.cost.times(1.25).floor();
			auto.amount = auto.amount.plus(1);
		}
	}
});
