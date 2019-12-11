function runprogram(program, pc, rel_base, inputarr, outputarr) {
	let a1,a2,a3
// AARAUGAUHGUAGHRUAGHUARHGGH
// I was getting gibberish in part 2 because I didn't realize that everytime
// the thunk unpaused the program, the relative base was reset to 0.
// ARUARUHGARUHARRGARHGAURHGAURGHAAUAURAHRHAURGAUR
// I have fixed that issue now
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

// Alright, this was relatively easy.
// Basically we just need to keep track of which tiles we've traversed.
// A Map's a good job for that.
function main() {
	let program = getIn().split(",").map(Number)
	let input = []
	let output = []
	let coords = {x:0,y:0,d:0}
	const dir = [{x:0,y:1},{x:1,y:0},{x:0,y:-1},{x:-1,y:0}]
	const c_to_str = () => String([coords.x, coords.y])
// here's our Map key generator
	const change_dir = x => {coords.d+=2*x-1;coords.d+=4;coords.d%=4}
// 0,1 to 0,2 to -1,1
	const move_forward = () => {coords.x+=dir[coords.d].x;coords.y+=dir[coords.d].y}
	let grid = new Map()
	let prog = runprogram(program.slice(), 0, 0, input, output)
	while (prog instanceof Function) {
		input.push(grid.get(c_to_str()) || 0)
// undefined to 0
		prog = prog()
		grid.set(c_to_str(), output.shift())
		change_dir(output.shift())
		move_forward()
	}
	displayOut(1, grid.size)
}

// This part was also relatively easy
// IF YOUR RELATIVE BASE WORKS WHEN YOU UNPAUSE THE FUNCTION!!!
// ARGARUGARRGAHUAURGAGRAURGAHRUAGHAURHGAGAGGGARUHARUHGR
function main2() {
	let program = getIn().split(",").map(Number)
	let input = []
	let output = []
	let coords = {x:0,y:0,d:0}
	const dir = [{x:0,y:1},{x:1,y:0},{x:0,y:-1},{x:-1,y:0}]
	const c_to_str = () => String([coords.x, coords.y])
	const change_dir = x => {coords.d+=2*x-1;coords.d+=4;coords.d%=4}
	const move_forward = () => {coords.x+=dir[coords.d].x;coords.y+=dir[coords.d].y}
	let grid = new Map(); grid.set(c_to_str(), 1)
	let prog = runprogram(program.slice(), 0, 0, input, output)
	while (prog instanceof Function) {
		input.push(grid.get(c_to_str()) || 0)
		prog = prog()
		grid.set(c_to_str(), output.shift())
		change_dir(output.shift())
		move_forward()
	}
	let tiles = [...grid].map(x=>[x[0].split(","),x[1]]).map(v=>({x:Number(v[0][0]),y:Number(v[0][1]),c:v[1]}))

	let min_x = tiles.reduce((min,v)=>v.x<min?v.x:min,Infinity)
	let max_x = tiles.reduce((max,v)=>v.x>max?v.x:max,-Infinity)

	let min_y = tiles.reduce((min,v)=>v.y<min?v.y:min,Infinity)
	let max_y = tiles.reduce((max,v)=>v.y>max?v.y:max,-Infinity)
// Arrays don't like negative values. Let's figure out what we'll have to shift by to fill the string grid

	let out_grid = new Array(max_y-min_y+1).fill(null).map(row=>new Array(max_x-min_x+1).fill("\u25a0"))
	for (coord of tiles) {
		if (coord.c) out_grid[coord.y-min_y][coord.x-min_x] = "\u25a1"
	}
	out_grid = out_grid.map(row=>row.join("")).reverse().join("\n")
// The reverse() is important. Our y=min_y belongs on the bottom of the output, not the top
	console.log(out_grid)
	displayOut(2, out_grid)
	document.getElementById("output2").style = "line-height:50%"
}
