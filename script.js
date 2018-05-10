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
		setInterval(this.runAuto, 1000);
	},

	data: {
		eff: new Decimal(0),
		prev: new Decimal(0),
		totalNow: new Decimal(0),
		total: new Decimal(0),
		chance: new Decimal(0.25),
		gain: new Decimal(1),

		evolveReq: new Decimal(1000),
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
		
		wisdom: new Decimal(1),

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
				effect: "Increases Chance",
				cost: new Decimal(1),
				ocost: new Decimal(1),
				prgm: "chance"
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
				effect: "More Efficiency Gain",
				cost: new Decimal(10),
				ocost: new Decimal(10),
				prgm: "gain"
			},
		],

		automata: [
			{
				name: "Antivirus",
				amount: new Decimal(0),
				eps: new Decimal(1),
				cost: new Decimal(15),
				ocost: new Decimal(15),
				unlocked: 0
			},
			{
				name: "Protein Control",
				amount: new Decimal(0),
				eps: new Decimal(5),
				cost: new Decimal(100),
				ocost: new Decimal(100),
				unlocked: 1
			},
		],

		showNotification: false,
		notificationID: null,
		notificationStatus: true
	},

	computed: {
		multiplier() {
			return Decimal.pow(5, this.stage).times(this.wisdom);
		},

		wisdomGain() {
			return this.total.div(1000).plus(1).cbrt().minus(this.wisdom).floor();
		}
	},

	watch: {
		eff(val) {
			val = val.toString();
			if (this.eff.gt(this.prev)) {
				var diff = this.eff.minus(this.prev);
				this.total = this.total.plus(diff);
				this.totalNow = this.totalNow.plus(diff);
			}
			this.prev = this.eff;
		}
	},

	methods: {
		format: format,

		mutate() {
			if (this.chance.gte(Math.random())) {
				let gain = this.gain.times(this.multiplier);
				this.eff = this.eff.plus(gain);

				this.notificationStatus = true;
			} else this.notificationStatus = false;
			
			this.showNotification = true;
			if (this.notificationID !== null) clearTimeout(this.notificationID);
			this.notificationID = setTimeout(() => this.showNotification = false, 500);
		},

		evolve() {
			this.evolveReq = this.evolveReq.times(1000);
			this.stage++;
		},

		ascend() {
			this.eff = new Decimal(0);
			this.chance = new Decimal(0.25);
			this.gain = new Decimal(1);
			this.evolveReq = new Decimal(1000);
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

			this.wisdom = this.wisdom.plus(this.wisdomGain);
		},

		runAuto() {
			for (let i = 0; i < this.automata.length; i++) {
				let gain = this.automata[i].eps.
					times(this.automata[i].amount).
					times(this.multiplier);
				this.eff = this.eff.plus(gain);
			}
		},

		getUpgrade(id) {
			if (this.eff.gte(this.upgrades[id].cost)) {
				const upgrade = this.upgrades[id];

				this.eff = this.eff.minus(upgrade.cost);
				upgrade.cost = upgrade.cost.times(10);
				upgrade.level = upgrade.level.plus(1);

				switch (upgrade.prgm) {
					case "chance":
						this.chance = this.chance.plus((1 - this.chance) / 7.5);
						break;
					case "gain":
						this.gain = this.gain.times(2);
				}
			}
		},

		getAutomata(id) {
			if (this.eff.gte(this.automata[id].cost)) {
				const auto = this.automata[id];

				this.eff = this.eff.minus(auto.cost);
				auto.cost = auto.cost.times(1.25).floor();
				auto.amount = auto.amount.plus(1);
			}
		}
	}
});