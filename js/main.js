//TODO: save paths to a stack in order to allow for an undo button
let isMouseDown = false,
    previousPosition, currentPosition,
    paths = [], currentPath;

//buttons and their corresponding events
let btnClear = document.querySelector('#clear');
btnClear.addEventListener('click', clear, false);

let btnSave = document.querySelector('#save');
btnSave.addEventListener('click', save, false);

let btnUndo = document.querySelector('#undo');
btnUndo.addEventListener('click', undo, false);

let colorPicker = document.querySelector('#colorPicker');
colorPicker.addEventListener('input', colorChanged, false);

let strokeWidth = document.querySelector('#strokeWidth');
strokeWidth.addEventListener('change', strokeWidthChanged, false);

let imgPreview = document.querySelector('#preview');

//canvas stuff
let canvas = document.getElementById("canvas");
//mouse events
canvas.addEventListener('mousedown', mouseDown, false);
canvas.addEventListener('mousemove', mouseMove, false);
canvas.addEventListener('mouseup', mouseUp, false);
//touch events
canvas.addEventListener('touchstart', touchstart, false);
canvas.addEventListener('touchmove', touchmove, false);
canvas.addEventListener('touchend', touchend, false);

let ctx = canvas.getContext("2d");
ctx.fillStyle = ctx.strokeStyle = colorPicker.value;

//event handlers
function touchstart(e) {
    e.preventDefault();
    console.info('touch start',e);
    isMouseDown = true;
    drawDot(e.touches[0].clientX, e.touches[0].clientY);
}
function touchmove(e) {
    e.preventDefault();
    console.info('touch move', e);
    if(isMouseDown){
        let pos = getOffset(canvas, e.touches[0].clientX, e.touches[0].clientY);
        draw(pos);
    }
}
function touchend(e) {
    e.preventDefault();
    console.info('touch end',e);
    mouseUp(e);
}
function mouseDown(e) {
    isMouseDown = true;
    drawDot(e.clientX, e.clientY);
}
function mouseMove(e) {
    if (isMouseDown) {
        let pos = getOffset(canvas, e.clientX, e.clientY);
        draw(pos);
    }
}
function mouseUp(e) {
    isMouseDown = false;
    resetPositions();
    getPreview();
    paths.push(currentPath);
    currentPath = new Path(colorPicker.value);
}
function clear() {
    clearPreview();
    clearPaths();
}
function clearPreview() {
    //clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //clear preview
    imgPreview.src = '';
    resetPositions();
}
function clearPaths() {
    paths = [];
    currentPath = new Path(colorPicker.value);
}
function save() {
    let imgData = canvas.toDataURL();

}
function undo() {
    //remove the last item in the move stack and then update the canvas.
    paths.pop(paths.length);
    clearPreview();
    paths.forEach(function (path) {
        path.moves.forEach(function (move) {
            if (move.end === undefined) {
                drawDot(move.start.x, move.start.y);
            } else {
                previousPosition = move.start;
                currentPosition = move.start;
                draw(move.end);
            }
        });
    });

    previousPosition = new Position(0, 0);
    currentPath = new Path(colorPicker.value);
}
function colorChanged(e) {
    ctx.strokeStyle = ctx.fillStyle = e.target.value;
}
function strokeWidthChanged(e) {
    ctx.lineWidth = e.target.value;
}
function drawDot(x, y) {
    let pos = getOffset(canvas, x, y);
    ctx.fillRect(pos.x, pos.y, 1, 1);

    let path = new Path(colorPicker.value);
    let move = new Move(pos);
    currentPath.moves.push(move);
}
function draw(pos) {
    if (previousPosition.x === 0 && previousPosition.y === 0) {
        currentPosition = pos;
    }
    previousPosition = currentPosition;
    currentPosition = pos;

    ctx.beginPath();
    ctx.moveTo(previousPosition.x, previousPosition.y);
    ctx.lineTo(currentPosition.x, currentPosition.y);
    //ctx.strokeStyle = colorPicker.value;
    //ctx.lineWidth = 1;
    ctx.stroke();
    ctx.closePath();

    let move = new Move(previousPosition, currentPosition);
    currentPath.moves.push(move);
}
function getPreview() {
    imgPreview.src = canvas.toDataURL();
}

//functions for doing calculations
function getOffset(element, x, y) {
    let rect = element.getBoundingClientRect();
    let newx = Math.round((x - rect.left) / (rect.right - rect.left) * canvas.width);
    let newy = Math.round((y - rect.top) / (rect.bottom - rect.top) * canvas.height);

    return new Position(newx, newy);
}
function resetPositions() {
    previousPosition = new Position(0, 0);
    currentPosition = new Position(0, 0);
}
//objects
function Position(x, y) {
    //returns an object containing two numbers(floats) that represent a 2D coordinate.
    return { x: x, y: y };
}
function Path(color) {
    return { color: color, moves: [] };
}
function Move(start, end) {
    //contains two position objects (start, end)
    return { start: start, end: end };
}

//init
(function () {
    resetPositions();
    currentPath = new Path(colorPicker.value);
})();