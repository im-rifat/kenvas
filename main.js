class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

class RectF {
	left = 0.0;
	top = 0.0;
	right = 0.0;
	bottom = 0.0;

	//left = top = right = bottom = 0.0;

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

function redraw(spacing, scaling) {
	ctx.clearRect(0, 0, canvasW, canvasH)

	/*var gradientColor = ctx.createLinearGradient(0, 0, canvasW, canvasH)
	gradientColor.addColorStop(0, "#36D1DC")
	gradientColor.addColorStop(1, "#5B86E5")
	ctx.fillStyle = gradientColor
	ctx.fillRect(0, 0, canvasW, canvasH)*/

	let data = calculateScaleForBg(bg, {width: canvasW, height: canvasH});
	let rect = data.rect;
	let scale = data.scale;
//	console.log(imageScale)
//	ctx.transform(imageScale, 0, 0, imageScale, 0, 0)
	ctx.drawImage(bg, 0, 0, bg.width, bg.height, rect.left, rect.top, rect.width, rect.height);

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

	let imageRatio = imageW / (imageH*1.0);
	let canvasRatio = canvasW / (canvasH*1.0);

	if(imageW >= canvasW) {
		canvasH = imageW / imageRatio;
	} else if(imageH >= canvasH) {
		canvasW = imageRatio * canvasH;
	} else {
		canvasH = imageW / imageRatio;
	}

	let left = (canvas.width - canvasW)/2.0;
	let top = (canvas.height - canvasH)/2.0;

	let newImageRect = new RectF(left, top, left+canvasW, top+canvasH);

	console.log(imageRatio + ", " + canvasRatio + ", " + canvasW/(imageW*1.0) + ", " + canvasH/(imageH*1.0));

	let scale = Math.max(canvasW/(imageW*1.0), canvasH/(imageH*1.0));

	//return scale;
	return {rect: newImageRect, scale: scale};
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

	console.log(spacing)
	redraw(spacing, scaling)
})

var scalingSlider = document.getElementById("scalingSlider")
scalingSlider.addEventListener("input", evt => {
	scaling = evt.target.value / 100.0
	console.log(scaling)
	redraw(spacing, scaling)
})

function main() {
	bg.src  ="./res/bg2.jpg";
	bg.addEventListener("load", () => {
		console.log("image loaded");
		redraw(spacing, scaling);
	});
}

main()