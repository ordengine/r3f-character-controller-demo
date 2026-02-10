import * as THREE from "three";
import { hexTexture } from "../../modules/shaderstuff.mjs";
import CustomShaderMaterial from "three-custom-shader-material";
import { toLinear } from "shaderNoiseFunctions";
import {useEffect, useMemo, useRef, useState} from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {useTexture} from "@react-three/drei";
import {bakeTexture} from "../../modules/textureCache.mjs";

const getFragShader = (customFrag) => {
    if (!customFrag) {
        console.log('nop')
        customFrag = 'void main() {vec3 color = vec3(0.9, 0.6, 0.0); float a = 1.0;'
    } else {
        customFrag = customFrag.replace(
            /void\s+main\s*\(\s*\)\s*{/,
            'void main() {vec3 color = vec3(0.5, 0.2, 0.0); float a = 1.0;'
        );
        customFrag = customFrag.replace(/\}\s*$/, '');
    }

    return `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormalWorld;
    varying vec3 vViewDirection;
    varying vec2 edgeDistance;
    varying float verticalFactor;
    
    uniform float lastRebaseTime;
    uniform float time;
    uniform vec3 playerPosition;
    ${hexTexture}
    ${toLinear}
    

      ${customFrag}
      
        
      
      // fog fade
      // float playerDistance = distance(vPosition.xz, playerPosition.xz);
      // color = mix(color, vec3(0.9, 0.9, 0.9), smoothstep(0., 2000., playerDistance) * 0.2);

      // opacity edge fade
      // a -= smoothstep(1500., 3000., abs(edgeDistance.x));
      // a -= smoothstep(1500., 3000., abs(edgeDistance.y));
      // a = clamp(a, 0.2, 1.0);

      // new chunk smooth fade-in
      // float rebaseDiff = clamp((time - lastRebaseTime) * 0.2, 0.0, 0.2);
      // if (edgeDistance.x > 3000.0 || edgeDistance.y > 3000.0) {
      //   a = rebaseDiff;
      // }

      csm_DiffuseColor.rgb = toLinear(vec4(clamp(color, 0.0, 1.0), 1.0)).rgb;
      csm_DiffuseColor.a = clamp(a, 0.0, 1.0);
    }
  `;
};

export const MaterialBuilder = ({ offsetX = 0, offsetY = 0, ...props }) => {
    const materialRef = useRef();
    const { gl, camera, scene } = useThree();


    const { terrain: {material} } = props;

    const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormalWorld;
    varying vec3 vViewDirection;
    varying vec2 edgeDistance;
    varying float verticalFactor;
    
    uniform vec2 offset; //just neededfor builder
    uniform vec3 playerPos;
    void main() {
      vUv = uv;
      
      //custom for builder single mesh offsets
      vPosition = (position + vec3(offset.x, -offset.y, 0.)).xzy;
      
      vNormalWorld = normalize(mat3(modelMatrix) * normal);
      vViewDirection = normalize(cameraPosition - vPosition);
      edgeDistance = vec2(abs(vPosition.x - playerPos.x), abs(vPosition.z - playerPos.z));
      verticalFactor = 1. - abs(vNormalWorld.y);
      
      csm_Position = position;
    }
  `;

    // Check fragment shader compilation and select shader
    const { finalFragmentShader } = useMemo(() => {
        // console.log(material.customFragmentShader)
        const fragmentShaderCustomAttempt = getFragShader(material.customFragmentShader);
        return { finalFragmentShader: fragmentShaderCustomAttempt };
    }, [material, offsetX, offsetY, gl]);

    useFrame((state) => {
        // if (!state.clock.running) {
        //     return
        // }
        if (materialRef.current?.uniforms?.time) {
            materialRef.current.uniforms.time.value = state.clock.elapsedTime;
        }
        if (window.playerPos && materialRef.current?.uniforms?.playerPosition) {
            materialRef.current.uniforms.playerPosition.value = {
                x: window.playerPos.x,
                y: window.playerPos.y,
                z: -window.playerPos.z,
            };
        }
    });

    const defaultCoinTex = '/content/cfab194b924f7785c6e453728e1c264b89b74843633278cda3ad3f57576c1e93i0'

    const texture0 = useTexture(material.textures?.[0]?.src || defaultCoinTex, texture => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.generateMipmaps = true;
        texture.encoding =  THREE.sRGBEncoding
        texture.anisotropy = 16
        texture.needsUpdate = true
    });
    const texture1 = useTexture(material.textures?.[1]?.src || defaultCoinTex, texture => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.generateMipmaps = true;
        texture.encoding =  THREE.sRGBEncoding
        texture.anisotropy = 16
        texture.needsUpdate = true
    });
    const texture2 = useTexture(material.textures?.[2]?.src || defaultCoinTex, texture => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.generateMipmaps = true;
        texture.encoding =  THREE.sRGBEncoding
        texture.anisotropy = 1
        texture.needsUpdate = true
    });
    const texture3 = useTexture(material.textures?.[3]?.src || defaultCoinTex, texture => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.generateMipmaps = true;
        texture.encoding =  THREE.sRGBEncoding
        texture.anisotropy = 1
        texture.needsUpdate = true
    });
    const texture4 = useTexture(material.textures?.[4]?.src || defaultCoinTex, texture => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.generateMipmaps = true;
        texture.encoding =  THREE.sRGBEncoding
        texture.anisotropy = 1
        texture.needsUpdate = true
    });
    const texture5 = useTexture(material.textures?.[5]?.src || defaultCoinTex, texture => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.generateMipmaps = true;
        texture.encoding =  THREE.sRGBEncoding
        texture.anisotropy = 1
        texture.needsUpdate = true
    });
    const texture6 = useTexture(material.textures?.[6]?.src || defaultCoinTex, texture => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.generateMipmaps = true;
        texture.encoding =  THREE.sRGBEncoding
        texture.anisotropy = 1
        texture.needsUpdate = true
    });
    const texture7 = useTexture(material.textures?.[7]?.src || defaultCoinTex, texture => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.generateMipmaps = true;
        texture.encoding =  THREE.sRGBEncoding
        texture.anisotropy = 1
        texture.needsUpdate = true
    });



    const [baked0, setBaked0] = useState(null)
    useEffect(() => {
        const getBaked0 = async () => {
            if (material.textures?.[0]?.bakeData) {
                const bakedTex = await bakeTexture(material.textures?.[0]?.name, material.textures?.[0]?.bakeData, gl, camera)
                setBaked0(bakedTex)
            }
        }
        getBaked0()
    }, [setBaked0, material])

    const [baked1, setBaked1] = useState(null)
    useEffect(() => {
        const getBaked1 = async () => {
            if (material.textures?.[1]?.bakeData) {
                const bakedTex = await bakeTexture(material.textures?.[1]?.name, material.textures?.[1]?.bakeData, gl, camera)
                setBaked1(bakedTex)
            }
        }
        getBaked1()
    }, [setBaked1, material])

    const [baked2, setBaked2] = useState(null)
    useEffect(() => {
        const getBaked2 = async () => {
            if (material.textures?.[2]?.bakeData) {
                const bakedTex = await bakeTexture(material.textures?.[2]?.name, material.textures?.[2]?.bakeData, gl, camera)
                setBaked2(bakedTex)
            }
        }
        getBaked2()
    }, [setBaked2, material])

    const [baked3, setBaked3] = useState(null)
    useEffect(() => {
        const getBaked3 = async () => {
            if (material.textures?.[3]?.bakeData) {
                const bakedTex = await bakeTexture(material.textures?.[3]?.name, material.textures?.[3]?.bakeData, gl, camera)
                setBaked3(bakedTex)
            }
        }
        getBaked3()
    }, [setBaked3, material])

    const [baked4, setBaked4] = useState(null)
    useEffect(() => {
        const getBaked4 = async () => {
            if (material.textures?.[4]?.bakeData) {
                const bakedTex = await bakeTexture(material.textures?.[4]?.name, material.textures?.[4]?.bakeData, gl, camera)
                setBaked4(bakedTex)
            }
        }
        getBaked4()
    }, [setBaked4, material])

    const [baked5, setBaked5] = useState(null)
    useEffect(() => {
        const getBaked5 = async () => {
            if (material.textures?.[5]?.bakeData) {
                const bakedTex = await bakeTexture(material.textures?.[5]?.name, material.textures?.[5]?.bakeData, gl, camera)
                setBaked5(bakedTex)
            }
        }
        getBaked5()
    }, [setBaked5, material])

    const [baked6, setBaked6] = useState(null)
    useEffect(() => {
        const getBaked6 = async () => {
            if (material.textures?.[6]?.bakeData) {
                const bakedTex = await bakeTexture(material.textures?.[6]?.name, material.textures?.[6]?.bakeData, gl, camera)
                setBaked6(bakedTex)
            }
        }
        getBaked6()
    }, [setBaked6, material])

    const [baked7, setBaked7] = useState(null)
    useEffect(() => {
        const getBaked7 = async () => {
            if (material.textures?.[7]?.bakeData) {
                const bakedTex = await bakeTexture(material.textures?.[7]?.name, material.textures?.[7]?.bakeData, gl, camera)
                setBaked7(bakedTex)
            }
        }
        getBaked7()
    }, [setBaked7, material])

    return (
        <CustomShaderMaterial
            baseMaterial={material.baseMaterial || THREE.MeshToonMaterial}
            color={"#000"}
            {...material}
            ref={materialRef}
            depthTest={true}
            depthWrite={true}
            transparent
            fog={false}
            key={`${material.customFragmentShader}`}
            uniforms={{
                offset: { value: [offsetX, offsetY] },
                playerPosition: { value: new THREE.Vector3() },
                time: { value: 0 },
                lastRebaseTime: { value: 0 },
                [material.textures?.[0]?.name || 'texture0']: {value: baked0 || texture0 },
                [material.textures?.[1]?.name || 'texture1']: {value: baked1 || texture1 },
                [material.textures?.[2]?.name || 'texture2']: {value: baked2 || texture2 },
                [material.textures?.[3]?.name || 'texture3']: {value: baked3 || texture3 },
                [material.textures?.[4]?.name || 'texture4']: {value: baked4 || texture4 },
                [material.textures?.[5]?.name || 'texture5']: {value: baked5 || texture5 },
                [material.textures?.[6]?.name || 'texture6']: {value: baked6 || texture6 },
                [material.textures?.[7]?.name || 'texture7']: {value: baked7 || texture7 },
            }}
            vertexShader={vertexShader}
            fragmentShader={finalFragmentShader}
        />
    );
};
