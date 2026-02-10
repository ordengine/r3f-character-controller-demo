import { useRef } from "react";
import { Instances, Instance } from "@react-three/drei";
import { useCollider } from "useCollider";
import {useFrame} from "@react-three/fiber";

export const BuildTestSystem = () => {
    const groupRef = useRef(null);

    const moveRef = useRef()

    useFrame(() => {
        moveRef.current.position.y = Math.abs(Math.sin(Date.now() * 0.0005) * 10)
    })

    useCollider(groupRef, null, false);

    return (
        <group ref={groupRef} position={[3, 0, -2]}>
            <Instances limit={5} castShadow receiveShadow>
                <boxGeometry />
                <meshStandardMaterial
                    roughness={0.4}
                    metalness={-0.1}
                    color="#ff9900"
                />

                <Instance
                    position={[4, 0.5, 11]}
                    scale={[5, 4, 5]}
                />
                <Instance
                    ref={moveRef}
                    position={[-4, 1.5, 11]}
                    scale={[5, 4, 5]}
                />
            </Instances>
        </group>
    );
};
