// ooh, graphs!
function main() {
	let input = getIn().split("\n")
	let planets = new Map()
// using a map so that I can fetch planets already created
	input.reduce((acc,v)=>{
		v = v.split(")")
		let planet = acc.get(v[0])
		if (!planet) planet = new Planet(v[0])
// btw, .get() with an unset key returns undefined
		acc.set(v[0], planet)
// while I could've lumped this into the if statement,
// it looks cleaner to me to just let both branches do it,
		let satellite = acc.get(v[1])
		if (!satellite) satellite = new Planet(v[1])
		acc.set(v[1], satellite)
		planet.orbiters.push(satellite)
		satellite.orbits.push(planet)
// turns out that satellites only orbit one planet, making this graph a tree.
// I was just playing it safe here.
		return acc
	},planets)
	let head_planets = []
// also turns out there's only one center of the solar system
	for (planet of planets.values()) {
		if (!planet.orbits.length) head_planets.push(planet)
	}
	let connections = head_planets.map(total_orbits).reduce((acc,v)=>acc+v)
	displayOut(1, connections)
}

function total_orbits(planet) {
// initiate recursion
	return planet.orbiters.map(x=>sum_depths_below(x,1)).reduce((acc,v)=>acc+v)
}

function sum_depths_below(planet, depth) {
// base case: a leaf planet with input depth.
// orbiters will be empty, so map will return an empty array.
// reduce on an empty array will throw a TypeError unless an initial accumulator value is specified.
// here, that's depth

// step back: on this tree, the number of orbits, direct and indirect, is equal
// to the depth, when the root node has depth 0

// recursion, sum the depths of the children and add to depth of current planet, returning that sum
	return planet.orbiters.map(x=>sum_depths_below(x,depth+1)).reduce((acc,v)=>acc+v,depth)
}

function Planet(name) {
	this.name = name
	this.orbiters = []
	this.orbits = []
}

function main2() {
	let input = getIn().split("\n")
	let planets = new Map()
	input.reduce((acc,v)=>{
		v = v.split(")")
		let planet = acc.get(v[0])
		if (!planet) planet = new Planet(v[0])
		acc.set(v[0], planet)
		let satellite = acc.get(v[1])
		if (!satellite) satellite = new Planet(v[1])
		acc.set(v[1], satellite)
		planet.orbiters.push(satellite)
		satellite.orbits.push(planet)
		return acc
	},planets)
// copying code up to here

// the thing to notice in the puzzle example is that,
// if you form chains from YOU to COM and SAN to COM,
// the highlighted links are the lowest common ancestor
// and its descendents till YOU and SAN's parent.
// And the number of leaps is one less than those highlighted.
// If we think of these chains as sets, now, the links except for
// the LCA comprise the symmetric difference of the sets (A∪B - A∩B).
// And hey, that set has the same number of elements as the leaps we wanted!
// Let's find that set!
	let my_chain = new Set();
	let current_planet = planets.get("YOU").orbits[0] // YOU parent
	while (current_planet) {
		my_chain.add(current_planet)
		current_planet = current_planet.orbits[0]
// [][0] == undefined
	}
	let santa_chain = new Set();
	current_planet = planets.get("SAN").orbits[0] // SAN parent
	while (current_planet) {
		santa_chain.add(current_planet)
		current_planet = current_planet.orbits[0]
	}
	let difference = symmetricDifference(my_chain, santa_chain)
	displayOut(2, difference.size)
}

// code shamelessly stolen from:
// MDN JS article on Set. Public Domain
function symmetricDifference(setA, setB) {
    var _difference = new Set(setA);
    for (var elem of setB) {
        if (_difference.has(elem)) {
            _difference.delete(elem);
        } else {
            _difference.add(elem);
        }
    }
    return _difference;
}
