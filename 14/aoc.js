function Reaction(comp, result) {
	this.components = new Map()
	let a,b
	for (const reactant of comp) {
		[a,b] = reactant.split(" ")
		this.components.set(b, Number(a))
	}
	[a,b] = result.split(" ")
	this.result_cmpd = b
	this.result_amt = Number(a)
}

let ratio
function main() {
	let input = getIn().split("\n")
	let reactions = input.map(str=> {
		let reaction = str.match(/\d+ \w+/g)
		return new Reaction(reaction, reaction.pop())
	})
	let multiple_extras = []
	for (let FUEL_MULTIPLE = 3700000; FUEL_MULTIPLE <= 3800000; FUEL_MULTIPLE++) {
		let components_extra = new Map()
		let reactants_needed = new Map(reactions.find(r=>r.result_cmpd == "FUEL").components)
		for ([comp,amt] of reactants_needed) {
			reactants_needed.set(comp, amt*FUEL_MULTIPLE)
		}
		while (reactants_needed.size > 1 || reactants_needed.get("ORE") == undefined) {
			let iter = reactants_needed.entries()
			let now = iter.next().value
			if (now[0] == "ORE") now = iter.next().value
			let extra = components_extra.get(now[0]) || 0
			if (extra >= now[1]) {
				extra -= now[1]
			} else {
				let to_add = reactions.find(r=>r.result_cmpd == now[0])
				let multiplier = Math.ceil((now[1]-extra)/to_add.result_amt)
				for ([comp,amt] of to_add.components) {
					let old_amt = reactants_needed.get(comp) || 0
					reactants_needed.set(comp, old_amt + (amt * multiplier))
				}
				extra += (to_add.result_amt * multiplier) - now[1]
			}
			if (extra) components_extra.set(now[0], extra)
			else components_extra.delete(now[0])
			reactants_needed.delete(now[0])
		}
		ratio = reactants_needed.get("ORE")
		multiple_extras.push([FUEL_MULTIPLE, components_extra, ratio])
	}
	console.log(multiple_extras.sort((b,a)=>a[2] - b[2])/*.filter(x=>x[2]<=1000000000000n)*/)
	displayOut(1, "hi")
}

function main2() {
	let program = getIn()
	displayOut(2, )
}
