


            uniform float time;
            uniform float uTime;

			varying float size_fadding;
      
			attribute float id;

            attribute float id_particle;
			attribute vec3 customColor;

            attribute float iteration;

            uniform int particles_number;


            uniform mat4 ProjectionMatrix;

            uniform int number_segmentation;
            uniform float gap_two_gates;

            varying float sprite_size;

            varying float segmentation;
            varying float index_;

            uniform vec2 path_quadratic[path_length];

            uniform int gate_position[number_max_gates];
            uniform float size[number_max_gates];
            uniform float gate_opacity[number_max_gates];
            uniform float wiggling_gate[number_max_gates];
            uniform vec3 gate_colors[number_max_gates];
            uniform float gate_velocity[number_max_gates];

            uniform int temporal_delay[real_number_particles];
            uniform int varyingData;

            

            
            uniform int number_segmentation_pattern_fitting;

			 varying vec3 vColor;
            varying float my_opacity;
            varying float distance_with_arrival;
            varying float distance_with_departure;
            float actual_velocity;



            varying float vRotation;
            int gate = 0;

            int MOD(int a, int b){

                int result = a / b;
                result = b * result;
                result = a - result;
                return result;
            }
            float rand(vec2 co){
                return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
            }
            float distance(float x1, float y1, float x2, float y2){

                float longueur = sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
                return longueur;
            }
            int determine_which_gate(int index_thorique){

                for(int i = 0; i < number_max_gates - 1; i++){
                    int actual_gate_pos = gate_position[i] ;
                    int next_gate_pos = gate_position[i+1] ;
                    if(index_thorique <= next_gate_pos && index_thorique > actual_gate_pos){
                        gate = i;
                    }
  
                    if(index_thorique >= next_gate_pos && index_thorique >= actual_gate_pos &&
                        next_gate_pos == 0 && actual_gate_pos != 0){
                        gate = i;
                    }
                }
                return gate;
            }
            float delay_to_other_particle(int gate){
                float difference_gate_before = 0.0;

                if (gate == 20){
                    for(int i = 0; i < 20; i++){
                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates / gate_velocity[i]);
                    }
                }
                else if (gate == 19){
                    for(int i = 0; i < 19; i++){
                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates / gate_velocity[i]);
                    }
                }
                else if (gate == 18){
                    for(int i = 0; i < 18; i++){
                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates / gate_velocity[i]);
                    }
                }
                else if (gate == 17){
                    for(int i = 0; i < 17; i++){
                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates / gate_velocity[i]);
                    }
                }
                else if (gate == 16){
                    for(int i = 0; i < 16; i++){
                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates / gate_velocity[i]);
                    }
                }
                else if (gate == 15){
                    for(int i = 0; i < 15; i++){
                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates / gate_velocity[i]);
                    }
                }
                else if (gate == 14){
                    for(int i = 0; i < 14; i++){
                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates / gate_velocity[i]);
                    }
                }
                else if (gate == 13){
                    for(int i = 0; i < 13; i++){
                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates / gate_velocity[i]);
                    }
                }
                else if (gate == 12){
                    for(int i = 0; i < 12; i++){
                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates / gate_velocity[i]);
                    }
                }
                else if (gate == 11){
                    for(int i = 0; i < 11; i++){
                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates / gate_velocity[i]);
                    }
                }
                else if (gate == 10){
                    for(int i = 0; i < 10; i++){
                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates / gate_velocity[i]);
                    }
                }
                else if (gate == 9){
                    for(int i = 0; i < 9; i++){
                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates / gate_velocity[i]);
                    }
                }
                else if (gate == 8){
                    for(int i = 0; i < 8; i++){
                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates / gate_velocity[i]);
                    }
                }
                else if (gate == 7){
                    for(int i = 0; i < 7; i++){
                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates / gate_velocity[i]);
                    }
                }
                else if (gate == 6){
                    for(int i = 0; i < 6; i++){
                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates / gate_velocity[i]);
                    }
                }
                else if (gate == 5){
                    for(int i = 0; i < 5; i++){
                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates / gate_velocity[i]);
                    }
                }
                else if (gate == 4){
                    for(int i = 0; i < 4; i++){
                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates / gate_velocity[i]);
                    }
                }
                else if (gate == 3){
                    for(int i = 0; i < 3; i++){
                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates / gate_velocity[i]);
                    }
                }
                else if (gate == 2){
                    for(int i = 0; i < 2; i++){
                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates / gate_velocity[i]);
                    }
                }
                else if (gate == 1){
                    for(int i = 0; i < 1; i++){
                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates / gate_velocity[i]);
                    }
                }
                else if (gate == 0){
                    for(int i = 0; i < 0; i++){
                        difference_gate_before = difference_gate_before + gap_two_gates - (gap_two_gates / gate_velocity[i]);
                    }
                }
                return difference_gate_before;
            }
            float fadeSize(float actualSize, float nextSize, int steps, int index){ 

                float temporarySize = ((nextSize - actualSize)/ float(steps)) * float(index);
                return actualSize + temporarySize;

            }
            vec3 fadeRGB(vec3 oldColor, vec3 newColor, int steps, int index){

                vec3 my_color;
                float redStepAmount = ((newColor.x - oldColor.x) / float(steps)) * float(index);
                float greenStepAmount = ((newColor.y - oldColor.y) / float(steps)) * float(index);
                float blueStepAmount = ((newColor.z - oldColor.z) / float(steps)) * float(index);
                
                newColor.x = oldColor.x + redStepAmount;
                newColor.y = oldColor.y + greenStepAmount;
                newColor.z = oldColor.z + blueStepAmount;

                my_color = vec3(newColor.x ,newColor.y, newColor.z);

                return my_color;

            }
            float noise(vec2 p){
                vec2 ip = floor(p);
                vec2 u = fract(p);
                u = u*u*(3.0-2.0*u);

                float res = mix(
                    mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
                    mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
                return res*res;
            }
            vec2 bezier(int t, vec2 p0,vec2 p1,vec2 p2,vec2 p3){

                highp float timer = float(t);

                highp float time = timer * 1.0/(float(number_segmentation));

                float cX = 3.0 * (p1.x - p0.x);
                float bX = 3.0 * (p2.x - p1.x) - cX;
                float aX = p3.x - p0.x - cX - bX;

                float cY = 3.0 * (p1.y - p0.y);
                float bY = 3.0 * (p2.y - p1.y) - cY;
                float aY = p3.y - p0.y - cY - bY;

                float x = (aX * pow(time, 3.0)) + (bX * pow(time, 2.0)) + (cX * time) + p0.x;
                float y = (aY * pow(time, 3.0)) + (bY * pow(time, 2.0)) + (cY * time) + p0.y;

                vec2 result = vec2( x,y );

                return result;
            }
            mat4 rotation(float x) {
              vec4 line_1 = vec4(cos(x), -sin(x), 0.0, 0.0);
              vec4 line_2 = vec4(sin(x), cos(x), 0.0, 0.0);
              vec4 line_3 = vec4(0.0, 0.0, 1.0, 0.0);
              vec4 line_4 = vec4(0.0, 0.0, 0.0, 1.0);

              return mat4(line_1,line_2,line_3,line_4);
            }
            mat4 translation(float x, float y) {
              vec4 line_1 = vec4(1.0, 0.0, 0.0,  x);
              vec4 line_2 = vec4(0.0, 1.0, 0.0,  y);
              vec4 line_3 = vec4(0.0, 0.0, 1.0, 0.0);
              vec4 line_4 = vec4(0.0, 0.0, 0.0, 1.0);

              return mat4(line_1,line_2,line_3,line_4);
            }
            mat4 changerEchelle(float sx, float sy) {
              vec4 line_1 = vec4(sx, 0.0, 0.0, 0.0);
              vec4 line_2 = vec4(0.0, sy, 0.0, 0.0);
              vec4 line_3 = vec4(0.0, 0.0, 1.0, 0.0);
              vec4 line_4 = vec4(0.0, 0.0, 0.0, 1.0);

              return mat4(line_1,line_2,line_3,line_4);
            }

			void main() {

				vColor = customColor;
				vec3 newPosition = position;
                vec4 mvPosition;
				float ANGLE = 90.0;


                highp int id_faisceaux = int(id_particle);
                actual_velocity = float(gate_velocity[0]);

                float timer =  uTime;
                highp int my_time = int(timer);

        
                my_time = my_time + temporal_delay[id_faisceaux];
           
                int index_old = MOD(my_time , number_segmentation_pattern_fitting);
                

       
                float virtual_index = float(index_old);
                virtual_index = virtual_index; 
                highp int index2 = int(virtual_index);

       
              gate = determine_which_gate(index2);



                float multiplicateur = 1.0;
                if (gate_velocity[gate] == 1.0){multiplicateur = 0.0;}

                float difference = 0.0;
                float difference_gate_before = 0.0;
                
                if (gate_velocity[gate]!= 1.0){
                    difference = float(gate_position[gate]) * multiplicateur * (gate_velocity[gate] - 1.0);
                }
                difference_gate_before = delay_to_other_particle(gate);

                
                float new_index = ( float(index2) * gate_velocity[gate] ) - difference + difference_gate_before;
                highp int index = int(new_index);

                

                vec4 path;
                vec4 path_next;
                highp int path_id = int(id) * (4);

                
                path = vec4( bezier(index, path_quadratic[path_id],path_quadratic[path_id+ 1],path_quadratic[path_id + 2],path_quadratic[path_id+3]), 1.0,1.0);
                path_next = vec4( bezier(index +1, path_quadratic[path_id],path_quadratic[path_id+ 1],path_quadratic[path_id + 2],path_quadratic[path_id+3]), 1.0,1.0);

                
                distance_with_arrival = distance(path.x, path.y, path_quadratic[path_id+3].x, path_quadratic[path_id+3].y);
                distance_with_departure = distance(path.x, path.y, path_quadratic[path_id].x, path_quadratic[path_id].y);
                float random = noise(vec2( index , index )) * wiggling_gate[gate];
                float angle = atan(path_next.y - path.y, path_next.x - path.x );
                vRotation =  - angle;



                


                mat4 my_matrice =  translation(path.x + random,path.y+ random);
                vec4 positionEchelle = vec4(0.0,0.0,1.0,1.0) * my_matrice;
                mvPosition =  modelViewMatrix * positionEchelle;




                size_fadding = size[gate];
                my_opacity = gate_opacity[gate];
                
                vColor = vec3(gate_colors[gate].x ,gate_colors[gate].y, gate_colors[gate].z);
                
                if (size[gate] != size[gate+1]){
                   size_fadding = fadeSize(size[gate], size[gate+1], gate_position[gate+1] - gate_position[gate], index - gate_position[gate]);
                }
                
                if (gate_opacity[gate] != gate_opacity[gate+1]){
                   my_opacity = fadeSize(gate_opacity[gate], gate_opacity[gate+1], gate_position[gate+1] - gate_position[gate], index - gate_position[gate]);
                }

                index_ = float(index);
                segmentation = float(number_segmentation);

                if (index >= number_segmentation || index <= 0){my_opacity = 0.0;}
                    
                gl_PointSize = size_fadding;
                sprite_size = gl_PointSize;

                gl_Position = projectionMatrix * mvPosition;


            }
