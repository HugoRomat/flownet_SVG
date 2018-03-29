//uniform vec3 color;
            uniform sampler2D texture;
            //uniform float zoom;

            varying float distance_with_arrival;
            varying float distance_with_departure;
            varying float my_opacity;
            varying vec3 vColor;

            varying float vRotation;

            varying float sprite_size;

            varying float segmentation;
            varying float index_;



            mat2 rotation(float x) {
              vec2 line_1 = vec2(cos(x), -sin(x));
              vec2 line_2 = vec2(sin(x), cos(x));

              return mat2(line_1,line_2); 
            }
            mat2 translation(float x, float y) {
              vec2 line_1 = vec2(1.0,x);
              vec2 line_2 = vec2(1.0,y);

              return mat2(line_1,line_2); 
            }
            mat2 changerEchelle(float sx, float sy) {
              vec2 line_1 = vec2(sx, 0.0);
              vec2 line_2 = vec2(0.0, sy);

              return mat2(line_1,line_2); 
            }


            void main() {

                float mid = 0.5;
                mat2 my_matrix = /** translation(mid, mid) **/rotation(vRotation) ;
                vec2 rotated =  my_matrix * vec2(gl_PointCoord.x - mid, gl_PointCoord.y - mid) ;
                rotated.x = rotated.x + mid;
                rotated.y = rotated.y + mid;




                /*vec2 rotated = vec2(
                        cos(vRotation) * (gl_PointCoord.x - mid) + sin(vRotation) * (gl_PointCoord.y - mid) + mid,
                        cos(vRotation) * (gl_PointCoord.y - mid) - sin(vRotation) * (gl_PointCoord.x - mid) + mid);*/

                //Texture 2D return the RGBA
                vec4 color = vec4(1.0,1.0,1.0, 1.0);

                vec2 new_coord =  my_matrix * gl_PointCoord;


                
                // if (rotated.x > 0.5){
                //   color = vec4(1.0,1.0,1.0, 0.0);
                // }

                /*************************************
                ARRIVE DE LA PARTICULE 

                3 cas a distinguer : 
                - Le milieu de la particule est avant le NOEUD
                - Le milieu de la particule est apres le NOEUD
                - Le milieu de la particule a depasse le NOEUD

                *************************************/
                if (distance_with_arrival < (sprite_size / 2.0) && index_ < segmentation){
                  if ( rotated.x - 0.5 > (distance_with_arrival / sprite_size)){
                    color = vec4(1.0,1.0,1.0, 0.0);
                  }
                }

                if (distance_with_arrival < (sprite_size / 2.0) && index_ >= segmentation){
                  if (rotated.x >= 0.5 - (distance_with_arrival / sprite_size)){
                    color = vec4(1.0,1.0,1.0, 0.0);
                  }
                }
                //QUAND LA PARTICULE A DEPASSE LE NOEUD
                if (distance_with_arrival > (sprite_size / 2.0) && index_ > segmentation){
                    color = vec4(1.0,1.0,1.0, 0.0);
                }

                /*************************************
                DEPART DE LA PARTICULE 
                
                3 cas a distinguer : 
                - Le milieu de la particule est avant le NOEUD
                - Le milieu de la particule est apres le NOEUD
                - Le milieu de la particule a depasse le NOEUD

                *************************************/
                if (distance_with_departure < (sprite_size / 2.0) && index_ < 0.0){
                  if ( rotated.x + 0.5 > (distance_with_departure / sprite_size)){
                    color = vec4(1.0,1.0,1.0, 0.0);
                  }
                }
                if (distance_with_departure < (sprite_size / 2.0) && index_ >= 0.0){
                  if ( rotated.x <= 0.5-(distance_with_departure / sprite_size)){
                    color = vec4(1.0,1.0,1.0, 0.0);
                  }
                }

                if (distance_with_departure > (sprite_size / 2.0) && index_ < 0.0){
                  color = vec4(1.0,1.0,1.0, 0.0);
                }


                
                //if ( rotated.x < 0.5){color = vec4(1.0,1.0,1.0, 0.0);}

                vec4 rotatedTexture = texture2D( texture,  rotated) * color;

                gl_FragColor = vec4( vColor, my_opacity ) * rotatedTexture;



               
                //gl_FragColor = vec4( vColor, my_opacity );
                //gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );

            }