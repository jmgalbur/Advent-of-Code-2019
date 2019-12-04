// ngl, I hated this one. I wish that JS had a standard shapes library.
// I'm not against importing, I just didn't strongly consider it at the time.

function main() {
	let input = getIn().split("\n").map(x=>x.split(",").map(y=>[y[0], Number(y.substring(1))]))
// Alright, two wires, which we'll store as arrays of direction strings and magnitudes. (so vectors)
	let line_maps = input.map(x=>x.reduce(fill_in_lines, [{end:{x:0,y:0}}]).slice(1))
// Actually, vectors aren't so helpful. Let's start from (0,0) and turn them into line segments.
// Since we only need the end point of the previous line segment, our dummy first one can just have an end property,
// and then we'll throw it away after making our list
	line_maps = line_maps.map(x=>x.map(organize))
// To simplify the intersection logic, I turn L's -> R's and D's -> U's
	let intersections = line_maps[0].map(x=>line_maps[1].map(y=>intersection(x,y)).filter(z=>z)).filter(z=>z.length).flat()
// A nested map. Yuck. Basically, for each segment in the first wire, make a list of segments in the second wire that intersect.
// Then, erase all the entries in those lists that are null (no intersection).
// _Then_, erase all the empty lists (segments in the first wire that didn't have an intersection buddy
// _And then_, use JS's handy-dandy Array flattener 'cuz ain't nobody got time for that.
	displayOut(1, intersections.map(int=>Math.abs(int.x)+Math.abs(int.y)).sort((a,b)=>a-b).join("\n")) // answer is top non-zero number
// So, you've noticed I print out a bunch distances for my first "answer".
// I'm paranoid that someone else's input will allow (0,0) to be an intersection that shows up, so I'm not going to write
// logic to display the second distance only if the first distance is 0.
// My philosophy is not that my program needs to give me the answer for the challenges.
// It is fine by me if I only write enough to bring the output space to a manageable size, where I can quickly find or eliminate solutions.
// AoC 2018 day 10 is a good example, where we're given a list of star positions and velocities and need to find the image they'll align to make and when they do so.
// Way too complicated, for me, to write a program to recognize when the stars align. Way easier to make a viewer, estimater, fudger, that tells me certain windows of time are probable/interesting.

// Anyway, take each intersection position and find the Manhattan distance from (0,0), which'll be simply |x|+|y|.
}

function fill_in_lines(line_list, direction) {
	let last = line_list[line_list.length - 1]
	let next = {start:last.end, dir:direction[0]}
	switch(next.dir) {
		case "R":
			next.end = {x:next.start.x + direction[1], y:next.start.y}
			break
		case "L":
			next.end = {x:next.start.x - direction[1], y:next.start.y}
			break
		case "U":
			next.end = {x:next.start.x, y:next.start.y + direction[1]}
			break
		case "D":
			next.end = {x:next.start.x, y:next.start.y - direction[1]}
			break
	}
	line_list.push(next)
	return line_list
}
// This logic was too long to think clearly through as an arrow function, but don't be fooled, it _is_ a single-use nonymous function.

function organize(a) {
	let dir
	switch (a.dir) {
		case "D":
			dir = "U"
			break
		case "L":
			dir = "R"
			break
		default:
			return a
	}
	return {dir:dir, start:a.end, end:a.start}
}

function intersection(a, b) {
	let point
	let horiz, vert
	if (a.dir == b.dir) {
		return null
	}
	[horiz, vert] = a.dir == "R" ? [a, b] : [b, a]
	point = {x:vert.start.x, y:horiz.start.y}
	if (point.x > horiz.end.x || point.x < horiz.start.x || point.y > vert.end.y || point.y < vert.start.y) {
		return null
	} else {
		return point
	}
}
// If the line segments are parallel, no intersection.
// Otherwise, take the point where the _lines_ interset, and see if that point is within the bounding box represented by the line segments.

// So for this problem, when I went from vectors to line segments, I threw away the length code, so now is as good a time as any to refactor with some OOP.
// (even if the main code is unreadable as all get-out.
function main2() {
	let input = getIn().split("\n").map(x=>x.split(",").map(Vector))
// getcha vectors here
	let line_maps = input.map(x=>x.reduce((acc,v)=>{acc.lines.push(LineSegment(acc.pt,v));acc.pt=v.go(acc.pt);return acc}, {lines:[],pt:Point(0,0)}).lines)
// The starting accumulator for this function is an object with the in construction list of line segments and the previous end point.
// The reducer function will update the ending point and add to the accumulator list.
// Then we throw away the last endpoint, since we only need the list.
	let intersections = line_maps[0].map(a=>line_maps[1].map(b=>LineSegment.intersection(a,b)).filter(z=>z)).filter(z=>z.length).flat()
// Make list of intersections, use the lifesaver flatten thing.
	let positions = intersections.map(int=>({int:int,fromFirst:line_maps[0].findIndex(ls=>ls.pointOnLine(int)),fromSecond:line_maps[1].findIndex(ls=>ls.pointOnLine(int))}))
// For each intersection, find out which line segment it intersects with for each line.
	let distances = positions.map(pos=>({first_distance:line_maps[0].slice(0,pos.fromFirst).reduce((acc,v)=>acc+v.length,0)+Point.distance(line_maps[0][pos.fromFirst].start,pos.int),second_distance:line_maps[1].slice(0,pos.fromSecond).reduce((acc,v)=>acc+v.length,0)+Point.distance(line_maps[1][pos.fromSecond].start,pos.int)})).sort((a,b)=>(a.first_distance+a.second_distance)-(b.first_distance+b.second_distance))
// Slice the list for each wire up to the found index, and add up that length of wire.
// Find where on the line segment the intersection is and add that to the length of wire.
// Then sort these distances by total length of wire
	displayOut(2,distances[0].first_distance+distances[0].second_distance)
// First element is the one we want. Output the total distance Eric Wastl is asking for.
}

function Vector(str) {
	if (!(this instanceof Vector)) return new Vector(str)

	this.dir = str[0]
	this.mag = Number(str.substring(1))

}
// feed this a point, and you can get an endpoint for a linesegment
Vector.prototype.go = function(pt) {
	switch (this.dir) {
		case "R":
			return new Point(pt.x+this.mag,pt.y)
			break
		case "L":
			return new Point(pt.x-this.mag,pt.y)
			break
		case "U":
			return new Point(pt.x,pt.y+this.mag)
			break
		case "D":
			return new Point(pt.x,pt.y-this.mag)
			break
	}
}

function Point(x,y) {
	if (!(this instanceof Point)) return new Point(x,y)
	this.x = x
	this.y = y
}
// Manhattan distance. Works nicely for determining intersection below since all lines will be strictly horizontal/vertical
Point.distance = function(a,b) {
	return Math.abs(a.x-b.x) + Math.abs(a.y-b.y)
}

function LineSegment(pt, v) {
	if (!(this instanceof LineSegment)) return new LineSegment(pt, v)
	this.start = pt
	this.v = v

	this.end = v.go(pt)
	this.length = v.mag
	this.orient = /^R|L$/.test(v.dir) ? "H" : "V"
// RegExp.prototype.test() will search the string to see if there's a match, so a good idea to remember to add anchors when needed.
// Not strictly needed here, but, hey, why not?
}
// I don't know why I do, but I love that this works. Based on triangle inequality (3 points form triangle if the largest side is smaller than the sum of the other two. If not, the 3 points are collinear)
LineSegment.prototype.pointOnLine = function(pt) {
	return Point.distance(this.start,pt) + Point.distance(pt,this.end) == this.length
}
// This works mostly the same as the code in first main:
// If lines parallel, no intersection.
// Construct point where _lines_ meet
// Only this time, strictly check if the point is on both lines, since we have the functionality to do that
LineSegment.intersection = function(a, b) {
	if (a.orient == b.orient) return null
	let pt
	if (a.orient == "H") pt = Point(b.start.x,a.start.y)
	else pt = Point(a.start.x,b.start.y)
	return a.pointOnLine(pt) && b.pointOnLine(pt) ? pt : null
}
