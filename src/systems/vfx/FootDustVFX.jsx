import { useFrame, useThree } from "@react-three/fiber";
import {useCallback, useEffect, useMemo, useRef} from "react";
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";



export const DamageNumberMaterial = shaderMaterial(
    {
        time: 0,
        zoom: 1,
        playerPos: new THREE.Vector3(),
        playerLagPos: new THREE.Vector3(),
        cameraPos: new THREE.Vector3(),
    },
    `
    uniform float time;
    uniform vec3 cameraPos;
    attribute vec4 worldPos;
    varying vec2 vUv;
    varying vec4 vWorldPos;

    void main() {
      vUv = uv.xy;
      vWorldPos = worldPos;
      
      float timeSinceSpawn = (time - worldPos.w);
      
      float initialVelocity = 11.0;
      float gravity = 60.0;
      float yOffset = initialVelocity * timeSinceSpawn - 0.5 * gravity * timeSinceSpawn * timeSinceSpawn;
      
      vec3 objectPos = worldPos.xyz;
      objectPos.y += yOffset * 0.4;
      objectPos.x += yOffset * sin(worldPos.w*1000.) * 0.2;
      objectPos.z += yOffset * sin(worldPos.w*8241.) * 0.2;
      
      vec3 toCamera = normalize(cameraPos - objectPos);
      vec3 up = vec3(0.0, 1.0, 0.0);
      vec3 right = normalize(cross(up, toCamera));
      up = normalize(cross(toCamera, right));
      
      mat3 billboardMatrix = mat3(
        right,
        up,
        toCamera
      );
      
      float scale = 0.1 + (yOffset*0.05);
      vec3 localPos = billboardMatrix * (position * scale);
      
      vec4 worldPosition = vec4(localPos + objectPos, 1.0);
      
      gl_Position = projectionMatrix * modelViewMatrix * worldPosition;
    }
  `,
    `
    uniform float time;
    uniform float zoom;
    uniform vec3 playerPos;
    uniform vec3 playerLagPos;
    varying vec2 vUv;
    varying vec4 vWorldPos;

    void main() {
      
      vec3 c = vec3(0.1, 0.4, 0.1)*0.5;
      float a = 0.8 * (1.5 - (time - vWorldPos.w));
      
      gl_FragColor = vec4(c, a);
    }
  `,
    (mat) => {
        mat.transparent = true;
        // mat.depthTest = false;
        mat.blending = THREE.AdditiveBlending;
    }
);

extend({ DamageNumberMaterial });

export const FootDustVFX = () => {
    const meshRef = useRef();
    const instancedGeometry = useRef();
    const damageNumberCache = useRef([]);
    const { clock, camera } = useThree();


    const geom = useMemo(() => new THREE.PlaneGeometry(1, 1), []);

    useFrame(() => {
        if (!meshRef.current || !instancedGeometry.current) return;

        const now = clock.elapsedTime;

        // Filter damage numbers older than 1 second
        damageNumberCache.current = damageNumberCache.current.filter(
            (dn) => now - dn.spawnTime < 1
        );

        // Update instance positions and number indices
        let num = 0;
        damageNumberCache.current.forEach((damageNumber) => {
            let x = damageNumber.x || 0;
            let y = damageNumber.y || 0;
            let z = damageNumber.z || 0;

            instancedGeometry.current.attributes.worldPos.array[num] = x;
            instancedGeometry.current.attributes.worldPos.array[num + 1] = 0;
            instancedGeometry.current.attributes.worldPos.array[num + 2] = z;
            instancedGeometry.current.attributes.worldPos.array[num + 3] = damageNumber.spawnTime;

            num += 4;
        });

        meshRef.current.material.uniforms.time.value = now;
        meshRef.current.material.uniforms.cameraPos.value.copy(camera.position);

        instancedGeometry.current.instanceCount = num / 4;
        instancedGeometry.current.attributes.worldPos.needsUpdate = true;
    });

    // useEffect(() => {
    //     const getid = async () => {
    //         console.log('idd')
    //         const idd = await getBitmapInscriptionId(100100)
    //
    //         console.log(idd)
    //     }
    //     getid()
    // })

    const addNum = useCallback(({position}) => {
        // console.log('add')
        const spawnTime = clock.elapsedTime;
        // Random number between 1 and 100
        // const numberIndex = (100 - Math.floor(Math.random() * 25)) + 1;
        damageNumberCache.current.push({
            x: (position.x || window.playerPos.x) + (Math.random() * 0.2),
            y: position.y ||( window.playerPos.y + 1.5),
            z: (position.z || window.playerPos.z) + (Math.random() * 0.2),
            spawnTime,
            // numberIndex,
        });

        let num = 0;
        damageNumberCache.current.forEach((damageNumber) => {
            let x = damageNumber.x || 0;
            let y = damageNumber.y || 0;
            let z = damageNumber.z || 0;

            instancedGeometry.current.attributes.worldPos.array[num] = x;
            instancedGeometry.current.attributes.worldPos.array[num + 1] = y;
            instancedGeometry.current.attributes.worldPos.array[num + 2] = z;
            instancedGeometry.current.attributes.worldPos.array[num + 3] = damageNumber.spawnTime;

            num += 4;
        });

        instancedGeometry.current.instanceCount = num / 4;
        instancedGeometry.current.attributes.worldPos.needsUpdate = true;
    }, [])

    useEffect(() => {
        window.addFootDust = addNum
        const handleKeyDown = (e) => {
            if (e.key === "i" && instancedGeometry.current) {
                addNum({position: window.playerPos})
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [addNum]);

    return (
        <mesh ref={meshRef} frustumCulled={false} renderOrder={500}>
            <instancedBufferGeometry
                name="foot-dust-vfx"
                ref={instancedGeometry}
                index={geom.index}
                attributes-position={geom.attributes.position}
                attributes-uv={geom.attributes.uv}
                instanceCount={0}
            >
                <instancedBufferAttribute
                    attach="attributes-worldPos"
                    args={[new Float32Array(new Array(200 * 4).fill(0)), 4]}
                />
                <instancedBufferAttribute
                    attach="attributes-numberIndex"
                    args={[new Float32Array(new Array(200).fill(0)), 1]}
                />
            </instancedBufferGeometry>
            <damageNumberMaterial />
        </mesh>
    );
};
