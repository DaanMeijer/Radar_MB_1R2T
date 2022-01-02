# Radar_MB_1R2T
Low cost lidar with black PCB 

We did the reverse engineering on my discord:
https://discord.gg/eBt46mzS3d

I will soon add more info in this github.


# Run the node implementation:
- `sudo setserial /dev/ttyUSB0 divisor 156 spd_cust` to change the serial port to the correct speed, at least for my ftdi interface
- `npm ci`
- `npm run dev`
- `npm run serve`