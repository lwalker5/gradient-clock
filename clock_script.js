//Gradient Clock - Lindsay Walker
//Simple clock using gradients and canvas composite operation.
//In progress

if (typeof(clock) == 'undefined') clock = {};

clock.draw = (function(window, document, undefined) {

	//main clock object
	var clock = {
		radius : 250,
		canvas : document.getElementById('clock_canvas'),
		get ctx() { return this.canvas.getContext('2d'); }
	}

	function drawClock() {
		drawClockFace(clock.ctx, clock.radius);
		drawClockNumbers(clock.ctx, clock.radius);
		drawClockHands(clock.radius, clock.ctx);
	}

	function drawClockFace(ctx,radius) {

		//main face
		ctx.fillStyle = "#000000";
		ctx.lineWidth = 6;
		ctx.strokeStyle = '#FFFFFF';
		ctx.globalCompositeOperation = 'source-over'; //default drawing on top of canvas
		ctx.beginPath(); 
		ctx.arc(250,250,radius,0,Math.PI*2, false);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();

		/*ctx.beginPath();
		ctx.lineJoin = 'milter';
		ctx.lineCap = 'square';
		ctx.moveTo(250,0);
		ctx.lineTo(250,10);
		ctx.closePath();
		ctx.stroke();*/

		//center circle 
		ctx.globalCompositeOperation = 'destination-out'; //'cuts out' of main black circle to reveal gradient
		ctx.beginPath();
		ctx.arc(250,250,12,0,Math.PI*2, false);
		ctx.closePath();
		ctx.fill();
	}

	function drawClockNumbers(ctx,radius) {
		//so the nums are cut out of circle
		ctx.globalCompositeOperation = 'destination-out'; 

		ctx.font = "Bold 48px 'Helvetica'";
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';

		//for each hour calc the x and y position
		for (var num = 1; num <= 12; num++)
		{
			var angle = (num-3) * (2*Math.PI)/12;
			var x = 250 + calcXY(radius, angle).x * 0.85;
			var y = 250 + calcXY(radius, angle).y * 0.85;
			ctx.fillText(num,x,y);
		}
	}

	//Calculating the x and y position given a radis and angle
	function calcXY(r, angle) {
		var x = r * Math.cos(angle);
		var y = r * Math.sin(angle);
		return {
			x : x,
			y : y
		};
	}

	function drawClockHands(r,ctx) {
		var time = getTimeAngles();

		ctx.lineWidth = 6;
		ctx.beginPath();
		ctx.moveTo(250,250);
		ctx.lineTo(250 + calcXY(120,time.h).x, 250 + calcXY(120,time.h).y);
		ctx.closePath();
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(250,250);
		ctx.lineTo(250 + calcXY(160,time.m).x, 250 + calcXY(160,time.m).y);
		ctx.closePath();
		ctx.stroke();

		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(250,250);
		ctx.lineTo(250 + calcXY(170,time.s).x, 250 + calcXY(170,time.s).y);
		ctx.closePath();
		ctx.stroke();
	}

	//Gets the current time and calculates the angle of each hand
	function getTimeAngles() {
		var now = new Date();
		var hour = now.getHours();
		if (hour > 12) {hour = hour-12; }
		var minute = now.getMinutes();
		var seconds = now.getSeconds();
		
		minute = minute + seconds/60;
		hour = hour + minute/60

		//Start position is at 0 deg on a coord plane so subtract a quarter turn (3 hrs, 15 mins) to get correct position.
		//2pi is 360 / # 12hrs or 60mins
		var h_angle = (hour-3) * (2*Math.PI)/12;
		var m_angle = (minute-15) * (2*Math.PI)/60;
		var s_angle = (seconds-15) * (2*Math.PI)/60;

		//returns a time object, access using .h, etc.
		return {
			h: h_angle,
			m: m_angle,
			s: s_angle
		}
	}

	//Reset the canvas and redraw the new time
	function tickTock() {
		clock.ctx.save();
		clock.ctx.setTransform(1,0,0,1,0,0);
		clock.ctx.clearRect(0,0,clock.canvas.width,clock.canvas.height);
		clock.ctx.restore();
		drawClock();
	}

	return {
		setup: function() {
			tickTock();
			setInterval(tickTock, 1000); //continuously called to stay real time
		}
	}
})(window, document); 


document.addEventListener('DOMContentLoaded', function() {
	clock.draw.setup();
});
