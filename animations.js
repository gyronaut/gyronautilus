var hit_regions;
var hit_regions_canvas;
var previous_area_name;
var area_name;
var sky_num_rows = 7;
var sky_num_cols = 25;
var is_deer_blank = false;
var is_sky_blank = false;
var sky_start_cell;
var max_sky_distance;
var did_area_change = false;

var doe_image = new Image();
var bird_image = new Image();
var rabbit_image = new Image();
var main_images = new Array();
main_images[0] = doe_image;
main_images[1] = rabbit_image;
main_images[2] = bird_image;

var blank_sky = new Image();
var blank_deer = new Image();

var is_active = false;

/* Set up arrays for the bird animation images, as well as the positions of those
 * frames for when they're drawn on the canvas
 */
var bird_animation_array = new Array();
bird_animation_array[0] = new Image();
bird_animation_array[1] = new Image();
bird_animation_array[2] = new Image();
bird_animation_array[3] = new Image();
bird_animation_array[4] = new Image();
bird_animation_array[5] = new Image();
bird_animation_array[6] = new Image();

var bird_frame_pos_array = new Array();
bird_frame_pos_array[0] = {top: 342, left: 299};
bird_frame_pos_array[1] = {top: 329, left: 319};
bird_frame_pos_array[2] = {top: 329, left: 319};
bird_frame_pos_array[3] = {top: 79, left: 57};
bird_frame_pos_array[4] = {top: 79, left: 57};
bird_frame_pos_array[5] = {top: 342, left: 299};
bird_frame_pos_array[6] = {top: 329, left: 319};	

var deer_clipping_regions = [];

var sky_block_regions = new Array(sky_num_rows);
for(var row = 0; row < sky_num_rows; row++){
	sky_block_regions[row] = new Array(sky_num_cols);
}

/* Sets up up all of the clipping/hit regions necessary for the deer and sky animations. The
* sky is divided up so that every hexagonal cell is it's own region, and it uses the fact that
* all cells are touching to define the points in terms of other hexagons (for a non-edge cell,
* if the cells above it are defined, then only the bottom and bottom-right points are required
* to completely determine the cell - once these are defined, it can then fill in the remaining
* points by looking at adjacent cells that have already been defined).
*/

function initRegions(){

	hit_region_canvas = document.createElement('canvas');
	hit_region_canvas.width = 700;
	hit_region_canvas.height = 600;
	hit_regions = hit_region_canvas.getContext('2d');
	
	deer_clipping_regions[0] = [{num_pts: 15},  {x: 65, y: 79}, {x: 132, y: 123}, {x: 133, y: 97}, {x: 202, y: 97}, {x: 202, y: 120}, {x: 222, y: 117}, {x: 249, y: 90}, {x: 300, y: 86}, {x: 611, y: 86}, {x: 611, y: 375}, {x: 607, y: 377}, {x: 591, y: 368}, {x: 575, y: 397}, {x: 571, y:500 }, {x: 65, y: 500}];
	deer_clipping_regions[1] = [{num_pts: 18}, {x: 110, y: 151}, {x: 128, y: 150}, {x: 139, y: 115}, {x: 190, y: 94}, {x: 189, y: 124}, {x: 200, y: 144}, {x: 182, y: 171}, {x: 182, y: 183}, {x: 187, y: 196}, {x: 214, y: 185}, {x: 577, y: 185}, {x: 577, y: 303}, {x: 591, y: 364}, {x: 577, y: 392}, {x: 514, y: 392}, {x: 455, y: 453}, {x: 455, y: 500}, {x: 110, y: 500}];
	deer_clipping_regions[2] = [{num_pts: 16}, {x: 112, y: 188}, {x: 148, y: 195}, {x: 149, y: 216}, {x: 162, y: 206}, {x: 178, y: 205}, {x: 192, y: 213}, {x: 192, y: 246}, {x: 209, y: 234}, {x: 462, y: 234}, {x: 462, y: 265}, {x: 423, y: 313}, {x: 528, y: 340}, {x: 516, y: 392}, {x: 455, y: 444}, {x: 455, y: 500}, {x: 112, y: 500}];
	deer_clipping_regions[3] = [{num_pts: 15}, {x: 291, y: 258}, {x: 361, y: 254}, {x: 425, y: 258}, {x: 460, y: 264}, {x: 421, y: 314}, {x: 465, y: 368}, {x: 443, y: 402}, {x: 487, y: 416}, {x: 454, y: 442}, {x: 454, y: 500}, {x: 127, y:500 }, {x: 127, y: 329}, {x: 144, y: 333}, {x: 183, y: 362}, {x: 180, y: 306}];
	deer_clipping_regions[4] = [{num_pts: 17}, {x: 291, y: 258}, {x: 361, y: 254}, {x: 425, y: 258}, {x: 460, y: 264}, {x: 380, y: 365}, {x: 409, y: 397}, {x: 487, y: 416}, {x: 454, y: 442}, {x: 388, y: 446}, {x: 378, y: 457}, {x: 196, y: 463}, {x: 203, y: 442}, {x: 282, y: 443}, {x: 251, y: 383}, {x: 268, y: 375}, {x: 238, y: 363}, {x: 227, y: 320}];
	deer_clipping_regions[5] = [{num_pts: 13}, {x: 460, y: 264}, {x: 380, y: 365}, {x: 406, y: 400}, {x: 360, y: 411}, {x: 383, y: 447}, {x: 382, y: 456}, {x: 320, y: 461}, {x: 314, y: 377}, {x: 338, y: 324}, {x: 295, y: 301}, {x: 291, y: 258}, {x: 361, y: 254}, {x: 425, y: 258}];
	deer_clipping_regions[6] = [{num_pts: 7}, {x: 322, y: 364}, {x: 338, y: 323}, {x: 444, y: 264}, {x: 460, y: 264}, {x: 380, y: 365}, {x: 406, y: 400}, {x: 359, y: 415}];

	/* Set up Array defining each of the "sky-blocks" of corrugated
	 * cardboard (should be hexagons, so 6 points each to define them).
	 * This will allow paths to be drawn much easier around these
	 * "sky blocks" allowing for animations when different parts of
	 * the sky are clicked (also allows different paths to be drawn onto
	 * the "hit regions" canvas to determine where the cursor is in the
	 * image).
	 */		

	sky_block_regions[0][1] = [{x: 90, y: 23}, {x: 96, y: 23}, {x: 96, y: 25}, {x: 67, y: 70}, {x: 80 , y: 37}, {x: 80, y: 36}];
	sky_block_regions[0][3] = [{x: 117, y: 23}, {x: 144, y: 23}, {x: 145, y: 24}, {x: 116, y: 48}, {x: 96, y: 25}, {x: 97, y: 23}];
	sky_block_regions[0][5] = [{x: 168, y: 23}, {x: 195, y: 23}, {x: 195, y: 27}, {x: 168, y: 51}, {x: 143, y: 24}, {x: 143, y: 23}];
	sky_block_regions[0][7] = [{x: 220, y: 23}, {x: 247, y: 23}, {x: 247, y: 28}, {x: 220, y: 58}, {x: 195, y: 27}, {x: 195, y: 23}]; 
	sky_block_regions[0][9] = [{x: 278, y: 23}, {x: 309, y: 23}, {x: 309, y: 31}, {x: 278, y: 56}, {x: 247, y: 28}, {x: 247, y: 23}]; 
	sky_block_regions[0][11] = [{x: 345, y: 23}, {x: 378, y: 23}, {x: 378, y: 28}, {x: 345, y: 56}, {x: 309, y: 31}, {x: 309, y: 23}]; 
	sky_block_regions[0][13] = [{x: 408, y: 23}, {x: 438, y: 23}, {x: 438, y: 27}, {x: 408, y: 58}, {x: 378, y: 28}, {x: 378, y: 23}]; 
	sky_block_regions[0][15] = [{x: 463, y: 23}, {x: 488, y: 23}, {x: 488, y: 28}, {x: 463, y: 56}, {x: 438, y: 27}, {x: 438, y: 23}]; 
	sky_block_regions[0][17] = [{x: 514, y: 23}, {x: 539, y: 23}, {x: 539, y: 28}, {x: 514, y: 53}, {x: 488, y: 28}, {x: 488, y: 23}]; 
	sky_block_regions[0][19] = [{x: 566, y: 23}, {x: 596, y: 23}, {x: 596, y: 25}, {x: 566, y: 53}, {x: 539, y: 28}, {x: 539, y: 23}]; 
	sky_block_regions[0][21] = [{x: 622, y: 23}, {x: 649, y: 23}, {x: 649, y: 29}, {x: 622, y: 49}, {x: 596, y: 25}, {x: 596, y: 23}]; 
	sky_block_regions[0][23] = [{x: 675, y: 23}, {x: 692, y: 23}, {x: 692, y: 30}, {x: 675, y: 47}, {x: 649, y: 29}, {x: 649, y: 23}]; 

	sky_block_regions[1][0] = [{x: 65, y: 35}, {x: 80, y: 36}, {x: 80, y: 60}, {x: 67, y: 70}, {x: 43, y: 53}, {x: 45, y: 35}];
	sky_block_regions[1][2] = [{x: 97, y: 23}, {x: 117, y: 47}, {x: 117, y: 67}, {x: 95, y: 83}, {x: 80, y: 60}, {x: 80, y: 41}];
	sky_block_regions[1][4] = [{x: 144, y: 23}, {x: 168, y: 50}, {x: 168, y: 64}, {x: 142, y: 85}, {x: 117, y: 67}, {x: 117, y: 47}];
	sky_block_regions[1][6] = [{x: 196, y: 26}, {x: 220, y: 57}, {x: 220, y: 69}, {x: 199, y: 85}, {x: 168, y: 64}, {x: 168, y: 50}];
	sky_block_regions[1][8] = [{x: 248, y: 27}, {x: 278, y: 55}, {x: 278, y: 69}, {x: 253, y: 90}, {x: 220, y: 69}, {x: 220, y: 57}];
	sky_block_regions[1][10] = [{x: 310, y: 30}, {x: 345, y: 55}, {x: 345, y: 67}, {x: 317, y: 98}, {x: 278, y: 69}, {x: 278, y: 55}];
	sky_block_regions[1][12] = [{x: 379, y: 27}, {x: 408, y: 57}, {x: 408, y: 69}, {x: 379, y: 93}, {x: 345, y: 67}, {x: 345, y: 55}];
	sky_block_regions[1][14] = [{x: 439, y: 26}, {x: 463, y: 55}, {x: 463, y: 68}, {x: 435, y: 87}, {x: 408, y: 69}, {x: 408, y: 57}];
	sky_block_regions[1][16] = [{x: 489, y: 27}, {x: 514, y: 52}, {x: 514, y: 64}, {x: 486, y: 86}, {x: 463, y: 68}, {x: 463, y: 55}];
	sky_block_regions[1][18] = [{x: 540, y: 27}, {x: 566, y: 52}, {x: 566, y: 64}, {x: 543, y: 83}, {x: 514, y: 64}, {x: 514, y: 52}];
	sky_block_regions[1][20] = [{x: 597, y: 24}, {x: 622, y: 48}, {x: 622, y: 61}, {x: 592, y: 84}, {x: 566, y: 64}, {x: 566, y: 52}];
	sky_block_regions[1][22] = [{x: 650, y: 28}, {x: 675, y: 46}, {x: 675, y: 57}, {x: 648, y: 79}, {x: 622, y: 61}, {x: 622, y: 48}];
	sky_block_regions[1][24] = [{x: 693, y: 29}, {x: 693, y: 50}, {x: 693, y: 60}, {x: 693, y: 73}, {x: 675, y: 57}, {x: 675, y: 46}];

	sky_block_regions[2][1] = [{}, {}, {x: 94, y: 98}, {x: 70, y: 119}, {x: 43, y: 97}, {}];
	sky_block_regions[2][3] = [{}, {}, {x: 142, y: 98}, {x: 114, y: 116}, {}, {}];
	sky_block_regions[2][5] = [{}, {}, {x: 198, y: 96}, {x: 168, y: 112}, {}, {}];
	sky_block_regions[2][7] = [{}, {}, {x: 260, y: 112}, {x: 237, y: 138}, {}, {}];
	sky_block_regions[2][9] = [{}, {}, {x: 318, y: 110}, {x: 286, y: 136}, {}, {}];
	sky_block_regions[2][11] = [{}, {}, {x: 381, y: 102}, {x: 351, y: 126}, {}, {}];
	sky_block_regions[2][13] = [{}, {}, {x: 434, y: 102}, {x: 410, y: 124}, {}, {}];
	sky_block_regions[2][15] = [{}, {}, {x: 485, y: 102}, {x: 458, y: 122}, {}, {}];
	sky_block_regions[2][17] = [{}, {}, {x: 542, y: 99}, {x: 513, y: 121}, {}, {}];
	sky_block_regions[2][19] = [{}, {}, {x: 591, y: 100}, {x: 566, y: 122}, {}, {}];
	sky_block_regions[2][21] = [{}, {}, {x: 647, y: 93}, {x: 618, y: 119}, {}, {}];
	sky_block_regions[2][23] = [{}, {}, {x: 686, y: 106}, {x: 676, y: 114}, {}, {}];

	sky_block_regions[3][1] = [{}, {}, {x: 97, y: 153}, {x: 74, y: 168}, {x: 44, y: 148}, {}];
	sky_block_regions[3][3] = [{}, {}, {x: 168, y: 144}, {x: 121, y: 163}, {}, {}];
	sky_block_regions[3][6] = [{}, {}, {x: 238, y: 151}, {x: 213, y: 167}, {}, {}];
	sky_block_regions[3][8] = [{}, {}, {x: 286, y: 147}, {x: 260, y: 166}, {}, {}];
	sky_block_regions[3][10] = [{}, {}, {x: 352, y: 141}, {x: 321, y: 166}, {}, {}];
	sky_block_regions[3][12] = [{}, {}, {x: 412, y: 141}, {x: 381, y: 164}, {}, {}];
	sky_block_regions[3][14] = [{}, {}, {x: 459, y: 134}, {x: 436, y: 151}, {}, {}];
	sky_block_regions[3][16] = [{}, {}, {x: 512, y: 132}, {x: 485, y: 153}, {}, {}];
	sky_block_regions[3][18] = [{}, {}, {x: 566, y: 138}, {x: 539, y: 154}, {}, {}];
	sky_block_regions[3][20] = [{}, {}, {x: 619, y: 137}, {x: 592, y: 156}, {}, {}];
	sky_block_regions[3][22] = [{}, {}, {x: 671, y: 131}, {x: 640, y: 153}, {}, {}];
	sky_block_regions[3][24] = [{}, {}, {x: 687, y: 128}, {x: 687, y: 145}, {}, {}];

	sky_block_regions[4][0] = [{x: 44, y: 146}, {x: 74, y: 168}, {x: 73, y: 180}, {x: 43, y: 196}, {x: 43, y: 178}, {x: 43, y: 163}];
	sky_block_regions[4][2] = [{}, {}, {x: 125, y: 178}, {x: 99, y: 196}, {}, {}];
	sky_block_regions[4][5] = [{}, {}, {x: 211, y: 182}, {x: 163, y: 196}, {}, {}];
	sky_block_regions[4][7] = [{}, {}, {x: 261, y: 180}, {x: 235, y: 198}, {}, {}];
	sky_block_regions[4][9] = [{}, {}, {x: 321, y: 176}, {x: 289, y: 198}, {}, {}];
	sky_block_regions[4][11] = [{}, {}, {x: 381, y: 172}, {x: 349, y: 192}, {}, {}];
	sky_block_regions[4][13] = [{}, {}, {x: 439, y: 166}, {x: 411, y: 192}, {}, {}];
	sky_block_regions[4][15] = [{}, {}, {x: 487, y: 168}, {x: 463, y: 184}, {}, {}];
	sky_block_regions[4][17] = [{}, {}, {x: 537, y: 166}, {x: 509, y: 186}, {}, {}];
	sky_block_regions[4][19] = [{}, {}, {x: 591, y: 168}, {x: 561, y: 184}, {}, {}];
	sky_block_regions[4][21] = [{}, {}, {x: 641, y: 166}, {x: 615, y: 184}, {}, {}];
	sky_block_regions[4][23] = [{}, {}, {x: 687, y: 172}, {x: 667, y: 190}, {}, {}];

	sky_block_regions[5][1] = [{}, {}, {x: 98, y: 209}, {x: 76, y: 231}, {x: 44, y: 213}, {}];
	sky_block_regions[5][3] = [{}, {}, {x: 156, y: 207}, {x: 124, y: 221}, {}, {}];
	sky_block_regions[5][6] = [{}, {}, {x: 238, y: 207}, {x: 208, y: 225}, {}, {}];
	sky_block_regions[5][8] = [{}, {}, {x: 290, y: 205}, {x: 266, y: 221}, {}, {}];
	sky_block_regions[5][10] = [{}, {}, {x: 350, y: 203}, {x: 324, y: 223}, {}, {}];
	sky_block_regions[5][12] = [{}, {}, {x: 412, y: 205}, {x: 380, y: 223}, {}, {}];
	sky_block_regions[5][14] = [{}, {}, {x: 464, y: 201}, {x: 440, y: 221}, {}, {}];
	sky_block_regions[5][16] = [{}, {}, {x: 508, y: 199}, {x: 488, y: 217}, {}, {}];
	sky_block_regions[5][18] = [{}, {}, {x: 560, y: 195}, {x: 534, y: 215}, {}, {}];
	sky_block_regions[5][20] = [{}, {}, {x: 616, y: 199}, {x: 588, y: 217}, {}, {}];
	sky_block_regions[5][22] = [{}, {}, {x: 670, y: 205}, {x: 640, y: 219}, {}, {}];
	sky_block_regions[5][24] = [{}, {}, {x: 684, y: 195}, {x: 684, y: 215}, {}, {}];

	sky_block_regions[6][0] = [{x:43, y:213}, {x: 76, y: 231}, {x: 77, y: 239}, {x: 45, y: 239}, {x: 43, y: 239}, {x:43, y:215}];
	sky_block_regions[6][2] = [{}, {}, {x: 123, y: 239}, {x: 103, y: 239}, {}, {}];
	sky_block_regions[6][5] = [{}, {}, {x: 211, y: 239}, {x: 165, y: 239}, {}, {}];
	sky_block_regions[6][7] = [{}, {}, {x: 263, y: 239}, {x: 237, y: 239}, {}, {}];
	sky_block_regions[6][9] = [{}, {}, {x: 323, y: 237}, {x: 291, y: 237}, {}, {}];
	sky_block_regions[6][11] = [{}, {}, {x: 379, y: 237}, {x: 351, y: 237}, {}, {}];
	sky_block_regions[6][13] = [{}, {}, {x: 439, y: 237}, {x: 416, y: 237}, {}, {}];
	sky_block_regions[6][15] = [{}, {}, {x: 489, y: 237}, {x: 465, y: 237}, {}, {}];
	sky_block_regions[6][17] = [{}, {}, {x: 535, y: 235}, {x: 511, y: 235}, {}, {}];
	sky_block_regions[6][19] = [{}, {}, {x: 587, y: 235}, {x: 559, y: 235}, {}, {}];
	sky_block_regions[6][21] = [{}, {}, {x: 637, y: 235}, {x: 613, y: 235}, {}, {}];
	sky_block_regions[6][23] = [{}, {}, {x: 685, y: 235}, {x: 669, y: 235}, {}, {}];


	for(var row = 2; row < 7; row++){
		if(row%2 == 1){
			for(var col = 0; col < 25; col+=2){
				if(row!=3 || col>4){
					if(col == 0){
						col+=1;
					}else if(col==5){
						col+=1;
					}
					sky_block_regions[row][col][0] = sky_block_regions[(row-1)][(col-1)][2];
					sky_block_regions[row][col][5] = sky_block_regions[(row-1)][(col-1)][3];
					if(col == 3){
						sky_block_regions[row][col][1] = sky_block_regions[(row-1)][(col+2)][3];
					}else if(col < 24){
						sky_block_regions[row][col][1] = sky_block_regions[(row-1)][(col+1)][3];	
					}else{
						sky_block_regions[row][col][1] = sky_block_regions[row][col][0];
					}
					if(col==6){			
						sky_block_regions[row][col][4] = sky_block_regions[row][(col-3)][2];
					}else if(col!=1){
						sky_block_regions[row][col][4] = sky_block_regions[row][(col-2)][2];
					}
				}else{
					if(col == 0)col+=1;
					sky_block_regions[row][col][0] = sky_block_regions[(row-1)][(col)][2];
					sky_block_regions[row][col][5] = sky_block_regions[(row-1)][(col)][3];
					sky_block_regions[row][col][1] = sky_block_regions[(row-1)][(col+2)][3];				
					if(col!=1){
						sky_block_regions[row][col][4] = sky_block_regions[row][(col-2)][2];
					}
				}				
			}
		}else{ 
			for(var col = 0; col < 25; col+=2){
				if(row == 2 || col > 3){
					if(col==0 || col==4)col+=1;
					if(col!=5 || row == 2){
						sky_block_regions[row][col][0] = sky_block_regions[(row-1)][(col-1)][2];
						sky_block_regions[row][col][5] = sky_block_regions[(row-1)][(col-1)][3];
					}else{
						sky_block_regions[row][col][0] = sky_block_regions[(row-1)][(col-2)][2];
						sky_block_regions[row][col][5] = sky_block_regions[(row-1)][(col-2)][3];
					}
					sky_block_regions[row][col][1] = sky_block_regions[(row-1)][(col+1)][3];				
					if(col > 1 && (col!=5 || row==2)){
						sky_block_regions[row][col][4] = sky_block_regions[row][(col-2)][2];
					}else if(col==5){
						sky_block_regions[row][col][4] = sky_block_regions[row][(col-3)][2];
					}
				}else if (col !=0){
					sky_block_regions[row][col][0] = sky_block_regions[(row-1)][(col-1)][2];
					sky_block_regions[row][col][5] = sky_block_regions[(row-1)][(col-1)][3];
					sky_block_regions[row][col][1] = sky_block_regions[(row-1)][(col+1)][3];
					if(col>1){
						sky_block_regions[row][col][4] = sky_block_regions[row][(col-2)][2];
					}
				}	
			}
		}
	}
}

function drawRegions(){
	//drawing different sky regions on the hit_regions canvas - the color is row/column dependant as rgb(0, 10*(col+1), 20*(row+1))
	for(var row = 0; row < 7; row++){
		if(row%2 == 1){
			var init_col = 0;
			for(var col = init_col; col < 25; col+=2){
				if(row >= 3){
					if(col == 0){
						col = 1;
					}else if(col == 5){
						col = 6;
					}
				}	
				var color = "rgb(0, "+((col+1)*10)+", "+((row+1)*20)+")";
				hit_regions.fillStyle = color;
				hit_regions.beginPath();
				hit_regions.moveTo(sky_block_regions[row][col][0].x, sky_block_regions[row][col][0].y);
				for (var point  = 1; point < 6; point++){
					hit_regions.lineTo(sky_block_regions[row][col][point].x, sky_block_regions[row][col][point].y);
				}
				hit_regions.closePath();
				hit_regions.fill();
			}
		}else{
			for(var col = 1; col < 25; col+=2){
				if(row > 2){
					if(col==1){
						col = 0;
					}else if(col==4){
						col = 5;
					}
				}
				var color = "rgb(0, "+((col+1)*10)+", "+((row+1)*20)+")";
				hit_regions.fillStyle = color;
				hit_regions.beginPath();
				hit_regions.moveTo(sky_block_regions[row][col][0].x, sky_block_regions[row][col][0].y);
				for (var point  = 1; point < 6; point++){
					hit_regions.lineTo(sky_block_regions[row][col][point].x, sky_block_regions[row][col][point].y);
				}
				hit_regions.closePath();
				hit_regions.fill();
			}
		}
	}

/* Draw region that contains the deer body:
*/

	hit_regions.fillStyle = 'rgb(200, 0, 200)';
	hit_regions.beginPath();
	hit_regions.moveTo(60, 50);
	hit_regions.lineTo(90, 50);
	hit_regions.lineTo(135, 115);
	hit_regions.lineTo(200, 115);
	hit_regions.lineTo(235, 75);
	hit_regions.lineTo(305, 50);
	hit_regions.lineTo(295, 105);
	hit_regions.lineTo(260, 135);
	hit_regions.lineTo(215, 140);
	hit_regions.lineTo(215, 280);
	hit_regions.lineTo(370, 250);
	hit_regions.lineTo(540, 285);
	hit_regions.lineTo(605, 330);
	hit_regions.lineTo(615, 425);
	hit_regions.lineTo(160, 470);
	hit_regions.lineTo(190, 440);
	hit_regions.lineTo(130, 360);
	hit_regions.lineTo(130, 235);
	hit_regions.lineTo(110, 155);
	hit_regions.lineTo(80, 120);
	hit_regions.closePath();
	hit_regions.fill();

	document.body.appendChild(hit_region_canvas); 

}

function initImages(){	
	doe_image.src = "doe-med.jpg";
	blank_deer.src = "doe-blank.png";
	blank_sky.src = "blank-sky.png";
	bird_image.src = "birdpainting_test.png";
	rabbit_image.src = "rabbit_test.png";

	bird_animation_array[0].src = "bird-animation/bird-emerge-frame-1.png";
	bird_animation_array[1].src = "bird-animation/bird-emerge-frame-2.png";
	bird_animation_array[2].src = "bird-animation/bird-frame-1.png";
	bird_animation_array[3].src = "bird-animation/bird-frame-2.png";
	bird_animation_array[4].src = "bird-animation/bird-frame-3.png";
	bird_animation_array[5].src = "bird-animation/bird-frame-4.png";
	bird_animation_array[6].src = "bird-animation/bird-frame-5.png";
}

function isInDeer(x,y)
{
	var ctx = $('#test_canvas')[0].getContext('2d');
	ctx.beginPath();
	ctx.moveTo(60, 50);
	ctx.lineTo(90, 50);
	ctx.lineTo(135, 115);
	ctx.lineTo(200, 115);
	ctx.lineTo(235, 75);
	ctx.lineTo(305, 50);
	ctx.lineTo(295, 105);
	ctx.lineTo(260, 135);
	ctx.lineTo(215, 140);
	ctx.lineTo(215, 280);
	ctx.lineTo(370, 250);
	ctx.lineTo(540, 285);
	ctx.lineTo(605, 330);
	ctx.lineTo(615, 425);
	ctx.lineTo(160, 470);
	ctx.lineTo(190, 440);
	ctx.lineTo(130, 360);
	ctx.lineTo(130, 235);
	ctx.lineTo(110, 155);
	ctx.lineTo(80, 120);
	ctx.closePath();

	return ctx.isPointInPath(x, y);
}

function getAreaName(x, y, on_enter_canvas)
{
	previous_area_name = area_name;
	var data = hit_regions.getImageData(x, y, 1, 1).data;
	if(data[0] > 254){
		area_name = "block_1";
	//}else if(isInDeer(x, y)){
	}else if(data[0] == 200){	
		area_name = "deer";
	}else if(y < 240){
		if(data[1] > 0){
			area_name = "skyCell_"+(((data[2] - data[2]%20)/20)-1)+"_"+(((data[1] - data[1]%10)/10)-1);
		}else{
			area_name = "sky";
		}
	}else{
		area_name = "ground";
	}
	$('#output').append('<h5>'+ area_name +'</h5>');
	did_area_change = !(previous_area_name == area_name);
	if(did_area_change || on_enter_canvas){
		$('#test_canvas').removeClass('active').addClass('inactive');
		$('.selected').removeClass('selected');
		switch(area_name.substring(0,3)){
			case "sky":
				$('#layer4').addClass('selected');
				$('#test_canvas').removeClass('inactive').addClass('active');
				break;
			case "gro":
				$('#layer5').addClass('selected');
				$('#test_canvas').removeClass('active').addClass('inactive');
				break;
			case "dee":
				$('#layer6').addClass('selected');
				$('#test_canvas').removeClass('inactive').addClass('active');
				break;
			default:
				break;
		}
	}
}

function doBirdAnimation(frame_num, left, top)
{
	var ctx = $('#test_canvas')[0].getContext('2d');
	var new_left = left+40;
	var new_top = top-30;
	var frame_index = 0;
	if(new_left < 700 && new_top > -86){
		if(frame_num < 2){
			setTimeout(function(){
				doBirdAnimation(frame_num+1, bird_frame_pos_array[frame_num+1].left, bird_frame_pos_array[frame_num+1].top);
			}, 80);
			ctx.drawImage(doe_image, 0, 0);
			if(is_sky_blank){
				ctx.drawImage(blank_sky, 0, 0);
			}
			ctx.drawImage(blank_deer, 0, 0);
			ctx.drawImage(bird_animation_array[frame_num], bird_frame_pos_array[frame_num].left, bird_frame_pos_array[frame_num].top);
		}else{
			frame_index = (frame_num%5) + 2;
			setTimeout(function(){
				doBirdAnimation(frame_num+1, new_left, new_top);
			}, 80);
			ctx.save();
			ctx.beginPath();
			ctx.rect(left, top, 86, 86);
			ctx.clip();
			ctx.drawImage(doe_image, 0, 0);
			if(is_sky_blank){
				ctx.drawImage(blank_sky, 0, 0);
			}
			ctx.drawImage(blank_deer, 0, 0);
			ctx.restore();
			ctx.drawImage(bird_animation_array[frame_index], new_left, new_top);
			if(frame_num == 5){
				doFillDeerAnimationClipping(6);
			}
		}
	}else{
		ctx.save();
		ctx.beginPath();
		ctx.rect(left - 35, top + 25, 86, 86);
		ctx.clip();
		ctx.drawImage(doe_image, 0, 0);
		if(is_sky_blank){
		ctx.drawImage(blank_sky, 0, 0);
		}
		ctx.restore();		
	}	
}

function doBlankDeerAnimationClipping(frame_num)
{
	var ctx = $('#test_canvas')[0].getContext('2d');
	if(frame_num < 7){
		setTimeout(function(){
			doBlankDeerAnimationClipping(frame_num+1);
		}, 80);
		ctx.drawImage(blank_deer, 0, 0);
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(deer_clipping_regions[frame_num][1].x, deer_clipping_regions[frame_num][1].y);
		for (var point = 2; point < deer_clipping_regions[frame_num][0].num_pts + 1; point++){
			ctx.lineTo(deer_clipping_regions[frame_num][point].x, deer_clipping_regions[frame_num][point].y);
		}
		ctx.closePath();
		ctx.clip();
		ctx.drawImage(doe_image, 0, 0);
		ctx.restore();
		if(is_sky_blank){
			ctx.drawImage(blank_sky, 0, 0);
		}

	}else{
		ctx.drawImage(blank_deer, 0, 0);
		is_active = false;
	}
}

function doFillDeerAnimationClipping(frame_num){
	var ctx = $('#test_canvas')[0].getContext('2d');
	if(frame_num > -1){
		setTimeout(function(){
			doFillDeerAnimationClipping(frame_num-1);
		}, 80);
		ctx.drawImage(blank_deer, 0, 0);
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(deer_clipping_regions[frame_num][1].x, deer_clipping_regions[frame_num][1].y);
		for (var point = 2; point < deer_clipping_regions[frame_num][0].num_pts + 1; point++){
			ctx.lineTo(deer_clipping_regions[frame_num][point].x, deer_clipping_regions[frame_num][point].y);
		}
		ctx.closePath();
		ctx.clip();
		ctx.drawImage(doe_image, 0, 0);
		if(is_sky_blank){
			ctx.drawImage(blank_sky, 0, 0);
		}
		ctx.restore();			
	}else{
		ctx.drawImage(doe_image, 0, 0);
		if(is_sky_blank){
			ctx.drawImage(blank_sky, 0, 0);
		}
		is_active = false;
	}
}

function doSkyAnimation(row, col, image_to_draw, stage, count, is_shifted){

	var ctx = $('#test_canvas')[0].getContext('2d');
	if(stage > 7){
		ctx.drawImage(image_to_draw, 0, 0);
		if(is_deer_blank){
			ctx.drawImage(blank_deer, 0, 0);
		}
		is_active = false;
	}else if(stage==1 && is_shifted){
		is_active = false;
	}else{
		/*
		if(stage==1 && count > 0 && is_deer_blank){
			count--;
			if(image_to_draw == blank_sky){
				setTimeout(function(){
					doSkyAnimation(row, col, doe_image, 0, count)
				}, 5);
			}else{
				setTimeout(function(){
					doSkyAnimation(row, col, blank_sky, 0, count)
				}, 5);
			}
		}
		*/
		setTimeout(function(){
			doSkyAnimation(row, col, image_to_draw, stage+1, count, is_shifted);
		},80);
		ctx.save();
		//create path based on row, col, and stage (using sky_blocks_regions):
		var init_row = row - stage;
		var init_col = col - stage;
		var current_row = init_row;
		var current_col = init_col;
		var draw_row;
		var draw_col;
		if(current_row < 0){
			draw_row = 0;
			draw_col = (current_col - (1-current_col%2));
		}else{
			draw_row = current_row;
			draw_col = current_col;
		}
		ctx.beginPath();
		var isFirstPoint = true;
		//Do top:
		while(current_col <= init_col + 2*stage){
			if(current_row < 0){
				draw_row = 0;
			}else{
				draw_row = current_row;
			}
			if(current_col > 23){
				if(current_row<=0){
					draw_col = 23;
				}else{
					draw_col = (23+current_row%2);
				}
			}else{
				if(current_row<0){
					draw_col = (current_col - (1-current_col%2));
				}else{
					draw_col = current_col;
				}
			}
			if(draw_row > 2 && ((draw_col <= 3 && draw_col%2 == 1 && draw_row%2 == 0)||(draw_col <= 4 && draw_col%2 == 0 && draw_row%2 == 1)) && stage!=0){
				draw_col -=1;
			}
			if(draw_row > 2 && ((draw_col >= 4 && draw_col%2 == 0 && draw_row%2 == 0)||(draw_col >= 5 && draw_col%2 == 1 && draw_row%2 == 1)) && stage!=0){
				draw_col +=1;
			}
			if(draw_row <= 2 && (draw_col%2 == draw_row%2)){
				draw_col +=1;
			}
			if(draw_col <= 0){
				if(draw_row <= 2){
					draw_col=1-draw_row%2;
				}else{
					draw_col = draw_row%2;
				}
			}
			if(isFirstPoint){
				ctx.moveTo(sky_block_regions[draw_row][draw_col][5].x, sky_block_regions[draw_row][draw_col][5].y);
				isFirstPoint = false;
			}
			ctx.lineTo(sky_block_regions[draw_row][draw_col][5].x, sky_block_regions[draw_row][draw_col][5].y);
			ctx.lineTo(sky_block_regions[draw_row][draw_col][0].x, sky_block_regions[draw_row][draw_col][0].y);

			current_col+=2;
		}

		//Do top-right:
		current_col-=2;
		while(current_row <= row){
			if(current_row < 0){
				draw_row = 0;
			}else{
				draw_row = current_row;
			}
			if(current_col > 23){
				if(current_row <=0){
					draw_col = 23;
				}else{
					draw_col = (23+current_row%2);
				}
			}else{
				if(current_row<0){
					draw_col = (current_col - (1-current_col%2));
				}else{
					draw_col = current_col;
				}
			}
			if(draw_row > 2 && ((draw_col <= 3 && draw_col%2 == 1 && draw_row%2 == 0)||(draw_col <= 4 && draw_col%2 == 0 && draw_row%2 == 1)) && stage!=0){
				draw_col -=1;
			}
			if(draw_row > 2 && ((draw_col >= 4 && draw_col%2 == 0 && draw_row%2 == 0)||(draw_col >= 5 && draw_col%2 == 1 && draw_row%2 == 1)) && stage!=0){
				draw_col +=1;
			}
			if(draw_row <= 2 && (draw_col%2 == draw_row%2)){
				draw_col +=1;
			}

			if(draw_col <= 0){
				if(draw_row <= 2){
					draw_col=1-draw_row%2;
				}else{
					draw_col = draw_row%2;
				}
			}
			ctx.lineTo(sky_block_regions[draw_row][draw_col][1].x, sky_block_regions[draw_row][draw_col][1].y);
			ctx.lineTo(sky_block_regions[draw_row][draw_col][2].x, sky_block_regions[draw_row][draw_col][2].y);
			current_row++;
			current_col++;
		}

		//Do bottom-right:
		current_col--;
		current_row--;
		while(current_row <= row + stage){
			if(current_row > 6){
				draw_row = 6;
			}else{
				draw_row = current_row;
			}
			if(current_col > 23){
				if(current_row > 6){
					draw_col = 23;
				}else{
					draw_col = (23+current_row%2);
				}
			}else{
				if(current_row <= 6){
					draw_col = current_col;
				}else{
					draw_col = (current_col - (1-current_col%2));
				}	
			}
			if(draw_row > 2 && ((draw_col <= 3 && draw_col%2 == 1 && draw_row%2 == 0)||(draw_col <= 4 && draw_col%2 == 0 && draw_row%2 == 1)) && stage!=0){
				draw_col -=1;
			}
			if(draw_row > 2 && ((draw_col >= 4 && draw_col%2 == 0 && draw_row%2 == 0)||(draw_col >= 5 && draw_col%2 == 1 && draw_row%2 == 1)) && stage!=0){
				draw_col +=1;
			}
			if(draw_col <= 0){
				if(draw_row <= 2){
					draw_col=1-draw_row%2;
				}else{
					draw_col = draw_row%2;
				}
			}
			ctx.lineTo(sky_block_regions[draw_row][draw_col][2].x, sky_block_regions[draw_row][draw_col][2].y);
			if(current_col < 23+current_row%2){
				ctx.lineTo(sky_block_regions[draw_row][draw_col][3].x, sky_block_regions[draw_row][draw_col][3].y);
			}	
			current_row++;
			current_col--;
		}
		//Do bottom:
		current_col++;
		current_row--;
		while(current_col >= init_col){
			if(current_row > 6){
				draw_row = 6;
			}else{
				draw_row = current_row;
			}
			if(current_col > 23){
				if(current_row > 6){
					draw_col = 23;
				}else{
					draw_col = (23+current_row%2);
				}
			}else{
				if(current_row <= 6){
					draw_col = current_col;
				}else{
					draw_col = (current_col - (1-current_col%2));
				}	
			}
			if(draw_row > 2 && ((draw_col <= 3 && draw_col%2 == 1 && draw_row%2 == 0)||(draw_col <= 4 && draw_col%2 == 0 && draw_row%2 == 1)) && stage!=0){
				draw_col -=1;
			}
			if(draw_row > 2 && ((draw_col >= 4 && draw_col%2 == 0 && draw_row%2 == 0)||(draw_col >= 5 && draw_col%2 == 1 && draw_row%2 == 1)) && stage!=0){
				draw_col +=1;
			}	
			if(draw_col <= 0){
				if(draw_row <= 2){
					draw_col=1-draw_row%2;
				}else{
					draw_col = draw_row%2;
				}
			}
			ctx.lineTo(sky_block_regions[draw_row][draw_col][3].x, sky_block_regions[draw_row][draw_col][3].y);
			ctx.lineTo(sky_block_regions[draw_row][draw_col][4].x, sky_block_regions[draw_row][draw_col][4].y);
			current_col-=2;
		}
		//Do bottom-left:
		current_col+=2;
		while(current_row >= row){
			if(current_row > 6){
				draw_row = 6;
			}else{
				draw_row = current_row;
			}
			if(current_row > 6){
				draw_col = (current_col - (1-current_col%2));
			}else{
				draw_col = current_col;
			}
			if(draw_row > 2 && ((draw_col <= 3 && draw_col%2 == 1 && draw_row%2 == 0)||(draw_col <= 4 && draw_col%2 == 0 && draw_row%2 == 1)) && stage!=0){
				draw_col -=1;
			}
			if(draw_row > 2 && ((draw_col >= 4 && draw_col%2 == 0 && draw_row%2 == 0)||(draw_col >= 5 && draw_col%2 == 1 && draw_row%2 == 1)) && stage!=0){
				draw_col +=1;
			}
			if(draw_col <= 0){
				if(draw_row <= 2){
					draw_col=1-draw_row%2;
				}else{
					draw_col = draw_row%2;
				}
			}
			ctx.lineTo(sky_block_regions[draw_row][draw_col][4].x, sky_block_regions[draw_row][draw_col][4].y);
			if(current_row <= 6){	
				ctx.lineTo(sky_block_regions[draw_row][draw_col][5].x, sky_block_regions[draw_row][draw_col][5].y);
			}
			current_col--;
			current_row--;
		}
		//Do top-left:
		current_col++;
		current_row++;
		while(current_row >= init_row){
			if(current_row < 0){
				draw_row = 0;
			}else{
				draw_row = current_row;
			}
			if(current_col > 23+current_row%2){
				draw_col = (23+current_row%2);
			}else{
				if(current_row < 0){
					draw_col = (current_col - (1-current_col%2));
				}else{
					draw_col = current_col;
				}
			}
			if(draw_row > 2 && ((draw_col <= 3 && draw_col%2 == 1 && draw_row%2 == 0)||(draw_col <= 4 && draw_col%2 == 0 && draw_row%2 == 1)) && stage!=0){
				draw_col -=1;
			}
			if(draw_row > 2 && ((draw_col >= 4 && draw_col%2 == 0 && draw_row%2 == 0)||(draw_col >= 5 && draw_col%2 == 1 && draw_row%2 == 1)) && stage!=0){
				draw_col +=1;
			}
			if(draw_col <= 0){
				if(draw_row <= 2){
					draw_col=1-draw_row%2;
				}else{
					draw_col = draw_row%2;
				}
			}
			ctx.lineTo(sky_block_regions[draw_row][draw_col][5].x, sky_block_regions[draw_row][draw_col][5].y);
			ctx.lineTo(sky_block_regions[draw_row][draw_col][0].x, sky_block_regions[draw_row][draw_col][0].y);
			current_row--;
			current_col++;
		}
		ctx.closePath();
		ctx.clip();
		ctx.drawImage(image_to_draw, 0, 0);
		ctx.restore();
		if(is_deer_blank){
			ctx.drawImage(blank_deer, 0, 0);
		}

	}

}

function getSkyRegion(x,y){
	 var data = hit_regions.getImageData(x, y, 1, 1).data;
	 var cell = {};
	 cell.row = ((data[2] - data[2]%20)/20)-1;
	 cell.col = ((data[1] - data[1]%10)/10)-1;
	 return cell;
}

function getMaxSkyDistance(row, col){
	/* Use row and col of start cell to find the distance to each of the 4 corners of the
	 * sky, and compare them to find the maximum (in units of sky-grid cells), then return
	 * that value.  This will be used to determine when the recursive sky animation function
	 * should stop (every time the "stage" is incremented, the radius goes up by 1 sky-grid
	 * cell unit - the stage needs to be incremented until it is bigger than this max
	 * distance).
	 */
}

function changeCanvas(x, y, is_shifted)
{
	var ctx = $('#test_canvas')[0].getContext('2d');
	if(!(is_active)){
		if(area_name == 'deer'){
			if(is_deer_blank){
				is_active = true;
				doBirdAnimation(0, bird_frame_pos_array[0].left, bird_frame_pos_array[0].top);
				is_deer_blank = false;
				$('.selected').removeClass('selected');

			}else{
				is_active = true;
				doBlankDeerAnimationClipping(0);	
				is_deer_blank = true;
			}
		}else if(area_name.substring(0, 3) == 'sky'){
			if(is_sky_blank){
				var sky_start_cell = getSkyRegion(x, y);
				//max_sky_distance = getMaxSkyDistance(sky_start_cell.row, sky_start_cell.col);
				if(sky_start_cell.row>=0 && sky_start_cell.col>=0 && (sky_start_cell.row%2 != sky_start_cell.col%2 || sky_start_cell.col < 4)){
					is_active = true;
					if(is_shifted){
						doSkyAnimation(sky_start_cell.row, sky_start_cell.col, doe_image, 0, 5, is_shifted);
					}else{
						doSkyAnimation(sky_start_cell.row, sky_start_cell.col, doe_image, 0, 5, is_shifted);
						is_sky_blank = false;
						if(is_deer_blank){
							ctx.drawImage(blank_deer, 0, 0);
						}
					}
				}
			}else{
				var sky_start_cell = getSkyRegion(x, y);
				//max_sky_distance = getMaxSkyDistance(sky_start_cell.row, sky_start_cell.col);
				if(sky_start_cell.row>=0 && sky_start_cell.col>=0 && (sky_start_cell.row%2 != sky_start_cell.col%2 || sky_start_cell.col < 4)){
					is_active = true;
					if(is_shifted){
						doSkyAnimation(sky_start_cell.row, sky_start_cell.col, blank_sky, 0, 5, is_shifted);
					}else{
						doSkyAnimation(sky_start_cell.row, sky_start_cell.col, blank_sky, 0, 5, is_shifted);
						is_sky_blank = true;
						if(is_deer_blank){
							ctx.drawImage(blank_deer, 0, 0);
						}
					}
				}
			}
		}
	}
}
function drawNewImg(index){
	hit_regions.clearRect(0, 0, 700, 575);
	if(index==0){
		drawRegions();
	}
	if(current_image > index){
		drawNewImgAnimation(index, 20, 0, -700);
	}else if(current_image < index){
		drawNewImgAnimation(index, -20, 0, 700);
	}else{
		var ctx = $('#test_canvas')[0].getContext('2d');
		ctx.drawImage(main_images[index], 0, 0);
	}
}

function drawNewImgAnimation(index, shift, position_old_img, position_new_img){
	var ctx = $('#test_canvas')[0].getContext('2d');
	if((shift < 0 && position_new_img <= 0) || (shift > 0 && position_new_img >= 0)){
		ctx.clearRect(0, 0, 700, 575);
		ctx.drawImage(main_images[index], 0, 0);
		current_image = index;
		if(index >0){
			ctx.fillStyle='rgba(0,0,0,0.2)';
			ctx.fillRect(0,0,700,575);
			ctx.font="30px Arial";
			ctx.fillStyle='rgba(255,255,255,0.6)';
			ctx.textAlign="center";
			ctx.fillText("work in progress", 350, 280);
		}
	}else{
		setTimeout(function(){
			drawNewImgAnimation(index, shift, position_old_img+shift, position_new_img+shift);
		}, 20);
		ctx.clearRect(0, 0, 700, 575);
		ctx.drawImage(main_images[current_image], position_old_img, 0);
		if(current_image == 0){
			if(is_sky_blank){
				ctx.drawImage(blank_sky, position_old_img, 0);
			}
			if(is_deer_blank){
				ctx.drawImage(blank_deer, position_old_img, 0);
			}
		}
		ctx.drawImage(main_images[index], position_new_img, 0);
	}
}

function transitionAnimation(index){
	drawNewImg(index);
	if(index==2){
		$('#next_pic').removeClass('enabled-right active').addClass('disabled-right inactive');
		$('#prev_pic').removeClass('disabled-left inactive').addClass('enabled-left active');
	}else if(index==0){
		$('#next_pic').removeClass('disabled-right inactive').addClass('enabled-right active');
		$('#prev_pic').removeClass('enabled-left active').addClass('disabled-left inactive');
		is_deer_blank = false;
		is_sky_blank = false;
	}else{
		$('#next_pic').removeClass('disabled-right inactive').addClass('enabled-right active');
		$('#prev_pic').removeClass('disabled-left inactive').addClass('enabled-left active');
	}
}
