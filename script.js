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
		this.update();

		this.music.volume = 0.2;
	},

	data: {
		music: document.getElementById("background"),
		sfx: {
			ascend: document.getElementById("ascend"),
			automata: document.getElementById("automata"),
			evolve: document.getElementById("evolve"),
			mutate: document.getElementById("mutate"),
			upgrade: document.getElementById("upgrade"),
		},

		useSfx: true,

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

		prevTime: 0,

		evolveReq: new Decimal(1000),
		stage: 0,
		stages: [
			"Prokaryotes",
			"Archaea",
			"Eukaryotes",
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
				name: [
					"Heat Absorber",
					"Metabolism",
					"Retinal Molecule",
					"Chlorophyll Molecule",
				],
				amount: new Decimal(0),
				eps: new Decimal(1),
				cost: new Decimal(10000),
				ocost: new Decimal(10000),
				unlocked: 0
			},
			{
				name: [
					"NOT SHOWN",
					"Protein Builder",
					"Protein Builder",
					"Protein Builder",
				],
				amount: new Decimal(0),
				eps: new Decimal(5),
				cost: new Decimal(1000000),
				ocost: new Decimal(1000000),
				unlocked: 1
			},
			{
				name: [
					"NOT SHOWN",
					"NOT SHOWN",
					"Mitochondria",
					"Mitochondria",
				],
				amount: new Decimal(0),
				eps: new Decimal(5),
				cost: new Decimal(100000000), // 100 Million
				ocost: new Decimal(100000000),
				unlocked: 2
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
				const diff = this.energy.minus(this.prev);
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
				const gain = this.gain.times(this.multiplier);
				this.eff = this.eff.plus(gain);

				this.canMutate = false;
				setTimeout(() => this.canMutate = true, this.speed);

				if (this.useSfx) this.sfx.mutate.play();
			}
		},

		evolve() {
			this.evolveReq = this.evolveReq.times(1000);
			this.stage++;
			if (this.stage > this.highestStage) this.highestStage = this.stage;

			if (this.useSfx) this.sfx.evolve.play();
		},

		ascend() {
			this.energy = new Decimal(0);
			this.eff = new Decimal(1);
			this.speed = new Decimal(1000);
			this.gain = new Decimal(1);
			this.evolveReq = new Decimal(1000000);
			this.totalNow = new Decimal(0);
			this.stage = 0;

			this.upgradeMenu = 0;
			this.automataMenu = 0;
			
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

			if (this.useSfx) this.sfx.ascend.play();
		},

		update(now) {
			let diff = (now - this.prevTime) / 1000 || 0;

			this.energy = this.energy.plus(this.eff.times(this.multiplier).times(diff));
			for (let i = 0; i < this.automata.length; i++) {
				const gain = this.automata[i].eps.times(this.automata[i].amount).times(diff);
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
					this.speed = this.speed.times(0.8);
					break;
				case "gain":
					this.gain = this.gain.times(2);
			}

			if (this.useSfx) this.sfx.upgrade.play();
		},

		getAutomata() {
			const auto = this.currentAutomata;

			this.energy = this.energy.minus(auto.cost);
			auto.cost = auto.cost.times(1.25).floor();
			auto.amount = auto.amount.plus(1);

			if (this.useSfx) this.sfx.automata.play();
		}
	}
});