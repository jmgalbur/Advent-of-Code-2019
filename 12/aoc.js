function Moon(pos) {
	this.pos = pos
	this.vel = new Coord(0,0,0)
}

function Coord(x,y,z) {
	this.x = x
	this.y = y
	this.z = z
}

Coord.prototype.toString = function() {
	return String([this.x,this.y,this.z])
}

Coord.prototype.abs_sum = function() {
	return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z)
}

Moon.prototype.total_energy = function() {
	return this.pos.abs_sum() * this.vel.abs_sum()
}

Moon.prototype.calc_grav_vel = function(moon) {
	this.vel.x += this.pos.x < moon.pos.x ? 1 : this.pos.x > moon.pos.x ? -1 : 0
	this.vel.y += this.pos.y < moon.pos.y ? 1 : this.pos.y > moon.pos.y ? -1 : 0
	this.vel.z += this.pos.z < moon.pos.z ? 1 : this.pos.z > moon.pos.z ? -1 : 0
}

Moon.prototype.apply_velocity = function() {
	this.pos.x += this.vel.x
	this.pos.y += this.vel.y
	this.pos.z += this.vel.z
}

function main() {
displayOut(1, "done with 1")
return
	let moons = getIn().split("\n")
	moons = moons.map(coords=>({x:Number(coords.match(/x=(-?\d+)/)[1]),
		y:Number(coords.match(/y=(-?\d+)/)[1]),
		z:Number(coords.match(/z=(-?\d+)/)[1])}))
	moons = moons.map(coords=>new Moon(new Coord(coords.x,coords.y,coords.z)))
	moons = new Set(moons)
	let current_coords = []
	let current_vels = []
	for (const moon of moons) {
		current_coords.push(moon.pos)
		current_vels.push(moon.vel)
	}
	let states = new Map()
	states.set(String(current_vels),(states.get(String(current_vels)) || 0) + 1)

	let i
	let STEPS = 10000
	let MARKER = 10000
	for (i = 0; i < STEPS; i++) {
		for (const moon of moons) {
			let others = new Set(moons)
			others.delete(moon)
			for (const other of others) {
				moon.calc_grav_vel(other)
			}
		}
		for (const moon of moons) {
			moon.apply_velocity()
		}
		if (states.get(String(current_vels))) console.log(String(current_coords),String(current_vels),i)
		states.set(String(current_vels),(states.get(String(current_vels)) || 0) + 1)
		if (i % MARKER == 0) console.log(i, STEPS/MARKER)
	}
	console.log([...states].sort((b,a)=>a[1]-b[1]))
	displayOut(1, [...moons].reduce((acc,v)=>acc+v.total_energy(),0))
}

function main2() {
	let moons = getIn().split("\n")
	moons = moons.map(coords=>({x:Number(coords.match(/x=(-?\d+)/)[1]),
		y:Number(coords.match(/y=(-?\d+)/)[1]),
		z:Number(coords.match(/z=(-?\d+)/)[1])}))
	moons = moons.map(coords=>new Moon(new Coord(coords.x,coords.y,coords.z)))
	moons = new Set(moons)
	let current_coords = []
	let current_vels = []
	for (const moon of moons) {
		current_coords.push(moon.pos)
		current_vels.push(moon.vel)
	}
	let states = new Map()
	states.set(String(current_vels),(states.get(String(current_vels)) || 0) + 1)

	let i
	for (i = 0; i < 100000; i++) {
		break
		for (const moon of moons) {
			let others = new Set(moons)
			others.delete(moon)
			for (const other of others) {
				moon.calc_grav_vel(other)
			}
		}
		for (const moon of moons) {
			moon.apply_velocity()
		}
		if ([...moons].every(m=>m.vel.z == 0)) console.log(String(current_coords),String(current_vels),i+1)
	}
	function gcd(a,b) {
		if (a<b) [a,b] = [b,a]
		while (b) [a,b] = [b, a%b]
		return a
	}
	function lcm(a,b) {
		return a/gcd(a,b)*b
	}
//	let things = [9,14,22]
//	let things = [1014,2949,2351]
	let things = [80714,83812,96526]
	console.log(gcd(things[0],things[1]))
	console.log(gcd(things[2],things[1]))
	console.log(gcd(things[2],things[0]))
	let result = things.reduce(lcm)*2
	displayOut(2, result)
}
