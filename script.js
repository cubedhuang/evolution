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
		this.music.volume = 0.2;

		this.update();
	},

	data: {
		music: document.getElementById("background"),
		sfx: {
			ascend: new Audio("/audio/ascend.mp3"),
			automata: new Audio("/audio/automata.mp3"),
			evolve: new Audio("/audio/evolve.mp3"),
			mutate: new Audio("/audio/mutate.mp3"),
			switchitem: new Audio("/audio/switchitem.mp3"),
			switchmenu: new Audio("/audio/switchmenu.mp3"),
			upgrade: new Audio("/audio/upgrade.mp3"),
		},

		useSfx: true,

		eff: new Decimal(1),
		energy: new Decimal(0),
		prevEnergy: new Decimal(0),
		totalNow: new Decimal(0),
		total: new Decimal(0),
		speed: new Decimal(500),
		canMutate: true,
		gain: new Decimal(1),

		menu: 0,
		upgradeMenu: 0,
		automataMenu: 0,

		prevTime: 0,

		evolveReq: new Decimal(1000),
		stage: 0,
		stages: [
			"Archaebacteria",
			"Eukaryota",
			"Platyhelminthes",
			"Haikouichthys",
			"Acanthostega",
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
				cost: new Decimal(10),
				ocost: new Decimal(10),
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
				cost: new Decimal(100),
				ocost: new Decimal(100),
				prgm: "gain"
			},
		],

		automata: [
			{
				name: [
					"Heat Absorber",
					"Metabolism Process",
					"Metabolism Process",
					"Metabolism Process",
					"Metabolism Process",
					"Metabolism Process",
					"Metabolism Process",
					"Metabolism Process",
					"Metabolism Process",
					"Energy Source",
				],
				amount: new Decimal(0),
				eps: new Decimal(1),
				cost: new Decimal(1000),
				ocost: new Decimal(1000),
				unlocked: 0
			},
			{
				name: [
					"NOT SHOWN",
					"Mitochondria",
					"Integument System",
					"Circulatory Management",
					"Nerve",
					"Nerve",
					"Nerve Group",
					"Brain Nerve Group",
					"Brain Nerve Group",
					"Neural Network Node",
				],
				amount: new Decimal(0),
				eps: new Decimal(5),
				cost: new Decimal(100000),
				ocost: new Decimal(100000),
				unlocked: 1
			},
			{
				name: [
					"NOT SHOWN",
					"NOT SHOWN",
					"Protein Builder",
					"Protein Builder",
					"Protein Builder",
					"Protein Builder",
					"Protein Builder",
					"Protein Builder",
					"Protein Builder",
					"Learning Algorithm",
				],
				amount: new Decimal(0),
				eps: new Decimal(5),
				cost: new Decimal(10000000), // 10 Million
				ocost: new Decimal(10000000),
				unlocked: 2
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

		currentAutomata() {
			return this.automata[this.automataMenu];
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
		},
		
		upgradeMenu() {
			if (this.useSfx) this.sfx.switchitem.play();
		},
		automataMenu() {
			if (this.useSfx) this.sfx.switchitem.play();
		},
		menu() {
			if (this.useSfx) {
				this.sfx.switchmenu.pause();
				this.sfx.switchmenu.currentTime = 0;
				this.sfx.switchmenu.play();
			}
		}
	},

	methods: {
		format: numberformat.format,

		mutate() {
			if (this.canMutate) {
				const gain = this.gain.times(this.wisdom);
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
			this.evolveReq = new Decimal(1000);
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

			this.energy = this.energy.plus(this.eff.times(this.evMult).times(diff));
			for (let i = 0; i < this.automata.length; i++) {
				const gain = this.automata[i].eps.times(this.automata[i].amount).times(this.wisdom).times(diff);
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
