import {snoise, iqnoise} from 'shaderNoiseFunctions'

const data = {

    terrain: {
        material: {
            // baseMaterial: THREE.MeshStandardMaterial,
            // roughness: 0,
            // metalness: 1,

            textures: [

                {
                    name: 'grass1c_tex',
                    src: '/content/ffffd8896b00f50266e3e590a0bdba4b07cd8815c17852e0666929a8d5c076aci0'
                },
                {
                    name: 'grass1ao_tex',
                    src: '/content/a0a0bb64a8aac923ccb68d76a54a7fa66ea29c7933292912b165e7bfc7158e8di0'
                },
                {
                    name: 'stones1_tex',
                    src: '/content/b33bca68fbf22491b83d631fa31bc2f32fddda4da8041e586cac32a5a32a072ci0'
                },
                {
                    name: 'stones1ao_tex',
                    src: '/content/a0396224b1409779d71f328d84732ea41c8cdbd1060e153e02e2b387fd1757d1i0'
                },
                {
                    name: 'road1c_tex',
                    src: '/content/dddd56c10b012f78ee862429de31f1c31f4b8d7792b9a69ac26bbff42ebb6b5di0'
                },
                {
                    name: 'baked1_tex',
                    bakeData: {
                        resolution: 512,
                        uniforms: {
                        },
                        frag: `

           ${snoise}
          uniform float time;
          varying vec2 vUv;

          void main() {
            vec3 color = vec3(1.0, 1.0, 1.0);

            float n1 = snoise(vUv * 999.);
            
            color.rgb = vec3(step(0.1, n1));

            gl_FragColor = vec4(color, 1.);
          }
                                        `
                    }
                },
                {
                    name: 'baked2_tex',
                    bakeData: {
                        resolution: 512,
                        uniforms: {
                        },
                        frag: `

           ${snoise}
           ${iqnoise}
         uniform float time;
          varying vec2 vUv;

          void main() {
            vec3 color = vec3(1.0, 1.0, 1.0);

            float n1 = fract(snoise(vUv * 80.));
            float n2 = fract(snoise(vUv * 9.));
            float n3 = fract(snoise(vUv * 4.));
            
            color.rgb = vec3(n1+n2);
            
            color.b = step(0.9, n3);

            gl_FragColor = vec4(color, 1.);
          }
                                        `
                    }
                }

            ],

            customFragmentShader: `
            
uniform sampler2D grass1c_tex;
uniform sampler2D grass1ao_tex;
uniform sampler2D road1c_tex;
uniform sampler2D baked1_tex;
uniform sampler2D baked2_tex;
uniform sampler2D stones1_tex;
uniform sampler2D stones1ao_tex;
                
                ${snoise}
            
void main() {
                    vec3 bake1 = texture2D(baked1_tex, (vUv * 25. + time * 0.004)).rgb;
                    vec3 bake2 = texture2D(baked1_tex, (vUv *0.6 + vec2(time * 0.002, 0.))).rgb;
                    // vec3 bake3 = texture2D(baked1_tex, (vUv * 0.5 + time * 0.002)).rgb;
                    
                    vec3 bakeBig = texture2D(baked2_tex, (vUv * 10.0)).rgb;
                    
                    vec3 grass1c = hexTexture(grass1c_tex, vUv * 100., 100.).rgb * 1.25;
                    color = grass1c;
                    
                    vec3 grass1ao = hexTexture(grass1ao_tex, vUv * 100., 100.).rgb;
                    color = mix(color, color * grass1ao.rgb, bake1.r + 0.7 * bake2);
                    
                    vec3 grass1c_big = hexTexture(grass1c_tex, vUv * 50., 33.).rgb * 0.5;
                    color -= bake2 * 0.03 * grass1c_big;

                    // color = mix(color, color * grass1c_big.rgb, 0.7);

                    color -= grass1c_big.grb * 0.7;


                    color = mix(color, vec3(0.5, 0.9, 1.7), smoothstep(10., 500., vPosition.y) * 0.2);

                    // color = mix(color, color * vNormal_world.y, 0.7);

                    vec3 stones1 = hexTexture(stones1_tex, vUv * 200., 100.).rgb;
                    vec3 stones1ao = hexTexture(stones1ao_tex, vUv * 200., 100.).rgb;

                vec3 path = mix(stones1, stones1 * stones1ao, (bake1.r * 2.4) * (bake2.r * 0.2)) * 0.8;
                



                    float dist = distance(vPosition.xz, playerPosition.xz);
                    

                color.g -= bakeBig.r * 0.05;
                
                    color = mix(color, color * (1. + grass1ao), smoothstep(8., 0., dist) * 0.2);
                    

                    color -= smoothstep(1.4, -0.4, dist) * 0.15;
                    

color.b *= 0.9;
color.r *= 0.9;

// color -= (1. - smoothstep(0., 60., vPosition.y)) * 0.1;
// color.b += (smoothstep(20., 100., vPosition.y)) * 0.1;
// color.rg += (smoothstep(70., 200., vPosition.y)) * 0.1;
// color -= (1. - smoothstep(0., 40., vPosition.y)) * 0.04;

                    color *= 1.6;
                    
                    
                  
vec3 bake3 = hexTexture(baked1_tex, vUv * 0.5 + (time * -0.001), 100.).rgb;
 

            `
        },


    },


}

export default data
