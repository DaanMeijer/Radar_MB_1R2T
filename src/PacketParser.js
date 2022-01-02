export default class PacketParser{
	parse(packet){

		const buffer = new Uint8Array(packet);
		// { msgType, valueCount,
		//   startAngleL, startAngleH,
		//   endAngleL, endAngleH,
		//   [{distanceL, distanceH, ?}]
		// }
		const msgType = buffer[0];

		if (msgType == 0x47) {
			//don't know what this is yet
			return;
		}

		if (msgType == 0x45) {
			//don't know what this is yet
			return;
		}

		if (msgType != 0x28) {
			console.log(msgType, buffer);
			return;
		}

		const circle = Math.PI * 2;

		const valueCount = buffer[1];

		const startAngle = (buffer[3] << 8) | buffer[2];
		const startAngleDegrees = (startAngle / 0xb400) * circle;

		const endAngle = (buffer[5] << 8) | buffer[4];
		const endAngleDegrees = (endAngle / 0xb400) * circle;

		const angleDifference = ((endAngleDegrees - startAngleDegrees) + circle) % circle;
		const angleStep = angleDifference / valueCount;

		const distances = buffer.slice(8, 8 + (valueCount * 3));

		const results = [];

		const angleOfInterest = 5;

		for (let i = 0; i < valueCount; i++) {

			const angle = startAngleDegrees + (i * angleStep);

			const offset = i * 3;


			const raw = (distances[offset+2] << 16) + (distances[offset+1] << 8) + (distances[offset+0] << 0);
			let data = raw;
			// 1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23
			// should be discarded? (2 bits)
			//       measurement (12 bits)
			//                                        some number? (8 bits)
			//                                                                some number, always 0b10 (2 bits)

			const error = data >> 22;

			data = data & 0x3fffff;

			const check = data & 0b10;

			if(check != 0b10){
				console.log('strange data!', data.toString(16));
			}

			data = data >> 2;

			const number = data & 0xff;
			data = data >> 8;


			let distance = data / 0xfff;

			if(error){
				if(number){
					distance = 0.001;
				}else{
					distance = 1;
				}
			}

			results.push({
				angle,
				distance,
				number,
				raw
			});
		}

		return results;
	}
}