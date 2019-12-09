function runprogram(program, pc, inputarr, outputarr) {
	let a1,a2,a3
	let relative_base = 0
	function figure_param(oper, paramNum, val) {
		switch (oper.param_modes[paramNum]) {
			case "0":
				return program[val] || 0
// coerce undefined to 0, for those values beyond defined memory
			case "1":
				return val
			case "2":
				return program[relative_base + val] || 0
		}
	}
	function assign_param(oper, paramNum, val, assign) {
		switch (oper.param_modes[paramNum]) {
			case "0":
				program[val] = assign
				return
// we were promised that any parameter being assigned to would never be in immediate mode
			case "2":
				program[relative_base + val] = assign
				return
		}
	}
	while(1) {
		let op = decode_opcode(program[pc])
		switch (op.code) {
			case 1:
				[a1, a2, a3] = program.slice(pc+1, pc+1+3)
// ugggh, need to change all the figures and assigns
				a1 = figure_param(op, 0, a1)
				a2 = figure_param(op, 1, a2)
				assign_param(op, 2, a3, a1+a2)
				pc+=4
				break
			case 2:
				[a1, a2, a3] = program.slice(pc+1, pc+1+3)
				a1 = figure_param(op, 0, a1)
				a2 = figure_param(op, 1, a2)
				assign_param(op, 2, a3, a1*a2)
				pc+=4
				break
			case 3:
				[a1] = program.slice(pc+1, pc+1+1)
				if (!inputarr.length) return _=>runprogram(program, pc, inputarr, outputarr)
				assign_param(op, 0, a1, inputarr.shift())
				pc+=2
				break
			case 4:
				[a1] = program.slice(pc+1, pc+1+1)
				a1 = figure_param(op, 0, a1)
				outputarr.push(a1)
				pc+=2
				break
			case 5:
				[a1, a2] = program.slice(pc+1, pc+1+2)
				a1 = figure_param(op, 0, a1)
				a2 = figure_param(op, 1, a2)
				if (a1) pc = a2
				else pc+=3
				break
			case 6:
				[a1, a2] = program.slice(pc+1, pc+1+2)
				a1 = figure_param(op, 0, a1)
				a2 = figure_param(op, 1, a2)
				if (!a1) pc = a2
				else pc+=3
				break
			case 7:
				[a1, a2, a3] = program.slice(pc+1, pc+1+3)
				a1 = figure_param(op, 0, a1)
				a2 = figure_param(op, 1, a2)
				assign_param(op, 2, a3, a1<a2 ? 1 : 0)
				pc+=4
				break
			case 8:
				[a1, a2, a3] = program.slice(pc+1, pc+1+3)
				a1 = figure_param(op, 0, a1)
				a2 = figure_param(op, 1, a2)
				assign_param(op, 2, a3, a1==a2 ? 1 : 0)
				pc+=4
				break
			case 9:
				[a1] = program.slice(pc+1, pc+1+1)
				a1 = figure_param(op, 0, a1)
				relative_base += a1
				pc+=2
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
	let modes = String(op).padStart(5, "0").slice(0,3)
// this is the best of both worlds thing I couldn't be bothered to find on day 5(?)
	operation.code = op % 100;
	operation.param_modes = [...modes].reverse()
	return operation
}

function main() {
	let program = getIn().split(",").map(Number)
	let input = [1]
	let output = []
	runprogram(program.slice(), 0, input, output)
	displayOut(1, output.filter(x=>x))
}

function main2() {
	let program = getIn().split(",").map(Number)
	let input = [2]
	let output = []
	runprogram(program.slice(), 0, input, output)
	displayOut(2, output.filter(x=>x))
}
// also thankful that Eric Wastl's "large numbers" just barely fit in Number, and I didn't have to convert to BigInt. Hahaha, YET!
