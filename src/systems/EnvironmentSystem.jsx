import React, {forwardRef, memo, useEffect, useImperativeHandle, useMemo, useRef} from "react"
import {Environment, SoftShadows, useTexture} from "@react-three/drei";
import {useFrame} from "@react-three/fiber";
import * as THREE from "three";
import CustomShaderMaterial from "three-custom-shader-material";
import { snoise, toLinear } from 'shaderNoiseFunctions';


export const Skybox = memo(() => {

    const skyboxRef = useRef();
    const materialRef = useRef();

    // const {scene} = useThree()


    const map = useTexture('/content/70be267fbcf5503bfde5c20690fdc61d24f4be288f712c429b2d9d0c538c9f30i0')
    // const map = useTexture('/content/609bd3a127a1b73bd39691704bc1dabbefab7309c5c9f9d89bc578c63b7c8081i0')
    const map2 = useTexture('/content/60939768343608ff9735b61222ed452726237748fa4e46aa0e2a7982cd35afbai0')

    useEffect(() => {
        // console.log(scene)
        // scene.fog = new THREE.Fog(new THREE.Color(0, 0.4, 1), 500, 10000)
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.repeat.set(1, 1);
        // map.minFilter = minFilter;
        // map.magFilter = magFilter;
        map.encoding = THREE.sRGBEncoding;
        map.premultiplyAlpha = false;
        map.format = THREE.RGBAFormat
        map.anisotropy = 0
        map.needsUpdate = true;

        map2.wrapS = map2.wrapT = THREE.RepeatWrapping;
        map2.repeat.set(1, 1);
        // map.minFilter = minFilter;
        // map.magFilter = magFilter;
        map2.encoding = THREE.sRGBEncoding;
        map2.premultiplyAlpha = false;
        map2.format = THREE.RGBAFormat
        map2.anisotropy = 0
        map2.needsUpdate = true;
    }, [map, map2])


    useFrame((state) => {
        const material = materialRef.current;
        if (!material) return;

        if (state.clock.running) {
            material.uniforms.time.value = state.clock.elapsedTime;
        }


        if (window.playerPos) {
            skyboxRef.current.position.y = -5000 - (window.playerPos.y * 250)

        }

    })
    return (
        <mesh
            name={'skybox'}
            ref={skyboxRef}
            position={[0, -5000, 0]}
            rotation={[0, -1.5, 0]}
            scale={[900000, 900000, 900000]}
            renderOrder={0}
        >
            <sphereGeometry args={[1, 8, 8]} />
            <CustomShaderMaterial
                baseMaterial={THREE.MeshBasicMaterial}
                fog={false}
                side={THREE.BackSide}
                ref={materialRef}
                key={Math.random()}
                uniforms={{
                    playerPos: { value: new THREE.Vector3() },
                    playerDest: { value: new THREE.Vector3() },
                    time: { value: 0 },
                    map1: { value: map },
                    map2: { value: map2 },
                }}
                vertexShader={`
                    varying vec2 vUv;
                    
                    varying vec3 vPos;
                    void main() {
                        vUv = uv;
                        vPos = position;
                        csm_Position = position;
                    }
                `}
                fragmentShader={`
                    varying vec2 vUv;
                    uniform sampler2D map1;
                    uniform sampler2D map2;
                    uniform float time;
                    uniform vec3 playerPos;
                    varying vec3 vPos;
                   
                    ${toLinear}
                    ${snoise}

                    
void main() {
    vec2 uv = vUv;

    if (vPos.y < 0.0) {
        uv.y = 1.0 - vUv.y;  // basic mirror flip
    }
    
    
    if (vPos.y < 0.0) {
        uv.y = 1.0 - vUv.y;

        vec2 noisePos = vPos.xz * 12.0;
        noisePos.x += time * 0.3;

        float wave = snoise(noisePos);

        uv.x += wave * 0.005 * (smoothstep(0., -0.2, vPos.y));
        uv.y += wave * 0.005 * (smoothstep(0., -0.2, vPos.y));

    }

    vec4 tex1 = texture2D(map1, uv + vec2(time * 0.0012, 0.0));
    vec4 tex2 = texture2D(map2, uv + vec2(time * -0.0022, 0.0));

    vec3 color = vec3(0.0, 0.55, 0.95);

    color = mix(color, tex1.rgb, 0.4);
    color = mix(color, tex2.rgb, 0.3);

    if (vPos.y < 0.0) {
        color *= 0.8;
        color = mix(color, vec3(0.3, 0.8, 1.1), 0.2);
        // color = pow(color, vec3(1.2));
    }

    color = toLinear(vec4(color, 1.0)).rgb;

    csm_DiffuseColor.rgb = color;
}
                `}
            />
        </mesh>
    )
}, () => true)



export const Lights = forwardRef(({ azimuth = 150, elevation = 90, lightDistance = 20, ...props }, ref) => {
    const group = useRef();
    const targetRef = useRef();
    const directionalLightRef = useRef();
    const ambientLightRef = useRef();

    useEffect(() => {
        directionalLightRef.current.target = targetRef.current;
        window.dirLight = directionalLightRef.current;
        window.ambientLight = ambientLightRef.current;
    }, []);

    useFrame(() => {
        if (window.playerPos) {
            targetRef.current.position.set(
                window.playerPos.x,
                window.playerPos.y,
                window.playerPos.z
            );

            const azimuthRad = THREE.MathUtils.degToRad(azimuth);
            const elevationRad = THREE.MathUtils.degToRad(elevation);

            const cosElevation = Math.cos(elevationRad);
            const sinElevation = Math.sin(elevationRad);
            const cosAzimuth = Math.cos(azimuthRad);
            const sinAzimuth = Math.sin(azimuthRad);

            const offsetX = lightDistance * cosElevation * sinAzimuth;
            const offsetY = lightDistance * sinElevation;
            const offsetZ = lightDistance * cosElevation * cosAzimuth;

            group.current.position.set(
                window.playerPos.x + offsetX+11,
                window.playerPos.y + offsetY,
                window.playerPos.z + offsetZ+11
            );
        }
    });

    useImperativeHandle(ref, () => ({
        group,
        directionalLight: directionalLightRef,
        ambientLight: ambientLightRef,
    }));

    //todo env bake this full then just rotate only single texture version of skybox?
    return (
        <>
            <Environment near={1} background={false} far={1000000} resolution={256}
                         // files={'/content/8c4ea8f9fafef081345ba8a72c' + '08efed2373d0ba33ac92aca5f043071fc42909i0?.hdr'}
            >
                <Skybox />
            </Environment>
            <ambientLight ref={ambientLightRef} intensity={1} />
            <group ref={group}>
                <directionalLight
                    ref={directionalLightRef}
                    color={[1.2, 1, 0.9]}
                    intensity={0.75}
                    shadow-mapSize={[2048, 2048]}
                    // shadow-mapSize={[2048, 2048]}
                    shadow-camera-near={1}
                    shadow-camera-far={50}
                    shadow-camera-left={-20}
                    shadow-camera-right={20}
                    shadow-camera-top={20}
                    shadow-camera-bottom={-20}
                    castShadow
                />
            </group>
            <group ref={targetRef} />
        </>
    );
});


import {composable, modules} from "material-composer-r3f"
import {between, plusMinus} from "randomish"
import {Color, Vector3} from "three"
import {
    Emitter,
    InstancedParticles,
    useParticleAttribute,
    useParticleLifetime
} from "vfx-composer-r3f"
import {Gradient, Mul, Rotation3DY, Rotation3DZ} from "shader-composer";




const tmpVec3 = new Vector3()

export const Clouds = () => {

    const lifetime = useParticleLifetime()
    const velocity = useParticleAttribute(() => new Vector3())
    const color = useParticleAttribute(() => new Color())
    const rotation = useParticleAttribute(() => 0)
    const scale = useParticleAttribute(() => 0)

    const cloudsRef = useRef()

    useEffect(() => {
        window.cloudsRef = cloudsRef
    }, [])

    return (
        <InstancedParticles ref={cloudsRef} position={[0, 0, 0]} frustumCulled={false} capacity={1000} renderOrder={200}>
            <tetrahedronGeometry args={[2, 1]} />

            <composable.meshStandardMaterial
                roughness={0.99}
                // depthWrite={false}

                // normalMap={tex}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                // blending={THREE.AdditiveBlending}
                transparent
                opacity={0.02}
                // alphaMap={texture}
            >
                {/*<modules.Billboard />*/}
                <modules.Color color={Gradient(
                    lifetime.progress,
                    [new Color(0.0, 0.0, 0.0), 0.0],
                    [new Color(2, 1, 0.2), 0.5],
                    // [new Color(1.1, 1.2, 1.0), 0.5],
                    // [new Color(1.0, 1.0, 1.0), 0.9],
                    [new Color(0, 0.0, 0.0), 1],
                )}
                />
                {/*<modules.Texture texture={texture} />*/}
                {/*<modules.Billboard />*/}
                <modules.Rotate rotation={Rotation3DZ(Mul(lifetime.age, rotation))} />
                <modules.Rotate rotation={Rotation3DY(Mul(lifetime.age, rotation))} />

                <modules.Scale scale={scale} />
                <modules.Velocity direction={velocity} time={lifetime.age} />
                <modules.Acceleration
                    direction={new Vector3(5, -0.2, 2)}
                    time={lifetime.age}
                />
                <modules.Lifetime progress={lifetime.progress} />
                <modules.SurfaceWobble amplitude={1.4} frequency={0.1} />
            </composable.meshStandardMaterial>



            <Emitter
                rate={50}
                setup={({ mesh, position, rotation: rot }) => {
                    lifetime.write(mesh, between(4, 9))

                    if (!window.playerPos) {
                        window.playerPos = new THREE.Vector3()
                    }


                    position.x = window.playerPos.x + between(-3000, 3000)
                    position.y = between(400, 800)
                    position.z = window.playerPos.z + between(-3000, 3000)

                    // rotation.x = plusMinus(3)
                    // rotation.y = plusMinus(3)

                    rot.copy(new THREE.Quaternion().random())

                    rotation.write(mesh, plusMinus(0.05));
                    // rotation.write(mesh, plusMinus(0.03));
                    scale.write(mesh, between(50.0, 80.0));


                    velocity.write(mesh, (v) =>
                        v.set(plusMinus(0.5), between(-2, -1), plusMinus(0.5))
                    )
                }}
            />







        </InstancedParticles>
    )
}


export const Sparkles = () => {

    const lifetime = useParticleLifetime()
    const velocity = useParticleAttribute(() => new Vector3())
    const rotation = useParticleAttribute(() => 0)
    const scale = useParticleAttribute(() => 0)

    return (
        <InstancedParticles frustumCulled={false} capacity={1000} renderOrder={9}>
            <boxGeometry args={[1, 1, 1]} />
            {/*<tetrahedronGeometry args={[0.1, 1]} />*/}

            <composable.meshStandardMaterial
                roughness={0.99}
                // depthWrite={false}

                // normalMap={tex}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                // blending={THREE.AdditiveBlending}
                transparent
                opacity={0.3}
                // alphaMap={texture}
            >
                {/*<modules.Billboard />*/}
                <modules.Color color={Gradient(
                    lifetime.progress,
                    [new Color(0.0, 0.0, 0.0), 0.0],
                    [new Color(2, 0.3, 0), 0.5],
                    // [new Color(1.1, 1.2, 1.0), 0.5],
                    // [new Color(1.0, 1.0, 1.0), 0.9],
                    [new Color(0, 0.0, 0.0), 1],
                )}
                />
                {/*<modules.Texture texture={texture} />*/}
                {/*<modules.Billboard />*/}
                <modules.Rotate rotation={Rotation3DZ(Mul(lifetime.age, rotation))} />
                <modules.Rotate rotation={Rotation3DY(Mul(lifetime.age, rotation))} />

                <modules.Scale scale={scale} />
                <modules.Velocity direction={velocity} time={lifetime.age} />
                <modules.Acceleration
                    direction={new Vector3(-7, -0.2, 0)}
                    time={lifetime.age}
                />
                <modules.Lifetime progress={lifetime.progress} />
                {/*<modules.SurfaceWobble amplitude={1.4} frequency={0.1} />*/}
            </composable.meshStandardMaterial>



            <Emitter
                rate={100}
                setup={({ mesh, position, rotation: rot }) => {
                    lifetime.write(mesh, between(4, 9))

                    if (!window.playerPos) {
                        window.playerPos = new THREE.Vector3()
                    }

                    position.copy(window.playerPos || new THREE.Vector3())

                    position.x = window.playerPos.x + between(-200, 200)
                    position.y = window.playerPos.y + between(-200, 200)
                    position.z = window.playerPos.z + between(-200, 200)

                    // rotation.x = plusMinus(3)
                    // rotation.y = plusMinus(3)

                    rot.copy(new THREE.Quaternion().random())

                    rotation.write(mesh, plusMinus(10.5));
                    // rotation.write(mesh, plusMinus(0.03));
                    scale.write(mesh, between(0.4, 0.8));

                    velocity.write(mesh, (v) =>
                        v.set(plusMinus(2.5), between(-2, -1), plusMinus(2.5))
                    )
                }}
            />







        </InstancedParticles>
    )
}





export const EnvironmentSystem = () => {

    return (
        <>
            <Sparkles />
            <Skybox />
            <Clouds />
            <Lights />
        </>
    )
}
