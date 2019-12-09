function main() {
	let program = getIn()
	const wide = 25
	const high = 6
	let numlayers = program.length / wide / high
// nvm
	let layers = program.replace(/\d{150}/g,m=>m+" ").split(" ").filter(x=>x)
// TFW you realize you coulda just used program.match(/\d{150}/g)
	let counts = layers.map(lay=>({zeros:lay.match(/0/g).length,ones:lay.match(/1/g).length,twos:lay.match(/2/g).length}))
	let layer_of_choice = counts.sort((a,b)=>a.zeros-b.zeros)[0]
// check out my new layer, layer of choice
	displayOut(1, layer_of_choice.ones * layer_of_choice.twos)
}

function main2() {
	let program = getIn()
	let layers = program.replace(/\d{150}/g,m=>m+" ").split(" ").filter(x=>x)
// TFW
	let stacks = layers.reduce((acc,v)=>{[...v].forEach((cv,i)=>acc[i].push(cv));return acc},new Array(25*6).fill(null).map(_=>[]))
// transform the list of layers into a list, for each pixel, of the pixel's value per layer
	stacks = stacks.map(pix=>pix.join("")).map(pix=>pix.match(/(0|1)/)[0]).join("")
// join each pixel list into a string, search that for the first nontransparent, then join all these into a "result layer"
	stacks = stacks.replace(/\d{25}/g,m=>m+"\n").replace(/0/g,"\u25a0").replace(/1/g,"\u25a1")
// I used " " and "X", which looked fine in a console.log, but were unintelligible in the output tag since the font wasn't being rendered monospace.
// So I could add a style attribute to the output tag, OR, I could use unicode black/white squares, which are fixed width.
// Also, I have the squares mapped here to what the problem said 0/1 were, which I found hard to read. Swapping /0/g and /1/g might make it more readable for you.
	displayOut(2, stacks)
}
