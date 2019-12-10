function Point(x,y) {
	this.x = x
	this.y = y
	this.lines_of_sight = new Set()
}

function Ray(origin, terminal) {
	this.x = terminal.x - origin.x
	this.y = terminal.y - origin.y
	this.normalize()
}

function gcd(a,b) {
	if (a < b) [a,b] = [b,a]
	if (b == 0) return a
	return gcd(b, a%b)
}
// Apparently tail call optimization isn't supported in most JS engines.
// Since this function uses Euclid's algorithm, the stack might overflow
// if we input 2 large consecutive Fibonacci numbers.
// Not a problem for this problem, though.
// Iterative implementation would look like:
/*
function gcd(a,b) {
	if (a < b) [a,b] = [b,a]
	while (b) [a,b] = [b, a%b]
	return a
}
*/

Ray.prototype.normalize = function() {
	let div = gcd(Math.abs(this.x), Math.abs(this.y))
	this.x = Math.trunc(this.x/div)
	this.y = Math.trunc(this.y/div)
}

Ray.prototype.getUniqueId = function() {
	return String([this.x,this.y])
}
// Rays with the same x and y might not be counted as "same" by JS Set, so we return a string that is unique to x,y to use for Set elements

let mon_loc
let points
// we did this work in step 1, might as well let step 2 use it

// the crux of the solution for problem 1 is that we can find
// every line of sight from 1 asteroid to the rest.
// However, we'll normalize each line of sight so that asteroids in a row
// will have the "same" line of sight.
// Then we'll put these in a Set so that duplicates are eliminated.
// We brute force this for every asteroid, then sort. (No "since I see you, you see me" logic)
function main() {
	let input = getIn().split("\n").map(x=>x.split(""))
	points = []
	for (y in input) {
		for (x in input[y]) {
			if (input[y][x] == "#") {
				points.push(new Point(x,y))
			}
		}
	}
	for (point of points) {
		let other_points = new Set(points)
		other_points.delete(point)
		for (other of other_points) {
			point.lines_of_sight.add(new Ray(point, other).getUniqueId())
		}
	}
	points.sort((b,a)=>a.lines_of_sight.size-b.lines_of_sight.size)
	displayOut(1, points[0].lines_of_sight.size)
	mon_loc = points[0]
}

// Alright, we have the lines of sight, now to sort them "around the clock"
// I knew we wanted trig functions, and we had an x and y, so maybe tan?
// No, need the reverse, atan.
// But atan only works for half the circle, since x/y = -x/-y.
// Thank goodness for atan2!
// So now, if we can sort the lines of sight, we can iterate through however many passes we need to find the 200th asteroid
// Problem: our coordinate system is different from Math.atan2, and I want to get done quickly to beat everyone else, so put random configs until it looks right!!?! (Done)
// But now I can prove correctness:
// [img1] is Math.atan2's coord-system, plus sorting of values. Its signature is (y,x), which'll be confusing, so using α and β for first and second param
// [img2] is problem's coord-system, plus the sorting we need for the laser sweep problem
// So [img3] is the gymnastics we do to align the sorting, and shows that Math.atan2's arguments need to be α = -x and β = y.
// In addition, since we're using -x, we'll be using -0 and getting a low value of -π
// and thus we'll START the sweep from straight up
// rather than END the sweep at straight up,
// which aligns with the problem description

// I shall also assume that the 200th line of sight has only one asteroid,
// and there are at least 200 unique lines of sight,
// for my sake, rather than correctness'.
// If the answer for your input is wrong, that's probably why.
// I have left a console.log to investigate should that be the case
function main2() {
	let angles = new Map()
	for (line of mon_loc.lines_of_sight) {
		angles.set(line, [])
	}
	let other_points = new Set(points)
	other_points.delete(mon_loc)
	for (other of other_points) {
		let ray = new Ray(mon_loc, other)
		angles.get(ray.getUniqueId()).push([ray,other])
	}
	angles = [...angles].sort((a,b)=>Math.atan2(-a[1][0][0].x,a[1][0][0].y)-Math.atan2(-b[1][0][0].x,b[1][0][0].y))
// My apologies. Maps turned into Arrays are ugly.
	console.log(angles)
	let twohundredth = angles[200-1][1][0][1]
	displayOut(2, +twohundredth.x*100+ +twohundredth.y)
// x and y are strings
}
