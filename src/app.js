import PacketParser from "./PacketParser";
import io from "../node_modules/socket.io/client-dist/socket.io";

const socket = io();

const parser = new PacketParser();

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");
ctx.lineWidth = 1;

socket.on('data', packet => {
	let values = parser.parse(packet);

	if(!values){
		return;
	}


	values = values
		// .filter(value => Math.abs(value.angle - (0.75 * 2 * Math.PI)) < 0.25)
		// .filter(value => value.data != 'fed802')
	;






	ctx.fillStyle = "rgba(30,30,30,0.5)";
	ctx.beginPath();

	ctx.moveTo(400, 400);
	values
		.forEach(value => {

			const relevantAngle = 0 - value.angle;

			ctx.lineTo(400 + Math.sin(relevantAngle) * 250, 400 + Math.cos(relevantAngle) * 250);

		});

	ctx.lineTo(400, 400);
	ctx.closePath();

	ctx.fill();

	ctx.fillStyle = "rgba(0,0,0,1.0)";

	ctx.beginPath();
	values.forEach(value => {
			const relevantAngle = 0 - value.angle;
			if(value.number < 30){
				// console.log(value.raw.toString(2).padStart(24, '0'), value.number);
			}

			const size = value.distance;
			const valX = Math.sin(relevantAngle) * 200 * size;
			const valY = Math.cos(relevantAngle) * 200 * size;

			const offsetX = Math.sin(relevantAngle) * 200 * 0.02;
			const offsetY = Math.cos(relevantAngle) * 200 * 0.02;



			ctx.rect(400 + valX + offsetX,400 + valY + offsetY,1,1);
		});

	ctx.closePath();
	ctx.fill();


});

function decay(){
	ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
	ctx.fillRect(0, 0, 800, 800);
	window.requestAnimationFrame(decay);
}
decay();