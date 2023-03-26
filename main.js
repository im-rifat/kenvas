class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	get toString() {
		return `${this.x}, ${this.y}`;
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

	get ratio() {
		return this.width / this.height;
	}

	get toString() {
		return `(${this.left}, ${this.top}) : (${this.right}, ${this.bottom})`
	}
}

function drawPoints(ctx, points, color, img) {
	ctx.save()
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
	ctx.clip()

	ctx.fillStyle = color
	ctx.fill()
	//ctx.drawImage(img, 0, 0)
	ctx.restore()
}

function drawCanvas(canvas, canvasRect) {
	const ctx = canvas.getContext("2d")

	ctx.beginPath()
	ctx.rect(canvasRect.left, canvasRect.top, canvasRect.width, canvasRect.height)
	ctx.closePath()
	ctx.clip()
	ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function drawBackground(ctx, canvasRect) {
	if(bg) {
		if(bg.width) {
			let data = calculateScaleForBg(bg, canvasRect);
			let rect = data.rect;

			ctx.drawImage(bg, rect.left, rect.top, rect.width, rect.height, canvasRect.left, canvasRect.top, canvasRect.width, canvasRect.height);
		} else if(bg.solid) {
			ctx.fillStyle = bg.solid

			ctx.fillRect(canvasRect.left, canvasRect.top, canvasRect.width, canvasRect.height)
		} else if(bg.start) {
			let linearGradient = ctx.createLinearGradient(canvasRect.left, canvasRect.top, canvasRect.width, canvasRect.top)
			linearGradient.addColorStop(0, bg.start)
			linearGradient.addColorStop(1, bg.end)

			ctx.fillStyle = linearGradient
			ctx.fillRect(canvasRect.left, canvasRect.top, canvasRect.width, canvasRect.height)
		}
	}
}

function drawContent() {
}

function redraw(canvas, spacing, scaling) {
	const ctx = canvas.getContext("2d")

	ctx.clearRect(0, 0, canvas.width, canvas.height)

	let canvasRect = new RectF(0.0, 0.0, 1.0, 1.0)
	calculateCanvasRect(ratio, {width: canvas.width, height: canvas.height}, canvasRect)

	ctx.save()
	drawCanvas(canvas, canvasRect)
	drawBackground(ctx, canvasRect)
	ctx.restore()

	ctx.save()
	ctx.translate(canvas.width/2.0, canvas.height/2.0)
	ctx.scale(scaling, scaling)
	ctx.translate(-canvas.width/2.0, -canvas.height/2.0)
	ctx.save()

	let width = Math.min(canvasRect.width, canvasRect.height)
	let height = width / 1;

	let left1 = canvasRect.left + (canvasRect.width - width)/2;
	let top1 = canvasRect.top + (canvasRect.height - height)/2;

//	drawPoints(ctx, [{x:left1, y:top1}, {x:left1, y: top1 + 1*height}, {x: left1 + (0.65 - spacing)*width, y:top1 + 1.0*height}, {x: left1 + (0.35-spacing)*width, y:top1}], "#00FF00", img1)
//	drawPoints(ctx, [{x:left1 + (0.35+spacing)*width, y:top1}, {x:left1 + (0.65+spacing)*width, y: top1 + 1.0*height}, {x: left1 + 1.0*width, y:top1 + 1.0*height}, {x: left1 + 1.0*width, y:top1}], "#0000FF", img2)

	if(template == 2) {
		drawPoints(ctx, [
		{x: left1, y: top1},
		{x: left1 + (.5 - spacing)*width, y: top1},
		{x: left1 + (.35 - spacing)*width, y: top1+ .2*height},
		{x: left1 + (.5-spacing)*width, y: top1 + .4 *height},
		{x: left1 + (.35 - spacing)*width, y: top1 + .6*height},
		{x: left1 + (.5 - spacing)*width, y: top1 + .8*height},
		{x: left1 + (.35 - spacing)*width, y: top1 +height},
		{x: left1, y: top1+height}
		], "#00FF00", img1)

		drawPoints(ctx, [
		{x: left1+width, y: top1},
		{x: left1 + (.51 + spacing)*width, y: top1},
		{x: left1 + (.36 + spacing)*width, y: top1+ .2*height},
		{x: left1 + (.51+spacing)*width, y: top1 + .4 *height},
		{x: left1 + (.36 + spacing)*width, y: top1 + .6*height},
		{x: left1 + (.51 + spacing)*width, y: top1 + .8*height},
		{x: left1 + (.36 + spacing)*width, y: top1 +height},
		{x: left1+width, y: top1+height}
		], "#0000FF", img2)
	} else {
		drawPoints(ctx, [{x:left1, y:top1}, {x:left1, y: top1 + 1*height}, {x: left1 + (0.65 - spacing)*width, y:top1 + 1.0*height}, {x: left1 + (0.35-spacing)*width, y:top1}], "#00FF00", img1)
		drawPoints(ctx, [{x:left1 + (0.35+spacing)*width, y:top1}, {x:left1 + (0.65+spacing)*width, y: top1 + 1.0*height}, {x: left1 + 1.0*width, y:top1 + 1.0*height}, {x: left1 + 1.0*width, y:top1}], "#0000FF", img2)
	}
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

function calculateCanvasRect(r, canvas, canvasRect) {
	let width = canvas.width;
	let height = canvas.height;

	if(r >= 1.0) {
		height = width/r;
	} else {
		width = height*r;
	}

	let left = (canvas.width - width)/2.0;
	let top = (canvas.height - height)/2.0;

	canvasRect.left = left;
	canvasRect.top = top;
	canvasRect.right = left + width;
	canvasRect.bottom = top + height;
}

var mainCanvas = document.getElementById("canvas")

var spacing = 10/1000.0
var scaling = 1.0

var template = 1

var bg = new Image();
var img1 = new Image();
var img2 = new Image();

var spcaingSlider = document.getElementById("spcaingSlider")
spcaingSlider.addEventListener("input", evt => {
	spacing = evt.target.value / 1000.0
	redraw(mainCanvas, spacing, scaling)
})

var scalingSlider = document.getElementById("scalingSlider")
scalingSlider.addEventListener("input", evt => {
	scaling = evt.target.value / 100.0
	redraw(mainCanvas, spacing, scaling)
})

var ratioList = document.getElementById("ratioList")
ratioList.addEventListener("click", event => {
	console.log(event.target.textContent)

	if(event.target && event.target.nodeName === "LI") {
		let text = event.target.textContent;
		ratio = parseFloat(text.split(":")[0]) / parseFloat(text.split(":")[1])

		redraw(mainCanvas, spacing, scaling)
	}
})

var bgList = document.getElementById("bgList")
bgList.addEventListener("click", event => {
	if(event.target) {
		if(event.target.nodeName === "LI") {

			if(event.target.id === "solid") {
				bg = {solid:"#87ceeb"}

				redraw(mainCanvas, spacing, scaling)

			} else if(event.target.id === "grad") {
				bg = {start: "#ffafbd", end: "#ffc3a0"}

				redraw(mainCanvas, spacing, scaling)
			}

		} else if(event.target.nodeName === "IMG") {
			bg = new Image()
			bg.src = event.target.src
			bg.addEventListener("load", () => {
				redraw(mainCanvas, spacing, scaling)
			})
		}
	}
})

var templateList = document.getElementById("templateList")
templateList.addEventListener("click", event => {
	if(event.target) {
		if(event.target.nodeName === "LI") {

			console.log(event.target.textContent)

			if(event.target.textContent === "Template 1") {
				template = 1;

				redraw(mainCanvas, spacing, scaling)

			} else if(event.target.textContent === "Template 2") {
				template = 2;

				redraw(mainCanvas, spacing, scaling)
			}

		}
	}
})

function main() {
	img1.src = "./res/timg1.jpg";
	img2.src = "./res/timg2.jpg";
	bg.src  ="./res/bg.jpg";
	bg.addEventListener("load", () => {
		redraw(mainCanvas, spacing, scaling);
	});
}

let bgImg = new Image()
bgImg.src = "./res/block.jpg";

var ratio = 1.0;

var exportBtn = document.getElementById("exportBtn")
const exportSize = 2000
exportBtn.addEventListener("click", () => {
	const dynamicCanvas = document.createElement("canvas");
	if(ratio >= 1.0) {
		dynamicCanvas.width = exportSize
		dynamicCanvas.height = exportSize / ratio
	} else {
		dynamicCanvas.height = exportSize
		dynamicCanvas.width = exportSize * ratio
	}

	redraw(dynamicCanvas, spacing, scaling)

	const imageUri = dynamicCanvas.toDataURL("image/jpg");
	exportBtn.href = imageUri
})

bgImg.addEventListener("load", ()=> {
	main()
})