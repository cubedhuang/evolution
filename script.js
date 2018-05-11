numberformat.default.opts = {
	sigfigs: 5,
	format: "standard",
	flavor: "short",
	backend: "decimal.js",
	Decimal: Decimal
};

const format = numberformat.format;

new Vue({
	el: "#app",

	created() {
		setInterval(this.update, 1000);
	},

	data: {
		eff: new Decimal(1),
		energy: new Decimal(0),
		prev: new Decimal(0),
		totalNow: new Decimal(0),
		total: new Decimal(0),
		speed: new Decimal(1000),
		canMutate: true,
		gain: new Decimal(1),

		menu: 0,
		upgradeMenu: 0,
		automataMenu: 0,

		evolveReq: new Decimal(1000000),
		stage: 0,
		stages: [
			"Prokaryotes",
			"Archaea",
			"Eukaryokes",
			"Algae",
			"Reptiles",
			"Mammals",
			"Monkeys",
			"Cavemen",
			"Humans",
			"AI",
			"Energy",
			"Creators",
			"Corruptors",
			"Protectors",
			"Infinities",
			"Seers",
			"Shifters",
		],
		highestStage: 0,
		
		wisdom: new Decimal(1),
		ascensions: 0,

		upgrades: [
			{
				name: [
					"Faster Reproduction",
					"Faster Reproduction",
					"Faster Reproduction",
					"Faster Reproduction",
					"Faster Reproduction",
					"Faster Reproduction",
					"Faster Reproduction",
					"Stronger Tools",
					"Better Tech",
					"Faster Algorithms",
					"Faster Algorithms",
					"Greater Universes",
					"Universe Fragments",
					"Perfect Universes",
					// DO SOMETHING FOR INFINITIES VVV
				],
				level: new Decimal(1),
				effect: "Increases Speed",
				cost: new Decimal(100),
				ocost: new Decimal(100),
				prgm: "speed"
			},
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
				cost: new Decimal(1000),
				ocost: new Decimal(1000),
				prgm: "gain"
			},
		],

		automata: [
			{
				name: ["Antivirus"],
				amount: new Decimal(0),
				eps: new Decimal(1),
				cost: new Decimal(10000),
				ocost: new Decimal(10000),
				unlocked: 0
			},
			{
				name: ["Protein Control"],
				amount: new Decimal(0),
				eps: new Decimal(5),
				cost: new Decimal(1000000),
				ocost: new Decimal(1000000),
				unlocked: 1
			},
		],

		Decimal: Decimal
	},

	computed: {
		multiplier() {
			return Decimal.pow(5, this.stage).times(this.wisdom);
		},

		wisdomGain() {
			return this.total.div(1000000).plus(1).cbrt().minus(this.wisdom).floor();
		},

		currentUpgrade() {
			return this.upgrades[this.upgradeMenu];
		},

		currentAutomata() {
			return this.automata[this.automataMenu];
		}
	},

	watch: {
		energy(val) {
			val = val.toString();
			if (this.energy.gt(this.prev)) {
				var diff = this.energy.minus(this.prev);
				this.total = this.total.plus(diff);
				this.totalNow = this.totalNow.plus(diff);
			}
			this.prev = this.energy;
		}
	},

	methods: {
		format: format,

		mutate() {
			if (this.canMutate) {
				let gain = this.gain.times(this.multiplier);
				this.eff = this.eff.plus(gain);

				this.canMutate = false;
				setTimeout(() => this.canMutate = true, this.speed);
			}
		},

		evolve() {
			this.evolveReq = this.evolveReq.pow(1.3);
			this.stage++;
			if (this.stage > this.highestStage) this.highestStage = this.stage;
		},

		ascend() {
			this.energy = new Decimal(0);
			this.eff = new Decimal(1);
			this.speed = new Decimal(1000);
			this.gain = new Decimal(1);
			this.evolveReq = new Decimal(1000000);
			this.totalNow = new Decimal(0);
			this.stage = 0;
			
			for (let i = 0; i < this.automata.length; i++) {
				this.automata[i].amount = new Decimal(0);
				this.automata[i].cost = new Decimal(this.automata[i].ocost);
			}
			
			for (let i = 0; i < this.upgrades.length; i++) {
				this.upgrades[i].level = new Decimal(1);
				this.upgrades[i].cost = new Decimal(this.upgrades[i].ocost);
			}
			
			this.ascensions++;
			this.wisdom = this.wisdom.plus(this.wisdomGain);
		},

		update() {
			this.energy = this.energy.plus(this.eff.times(this.multiplier));
			for (let i = 0; i < this.automata.length; i++) {
				let gain = this.automata[i].eps.times(this.automata[i].amount);
				this.eff = this.eff.plus(gain);
			}
		},

		getUpgrade() {
			if (this.energy.gte(this.currentUpgrade.cost)) {
				const upgrade = this.currentUpgrade;

				this.energy = this.energy.minus(upgrade.cost);
				upgrade.cost = upgrade.cost.times(10);
				upgrade.level = upgrade.level.plus(1);

				switch (upgrade.prgm) {
					case "speed":
						this.speed = this.speed.times(0.8);
						break;
					case "gain":
						this.gain = this.gain.times(2);
				}
			}
		},

		getAutomata() {
			if (this.energy.gte(this.currentAutomata.cost)) {
				const auto = this.currentAutomata;

				this.energy = this.energy.minus(auto.cost);
				auto.cost = auto.cost.times(1.25).floor();
				auto.amount = auto.amount.plus(1);
			}
		}
	}
});