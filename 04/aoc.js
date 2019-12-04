// Ah yes, nothing some good 'ol regex can't solve
function main() {
	let input = getIn().split("-").map(Number)
	let total = []
	for (let i = input[0]; i <= input[1]; i++) {
		if (/(\d)\1/.test(i) && /^0*1*2*3*4*5*6*7*8*9*$/.test(i)) total.push(i)
// I'm embarrassed how long it took me to remember /(\d){2}/ doesn't do what /(\d)\1/ does. (any 2 digits vs. a digit followed by same digit)
// The second regex just makes sure that the numbers are strictly increasing. The empty string would match this regex, but I'm not testing the empty string, now, am I?
// And yes, that is type coercion you're observing. But it works, so I'm not complaining.
	}
	displayOut(1, total.length)
}

// I tried for a while on this using regex, but I couldn't figure out, even with look-behinds, how to match a group of ONLY two repeated numbers.
// Oh well, tokenization to the rescue
function main2() {
	let input = getIn().split("-").map(Number)
	let total = []
	for (let i = input[0]; i <= input[1]; i++) {
		if (!/(\d)\1/.test(i) || !/^0*1*2*3*4*5*6*7*8*9*$/.test(i)) continue
// All this looks familiar
		let str = String(i).replace(/(\d)(?!\1)/g, (m,p1)=>p1+" ").split(" ")
// Look for every digit that's doesn't have its repeat after it.
// I tried matching the transition boundary and putting a space in between, but then you couldn't match the second digit if it was all by itself.
// so, ...replace(/(\d)(?!\1)(\d)/g, (m,p1,p2)=>p1+" "+p2)... wouldn't let me capture p2 again, so 123456 would look like "1 23 45 6" instead of "1 2 3 4 5 6 "
		if (str.some(x=>x.length==2)) total.push(i)
// is one of those blocks 2 digits long? great, I want that number
	}
	displayOut(2, total.length)
}
