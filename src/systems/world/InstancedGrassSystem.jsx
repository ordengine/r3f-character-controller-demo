import {useFrame} from "@react-three/fiber";
import React, {useCallback, useEffect, useMemo, useRef} from "react";
import * as THREE from "three";
import {toLinear, snoise} from "shaderNoiseFunctions";

import {useTexture} from "@react-three/drei";
import CustomShaderMaterial from "three-custom-shader-material";


const tileGeometry = new THREE.PlaneGeometry(1,1,1,2)
    // new BoxGeometry()
    // createGrassTriangleGeometry()
    // createGrassBladeGeometry()

const InstancedGrassSystemComponent = () => {
    const meshRef = useRef();
    const instancedGeometry = useRef();

    const materialRef = useRef()


    const lagPos = useRef(new THREE.Vector3())

    useFrame((state) => {
        if (window.playerPos && materialRef.current && state.clock.running) {
            const u = materialRef.current.uniforms;
            u.time.value = state.clock.elapsedTime;
            u.playerPosition.value = window.playerPos
            u.playerLagPos.value = lagPos.current
            lagPos.current.lerp(window.playerPos, 0.2)
            // console.log(lagPos.current)
        }
    });

    const updateGrassInstances = useCallback((grassInstances) => {
        // console.log('update::')
        // console.log((grassInstances))


        if (instancedGeometry.current) {
            let num = 0;

            grassInstances.forEach(grassInstance => {

                let x = grassInstance[0] || 0
                let y = grassInstance[1] || 0
                let z = grassInstance[2] || 0

                const scale = Math.abs(Math.sin(x-y*100000) * 0.1) + 0.1;

                instancedGeometry.current.attributes.worldPos.array[num] = x;
                instancedGeometry.current.attributes.worldPos.array[num + 1] = y;
                instancedGeometry.current.attributes.worldPos.array[num + 2] = z;
                instancedGeometry.current.attributes.worldPos.array[num + 3] = scale;

                num += 4;
            })

            instancedGeometry.current.instanceCount = num / 4;
            instancedGeometry.current.attributes.worldPos.needsUpdate = true;
        }


    }, [])

    useEffect(() => {
        window.update_grass1 = updateGrassInstances
    }, [updateGrassInstances])

    const tex = useTexture('data:image/webp;base64,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')

    useEffect(() => {
        tex.flipY = true
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.magFilter = THREE.LinearFilter;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.generateMipmaps = true;
        tex.encoding =  THREE.sRGBEncoding
        tex.anisotropy = 1
        tex.needsUpdate = true
    }, [tex])


    const uniforms = useMemo(() => ({
        time: { value: 0 },
        zoom: { value: 1 },
        playerPosition: { value: new THREE.Vector3(0, 0, 0) },
        playerLagPos: { value: new THREE.Vector3() },
        map1: { value: tex}
    }), [tex])

    const vert = useMemo(() => {
        return `
        uniform float time;
        attribute vec4 worldPos;
        varying vec2 vUv;
        varying vec4 vWorldPos;
        varying vec3 vPos;
        uniform vec3 playerPosition;
        uniform vec3 playerLagPos;

        ${snoise}

        void main() {
            vUv = uv;
            vPos = position;

            vec3 objectPos = worldPos.xyz;

            vec3 toCamera = normalize(cameraPosition - objectPos);

            float angle = -atan(toCamera.x, toCamera.z);
            mat3 yRotation = mat3(
                cos(angle),  0.0, sin(angle),
                0.,         1.0, 0.0,
                -sin(angle), 0.0, cos(angle)
            );
            
            vec3 scale = vec3(worldPos.w, worldPos.w*1.5, worldPos.w);
            vec3 finalPosition = objectPos + (yRotation * position  * scale + vec3(0., scale.y*0.5, 0.));
            
            
            
            
    float playerDist = distance(playerPosition, worldPos.xyz);
    float playerLagDist = distance(playerLagPos, worldPos.xyz);
    float moveGap = clamp(playerLagDist - playerDist, 0., 0.3);

    float maxDist = 0.9;
    float maxDisplacement = 3.1;

    if (playerDist < maxDist) {
        vec3 direction = normalize(worldPos.xyz - playerPosition);
        
        float strength = 0.2 + smoothstep(maxDist, -0.5, playerDist) * sin(moveGap * (time*0.004));
        
        finalPosition += direction * strength * maxDisplacement * (((position.y+0.5) * (position.y+0.5)));
    }
    
    
    
            
            if (position.y > -0.1) {
                
    float n1 = snoise(worldPos.xz * 5.4 + (time * 0.5));
    float n2 = abs( snoise(worldPos.xz * 0.01 + (time * 0.13)));

    finalPosition.x -= (n2 * 3. + n1) * (((position.y * position.y) +0.1) * 0.9);
            }

            vWorldPos = worldPos;
            csm_Position = finalPosition;
            // csm_Position = (position * sin(worldPos.x*worldPos.z*1000.) + vec3(0., 0.5, 0.)) + worldPos.xyz;
        }
    `
    })

    const frag = useMemo(() => {
        return `
        varying vec2 vUv;
        uniform sampler2D map1;
        uniform float time;
        uniform vec3 playerPosition;
        varying vec3 vPos;
        varying vec4 vWorldPos;

 
        ${toLinear}
        ${snoise}

        void main() {
        vec4 grass = texture2D(map1, vUv*0.95);
            vec3 color = grass.rgb * 1.0;
            color.r *= vWorldPos.w * 5.0;
            color.b *= 0.8;
            float a = grass.a;
            float dist = distance(vWorldPos.xyz, playerPosition.xyz);
            float camDist = distance(vWorldPos.xyz, cameraPosition.xyz);
            
            a -= smoothstep(0., 60., dist);
            
             if (camDist < 4.) {
                        a *= smoothstep(0., 4., camDist);
                    }
                    
            
            // color.r = vUv.x;
            // color.b = vUv.y;
            // color = vec3(0., 1., 0.);
            a = clamp(a, 0.0, 0.9);
            color = clamp(color, 0.0, 1.0);

            csm_DiffuseColor.rgb = toLinear(vec4(color, 1.0)).rgb;
            csm_DiffuseColor.a = a;
        }
    `
    })
    return (
        <mesh ref={meshRef} frustumCulled={false} renderOrder={90}>
            <instancedBufferGeometry
                name={'grass-instances'}
                ref={instancedGeometry}
                index={tileGeometry.index}
                attributes-position={tileGeometry.attributes.position}
                attributes-uv={tileGeometry.attributes.uv}
                instanceCount={0}
            >
                <instancedBufferAttribute
                    attach="attributes-worldPos"
                    args={[new Float32Array(new Array(10000 * 4).fill(0)), 4]}
                />
            </instancedBufferGeometry>
            <CustomShaderMaterial
                ref={materialRef}
                baseMaterial={THREE.MeshToonMaterial}
                transparent
                fog={false}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                uniforms={uniforms}
                vertexShader={vert}
                fragmentShader={frag}
            />


        </mesh>
    )
}

export const InstancedGrassSystem = React.memo(InstancedGrassSystemComponent)
