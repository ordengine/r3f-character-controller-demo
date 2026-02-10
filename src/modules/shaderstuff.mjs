export const hexTexture = `
                float hash(vec2 p) {
                    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
                }

                vec2 hex(vec2 p) {
                    const mat2 M = mat2(1.0, 0.0, 0.5, 0.86602540378);
                    p = M * p;
                    vec2 g = floor(p);
                    vec2 f = fract(p);
                    vec2 off;
                    if (f.x + f.y > 1.0) {
                        off = vec2(1.0, 1.0);
                    } else {
                        off = vec2(0.0, 0.0);
                    }
                    vec2 id = g + off;
                    return id;
                }
               
               vec4 hexTexture(sampler2D tex, vec2 uv, float jit) {
              
                    vec2 cell100 = hex(uv);
                    vec2 randOffset100 = vec2(
                        hash(cell100 + vec2(1.0, 0.0)),
                        hash(cell100 + vec2(0.0, 1.0))
                    ) * jit;
                    vec2 tileUV100 = fract(uv) + randOffset100;
                    vec2 ddxUv100 = dFdx(uv);
                    vec2 ddyUv100 = dFdy(uv);
                    vec2 ddxTileUV100 = ddxUv100;
                    vec2 ddyTileUV100 = ddyUv100;

                    return textureGrad(tex, tileUV100, ddxTileUV100, ddyTileUV100);
               }


`
