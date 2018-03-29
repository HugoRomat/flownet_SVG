var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var flownet;
(function (flownet) {
    var Main = (function () {
        function Main(div, nodes, links, width, height, bg_color, alpha) {
            this.frame = 0;
            this.actual_frame = 0;
            this.then = Date.now();
            this.startTime = this.then;
            this.fps = 60;
            this.fpsInterval = 1000 / this.fps;
            this.delay_time_due_to_stop = Date.now();
            this.timerInterval = {};
            this.div = div;
            this.links = links;
            this.nodes = nodes;
            console.log(this.links);
            this.interface_ = new Visualisation(div, width, height, bg_color, alpha);
            this.sparkiz = new flownet.flownet(this.nodes, this.links, this.interface_);
            this._UI = new UI(this.sparkiz, this.interface_.scene, this.interface_.camera, this.interface_.renderer, this.interface_.raycaster, this.div);
            this.mapping = new Mapping(this.sparkiz);
            console.log("LAUNCH");
        }
        Main.prototype.stop_renderer = function () {
            var self = this;
            this.then = Date.now();
            clearInterval(this.refreshIntervalId);
            cancelAnimationFrame(this.refreshIntervalId);
        };
        Main.prototype.pause_renderer = function () {
            var self = this;
            this.delay_time_due_to_stop = Date.now();
            clearInterval(this.refreshIntervalId);
            cancelAnimationFrame(this.refreshIntervalId);
        };
        Main.prototype.start_renderer = function () {
            var delta = (new Date().getTime() - this.delay_time_due_to_stop);
            this.then = this.then + delta;
            clearInterval(this.refreshIntervalId);
            cancelAnimationFrame(this.refreshIntervalId);
            this.with_absolute_time();
            console.log(this);
        };
        Main.prototype.with_absolute_time = function () {
            this.delay_time_due_to_stop = new Date().getTime();
            this.delta = (new Date().getTime() - this.then) / 1000;
            this.number_frame = 60 * this.delta;
            this.render(this.number_frame);
            this.frame++;
            this.refreshIntervalId = requestAnimationFrame(this.with_absolute_time.bind(this));
        };
        Main.prototype.render = function (number_frame) {
            this.sparkiz.updateParticle(number_frame);
            this.interface_.renderer.render(this.interface_.scene, this.interface_.camera);
        };
        Main.prototype.add_controls_anim = function () {
            var self = this;
            var play = document.createElement("button");
            play.name = "play";
            play.type = "button";
            play.value = "play";
            play.id = "play";
            play.style.position = "absolute";
            play.style.left = "0px";
            play.innerHTML = "play";
            var pause = document.createElement("button");
            pause.name = "pause";
            pause.type = "button";
            pause.value = "pause";
            pause.id = "pause";
            pause.style.position = "absolute";
            pause.style.left = "40px";
            pause.innerHTML = "pause";
            pause.onclick = function () { self.pause_renderer(); };
            play.onclick = function () { self.start_renderer(); };
            var new_container = self.div.substring(1);
            document.getElementById(new_container).appendChild(play);
            document.getElementById(new_container).appendChild(pause);
        };
        return Main;
    }());
    flownet.Main = Main;
})(flownet || (flownet = {}));
var flownet;
(function (flownet) {
    function force(div, width, height, color, alpha) {
        return new Force(div, width, height, color, alpha);
    }
    flownet.force = force;
    var Force = (function () {
        function Force(div, width, height, color, alpha) {
            this.viz = new flownet.Main(div, null, null, width, height, color, alpha);
            this.sparkiz = this.viz.sparkiz;
            return this;
        }
        Force.prototype.nodes = function (nodes) {
            console.log(this);
            this.sparkiz.nodes = nodes;
            return this;
        };
        Force.prototype.links = function (links) {
            this.sparkiz.links = links;
            for (var i = 0; i < this.sparkiz.links.length; i++)
                this.sparkiz.links[i].link_length = 90;
            return this;
        };
        Force.prototype.create_layout = function () {
            this.sparkiz.map_links_nodes();
            return this;
        };
        Force.prototype.create_WEBGL_element = function () {
            this.sparkiz.create();
            return this;
        };
        Force.prototype.start_particle_delay = function (delay) {
            this.viz.then -= delay;
            return this;
        };
        Force.prototype.start = function (time) {
            if (time != undefined)
                this.sparkiz.launch_network(time);
            if (time == undefined)
                this.sparkiz.launch_network_without_computation();
            this.viz.with_absolute_time();
            return this;
        };
        Force.prototype.startAPIparticule_oneitem = function (time) {
            this.sparkiz.launch_network2(time);
            this.viz.with_absolute_time();
            return this;
        };
        Force.prototype.stop = function () {
            this.viz.stop_renderer();
            return this;
        };
        Force.prototype.pause = function () {
            this.viz.pause_renderer();
            return this;
        };
        Force.prototype.network = function (visual_attr, amount) {
        };
        Force.prototype.controls = function (bool) {
            if (bool == true)
                this.viz.add_controls_anim();
            return this;
        };
        Force.prototype.zoom = function (bool) {
            if (bool == true)
                this.viz._UI.mouse_event();
            return this;
        };
        Force.prototype.setZoom = function (value) {
            this.viz._UI.setZoom(value);
            return this;
        };
        Force.prototype.on = function (parameter, callback) {
            switch (parameter) {
                case "end":
                    this.sparkiz.callback = callback;
                    return this;
            }
        };
        Force.prototype.particles = function (visual_attr, callback, gate) {
            if (gate != undefined && gate > 1) {
                console.log("Gate shoub be comprise between 0 and 1 ...");
                return false;
            }
            var value;
            var gate_position;
            if (gate != undefined) {
                gate = Math.round(gate * 20);
            }
            switch (visual_attr) {
                case "color":
                    for (var i = 0; i < this.sparkiz.links.length; i++) {
                        if (typeof (arguments[1]) == 'string') {
                            value = new THREE.Color(arguments[1]);
                        }
                        else {
                            var a = callback(this.sparkiz.links[i], i);
                            value = new THREE.Color(a);
                        }
                        if (gate == undefined) {
                            gate_position = 0;
                        }
                        if (gate != undefined) {
                            gate_position = gate;
                        }
                        for (var k = gate_position; k < this.sparkiz.number_max_gates; k++) {
                            this.sparkiz.links[i].gate_colors[k] = value;
                        }
                    }
                    return this;
                case "size":
                    for (var i = 0; i < this.sparkiz.links.length; i++) {
                        if (typeof (arguments[1]) == 'number') {
                            value = arguments[1];
                        }
                        else {
                            value = callback(this.sparkiz.links[i], i);
                        }
                        if (gate == undefined) {
                            gate_position = 0;
                        }
                        if (gate != undefined) {
                            gate_position = gate;
                        }
                        for (var k = gate_position; k < this.sparkiz.number_max_gates; k++) {
                            this.sparkiz.links[i].size[k] = value;
                        }
                    }
                    return this;
                case "opacity":
                    for (var i = 0; i < this.sparkiz.links.length; i++) {
                        if (typeof (arguments[1]) == 'number') {
                            value = arguments[1];
                        }
                        else {
                            value = callback(this.sparkiz.links[i], i);
                        }
                        if (gate == undefined) {
                            gate_position = 0;
                        }
                        if (gate != undefined) {
                            gate_position = gate;
                        }
                        for (var k = gate_position; k < this.sparkiz.number_max_gates; k++) {
                            this.sparkiz.links[i].gate_opacity[k] = value;
                        }
                    }
                    return this;
                case "speed":
                    for (var i = 0; i < this.sparkiz.links.length; i++) {
                        if (typeof (arguments[1]) == 'number') {
                            value = arguments[1];
                        }
                        else {
                            value = callback(this.sparkiz.links[i], i);
                        }
                        if (gate == undefined) {
                            gate_position = 0;
                        }
                        if (gate != undefined) {
                            gate_position = gate;
                        }
                        for (var k = gate_position; k < this.sparkiz.number_max_gates; k++) {
                            this.sparkiz.links[i].gate_velocity[k] = value;
                        }
                    }
                    return this;
                case "wiggling":
                    for (var i = 0; i < this.sparkiz.links.length; i++) {
                        if (typeof (arguments[1]) == 'number') {
                            value = arguments[1];
                        }
                        else {
                            value = callback(this.sparkiz.links[i], i);
                        }
                        if (gate == undefined) {
                            gate_position = 0;
                        }
                        if (gate != undefined) {
                            gate_position = gate;
                        }
                        for (var k = gate_position; k < this.sparkiz.number_max_gates; k++) {
                            this.sparkiz.links[i].wiggling_gate[k] = value;
                        }
                    }
                    return this;
                case "pattern":
                    for (var i = 0; i < this.sparkiz.links.length; i++) {
                        if (arguments[1] instanceof Array) {
                            value = arguments[1];
                        }
                        else {
                            value = callback(this.sparkiz.links[i], i);
                        }
                        this.sparkiz.links[i].temporal_distribution2 = value;
                    }
                    return this;
                case "track":
                    for (var i = 0; i < this.sparkiz.links.length; i++) {
                        if (arguments[1] instanceof Array) {
                            value = arguments[1];
                        }
                        else {
                            value = callback(this.sparkiz.links[i], i);
                        }
                        this.sparkiz.links[i].spatial_distribution = value;
                    }
                    return this;
                case "frequency":
                    for (var i = 0; i < this.sparkiz.links.length; i++) {
                        if (typeof (arguments[1]) == 'number') {
                            value = arguments[1];
                        }
                        else {
                            value = callback(this.sparkiz.links[i], i);
                        }
                        this.sparkiz.links[i].frequency_pattern = 1 / parseFloat(value);
                    }
                    return this;
                case "texture":
                    for (var i = 0; i < this.sparkiz.links.length; i++) {
                        if (typeof (arguments[1]) == 'string') {
                            value = arguments[1];
                        }
                        else {
                            value = callback(this.sparkiz.links[i], i);
                        }
                        this.sparkiz.load_particle_texture(i, value);
                    }
                    return this;
            }
        };
        Force.prototype.tracks = function (visual_attr, callback) {
            var value;
            switch (visual_attr) {
                case "opacity":
                    for (var i = 0; i < this.sparkiz.links.length; i++) {
                        if (typeof (arguments[1]) == 'number') {
                            value = arguments[1];
                        }
                        else {
                            value = callback(this.sparkiz.links[i], i);
                        }
                        this.sparkiz.links[i].roads_opacity = value;
                    }
                    return this;
                case "color":
                    for (var i = 0; i < this.sparkiz.links.length; i++) {
                        if (typeof (arguments[1]) == 'string') {
                            value = new THREE.Color(arguments[1]);
                        }
                        else {
                            var a = callback(this.sparkiz.links[i], i);
                            value = new THREE.Color(a);
                        }
                        this.sparkiz.links[i].roads_color = value;
                    }
                    return this;
                case "count":
                    for (var i = 0; i < this.sparkiz.links.length; i++) {
                        if (typeof (arguments[1]) == 'number') {
                            value = arguments[1];
                        }
                        else {
                            value = callback(this.sparkiz.links[i], i);
                        }
                        this.sparkiz.number_roads.push(value);
                    }
                    return this;
            }
        };
        Force.prototype.link_properties = function (visual_attr, callback) {
            var value;
            switch (visual_attr) {
                case "color":
                    for (var i = 0; i < this.sparkiz.links.length; i++) {
                        if (typeof (arguments[1]) == 'string') {
                            value = new THREE.Color(arguments[1]);
                        }
                        else {
                            var a = callback(this.sparkiz.links[i], i);
                            value = new THREE.Color(a);
                        }
                        this.sparkiz.tube[i].children[0].material.color.setHex(value.getHex());
                    }
                    return this;
                case "size":
                    for (var i = 0; i < this.sparkiz.links.length; i++) {
                        if (typeof (arguments[1]) == 'number') {
                            value = arguments[1];
                        }
                        else {
                            var value = callback(this.sparkiz.links[i], i);
                        }
                        this.sparkiz.links[i].width_tube = value;
                    }
                    return this;
                case "curvature":
                    for (var i = 0; i < this.sparkiz.links.length; i++) {
                        if (typeof (arguments[1]) == 'number') {
                            value = arguments[1];
                        }
                        else {
                            var value = callback(this.sparkiz.links[i], i);
                        }
                        this.sparkiz.links[i].courbure = value;
                    }
                    return this;
                case "opacity":
                    for (var i = 0; i < this.sparkiz.links.length; i++) {
                        if (typeof (arguments[1]) == 'number') {
                            value = arguments[1];
                        }
                        else {
                            var value = callback(this.sparkiz.links[i], i);
                        }
                        this.sparkiz.links[i].tube_opacity = value;
                    }
                    return this;
            }
        };
        Force.prototype.layout = function (visual_attr, callback) {
            var value;
            switch (visual_attr) {
                case "linkDistance":
                    for (var i = 0; i < this.sparkiz.links.length; i++) {
                        if (typeof (arguments[1]) == 'number') {
                            value = arguments[1];
                        }
                        else {
                            var value = callback(this.sparkiz.links[i], i);
                        }
                        this.sparkiz.links[i].link_length = value;
                    }
                    return this;
            }
        };
        Force.prototype.numberSegmentation = function (visual_attr, callback) {
            var value;
            switch (visual_attr) {
                case "numberSpacedPoints":
                    for (var i = 0; i < this.sparkiz.links.length; i++) {
                        if (typeof (arguments[1]) == 'number') {
                            value = arguments[1];
                        }
                        else {
                            var value = callback(this.sparkiz.links[i], i);
                        }
                        this.sparkiz.links[i].numberSpacedPoints = value;
                    }
                    return this;
            }
        };
        Force.prototype.node_properties = function (visual_attr, callback) {
            var value;
            switch (visual_attr) {
                case "color":
                    for (var i = 0; i < this.sparkiz.nodes.length; i++) {
                        var color;
                        if (typeof (arguments[1]) == 'string') {
                            color = new THREE.Color(arguments[1]);
                        }
                        else {
                            var a = callback(this.sparkiz.nodes[i], i);
                            color = new THREE.Color(a);
                        }
                        this.sparkiz.webGL_nodes[i].material.color = color;
                    }
                    return this;
                case "size":
                    for (var i = 0; i < this.sparkiz.nodes.length; i++) {
                        if (typeof (arguments[1]) == 'number') {
                            value = arguments[1];
                        }
                        else {
                            value = callback(this.sparkiz.nodes[i], i);
                        }
                        this.sparkiz.webGL_nodes[i].scale.set(value, value, value);
                    }
                    return this;
                case "label":
                    for (var i = 0; i < this.sparkiz.nodes.length; i++) {
                        if (typeof (arguments[1]) == 'string') {
                            value = arguments[1];
                        }
                        else {
                            value = callback(this.sparkiz.nodes[i], i);
                        }
                        this.sparkiz.nodes[i].label_name = value;
                    }
                    return this;
                case "label_size":
                    for (var i = 0; i < this.sparkiz.nodes.length; i++) {
                        if (typeof (arguments[1]) == 'number' || typeof (arguments[1]) == 'string') {
                            value = parseFloat(arguments[1]);
                        }
                        else {
                            value = parseFloat(callback(this.sparkiz.nodes[i], i));
                        }
                        this.sparkiz.nodes[i].label_size = value;
                    }
                    return this;
                case "label_x":
                    for (var i = 0; i < this.sparkiz.nodes.length; i++) {
                        if (typeof (arguments[1]) == 'number' || typeof (arguments[1]) == 'string') {
                            value = parseFloat(arguments[1]);
                        }
                        else {
                            value = parseFloat(callback(this.sparkiz.nodes[i], i));
                        }
                        this.sparkiz.nodes[i].label_x = value;
                    }
                    return this;
                case "label_y":
                    for (var i = 0; i < this.sparkiz.nodes.length; i++) {
                        if (typeof (arguments[1]) == 'number' || typeof (arguments[1]) == 'string') {
                            value = parseFloat(arguments[1]);
                        }
                        else {
                            value = parseFloat(callback(this.sparkiz.nodes[i], i));
                        }
                        this.sparkiz.nodes[i].label_y = value;
                    }
                    return this;
                case "label_color":
                    for (var i = 0; i < this.sparkiz.nodes.length; i++) {
                        var color;
                        if (typeof (arguments[1]) == 'string') {
                            color = new THREE.Color(arguments[1]);
                        }
                        else {
                            var a = callback(this.sparkiz.nodes[i], i);
                            color = new THREE.Color(a);
                        }
                        this.sparkiz.nodes[i].label_color = color;
                    }
                    return this;
                case "x":
                    for (var i = 0; i < this.sparkiz.nodes.length; i++) {
                        if (typeof (arguments[1]) == 'number' || typeof (arguments[1]) == 'string') {
                            value = parseFloat(arguments[1]);
                        }
                        else {
                            value = parseFloat(callback(this.sparkiz.nodes[i], i));
                        }
                        this.sparkiz.d3cola.stop();
                        this.sparkiz.nodes[i].x = value;
                    }
                    return this;
                case "y":
                    for (var i = 0; i < this.sparkiz.nodes.length; i++) {
                        if (typeof (arguments[1]) == 'number' || typeof (arguments[1]) == 'string') {
                            value = parseFloat(arguments[1]);
                        }
                        else {
                            value = parseFloat(callback(this.sparkiz.nodes[i], i));
                        }
                        this.sparkiz.d3cola.stop();
                        this.sparkiz.nodes[i].y = value;
                    }
                    return this;
                case "z":
                    for (var i = 0; i < this.sparkiz.nodes.length; i++) {
                        if (typeof (arguments[1]) == 'number' || typeof (arguments[1]) == 'string') {
                            value = parseFloat(arguments[1]);
                        }
                        else {
                            value = parseFloat(callback(this.sparkiz.nodes[i], i));
                        }
                        this.sparkiz.d3cola.stop();
                        this.sparkiz.nodes[i].z = value;
                    }
                    return this;
                case "image":
                    for (var i = 0; i < this.sparkiz.nodes.length; i++) {
                        if (typeof (arguments[1]) == 'string') {
                            value = arguments[1];
                        }
                        else {
                            value = callback(this.sparkiz.nodes[i], i);
                        }
                        this.sparkiz.load_texture_nodes(i, value);
                    }
                    return this;
            }
        };
        return Force;
    }());
    flownet.Force = Force;
    var Shader = (function () {
        function Shader() {
            this.set_fragment();
        }
        Shader.prototype.set_fragment = function () {
            this.fragment = 'uniform sampler2D texture;' +
                '        ' +
                '' +
                '            varying float distance_with_arrival;' +
                '            varying float distance_with_departure;' +
                '            varying float my_opacity;' +
                '            varying vec3 vColor;' +
                '' +
                '            varying float vRotation;' +
                '' +
                '            varying float sprite_size;' +
                '' +
                '            varying float segmentation;' +
                '            varying float index_;' +
                '' +
                '' +
                '' +
                '            mat2 rotation(float x) {' +
                '              vec2 line_1 = vec2(cos(x), -sin(x));' +
                '              vec2 line_2 = vec2(sin(x), cos(x));' +
                '' +
                '              return mat2(line_1,line_2); ' +
                '            }' +
                '            mat2 translation(float x, float y) {' +
                '              vec2 line_1 = vec2(1.0,x);' +
                '              vec2 line_2 = vec2(1.0,y);' +
                '' +
                '              return mat2(line_1,line_2); ' +
                '            }' +
                '            mat2 changerEchelle(float sx, float sy) {' +
                '              vec2 line_1 = vec2(sx, 0.0);' +
                '              vec2 line_2 = vec2(0.0, sy);' +
                '' +
                '              return mat2(line_1,line_2); ' +
                '            }' +
                '' +
                '' +
                '            void main() {' +
                '' +
                '                float mid = 0.5;' +
                '                mat2 my_matrix = rotation(vRotation) ;' +
                '                vec2 rotated =  my_matrix * vec2(gl_PointCoord.x - mid, gl_PointCoord.y - mid) ;' +
                '                rotated.x = rotated.x + mid;' +
                '                rotated.y = rotated.y + mid;' +
                '' +
                '' +
                '' +
                '' +
                '                vec4 color = vec4(1.0,1.0,1.0, 1.0);' +
                '' +
                '                vec2 new_coord =  my_matrix * gl_PointCoord;' +
                '' +
                '' +
                '' +
                '                if (distance_with_arrival < (sprite_size / 2.0) && index_ < segmentation){' +
                '                  if ( rotated.x - 0.5 > (distance_with_arrival / sprite_size)){' +
                '                    color = vec4(1.0,1.0,1.0, 0.0);' +
                '                  }' +
                '                }' +
                '' +
                '                if (distance_with_arrival < (sprite_size / 2.0) && index_ >= segmentation){' +
                '                  if (rotated.x >= 0.5 - (distance_with_arrival / sprite_size)){' +
                '                    color = vec4(1.0,1.0,1.0, 0.0);' +
                '                  }' +
                '                }' +
                '       ' +
                '                if (distance_with_arrival > (sprite_size / 2.0) && index_ > segmentation){' +
                '                    color = vec4(1.0,1.0,1.0, 0.0);' +
                '                }' +
                '' +
                '             ' +
                '                if (distance_with_departure < (sprite_size / 2.0) && index_ < 0.0){' +
                '                  if ( rotated.x + 0.5 > (distance_with_departure / sprite_size)){' +
                '                    color = vec4(1.0,1.0,1.0, 0.0);' +
                '                  }' +
                '                }' +
                '                if (distance_with_departure < (sprite_size / 2.0) && index_ >= 0.0){' +
                '                  if ( rotated.x <= 0.5-(distance_with_departure / sprite_size)){' +
                '                    color = vec4(1.0,1.0,1.0, 0.0);' +
                '                  }' +
                '                }' +
                '' +
                '                if (distance_with_departure > (sprite_size / 2.0) && index_ < 0.0){' +
                '                  color = vec4(1.0,1.0,1.0, 0.0);' +
                '                }' +
                '' +
                '' +
                '                ' +
                '' +
                '                vec4 rotatedTexture = texture2D( texture,  rotated) * color;' +
                '' +
                '                gl_FragColor = vec4( vColor, my_opacity ) * rotatedTexture;' +
                '' +
                '' +
                '' +
                '' +
                '            }';
            this.vertex = 'uniform float time;' +
                '            uniform float uTime;' +
                '            float size_fadding;' +
                '            attribute float id;' +
                '            attribute float id_particle;' +
                '            attribute vec3 customColor;' +
                '            attribute float iteration;' +
                '            uniform int particles_number;' +
                '            uniform mat4 ProjectionMatrix;' +
                '            uniform int number_segmentation;' +
                '            uniform float gap_two_gates;' +
                '            varying float sprite_size;' +
                '            varying float segmentation;' +
                '            varying float index_;' +
                '            uniform vec2 path_quadratic[path_length];' +
                '            uniform int gate_position[number_max_gates];' +
                '            uniform float size[number_max_gates];' +
                '            uniform float gate_opacity[number_max_gates];' +
                '            uniform float wiggling_gate[number_max_gates];' +
                '            uniform vec3 gate_colors[number_max_gates];' +
                '            uniform float gate_velocity[number_max_gates];' +
                '            uniform int temporal_delay[real_number_particles];' +
                '            uniform int offsetArray[number_max_gates];' +
                '            uniform int number_segmentation_pattern_fitting;' +
                '            varying vec3 vColor;' +
                '            varying float my_opacity;' +
                '            varying float distance_with_arrival;' +
                '            varying float distance_with_departure;' +
                '            float actual_velocity;' +
                '' +
                '     ' +
                '' +
                '            varying float vRotation;' +
                '            int gate = 0;' +
                '' +
                '            int MOD(int a, int b){' +
                '         ' +
                '                int result = a / b;' +
                '                result = b * result;' +
                '                result = a - result;' +
                '                return result;' +
                '            }' +
                '            float rand(vec2 co){' +
                '                return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);' +
                '            }' +
                '            float distance(float x1, float y1, float x2, float y2){' +
                '' +
                '                float longueur = sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));' +
                '                return longueur;' +
                '            }' +
                '            int determine_which_gate(int index_thorique){' +
                '' +
                '                for(int i = 0; i < number_max_gates - 1; i++){' +
                '                    int actual_gate_pos = gate_position[i] ;' +
                '                    int next_gate_pos = gate_position[i+1] ;' +
                '                    if(index_thorique <= next_gate_pos && index_thorique > actual_gate_pos){' +
                '                        gate = i;' +
                '                    }' +
                '                ' +
                '                    if(index_thorique >= next_gate_pos && index_thorique >= actual_gate_pos &&' +
                '                        next_gate_pos == 0 && actual_gate_pos != 0){' +
                '                        gate = i;' +
                '                    }' +
                '                }' +
                '                return gate;' +
                '            }' +
                '' +
                '            float fadeSize(float actualSize, float nextSize, int steps, int index){ ' +
                '' +
                '                float temporarySize = ((nextSize - actualSize)/ float(steps)) * float(index);' +
                '                return actualSize + temporarySize;' +
                '' +
                '            }' +
                '            float fadeOpacity(float actualSize, float nextSize, int steps, int index){ ' +
                '' +
                '                float temporarySize = ((nextSize - actualSize)/ float(steps)) * float(index);' +
                '                return actualSize + temporarySize;' +
                '' +
                '            }' +
                '            vec3 fadeRGB(vec3 oldColor, vec3 newColor, int steps, int index){' +
                '' +
                '                vec3 my_color;' +
                '                float redStepAmount = ((newColor.x - oldColor.x) / float(steps)) * float(index);' +
                '                float greenStepAmount = ((newColor.y - oldColor.y) / float(steps)) * float(index);' +
                '                float blueStepAmount = ((newColor.z - oldColor.z) / float(steps)) * float(index);' +
                '                ' +
                '                newColor.x = oldColor.x + redStepAmount;' +
                '                newColor.y = oldColor.y + greenStepAmount;' +
                '                newColor.z = oldColor.z + blueStepAmount;' +
                '' +
                '                my_color = vec3(newColor.x ,newColor.y, newColor.z);' +
                '' +
                '                return my_color;' +
                '' +
                '            }' +
                '            float noise(vec2 p){' +
                '                vec2 ip = floor(p);' +
                '                vec2 u = fract(p);' +
                '                u = u*u*(3.0-2.0*u);' +
                '' +
                '                float res = mix(' +
                '                    mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),' +
                '                    mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);' +
                '                return res*res;' +
                '            }' +
                '            vec2 bezier(int t, vec2 p0,vec2 p1,vec2 p2,vec2 p3){' +
                '' +
                '                highp float timer = float(t);' +
                '' +
                '                highp float time = timer * 1.0/(float(number_segmentation));' +
                '' +
                '                float cX = 3.0 * (p1.x - p0.x);' +
                '                float bX = 3.0 * (p2.x - p1.x) - cX;' +
                '                float aX = p3.x - p0.x - cX - bX;' +
                '' +
                '                float cY = 3.0 * (p1.y - p0.y);' +
                '                float bY = 3.0 * (p2.y - p1.y) - cY;' +
                '                float aY = p3.y - p0.y - cY - bY;' +
                '' +
                '                float x = (aX * pow(time, 3.0)) + (bX * pow(time, 2.0)) + (cX * time) + p0.x;' +
                '                float y = (aY * pow(time, 3.0)) + (bY * pow(time, 2.0)) + (cY * time) + p0.y;' +
                '' +
                '                vec2 result = vec2( x,y );' +
                '' +
                '                return result;' +
                '            }' +
                '            mat4 rotation(float x) {' +
                '              vec4 line_1 = vec4(cos(x), -sin(x), 0.0, 0.0);' +
                '              vec4 line_2 = vec4(sin(x), cos(x), 0.0, 0.0);' +
                '              vec4 line_3 = vec4(0.0, 0.0, 1.0, 0.0);' +
                '              vec4 line_4 = vec4(0.0, 0.0, 0.0, 1.0);' +
                '' +
                '              return mat4(line_1,line_2,line_3,line_4);' +
                '            }' +
                '            mat4 translation(float x, float y) {' +
                '              vec4 line_1 = vec4(1.0, 0.0, 0.0,  x);' +
                '              vec4 line_2 = vec4(0.0, 1.0, 0.0,  y);' +
                '              vec4 line_3 = vec4(0.0, 0.0, 1.0, 0.0);' +
                '              vec4 line_4 = vec4(0.0, 0.0, 0.0, 1.0);' +
                '' +
                '              return mat4(line_1,line_2,line_3,line_4);' +
                '            }' +
                '            mat4 changerEchelle(float sx, float sy) {' +
                '              vec4 line_1 = vec4(sx, 0.0, 0.0, 0.0);' +
                '              vec4 line_2 = vec4(0.0, sy, 0.0, 0.0);' +
                '              vec4 line_3 = vec4(0.0, 0.0, 1.0, 0.0);' +
                '              vec4 line_4 = vec4(0.0, 0.0, 0.0, 1.0);' +
                '' +
                '              return mat4(line_1,line_2,line_3,line_4);' +
                '            }' +
                '' +
                '            void main() {' +
                '' +
                '                vColor = customColor;' +
                '                vec3 newPosition = position;' +
                '                vec4 mvPosition;' +
                '                float ANGLE = 90.0;' +
                '' +
                '' +
                '          ' +
                '                highp int id_faisceaux = int(id_particle);' +
                '                actual_velocity = float(gate_velocity[0]);' +
                '' +
                '                float timer =  uTime;' +
                '                highp int my_time = int(timer);' +
                '' +
                '         ' +
                '                my_time = my_time + temporal_delay[id_faisceaux];' +
                '     ' +
                '                int index_old = MOD(my_time , number_segmentation_pattern_fitting);' +
                '   ' +
                '                float virtual_index = float(index_old);' +
                '                virtual_index = virtual_index;' +
                '                highp int index2 = int(virtual_index);' +
                '' +
                '' +
                '                gate = determine_which_gate(index2);' +
                '' +
                '' +
                '' +
                '                float multiplicateur = 1.0;' +
                '                if (gate_velocity[gate] == 1.0){multiplicateur = 0.0;}' +
                '' +
                '                float difference = 0.0;' +
                '                float difference_gate_before = 0.0;' +
                '                ' +
                '' +
                '                float new_index = (float(index2) * gate_velocity[gate]) - float(offsetArray[gate]);' +
                '                highp int index = int(new_index);' +
                '' +
                '                ' +
                '' +
                '      ' +
                '' +
                '                vec4 path;' +
                '                vec4 path_next;' +
                '' +
                '                highp int path_id = int(id) * (4);' +
                '' +
                '' +
                '                path = vec4( bezier(index, path_quadratic[path_id],path_quadratic[path_id+ 1],path_quadratic[path_id + 2],path_quadratic[path_id+3]), 1.0,1.0);' +
                '                path_next = vec4( bezier(index +1, path_quadratic[path_id],path_quadratic[path_id+ 1],path_quadratic[path_id + 2],path_quadratic[path_id+3]), 1.0,1.0);' +
                '' +
                '                ' +
                '' +
                '                distance_with_arrival = distance(path.x, path.y, path_quadratic[path_id+3].x, path_quadratic[path_id+3].y);' +
                '                distance_with_departure = distance(path.x, path.y, path_quadratic[path_id].x, path_quadratic[path_id].y);' +
                '' +
                '                float random = noise(vec2( index , index )) * wiggling_gate[gate];' +
                '' +
                '                float angle = atan(path_next.y - path.y, path_next.x - path.x );' +
                '                vRotation =  - angle;' +
                '' +
                '' +
                '' +
                '' +
                '' +
                '                mat4 my_matrice =  translation(path.x + random,path.y+ random);' +
                '                vec4 positionEchelle = vec4(0.0,0.0,1.0,1.0) * my_matrice;' +
                '       ' +
                '                mvPosition =  modelViewMatrix * positionEchelle;' +
                '' +
                '                size_fadding = size[gate];' +
                '                my_opacity = gate_opacity[gate];' +
                '                ' +
                '                ' +
                '                ' +
                '' +
                '                if (size[gate] != size[gate+1]){' +
                '                   size_fadding = fadeSize(size[gate], size[gate+1], gate_position[gate+1] - gate_position[gate], index - gate_position[gate]);' +
                '                }' +
                '' +
                '                ' +
                '                vColor = vec3(gate_colors[gate].x ,gate_colors[gate].y, gate_colors[gate].z);' +
                '' +
                '                index_ = float(index);' +
                '                segmentation = float(number_segmentation);' +
                '                ' +
                '                if (index >= number_segmentation || index <= 0){my_opacity = 0.0;}' +
                '                gl_PointSize = size_fadding;' +
                '                sprite_size = gl_PointSize;' +
                '' +
                '                gl_Position = projectionMatrix * mvPosition;' +
                '' +
                '' +
                '}';
        };
        return Shader;
    }());
    flownet.Shader = Shader;
})(flownet || (flownet = {}));
var Mapping = (function () {
    function Mapping(confluentGraph) {
        this.confluentGraph = confluentGraph;
    }
    Mapping.prototype.mapping_object = function (my_object) {
        console.log("OBJECT", my_object);
        var object = my_object;
        switch (object["selector"]) {
            case "nodes":
                console.log("NODES");
                switch (object["parameters"]) {
                    case "color":
                        this.node_parameter_color = "#" + object["value"];
                        break;
                    case "size":
                        this.node_parameter_size = object["value"];
                        break;
                }
                break;
            case "tube":
                console.log("TUBE");
                switch (object["parameters"]) {
                    case "color":
                        console.log("COLOR");
                        this.tube_parameter_color = "#" + object["value"];
                        break;
                    case "size":
                        console.log("UPDATE SIZE");
                        this.tube_parameter_width = object["value"];
                        break;
                }
                break;
            case "mapping_particles":
                console.log("MAPPING");
                switch (object["parameters"]) {
                    case "color":
                        this.particle_parameter_color = object["value"];
                        break;
                    case "size":
                        this.particle_parameter_size = object["value"];
                        break;
                }
                break;
            case "mapping_nodes":
                console.log("MAPPING");
                switch (object["parameters"]) {
                    case "color":
                        break;
                }
                break;
            case "particles":
                console.log("PARTICLES");
                switch (object["parameters"]) {
                    case "color":
                        console.log("COLOR");
                        this.particle_color_scale.range([d3.rgb('#000000'), "#" + object["value"]]);
                        break;
                }
                break;
        }
    };
    Mapping.prototype.launch_mapping = function () {
        var nodes = this.confluentGraph.nodes;
        var links = this.confluentGraph.links;
        var max_particle_color = this.confluentGraph.get_max_of_attributes(this.particle_parameter_color);
        var max_particle_size = this.confluentGraph.get_max_of_attributes(this.particle_parameter_size);
        this.particle_color_scale.domain([0, max_color]);
        this.particle_size_scale.domain([0, max_size]);
        for (var i = 0; i < links.length; i++) {
            this.confluentGraph.set_tube_color(i, this.tube_parameter_color, 1);
            this.confluentGraph.set_tube_width(i, this.tube_parameter_width);
        }
        for (var i = 0; i < nodes.length; i++) {
            this.confluentGraph.updateNode_color(i, new THREE.Color(this.node_parameter_color));
            this.confluentGraph.updateNode_scale(i, this.node_parameter_size);
        }
    };
    Mapping.prototype.map_from_array = function (array) {
        for (var i = 0; i < array.length; i++) {
            this.mapping_object(array[i]);
        }
    };
    return Mapping;
}());
var Visualisation = (function () {
    function Visualisation(div_element, width, height, bg_color, alpha) {
        this.bg_color = 0xffffff;
        this.WIDTH = width;
        this.HEIGHT = height;
        this.div_element = div_element;
        this.bg_color = bg_color;
        this.alpha = alpha;
        this.init();
    }
    Visualisation.prototype.init = function () {
        this.camera = new THREE.OrthographicCamera(this.WIDTH / -2, this.WIDTH / 2, this.HEIGHT / 2, this.HEIGHT / -2, 0.0001, 100000);
        this.camera.position.z = 900;
        var self = this;
        this.scene = new THREE.Scene();
        this.light = new THREE.DirectionalLight(0xffffff);
        this.light.position.set(0, 1, 1).normalize();
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setPixelRatio(1);
        this.renderer.setSize(this.WIDTH, this.HEIGHT);
        this.renderer.setClearColor(this.bg_color, this.alpha);
        var new_container = this.div_element.substring(1);
        document.getElementById(new_container).appendChild(this.renderer.domElement);
        this.raycaster = new THREE.Raycaster();
    };
    return Visualisation;
}());
var Drop_Down = (function () {
    function Drop_Down(ConfluentGraph, container, link_id, name) {
        this.container = d3.select(container).append("div").attr("class", "graph").attr("id", name);
        this.link_id = link_id;
        this.ConfluentGraph = ConfluentGraph;
        this.id = name;
        this.make_options();
        this.make_UI();
    }
    Drop_Down.prototype.make_options = function () {
        switch (this.id) {
            case "texture":
                this.data = [
                    { name: " --- Select the particle form --- ", URL: "" },
                    { name: "square", URL: "square_texture.png" },
                    { name: "circle", URL: "circle_texture.png" },
                    { name: "rectangle", URL: "rectangle_texture.png" },
                    { name: "star", URL: "star_texture.png" },
                    { name: "informations", URL: "informations_texture.png" },
                    { name: "triangle", URL: "triangle_texture.png" },
                    { name: "arrow", URL: "arrow_texture.png" }
                ];
                break;
        }
    };
    Drop_Down.prototype.make_UI = function () {
        this.make_slider();
    };
    Drop_Down.prototype.make_slider = function () {
        var self = this;
        var select = this.container.append('div')
            .append("select")
            .on("change", function () { self.update_values(this.value); });
        select.selectAll("option")
            .data(this.data)
            .enter().append("option")
            .attr("value", function (d) { return d.URL; })
            .text(function (d) { return d.name; });
    };
    Drop_Down.prototype.update_values = function (value) {
        var self = this;
        if (this.id == "texture") {
            this.ConfluentGraph.updateParticles_Texture(this.link_id, value);
        }
    };
    Drop_Down.prototype.get_values = function () {
        var value = 0;
        var uniforms = this.ConfluentGraph.links[this.link_id].particleSystems.material.__webglShader.uniforms;
        if (this.id == "texture") {
            value = uniforms.texture.name;
        }
        return value;
    };
    return Drop_Down;
}());
var UIInformations_general = (function () {
    function UIInformations_general(ConfluentGraph, container) {
        this.container = d3.select(container).append("div").attr("class", "graph").attr("id", "general_infos");
        this.ConfluentGraph = ConfluentGraph;
        this.make_header();
        this.make_color_picker();
        this.make_slider_frame();
        this.change_color();
    }
    UIInformations_general.prototype.change_color = function () {
        var self = this;
        $("#color_bg_selector").on('change', function (e, color) {
            console.log(color);
            var my_color = new THREE.Color();
            my_color.r = color._r / 255;
            my_color.g = color._g / 255;
            my_color.b = color._b / 255;
            renderer.setClearColor(my_color, 1);
        });
    };
    UIInformations_general.prototype.make_header = function () {
        this.container.append('div')
            .attr("id", "header_general_properties")
            .append('text')
            .text(" General Properties : ");
    };
    UIInformations_general.prototype.make_color_picker = function () {
        var self = this;
        this.container.append("text").text("Background Color : ");
        this.container.append("input").attr("id", "color_bg_selector");
        $("#color_bg_selector").spectrum({
            preferredFormat: "hsl",
            showInput: true,
            color: 0x00000
        });
    };
    UIInformations_general.prototype.make_slider_frame = function () {
        var self = this;
        var alpha_selector = this.container.append('div')
            .attr("id", "frame_rate")
            .append('text')
            .text("Frame rate : ");
        alpha_selector.append("input")
            .attr("type", "range")
            .attr("min", "0")
            .attr("max", "500")
            .attr("id", "input_frame")
            .attr("value", function () {
            this.value = frame_rate;
        })
            .on("input", function () {
            clearInterval(refreshIntervalId);
            launch_animation(this.value);
            d3.select("#label_input_frame").text(this.value);
            frame_rate = this.value;
        });
        alpha_selector.append('label')
            .attr("for", "input_frame")
            .attr("id", "label_input_frame")
            .text(frame_rate);
    };
    return UIInformations_general;
}());
var Slider_Button = (function () {
    function Slider_Button(ConfluentGraph, container, link_id, gate, name) {
        this.container = d3.select(container).append("div").attr("class", "graph").attr("id", name);
        this.link_id = link_id;
        this.ConfluentGraph = ConfluentGraph;
        this.id = name;
        this.gate = gate;
        this.make_options();
        this.make_UI();
    }
    Slider_Button.prototype.make_options = function () {
        switch (this.id) {
            case "velocity":
                this.min = 0.0;
                this.max = 1.9;
                this.step = 0.1;
                break;
            case "size":
                this.min = 10;
                this.max = 150;
                this.step = 10;
                break;
            case "opacity":
                this.min = 0;
                this.max = 1;
                this.step = 0.1;
                break;
            case "wiggling":
                this.min = 0;
                this.max = 1;
                this.step = 0.1;
                break;
            case "link_width":
                this.min = 0;
                this.max = 5;
                this.step = 0.1;
                break;
        }
    };
    Slider_Button.prototype.make_UI = function () {
        this.make_slider();
    };
    Slider_Button.prototype.make_slider = function () {
        var self = this;
        var alpha_selector = this.container.append('div')
            .append('text')
            .text("Particle " + this.id + " : ");
        alpha_selector.append("input")
            .attr("type", "range")
            .attr("min", self.min)
            .attr("max", self.max)
            .attr("step", self.step)
            .attr("id", "input_alpha")
            .attr("value", function () {
            this.value = self.get_values();
        })
            .on("input", function () {
            self.update_values(parseFloat(this.value));
            d3.select("#label_input" + self.id).text(this.value);
        });
        alpha_selector.append('label')
            .attr("for", "input_frame")
            .attr("id", "label_input" + self.id)
            .text(function () {
            return self.get_values();
        });
    };
    Slider_Button.prototype.update_values = function (value) {
        var self = this;
        if (this.id == "velocity") {
            this.ConfluentGraph.updateParticles_Velocity(this.link_id, this.gate, value);
        }
        if (this.id == "size") {
            this.ConfluentGraph.updateParticles_Size(this.link_id, this.gate, value);
        }
        if (this.id == "opacity") {
            this.ConfluentGraph.updateParticles_Opacity(this.link_id, this.gate, value);
        }
        if (this.id == "wiggling") {
            this.ConfluentGraph.updateParticles_Wiggling(this.link_id, this.gate, value);
        }
        if (this.id == "link_width") {
            this.ConfluentGraph.updateLinks_width_gate(this.link_id, this.gate, value);
            self.ConfluentGraph.updateTube_width_gate(self.link_id, self.gate, value);
        }
    };
    Slider_Button.prototype.get_values = function () {
        var value = 0;
        var uniforms = this.ConfluentGraph.links[this.link_id].particleSystems.material.__webglShader.uniforms;
        if (this.id == "velocity") {
            value = uniforms.velocity.value[this.gate];
        }
        if (this.id == "size") {
            value = uniforms.size.value[this.gate];
        }
        if (this.id == "opacity") {
            value = uniforms.opacity.value[this.gate];
        }
        if (this.id == "wiggling") {
            value = uniforms.wiggling.value[this.gate];
        }
        if (this.id == "link_width") {
            value = this.ConfluentGraph.links[this.link_id].gate_infos[this.gate].factor;
        }
        return value;
    };
    return Slider_Button;
}());
var LinkAppearance = (function () {
    function LinkAppearance(ConfluentGraph, container, link_id) {
        this.container = d3.select(container).append("div").attr("class", "graph").attr("id", "link");
        this.link_id = link_id;
        this.ConfluentGraph = ConfluentGraph;
        this.make_UI();
        this.change_color();
    }
    LinkAppearance.prototype.change_color = function () {
        var self = this;
        $("#color_picker_link").on('change', function (e, color) {
            var my_color = color.toHex();
            my_color = "0x" + my_color;
            self.ConfluentGraph.tube[self.link_id].children[0].material.color.setHex(my_color);
        });
    };
    LinkAppearance.prototype.make_alpha_gates = function () {
        var self = this;
        var alpha_selector = this.container.append('div')
            .attr("id", "alpha_gates_selector")
            .append('text')
            .text("Gates alpha : ");
        alpha_selector.append("input")
            .attr("type", "range")
            .attr("min", "0")
            .attr("max", "1")
            .attr("step", "0.01")
            .attr("id", "input_alpha")
            .attr("value", function () {
            var gates = self.ConfluentGraph.links[self.link_id].gates;
            if (gates[1] != undefined) {
                this.value = gates[1].object.material.opacity;
            }
        })
            .on("input", function () {
            var gates = self.ConfluentGraph.links[self.link_id].gates;
            for (var i = 1; i < gates.length; i++) {
                gates[i].object.material.opacity = this.value;
            }
            d3.select("#alpha_gates").text(this.value);
        });
        alpha_selector.append('label')
            .attr("for", "input_frame")
            .attr("id", "alpha_gates")
            .text(function () {
            var gates = self.ConfluentGraph.links[self.link_id].gates;
            if (gates[1] != undefined) {
                return gates[1].object.material.opacity;
            }
        });
    };
    LinkAppearance.prototype.make_alpha_tube_picker = function () {
        var self = this;
        var alpha_selector = this.container.append('div')
            .attr("id", "alpha_tube_selector")
            .append('text')
            .text("Tube alpha : ");
        alpha_selector.append("input")
            .attr("type", "range")
            .attr("min", "0")
            .attr("max", "1")
            .attr("step", "0.01")
            .attr("id", "input_alpha")
            .attr("value", function () {
            this.value = self.ConfluentGraph.tube[self.link_id].children[0].material.opacity;
        })
            .on("input", function () {
            console.log("MY TUBE", self.ConfluentGraph.tube[self.link_id]);
            self.ConfluentGraph.tube[self.link_id].children[0].material.opacity = this.value;
            d3.select("#alpha_tube").text(this.value);
        });
        alpha_selector.append('label')
            .attr("for", "input_frame")
            .attr("id", "alpha_tube")
            .text(function () {
            return self.ConfluentGraph.tube[self.link_id].children[0].material.opacity;
        });
    };
    LinkAppearance.prototype.make_alpha_links_picker = function () {
        var self = this;
        var alpha_selector = this.container.append('div')
            .attr("id", "alpha_links_selector")
            .append('text')
            .text("Links alpha : ");
        alpha_selector.append("input")
            .attr("type", "range")
            .attr("min", "0")
            .attr("max", "1")
            .attr("step", "0.01")
            .attr("id", "input_alpha")
            .attr("value", function () {
            this.value = self.ConfluentGraph.curveSplines[self.link_id].children[0].material.opacity;
        })
            .on("input", function () {
            var lines = self.ConfluentGraph.curveSplines[self.link_id].children;
            for (var i = 0; i < lines.length; i++) {
                lines[i].material.opacity = this.value;
            }
            d3.select("#alpha_links").text(this.value);
        });
        alpha_selector.append('label')
            .attr("for", "input_frame")
            .attr("id", "alpha_links")
            .text(function () {
            return self.ConfluentGraph.curveSplines[self.link_id].children[0].material.opacity;
        });
    };
    LinkAppearance.prototype.make_color_picker = function () {
        var self = this;
        var color = self.ConfluentGraph.tube[this.link_id].children[0].material.color.getHSL();
        console.log("MY COLOR IS ", color);
        this.container.append("text").text("Tube Color :");
        this.container.append("input").attr("id", "color_picker_link");
        $("#color_picker_link").spectrum({
            preferredFormat: "hsl",
            showInput: true,
            color: "hsl(" + color.h * 100 + "," + color.s * 100 + "," + color.l * 100 + ")",
        });
    };
    LinkAppearance.prototype.change_tube_width = function () {
        var self = this;
        var alpha_selector = this.container.append('div')
            .attr("id", "width_links")
            .append('text')
            .text("Width Links : ");
        alpha_selector.append("input")
            .attr("type", "range")
            .attr("min", "0")
            .attr("max", "10")
            .attr("step", "0.5")
            .attr("id", "input_width")
            .attr("value", function () {
            this.value = self.ConfluentGraph.links[self.link_id].width_tube;
        })
            .on("input", function () {
            self.ConfluentGraph.links[self.link_id].width_tube = parseFloat(this.value);
            self.ConfluentGraph.updateLinks();
            self.ConfluentGraph.updateParticles_Paths(self.link_id);
            self.ConfluentGraph.updateTube();
            d3.select("#tube_width").text(this.value);
        });
        alpha_selector.append('label')
            .attr("for", "input_frame")
            .attr("id", "tube_width")
            .text(function () {
            return self.ConfluentGraph.links[self.link_id].width_tube;
        });
    };
    LinkAppearance.prototype.make_header = function () {
        this.container.append('div')
            .attr("id", "header_tube_properties")
            .append('text')
            .text(" Tube Properties : ");
    };
    LinkAppearance.prototype.make_UI = function () {
        this.make_header();
        this.make_color_picker();
        this.make_alpha_tube_picker();
        this.make_alpha_links_picker();
        this.change_tube_width();
        this.make_alpha_gates();
    };
    return LinkAppearance;
}());
var UIInformations = (function () {
    function UIInformations(ConfluentGraph, container, link_id) {
        this.container = d3.select(container).append("div").attr("class", "graph").attr("id", "informations");
        this.link_id = link_id;
        this.ConfluentGraph = ConfluentGraph;
        this.make_infos();
    }
    UIInformations.prototype.make_infos = function () {
        var number_particles = this.ConfluentGraph.links[this.link_id].userData.number_particles;
        this.container.append("div").text("Informations :");
        this.container.append("div").text("Links n° " + this.link_id);
        this.container.append("div").text(number_particles + " particles");
    };
    return UIInformations;
}());
var ColorPicker = (function () {
    function ColorPicker(ConfluentGraph, container, link_id, gate) {
        this.container = d3.select(container).append("div").attr("class", "graph").attr("id", "picker");
        this.link_id = link_id;
        this.ConfluentGraph = ConfluentGraph;
        this.gate = gate;
        this.make_color_picker();
        this.listen_events();
    }
    ColorPicker.prototype.retrieve_color_gate = function () {
        var uniforms = this.ConfluentGraph.links[this.link_id].particleSystems.material.__webglShader.uniforms;
        var c = uniforms.gate_colors.value[this.gate];
        var v = new THREE.Vector3(c.x, c.y, c.z);
        v = v.multiplyScalar(255);
        var color = "rgb(" + v.x + "," + v.y + "," + v.z + ")";
        console.log(color);
        return color;
    };
    ColorPicker.prototype.make_color_picker = function () {
        console.log("YOOOOOOO");
        var self = this;
        this.container.append("text").text("Change color Gate :");
        this.container.append("input").attr("id", "color_picker");
        $("#color_picker").spectrum({
            preferredFormat: "rgb",
            showInput: true,
            color: self.retrieve_color_gate()
        });
    };
    ColorPicker.prototype.listen_events = function () {
        var self = this;
        $("#color_picker").on('change', function (e, color) {
            console.log(color.toRgb());
            var color = color.toRgb();
            self.ConfluentGraph.updateParticles_Color(self.link_id, color, self.gate);
        });
    };
    return ColorPicker;
}());
var UI = (function () {
    function UI(particleVis, scene, camera, renderer, raycaster, div) {
        this.mouse = { x: null, y: null };
        this.slider1 = null;
        this.slider2 = null;
        this.gate = null;
        this.temporary_object = null;
        this.panOffset = [0, 0];
        this.mouseStart = [500, 0];
        this.selected_object = [];
        this.first_time = true;
        this.hasHilight = false;
        this.particleVis = particleVis;
        this.state_machine = "hover";
        this.mouse_raycaster = { position: new THREE.Vector2(), beginning: false };
        this.div = div;
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.raycaster = raycaster;
    }
    UI.prototype.update = function () {
        var self = this;
        console.log(self.state_machine);
        if (self.state_machine == "drag" && self.temporary_object != undefined) {
            if (self.temporary_object.name == "circle") {
                var pos = self.particleVis.getNode_position(self.temporary_object.userData.id);
                var x = pos.x + self.panOffset[0] / self.camera.zoom;
                var y = pos.y - self.panOffset[1] / self.camera.zoom;
                var link_id = self.particleVis.updateNode_position(self.temporary_object.userData.id, x, y);
                self.panOffset = [0, 0];
            }
        }
        console.log();
        if (self.state_machine == "drag") {
            self.camera.position.x = self.camera.position.x - self.panOffset[0] / self.camera.zoom;
            self.camera.position.y = self.camera.position.y + self.panOffset[1] / self.camera.zoom;
            self.panOffset = [0, 0];
        }
        else if (self.state_machine == "down" && self.temporary_object != undefined) {
            if (self.temporary_object.userData.type == "country") {
                if (self.old_object != undefined)
                    self.old_object.material.color.set(0xbdbdbd);
                self.callback(self.temporary_object);
                self.temporary_object.material.color.set(0x000000);
                self.old_object = self.temporary_object;
            }
        }
    };
    UI.prototype.zoom = function () { };
    UI.prototype.mouse_event = function () {
        var self = this;
        var canvas = document.getElementById(self.div.slice(1));
        console.log("CANVAS", canvas);
        canvas.addEventListener("mousedown", mouseDown, false);
        canvas.addEventListener("mouseup", mouseUp, false);
        canvas.addEventListener("mousemove", mouseMove, false);
        canvas.addEventListener("mousewheel", mouseWheel, false);
        self.mouseStart = [500, 0];
        var cameraStart = [];
        var isMouseDown = false;
        function mouseDown(event) {
            event.preventDefault();
            event.stopPropagation();
            self.mouse.x = event.clientX;
            self.mouse.y = event.clientY;
            self.mouseStart = [event.clientX, event.clientY];
            self.state_machine = "down";
            self.mouse_raycaster.position.x = (event.clientX / self.renderer.domElement.clientWidth) * 2 - 1;
            self.mouse_raycaster.position.y = -(event.clientY / self.renderer.domElement.clientHeight) * 2 + 1;
            isMouseDown = true;
            self.temporary_object = self.get_intersections();
            self.update();
        }
        function mouseMove(event) {
            if (self.state_machine == "down") {
                self.state_machine = "drag";
            }
            if (self.state_machine == "drag") {
                event.preventDefault();
                event.stopPropagation();
                self.panOffset = [event.clientX - self.mouseStart[0], event.clientY - self.mouseStart[1]];
                self.mouseStart = [event.clientX, event.clientY];
            }
            if (self.state_machine == "hover") {
                self.mouse_raycaster.position.x = (event.clientX / self.renderer.domElement.clientWidth) * 2 - 1;
                self.mouse_raycaster.position.y = -(event.clientY / self.renderer.domElement.clientHeight) * 2 + 1;
                self.temporary_object = self.get_intersections();
                if (self.temporary_object != undefined) {
                    if (self.temporary_object.userData.type == "node" || self.temporary_object.userData.type == "label")
                        self.hilightNeighborood(self.temporary_object.userData);
                }
                else
                    self.unhilightNeighborood();
            }
            self.update();
        }
        function mouseUp(event) {
            if (self.state_machine == "drag") {
                self.state_machine = "drop";
                self.state_machine = "hover";
            }
            if (self.state_machine == "down") {
                self.state_machine = "hover";
            }
            self.update();
        }
        function mouseWheel(event) {
            event.preventDefault();
            if (self.camera.zoom + event.wheelDelta / 1000 > 0.13) {
                self.camera.zoom += event.wheelDelta / 1000;
                self.camera.updateProjectionMatrix();
                self.particleVis.updateLabel_scale(self.camera.zoom);
            }
        }
    };
    UI.prototype.setZoom = function (level) {
        this.camera.zoom += level;
        this.camera.updateProjectionMatrix();
        this.particleVis.updateLabel_scale(this.camera.zoom);
    };
    UI.prototype.get_intersections = function () {
        var self = this;
        var object;
        if (self.mouse_raycaster.beginning == false) {
            self.raycaster.setFromCamera(self.mouse_raycaster.position, self.camera);
            var intersects = self.raycaster.intersectObjects(self.scene.children, true);
            if (intersects.length != 0) {
                object = intersects[0].object;
                var type = object.parent.userData.type;
                var id = object.parent.userData.id;
                switch (self.state_machine) {
                    case "click_infos":
                        if (type == "tube" || type == "link") {
                            self.update_graph(object.parent.userData.id);
                        }
                        break;
                    case "position_bar":
                        if (type == "tube" || type == "link") {
                            var x = intersects[0].point.x;
                            var y = intersects[0].point.y;
                            var x1 = self.particleVis.links[id].source.x;
                            var y1 = self.particleVis.links[id].source.y;
                            var x2 = self.particleVis.links[id].target.x;
                            var y2 = self.particleVis.links[id].target.y;
                            var normal = self.get_normal_position(x, y, x1, y1, x2, y2, 5);
                            var segments = self.get_segments(normal[0].x, normal[0].y, x1, y1, x2, y2);
                            self.particleVis.create_gates(id, segments, normal[1].x, normal[1].y, normal[2].x, normal[2].y);
                            self.particleVis.updateParticles_Gates(id, segments);
                            if (self.gate != null) {
                                self.update_graph(object.parent.userData.id);
                            }
                        }
                        break;
                    case "hover_tube":
                        if (type == "tube") {
                            object.material.color.set(0xE6E6E6);
                            self.particleVis.links[id].width_tube = 5;
                            self.particleVis.updateTube();
                        }
                    case "hoverNodes":
                        self.temporary_object = object;
                        break;
                }
            }
            else {
            }
        }
        return object;
    };
    UI.prototype.coloriate_tube = function (id) {
        var self = this;
        var d = this.particleVis.tube[id];
        if (d.userData.id == id) {
            var e = d.children[0];
            if (self.selected_object != null) {
                self.selected_object.material.color.set(0xE6E6E6);
            }
            self.selected_object = e;
            e.material.color.set(0xff0000);
        }
    };
    UI.prototype.get_segments = function (x, y, x1, y1, x2, y2) {
        var portionX = (x2 - x1) / 50;
        var X = x - x1;
        var result = Math.round(X / portionX);
        return result;
    };
    UI.prototype.get_normal_position = function (x, y, x1, y1, x2, y2, distance) {
        var array = [];
        var alpha = (y2 - y1) / (x2 - x1);
        var x_middle = x;
        var y_middle = y;
        var alpha = (y2 - y1) / (x2 - x1);
        var ordonne_origine = y2 - (alpha * x2);
        var alpha_normal = (x1 - x2) / (y2 - y1);
        var ordonne_origine_normal = y_middle - (alpha_normal * x_middle);
        var X = (ordonne_origine_normal - ordonne_origine) / (alpha - alpha_normal);
        var Y = alpha * X + ordonne_origine;
        array.push({ x: X, y: Y });
        var X1 = X + Math.sqrt(Math.pow(distance, 2) / (1 + Math.pow(alpha_normal, 2)));
        var Y1 = alpha_normal * (X1) + ordonne_origine_normal;
        array.push({ x: X1, y: Y1 });
        var X2 = X - Math.sqrt(Math.pow(distance, 2) / (1 + Math.pow(alpha_normal, 2)));
        var Y2 = alpha_normal * (X2) + ordonne_origine_normal;
        array.push({ x: X2, y: Y2 });
        return array;
    };
    UI.prototype.draw_circle = function (x, y) {
        var material = new THREE.MeshBasicMaterial({
            color: 0xeeeeee
        });
        var segments = 50;
        var circleGeometry = new THREE.CircleGeometry(0.5, segments);
        var circle = new THREE.Mesh(circleGeometry, material);
        circle.scale.set(1, 1, 1);
        circle.name = "circle";
        circle.position.set(x, y, 1);
        this.scene.add(circle);
    };
    UI.prototype.update_graph = function (link_id) {
        this.delete_graph();
        this.gate = new UIGate(this.particleVis, '#temporal_control', link_id);
    };
    UI.prototype.delete_graph = function () {
        if (this.mouse.x < window.innerWidth - 300) {
            d3.select("#temporal_control").selectAll("*").remove();
            d3.select("#general").selectAll("*").remove();
        }
    };
    UI.prototype.onclick_reduce_side_bar = function () {
        d3.select("#icon_reduce_bar")
            .on("click", function () {
            var active = d3.select(this).attr("active");
            if (active == "false") {
                d3.select(this).selectAll("*").remove();
                d3.select(this).append("span").attr("class", "fa fa-chevron-circle-left");
                d3.select('#sliderDiv').style("transform", "translate(250px, 0px)");
                d3.select(this).attr("active", "true");
            }
            else {
                d3.select(this).selectAll("*").remove();
                d3.select(this).append("span").attr("class", "fa fa-chevron-circle-right");
                d3.select('#sliderDiv').style("transform", "translate(0px, 0px)");
                d3.select(this).attr("active", "false");
            }
        });
    };
    UI.prototype.get_top_bar_actions = function () {
        var self = this;
        $("#bar_position").click(function () {
            self.state_machine.state = "position_bar";
            console.log("MODE ", self.state_machine.state);
            console.log(self.particleVis.links);
        });
        $("#mouse").click(function () {
            self.state_machine.state = "click_infos";
            console.log("MODE ", self.state_machine.state);
        });
        $("#zoom_in").click(function () {
            event.preventDefault();
            self.camera.zoom -= 0.1;
            self.camera.updateProjectionMatrix();
        });
        $("#zoom_out").click(function () {
            event.preventDefault();
            self.camera.zoom += 0.1;
            self.camera.updateProjectionMatrix();
        });
    };
    UI.prototype.unhilightNeighborood = function () {
        if (this.hasHilight == true) {
            this.particleVis.set_All_nodes_opacity(1);
            this.particleVis.setTubesNormalOpacity();
            this.particleVis.updateParticles_Opacity(1);
            this.particleVis.set_All_labels_opacity(1);
        }
        this.hasHilight = false;
    };
    UI.prototype.hilightNeighborood = function (node) {
        this.hasHilight = true;
        this.particleVis.set_All_nodes_opacity(0.1);
        this.particleVis.set_All_tubes_opacity(0.05);
        this.particleVis.updateParticles_Opacity(0.1);
        this.particleVis.set_All_labels_opacity(0.1);
        for (var i = 0; i < this.particleVis.links.length; i++) {
            var link = this.particleVis.links[i];
            var nodeSource = this.particleVis.links[i].source;
            var nodeTarget = this.particleVis.links[i].target;
            if (node.id == nodeSource.id || node.id == nodeTarget.id) {
                this.particleVis.set_nodes_opacity(nodeSource.index, 1);
                this.particleVis.set_nodes_opacity(nodeTarget.index, 1);
                this.particleVis.set_tube_opacity(i, link.tube_opacity);
                this.particleVis.updateParticles_Gate_Opacity(i, 1);
                this.particleVis.set_label_opacity(nodeSource.index, 1);
                this.particleVis.set_label_opacity(nodeTarget.index, 1);
            }
        }
    };
    return UI;
}());
var UIGate = (function () {
    function UIGate(confluent_graph, container, link_id) {
        this.container = d3.select(container);
        this.link_id = link_id;
        this.confluent_graph = confluent_graph;
        this.delete_UI();
        this.make_UI_general();
        this.make_UI();
    }
    UIGate.prototype.update_UI = function () {
        this.delete_UI();
        this.change_appearanceLink();
        this.make_graphs(0);
    };
    UIGate.prototype.make_array = function (length) {
        var array = [];
        for (var i = 0; i < length; i++) {
            array[i] = i;
        }
        return array;
    };
    UIGate.prototype.delete_UI = function () {
        console.log("DELETE");
        this.container.selectAll(".graph").remove();
        d3.select("#general").selectAll(".graph").remove();
    };
    UIGate.prototype.make_UI = function () {
        this.change_appearanceLink();
        var self = this;
        var array_data = this.confluent_graph.links[this.link_id].gates;
        var length = this.confluent_graph.links[this.link_id].gates.length;
        var data = this.make_array(length);
        var selection = this.container.append('div')
            .attr("id", "select")
            .append('text')
            .text("Gate n° : ");
        var select = selection.append('select')
            .on('change', onchange);
        var options = select.selectAll('option')
            .data(data).enter()
            .append('option')
            .text(function (d) { return d; });
        self.make_graphs(0);
        function onchange() {
            var value = this.options[this.selectedIndex].value;
            self.delete_UI();
            self.change_appearanceLink();
            self.make_graphs(value);
        }
        ;
    };
    UIGate.prototype.make_graphs = function (value) {
        var number_particles = this.confluent_graph.links[this.link_id].userData.number_particles;
        var temporal_distribution = this.confluent_graph.links[this.link_id].temporal_distribution;
        var spatial_distribution = this.confluent_graph.links[this.link_id].spatial_distribution;
        var number_temporal = this.confluent_graph.links[this.link_id].temporal_distribution.length;
        if (value == 0) {
            this.slider1 = new SliderButton(this.confluent_graph, "#temporal_control", this.link_id, number_particles, temporal_distribution, value, number_temporal, "temporal");
            this.slider2 = new SliderButton(this.confluent_graph, "#temporal_control", this.link_id, number_particles, spatial_distribution, value, 12, "spatial");
            this.velocity = new Slider_Button(this.confluent_graph, "#temporal_control", this.link_id, value, "velocity");
        }
        this.colorpicker = new ColorPicker(this.confluent_graph, "#temporal_control", this.link_id, value);
        this.link_width = new Slider_Button(this.confluent_graph, "#temporal_control", this.link_id, value, "link_width");
        this.opacity = new Slider_Button(this.confluent_graph, "#temporal_control", this.link_id, value, "opacity");
        this.size = new Slider_Button(this.confluent_graph, "#temporal_control", this.link_id, value, "size");
        this.wiggling = new Slider_Button(this.confluent_graph, "#temporal_control", this.link_id, value, "wiggling");
    };
    UIGate.prototype.change_appearanceLink = function () {
        this.informations = new UIInformations(this.confluent_graph, "#general", this.link_id);
        this.link_appearance = new LinkAppearance(this.confluent_graph, "#general", this.link_id);
        this.texture = new Drop_Down(this.confluent_graph, "#temporal_control", this.link_id, "texture");
    };
    UIGate.prototype.make_UI_general = function () {
        this.informations_general = new UIInformations_general(this.confluent_graph, "#general");
    };
    return UIGate;
}());
var SliderButton = (function () {
    function SliderButton(confluent_graph, container, link_id, particle, values, gate_id, number_values, type) {
        this.my_link = 1;
        this.particle = 100;
        this.number_values_temporal = 8;
        this.confluent_graph = confluent_graph;
        this.SLIDER_WIDTH = 400;
        this.SLIDER_HIGHT = 150;
        this.gate_id = gate_id;
        this.my_link = link_id;
        this.particle = particle;
        this.values = values;
        this.number_values_temporal = number_values;
        this.type = type;
        this.container = d3.select(container).append("div").attr("class", "graph").attr("id", "graph");
        this.id = SliderButton.ID;
        SliderButton.ID++;
        var self = this;
        this.title = this.particle + ' particles / Link n° ' + self.my_link;
        this.makeSliderVertical(this.SLIDER_WIDTH, this.SLIDER_HIGHT, this.values, function (value) {
            console.log("VALUE", value);
            var temporal_distribution = value;
            if (self.type == "temporal") {
                self.confluent_graph.links[self.my_link].temporal_distribution = value;
                self.confluent_graph.updateParticles_TemporalDistribution(self.gate_id, temporal_distribution, self.my_link, self.number_values_temporal);
            }
            else {
                self.confluent_graph.links[self.my_link].spatial_distribution = value;
                self.confluent_graph.updateParticles_SpatialDistribution(temporal_distribution, self.my_link);
            }
            self.update_graph(value);
        });
    }
    SliderButton.prototype.update_graph = function (value) {
        if (value.length != this.number_values_temporal) {
            var array = [];
            for (var i = 0; i < this.number_values_temporal; i++) {
                array[i] = 0;
            }
            array[0] = this.particle;
            value = array;
        }
        this.svg.selectAll("*").remove();
        this.container.selectAll("select").remove();
        this.slider.set(value);
        this.slider.appendTo(this.svg);
    };
    SliderButton.prototype.makeSliderVertical = function (width, height, values, f) {
        var self = this;
        console.log("spatial", self.confluent_graph.links[self.my_link].spatial_distribution);
        if (values.length != this.number_values_temporal) {
            var array = [];
            for (var i = 0; i < this.number_values_temporal; i++) {
                array[i] = 0;
            }
            array[0] = this.particle;
            values = array;
        }
        var max_per_slider = this.particle;
        this.slider = new MySlider(this.id, 50, 10, width, height, 0, max_per_slider, 1, this.number_values_temporal);
        this.container.append('text')
            .text(this.type + " distribution :");
        this.svg = this.container.append('svg')
            .attr('width', width)
            .attr('height', height);
        this.slider.set(values);
        this.slider.appendTo(this.svg);
        this.slider.setDragEndCallBack(f);
        if (self.type == "temporal") {
            var data = [2, 3, 4, 5, 6, 7, 8, 9, 10];
            var yo = this.container.append('text').text("Number of cycle : ");
            var select = this.container.append('select')
                .on('change', onchange);
            var options = select
                .selectAll('option')
                .data(data).enter()
                .append('option')
                .text(function (d) { return d; });
            function onchange() {
                self.number_values_temporal = parseInt(this.options[this.selectedIndex].value);
                self.update_graph(values);
            }
            ;
        }
    };
    SliderButton.ID = 0;
    return SliderButton;
}());
var cola;
(function (cola) {
    var packingOptions = {
        PADDING: 10,
        GOLDEN_SECTION: (1 + Math.sqrt(5)) / 2,
        FLOAT_EPSILON: 0.0001,
        MAX_INERATIONS: 100
    };
    function applyPacking(graphs, w, h, node_size, desired_ratio) {
        if (desired_ratio === void 0) { desired_ratio = 1; }
        var init_x = 0, init_y = 0, svg_width = w, svg_height = h, desired_ratio = typeof desired_ratio !== 'undefined' ? desired_ratio : 1, node_size = typeof node_size !== 'undefined' ? node_size : 0, real_width = 0, real_height = 0, min_width = 0, global_bottom = 0, line = [];
        if (graphs.length == 0)
            return;
        calculate_bb(graphs);
        apply(graphs, desired_ratio);
        put_nodes_to_right_positions(graphs);
        function calculate_bb(graphs) {
            graphs.forEach(function (g) {
                calculate_single_bb(g);
            });
            function calculate_single_bb(graph) {
                var min_x = Number.MAX_VALUE, min_y = Number.MAX_VALUE, max_x = 0, max_y = 0;
                graph.array.forEach(function (v) {
                    var w = typeof v.width !== 'undefined' ? v.width : node_size;
                    var h = typeof v.height !== 'undefined' ? v.height : node_size;
                    w /= 2;
                    h /= 2;
                    max_x = Math.max(v.x + w, max_x);
                    min_x = Math.min(v.x - w, min_x);
                    max_y = Math.max(v.y + h, max_y);
                    min_y = Math.min(v.y - h, min_y);
                });
                graph.width = max_x - min_x;
                graph.height = max_y - min_y;
            }
        }
        function put_nodes_to_right_positions(graphs) {
            graphs.forEach(function (g) {
                var center = { x: 0, y: 0 };
                g.array.forEach(function (node) {
                    center.x += node.x;
                    center.y += node.y;
                });
                center.x /= g.array.length;
                center.y /= g.array.length;
                var corner = { x: center.x - g.width / 2, y: center.y - g.height / 2 };
                var offset = { x: g.x - corner.x, y: g.y - corner.y };
                g.array.forEach(function (node) {
                    node.x = node.x + offset.x + svg_width / 2 - real_width / 2;
                    node.y = node.y + offset.y + svg_height / 2 - real_height / 2;
                });
            });
        }
        function apply(data, desired_ratio) {
            var curr_best_f = Number.POSITIVE_INFINITY;
            var curr_best = 0;
            data.sort(function (a, b) { return b.height - a.height; });
            min_width = data.reduce(function (a, b) {
                return a.width < b.width ? a.width : b.width;
            });
            var left = x1 = min_width;
            var right = x2 = get_entire_width(data);
            var iterationCounter = 0;
            var f_x1 = Number.MAX_VALUE;
            var f_x2 = Number.MAX_VALUE;
            var flag = -1;
            var dx = Number.MAX_VALUE;
            var df = Number.MAX_VALUE;
            while ((dx > min_width) || df > packingOptions.FLOAT_EPSILON) {
                if (flag != 1) {
                    var x1 = right - (right - left) / packingOptions.GOLDEN_SECTION;
                    var f_x1 = step(data, x1);
                }
                if (flag != 0) {
                    var x2 = left + (right - left) / packingOptions.GOLDEN_SECTION;
                    var f_x2 = step(data, x2);
                }
                dx = Math.abs(x1 - x2);
                df = Math.abs(f_x1 - f_x2);
                if (f_x1 < curr_best_f) {
                    curr_best_f = f_x1;
                    curr_best = x1;
                }
                if (f_x2 < curr_best_f) {
                    curr_best_f = f_x2;
                    curr_best = x2;
                }
                if (f_x1 > f_x2) {
                    left = x1;
                    x1 = x2;
                    f_x1 = f_x2;
                    flag = 1;
                }
                else {
                    right = x2;
                    x2 = x1;
                    f_x2 = f_x1;
                    flag = 0;
                }
                if (iterationCounter++ > 100) {
                    break;
                }
            }
            step(data, curr_best);
        }
        function step(data, max_width) {
            line = [];
            real_width = 0;
            real_height = 0;
            global_bottom = init_y;
            for (var i = 0; i < data.length; i++) {
                var o = data[i];
                put_rect(o, max_width);
            }
            return Math.abs(get_real_ratio() - desired_ratio);
        }
        function put_rect(rect, max_width) {
            var parent = undefined;
            for (var i = 0; i < line.length; i++) {
                if ((line[i].space_left >= rect.height) && (line[i].x + line[i].width + rect.width + packingOptions.PADDING - max_width) <= packingOptions.FLOAT_EPSILON) {
                    parent = line[i];
                    break;
                }
            }
            line.push(rect);
            if (parent !== undefined) {
                rect.x = parent.x + parent.width + packingOptions.PADDING;
                rect.y = parent.bottom;
                rect.space_left = rect.height;
                rect.bottom = rect.y;
                parent.space_left -= rect.height + packingOptions.PADDING;
                parent.bottom += rect.height + packingOptions.PADDING;
            }
            else {
                rect.y = global_bottom;
                global_bottom += rect.height + packingOptions.PADDING;
                rect.x = init_x;
                rect.bottom = rect.y;
                rect.space_left = rect.height;
            }
            if (rect.y + rect.height - real_height > -packingOptions.FLOAT_EPSILON)
                real_height = rect.y + rect.height - init_y;
            if (rect.x + rect.width - real_width > -packingOptions.FLOAT_EPSILON)
                real_width = rect.x + rect.width - init_x;
        }
        ;
        function get_entire_width(data) {
            var width = 0;
            data.forEach(function (d) { return width += d.width + packingOptions.PADDING; });
            return width;
        }
        function get_real_ratio() {
            return (real_width / real_height);
        }
    }
    cola.applyPacking = applyPacking;
    function separateGraphs(nodes, links) {
        var marks = {};
        var ways = {};
        var graphs = [];
        var clusters = 0;
        for (var i = 0; i < links.length; i++) {
            var link = links[i];
            var n1 = link.source;
            var n2 = link.target;
            if (ways[n1.index])
                ways[n1.index].push(n2);
            else
                ways[n1.index] = [n2];
            if (ways[n2.index])
                ways[n2.index].push(n1);
            else
                ways[n2.index] = [n1];
        }
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            if (marks[node.index])
                continue;
            explore_node(node, true);
        }
        function explore_node(n, is_new) {
            if (marks[n.index] !== undefined)
                return;
            if (is_new) {
                clusters++;
                graphs.push({ array: [] });
            }
            marks[n.index] = clusters;
            graphs[clusters - 1].array.push(n);
            var adjacent = ways[n.index];
            if (!adjacent)
                return;
            for (var j = 0; j < adjacent.length; j++) {
                explore_node(adjacent[j], false);
            }
        }
        return graphs;
    }
    cola.separateGraphs = separateGraphs;
})(cola || (cola = {}));
var cola;
(function (cola) {
    var vpsc;
    (function (vpsc) {
        var PositionStats = (function () {
            function PositionStats(scale) {
                this.scale = scale;
                this.AB = 0;
                this.AD = 0;
                this.A2 = 0;
            }
            PositionStats.prototype.addVariable = function (v) {
                var ai = this.scale / v.scale;
                var bi = v.offset / v.scale;
                var wi = v.weight;
                this.AB += wi * ai * bi;
                this.AD += wi * ai * v.desiredPosition;
                this.A2 += wi * ai * ai;
            };
            PositionStats.prototype.getPosn = function () {
                return (this.AD - this.AB) / this.A2;
            };
            return PositionStats;
        }());
        vpsc.PositionStats = PositionStats;
        var Constraint = (function () {
            function Constraint(left, right, gap, equality) {
                if (equality === void 0) { equality = false; }
                this.left = left;
                this.right = right;
                this.gap = gap;
                this.equality = equality;
                this.active = false;
                this.unsatisfiable = false;
                this.left = left;
                this.right = right;
                this.gap = gap;
                this.equality = equality;
            }
            Constraint.prototype.slack = function () {
                return this.unsatisfiable ? Number.MAX_VALUE
                    : this.right.scale * this.right.position() - this.gap
                        - this.left.scale * this.left.position();
            };
            return Constraint;
        }());
        vpsc.Constraint = Constraint;
        var Variable = (function () {
            function Variable(desiredPosition, weight, scale) {
                if (weight === void 0) { weight = 1; }
                if (scale === void 0) { scale = 1; }
                this.desiredPosition = desiredPosition;
                this.weight = weight;
                this.scale = scale;
                this.offset = 0;
            }
            Variable.prototype.dfdv = function () {
                return 2.0 * this.weight * (this.position() - this.desiredPosition);
            };
            Variable.prototype.position = function () {
                return (this.block.ps.scale * this.block.posn + this.offset) / this.scale;
            };
            Variable.prototype.visitNeighbours = function (prev, f) {
                var ff = function (c, next) { return c.active && prev !== next && f(c, next); };
                this.cOut.forEach(function (c) { return ff(c, c.right); });
                this.cIn.forEach(function (c) { return ff(c, c.left); });
            };
            return Variable;
        }());
        vpsc.Variable = Variable;
        var Block = (function () {
            function Block(v) {
                this.vars = [];
                v.offset = 0;
                this.ps = new PositionStats(v.scale);
                this.addVariable(v);
            }
            Block.prototype.addVariable = function (v) {
                v.block = this;
                this.vars.push(v);
                this.ps.addVariable(v);
                this.posn = this.ps.getPosn();
            };
            Block.prototype.updateWeightedPosition = function () {
                this.ps.AB = this.ps.AD = this.ps.A2 = 0;
                for (var i = 0, n = this.vars.length; i < n; ++i)
                    this.ps.addVariable(this.vars[i]);
                this.posn = this.ps.getPosn();
            };
            Block.prototype.compute_lm = function (v, u, postAction) {
                var _this = this;
                var dfdv = v.dfdv();
                v.visitNeighbours(u, function (c, next) {
                    var _dfdv = _this.compute_lm(next, v, postAction);
                    if (next === c.right) {
                        dfdv += _dfdv * c.left.scale;
                        c.lm = _dfdv;
                    }
                    else {
                        dfdv += _dfdv * c.right.scale;
                        c.lm = -_dfdv;
                    }
                    postAction(c);
                });
                return dfdv / v.scale;
            };
            Block.prototype.populateSplitBlock = function (v, prev) {
                var _this = this;
                v.visitNeighbours(prev, function (c, next) {
                    next.offset = v.offset + (next === c.right ? c.gap : -c.gap);
                    _this.addVariable(next);
                    _this.populateSplitBlock(next, v);
                });
            };
            Block.prototype.traverse = function (visit, acc, v, prev) {
                var _this = this;
                if (v === void 0) { v = this.vars[0]; }
                if (prev === void 0) { prev = null; }
                v.visitNeighbours(prev, function (c, next) {
                    acc.push(visit(c));
                    _this.traverse(visit, acc, next, v);
                });
            };
            Block.prototype.findMinLM = function () {
                var m = null;
                this.compute_lm(this.vars[0], null, function (c) {
                    if (!c.equality && (m === null || c.lm < m.lm))
                        m = c;
                });
                return m;
            };
            Block.prototype.findMinLMBetween = function (lv, rv) {
                this.compute_lm(lv, null, function () { });
                var m = null;
                this.findPath(lv, null, rv, function (c, next) {
                    if (!c.equality && c.right === next && (m === null || c.lm < m.lm))
                        m = c;
                });
                return m;
            };
            Block.prototype.findPath = function (v, prev, to, visit) {
                var _this = this;
                var endFound = false;
                v.visitNeighbours(prev, function (c, next) {
                    if (!endFound && (next === to || _this.findPath(next, v, to, visit))) {
                        endFound = true;
                        visit(c, next);
                    }
                });
                return endFound;
            };
            Block.prototype.isActiveDirectedPathBetween = function (u, v) {
                if (u === v)
                    return true;
                var i = u.cOut.length;
                while (i--) {
                    var c = u.cOut[i];
                    if (c.active && this.isActiveDirectedPathBetween(c.right, v))
                        return true;
                }
                return false;
            };
            Block.split = function (c) {
                c.active = false;
                return [Block.createSplitBlock(c.left), Block.createSplitBlock(c.right)];
            };
            Block.createSplitBlock = function (startVar) {
                var b = new Block(startVar);
                b.populateSplitBlock(startVar, null);
                return b;
            };
            Block.prototype.splitBetween = function (vl, vr) {
                var c = this.findMinLMBetween(vl, vr);
                if (c !== null) {
                    var bs = Block.split(c);
                    return { constraint: c, lb: bs[0], rb: bs[1] };
                }
                return null;
            };
            Block.prototype.mergeAcross = function (b, c, dist) {
                c.active = true;
                for (var i = 0, n = b.vars.length; i < n; ++i) {
                    var v = b.vars[i];
                    v.offset += dist;
                    this.addVariable(v);
                }
                this.posn = this.ps.getPosn();
            };
            Block.prototype.cost = function () {
                var sum = 0, i = this.vars.length;
                while (i--) {
                    var v = this.vars[i], d = v.position() - v.desiredPosition;
                    sum += d * d * v.weight;
                }
                return sum;
            };
            return Block;
        }());
        vpsc.Block = Block;
        var Blocks = (function () {
            function Blocks(vs) {
                this.vs = vs;
                var n = vs.length;
                this.list = new Array(n);
                while (n--) {
                    var b = new Block(vs[n]);
                    this.list[n] = b;
                    b.blockInd = n;
                }
            }
            Blocks.prototype.cost = function () {
                var sum = 0, i = this.list.length;
                while (i--)
                    sum += this.list[i].cost();
                return sum;
            };
            Blocks.prototype.insert = function (b) {
                b.blockInd = this.list.length;
                this.list.push(b);
            };
            Blocks.prototype.remove = function (b) {
                var last = this.list.length - 1;
                var swapBlock = this.list[last];
                this.list.length = last;
                if (b !== swapBlock) {
                    this.list[b.blockInd] = swapBlock;
                    swapBlock.blockInd = b.blockInd;
                }
            };
            Blocks.prototype.merge = function (c) {
                var l = c.left.block, r = c.right.block;
                var dist = c.right.offset - c.left.offset - c.gap;
                if (l.vars.length < r.vars.length) {
                    r.mergeAcross(l, c, dist);
                    this.remove(l);
                }
                else {
                    l.mergeAcross(r, c, -dist);
                    this.remove(r);
                }
            };
            Blocks.prototype.forEach = function (f) {
                this.list.forEach(f);
            };
            Blocks.prototype.updateBlockPositions = function () {
                this.list.forEach(function (b) { return b.updateWeightedPosition(); });
            };
            Blocks.prototype.split = function (inactive) {
                var _this = this;
                this.updateBlockPositions();
                this.list.forEach(function (b) {
                    var v = b.findMinLM();
                    if (v !== null && v.lm < Solver.LAGRANGIAN_TOLERANCE) {
                        b = v.left.block;
                        Block.split(v).forEach(function (nb) { return _this.insert(nb); });
                        _this.remove(b);
                        inactive.push(v);
                    }
                });
            };
            return Blocks;
        }());
        vpsc.Blocks = Blocks;
        var Solver = (function () {
            function Solver(vs, cs) {
                this.vs = vs;
                this.cs = cs;
                this.vs = vs;
                vs.forEach(function (v) {
                    v.cIn = [], v.cOut = [];
                });
                this.cs = cs;
                cs.forEach(function (c) {
                    c.left.cOut.push(c);
                    c.right.cIn.push(c);
                });
                this.inactive = cs.map(function (c) { c.active = false; return c; });
                this.bs = null;
            }
            Solver.prototype.cost = function () {
                return this.bs.cost();
            };
            Solver.prototype.setStartingPositions = function (ps) {
                this.inactive = this.cs.map(function (c) { c.active = false; return c; });
                this.bs = new Blocks(this.vs);
                this.bs.forEach(function (b, i) { return b.posn = ps[i]; });
            };
            Solver.prototype.setDesiredPositions = function (ps) {
                this.vs.forEach(function (v, i) { return v.desiredPosition = ps[i]; });
            };
            Solver.prototype.mostViolated = function () {
                var minSlack = Number.MAX_VALUE, v = null, l = this.inactive, n = l.length, deletePoint = n;
                for (var i = 0; i < n; ++i) {
                    var c = l[i];
                    if (c.unsatisfiable)
                        continue;
                    var slack = c.slack();
                    if (c.equality || slack < minSlack) {
                        minSlack = slack;
                        v = c;
                        deletePoint = i;
                        if (c.equality)
                            break;
                    }
                }
                if (deletePoint !== n &&
                    (minSlack < Solver.ZERO_UPPERBOUND && !v.active || v.equality)) {
                    l[deletePoint] = l[n - 1];
                    l.length = n - 1;
                }
                return v;
            };
            Solver.prototype.satisfy = function () {
                if (this.bs == null) {
                    this.bs = new Blocks(this.vs);
                }
                this.bs.split(this.inactive);
                var v = null;
                while ((v = this.mostViolated()) && (v.equality || v.slack() < Solver.ZERO_UPPERBOUND && !v.active)) {
                    var lb = v.left.block, rb = v.right.block;
                    if (lb !== rb) {
                        this.bs.merge(v);
                    }
                    else {
                        if (lb.isActiveDirectedPathBetween(v.right, v.left)) {
                            v.unsatisfiable = true;
                            continue;
                        }
                        var split = lb.splitBetween(v.left, v.right);
                        if (split !== null) {
                            this.bs.insert(split.lb);
                            this.bs.insert(split.rb);
                            this.bs.remove(lb);
                            this.inactive.push(split.constraint);
                        }
                        else {
                            v.unsatisfiable = true;
                            continue;
                        }
                        if (v.slack() >= 0) {
                            this.inactive.push(v);
                        }
                        else {
                            this.bs.merge(v);
                        }
                    }
                }
            };
            Solver.prototype.solve = function () {
                this.satisfy();
                var lastcost = Number.MAX_VALUE, cost = this.bs.cost();
                while (Math.abs(lastcost - cost) > 0.0001) {
                    this.satisfy();
                    lastcost = cost;
                    cost = this.bs.cost();
                }
                return cost;
            };
            Solver.LAGRANGIAN_TOLERANCE = -1e-4;
            Solver.ZERO_UPPERBOUND = -1e-10;
            return Solver;
        }());
        vpsc.Solver = Solver;
    })(vpsc = cola.vpsc || (cola.vpsc = {}));
})(cola || (cola = {}));
var cola;
(function (cola) {
    var vpsc;
    (function (vpsc) {
        function computeGroupBounds(g) {
            g.bounds = typeof g.leaves !== "undefined" ?
                g.leaves.reduce(function (r, c) { return c.bounds.union(r); }, Rectangle.empty()) :
                Rectangle.empty();
            if (typeof g.groups !== "undefined")
                g.bounds = g.groups.reduce(function (r, c) { return computeGroupBounds(c).union(r); }, g.bounds);
            g.bounds = g.bounds.inflate(g.padding);
            return g.bounds;
        }
        vpsc.computeGroupBounds = computeGroupBounds;
        var Rectangle = (function () {
            function Rectangle(x, X, y, Y) {
                this.x = x;
                this.X = X;
                this.y = y;
                this.Y = Y;
            }
            Rectangle.empty = function () { return new Rectangle(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY); };
            Rectangle.prototype.cx = function () { return (this.x + this.X) / 2; };
            Rectangle.prototype.cy = function () { return (this.y + this.Y) / 2; };
            Rectangle.prototype.overlapX = function (r) {
                var ux = this.cx(), vx = r.cx();
                if (ux <= vx && r.x < this.X)
                    return this.X - r.x;
                if (vx <= ux && this.x < r.X)
                    return r.X - this.x;
                return 0;
            };
            Rectangle.prototype.overlapY = function (r) {
                var uy = this.cy(), vy = r.cy();
                if (uy <= vy && r.y < this.Y)
                    return this.Y - r.y;
                if (vy <= uy && this.y < r.Y)
                    return r.Y - this.y;
                return 0;
            };
            Rectangle.prototype.setXCentre = function (cx) {
                var dx = cx - this.cx();
                this.x += dx;
                this.X += dx;
            };
            Rectangle.prototype.setYCentre = function (cy) {
                var dy = cy - this.cy();
                this.y += dy;
                this.Y += dy;
            };
            Rectangle.prototype.width = function () {
                return this.X - this.x;
            };
            Rectangle.prototype.height = function () {
                return this.Y - this.y;
            };
            Rectangle.prototype.union = function (r) {
                return new Rectangle(Math.min(this.x, r.x), Math.max(this.X, r.X), Math.min(this.y, r.y), Math.max(this.Y, r.Y));
            };
            Rectangle.prototype.lineIntersections = function (x1, y1, x2, y2) {
                var sides = [[this.x, this.y, this.X, this.y],
                    [this.X, this.y, this.X, this.Y],
                    [this.X, this.Y, this.x, this.Y],
                    [this.x, this.Y, this.x, this.y]];
                var intersections = [];
                for (var i = 0; i < 4; ++i) {
                    var r = Rectangle.lineIntersection(x1, y1, x2, y2, sides[i][0], sides[i][1], sides[i][2], sides[i][3]);
                    if (r !== null)
                        intersections.push({ x: r.x, y: r.y });
                }
                return intersections;
            };
            Rectangle.prototype.rayIntersection = function (x2, y2) {
                var ints = this.lineIntersections(this.cx(), this.cy(), x2, y2);
                return ints.length > 0 ? ints[0] : null;
            };
            Rectangle.prototype.vertices = function () {
                return [
                    { x: this.x, y: this.y },
                    { x: this.X, y: this.y },
                    { x: this.X, y: this.Y },
                    { x: this.x, y: this.Y },
                    { x: this.x, y: this.y }];
            };
            Rectangle.lineIntersection = function (x1, y1, x2, y2, x3, y3, x4, y4) {
                var dx12 = x2 - x1, dx34 = x4 - x3, dy12 = y2 - y1, dy34 = y4 - y3, denominator = dy34 * dx12 - dx34 * dy12;
                if (denominator == 0)
                    return null;
                var dx31 = x1 - x3, dy31 = y1 - y3, numa = dx34 * dy31 - dy34 * dx31, a = numa / denominator, numb = dx12 * dy31 - dy12 * dx31, b = numb / denominator;
                if (a >= 0 && a <= 1 && b >= 0 && b <= 1) {
                    return {
                        x: x1 + a * dx12,
                        y: y1 + a * dy12
                    };
                }
                return null;
            };
            Rectangle.prototype.inflate = function (pad) {
                return new Rectangle(this.x - pad, this.X + pad, this.y - pad, this.Y + pad);
            };
            return Rectangle;
        }());
        vpsc.Rectangle = Rectangle;
        function makeEdgeBetween(link, source, target, ah) {
            var si = source.rayIntersection(target.cx(), target.cy());
            if (!si)
                si = { x: source.cx(), y: source.cy() };
            var ti = target.rayIntersection(source.cx(), source.cy());
            if (!ti)
                ti = { x: target.cx(), y: target.cy() };
            var dx = ti.x - si.x, dy = ti.y - si.y, l = Math.sqrt(dx * dx + dy * dy), al = l - ah;
            link.sourceIntersection = si;
            link.targetIntersection = ti;
            link.arrowStart = { x: si.x + al * dx / l, y: si.y + al * dy / l };
        }
        vpsc.makeEdgeBetween = makeEdgeBetween;
        function makeEdgeTo(s, target, ah) {
            var ti = target.rayIntersection(s.x, s.y);
            if (!ti)
                ti = { x: target.cx(), y: target.cy() };
            var dx = ti.x - s.x, dy = ti.y - s.y, l = Math.sqrt(dx * dx + dy * dy);
            return { x: ti.x - ah * dx / l, y: ti.y - ah * dy / l };
        }
        vpsc.makeEdgeTo = makeEdgeTo;
        var Node = (function () {
            function Node(v, r, pos) {
                this.v = v;
                this.r = r;
                this.pos = pos;
                this.prev = makeRBTree();
                this.next = makeRBTree();
            }
            return Node;
        }());
        var Event = (function () {
            function Event(isOpen, v, pos) {
                this.isOpen = isOpen;
                this.v = v;
                this.pos = pos;
            }
            return Event;
        }());
        function compareEvents(a, b) {
            if (a.pos > b.pos) {
                return 1;
            }
            if (a.pos < b.pos) {
                return -1;
            }
            if (a.isOpen) {
                return -1;
            }
            return 0;
        }
        function makeRBTree() {
            return new RBTree(function (a, b) { return a.pos - b.pos; });
        }
        var xRect = {
            getCentre: function (r) { return r.cx(); },
            getOpen: function (r) { return r.y; },
            getClose: function (r) { return r.Y; },
            getSize: function (r) { return r.width(); },
            makeRect: function (open, close, center, size) { return new Rectangle(center - size / 2, center + size / 2, open, close); },
            findNeighbours: findXNeighbours
        };
        var yRect = {
            getCentre: function (r) { return r.cy(); },
            getOpen: function (r) { return r.x; },
            getClose: function (r) { return r.X; },
            getSize: function (r) { return r.height(); },
            makeRect: function (open, close, center, size) { return new Rectangle(open, close, center - size / 2, center + size / 2); },
            findNeighbours: findYNeighbours
        };
        function generateGroupConstraints(root, f, minSep, isContained) {
            if (isContained === void 0) { isContained = false; }
            var padding = root.padding, gn = typeof root.groups !== 'undefined' ? root.groups.length : 0, ln = typeof root.leaves !== 'undefined' ? root.leaves.length : 0, childConstraints = !gn ? []
                : root.groups.reduce(function (ccs, g) { return ccs.concat(generateGroupConstraints(g, f, minSep, true)); }, []), n = (isContained ? 2 : 0) + ln + gn, vs = new Array(n), rs = new Array(n), i = 0, add = function (r, v) { rs[i] = r; vs[i++] = v; };
            if (isContained) {
                var b = root.bounds, c = f.getCentre(b), s = f.getSize(b) / 2, open = f.getOpen(b), close = f.getClose(b), min = c - s + padding / 2, max = c + s - padding / 2;
                root.minVar.desiredPosition = min;
                add(f.makeRect(open, close, min, padding), root.minVar);
                root.maxVar.desiredPosition = max;
                add(f.makeRect(open, close, max, padding), root.maxVar);
            }
            if (ln)
                root.leaves.forEach(function (l) { return add(l.bounds, l.variable); });
            if (gn)
                root.groups.forEach(function (g) {
                    var b = g.bounds;
                    add(f.makeRect(f.getOpen(b), f.getClose(b), f.getCentre(b), f.getSize(b)), g.minVar);
                });
            var cs = generateConstraints(rs, vs, f, minSep);
            if (gn) {
                vs.forEach(function (v) { v.cOut = [], v.cIn = []; });
                cs.forEach(function (c) { c.left.cOut.push(c), c.right.cIn.push(c); });
                root.groups.forEach(function (g) {
                    var gapAdjustment = (g.padding - f.getSize(g.bounds)) / 2;
                    g.minVar.cIn.forEach(function (c) { return c.gap += gapAdjustment; });
                    g.minVar.cOut.forEach(function (c) { c.left = g.maxVar; c.gap += gapAdjustment; });
                });
            }
            return childConstraints.concat(cs);
        }
        function generateConstraints(rs, vars, rect, minSep) {
            var i, n = rs.length;
            var N = 2 * n;
            console.assert(vars.length >= n);
            var events = new Array(N);
            for (i = 0; i < n; ++i) {
                var r = rs[i];
                var v = new Node(vars[i], r, rect.getCentre(r));
                events[i] = new Event(true, v, rect.getOpen(r));
                events[i + n] = new Event(false, v, rect.getClose(r));
            }
            events.sort(compareEvents);
            var cs = new Array();
            var scanline = makeRBTree();
            for (i = 0; i < N; ++i) {
                var e = events[i];
                var v = e.v;
                if (e.isOpen) {
                    scanline.insert(v);
                    rect.findNeighbours(v, scanline);
                }
                else {
                    scanline.remove(v);
                    var makeConstraint = function (l, r) {
                        var sep = (rect.getSize(l.r) + rect.getSize(r.r)) / 2 + minSep;
                        cs.push(new vpsc.Constraint(l.v, r.v, sep));
                    };
                    var visitNeighbours = function (forward, reverse, mkcon) {
                        var u, it = v[forward].iterator();
                        while ((u = it[forward]()) !== null) {
                            mkcon(u, v);
                            u[reverse].remove(v);
                        }
                    };
                    visitNeighbours("prev", "next", function (u, v) { return makeConstraint(u, v); });
                    visitNeighbours("next", "prev", function (u, v) { return makeConstraint(v, u); });
                }
            }
            console.assert(scanline.size === 0);
            return cs;
        }
        function findXNeighbours(v, scanline) {
            var f = function (forward, reverse) {
                var it = scanline.findIter(v);
                var u;
                while ((u = it[forward]()) !== null) {
                    var uovervX = u.r.overlapX(v.r);
                    if (uovervX <= 0 || uovervX <= u.r.overlapY(v.r)) {
                        v[forward].insert(u);
                        u[reverse].insert(v);
                    }
                    if (uovervX <= 0) {
                        break;
                    }
                }
            };
            f("next", "prev");
            f("prev", "next");
        }
        function findYNeighbours(v, scanline) {
            var f = function (forward, reverse) {
                var u = scanline.findIter(v)[forward]();
                if (u !== null && u.r.overlapX(v.r) > 0) {
                    v[forward].insert(u);
                    u[reverse].insert(v);
                }
            };
            f("next", "prev");
            f("prev", "next");
        }
        function generateXConstraints(rs, vars) {
            return generateConstraints(rs, vars, xRect, 1e-6);
        }
        vpsc.generateXConstraints = generateXConstraints;
        function generateYConstraints(rs, vars) {
            return generateConstraints(rs, vars, yRect, 1e-6);
        }
        vpsc.generateYConstraints = generateYConstraints;
        function generateXGroupConstraints(root) {
            return generateGroupConstraints(root, xRect, 1e-6);
        }
        vpsc.generateXGroupConstraints = generateXGroupConstraints;
        function generateYGroupConstraints(root) {
            return generateGroupConstraints(root, yRect, 1e-6);
        }
        vpsc.generateYGroupConstraints = generateYGroupConstraints;
        function removeOverlaps(rs) {
            var vs = rs.map(function (r) { return new vpsc.Variable(r.cx()); });
            var cs = vpsc.generateXConstraints(rs, vs);
            var solver = new vpsc.Solver(vs, cs);
            solver.solve();
            vs.forEach(function (v, i) { return rs[i].setXCentre(v.position()); });
            vs = rs.map(function (r) {
                return new vpsc.Variable(r.cy());
            });
            cs = vpsc.generateYConstraints(rs, vs);
            solver = new vpsc.Solver(vs, cs);
            solver.solve();
            vs.forEach(function (v, i) { return rs[i].setYCentre(v.position()); });
        }
        vpsc.removeOverlaps = removeOverlaps;
        var IndexedVariable = (function (_super) {
            __extends(IndexedVariable, _super);
            function IndexedVariable(index, w) {
                _super.call(this, 0, w);
                this.index = index;
            }
            return IndexedVariable;
        }(vpsc.Variable));
        vpsc.IndexedVariable = IndexedVariable;
        var Projection = (function () {
            function Projection(nodes, groups, rootGroup, constraints, avoidOverlaps) {
                var _this = this;
                if (rootGroup === void 0) { rootGroup = null; }
                if (constraints === void 0) { constraints = null; }
                if (avoidOverlaps === void 0) { avoidOverlaps = false; }
                this.nodes = nodes;
                this.groups = groups;
                this.rootGroup = rootGroup;
                this.avoidOverlaps = avoidOverlaps;
                this.variables = nodes.map(function (v, i) {
                    return v.variable = new IndexedVariable(i, 1);
                });
                if (constraints)
                    this.createConstraints(constraints);
                if (avoidOverlaps && rootGroup && typeof rootGroup.groups !== 'undefined') {
                    nodes.forEach(function (v) {
                        if (!v.width || !v.height) {
                            v.bounds = new vpsc.Rectangle(v.x, v.x, v.y, v.y);
                            return;
                        }
                        var w2 = v.width / 2, h2 = v.height / 2;
                        v.bounds = new vpsc.Rectangle(v.x - w2, v.x + w2, v.y - h2, v.y + h2);
                    });
                    computeGroupBounds(rootGroup);
                    var i = nodes.length;
                    groups.forEach(function (g) {
                        _this.variables[i] = g.minVar = new IndexedVariable(i++, typeof g.stiffness !== "undefined" ? g.stiffness : 0.01);
                        _this.variables[i] = g.maxVar = new IndexedVariable(i++, typeof g.stiffness !== "undefined" ? g.stiffness : 0.01);
                    });
                }
            }
            Projection.prototype.createSeparation = function (c) {
                return new vpsc.Constraint(this.nodes[c.left].variable, this.nodes[c.right].variable, c.gap, typeof c.equality !== "undefined" ? c.equality : false);
            };
            Projection.prototype.makeFeasible = function (c) {
                var _this = this;
                if (!this.avoidOverlaps)
                    return;
                var axis = 'x', dim = 'width';
                if (c.axis === 'x')
                    axis = 'y', dim = 'height';
                var vs = c.offsets.map(function (o) { return _this.nodes[o.node]; }).sort(function (a, b) { return a[axis] - b[axis]; });
                var p = null;
                vs.forEach(function (v) {
                    if (p)
                        v[axis] = p[axis] + p[dim] + 1;
                    p = v;
                });
            };
            Projection.prototype.createAlignment = function (c) {
                var _this = this;
                var u = this.nodes[c.offsets[0].node].variable;
                this.makeFeasible(c);
                var cs = c.axis === 'x' ? this.xConstraints : this.yConstraints;
                c.offsets.slice(1).forEach(function (o) {
                    var v = _this.nodes[o.node].variable;
                    cs.push(new vpsc.Constraint(u, v, o.offset, true));
                });
            };
            Projection.prototype.createConstraints = function (constraints) {
                var _this = this;
                var isSep = function (c) { return typeof c.type === 'undefined' || c.type === 'separation'; };
                this.xConstraints = constraints
                    .filter(function (c) { return c.axis === "x" && isSep(c); })
                    .map(function (c) { return _this.createSeparation(c); });
                this.yConstraints = constraints
                    .filter(function (c) { return c.axis === "y" && isSep(c); })
                    .map(function (c) { return _this.createSeparation(c); });
                constraints
                    .filter(function (c) { return c.type === 'alignment'; })
                    .forEach(function (c) { return _this.createAlignment(c); });
            };
            Projection.prototype.setupVariablesAndBounds = function (x0, y0, desired, getDesired) {
                this.nodes.forEach(function (v, i) {
                    if (v.fixed) {
                        v.variable.weight = 1000;
                        desired[i] = getDesired(v);
                    }
                    else {
                        v.variable.weight = 1;
                    }
                    var w = (v.width || 0) / 2, h = (v.height || 0) / 2;
                    var ix = x0[i], iy = y0[i];
                    v.bounds = new Rectangle(ix - w, ix + w, iy - h, iy + h);
                });
            };
            Projection.prototype.xProject = function (x0, y0, x) {
                if (!this.rootGroup && !(this.avoidOverlaps || this.xConstraints))
                    return;
                this.project(x0, y0, x0, x, function (v) { return v.px; }, this.xConstraints, generateXGroupConstraints, function (v) { return v.bounds.setXCentre(x[v.variable.index] = v.variable.position()); }, function (g) {
                    var xmin = x[g.minVar.index] = g.minVar.position();
                    var xmax = x[g.maxVar.index] = g.maxVar.position();
                    var p2 = g.padding / 2;
                    g.bounds.x = xmin - p2;
                    g.bounds.X = xmax + p2;
                });
            };
            Projection.prototype.yProject = function (x0, y0, y) {
                if (!this.rootGroup && !this.yConstraints)
                    return;
                this.project(x0, y0, y0, y, function (v) { return v.py; }, this.yConstraints, generateYGroupConstraints, function (v) { return v.bounds.setYCentre(y[v.variable.index] = v.variable.position()); }, function (g) {
                    var ymin = y[g.minVar.index] = g.minVar.position();
                    var ymax = y[g.maxVar.index] = g.maxVar.position();
                    var p2 = g.padding / 2;
                    g.bounds.y = ymin - p2;
                    ;
                    g.bounds.Y = ymax + p2;
                });
            };
            Projection.prototype.projectFunctions = function () {
                var _this = this;
                return [
                    function (x0, y0, x) { return _this.xProject(x0, y0, x); },
                    function (x0, y0, y) { return _this.yProject(x0, y0, y); }
                ];
            };
            Projection.prototype.project = function (x0, y0, start, desired, getDesired, cs, generateConstraints, updateNodeBounds, updateGroupBounds) {
                this.setupVariablesAndBounds(x0, y0, desired, getDesired);
                if (this.rootGroup && this.avoidOverlaps) {
                    computeGroupBounds(this.rootGroup);
                    cs = cs.concat(generateConstraints(this.rootGroup));
                }
                this.solve(this.variables, cs, start, desired);
                this.nodes.forEach(updateNodeBounds);
                if (this.rootGroup && this.avoidOverlaps) {
                    this.groups.forEach(updateGroupBounds);
                }
            };
            Projection.prototype.solve = function (vs, cs, starting, desired) {
                var solver = new vpsc.Solver(vs, cs);
                solver.setStartingPositions(starting);
                solver.setDesiredPositions(desired);
                solver.solve();
            };
            return Projection;
        }());
        vpsc.Projection = Projection;
    })(vpsc = cola.vpsc || (cola.vpsc = {}));
})(cola || (cola = {}));
var cola;
(function (cola) {
    var geom;
    (function (geom) {
        var Point = (function () {
            function Point() {
            }
            return Point;
        }());
        geom.Point = Point;
        var LineSegment = (function () {
            function LineSegment(x1, y1, x2, y2) {
                this.x1 = x1;
                this.y1 = y1;
                this.x2 = x2;
                this.y2 = y2;
            }
            return LineSegment;
        }());
        geom.LineSegment = LineSegment;
        var PolyPoint = (function (_super) {
            __extends(PolyPoint, _super);
            function PolyPoint() {
                _super.apply(this, arguments);
            }
            return PolyPoint;
        }(Point));
        geom.PolyPoint = PolyPoint;
        function isLeft(P0, P1, P2) {
            return (P1.x - P0.x) * (P2.y - P0.y) - (P2.x - P0.x) * (P1.y - P0.y);
        }
        geom.isLeft = isLeft;
        function above(p, vi, vj) {
            return isLeft(p, vi, vj) > 0;
        }
        function below(p, vi, vj) {
            return isLeft(p, vi, vj) < 0;
        }
        function ConvexHull(S) {
            var P = S.slice(0).sort(function (a, b) { return a.x !== b.x ? b.x - a.x : b.y - a.y; });
            var n = S.length, i;
            var minmin = 0;
            var xmin = P[0].x;
            for (i = 1; i < n; ++i) {
                if (P[i].x !== xmin)
                    break;
            }
            var minmax = i - 1;
            var H = [];
            H.push(P[minmin]);
            if (minmax === n - 1) {
                if (P[minmax].y !== P[minmin].y)
                    H.push(P[minmax]);
            }
            else {
                var maxmin, maxmax = n - 1;
                var xmax = P[n - 1].x;
                for (i = n - 2; i >= 0; i--)
                    if (P[i].x !== xmax)
                        break;
                maxmin = i + 1;
                i = minmax;
                while (++i <= maxmin) {
                    if (isLeft(P[minmin], P[maxmin], P[i]) >= 0 && i < maxmin)
                        continue;
                    while (H.length > 1) {
                        if (isLeft(H[H.length - 2], H[H.length - 1], P[i]) > 0)
                            break;
                        else
                            H.length -= 1;
                    }
                    if (i != minmin)
                        H.push(P[i]);
                }
                if (maxmax != maxmin)
                    H.push(P[maxmax]);
                var bot = H.length;
                i = maxmin;
                while (--i >= minmax) {
                    if (isLeft(P[maxmax], P[minmax], P[i]) >= 0 && i > minmax)
                        continue;
                    while (H.length > bot) {
                        if (isLeft(H[H.length - 2], H[H.length - 1], P[i]) > 0)
                            break;
                        else
                            H.length -= 1;
                    }
                    if (i != minmin)
                        H.push(P[i]);
                }
            }
            return H;
        }
        geom.ConvexHull = ConvexHull;
        function clockwiseRadialSweep(p, P, f) {
            P.slice(0).sort(function (a, b) { return Math.atan2(a.y - p.y, a.x - p.x) - Math.atan2(b.y - p.y, b.x - p.x); }).forEach(f);
        }
        geom.clockwiseRadialSweep = clockwiseRadialSweep;
        function nextPolyPoint(p, ps) {
            if (p.polyIndex === ps.length - 1)
                return ps[0];
            return ps[p.polyIndex + 1];
        }
        function prevPolyPoint(p, ps) {
            if (p.polyIndex === 0)
                return ps[ps.length - 1];
            return ps[p.polyIndex - 1];
        }
        function tangent_PointPolyC(P, V) {
            return { rtan: Rtangent_PointPolyC(P, V), ltan: Ltangent_PointPolyC(P, V) };
        }
        function Rtangent_PointPolyC(P, V) {
            var n = V.length - 1;
            var a, b, c;
            var upA, dnC;
            if (below(P, V[1], V[0]) && !above(P, V[n - 1], V[0]))
                return 0;
            for (a = 0, b = n;;) {
                if (b - a === 1)
                    if (above(P, V[a], V[b]))
                        return a;
                    else
                        return b;
                c = Math.floor((a + b) / 2);
                dnC = below(P, V[c + 1], V[c]);
                if (dnC && !above(P, V[c - 1], V[c]))
                    return c;
                upA = above(P, V[a + 1], V[a]);
                if (upA) {
                    if (dnC)
                        b = c;
                    else {
                        if (above(P, V[a], V[c]))
                            b = c;
                        else
                            a = c;
                    }
                }
                else {
                    if (!dnC)
                        a = c;
                    else {
                        if (below(P, V[a], V[c]))
                            b = c;
                        else
                            a = c;
                    }
                }
            }
        }
        function Ltangent_PointPolyC(P, V) {
            var n = V.length - 1;
            var a, b, c;
            var dnA, dnC;
            if (above(P, V[n - 1], V[0]) && !below(P, V[1], V[0]))
                return 0;
            for (a = 0, b = n;;) {
                if (b - a === 1)
                    if (below(P, V[a], V[b]))
                        return a;
                    else
                        return b;
                c = Math.floor((a + b) / 2);
                dnC = below(P, V[c + 1], V[c]);
                if (above(P, V[c - 1], V[c]) && !dnC)
                    return c;
                dnA = below(P, V[a + 1], V[a]);
                if (dnA) {
                    if (!dnC)
                        b = c;
                    else {
                        if (below(P, V[a], V[c]))
                            b = c;
                        else
                            a = c;
                    }
                }
                else {
                    if (dnC)
                        a = c;
                    else {
                        if (above(P, V[a], V[c]))
                            b = c;
                        else
                            a = c;
                    }
                }
            }
        }
        function tangent_PolyPolyC(V, W, t1, t2, cmp1, cmp2) {
            var ix1, ix2;
            ix1 = t1(W[0], V);
            ix2 = t2(V[ix1], W);
            var done = false;
            while (!done) {
                done = true;
                while (true) {
                    if (ix1 === V.length - 1)
                        ix1 = 0;
                    if (cmp1(W[ix2], V[ix1], V[ix1 + 1]))
                        break;
                    ++ix1;
                }
                while (true) {
                    if (ix2 === 0)
                        ix2 = W.length - 1;
                    if (cmp2(V[ix1], W[ix2], W[ix2 - 1]))
                        break;
                    --ix2;
                    done = false;
                }
            }
            return { t1: ix1, t2: ix2 };
        }
        geom.tangent_PolyPolyC = tangent_PolyPolyC;
        function LRtangent_PolyPolyC(V, W) {
            var rl = RLtangent_PolyPolyC(W, V);
            return { t1: rl.t2, t2: rl.t1 };
        }
        geom.LRtangent_PolyPolyC = LRtangent_PolyPolyC;
        function RLtangent_PolyPolyC(V, W) {
            return tangent_PolyPolyC(V, W, Rtangent_PointPolyC, Ltangent_PointPolyC, above, below);
        }
        geom.RLtangent_PolyPolyC = RLtangent_PolyPolyC;
        function LLtangent_PolyPolyC(V, W) {
            return tangent_PolyPolyC(V, W, Ltangent_PointPolyC, Ltangent_PointPolyC, below, below);
        }
        geom.LLtangent_PolyPolyC = LLtangent_PolyPolyC;
        function RRtangent_PolyPolyC(V, W) {
            return tangent_PolyPolyC(V, W, Rtangent_PointPolyC, Rtangent_PointPolyC, above, above);
        }
        geom.RRtangent_PolyPolyC = RRtangent_PolyPolyC;
        var BiTangent = (function () {
            function BiTangent(t1, t2) {
                this.t1 = t1;
                this.t2 = t2;
            }
            return BiTangent;
        }());
        geom.BiTangent = BiTangent;
        var BiTangents = (function () {
            function BiTangents() {
            }
            return BiTangents;
        }());
        geom.BiTangents = BiTangents;
        var TVGPoint = (function (_super) {
            __extends(TVGPoint, _super);
            function TVGPoint() {
                _super.apply(this, arguments);
            }
            return TVGPoint;
        }(Point));
        geom.TVGPoint = TVGPoint;
        var VisibilityVertex = (function () {
            function VisibilityVertex(id, polyid, polyvertid, p) {
                this.id = id;
                this.polyid = polyid;
                this.polyvertid = polyvertid;
                this.p = p;
                p.vv = this;
            }
            return VisibilityVertex;
        }());
        geom.VisibilityVertex = VisibilityVertex;
        var VisibilityEdge = (function () {
            function VisibilityEdge(source, target) {
                this.source = source;
                this.target = target;
            }
            VisibilityEdge.prototype.length = function () {
                var dx = this.source.p.x - this.target.p.x;
                var dy = this.source.p.y - this.target.p.y;
                return Math.sqrt(dx * dx + dy * dy);
            };
            return VisibilityEdge;
        }());
        geom.VisibilityEdge = VisibilityEdge;
        var TangentVisibilityGraph = (function () {
            function TangentVisibilityGraph(P, g0) {
                this.P = P;
                this.V = [];
                this.E = [];
                if (!g0) {
                    var n = P.length;
                    for (var i = 0; i < n; i++) {
                        var p = P[i];
                        for (var j = 0; j < p.length; ++j) {
                            var pj = p[j], vv = new VisibilityVertex(this.V.length, i, j, pj);
                            this.V.push(vv);
                            if (j > 0)
                                this.E.push(new VisibilityEdge(p[j - 1].vv, vv));
                        }
                    }
                    for (var i = 0; i < n - 1; i++) {
                        var Pi = P[i];
                        for (var j = i + 1; j < n; j++) {
                            var Pj = P[j], t = geom.tangents(Pi, Pj);
                            for (var q in t) {
                                var c = t[q], source = Pi[c.t1], target = Pj[c.t2];
                                this.addEdgeIfVisible(source, target, i, j);
                            }
                        }
                    }
                }
                else {
                    this.V = g0.V.slice(0);
                    this.E = g0.E.slice(0);
                }
            }
            TangentVisibilityGraph.prototype.addEdgeIfVisible = function (u, v, i1, i2) {
                if (!this.intersectsPolys(new LineSegment(u.x, u.y, v.x, v.y), i1, i2)) {
                    this.E.push(new VisibilityEdge(u.vv, v.vv));
                }
            };
            TangentVisibilityGraph.prototype.addPoint = function (p, i1) {
                var n = this.P.length;
                this.V.push(new VisibilityVertex(this.V.length, n, 0, p));
                for (var i = 0; i < n; ++i) {
                    if (i === i1)
                        continue;
                    var poly = this.P[i], t = tangent_PointPolyC(p, poly);
                    this.addEdgeIfVisible(p, poly[t.ltan], i1, i);
                    this.addEdgeIfVisible(p, poly[t.rtan], i1, i);
                }
                return p.vv;
            };
            TangentVisibilityGraph.prototype.intersectsPolys = function (l, i1, i2) {
                for (var i = 0, n = this.P.length; i < n; ++i) {
                    if (i != i1 && i != i2 && intersects(l, this.P[i]).length > 0) {
                        return true;
                    }
                }
                return false;
            };
            return TangentVisibilityGraph;
        }());
        geom.TangentVisibilityGraph = TangentVisibilityGraph;
        function intersects(l, P) {
            var ints = [];
            for (var i = 1, n = P.length; i < n; ++i) {
                var int = cola.vpsc.Rectangle.lineIntersection(l.x1, l.y1, l.x2, l.y2, P[i - 1].x, P[i - 1].y, P[i].x, P[i].y);
                if (int)
                    ints.push(int);
            }
            return ints;
        }
        function tangents(V, W) {
            var m = V.length - 1, n = W.length - 1;
            var bt = new BiTangents();
            for (var i = 0; i < m; ++i) {
                for (var j = 0; j < n; ++j) {
                    var v1 = V[i == 0 ? m - 1 : i - 1];
                    var v2 = V[i];
                    var v3 = V[i + 1];
                    var w1 = W[j == 0 ? n - 1 : j - 1];
                    var w2 = W[j];
                    var w3 = W[j + 1];
                    var v1v2w2 = isLeft(v1, v2, w2);
                    var v2w1w2 = isLeft(v2, w1, w2);
                    var v2w2w3 = isLeft(v2, w2, w3);
                    var w1w2v2 = isLeft(w1, w2, v2);
                    var w2v1v2 = isLeft(w2, v1, v2);
                    var w2v2v3 = isLeft(w2, v2, v3);
                    if (v1v2w2 >= 0 && v2w1w2 >= 0 && v2w2w3 < 0
                        && w1w2v2 >= 0 && w2v1v2 >= 0 && w2v2v3 < 0) {
                        bt.ll = new BiTangent(i, j);
                    }
                    else if (v1v2w2 <= 0 && v2w1w2 <= 0 && v2w2w3 > 0
                        && w1w2v2 <= 0 && w2v1v2 <= 0 && w2v2v3 > 0) {
                        bt.rr = new BiTangent(i, j);
                    }
                    else if (v1v2w2 <= 0 && v2w1w2 > 0 && v2w2w3 <= 0
                        && w1w2v2 >= 0 && w2v1v2 < 0 && w2v2v3 >= 0) {
                        bt.rl = new BiTangent(i, j);
                    }
                    else if (v1v2w2 >= 0 && v2w1w2 < 0 && v2w2w3 >= 0
                        && w1w2v2 <= 0 && w2v1v2 > 0 && w2v2v3 <= 0) {
                        bt.lr = new BiTangent(i, j);
                    }
                }
            }
            return bt;
        }
        geom.tangents = tangents;
        function isPointInsidePoly(p, poly) {
            for (var i = 1, n = poly.length; i < n; ++i)
                if (below(poly[i - 1], poly[i], p))
                    return false;
            return true;
        }
        function isAnyPInQ(p, q) {
            return !p.every(function (v) { return !isPointInsidePoly(v, q); });
        }
        function polysOverlap(p, q) {
            if (isAnyPInQ(p, q))
                return true;
            if (isAnyPInQ(q, p))
                return true;
            for (var i = 1, n = p.length; i < n; ++i) {
                var v = p[i], u = p[i - 1];
                if (intersects(new LineSegment(u.x, u.y, v.x, v.y), q).length > 0)
                    return true;
            }
            return false;
        }
        geom.polysOverlap = polysOverlap;
    })(geom = cola.geom || (cola.geom = {}));
})(cola || (cola = {}));
var cola;
(function (cola) {
    var Locks = (function () {
        function Locks() {
            this.locks = {};
        }
        Locks.prototype.add = function (id, x) {
            if (isNaN(x[0]) || isNaN(x[1]))
                debugger;
            this.locks[id] = x;
        };
        Locks.prototype.clear = function () {
            this.locks = {};
        };
        Locks.prototype.isEmpty = function () {
            for (var l in this.locks)
                return false;
            return true;
        };
        Locks.prototype.apply = function (f) {
            for (var l in this.locks) {
                f(l, this.locks[l]);
            }
        };
        return Locks;
    }());
    cola.Locks = Locks;
    var Descent = (function () {
        function Descent(x, D, G) {
            if (G === void 0) { G = null; }
            this.D = D;
            this.G = G;
            this.threshold = 0.0001;
            this.numGridSnapNodes = 0;
            this.snapGridSize = 100;
            this.snapStrength = 1000;
            this.scaleSnapByMaxH = false;
            this.random = new PseudoRandom();
            this.project = null;
            this.x = x;
            this.k = x.length;
            var n = this.n = x[0].length;
            this.H = new Array(this.k);
            this.g = new Array(this.k);
            this.Hd = new Array(this.k);
            this.a = new Array(this.k);
            this.b = new Array(this.k);
            this.c = new Array(this.k);
            this.d = new Array(this.k);
            this.e = new Array(this.k);
            this.ia = new Array(this.k);
            this.ib = new Array(this.k);
            this.xtmp = new Array(this.k);
            this.locks = new Locks();
            this.minD = Number.MAX_VALUE;
            var i = n, j;
            while (i--) {
                j = n;
                while (--j > i) {
                    var d = D[i][j];
                    if (d > 0 && d < this.minD) {
                        this.minD = d;
                    }
                }
            }
            if (this.minD === Number.MAX_VALUE)
                this.minD = 1;
            i = this.k;
            while (i--) {
                this.g[i] = new Array(n);
                this.H[i] = new Array(n);
                j = n;
                while (j--) {
                    this.H[i][j] = new Array(n);
                }
                this.Hd[i] = new Array(n);
                this.a[i] = new Array(n);
                this.b[i] = new Array(n);
                this.c[i] = new Array(n);
                this.d[i] = new Array(n);
                this.e[i] = new Array(n);
                this.ia[i] = new Array(n);
                this.ib[i] = new Array(n);
                this.xtmp[i] = new Array(n);
            }
        }
        Descent.createSquareMatrix = function (n, f) {
            var M = new Array(n);
            for (var i = 0; i < n; ++i) {
                M[i] = new Array(n);
                for (var j = 0; j < n; ++j) {
                    M[i][j] = f(i, j);
                }
            }
            return M;
        };
        Descent.prototype.offsetDir = function () {
            var _this = this;
            var u = new Array(this.k);
            var l = 0;
            for (var i = 0; i < this.k; ++i) {
                var x = u[i] = this.random.getNextBetween(0.01, 1) - 0.5;
                l += x * x;
            }
            l = Math.sqrt(l);
            return u.map(function (x) { return x *= _this.minD / l; });
        };
        Descent.prototype.computeDerivatives = function (x) {
            var _this = this;
            var n = this.n;
            if (n < 1)
                return;
            var i;
            var d = new Array(this.k);
            var d2 = new Array(this.k);
            var Huu = new Array(this.k);
            var maxH = 0;
            for (var u = 0; u < n; ++u) {
                for (i = 0; i < this.k; ++i)
                    Huu[i] = this.g[i][u] = 0;
                for (var v = 0; v < n; ++v) {
                    if (u === v)
                        continue;
                    var maxDisplaces = n;
                    while (maxDisplaces--) {
                        var sd2 = 0;
                        for (i = 0; i < this.k; ++i) {
                            var dx = d[i] = x[i][u] - x[i][v];
                            sd2 += d2[i] = dx * dx;
                        }
                        if (sd2 > 1e-9)
                            break;
                        var rd = this.offsetDir();
                        for (i = 0; i < this.k; ++i)
                            x[i][v] += rd[i];
                    }
                    var l = Math.sqrt(sd2);
                    var D = this.D[u][v];
                    var weight = this.G != null ? this.G[u][v] : 1;
                    if (weight > 1 && l > D || !isFinite(D)) {
                        for (i = 0; i < this.k; ++i)
                            this.H[i][u][v] = 0;
                        continue;
                    }
                    if (weight > 1) {
                        weight = 1;
                    }
                    var D2 = D * D;
                    var gs = weight * (l - D) / (D2 * l);
                    var hs = -weight / (D2 * l * l * l);
                    if (!isFinite(gs))
                        console.log(gs);
                    for (i = 0; i < this.k; ++i) {
                        this.g[i][u] += d[i] * gs;
                        Huu[i] -= this.H[i][u][v] = hs * (D * (d2[i] - sd2) + l * sd2);
                    }
                }
                for (i = 0; i < this.k; ++i)
                    maxH = Math.max(maxH, this.H[i][u][u] = Huu[i]);
            }
            var r = this.snapGridSize / 2;
            var g = this.snapGridSize;
            var w = this.snapStrength;
            var k = w / (r * r);
            var numNodes = this.numGridSnapNodes;
            for (var u = 0; u < numNodes; ++u) {
                for (i = 0; i < this.k; ++i) {
                    var xiu = this.x[i][u];
                    var m = xiu / g;
                    var f = m % 1;
                    var q = m - f;
                    var a = Math.abs(f);
                    var dx = (a <= 0.5) ? xiu - q * g :
                        (xiu > 0) ? xiu - (q + 1) * g : xiu - (q - 1) * g;
                    if (-r < dx && dx <= r) {
                        if (this.scaleSnapByMaxH) {
                            this.g[i][u] += maxH * k * dx;
                            this.H[i][u][u] += maxH * k;
                        }
                        else {
                            this.g[i][u] += k * dx;
                            this.H[i][u][u] += k;
                        }
                    }
                }
            }
            if (!this.locks.isEmpty()) {
                this.locks.apply(function (u, p) {
                    for (i = 0; i < _this.k; ++i) {
                        _this.H[i][u][u] += maxH;
                        _this.g[i][u] -= maxH * (p[i] - x[i][u]);
                    }
                });
            }
        };
        Descent.dotProd = function (a, b) {
            var x = 0, i = a.length;
            while (i--)
                x += a[i] * b[i];
            return x;
        };
        Descent.rightMultiply = function (m, v, r) {
            var i = m.length;
            while (i--)
                r[i] = Descent.dotProd(m[i], v);
        };
        Descent.prototype.computeStepSize = function (d) {
            var numerator = 0, denominator = 0;
            for (var i = 0; i < 2; ++i) {
                numerator += Descent.dotProd(this.g[i], d[i]);
                Descent.rightMultiply(this.H[i], d[i], this.Hd[i]);
                denominator += Descent.dotProd(d[i], this.Hd[i]);
            }
            if (denominator === 0 || !isFinite(denominator))
                return 0;
            return numerator / denominator;
        };
        Descent.prototype.reduceStress = function () {
            this.computeDerivatives(this.x);
            var alpha = this.computeStepSize(this.g);
            for (var i = 0; i < this.k; ++i) {
                this.takeDescentStep(this.x[i], this.g[i], alpha);
            }
            return this.computeStress();
        };
        Descent.copy = function (a, b) {
            var m = a.length, n = b[0].length;
            for (var i = 0; i < m; ++i) {
                for (var j = 0; j < n; ++j) {
                    b[i][j] = a[i][j];
                }
            }
        };
        Descent.prototype.stepAndProject = function (x0, r, d, stepSize) {
            Descent.copy(x0, r);
            this.takeDescentStep(r[0], d[0], stepSize);
            if (this.project)
                this.project[0](x0[0], x0[1], r[0]);
            this.takeDescentStep(r[1], d[1], stepSize);
            if (this.project)
                this.project[1](r[0], x0[1], r[1]);
        };
        Descent.mApply = function (m, n, f) {
            var i = m;
            while (i-- > 0) {
                var j = n;
                while (j-- > 0)
                    f(i, j);
            }
        };
        Descent.prototype.matrixApply = function (f) {
            Descent.mApply(this.k, this.n, f);
        };
        Descent.prototype.computeNextPosition = function (x0, r) {
            var _this = this;
            this.computeDerivatives(x0);
            var alpha = this.computeStepSize(this.g);
            this.stepAndProject(x0, r, this.g, alpha);
            for (var u = 0; u < this.n; ++u)
                for (var i = 0; i < this.k; ++i)
                    if (isNaN(r[i][u]))
                        debugger;
            if (this.project) {
                this.matrixApply(function (i, j) { return _this.e[i][j] = x0[i][j] - r[i][j]; });
                var beta = this.computeStepSize(this.e);
                beta = Math.max(0.2, Math.min(beta, 1));
                this.stepAndProject(x0, r, this.e, beta);
            }
        };
        Descent.prototype.run = function (iterations) {
            var stress = Number.MAX_VALUE, converged = false;
            while (!converged && iterations-- > 0) {
                var s = this.rungeKutta();
                converged = Math.abs(stress / s - 1) < this.threshold;
                stress = s;
            }
            return stress;
        };
        Descent.prototype.rungeKutta = function () {
            var _this = this;
            this.computeNextPosition(this.x, this.a);
            Descent.mid(this.x, this.a, this.ia);
            this.computeNextPosition(this.ia, this.b);
            Descent.mid(this.x, this.b, this.ib);
            this.computeNextPosition(this.ib, this.c);
            this.computeNextPosition(this.c, this.d);
            var disp = 0;
            this.matrixApply(function (i, j) {
                var x = (_this.a[i][j] + 2.0 * _this.b[i][j] + 2.0 * _this.c[i][j] + _this.d[i][j]) / 6.0, d = _this.x[i][j] - x;
                disp += d * d;
                _this.x[i][j] = x;
            });
            return disp;
        };
        Descent.mid = function (a, b, m) {
            Descent.mApply(a.length, a[0].length, function (i, j) {
                return m[i][j] = a[i][j] + (b[i][j] - a[i][j]) / 2.0;
            });
        };
        Descent.prototype.takeDescentStep = function (x, d, stepSize) {
            for (var i = 0; i < this.n; ++i) {
                x[i] = x[i] - stepSize * d[i];
            }
        };
        Descent.prototype.computeStress = function () {
            var stress = 0;
            for (var u = 0, nMinus1 = this.n - 1; u < nMinus1; ++u) {
                for (var v = u + 1, n = this.n; v < n; ++v) {
                    var l = 0;
                    for (var i = 0; i < this.k; ++i) {
                        var dx = this.x[i][u] - this.x[i][v];
                        l += dx * dx;
                    }
                    l = Math.sqrt(l);
                    var d = this.D[u][v];
                    if (!isFinite(d))
                        continue;
                    var rl = d - l;
                    var d2 = d * d;
                    stress += rl * rl / d2;
                }
            }
            return stress;
        };
        Descent.zeroDistance = 1e-10;
        return Descent;
    }());
    cola.Descent = Descent;
    var PseudoRandom = (function () {
        function PseudoRandom(seed) {
            if (seed === void 0) { seed = 1; }
            this.seed = seed;
            this.a = 214013;
            this.c = 2531011;
            this.m = 2147483648;
            this.range = 32767;
        }
        PseudoRandom.prototype.getNext = function () {
            this.seed = (this.seed * this.a + this.c) % this.m;
            return (this.seed >> 16) / this.range;
        };
        PseudoRandom.prototype.getNextBetween = function (min, max) {
            return min + this.getNext() * (max - min);
        };
        return PseudoRandom;
    }());
    cola.PseudoRandom = PseudoRandom;
})(cola || (cola = {}));
var cola;
(function (cola) {
    var powergraph;
    (function (powergraph) {
        var PowerEdge = (function () {
            function PowerEdge(source, target, type) {
                this.source = source;
                this.target = target;
                this.type = type;
            }
            return PowerEdge;
        }());
        powergraph.PowerEdge = PowerEdge;
        var Configuration = (function () {
            function Configuration(n, edges, linkAccessor, rootGroup) {
                var _this = this;
                this.linkAccessor = linkAccessor;
                this.modules = new Array(n);
                this.roots = [];
                if (rootGroup) {
                    this.initModulesFromGroup(rootGroup);
                }
                else {
                    this.roots.push(new ModuleSet());
                    for (var i = 0; i < n; ++i)
                        this.roots[0].add(this.modules[i] = new Module(i));
                }
                this.R = edges.length;
                edges.forEach(function (e) {
                    var s = _this.modules[linkAccessor.getSourceIndex(e)], t = _this.modules[linkAccessor.getTargetIndex(e)], type = linkAccessor.getType(e);
                    s.outgoing.add(type, t);
                    t.incoming.add(type, s);
                });
            }
            Configuration.prototype.initModulesFromGroup = function (group) {
                var moduleSet = new ModuleSet();
                this.roots.push(moduleSet);
                for (var i = 0; i < group.leaves.length; ++i) {
                    var node = group.leaves[i];
                    var module = new Module(node.id);
                    this.modules[node.id] = module;
                    moduleSet.add(module);
                }
                if (group.groups) {
                    for (var j = 0; j < group.groups.length; ++j) {
                        var child = group.groups[j];
                        var definition = {};
                        for (var prop in child)
                            if (prop !== "leaves" && prop !== "groups" && child.hasOwnProperty(prop))
                                definition[prop] = child[prop];
                        moduleSet.add(new Module(-1 - j, new LinkSets(), new LinkSets(), this.initModulesFromGroup(child), definition));
                    }
                }
                return moduleSet;
            };
            Configuration.prototype.merge = function (a, b, k) {
                if (k === void 0) { k = 0; }
                var inInt = a.incoming.intersection(b.incoming), outInt = a.outgoing.intersection(b.outgoing);
                var children = new ModuleSet();
                children.add(a);
                children.add(b);
                var m = new Module(this.modules.length, outInt, inInt, children);
                this.modules.push(m);
                var update = function (s, i, o) {
                    s.forAll(function (ms, linktype) {
                        ms.forAll(function (n) {
                            var nls = n[i];
                            nls.add(linktype, m);
                            nls.remove(linktype, a);
                            nls.remove(linktype, b);
                            a[o].remove(linktype, n);
                            b[o].remove(linktype, n);
                        });
                    });
                };
                update(outInt, "incoming", "outgoing");
                update(inInt, "outgoing", "incoming");
                this.R -= inInt.count() + outInt.count();
                this.roots[k].remove(a);
                this.roots[k].remove(b);
                this.roots[k].add(m);
                return m;
            };
            Configuration.prototype.rootMerges = function (k) {
                if (k === void 0) { k = 0; }
                var rs = this.roots[k].modules();
                var n = rs.length;
                var merges = new Array(n * (n - 1));
                var ctr = 0;
                for (var i = 0, i_ = n - 1; i < i_; ++i) {
                    for (var j = i + 1; j < n; ++j) {
                        var a = rs[i], b = rs[j];
                        merges[ctr++] = { nEdges: this.nEdges(a, b), a: a, b: b };
                    }
                }
                return merges;
            };
            Configuration.prototype.greedyMerge = function () {
                for (var i = 0; i < this.roots.length; ++i) {
                    if (this.roots[i].modules().length < 2)
                        continue;
                    var ms = this.rootMerges(i).sort(function (a, b) { return a.nEdges - b.nEdges; });
                    var m = ms[0];
                    if (m.nEdges >= this.R)
                        continue;
                    this.merge(m.a, m.b, i);
                    return true;
                }
            };
            Configuration.prototype.nEdges = function (a, b) {
                var inInt = a.incoming.intersection(b.incoming), outInt = a.outgoing.intersection(b.outgoing);
                return this.R - inInt.count() - outInt.count();
            };
            Configuration.prototype.getGroupHierarchy = function (retargetedEdges) {
                var _this = this;
                var groups = [];
                var root = {};
                toGroups(this.roots[0], root, groups);
                var es = this.allEdges();
                es.forEach(function (e) {
                    var a = _this.modules[e.source];
                    var b = _this.modules[e.target];
                    retargetedEdges.push(new PowerEdge(typeof a.gid === "undefined" ? e.source : groups[a.gid], typeof b.gid === "undefined" ? e.target : groups[b.gid], e.type));
                });
                return groups;
            };
            Configuration.prototype.allEdges = function () {
                var es = [];
                Configuration.getEdges(this.roots[0], es);
                return es;
            };
            Configuration.getEdges = function (modules, es) {
                modules.forAll(function (m) {
                    m.getEdges(es);
                    Configuration.getEdges(m.children, es);
                });
            };
            return Configuration;
        }());
        powergraph.Configuration = Configuration;
        function toGroups(modules, group, groups) {
            modules.forAll(function (m) {
                if (m.isLeaf()) {
                    if (!group.leaves)
                        group.leaves = [];
                    group.leaves.push(m.id);
                }
                else {
                    var g = group;
                    m.gid = groups.length;
                    if (!m.isIsland() || m.isPredefined()) {
                        g = { id: m.gid };
                        if (m.isPredefined())
                            for (var prop in m.definition)
                                g[prop] = m.definition[prop];
                        if (!group.groups)
                            group.groups = [];
                        group.groups.push(m.gid);
                        groups.push(g);
                    }
                    toGroups(m.children, g, groups);
                }
            });
        }
        var Module = (function () {
            function Module(id, outgoing, incoming, children, definition) {
                if (outgoing === void 0) { outgoing = new LinkSets(); }
                if (incoming === void 0) { incoming = new LinkSets(); }
                if (children === void 0) { children = new ModuleSet(); }
                this.id = id;
                this.outgoing = outgoing;
                this.incoming = incoming;
                this.children = children;
                this.definition = definition;
            }
            Module.prototype.getEdges = function (es) {
                var _this = this;
                this.outgoing.forAll(function (ms, edgetype) {
                    ms.forAll(function (target) {
                        es.push(new PowerEdge(_this.id, target.id, edgetype));
                    });
                });
            };
            Module.prototype.isLeaf = function () {
                return this.children.count() === 0;
            };
            Module.prototype.isIsland = function () {
                return this.outgoing.count() === 0 && this.incoming.count() === 0;
            };
            Module.prototype.isPredefined = function () {
                return typeof this.definition !== "undefined";
            };
            return Module;
        }());
        powergraph.Module = Module;
        function intersection(m, n) {
            var i = {};
            for (var v in m)
                if (v in n)
                    i[v] = m[v];
            return i;
        }
        var ModuleSet = (function () {
            function ModuleSet() {
                this.table = {};
            }
            ModuleSet.prototype.count = function () {
                return Object.keys(this.table).length;
            };
            ModuleSet.prototype.intersection = function (other) {
                var result = new ModuleSet();
                result.table = intersection(this.table, other.table);
                return result;
            };
            ModuleSet.prototype.intersectionCount = function (other) {
                return this.intersection(other).count();
            };
            ModuleSet.prototype.contains = function (id) {
                return id in this.table;
            };
            ModuleSet.prototype.add = function (m) {
                this.table[m.id] = m;
            };
            ModuleSet.prototype.remove = function (m) {
                delete this.table[m.id];
            };
            ModuleSet.prototype.forAll = function (f) {
                for (var mid in this.table) {
                    f(this.table[mid]);
                }
            };
            ModuleSet.prototype.modules = function () {
                var vs = [];
                this.forAll(function (m) {
                    if (!m.isPredefined())
                        vs.push(m);
                });
                return vs;
            };
            return ModuleSet;
        }());
        powergraph.ModuleSet = ModuleSet;
        var LinkSets = (function () {
            function LinkSets() {
                this.sets = {};
                this.n = 0;
            }
            LinkSets.prototype.count = function () {
                return this.n;
            };
            LinkSets.prototype.contains = function (id) {
                var result = false;
                this.forAllModules(function (m) {
                    if (!result && m.id == id) {
                        result = true;
                    }
                });
                return result;
            };
            LinkSets.prototype.add = function (linktype, m) {
                var s = linktype in this.sets ? this.sets[linktype] : this.sets[linktype] = new ModuleSet();
                s.add(m);
                ++this.n;
            };
            LinkSets.prototype.remove = function (linktype, m) {
                var ms = this.sets[linktype];
                ms.remove(m);
                if (ms.count() === 0) {
                    delete this.sets[linktype];
                }
                --this.n;
            };
            LinkSets.prototype.forAll = function (f) {
                for (var linktype in this.sets) {
                    f(this.sets[linktype], linktype);
                }
            };
            LinkSets.prototype.forAllModules = function (f) {
                this.forAll(function (ms, lt) { return ms.forAll(f); });
            };
            LinkSets.prototype.intersection = function (other) {
                var result = new LinkSets();
                this.forAll(function (ms, lt) {
                    if (lt in other.sets) {
                        var i = ms.intersection(other.sets[lt]), n = i.count();
                        if (n > 0) {
                            result.sets[lt] = i;
                            result.n += n;
                        }
                    }
                });
                return result;
            };
            return LinkSets;
        }());
        powergraph.LinkSets = LinkSets;
        function intersectionCount(m, n) {
            return Object.keys(intersection(m, n)).length;
        }
        function getGroups(nodes, links, la, rootGroup) {
            var n = nodes.length, c = new powergraph.Configuration(n, links, la, rootGroup);
            while (c.greedyMerge())
                ;
            var powerEdges = [];
            var g = c.getGroupHierarchy(powerEdges);
            powerEdges.forEach(function (e) {
                var f = function (end) {
                    var g = e[end];
                    if (typeof g == "number")
                        e[end] = nodes[g];
                };
                f("source");
                f("target");
            });
            return { groups: g, powerEdges: powerEdges };
        }
        powergraph.getGroups = getGroups;
    })(powergraph = cola.powergraph || (cola.powergraph = {}));
})(cola || (cola = {}));
var cola;
(function (cola) {
    function unionCount(a, b) {
        var u = {};
        for (var i in a)
            u[i] = {};
        for (var i in b)
            u[i] = {};
        return Object.keys(u).length;
    }
    function intersectionCount(a, b) {
        var n = 0;
        for (var i in a)
            if (typeof b[i] !== 'undefined')
                ++n;
        return n;
    }
    function getNeighbours(links, la) {
        var neighbours = {};
        var addNeighbours = function (u, v) {
            if (typeof neighbours[u] === 'undefined')
                neighbours[u] = {};
            neighbours[u][v] = {};
        };
        links.forEach(function (e) {
            var u = la.getSourceIndex(e), v = la.getTargetIndex(e);
            addNeighbours(u, v);
            addNeighbours(v, u);
        });
        return neighbours;
    }
    function computeLinkLengths(links, w, f, la) {
        var neighbours = getNeighbours(links, la);
        links.forEach(function (l) {
            var a = neighbours[la.getSourceIndex(l)];
            var b = neighbours[la.getTargetIndex(l)];
            la.setLength(l, 1 + w * f(a, b));
        });
    }
    function symmetricDiffLinkLengths(links, la, w) {
        if (w === void 0) { w = 1; }
        computeLinkLengths(links, w, function (a, b) { return Math.sqrt(unionCount(a, b) - intersectionCount(a, b)); }, la);
    }
    cola.symmetricDiffLinkLengths = symmetricDiffLinkLengths;
    function jaccardLinkLengths(links, la, w) {
        if (w === void 0) { w = 1; }
        computeLinkLengths(links, w, function (a, b) {
            return Math.min(Object.keys(a).length, Object.keys(b).length) < 1.1 ? 0 : intersectionCount(a, b) / unionCount(a, b);
        }, la);
    }
    cola.jaccardLinkLengths = jaccardLinkLengths;
    function generateDirectedEdgeConstraints(n, links, axis, la) {
        var components = stronglyConnectedComponents(n, links, la);
        var nodes = {};
        components.filter(function (c) { return c.length > 1; }).forEach(function (c) {
            return c.forEach(function (v) { return nodes[v] = c; });
        });
        var constraints = [];
        links.forEach(function (l) {
            var ui = la.getSourceIndex(l), vi = la.getTargetIndex(l), u = nodes[ui], v = nodes[vi];
            if (!u || !v || u.component !== v.component) {
                constraints.push({
                    axis: axis,
                    left: ui,
                    right: vi,
                    gap: la.getMinSeparation(l)
                });
            }
        });
        return constraints;
    }
    cola.generateDirectedEdgeConstraints = generateDirectedEdgeConstraints;
    function stronglyConnectedComponents(numVertices, edges, la) {
        var adjList = new Array(numVertices);
        var index = new Array(numVertices);
        var lowValue = new Array(numVertices);
        var active = new Array(numVertices);
        for (var i = 0; i < numVertices; ++i) {
            adjList[i] = [];
            index[i] = -1;
            lowValue[i] = 0;
            active[i] = false;
        }
        for (var i = 0; i < edges.length; ++i) {
            adjList[la.getSourceIndex(edges[i])].push(la.getTargetIndex(edges[i]));
        }
        var count = 0;
        var S = [];
        var components = [];
        function strongConnect(v) {
            index[v] = count;
            lowValue[v] = count;
            active[v] = true;
            count += 1;
            S.push(v);
            var e = adjList[v];
            for (var i = 0; i < e.length; ++i) {
                var u = e[i];
                if (index[u] < 0) {
                    strongConnect(u);
                    lowValue[v] = Math.min(lowValue[v], lowValue[u]) | 0;
                }
                else if (active[u]) {
                    lowValue[v] = Math.min(lowValue[v], lowValue[u]);
                }
            }
            if (lowValue[v] === index[v]) {
                var component = [];
                for (var i = S.length - 1; i >= 0; --i) {
                    var w = S[i];
                    active[w] = false;
                    component.push(w);
                    if (w === v) {
                        S.length = i;
                        break;
                    }
                }
                components.push(component);
            }
        }
        for (var i = 0; i < numVertices; ++i) {
            if (index[i] < 0) {
                strongConnect(i);
            }
        }
        return components;
    }
})(cola || (cola = {}));
var PairingHeap = (function () {
    function PairingHeap(elem) {
        this.elem = elem;
        this.subheaps = [];
    }
    PairingHeap.prototype.toString = function (selector) {
        var str = "", needComma = false;
        for (var i = 0; i < this.subheaps.length; ++i) {
            var subheap = this.subheaps[i];
            if (!subheap.elem) {
                needComma = false;
                continue;
            }
            if (needComma) {
                str = str + ",";
            }
            str = str + subheap.toString(selector);
            needComma = true;
        }
        if (str !== "") {
            str = "(" + str + ")";
        }
        return (this.elem ? selector(this.elem) : "") + str;
    };
    PairingHeap.prototype.forEach = function (f) {
        if (!this.empty()) {
            f(this.elem, this);
            this.subheaps.forEach(function (s) { return s.forEach(f); });
        }
    };
    PairingHeap.prototype.count = function () {
        return this.empty() ? 0 : 1 + this.subheaps.reduce(function (n, h) {
            return n + h.count();
        }, 0);
    };
    PairingHeap.prototype.min = function () {
        return this.elem;
    };
    PairingHeap.prototype.empty = function () {
        return this.elem == null;
    };
    PairingHeap.prototype.contains = function (h) {
        if (this === h)
            return true;
        for (var i = 0; i < this.subheaps.length; i++) {
            if (this.subheaps[i].contains(h))
                return true;
        }
        return false;
    };
    PairingHeap.prototype.isHeap = function (lessThan) {
        var _this = this;
        return this.subheaps.every(function (h) { return lessThan(_this.elem, h.elem) && h.isHeap(lessThan); });
    };
    PairingHeap.prototype.insert = function (obj, lessThan) {
        return this.merge(new PairingHeap(obj), lessThan);
    };
    PairingHeap.prototype.merge = function (heap2, lessThan) {
        if (this.empty())
            return heap2;
        else if (heap2.empty())
            return this;
        else if (lessThan(this.elem, heap2.elem)) {
            this.subheaps.push(heap2);
            return this;
        }
        else {
            heap2.subheaps.push(this);
            return heap2;
        }
    };
    PairingHeap.prototype.removeMin = function (lessThan) {
        if (this.empty())
            return null;
        else
            return this.mergePairs(lessThan);
    };
    PairingHeap.prototype.mergePairs = function (lessThan) {
        if (this.subheaps.length == 0)
            return new PairingHeap(null);
        else if (this.subheaps.length == 1) {
            return this.subheaps[0];
        }
        else {
            var firstPair = this.subheaps.pop().merge(this.subheaps.pop(), lessThan);
            var remaining = this.mergePairs(lessThan);
            return firstPair.merge(remaining, lessThan);
        }
    };
    PairingHeap.prototype.decreaseKey = function (subheap, newValue, setHeapNode, lessThan) {
        var newHeap = subheap.removeMin(lessThan);
        subheap.elem = newHeap.elem;
        subheap.subheaps = newHeap.subheaps;
        if (setHeapNode !== null && newHeap.elem !== null) {
            setHeapNode(subheap.elem, subheap);
        }
        var pairingNode = new PairingHeap(newValue);
        if (setHeapNode !== null) {
            setHeapNode(newValue, pairingNode);
        }
        return this.merge(pairingNode, lessThan);
    };
    return PairingHeap;
}());
var PriorityQueue = (function () {
    function PriorityQueue(lessThan) {
        this.lessThan = lessThan;
    }
    PriorityQueue.prototype.top = function () {
        if (this.empty()) {
            return null;
        }
        return this.root.elem;
    };
    PriorityQueue.prototype.push = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        var pairingNode;
        for (var i = 0, arg; arg = args[i]; ++i) {
            pairingNode = new PairingHeap(arg);
            this.root = this.empty() ?
                pairingNode : this.root.merge(pairingNode, this.lessThan);
        }
        return pairingNode;
    };
    PriorityQueue.prototype.empty = function () {
        return !this.root || !this.root.elem;
    };
    PriorityQueue.prototype.isHeap = function () {
        return this.root.isHeap(this.lessThan);
    };
    PriorityQueue.prototype.forEach = function (f) {
        this.root.forEach(f);
    };
    PriorityQueue.prototype.pop = function () {
        if (this.empty()) {
            return null;
        }
        var obj = this.root.min();
        this.root = this.root.removeMin(this.lessThan);
        return obj;
    };
    PriorityQueue.prototype.reduceKey = function (heapNode, newKey, setHeapNode) {
        if (setHeapNode === void 0) { setHeapNode = null; }
        this.root = this.root.decreaseKey(heapNode, newKey, setHeapNode, this.lessThan);
    };
    PriorityQueue.prototype.toString = function (selector) {
        return this.root.toString(selector);
    };
    PriorityQueue.prototype.count = function () {
        return this.root.count();
    };
    return PriorityQueue;
}());
var cola;
(function (cola) {
    var shortestpaths;
    (function (shortestpaths) {
        var Neighbour = (function () {
            function Neighbour(id, distance) {
                this.id = id;
                this.distance = distance;
            }
            return Neighbour;
        }());
        var Node = (function () {
            function Node(id) {
                this.id = id;
                this.neighbours = [];
            }
            return Node;
        }());
        var QueueEntry = (function () {
            function QueueEntry(node, prev, d) {
                this.node = node;
                this.prev = prev;
                this.d = d;
            }
            return QueueEntry;
        }());
        var Calculator = (function () {
            function Calculator(n, es, getSourceIndex, getTargetIndex, getLength) {
                this.n = n;
                this.es = es;
                this.neighbours = new Array(this.n);
                var i = this.n;
                while (i--)
                    this.neighbours[i] = new Node(i);
                i = this.es.length;
                while (i--) {
                    var e = this.es[i];
                    var u = getSourceIndex(e), v = getTargetIndex(e);
                    var d = getLength(e);
                    this.neighbours[u].neighbours.push(new Neighbour(v, d));
                    this.neighbours[v].neighbours.push(new Neighbour(u, d));
                }
            }
            Calculator.prototype.DistanceMatrix = function () {
                var D = new Array(this.n);
                for (var i = 0; i < this.n; ++i) {
                    D[i] = this.dijkstraNeighbours(i);
                }
                return D;
            };
            Calculator.prototype.DistancesFromNode = function (start) {
                return this.dijkstraNeighbours(start);
            };
            Calculator.prototype.PathFromNodeToNode = function (start, end) {
                return this.dijkstraNeighbours(start, end);
            };
            Calculator.prototype.PathFromNodeToNodeWithPrevCost = function (start, end, prevCost) {
                var q = new PriorityQueue(function (a, b) { return a.d <= b.d; }), u = this.neighbours[start], qu = new QueueEntry(u, null, 0), visitedFrom = {};
                q.push(qu);
                while (!q.empty()) {
                    qu = q.pop();
                    u = qu.node;
                    if (u.id === end) {
                        break;
                    }
                    var i = u.neighbours.length;
                    while (i--) {
                        var neighbour = u.neighbours[i], v = this.neighbours[neighbour.id];
                        if (qu.prev && v.id === qu.prev.node.id)
                            continue;
                        var viduid = v.id + ',' + u.id;
                        if (viduid in visitedFrom && visitedFrom[viduid] <= qu.d)
                            continue;
                        var cc = qu.prev ? prevCost(qu.prev.node.id, u.id, v.id) : 0, t = qu.d + neighbour.distance + cc;
                        visitedFrom[viduid] = t;
                        q.push(new QueueEntry(v, qu, t));
                    }
                }
                var path = [];
                while (qu.prev) {
                    qu = qu.prev;
                    path.push(qu.node.id);
                }
                return path;
            };
            Calculator.prototype.dijkstraNeighbours = function (start, dest) {
                if (dest === void 0) { dest = -1; }
                var q = new PriorityQueue(function (a, b) { return a.d <= b.d; }), i = this.neighbours.length, d = new Array(i);
                while (i--) {
                    var node = this.neighbours[i];
                    node.d = i === start ? 0 : Number.POSITIVE_INFINITY;
                    node.q = q.push(node);
                }
                while (!q.empty()) {
                    var u = q.pop();
                    d[u.id] = u.d;
                    if (u.id === dest) {
                        var path = [];
                        var v = u;
                        while (typeof v.prev !== 'undefined') {
                            path.push(v.prev.id);
                            v = v.prev;
                        }
                        return path;
                    }
                    i = u.neighbours.length;
                    while (i--) {
                        var neighbour = u.neighbours[i];
                        var v = this.neighbours[neighbour.id];
                        var t = u.d + neighbour.distance;
                        if (u.d !== Number.MAX_VALUE && v.d > t) {
                            v.d = t;
                            v.prev = u;
                            q.reduceKey(v.q, v, function (e, q) { return e.q = q; });
                        }
                    }
                }
                return d;
            };
            return Calculator;
        }());
        shortestpaths.Calculator = Calculator;
    })(shortestpaths = cola.shortestpaths || (cola.shortestpaths = {}));
})(cola || (cola = {}));
var cola;
(function (cola) {
    (function (EventType) {
        EventType[EventType["start"] = 0] = "start";
        EventType[EventType["tick"] = 1] = "tick";
        EventType[EventType["end"] = 2] = "end";
    })(cola.EventType || (cola.EventType = {}));
    var EventType = cola.EventType;
    ;
    var Layout = (function () {
        function Layout() {
            this._canvasSize = [1, 1];
            this._linkDistance = 20;
            this._defaultNodeSize = 10;
            this._linkLengthCalculator = null;
            this._linkType = null;
            this._avoidOverlaps = false;
            this._handleDisconnected = true;
            this._running = false;
            this._nodes = [];
            this._groups = [];
            this._variables = [];
            this._rootGroup = null;
            this._links = [];
            this._constraints = [];
            this._distanceMatrix = null;
            this._descent = null;
            this._directedLinkConstraints = null;
            this._threshold = 0.01;
            this._visibilityGraph = null;
            this._groupCompactness = 1e-6;
            this.event = null;
            this.linkAccessor = { getSourceIndex: Layout.getSourceIndex, getTargetIndex: Layout.getTargetIndex, setLength: Layout.setLinkLength, getType: this.getLinkType };
        }
        Layout.prototype.on = function (e, listener) {
            if (!this.event)
                this.event = {};
            if (typeof e === 'string') {
                this.event[EventType[e]] = listener;
            }
            else {
                this.event[e] = listener;
            }
            return this;
        };
        Layout.prototype.trigger = function (e) {
            if (this.event && typeof this.event[e.type] !== 'undefined') {
                this.event[e.type](e);
            }
        };
        Layout.prototype.kick = function () {
            while (!this.tick())
                ;
        };
        Layout.prototype.tick = function () {
            if (this._alpha < this._threshold) {
                this._running = false;
                this.trigger({ type: EventType.end, alpha: this._alpha = 0, stress: this._lastStress });
                return true;
            }
            var n = this._nodes.length, m = this._links.length, o;
            this._descent.locks.clear();
            for (var i = 0; i < n; ++i) {
                o = this._nodes[i];
                if (o.fixed) {
                    if (typeof o.px === 'undefined' || typeof o.py === 'undefined') {
                        o.px = o.x;
                        o.py = o.y;
                    }
                    var p = [o.px, o.py];
                    this._descent.locks.add(i, p);
                }
            }
            var s1 = this._descent.rungeKutta();
            if (s1 === 0) {
                this._alpha = 0;
            }
            else if (typeof this._lastStress !== 'undefined') {
                this._alpha = s1;
            }
            this._lastStress = s1;
            for (var i = 0; i < n; ++i) {
                o = this._nodes[i];
                if (o.fixed) {
                    o.x = o.px;
                    o.y = o.py;
                }
                else {
                    o.x = this._descent.x[0][i];
                    o.y = this._descent.x[1][i];
                }
            }
            this.trigger({ type: EventType.tick, alpha: this._alpha, stress: this._lastStress });
            return false;
        };
        Layout.prototype.nodes = function (v) {
            if (!v) {
                if (this._nodes.length === 0 && this._links.length > 0) {
                    var n = 0;
                    this._links.forEach(function (l) {
                        n = Math.max(n, l.source, l.target);
                    });
                    this._nodes = new Array(++n);
                    for (var i = 0; i < n; ++i) {
                        this._nodes[i] = {};
                    }
                }
                return this._nodes;
            }
            this._nodes = v;
            return this;
        };
        Layout.prototype.groups = function (x) {
            var _this = this;
            if (!x)
                return this._groups;
            this._groups = x;
            this._rootGroup = {};
            this._groups.forEach(function (g) {
                if (typeof g.padding === "undefined")
                    g.padding = 1;
                if (typeof g.leaves !== "undefined")
                    g.leaves.forEach(function (v, i) { (g.leaves[i] = _this._nodes[v]).parent = g; });
                if (typeof g.groups !== "undefined")
                    g.groups.forEach(function (gi, i) { (g.groups[i] = _this._groups[gi]).parent = g; });
            });
            this._rootGroup.leaves = this._nodes.filter(function (v) { return typeof v.parent === 'undefined'; });
            this._rootGroup.groups = this._groups.filter(function (g) { return typeof g.parent === 'undefined'; });
            return this;
        };
        Layout.prototype.powerGraphGroups = function (f) {
            var g = cola.powergraph.getGroups(this._nodes, this._links, this.linkAccessor, this._rootGroup);
            this.groups(g.groups);
            f(g);
            return this;
        };
        Layout.prototype.avoidOverlaps = function (v) {
            if (!arguments.length)
                return this._avoidOverlaps;
            this._avoidOverlaps = v;
            return this;
        };
        Layout.prototype.handleDisconnected = function (v) {
            if (!arguments.length)
                return this._handleDisconnected;
            this._handleDisconnected = v;
            return this;
        };
        Layout.prototype.flowLayout = function (axis, minSeparation) {
            if (!arguments.length)
                axis = 'y';
            this._directedLinkConstraints = {
                axis: axis,
                getMinSeparation: typeof minSeparation === 'number' ? function () { return minSeparation; } : minSeparation
            };
            return this;
        };
        Layout.prototype.links = function (x) {
            if (!arguments.length)
                return this._links;
            this._links = x;
            return this;
        };
        Layout.prototype.constraints = function (c) {
            if (!arguments.length)
                return this._constraints;
            this._constraints = c;
            return this;
        };
        Layout.prototype.distanceMatrix = function (d) {
            if (!arguments.length)
                return this._distanceMatrix;
            this._distanceMatrix = d;
            return this;
        };
        Layout.prototype.size = function (x) {
            if (!x)
                return this._canvasSize;
            this._canvasSize = x;
            return this;
        };
        Layout.prototype.defaultNodeSize = function (x) {
            if (!x)
                return this._defaultNodeSize;
            this._defaultNodeSize = x;
            return this;
        };
        Layout.prototype.groupCompactness = function (x) {
            if (!x)
                return this._groupCompactness;
            this._groupCompactness = x;
            return this;
        };
        Layout.prototype.linkDistance = function (x) {
            if (!x) {
                return this._linkDistance;
            }
            this._linkDistance = typeof x === "function" ? x : +x;
            this._linkLengthCalculator = null;
            return this;
        };
        Layout.prototype.linkType = function (f) {
            this._linkType = f;
            return this;
        };
        Layout.prototype.convergenceThreshold = function (x) {
            if (!x)
                return this._threshold;
            this._threshold = typeof x === "function" ? x : +x;
            return this;
        };
        Layout.prototype.alpha = function (x) {
            if (!arguments.length)
                return this._alpha;
            else {
                x = +x;
                if (this._alpha) {
                    if (x > 0)
                        this._alpha = x;
                    else
                        this._alpha = 0;
                }
                else if (x > 0) {
                    if (!this._running) {
                        this._running = true;
                        this.trigger({ type: EventType.start, alpha: this._alpha = x });
                        this.kick();
                    }
                }
                return this;
            }
        };
        Layout.prototype.getLinkLength = function (link) {
            return typeof this._linkDistance === "function" ? +(this._linkDistance(link)) : this._linkDistance;
        };
        Layout.setLinkLength = function (link, length) {
            link.length = length;
        };
        Layout.prototype.getLinkType = function (link) {
            return typeof this._linkType === "function" ? this._linkType(link) : 0;
        };
        Layout.prototype.symmetricDiffLinkLengths = function (idealLength, w) {
            var _this = this;
            this.linkDistance(function (l) { return idealLength * l.length; });
            this._linkLengthCalculator = function () { return cola.symmetricDiffLinkLengths(_this._links, _this.linkAccessor, w); };
            return this;
        };
        Layout.prototype.jaccardLinkLengths = function (idealLength, w) {
            var _this = this;
            this.linkDistance(function (l) { return idealLength * l.length; });
            this._linkLengthCalculator = function () { return cola.jaccardLinkLengths(_this._links, _this.linkAccessor, w); };
            return this;
        };
        Layout.prototype.start = function (initialUnconstrainedIterations, initialUserConstraintIterations, initialAllConstraintsIterations, gridSnapIterations) {
            var _this = this;
            if (initialUnconstrainedIterations === void 0) { initialUnconstrainedIterations = 0; }
            if (initialUserConstraintIterations === void 0) { initialUserConstraintIterations = 0; }
            if (initialAllConstraintsIterations === void 0) { initialAllConstraintsIterations = 0; }
            if (gridSnapIterations === void 0) { gridSnapIterations = 0; }
            var i, j, n = this.nodes().length, N = n + 2 * this._groups.length, m = this._links.length, w = this._canvasSize[0], h = this._canvasSize[1];
            if (this._linkLengthCalculator)
                this._linkLengthCalculator();
            var x = new Array(N), y = new Array(N);
            this._variables = new Array(N);
            var makeVariable = function (i, w) { return _this._variables[i] = new cola.vpsc.IndexedVariable(i, w); };
            var G = null;
            var ao = this._avoidOverlaps;
            this._nodes.forEach(function (v, i) {
                v.index = i;
                if (typeof v.x === 'undefined') {
                    v.x = w / 2, v.y = h / 2;
                }
                x[i] = v.x, y[i] = v.y;
            });
            var distances;
            if (this._distanceMatrix) {
                distances = this._distanceMatrix;
            }
            else {
                distances = (new cola.shortestpaths.Calculator(N, this._links, Layout.getSourceIndex, Layout.getTargetIndex, function (l) { return _this.getLinkLength(l); })).DistanceMatrix();
                G = cola.Descent.createSquareMatrix(N, function () { return 2; });
                this._links.forEach(function (e) {
                    var u = Layout.getSourceIndex(e), v = Layout.getTargetIndex(e);
                    G[u][v] = G[v][u] = 1;
                });
            }
            var D = cola.Descent.createSquareMatrix(N, function (i, j) {
                return distances[i][j];
            });
            if (this._rootGroup && typeof this._rootGroup.groups !== 'undefined') {
                var i = n;
                var addAttraction = function (i, j, strength, idealDistance) {
                    G[i][j] = G[j][i] = strength;
                    D[i][j] = D[j][i] = idealDistance;
                };
                this._groups.forEach(function (g) {
                    addAttraction(i, i + 1, _this._groupCompactness, 0.1);
                    x[i] = 0, y[i++] = 0;
                    x[i] = 0, y[i++] = 0;
                });
            }
            else
                this._rootGroup = { leaves: this._nodes, groups: [] };
            var curConstraints = this._constraints || [];
            if (this._directedLinkConstraints) {
                this.linkAccessor.getMinSeparation = this._directedLinkConstraints.getMinSeparation;
                curConstraints = curConstraints.concat(cola.generateDirectedEdgeConstraints(n, this._links, this._directedLinkConstraints.axis, (this.linkAccessor)));
            }
            this.avoidOverlaps(false);
            this._descent = new cola.Descent([x, y], D);
            this._descent.locks.clear();
            for (var i = 0; i < n; ++i) {
                var o = this._nodes[i];
                if (o.fixed) {
                    o.px = o.x;
                    o.py = o.y;
                    var p = [o.x, o.y];
                    this._descent.locks.add(i, p);
                }
            }
            this._descent.threshold = this._threshold;
            this._descent.run(initialUnconstrainedIterations);
            if (curConstraints.length > 0)
                this._descent.project = new cola.vpsc.Projection(this._nodes, this._groups, this._rootGroup, curConstraints).projectFunctions();
            this._descent.run(initialUserConstraintIterations);
            this.avoidOverlaps(ao);
            if (ao) {
                this._nodes.forEach(function (v, i) { v.x = x[i], v.y = y[i]; });
                this._descent.project = new cola.vpsc.Projection(this._nodes, this._groups, this._rootGroup, curConstraints, true).projectFunctions();
                this._nodes.forEach(function (v, i) { x[i] = v.x, y[i] = v.y; });
            }
            this._descent.G = G;
            this._descent.run(initialAllConstraintsIterations);
            if (gridSnapIterations) {
                this._descent.snapStrength = 1000;
                this._descent.snapGridSize = this._nodes[0].width;
                this._descent.numGridSnapNodes = n;
                this._descent.scaleSnapByMaxH = true;
                var G0 = cola.Descent.createSquareMatrix(N, function (i, j) {
                    if (i >= n || j >= n)
                        return G[i][j];
                    return 0;
                });
                this._descent.G = G0;
                this._descent.run(gridSnapIterations);
            }
            this._links.forEach(function (l) {
                if (typeof l.source == "number")
                    l.source = _this._nodes[l.source];
                if (typeof l.target == "number")
                    l.target = _this._nodes[l.target];
            });
            this._nodes.forEach(function (v, i) {
                v.x = x[i], v.y = y[i];
            });
            if (!this._distanceMatrix && this._handleDisconnected) {
                var graphs = cola.separateGraphs(this._nodes, this._links);
                cola.applyPacking(graphs, w, h, this._defaultNodeSize);
                this._nodes.forEach(function (v, i) {
                    _this._descent.x[0][i] = v.x, _this._descent.x[1][i] = v.y;
                });
            }
            return this.resume();
        };
        Layout.prototype.resume = function () {
            return this.alpha(0.1);
        };
        Layout.prototype.stop = function () {
            return this.alpha(0);
        };
        Layout.prototype.prepareEdgeRouting = function (nodeMargin) {
            this._visibilityGraph = new cola.geom.TangentVisibilityGraph(this._nodes.map(function (v) {
                return v.bounds.inflate(-nodeMargin).vertices();
            }));
        };
        Layout.prototype.routeEdge = function (d, draw) {
            var lineData = [];
            var vg2 = new cola.geom.TangentVisibilityGraph(this._visibilityGraph.P, { V: this._visibilityGraph.V, E: this._visibilityGraph.E }), port1 = { x: d.source.x, y: d.source.y }, port2 = { x: d.target.x, y: d.target.y }, start = vg2.addPoint(port1, d.source.id), end = vg2.addPoint(port2, d.target.id);
            vg2.addEdgeIfVisible(port1, port2, d.source.id, d.target.id);
            if (typeof draw !== 'undefined') {
                draw(vg2);
            }
            var sourceInd = function (e) { return e.source.id; }, targetInd = function (e) { return e.target.id; }, length = function (e) { return e.length(); }, spCalc = new cola.shortestpaths.Calculator(vg2.V.length, vg2.E, sourceInd, targetInd, length), shortestPath = spCalc.PathFromNodeToNode(start.id, end.id);
            if (shortestPath.length === 1 || shortestPath.length === vg2.V.length) {
                cola.vpsc.makeEdgeBetween(d, d.source.innerBounds, d.target.innerBounds, 5);
                lineData = [{ x: d.sourceIntersection.x, y: d.sourceIntersection.y }, { x: d.arrowStart.x, y: d.arrowStart.y }];
            }
            else {
                var n = shortestPath.length - 2, p = vg2.V[shortestPath[n]].p, q = vg2.V[shortestPath[0]].p, lineData = [d.source.innerBounds.rayIntersection(p.x, p.y)];
                for (var i = n; i >= 0; --i)
                    lineData.push(vg2.V[shortestPath[i]].p);
                lineData.push(cola.vpsc.makeEdgeTo(q, d.target.innerBounds, 5));
            }
            return lineData;
        };
        Layout.getSourceIndex = function (e) {
            return typeof e.source === 'number' ? e.source : e.source.index;
        };
        Layout.getTargetIndex = function (e) {
            return typeof e.target === 'number' ? e.target : e.target.index;
        };
        Layout.linkId = function (e) {
            return Layout.getSourceIndex(e) + "-" + Layout.getTargetIndex(e);
        };
        Layout.dragStart = function (d) {
            d.fixed |= 2;
            d.px = d.x, d.py = d.y;
        };
        Layout.dragEnd = function (d) {
            d.fixed &= ~6;
        };
        Layout.mouseOver = function (d) {
            d.fixed |= 4;
            d.px = d.x, d.py = d.y;
        };
        Layout.mouseOut = function (d) {
            d.fixed &= ~4;
        };
        return Layout;
    }());
    cola.Layout = Layout;
})(cola || (cola = {}));
var cola;
(function (cola) {
    var D3StyleLayoutAdaptor = (function (_super) {
        __extends(D3StyleLayoutAdaptor, _super);
        function D3StyleLayoutAdaptor() {
            _super.call(this);
            this.event = d3.dispatch(cola.EventType[cola.EventType.start], cola.EventType[cola.EventType.tick], cola.EventType[cola.EventType.end]);
            var d3layout = this;
            this.drag = function () {
                var drag = d3.behavior.drag()
                    .origin(function (d) { return d; })
                    .on("dragstart.d3adaptor", cola.Layout.dragStart)
                    .on("drag.d3adaptor", function (d) {
                    d.px = d3.event.x, d.py = d3.event.y;
                    d3layout.resume();
                })
                    .on("dragend.d3adaptor", cola.Layout.dragEnd);
                if (!arguments.length)
                    return drag;
                this
                    .call(drag);
            };
        }
        D3StyleLayoutAdaptor.prototype.trigger = function (e) {
            var d3event = { type: cola.EventType[e.type], alpha: e.alpha, stress: e.stress };
            this.event[d3event.type](d3event);
        };
        D3StyleLayoutAdaptor.prototype.kick = function () {
            var _this = this;
            d3.timer(function () { return _super.prototype.tick.call(_this); });
        };
        D3StyleLayoutAdaptor.prototype.on = function (eventType, listener) {
            if (typeof eventType === 'string') {
                this.event.on(eventType, listener);
            }
            else {
                this.event.on(cola.EventType[eventType], listener);
            }
            return this;
        };
        return D3StyleLayoutAdaptor;
    }(cola.Layout));
    cola.D3StyleLayoutAdaptor = D3StyleLayoutAdaptor;
    function d3adaptor() {
        return new D3StyleLayoutAdaptor();
    }
    cola.d3adaptor = d3adaptor;
})(cola || (cola = {}));
var flownet;
(function (flownet_1) {
    var flownet = (function () {
        function flownet(nodes, links, interface_) {
            this.webGL_nodes = [];
            this.webGL_label = [];
            this.d3cola = d3.forceSimulation();
            this.tube = [];
            this.curveSplines = [];
            this.number_particles = 1;
            this.courbure = 5;
            this.number_roads = [];
            this.number_max_gates = 21;
            this.tube_width = 1;
            this.needUpdate = true;
            this.FPS = 60;
            this.links = links;
            this.nodes = nodes;
            this.scene = interface_.scene;
            this.camera = interface_.camera;
            this.shader = new flownet_1.Shader();
            this.fragment_shader = this.shader.fragment;
            this.vertex_shader = this.shader.vertex;
        }
        flownet.prototype.draw_us = function (projection) {
            var array = [];
            var self = this;
            d3.json("data/us.json", function (error, us) {
                var us_counties = topojson.feature(us, us.objects.land);
                var land = us_counties.geometry.coordinates;
                for (var i = 0; i < land.length; i++) {
                    array = [];
                    for (var j = 0; j < land[i].length; j++) {
                        var country = land[i][j];
                        for (var k = 1; k < country.length - 1; k++) {
                            var x = country[k][0];
                            var y = country[k][1];
                            var coordinates = projection([x, y]);
                            var vector = new THREE.Vector2(coordinates[0], -coordinates[1]);
                            array.push(vector);
                        }
                    }
                    var curve = new THREE.SplineCurve(array);
                    var shape = new THREE.Shape(curve.getSpacedPoints(150));
                    var geometry = new THREE.ShapeGeometry(shape);
                    var material = new THREE.MeshBasicMaterial({ color: 0x3498db, opacity: 0.5, transparent: true });
                    var mesh = new THREE.Mesh(geometry, material);
                    self.scene.add(mesh);
                }
            });
        };
        flownet.prototype.draw_map = function (projection, path) {
            var self = this;
            var array = [];
            d3.json(path, function (error, world) {
                var countries = world.features;
                for (var i = 0; i < countries.length; i++) {
                    var d = countries[i];
                    var name = d.id;
                    if (name) {
                        for (var k = 0; k < d.geometry.coordinates.length; k++) {
                            var f = d.geometry.coordinates[k];
                            var geometry_line = new THREE.Geometry();
                            var array = [];
                            var type = d.geometry.type;
                            for (var j = 0; j < f.length; j++) {
                                if (type == "MultiPolygon") {
                                    for (var l = 0; l < f[j].length; l++) {
                                        var coord = f[j][l];
                                        var x = coord[0];
                                        var y = coord[1];
                                        var coordinates = projection([x, y]);
                                        var vector = new THREE.Vector2(coordinates[0], -coordinates[1]);
                                        var vector3 = new THREE.Vector3(coordinates[0], -coordinates[1], 0);
                                        geometry_line.vertices.push(vector3);
                                        array.push(vector);
                                    }
                                }
                                else {
                                    var coord = f[j];
                                    var x = coord[0];
                                    var y = coord[1];
                                    var coordinates = projection([x, y]);
                                    var vector = new THREE.Vector2(coordinates[0], -coordinates[1]);
                                    var vector3 = new THREE.Vector3(coordinates[0], -coordinates[1], 0);
                                    geometry_line.vertices.push(vector3);
                                    array.push(vector);
                                }
                            }
                            if (array.length > 0) {
                                var material2 = new THREE.LineBasicMaterial({ color: 0XFFFFFF, linewidth: 0.1 });
                                var line = new THREE.Line(geometry_line, material2);
                                self.scene.add(line);
                                var curve = new THREE.SplineCurve(array);
                                var shape = new THREE.Shape(curve.getSpacedPoints(array.length * 2));
                                shape.autoClose = true;
                                var geometry = new THREE.ShapeGeometry(shape);
                                var material = new THREE.MeshBasicMaterial({ color: 0xbdbdbd });
                                var mesh = new THREE.Mesh(geometry, material);
                                mesh.name = name;
                                mesh.userData = { "type": "country" };
                                self.scene.add(mesh);
                            }
                        }
                    }
                }
            });
        };
        flownet.prototype.map_links_nodes = function () {
            this.d3cola
                .force("link", d3.forceLink().id(function (d) { return d.id; }).distance(function (d) { return d.link_length; }).strength(0.1));
            this.d3cola
                .nodes(this.nodes);
            this.d3cola.force("link")
                .links(this.links);
            this.d3cola.restart();
        };
        flownet.prototype.create = function () {
            console.log(this.number_roads);
            this.createNodes();
            this.createTube();
            this.createLinks();
        };
        flownet.prototype.launch_network2 = function (time) {
            var _this = this;
            d3.select("#spinner").style("display", "block");
            d3.select("#number_nodes").append("h1").text(this.links.length + " Links & " + this.nodes.length + " Nodes");
            window.setTimeout(function () {
                _this.d3cola.stop();
                _this.createLabel();
                _this.updateLinks();
                _this.updateTube();
                _this.updateNodes();
                d3.select("#spinner").style("display", "none");
                _this.needUpdate = false;
                console.log(_this.nodes);
                console.log(_this.links);
                console.log(_this.scene);
            }, time);
            console.log("FINISH UPDATE");
        };
        flownet.prototype.launch_network_without_computation = function () {
            console.log("no computation");
            this.createLabel();
            this.updateLinks();
            this.updateTube();
            this.updateNodes();
            this.fit_all_particles_to_frequence_temporal_distrib();
            this.createParticle();
            this.needUpdate = false;
            if (typeof (this.callback) === "function") {
                this.callback();
            }
        };
        flownet.prototype.launch_network = function (time) {
            var _this = this;
            d3.select("#spinner").style("display", "block");
            d3.select("#number_nodes").append("h1").text(this.links.length + " Links & " + this.nodes.length + " Nodes");
            window.setTimeout(function () {
                _this.d3cola.stop();
                _this.createLabel();
                _this.updateLinks();
                _this.updateTube();
                _this.updateNodes();
                _this.fit_all_particles_to_frequence_temporal_distrib();
                _this.createParticle();
                d3.select("#spinner").style("display", "none");
                _this.needUpdate = false;
                if (typeof (_this.callback) === "function") {
                    _this.callback();
                }
            }, time);
        };
        flownet.prototype.create_gates = function (id, segment, x1, y1, x2, y2) {
            var material = new THREE.LineBasicMaterial({
                color: 0x0000ff,
                linewidth: 3,
                opacity: 1,
                transparent: true
            });
            material.opacity = 0.4;
            var geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(x1, y1, 0));
            geometry.vertices.push(new THREE.Vector3(x2, y2, 0));
            var line = new THREE.Line(geometry, material);
            var _number = this.links[id].gates.length;
            this.links[id].gates.push({ object: line, position: segment });
            var array = this.links[id].gate_infos;
            array.splice(array.length - 1, 0, { factor: 1, position: segment });
            this.scene.add(line);
        };
        flownet.prototype.updateLabel_scale = function (scale) {
            console.log("UPDATE SCALE LABEL");
            for (var i = 0; i < this.webGL_label.length; i++) {
                this.webGL_label[i].scale.set(1 / scale, 1 / scale, 1 / scale);
            }
        };
        flownet.prototype.createLabel = function () {
            var self = this;
            var loader = new THREE.FontLoader();
            loader.load('helvetiker_bold.typeface.json', function (font) {
                var mesh = new THREE.Font();
                for (var i = 0; i < self.nodes.length; i++) {
                    if (self.nodes[i].label_name != null) {
                        var textGeo = new THREE.TextGeometry(self.nodes[i].label_name, {
                            font: font,
                            size: self.nodes[i].label_size,
                            height: 5,
                            curveSegments: 12,
                            bevelThickness: 1,
                            bevelSize: 5,
                            bevelEnabled: false
                        });
                        var textMaterial = new THREE.MeshBasicMaterial({ color: self.nodes[i].label_color, transparent: true });
                        var mesh = new THREE.Mesh(textGeo, textMaterial);
                        self.webGL_label.push(mesh);
                        mesh.position.set(0, 0, 1);
                        mesh.position.x = self.nodes[i].x + self.nodes[i].label_x;
                        mesh.position.y = self.nodes[i].y + self.nodes[i].label_y;
                        ;
                        mesh.name = "label";
                        mesh.name = "label";
                        mesh.userData = { id: self.nodes[i].id, index: self.nodes[i].index, type: "label" };
                        console.log("CREATE");
                        self.scene.add(mesh);
                    }
                }
            });
        };
        flownet.prototype.createNodes = function () {
            var n;
            this.webGL_nodes = [];
            var material;
            var circleGeometry;
            var circle;
            for (var i = 0; i < this.nodes.length; i++) {
                this.nodes[i].label_name = null;
                this.nodes[i].label_size = 6;
                this.nodes[i].label_x = 0;
                this.nodes[i].label_y = 0;
                this.nodes[i].label_color = 0xff0000;
                this.nodes[i].opacity = 1;
                this.nodes[i].z = 0;
                material = new THREE.MeshBasicMaterial({
                    transparent: true,
                    opacity: this.nodes[i].opacity
                });
                var segments = 30;
                circleGeometry = new THREE.CircleGeometry(1, segments);
                circle = new THREE.Mesh(circleGeometry, material);
                this.webGL_nodes.push(circle);
                circle.scale.set(1, 1, 1);
                circle.position.set(10, 10, 1);
                circle.name = "circle";
                circle.userData = { id: this.nodes[i].id, index: this.nodes[i].index, type: "node" };
                this.scene.add(circle);
            }
        };
        flownet.prototype.load_texture_nodes = function (index_node, path) {
            var self = this;
            var loader = new THREE.TextureLoader();
            loader.load(path, function (texture) {
                var material = new THREE.MeshBasicMaterial({ map: texture });
                self.webGL_nodes[index_node].material.map = material.map;
                self.webGL_nodes[index_node].material.needsUpdate = true;
            });
        };
        flownet.prototype.update_values = function () {
            this.updateNodes();
            this.updateLabel();
            this.updateLinks();
            this.updateTube();
        };
        flownet.prototype.update = function () {
            if (this.needUpdate == true) {
            }
            else {
            }
        };
        flownet.prototype.createParticle = function () {
            for (var j = 0; j < this.links.length; j++) {
                this.createParticles_webgl(this.links[j].number_particles, this.links[j].id);
            }
        };
        flownet.prototype.updateNodes = function () {
            console.log("YOOO UPDATE NODES");
            var self = this;
            for (var i = 0; i < self.nodes.length; i++) {
                if (self.nodes[i].px != null) {
                    self.nodes[i].x = self.nodes[i].px;
                }
                if (self.nodes[i].py != null) {
                    self.nodes[i].y = self.nodes[i].py;
                }
                if (self.nodes[i].pz != null) {
                    self.nodes[i].z = self.nodes[i].pz;
                }
                self.webGL_nodes[i].position.set(self.nodes[i].x, self.nodes[i].y, 3);
                self.webGL_nodes[i].material.opacity = this.nodes[i].opacity;
            }
        };
        flownet.prototype.updateNodes_Original = function () {
            console.log("YOOO UPDATE NODES");
            for (var i = 0; i < this.nodes.length; i++) {
                this.webGL_nodes[i].position.set(this.nodes[i].x, this.nodes[i].y, 1);
            }
        };
        flownet.prototype.updateLabel = function () {
            console.log("UPDATE LABEL");
            for (var i = 0; i < this.webGL_label.length; i++) {
                console.log("LABEL", this.webGL_label[i]);
                this.webGL_label[i].position.x = this.nodes[i].x + 10;
                this.webGL_label[i].position.y = this.nodes[i].y;
            }
        };
        flownet.prototype.updateTube = function () {
            console.log("UPDATE TUBE");
            var p, splineObject;
            var path = [];
            var x1, y1, x2, y2;
            var object, position, curve;
            var middle_point, point1, point2, quadratic_path1, quadratic_path2, pas;
            for (var i = 0; i < this.tube.length; i++) {
                path[0] = { x: this.links[i].source.x, y: this.links[i].source.y };
                path[1] = { x: this.links[i].target.x, y: this.links[i].target.y };
                x1 = path[0].x;
                y1 = path[0].y;
                x2 = path[1].x;
                y2 = path[1].y;
                object = this.tube[i].children[0];
                position = this.get_normal_position_border(x1, y1, x2, y2, this.links[i].width_tube, 1);
                curve = new THREE.SplineCurve([
                    new THREE.Vector2(position[0].x, position[0].y),
                    new THREE.Vector2(position[2].x, position[2].y)
                ]);
                middle_point = this.get_middle_position_normal(position[2].x, position[2].y, position[3].x, position[3].y, i);
                point1 = new THREE.Vector2(middle_point.x1, middle_point.y1);
                point2 = new THREE.Vector2(middle_point.x2, middle_point.y2);
                quadratic_path1 = [];
                var dist = this.get_distance(this.links[i].source.x, this.links[i].source.y, this.links[i].target.x, this.links[i].target.y);
                this.links[i].numberSpacedPoints = parseInt(dist / 50);
                if (this.links[i].numberSpacedPoints < 5)
                    this.links[i].numberSpacedPoints = 5;
                pas = 1.0 / this.links[i].numberSpacedPoints;
                for (var k = 0; k < 1; k += pas) {
                    quadratic_path1.push(this.bezier(k, position[2], point1, point2, position[3]));
                }
                var curve3 = new THREE.SplineCurve([
                    new THREE.Vector2(position[3].x, position[3].y),
                    new THREE.Vector2(position[1].x, position[1].y)
                ]);
                middle_point = this.get_middle_position_normal(position[0].x, position[0].y, position[1].x, position[1].y, i);
                point1 = new THREE.Vector2(middle_point.x1, middle_point.y1);
                point2 = new THREE.Vector2(middle_point.x2, middle_point.y2);
                quadratic_path2 = [];
                for (var k = 0; k < 1; k += pas) {
                    quadratic_path2.push(this.bezier(k, position[0], point1, point2, position[1]));
                }
                quadratic_path2 = quadratic_path2.reverse();
                var curve_result = curve.getSpacedPoints(1).concat(quadratic_path1).concat(curve3.getSpacedPoints(1)).concat(quadratic_path2);
                if (curve_result.length > 2100) {
                    alert("DOit updater la taille du tableau contenant les vertices dans tube");
                }
                if (y2 != y1 && x2 != x1) {
                    var shape = new THREE.Shape(curve_result);
                    var geometry2 = new THREE.ShapeGeometry(shape);
                    this.tube[i].children[0].geometry = geometry2;
                    this.tube[i].children[0].material.opacity = this.links[i].tube_opacity;
                    this.tube[i].children[0].geometry.faces = geometry2.faces;
                    this.tube[i].children[0].geometry.elementsNeedUpdate = true;
                }
            }
            console.log("FINISH UPDATE TUBE");
        };
        flownet.prototype.createTube = function () {
            var path = [];
            var geometry, p;
            var splineObject;
            var size;
            var curve, curve2, curve3, curve4;
            for (var i = 0; i < this.links.length; i++) {
                var octagon = new THREE.Object3D();
                var vertices = [];
                path[0] = { x: 5, y: 28 };
                path[1] = { x: 12, y: 35 };
                var x1 = path[0].x;
                var y1 = path[0].y;
                var x2 = path[1].x;
                var y2 = path[1].y;
                var position = this.get_normal_position_border(x1, y1, x2, y2, 3, 1);
                curve = new THREE.SplineCurve([
                    new THREE.Vector2(position[0].x, position[0].y),
                    new THREE.Vector2(position[2].x, position[2].y)
                ]);
                curve2 = new THREE.SplineCurve([
                    new THREE.Vector2(position[2].x, position[2].y),
                    new THREE.Vector2(position[3].x, position[3].y)
                ]);
                curve3 = new THREE.SplineCurve([
                    new THREE.Vector2(position[3].x, position[3].y),
                    new THREE.Vector2(position[1].x, position[1].y)
                ]);
                curve4 = new THREE.SplineCurve([
                    new THREE.Vector2(position[1].x, position[1].y),
                    new THREE.Vector2(position[0].x, position[0].y)
                ]);
                var curve_result = curve.getSpacedPoints(1).concat(curve2.getSpacedPoints(this.links[i].numberSpacedPoints)).concat(curve3.getSpacedPoints(1)).concat(curve4.getSpacedPoints(this.links[i].numberSpacedPoints));
                var shape = new THREE.Shape(curve_result);
                geometry = new THREE.ShapeGeometry(shape);
                var material = new THREE.MeshBasicMaterial({ color: 0x3498db, opacity: this.links[i].tube_opacity, transparent: true });
                var mesh = new THREE.Mesh(geometry, material);
                mesh.frustumCulled = false;
                mesh.name = "tube";
                octagon.name = "tube" + i;
                octagon.userData = { type: "tube", id: this.links[i]._id };
                octagon.add(mesh);
                this.scene.add(octagon);
                this.tube.push(octagon);
                console.log("PUSH TUBE");
            }
        };
        flownet.prototype.createLinks = function () {
            var path = [];
            var geometry, p;
            var splineObject;
            for (var i = 0; i < this.links.length; i++) {
                this.links[i].particleSystems = [];
                this.links[i].number_segmentation = 50;
                this.links[i].number_segmentation_pattern_fitting = 50;
                this.links[i].spatial_distribution = [];
                this.links[i].temporal_distribution2 = [0.0];
                this.links[i].gate_opacity = [];
                this.links[i].wiggling_gate = [];
                this.links[i].size = [];
                this.links[i].gate_position = [];
                this.links[i].roads_opacity = 0;
                this.links[i].roads_color = 1;
                this.links[i].number_paths_particule = this.number_roads[i];
                this.links[i].gate_colors = [];
                this.links[i].courbure = 5;
                this.links[i].texture = "images/rectangle_texture.png";
                this.links[i].number_particles = this.number_particles;
                this.links[i].coefficient_number_particles = 1;
                this.links[i].gates = [];
                this.links[i].id = i;
                this.links[i].frequency_pattern = 1.0;
                this.links[i].temporal_distribution = [];
                this.links[i].path_quadratic = [];
                this.links[i].tube_opacity = 1;
                if (this.links[i].numberSpacedPoints == undefined)
                    this.links[i].numberSpacedPoints = 5;
                this.links[i].name = "links";
                this.links[i].width_tube = 1;
                this.links[i].gates.push({ object: "null", position: 0 });
                var multi_line = new THREE.Object3D();
                this.links[i].source.x = Math.random() * 100;
                this.links[i].target.y = Math.random() * 100;
                this.links[i].source.x = Math.random() * 100;
                this.links[i].target.y = Math.random() * 100;
                path[0] = { x: this.links[i].source.x, y: this.links[i].source.y };
                path[1] = { x: this.links[i].target.x, y: this.links[i].target.y };
                var x1 = path[0].x;
                var y1 = path[0].y;
                var x2 = path[1].x;
                var y2 = path[1].y;
                var distance = this.get_distance(x1, y1, x2, y2);
                this.links[i].number_segmentation = Math.floor(distance);
                var position = this.get_normal_position_border(x1, y1, x2, y2, this.links[i].width_tube, this.links[i].number_paths_particule);
                var points = [];
                var curve = new THREE.SplineCurve([
                    new THREE.Vector2(this.links[i].source.x, this.links[i].source.y),
                    new THREE.Vector2(this.links[i].target.x, this.links[i].target.y),
                ]);
                this.links[i].spatial_distribution[0] = 0;
                var curveSplineMaterial = new THREE.LineBasicMaterial({
                    color: this.links[i].roads_color,
                    linewidth: 1,
                    opacity: this.links[i].roads_opacity,
                    transparent: true
                });
                p = new THREE.Path(curve.getSpacedPoints(this.links[i].number_segmentation));
                geometry = p.createPointsGeometry(this.links[i].number_segmentation);
                splineObject = new THREE.Line(geometry, curveSplineMaterial);
                splineObject.name = "roads";
                multi_line.add(splineObject);
                for (var j = 0, f = 1; j < position.length - 1; j += 2, f++) {
                    var points = [];
                    var curve = new THREE.SplineCurve([
                        new THREE.Vector2(position[j].x, position[j].y),
                        new THREE.Vector2(position[j + 1].x, position[j + 1].y),
                    ]);
                    this.links[i].spatial_distribution[f] = 0;
                    var curveSplineMaterial = new THREE.LineBasicMaterial({
                        color: this.links[i].roads_color,
                        linewidth: 1.8,
                        opacity: this.links[i].roads_opacity,
                        transparent: true
                    });
                    p = new THREE.Path(curve.getSpacedPoints(this.links[i].number_segmentation));
                    geometry = p.createPointsGeometry(this.links[i].number_segmentation);
                    splineObject = new THREE.Line(geometry, curveSplineMaterial);
                    multi_line.add(splineObject);
                }
                this.links[i].gate_infos = [{ factor: 1, position: 0 }, { factor: 1, position: this.links[i].number_segmentation }];
                multi_line.renderOrder = 5;
                multi_line.userData = { type: "link", id: this.links[i]._id };
                multi_line.name = "links";
                this.curveSplines.push(multi_line);
                this.links[i].userData = { id: this.links[i]._id, number_particles: 0 };
                this.links[i].temporal_distribution = Array.apply(null, Array(this.number_particles)).map(Number.prototype.valueOf, 0);
                this.links[i].gate_opacity = Array.apply(null, Array(this.number_max_gates)).map(Number.prototype.valueOf, 1.0);
                this.links[i].wiggling_gate = Array.apply(null, Array(this.number_max_gates)).map(Number.prototype.valueOf, 0.0);
                this.links[i].size = Array.apply(null, Array(this.number_max_gates)).map(Number.prototype.valueOf, 40.0);
                this.links[i].gate_position = Array.apply(null, Array(this.number_max_gates)).map(Number.prototype.valueOf, 0);
                this.links[i].gate_velocity = Array.apply(null, Array(this.number_max_gates)).map(Number.prototype.valueOf, 1.0);
                this.links[i].gate_colors = [];
                for (var j = 0; j < this.number_max_gates; j++) {
                    this.links[i].gate_colors.push(new THREE.Vector3(1.0, 1.0, 1.0));
                }
                this.scene.add(multi_line);
            }
        };
        flownet.prototype.updateLinks = function () {
            var path = [];
            console.log("UPDATE LINKS");
            for (var i = 0; i < this.links.length; i += 1) {
                this.links[i].temporal_distribution = [];
                if (this.links[i].source.x == this.links[i].target.x)
                    this.links[i].source.x += 0.01;
                if (this.links[i].source.y == this.links[i].target.y)
                    this.links[i].source.y += 0.01;
                path[0] = { x: this.links[i].source.x, y: this.links[i].source.y };
                path[1] = { x: this.links[i].target.x, y: this.links[i].target.y };
                var x1 = path[0].x;
                var y1 = path[0].y;
                var x2 = path[1].x;
                var y2 = path[1].y;
                var distance = this.get_distance(x1, y1, x2, y2);
                this.links[i].number_segmentation = Math.round(distance) * 5;
                var middle_point = this.get_middle_position_normal(x1, y1, x2, y2, i);
                var array = [new THREE.Vector2(this.links[i].source.x, this.links[i].source.y),
                    new THREE.Vector2(middle_point.x1, middle_point.y1),
                    new THREE.Vector2(middle_point.x2, middle_point.y2),
                    new THREE.Vector2(this.links[i].target.x, this.links[i].target.y)];
                this.links[i].path_quadratic[0] = array;
                var quadratic_path = [];
                var object = this.curveSplines[i].children[0];
                var pas = 1.0 / (object.geometry.vertices.length - 1);
                for (var k = 0; k < 1; k += pas) {
                    quadratic_path.push(new THREE.Vector3(this.bezier(k, array[0], array[1], array[2], array[3]).x, this.bezier(k, array[0], array[1], array[2], array[3]).y, 0));
                }
                quadratic_path.push(new THREE.Vector3(x2, y2, 0));
                var curveSplineMaterial = new THREE.LineBasicMaterial({ color: this.links[i].roads_color, linewidth: 1, opacity: this.links[i].roads_opacity, transparent: true });
                var p = new THREE.Path(quadratic_path);
                var geometry = p.createPointsGeometry(50);
                object.material = curveSplineMaterial;
                object.geometry.vertices = geometry.vertices;
                object.geometry.verticesNeedUpdate = true;
                for (var f = 1; f < this.links[i].gate_position.length - 1; f++) {
                    this.links[i].gate_position[f] = Math.ceil((this.links[i].number_segmentation / (this.number_max_gates - 1)) * f);
                }
                this.links[i].gate_position[this.number_max_gates] = this.links[i].number_segmentation + Math.ceil(this.links[i].number_segmentation / (this.number_max_gates - 1));
                var position = this.get_normal_position_border(x1, y1, x2, y2, this.links[i].width_tube, this.links[i].number_paths_particule);
                for (var j = 0, f = 1; j < position.length - 1; j += 2, f++) {
                    var object = this.curveSplines[i].children[f];
                    var points = [];
                    var middle_point = this.get_middle_position_normal(position[j].x, position[j].y, position[j + 1].x, position[j + 1].y, i);
                    var array = [new THREE.Vector2(position[j].x, position[j].y),
                        new THREE.Vector2(middle_point.x1, middle_point.y1),
                        new THREE.Vector2(middle_point.x2, middle_point.y2),
                        new THREE.Vector2(position[j + 1].x, position[j + 1].y)];
                    this.links[i].path_quadratic[f] = array;
                    var quadratic_path = [];
                    var pas = 1.0 / (object.geometry.vertices.length - 1);
                    for (var k = 0; k < 1; k += pas) {
                        quadratic_path.push(this.bezier(k, array[0], array[1], array[2], array[3]));
                    }
                    quadratic_path.push(new THREE.Vector3(array[3].x, array[3].y, 1));
                    var curveSplineMaterial = new THREE.LineBasicMaterial({ color: this.links[i].roads_color, linewidth: 1, opacity: this.links[i].roads_opacity, transparent: true });
                    var p = new THREE.Path(quadratic_path);
                    var geometry = p.createPointsGeometry(20);
                    object.material = curveSplineMaterial;
                    object.geometry.vertices = geometry.vertices;
                    object.geometry.verticesNeedUpdate = true;
                }
            }
        };
        flownet.prototype.updateTube_width_gate = function (link_id, gate, value) {
            var self = this;
            var array_gates = this.links[link_id].gate_infos;
            var array_tube = [];
            for (var i = 0; i < 2; i++) {
                var array_spline = [];
                for (var j = 0; j < array_gates.length; j++) {
                    var position = this.get_normal_position(this.links[link_id].source.x, this.links[link_id].source.y, this.links[link_id].target.x, this.links[link_id].target.y, array_gates[j].position, this.links[link_id].width_tube * array_gates[j].factor, 1);
                    array_spline.push(new THREE.Vector2(position[i].x, position[i].y));
                }
                var curve = new THREE.SplineCurve(array_spline);
                var p = new THREE.Path(curve.getSpacedPoints(50));
                var geometry = p.createPointsGeometry(50);
                var array_vertices = [];
                for (var j = 0; j < geometry.vertices.length; j++) {
                    array_vertices.push(new THREE.Vector2(geometry.vertices[j].x, geometry.vertices[j].y));
                }
                array_tube.push(array_vertices);
            }
            array_tube[0].reverse();
            var curve1 = new THREE.SplineCurve([
                new THREE.Vector2(array_tube[0][50].x, array_tube[0][50].y),
                new THREE.Vector2(array_tube[1][0].x, array_tube[1][0].y)
            ]);
            var curve2 = new THREE.SplineCurve([
                new THREE.Vector2(array_tube[1][50].x, array_tube[1][50].y),
                new THREE.Vector2(array_tube[0][0].x, array_tube[0][0].y)
            ]);
            var curve_result = curve1.getSpacedPoints(50).concat(array_tube[1]).concat(curve2.getSpacedPoints(50)).concat(array_tube[0]);
            console.log(curve_result);
            var octagon = new THREE.Object3D();
            octagon.name = "tube" + link_id;
            var object = this.tube[link_id].id;
            var shape = new THREE.Shape(curve_result);
            var geometry2 = new THREE.ShapeGeometry(shape);
            var material = new THREE.MeshLambertMaterial({ color: 0x3498db, opacity: 1 });
            material.transparent = true;
            material.opacity = 1;
            var mesh = new THREE.Mesh(geometry2, material);
            mesh.material.depthTest = false;
            mesh.renderOrder = 9999;
            octagon.userData = { type: "tube", id: link_id };
            octagon.add(mesh);
            for (var a in geometry2.vertices) {
                this.tube[link_id].children[0].geometry.vertices[a].x = geometry2.vertices[a].x;
                this.tube[link_id].children[0].geometry.vertices[a].y = geometry2.vertices[a].y;
            }
            this.tube[link_id].children[0].geometry.faces = geometry2.faces;
            this.tube[link_id].children[0].geometry.computeBoundingSphere();
            this.tube[link_id].children[0].geometry.verticesNeedUpdate = true;
            this.tube[link_id].children[0].geometry.elementsNeedUpdate = true;
            this.tube[link_id].children[0].geometry.morphTargetsNeedUpdate = true;
            this.tube[link_id].children[0].geometry.uvsNeedUpdate = true;
            this.tube[link_id].children[0].geometry.normalsNeedUpdate = true;
            this.tube[link_id].children[0].geometry.colorsNeedUpdate = true;
            this.tube[link_id].children[0].geometry.tangentsNeedUpdate = true;
        };
        flownet.prototype.updateLinks_width_gate = function (link_id, gate, value) {
            var array_gates = this.links[link_id].gate_infos;
            array_gates[gate].factor = value;
            for (var i = 0; i < 12; i++) {
                var array_spline = [];
                for (var j = 0; j < array_gates.length; j++) {
                    var position = this.get_normal_position(this.links[link_id].source.x, this.links[link_id].source.y, this.links[link_id].target.x, this.links[link_id].target.y, array_gates[j].position, this.links[link_id].width_tube * array_gates[j].factor, this.links[link_id].number_paths_particule);
                    array_spline.push(position[i]);
                }
                var object = this.curveSplines[link_id].children[i];
                var curve = new THREE.SplineCurve(array_spline);
                var p = new THREE.Path(curve.getSpacedPoints(50));
                var geometry = p.createPointsGeometry(50);
                object.geometry.vertices = geometry.vertices;
                object.geometry.verticesNeedUpdate = true;
                this.links[link_id].curvePath[i] = curve.getSpacedPoints(50);
            }
            this.updateParticles_Paths(link_id);
        };
        flownet.prototype.updateParticles_Paths = function (link_id) {
            var number_particles = this.links[link_id].userData.number_particles;
            var uniforms = this.links[link_id].particleSystems.material.__webglShader.uniforms;
            var path_quadratic = [];
            for (var i = 0; i < this.links[link_id].path_quadratic.length; i++) {
                path_quadratic = path_quadratic.concat(this.links[link_id].path_quadratic[i]);
            }
            uniforms.path_quadratic.value = path_quadratic;
            console.log("PATHS", uniforms.path_quadratic);
        };
        flownet.prototype.updateParticles_Texture = function (link_id, value) {
            var number_particles = this.links[link_id].userData.number_particles;
            var uniforms = this.links[link_id].particleSystems.material.__webglShader.uniforms;
            uniforms.texture.value = new THREE.TextureLoader().load("images/" + value);
            uniforms.texture.name = value;
            console.log("TEXTURE", uniforms.texture.value);
        };
        flownet.prototype.updateParticles_Velocity = function (link_id, gate, value) {
            var number_particles = this.links[link_id].userData.number_particles;
            var uniforms = this.links[link_id].particleSystems.material.__webglShader.uniforms;
            uniforms.gate_velocity.value[gate] = value;
            console.log("VELOCITY", uniforms.gate_velocity.value);
        };
        flownet.prototype.updateParticles_Wiggling = function (link_id, gate, value) {
            var number_particles = this.links[link_id].userData.number_particles;
            var uniforms = this.links[link_id].particleSystems.material.__webglShader.uniforms;
            uniforms.wiggling_gate.value[gate] = value;
            console.log("WIGGLING", uniforms.wiggling_gate.value);
        };
        flownet.prototype.updateParticles_Zoom = function (value) {
            for (var i = 0; i < this.links.length; i++) {
                var uniforms = this.links[i].particleSystems.material.__webglShader.uniforms;
                console.log(uniforms);
                console.log(value);
                uniforms.ProjectionMatrix.value = value;
            }
        };
        flownet.prototype.updateParticle_Opacity = function (link_id, gate, value) {
            var uniforms = this.links[link_id].particleSystems.material.__webglShader.uniforms;
            uniforms.gate_opacity.value[gate] = value;
        };
        flownet.prototype.updateParticles_Gate_Opacity = function (link_id, value) {
            for (var j = 0; j < 21; j++) {
                var uniforms = this.links[link_id].particleSystems.material.__webglShader.uniforms;
                uniforms.gate_opacity.value[j] = value;
            }
        };
        flownet.prototype.updateParticles_Opacity = function (value) {
            for (var i = 0; i < this.links.length; i++) {
                for (var j = 0; j < 21; j++) {
                    var uniforms = this.links[i].particleSystems.material.__webglShader.uniforms;
                    uniforms.gate_opacity.value[j] = value;
                }
            }
        };
        flownet.prototype.updateParticle_Size = function (link_id, gate, value) {
            var uniforms = this.links[link_id].particleSystems.material.__webglShader.uniforms;
            uniforms.size.value[gate] = value;
            console.log("SIZE", uniforms.size.value);
        };
        flownet.prototype.updateParticles_Size = function (value) {
            for (var i = 0; i < this.links.length; i++) {
                for (var j = 0; j < 21; j++) {
                    var uniforms = this.links[i].particleSystems.material.__webglShader.uniforms;
                    uniforms.size.value[j] = value;
                }
            }
        };
        flownet.prototype.updateParticles_SpatialDistribution = function (spatial_distribution, link) {
            console.log(spatial_distribution);
            var f = 0;
            for (var j = 0; j < this.links.length; j++) {
                if (this.links[j]._id == link) {
                    var particule_number = 0;
                    var faisceau = 0;
                    for (var i = 0; i < spatial_distribution.length; i++) {
                        for (var k = 0; k < spatial_distribution[i]; k++) {
                            this.links[j].particleSystems.geometry.attributes.id.array[particule_number] = faisceau;
                            particule_number++;
                        }
                        faisceau++;
                    }
                    this.links[j].particleSystems.geometry.attributes.id.needsUpdate = true;
                }
            }
        };
        flownet.prototype.array_SpatialDistribution_items = function (number, i) {
            var array = [];
            var array_length = number / this.links[i].spatial_distribution.length;
            for (var k = 0; k < array_length; k++) {
                array = array.concat(this.links[i].spatial_distribution);
            }
            return array;
        };
        flownet.prototype.array_SpatialDistribution = function (spatial_distribution, indice) {
            var f = 0;
            var array = Array.apply(null, Array(spatial_distribution.length)).map(Number.prototype.valueOf, 0.0);
            var particule_number = 0;
            var faisceau = 0;
            for (var i = 0; i < spatial_distribution.length; i++) {
                for (var k = 0; k < spatial_distribution[i]; k++) {
                    array[particule_number] = faisceau;
                    particule_number++;
                }
                faisceau++;
            }
            return array[indice];
        };
        flownet.prototype.updateParticles_number_segmentation_pattern_fitting = function () {
            for (var j = 0; j < this.links.length; j++) {
                var number_particles = this.links[j].userData.number_particles;
                var uniforms = this.links[j].particleSystems.material.__webglShader.uniforms;
                uniforms.temporal_delay.value = this.links[j].number_segmentation_pattern_fitting;
            }
        };
        flownet.prototype.updateParticles_Color = function (id_link, color, gate) {
            var number_particles = this.links[id_link].userData.number_particles;
            var uniforms = this.links[id_link].particleSystems.material.__webglShader.uniforms;
            var indice = 0;
            uniforms.gate_colors.value[gate] = new THREE.Vector3(color.r, color.g, color.b);
        };
        flownet.prototype.updateParticles_Gates = function (id_link, gate) {
            var uniforms = this.links[id_link].particleSystems.material.__webglShader.uniforms;
            var indice = 0;
            for (var j = 1; j < uniforms.gate_position.value.length; j++) {
                if (uniforms.gate_position.value[j] == 0) {
                    uniforms.gate_position.value[j] = gate;
                    break;
                }
            }
        };
        flownet.prototype.updateParticle = function (number_frame) {
            var numParticles;
            var my_frame = 0;
            for (var j = 0; j < this.links.length; j++) {
                if (this.links[j].particleSystems.length != 0 && this.links[j].particleSystems.material.__webglShader != undefined) {
                    var uniforms = this.links[j].particleSystems.material.__webglShader.uniforms;
                    uniforms.uTime.value = number_frame;
                }
            }
        };
        flownet.prototype.createParticles_webgl = function (particles, link_id) {
            console.log("CREATE PARTICLES", particles, link_id);
            var self = this;
            var temporal = this.links[link_id].temporal_distribution;
            var gate_velocity = this.links[link_id].gate_velocity;
            var gate_opacity = this.links[link_id].gate_opacity;
            var wiggling_gate = this.links[link_id].wiggling_gate;
            var size = this.links[link_id].size;
            var gate_position = this.links[link_id].gate_position;
            var gate_colors = this.links[link_id].gate_colors;
            var number_segmentation = this.links[link_id].number_segmentation;
            var number_segmentation_pattern_fitting = this.links[link_id].number_segmentation_pattern_fitting;
            var path_quadratic = [];
            for (var i = 0; i < this.links[link_id].path_quadratic.length; i++) {
                path_quadratic = path_quadratic.concat(this.links[link_id].path_quadratic[i]);
            }
            var spatial = this.array_SpatialDistribution_items(particles, link_id);
            var texture = new THREE.TextureLoader().load(this.links[link_id].texture);
            texture.minFilter = THREE.LinearMipMapLinearFilter;
            texture.magFilter = THREE.LinearFilter;
            var number = 0;
            var posistion_gate_after_speed = [];
            var number = 0;
            var offsetGate = 0;
            var posistion_gate_after_speed = [];
            var gap = number_segmentation / (this.number_max_gates);
            for (var i = 0; i < (this.number_max_gates - 1); i++) {
                posistion_gate_after_speed.push(number);
                number = number + parseInt(gap / (gate_velocity[i]));
            }
            posistion_gate_after_speed.push(number_segmentation_pattern_fitting);
            var gap_two_gates = posistion_gate_after_speed[3] - posistion_gate_after_speed[2];
            var offsetArray = Array.apply(null, Array(this.number_max_gates)).map(Number.prototype.valueOf, 0);
            var offset = 0;
            for (var i = 0; i < this.number_max_gates - 1; i++) {
                var normalValuesAtGates = posistion_gate_after_speed[i] * gate_velocity[i];
                var offsetBetweenGates = posistion_gate_after_speed[i + 1] - posistion_gate_after_speed[i];
                offsetArray[i] = (posistion_gate_after_speed[i] * gate_velocity[i]) - offset;
                offset += offsetBetweenGates * gate_velocity[i];
            }
            var uniforms = {
                "path_quadratic": { type: "v2v", value: path_quadratic },
                "temporal_delay": { type: "iv1", value: temporal },
                "gate_velocity": { type: "iv1", value: gate_velocity },
                "size": { type: "fv1", value: size },
                "gate_opacity": { type: "fv1", value: gate_opacity },
                "wiggling_gate": { type: "fv1", value: wiggling_gate },
                "gap_two_gates": { type: "iv1", value: gap_two_gates },
                "gate_position": { type: "iv1", value: posistion_gate_after_speed },
                "gate_colors": { type: "v3v", value: gate_colors },
                "particles_number": { type: "iv1", value: particles },
                "number_segmentation": { type: "iv1", value: number_segmentation },
                "offsetArray": { type: "iv1", value: offsetArray },
                "number_segmentation_pattern_fitting": { type: "iv1", value: number_segmentation_pattern_fitting },
                uTime: { type: "f", value: 1.0 },
                time: { value: 1.0 },
                delta: { value: 0.0 },
                "ProjectionMatrix": { type: "m4", value: self.camera.projectionMatrix },
                texture: { value: texture, name: this.links[link_id].texture }
            };
            var path_length = ((2 * this.links[link_id].number_paths_particule) + 1) * 4;
            var shaderMaterial = new THREE.ShaderMaterial({
                uniforms: uniforms,
                vertexShader: '#define path_length ' + path_length +
                    '\n' + '#define real_number_particles ' + this.links[link_id].temporal_distribution.length +
                    '\n' + '#define number_max_gates ' + this.number_max_gates +
                    '\n' + self.vertex_shader,
                fragmentShader: self.fragment_shader,
                transparent: true
            });
            var radius = 50;
            var geometry = new THREE.BufferGeometry();
            var positions = new Float32Array(particles * 3);
            var colors = new Float32Array(particles * 3);
            var my_velocity = new Float32Array(particles);
            var id = new Float32Array(particles);
            var id_particle = new Float32Array(particles);
            var paths = new Float32Array(particles * 4);
            var iterations = new Float32Array(particles);
            var color = new THREE.Color();
            for (var i = 0, i3 = 0; i < particles; i++, i3 += 3) {
                positions[i3 + 0] = 0 * radius;
                positions[i3 + 1] = 0 * radius;
                positions[i3 + 2] = 0 * radius;
                colors[i3 + 0] = 1;
                colors[i3 + 1] = 1;
                colors[i3 + 2] = 0;
                my_velocity[i] = 1.0;
                iterations[i] = 0.0;
                id_particle[i] = i;
                id[i] = spatial[i];
            }
            geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.addAttribute('customColor', new THREE.BufferAttribute(colors, 3));
            geometry.addAttribute('actual_velocity', new THREE.BufferAttribute(my_velocity, 1));
            geometry.addAttribute('id', new THREE.BufferAttribute(id, 1));
            geometry.addAttribute('id_particle', new THREE.BufferAttribute(id_particle, 1));
            geometry.addAttribute('iteration', new THREE.BufferAttribute(iterations, 1));
            this.particleSystems = new THREE.Points(geometry, shaderMaterial);
            this.particleSystems.name = "particle_system" + link_id;
            this.links[link_id].particleSystems = this.particleSystems;
            this.links[link_id].userData.number_particles = particles;
            this.particleSystems.frustumCulled = false;
            this.scene.add(this.particleSystems);
            return this.particleSystems;
        };
        flownet.prototype.delete_entity_by_type = function (tag_data) {
            for (var i = 0; i < this.scene.children.length; i++) {
                var object = this.scene.children[i];
                if (object.userData.type == tag_data) {
                    this.scene.remove(object);
                }
            }
        };
        flownet.prototype.get_middle_position_normal = function (x1, y1, x2, y2, link_id) {
            if (y1 == y2)
                y1 = y2 + 1;
            var segmentation = this.links[link_id].number_segmentation;
            var divide = Math.round(segmentation / 3);
            var euclidean_distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            var distance = euclidean_distance / this.links[link_id].courbure;
            var alpha = (y2 - y1) / (x2 - x1);
            var signe = -1;
            if (y2 < y1) {
                signe = 1;
            }
            var x_middle = (((x2 - x1) / segmentation) * divide) + x1;
            var y_middle = (((y2 - y1) / segmentation) * divide) + y1;
            var alpha_normal = (x1 - x2) / (y2 - y1);
            var ordonne_origine_normal = y_middle - (alpha_normal * x_middle);
            var X1 = x_middle + (signe * Math.sqrt(Math.pow(distance, 2) / (1 + Math.pow(alpha_normal, 2))));
            var Y1 = alpha_normal * (X1) + ordonne_origine_normal;
            var x_middle = (((x2 - x1) / segmentation) * divide * 2) + x1;
            var y_middle = (((y2 - y1) / segmentation) * divide * 2) + y1;
            var alpha_normal = (x1 - x2) / (y2 - y1);
            var ordonne_origine_normal = y_middle - (alpha_normal * x_middle);
            var X2 = x_middle + (signe * Math.sqrt(Math.pow(distance, 2) / (1 + Math.pow(alpha_normal, 2))));
            var Y2 = alpha_normal * (X2) + ordonne_origine_normal;
            return { x1: X1, y1: Y1, x2: X2, y2: Y2 };
        };
        flownet.prototype.get_normal_position_border = function (x1, y1, x2, y2, distance, _number) {
            var fix_distance = distance;
            var array = [];
            if (y1 == y2)
                y1 = y2 + 5;
            if (x1 == x2)
                x1 = x2 + 5;
            var alpha = (y2 - y1) / (x2 - x1);
            var alpha_normal = (x1 - x2) / (y2 - y1);
            for (var i = 0; i < _number; i++) {
                var x_middle = x1;
                var y_middle = y1;
                var ordonne_origine_normal = y_middle - (alpha_normal * x_middle);
                var X1 = x_middle + Math.sqrt(Math.pow(distance, 2) / (1 + Math.pow(alpha_normal, 2)));
                var Y1 = alpha_normal * (X1) + ordonne_origine_normal;
                var X2 = x_middle - Math.sqrt(Math.pow(distance, 2) / (1 + Math.pow(alpha_normal, 2)));
                var Y2 = alpha_normal * (X2) + ordonne_origine_normal;
                var x_middle = x2;
                var y_middle = y2;
                var alpha_normal = (x1 - x2) / (y2 - y1);
                var ordonne_origine_normal = y_middle - (alpha_normal * x_middle);
                var X3 = x_middle + Math.sqrt(Math.pow(distance, 2) / (1 + Math.pow(alpha_normal, 2)));
                var Y3 = alpha_normal * (X3) + ordonne_origine_normal;
                var X4 = x_middle - Math.sqrt(Math.pow(distance, 2) / (1 + Math.pow(alpha_normal, 2)));
                var Y4 = alpha_normal * (X4) + ordonne_origine_normal;
                array.push({ x: X1, y: Y1 });
                array.push({ x: X3, y: Y3 });
                array.push({ x: X2, y: Y2 });
                array.push({ x: X4, y: Y4 });
                distance = distance - (fix_distance / _number);
            }
            return array;
        };
        flownet.prototype.draw_circle = function (x, y) {
            var material = new THREE.MeshBasicMaterial({
                color: 0x4286f4
            });
            var segments = 50;
            var circleGeometry = new THREE.CircleGeometry(10, segments);
            var circle = new THREE.Mesh(circleGeometry, material);
            circle.scale.set(0.5, 0.5, 1);
            circle.name = "circle";
            circle.position.set(x, y, 1);
            this.scene.add(circle);
        };
        flownet.prototype.hslToRgb = function (h, s, l) {
            var r, g, b;
            if (s == 0) {
                r = g = b = l;
            }
            else {
                var hue2rgb = function hue2rgb(p, q, t) {
                    if (t < 0)
                        t += 1;
                    if (t > 1)
                        t -= 1;
                    if (t < 1 / 6)
                        return p + (q - p) * 6 * t;
                    if (t < 1 / 2)
                        return q;
                    if (t < 2 / 3)
                        return p + (q - p) * (2 / 3 - t) * 6;
                    return p;
                };
                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                r = hue2rgb(p, q, h + 1 / 3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1 / 3);
            }
            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        };
        flownet.prototype.getColor = function (percent) {
            var r = percent < 50 ? 255 : Math.floor(255 - (percent * 2 - 100) * 255 / 100);
            var g = percent > 50 ? 255 : Math.floor((percent * 2) * 255 / 100);
            if (r < 0) {
                return new THREE.Vector3(1, 0, 0);
            }
            return new THREE.Vector3(r / 255.0, g / 255.0, 0);
        };
        flownet.prototype.load_vertex_shaders = function () {
            var self = this;
            $.ajax({
                async: false,
                url: 'shaders/vertex.js',
                success: function (data) {
                    self.vertex_shader = data;
                },
                dataType: 'html'
            });
        };
        flownet.prototype.load_fragment_shaders = function () {
            var self = this;
            $.ajax({
                async: false,
                url: "shaders/fragment.js",
                success: function (data) {
                    self.fragment_shader = data;
                },
                dataType: 'html'
            });
        };
        flownet.prototype.get_middle = function (x1, y1, x2, y2) {
            var middle_X = ((x2 - x1) / 2) + x1;
            var middle_Y = ((y2 - y1) / 2) + y1;
            return { x: middle_X, y: middle_Y };
        };
        flownet.prototype.get_distance = function (x1, y1, x2, y2) {
            var a = x1 - x2;
            var b = y1 - y2;
            var c = Math.sqrt(a * a + b * b);
            return c;
        };
        flownet.prototype.fit_temporal_distribution = function (link_id) {
            var delay = 0;
            var iteration = (this.links[link_id].number_segmentation) / this.links[link_id].number_particles;
            for (var j = 0; j < this.links[link_id].number_particles; j++) {
                this.links[link_id].temporal_distribution[j] = delay;
                delay += iteration;
            }
            this.links[link_id].spatial_distribution[0] = this.links[link_id].number_particles;
        };
        flownet.prototype.fit_all_temporal_distribution = function () {
            for (var i = 0; i < this.links.length; i++) {
                var delay = 0;
                var iteration = (this.links[i].number_segmentation) / this.links[i].number_particles;
                for (var j = 0; j < this.links[i].number_particles; j++) {
                    this.links[i].temporal_distribution[j] = delay;
                    delay += iteration;
                }
                this.links[i].spatial_distribution[0] = this.links[i].number_particles;
            }
        };
        flownet.prototype.fit_all_particles_to_frequence_temporal_distrib = function () {
            for (var i = 0; i < this.links.length; i++) {
                this.fit_to_frequence_temporal_distrib(i);
            }
        };
        flownet.prototype.fit_to_frequence_temporal_distrib2 = function (id) {
            var frequence_patttern = this.links[id].frequency_pattern;
            var temporal_distribution = this.links[id].temporal_distribution2;
            var speed = this.links[id].gate_velocity[0];
            frequence_patttern = this.FPS * frequence_patttern;
            var temporal_dis = [];
            for (var i = 0; i < temporal_distribution.length; i++) {
                temporal_dis.push(temporal_distribution[i] * -frequence_patttern / speed);
            }
            var motifs = Math.ceil(this.links[id].number_segmentation / frequence_patttern);
            this.links[id].number_particles = motifs * temporal_distribution.length;
            this.links[id].number_segmentation_pattern_fitting = motifs * frequence_patttern;
            var total_for_pattern = 0;
            var id_particle = 0;
            var delay = 0;
            for (var k = 1; k < motifs + 1; k++) {
                total_for_pattern = 0;
                delay = frequence_patttern * (k - 1);
                for (var j = 0; j < temporal_distribution.length; j++) {
                    this.links[id].temporal_distribution[id_particle] = delay + temporal_dis[j];
                    total_for_pattern += delay + temporal_dis[j];
                    id_particle += 1;
                }
            }
            this.links[id].number_particles = this.links[id].temporal_distribution.length;
        };
        flownet.prototype.fit_to_frequence_temporal_distrib = function (id) {
            var frequence_patttern = this.links[id].frequency_pattern;
            var temporal_distribution = this.links[id].temporal_distribution2;
            var speed = 10;
            frequence_patttern = this.FPS * frequence_patttern;
            var temporal_dis = [];
            for (var i = 0; i < temporal_distribution.length; i++) {
                temporal_dis.push(temporal_distribution[i] * -frequence_patttern);
            }
            var motifs = Math.ceil(this.links[id].number_segmentation / frequence_patttern);
            this.links[id].number_particles = motifs * temporal_distribution.length;
            this.links[id].number_segmentation_pattern_fitting = (motifs * frequence_patttern);
            var total_for_pattern = 0;
            var id_particle = 0;
            var delay = 0;
            for (var k = 1; k < motifs + 1; k++) {
                total_for_pattern = 0;
                delay = frequence_patttern * (k - 1);
                for (var j = 0; j < temporal_distribution.length; j++) {
                    this.links[id].temporal_distribution[id_particle] = (delay + temporal_dis[j]);
                    total_for_pattern += delay + temporal_dis[j];
                    id_particle += 1;
                }
            }
            this.links[id].number_particles = this.links[id].temporal_distribution.length;
        };
        flownet.prototype.fit_to_frequence_temporal_distrib4 = function (id) {
            var temporal_distribution = this.links[id].temporal_distribution2;
            var nbParticlePer60Second = this.FPS * this.links[id].frequency_pattern;
            var motifsDansUnSegment = Math.ceil(this.links[id].number_segmentation / (this.links[id].gate_velocity[0] * 60));
            var numberSegmentationFit = this.links[id].gate_velocity[0] * 60 * motifsDansUnSegment;
            console.log("number_segmentation_pattern_fitting", numberSegmentationFit);
            var temporal_dis = [];
            for (var i = 0; i < temporal_distribution.length; i++) {
                temporal_dis.push(temporal_distribution[i] * -nbParticlePer60Second);
            }
            console.log(temporal_dis);
            var delayForTemporal = 0;
            for (var k = 1; k < numberSegmentationFit; k++) {
                delayForTemporal = 60 * k;
                for (var j = 0; j < nbParticlePer60Second; j++) {
                    console.log();
                }
            }
        };
        flownet.prototype.get_max_of_attributes = function (attribute_name) {
            var max_value = this.links[0].attr(attribute_name);
            for (var i = 1; i < this.links.length; i++) {
                var attr_value = this.links[i].attr(attribute_name);
                if (attr_value > max_value) {
                    max_value = attr_value;
                }
            }
            return max_value;
        };
        flownet.prototype.get_min_of_attributes = function (attribute_name) {
            var min_value = this.links[0].attr(attribute_name);
            for (var i = 1; i < this.links.length; i++) {
                var attr_value = this.links[i].attr(attribute_name);
                if (attr_value < min_value) {
                    min_value = attr_value;
                }
            }
            return min_value;
        };
        flownet.prototype.updateNumber_of_particles = function (i, coefficient) {
            this.links[i].coefficient_number_particles = coefficient;
        };
        flownet.prototype.updateNode_color = function (i, color) {
            this.webGL_nodes[i].material.color = color;
        };
        flownet.prototype.updateNodes_color = function (color) {
            for (var i = 0; i < this.nodes.length; i++) {
                this.webGL_nodes[i].material.color = color;
            }
        };
        flownet.prototype.getNode_position = function (i) {
            return this.webGL_nodes[i].position;
        };
        flownet.prototype.updateNode_position = function (i, x, y) {
            var array_links = [];
            this.webGL_nodes[i].position.set(x, y, 3);
            for (var j = 0; j < this.links.length; j++) {
                var l = this.links[j];
                if (l.source.id == i) {
                    l.source.x = x;
                    l.source.y = y;
                    array_links.push(j);
                }
                if (l.target.id == i) {
                    l.target.x = x;
                    l.target.y = y;
                    array_links.push(j);
                }
            }
            return array_links;
        };
        flownet.prototype.updateNodes_scale = function (scale) {
            for (var i = 0; i < this.nodes.length; i++) {
                this.webGL_nodes[i].scale.set(scale, scale, scale);
            }
        };
        flownet.prototype.updateNode_scale = function (i, scale) {
            this.webGL_nodes[i].scale.set(scale, scale, scale);
        };
        flownet.prototype.set_tube_width = function (id, width) {
            this.links[id].width_tube = width;
        };
        flownet.prototype.set_tube_color = function (id, color, opacity) {
            color = color.replace("#", "0x");
            this.tube[id].children[0].material.color.setHex(color);
            this.tube[id].children[0].material.opacity = opacity;
        };
        flownet.prototype.set_All_labels_opacity = function (opacity) {
            for (var i = 0; i < this.webGL_label.length; i++) {
                this.webGL_label[i].material.opacity = opacity;
            }
        };
        flownet.prototype.set_label_opacity = function (i, opacity) {
            this.webGL_label[i].material.opacity = opacity;
        };
        flownet.prototype.set_nodes_opacity = function (id, opacity) {
            this.webGL_nodes[id].material.opacity = opacity;
        };
        flownet.prototype.set_All_nodes_opacity = function (opacity) {
            for (var i = 0; i < this.webGL_nodes.length; i++) {
                this.webGL_nodes[i].material.opacity = opacity;
            }
        };
        flownet.prototype.set_All_tubes_opacity = function (opacity) {
            for (var i = 0; i < this.tube.length; i++) {
                this.tube[i].children[0].material.opacity = opacity;
            }
        };
        flownet.prototype.set_tube_opacity = function (id, opacity) {
            this.tube[id].children[0].material.opacity = opacity;
        };
        flownet.prototype.setTubesNormalOpacity = function () {
            for (var i = 0; i < this.tube.length; i++) {
                this.tube[i].children[0].material.opacity = this.links[i].tube_opacity;
            }
        };
        flownet.prototype.set_tubes_color = function (color) {
            for (var i = 0; i < this.links.length; i++) {
                this.tube[i].children[0].material.color.setHex(color);
            }
        };
        flownet.prototype.set_tubes_width = function (width) {
            for (var i = 0; i < this.links.length; i++) {
                this.links[i].width_tube = width;
            }
        };
        flownet.prototype.set_links_color = function (id, opacity) {
            for (var j = 0; j < this.curveSplines[id].children.length; j++) {
                this.curveSplines[id].children[j].material.opacity = opacity;
            }
        };
        flownet.prototype.load_particle_texture = function (link_id, value) {
            this.links[link_id].texture = value;
        };
        flownet.prototype.bezier = function (t, p0, p1, p2, p3) {
            var cX = 3 * (p1.x - p0.x), bX = 3 * (p2.x - p1.x) - cX, aX = p3.x - p0.x - cX - bX;
            var cY = 3 * (p1.y - p0.y), bY = 3 * (p2.y - p1.y) - cY, aY = p3.y - p0.y - cY - bY;
            var x = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t) + p0.x;
            var y = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t) + p0.y;
            return { x: x, y: y };
        };
        flownet.prototype.get_nodes = function () {
            var array = [];
            for (var j = 0; j < this.nodes.length; j++) {
                array.push({ "x": this.nodes[j].x, "y": -this.nodes[j].y, "fixed": true });
            }
            return array;
        };
        flownet.prototype.get_links = function () {
            var array = [];
            for (var j = 0; j < this.links.length; j++) {
                array.push({ "id": j,
                    "source": this.links[j].source.index,
                    "target": this.links[j].target.index,
                    "frequency": this.links[j].frequency_pattern,
                    "speed": this.links[j].speed,
                    "temporal": this.links[j].temporal_distribution2,
                    "rank": [] });
            }
            return array;
        };
        flownet.prototype.clockwiseSorting = function (input, basic) {
            var base = Math.atan2(input[basic][1], input[basic][0]);
            return input.sort(function (a, b) {
                return Math.atan2(b[1], b[0]) - Math.atan2(a[1], a[0]) + (Math.atan2(b[1], b[0]) > base ? -2 * Math.PI : 0) + (Math.atan2(a[1], a[0]) > base ? 2 * Math.PI : 0);
            });
        };
        ;
        return flownet;
    }());
    flownet_1.flownet = flownet;
})(flownet || (flownet = {}));
