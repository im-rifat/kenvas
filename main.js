class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	get toString() {
		this.x + ", " + this.y;
	}
}

class RectF {
	left = 0.0;
	top = 0.0;
	right = 0.0;
	bottom = 0.0;

	constructor(left, top, right, bottom) {
		this.left = left;
		this.top = top;
		this.right = right;
		this.bottom = bottom;
	}

	get width() {
		return this.right - this.left;
	}

	get height() {
		return this.bottom - this.top;
	}

	get toString() {
		return `(${this.left}, ${this.top}) : (${this.right}, ${this.bottom})`
	}
}

function drawPoints(ctx, points, color) {
	ctx.beginPath()

	for(let i =0; i < points.length; i++) {
		let point = points[i];

		if(i == 0) {
			ctx.moveTo(point.x, point.y);
			continue;
		}

		ctx.lineTo(point.x, point.y);
	}

	ctx.closePath()
	ctx.fillStyle = color
	ctx.fill()
}

function drawCanvas(ctx, ratio, canvasRect) {
	ctx.beginPath()
	ctx.rect(canvasRect.left, canvasRect.top, canvasRect.width, canvasRect.height)
	ctx.closePath()
	ctx.clip()
	ctx.fillRect(0, 0, canvasW, canvasH)
}

function drawBackground(ctx, canvasRect) {
	let data = calculateScaleForBg(bg, canvasRect);
	let rect = data.rect;

	ctx.drawImage(bg, rect.left, rect.top, rect.width, rect.height, canvasRect.left, canvasRect.top, canvasRect.width, canvasRect.height);
}

function drawContent() {
}

function redraw(spacing, scaling) {
	ctx.clearRect(0, 0, canvasW, canvasH)

	let pattern = ctx.createPattern(bgImg, "repeat")
	ctx.fillStyle = pattern
	ctx.rect(0, 0, canvasW, canvasH)
	ctx.fill()

	let canvasRect = new RectF(0.0, 0.0, 1.0, 1.0)
	let ratio = 16/16.0
	calculateCanvasRect(ratio, {width: canvasW, height: canvasH}, canvasRect)

	ctx.save()
	drawCanvas(ctx, ratio, canvasRect)
	drawBackground(ctx, canvasRect)
	ctx.restore()

	let canvasRatio = canvasRect.width / canvasRect.height;

	if(canvasRatio <= 1.0)
		scaling = scaling*canvasRatio
	else {
		scaling = scaling/canvasRatio
	}

	ctx.save()
	ctx.translate(canvasW/2.0, canvasH/2.0)
	ctx.scale(scaling, scaling)
	ctx.translate(-canvasW/2.0, -canvasH/2.0)
	ctx.save()
	drawPoints(ctx, [{x:0, y:0}, {x:0, y: 1*canvasH}, {x: (0.65 - spacing)*canvasW, y:1.0*canvasH}, {x: (0.35-spacing)*canvasW, y:0}], "#00FF00")
	drawPoints(ctx, [{x:(0.35+spacing)*canvasW, y:0}, {x:(0.65+spacing)*canvasW, y: 1.0*canvasH}, {x: 1.0*canvasW, y:1.0*canvasH}, {x: 1.0*canvasW, y:0}], "#0000FF")
	ctx.restore()
	ctx.restore()
}

function calculateScaleForBg(bg, canvas) {
	let imageW = bg.width;
	let imageH = bg.height;
	let canvasW = canvas.width;
	let canvasH = canvas.height;

	let canvasRatio = canvasW / (canvasH*1.0);

	let tempW = Math.min(imageW, imageH)
	let tempH = tempW / canvasRatio;

	if(tempH > imageH) {
		tempH = Math.min(imageW, imageH);
		tempW = tempH * canvasRatio;
	}

	let left = Math.round((imageW - tempW)/2.0);
	let top = Math.round((imageH - tempH)/2.0);

	let newImageRect = new RectF(left, top, left+tempW, top+tempH);

	return {rect: newImageRect};
}

function calculateCanvasRect(ratio, canvas, canvasRect) {
	let width = canvas.width;
	let height = canvas.height;

	if(ratio >= 1.0) {
		height = width/ratio;
	} else {
		width = height*ratio;
	}

	let left = (canvas.width - width)/2.0;
	let top = (canvas.height - height)/2.0;

	canvasRect.left = left;
	canvasRect.top = top;
	canvasRect.right = left + width;
	canvasRect.bottom = top + height;
}

var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d")

var canvasW = canvas.width
var canvasH = canvas.height

var spacing = 10/1000.0
var scaling = 1.0

var bg = new Image();

var spcaingSlider = document.getElementById("spcaingSlider")
spcaingSlider.addEventListener("input", evt => {
	spacing = evt.target.value / 1000.0
	redraw(spacing, scaling)
})

var scalingSlider = document.getElementById("scalingSlider")
scalingSlider.addEventListener("input", evt => {
	scaling = evt.target.value / 100.0
	redraw(spacing, scaling)
})

function main() {
	bg.src  ="./res/bg.jpg";
	bg.addEventListener("load", () => {
		redraw(spacing, scaling);
	});
}

let bgImg = new Image()
bgImg.src = "./res/block.jpg";

bgImg.addEventListener("load", ()=> {
	main()
})