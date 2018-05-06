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
		total: new Decimal(0),
		chance: new Decimal(0.25),
		gain: new Decimal(1),

		evolveReq: new Decimal(1000),
		stage: 0,
		stages: ["Bacteria", "Eukaryokes", "Mammals"],
		
		wisdom: new Decimal(1),

		upgrades: [
			{
				name: "Gradual Changes",
				level: new Decimal(1),
				effect: "Increases Chance",
				cost: new Decimal(1),
				ocost: new Decimal(1),
				prgm: "chance"
			},
			{
				name: "More Genes",
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
		]
	},

	computed: {
		multiplier() {
			return Decimal.pow(5, this.stage).times(this.wisdom);
		},

		wisdomGain() {
			return this.total.div(1000).plus(1).cbrt().minus(this.wisdom).floor();
		}
	},

	methods: {
		mutate() {
			if (this.chance.gte(Math.random())) {
				let gain = this.gain.times(this.multiplier);
				this.eff = this.eff.plus(gain);
				this.total = this.total.plus(gain);
			}
		},

		evolve() {
			this.restart();
			this.stage++;
		},

		ascend() {
			this.restart();
			this.stage = 0;
			this.wisdom = this.wisdom.plus(this.wisdomGain);
		},

		runAuto() {
			for (let i = 0; i < this.automata.length; i++) {
				let gain = this.automata[i].eps.
					times(this.automata[i].amount).
					times(this.multiplier);
				this.eff = this.eff.plus(gain);
				this.total = this.total.plus(gain);
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
		},

		restart() {
			this.eff = new Decimal(0);
			this.chance = new Decimal(0.25);
			this.gain = new Decimal(1);
			this.evolveReq = this.evolveReq.times(1000);

			for (let i = 0; i < this.automata.length; i++) {
				this.automata[i].amount = new Decimal(0);
				this.automata[i].cost = new Decimal(this.automata[i].ocost);
			}

			for (let i = 0; i < this.upgrades.length; i++) {
				this.upgrades[i].level = new Decimal(1);
				this.upgrades[i].cost = new Decimal(this.upgrades[i].ocost);
			}
		}
	}
});