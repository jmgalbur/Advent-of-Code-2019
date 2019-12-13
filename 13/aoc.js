function runprogram(program, pc, rel_base, inputarr, outputarr) {
	let a1,a2,a3
	function figure_param(oper, paramNum, val) {
		switch (oper.param_modes[paramNum]) {
			case "0":
				return program[val] || 0
			case "1":
				return val
			case "2":
				return program[rel_base + val] || 0
		}
	}
	function assign_param(oper, paramNum, val, assign) {
		switch (oper.param_modes[paramNum]) {
			case "0":
				program[val] = assign
				return
			case "2":
				program[rel_base + val] = assign
				return
		}
	}
	while(1) {
		let op = decode_opcode(program[pc])
		switch (op.code) {
			case 1:
				[a1, a2, a3] = program.slice(pc+1, pc+1+3)
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
				if (!inputarr.length) return _=>runprogram(program, pc, rel_base, inputarr, outputarr)
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
				rel_base += a1
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
	operation.code = op % 100;
	operation.param_modes = [...modes].reverse()
	return operation
}

function main() {
	let program = getIn().split(",").map(Number)
	let input = []
	let output = []
	let prog = runprogram(program.slice(), 0, 0, input, output)
	output = output.filter((x,i)=>i%3==2).filter(x=>x==2)
	displayOut(1, output.length)
}

function main2() {
	let program = getIn().split(",").map(Number)
	let input = []
	let output = []

	program[0] = 2

	let ball_x,paddle_x

	let grid = new Array(25).fill(null).map(x=>new Array(42).fill(null))

	function render() {
		let info = output.slice()
		let x,y,t
		let score
		while (info.length) {
			[x,y,t, ...info] = info
			if (x == -1) score = t
			else switch (t) {
				case 0:
					grid[y][x] = " "
					break
				case 1:
					grid[y][x] = "W"
					break
				case 2:
					grid[y][x] = "B"
					break
				case 3:
					grid[y][x] = "^"
					paddle_x = x
					break
				case 4:
					grid[y][x] = "o"
					ball_x = x
					break
			}
		}
		let display = grid.map(row=>row.join("")).join("\n")
		
		output.length = 0
		displayOut(3, display)
		if (score != undefined) displayOut(4, score)
	}

	let prog = runprogram(program.slice(), 0, 0, input, output)
	render()
	while (prog instanceof Function) {
		let space = ball_x - paddle_x
		input.push(space/Math.abs(space))
		prog = prog()
		render()
	}
	displayOut(2, "general kenobi")
}
