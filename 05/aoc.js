// that moment when a 2 looks like a 1 for the longest time. ARRGH!!

// so with the re-use of day 2, and needing to further decode opcodes, I tried to do OOP.
// but it was more convenient for everything to have access to everything, so I instead went procedural (after, like, 40 minutes)
// main take-away is, when you're copying lines from 1 part to the other 'cuz the operation is similar, ALWAYS look for typos.
// Or name your positional variables alpha, bravo, charley
function runprogram(program, inputarr, outputarr) {
	let pc = 0;
	let a1,a2,a3
// I tried doing lets inside the switch block, but I didn't totally get the scoping rules.
// sounds like if I made each case a big block statement, it woulda worked. I'm not a fan of the syntax, so no thanks
	while(1) {
		let op = decode_opcode(program[pc])
		switch (op.code) {
			case 1:
				[a1, a2, a3] = program.slice(pc+1, pc+1+3)
// I love that assignment syntax
				if (!op.p1_imm) a1 = program[a1]
				if (!op.p2_imm) a2 = program[a2]
				program[a3] = a1 + a2
				pc+=4
				break
			case 2:
				[a1, a2, a3] = program.slice(pc+1, pc+1+3)
				if (!op.p1_imm) a1 = program[a1]
				if (!op.p2_imm) a2 = program[a2]
				program[a3] = a1 * a2
				pc+=4
// also make sure every opcode updates pc. That was a good 5 wasted minutes right there.
				break
			case 3:
				[a1] = program.slice(pc+1, pc+1+1)
				program[a1] = inputarr.shift()
// in case you didn't know, .push() and .shift() are how you use Arrays as queues
// you can also do .unshift() and .pop(), but, no
				pc+=2
				break
			case 4:
				[a1] = program.slice(pc+1, pc+1+1)
				if (!op.p1_imm) a1 = program[a1]
				outputarr.push(a1)
				pc+=2
				break
// so weird/cool how one change of input makes the program require all new opcodes
			case 5:
				[a1, a2] = program.slice(pc+1, pc+1+2)
				if (!op.p1_imm) a1 = program[a1]
				if (!op.p2_imm) a2 = program[a2]
				if (a1) pc = a2
				else pc+=3
				break
			case 6:
				[a1, a2] = program.slice(pc+1, pc+1+2)
				if (!op.p1_imm) a1 = program[a1]
				if (!op.p2_imm) a2 = program[a2]
				if (!a1) pc = a2
				else pc+=3
				break
			case 7:
				[a1, a2, a3] = program.slice(pc+1, pc+1+3)
				if (!op.p1_imm) a1 = program[a1]
				if (!op.p2_imm) a2 = program[a2]
				program[a3] = a1<a2 ? 1 : 0
				pc+=4
				break
			case 8:
				[a1, a2, a3] = program.slice(pc+1, pc+1+3)
				if (!op.p1_imm) a1 = program[a1]
				if (!op.p2_imm) a2 = program[a2]
				program[a3] = a1==a2 ? 1 : 0
				pc+=4
				break
			case 99:
				return
			default:
				console.log("something went wrong")
				console.log(program)
				console.log(op)
				return
		}
	}
}

// the biggest bug here was re-realizing JS doesn't have integer divide.
// Remember kids, JS has Numbers, not Floats and Ints and whatever
// Ironically, had I just done my first approach of num->string->interpretation, I could've side-stepped all that, but whatevs
// I ultimately didn't do that because it felt weird to turn the operation part of the opcode to string and then back to Number.
function decode_opcode(op) {
	let operation = {}
	operation.code = op % 100; op=Math.floor(op/100)
	operation.p1_imm = op%2; op=Math.floor(op/10)
	operation.p2_imm = op%2; op=Math.floor(op/10)
	operation.p3_imm = op
	return operation
}

// If only there weren't the mess of code above. Everything looks idyllic from the top-level function.
// Stuff like "call subroutine do_simulation" makes me think y'all have a Picard complex, mains()
function main() {
	let program = getIn().split(",").map(Number)
	let input = [1]
	let output = []
	runprogram(program, input, output)
	displayOut(1, output.filter(x=>x))
}

function main2() {
	let program = getIn().split(",").map(Number)
	let input = [5]
	let output = []
	runprogram(program, input, output)
	displayOut(2, output.filter(x=>x))
}
