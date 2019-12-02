function main() {
	let input = getIn()
	input = input.split("\n").map(Number).map(x=>Math.floor(x/3)-2).reduce((acc,next)=>acc+next)

	// 1. Get our big input as a hunk of text numbers on separate lines.
	// 2. Split into array of text numbers, which will have no empty strings provided the input is flush against the <pre> </pre> tags.
	// 3. Run every text number through Number() to get a number number module mass.
	// 4. Every module is significantly massive, so no filtering needed. Take every mass through the problem's fuel-finding algorithm which has been coded as an arrow function (JS's lambda).
	// 5. Add all the fuel masses together and stick it back into input.

	displayOut(1, input)
}
function main2() {
	let totalFuel = 0
	let masses = getIn().split("\n").map(Number)
	while (masses.length) {
		masses = masses.map(x=>Math.floor(x/3)-2)
		totalFuel += masses.reduce((acc,v)=>acc+v)
		masses = masses.filter(x=>x>=9)
	}

	// 1. For our first run through, masses is filled with module masses, not fuel masses, which are massive, so we likely don't need to filter them.
	// 2. Replace masses list with the fuel needed masses.
	// 3. Add those into totalFuel
	// 4. Based on the algorithm, if we have 8 mass units or less, that thing doesn't need fuel, so we can pull that measurement out of the "calculate fuel needed for that fuel" loop.
	// 5. Rinse and repeat until the masses list is empty.

	displayOut(2, totalFuel)
}
