let isMouseDown=false;

//buttons and their corresponding events
let btnClear = document.querySelector('#clear');
btnClear.addEventListener('click',clear,false);

let btnSave = document.querySelector('#save');
btnSave.addEventListener('click',save,false);

let btnUndo = document.querySelector('#undo');
btnUndo.addEventListener('click', undo, false);

let colorPicker = document.querySelector('#colorPicker');
colorPicker.addEventListener('input', colorChanged, false);

let imgPreview = document.querySelector('#preview');

//canvas stuff
let canvas = document.getElementById("canvas");
canvas.addEventListener('mousedown', mouseDown, false);
canvas.addEventListener('mousemove', mouseMove, false);
canvas.addEventListener('mouseup', mouseUp, false);

let ctx = canvas.getContext("2d");
ctx.fillStyle = ctx.strokeStyle = colorPicker.value;

//event handlers
function mouseDown(e){
	isMouseDown = true;
	draw(e.clientX, e.clientY);
}
function mouseMove(e){
	if(isMouseDown){
		draw(e.clientX, e.clientY);
	}
}
function mouseUp(e){
	isMouseDown = false;
	getPreview();
}
function clear(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function save(){
  alert('this is just a test, do this part yourself');
}
function undo(){
	//remove the last item in the move stack and then update the canvas.
}
function colorChanged(e){
	console.info('color changed', e);
	ctx.strokeStyle = ctx.fillStyle = e.target.value;
}
function draw(x,y){
	let pos = getOffset(canvas, x, y);	
	ctx.fillRect(pos.x, pos.y, 1, 1);
}
function getPreview(){
	imgPreview.src = canvas.toDataURL();
}

//functions for doing calculations
function getOffset(element, x, y){
	let rect = element.getBoundingClientRect();	
	let newx = Math.round((x-rect.left)/(rect.right-rect.left)*canvas.width);
	let newy = Math.round((y-rect.top)/(rect.bottom-rect.top)*canvas.height);
	
	return new position(newx,newy);
}

//objects
function position(x,y){
	return {x:x, y:y};
}

//todo's
//save moves to a stack in order to allow for an undo button
