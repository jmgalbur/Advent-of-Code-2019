// So I spent like 45 minutes trying to figure out how I could have this function be async and
// wait for an input buffer to fill, or signal an output buffer when I output.
// But that's hard, so I tried to see if pausing the program as a thunk would work, and it did!
// In order to do that, I had to allow the program to start at an arbitrary point, so redefined pc as a parameter.
function runprogram(program, pc, inputarr, outputarr) {
	let a1,a2,a3
	while(1) {
		let op = decode_opcode(program[pc])
		switch (op.code) {
			case 1:
				[a1, a2, a3] = program.slice(pc+1, pc+1+3)
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
				break
			case 3:
				[a1] = program.slice(pc+1, pc+1+1)
				if (!inputarr.length) return _=>runprogram(program, pc, inputarr, outputarr)
// Here's returning a thunk if we need the caller to generate more input
// I was worried that calling this multiple times would make the closure grow bigger and bigger, but it seems to stay the same.
				program[a1] = inputarr.shift()
				pc+=2
				break
			case 4:
				[a1] = program.slice(pc+1, pc+1+1)
				if (!op.p1_imm) a1 = program[a1]
				outputarr.push(a1)
				pc+=2
				break
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

function decode_opcode(op) {
	let operation = {}
	operation.code = op % 100; op=Math.floor(op/100)
	operation.p1_imm = op%2; op=Math.floor(op/10)
	operation.p2_imm = op%2; op=Math.floor(op/10)
	operation.p3_imm = op
	return operation
}

function main() {
	let program = getIn().split(",").map(Number)
// Figuring this part out, too, was fun
	let permutations = []
	for (let i = 0; i <= 43210; i++) permutations.push(String(i).padStart(5, '0'))
// make sure if you set the max permutation this way, you use <= rather than <
// if your array doesn't have 5! == 120 elements, something's wrong
	permutations = permutations.filter(x=>/(?=.*0)(?=.*1)(?=.*2)(?=.*3)(?=.*4)/.test(x))
// we know the number string will be 5 digits long, so as long as it has a 0, a 1... it'll have one of each!
	let thrusts = permutations.map(perm => {
		let mapping = {perm:perm}
		let input = [0]
		let output = []
		for (let i = 0; i < 5; i++) {
			input.unshift(Number(perm[i]))
			runprogram(program.slice(), 0, input, output)
// don't need our thunks yet, just pass the pipe around.
			input = output
			output = []
		}
		mapping.thrust = input[0]
		return mapping
	})
	thrusts.sort((a,b)=>b.thrust-a.thrust)
	console.log(thrusts)
	displayOut(1, thrusts[0].thrust)
}

function main2() {
	let program = getIn().split(",").map(Number)
	let permutations = []
	for (let i = 56789; i <= 98765; i++) permutations.push(String(i))
	permutations = permutations.filter(x=>/(?=.*5)(?=.*6)(?=.*7)(?=.*8)(?=.*9)/.test(x))
	console.log(permutations)
	let thrusts = permutations.map(perm => {
		let mapping = {perm:perm}
		let pipes = new Array(5).fill(null).map(_=>[])
// imo, better than typing [[],[],[],[],[]]
		let runtimes = []
		for (let i = 0; i < pipes.length; i++) {
			pipes[i].unshift(Number(perm[i]))
// could've done .push(), but previously the first input pipe had 0 for the second input, so needed to put the permutation number at the front
			runtimes.push(runprogram(program.slice(), 0, pipes[i], pipes[(i+1)%5]))
// these beautiful thunks
		}
		pipes[0].push(0)
		while (runtimes.length) {
			let res = runtimes.shift()()
			if (res instanceof Function) runtimes.push(res)
		}
		mapping.thrust = pipes[0][0]
// first input pipe is last output pipe
		return mapping
// oh, right, we're in a map function
	})
	thrusts.sort((a,b)=>b.thrust-a.thrust)
	console.log(thrusts)
	displayOut(2, thrusts[0].thrust)
}
