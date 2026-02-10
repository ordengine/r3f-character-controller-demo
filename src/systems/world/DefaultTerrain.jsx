import * as THREE from "three";
import {useTexture} from "@react-three/drei";
import {useEffect, useRef} from "react";
import {MaterialBuilder} from "./MaterialBuilder.jsx";

import {useCollider} from 'useCollider'
import currentData from "./biomes/biome1.mjs";


import {createNoise2D} from "simplex-noise";
import tooloud from "tooloud";
import alea from "alea";
import {InstancedGrassSystem} from "./InstancedGrassSystem.jsx";

window.noise = createNoise2D(alea(1));
tooloud.Worley.setSeed(1);
window.tooloud = tooloud


const getStableOffset = (worldX, worldZ, seed = 12345) => {
    const ix = Math.floor(worldX);
    const iz = Math.floor(worldZ);

    let hash = Math.abs((ix * 374761393 + iz * 668265263 + seed) | 0);
    hash ^= hash >> 16;
    hash *= 0x85ebca6b;
    hash ^= hash >> 13;
    hash *= 0xc2b2ae35;
    hash ^= hash >> 16;

    return (hash / 0xffffffff) * 3 - 1.0;
};

export const GrassFollower = () => {
    const lastCenter = useRef(new THREE.Vector3(-5000, 0, 0));

    const gridSize = 50;
    const halfSize = gridSize / 2;
    const cellSize = 1;
    const offsetStrength = 0.8;

    const moveThreshold = 5;



    useEffect(() => {

        const intt = setInterval(() => {
            if (!window.playerPos) return;

            const currentPos = new THREE.Vector3(
                window.playerPos.x,
                0,
                window.playerPos.z
            );

            if (currentPos.distanceTo(lastCenter.current) < moveThreshold) return;

            const centerX = Math.round(currentPos.x / cellSize) * cellSize;
            const centerZ = Math.round(currentPos.z / cellSize) * cellSize;

            const newCenter = new THREE.Vector3(centerX, 0, centerZ);

            if (newCenter.distanceTo(lastCenter.current) < 5) return;

            lastCenter.current.copy(newCenter);

            const positions = [];

            for (let i = -halfSize; i < halfSize; i++) {
                for (let j = -halfSize; j < halfSize; j++) {
                    const baseX = centerX + i * cellSize;
                    const baseZ = centerZ + j * cellSize;

                    if (baseX > 50 || baseX < -50 || baseZ > 50 || baseZ < -50) {
                        return
                    }

                    const offsetX = getStableOffset(baseX, baseZ, 12345) * offsetStrength;
                    const offsetZ = getStableOffset(baseX, baseZ, 67890) * offsetStrength;

                    const x = baseX + offsetX;
                    const z = baseZ + offsetZ;
                    const y = 0;

                    positions.push([x, y, z]);


                }
            }

            window.update_grass1(positions);
        }, 500);

        return () => {
            clearInterval(intt)
        }

    }, [])

    useEffect(() => {
        if (window.playerPos) {
            lastCenter.current.set(-10000, 0, 0); // force initial update
        }
    }, []);

    return null;
};







export const DefaultTerrain = ({offsetX = 0, offsetY = 0, worldOffsetX = -500, worldOffsetY = -500, resolution = 100}) => {

    const ref = useRef()

    useCollider(ref, null, true)
    //


    const tex = useTexture('/content/826ef7605750909f7d02c5717b7b366abfd527296c6789c1ded6b9860682c541i3')
    useEffect(() => {
        tex.flipY = false
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.magFilter = THREE.LinearFilter;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.generateMipmaps = true;
        tex.encoding = THREE.sRGBEncoding
        tex.anisotropy = 2
        tex.repeat.x = 10
        tex.repeat.y = 10
        tex.needsUpdate = true
    }, [tex])


    return (
        <>

            <GrassFollower />

            <InstancedGrassSystem />


            <group ref={ref} position={[0, 0, 0]} scale={1}

            >

                <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[100, 100, 1, 1]}/>
                    <MaterialBuilder  {...currentData} />
                </mesh>

                <mesh position={[0, -50.02, 0]} scale={[100, 100, 100]}>
                    <boxGeometry/>
                    <meshStandardMaterial metalness={-2} color={'#fff337'} map={tex}/>
                </mesh>

            </group>
        </>

    )
}
