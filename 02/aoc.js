function main() {
	let input = getIn().split(",").map(Number)
	input[1] = 12
	input[2] = 2

// We're building an interpreter, boys and girls!
// Start at the beginning and evaluate each opcode.
// Only gotcha here is that the instruction parameters are themselves addresses, so we have to do an awkward nested dereference-ing thing-a-ma-bob.

	let pc = 0;
	while(1) {
		switch(input[pc]) {
			case 1:
				input[input[pc+3]] = input[input[pc+1]] + input[input[pc+2]]
				pc+=4
				break
			case 2:
				input[input[pc+3]] = input[input[pc+1]] * input[input[pc+2]]
				pc+=4
				break
			case 99:
				displayOut(1, input[0])
				return
			default:
				return
		}
	}
}

// For the second part, wanted to be able to loop through nouns and verbs without having to return from main2() to escape the while(1), so I had to bring the interpreter for given inputs into another function.

function runprogram(input, noun, verb) {
	input[1] = noun
	input[2] = verb

	let pc = 0;
	while(1) {
		switch(input[pc]) {
			case 1:
				input[input[pc+3]] = input[input[pc+1]] + input[input[pc+2]]
				pc+=4
				break
			case 2:
				input[input[pc+3]] = input[input[pc+1]] * input[input[pc+2]]
				pc+=4
				break
			case 99:
				return input[0]
			default:
				return input[0]
		}
	}
}
function main2() {
	const endresult = 19690720 // might be different from yours // oh wait, nvm, 1969-07-20 was when we faked the moon landing :kappa:
	let masterinput = getIn().split(",").map(Number)
	for (let aa = 0; aa <= 99; aa++) {
		for (let bb = 0; bb <= 99; bb++) {
			if (runprogram(masterinput.slice(), aa, bb) == endresult) {
// Also, the program is self modifying, so have to give it a different, fresh copy of the state each time it's run
				displayOut(2, 100 * aa + bb)
				return
			}
		}
	}
}
