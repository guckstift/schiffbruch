const tile_w = 54;
const tile_h = 44;

const map_w = 60;
const map_h = 60;

const center_x = Math.floor(map_w / 2) - 1;
const center_y = Math.floor(map_h / 2) - 1;

class Map
{
	constructor()
	{
	}
	
	generate()
	{
		for(let m=0; m<1000; m++) {
			for(let y=0; y<map_w; y++) {
				for(let x=0; x<map_h; x++) {
				}
			}
		}
	}
	
	draw()
	{
		for(let y=0; y<map_w; y++) {
			for(let x=0; x<map_h; x++) {
				let i = x + y * map_w;
				if(vismap[i]) {
				}
			}
		}
	}
}
