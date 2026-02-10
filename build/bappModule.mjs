import * as THREE from 'three';
import CustomShaderMaterial from 'three-custom-shader-material';
import React, { Suspense, createElement, forwardRef, memo, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { AnimationMixer, Group, LoopOnce } from 'three';
import { BrightnessContrast, EffectComposer, HueSaturation, SMAA } from '@react-three/postprocessing';
import { CameraControls, Environment, Instance, Instances, Loader, SoftShadows, TorusKnot, shaderMaterial, useTexture } from '@react-three/drei';
import { DRACOLoader, GLTFLoader } from 'gltfAndDraco';
import { ECS, useGUI } from 'ecs';
import { Emitter, InstancedParticles, useParticleAttribute, useParticleLifetime } from 'vfx-composer-r3f';
import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { Gradient, Mul, Rotation3DY, Rotation3DZ } from 'shader-composer';
import { QUATERNIUS_ANIMATIONS_1, QUATERNIUS_ANIMATIONS_2, WorldLoader } from 'world-tools-1';
import { VRMAnimationLoaderPlugin, VRMLookAtQuaternionProxy, createVRMAnimationClip } from '@pixiv/three-vrm-animation';
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import { between, plusMinus } from 'randomish';
import { colliderStore, useCollider } from 'useCollider';
import { composable, modules } from 'material-composer-r3f';
import { createNoise2D } from 'simplex-noise';
import { extend, useFrame, useThree } from '@react-three/fiber';
import { getPerf } from 'r3f-perf';
import { loadMixamoAnimation } from 'vrm-utils';
import { makeStore, useStore } from 'statery';
import { snoise, toLinear } from 'shaderNoiseFunctions';
import { useDrag } from '@use-gesture/react';
import { useEntities } from 'miniplex-react';
import { useSpring } from '@react-spring/web';





///// component: components/Joystick.jsx 
///// JSX source:
///
// import React, {useRef} from 'react';
// import {useDrag} from '@use-gesture/react';
// 
// export const Joystick = () => {
//     const handleRef = useRef(null);
// 
//     const maxDistance = 50;
//     const setWindowDir = (angleDeg) => {
//         let dir = '';
// 
//         if (angleDeg >= -22.5 && angleDeg < 22.5) {
//             dir = 'right';
//         } else if (angleDeg >= 22.5 && angleDeg < 67.5) {
//             dir = 'downright';
//         } else if (angleDeg >= 67.5 && angleDeg < 112.5) {
//             dir = 'down';
//         } else if (angleDeg >= 112.5 && angleDeg < 157.5) {
//             dir = 'downleft';
//         } else if (angleDeg >= 157.5 || angleDeg < -157.5) {
//             dir = 'left';
//         } else if (angleDeg >= -157.5 && angleDeg < -112.5) {
//             dir = 'upleft';
//         } else if (angleDeg >= -112.5 && angleDeg < -67.5) {
//             dir = 'up';
//         } else if (angleDeg >= -67.5 && angleDeg < -22.5) {
//             dir = 'upright';
//         }
// 
//         window.dir = dir;
//     };
// 
//     // Configure useDrag
//     const bind = useDrag(
//         ({movement: [mx, my], down, event}) => {
//             event.preventDefault();
//             event.stopPropagation();
// 
//             let newX = mx;
//             let newY = my;
// 
//             const distance = Math.hypot(newX, newY);
// 
//             if (distance > maxDistance) {
//                 const angle = Math.atan2(newY, newX);
//                 newX = Math.cos(angle) * maxDistance;
//                 newY = Math.sin(angle) * maxDistance;
//             }
// 
//             if (handleRef.current) {
//                 handleRef.current.style.transform = `translate3d(${newX}px, ${newY}px, 0) translate(-50%, -50%)`;
//             }
// 
//             if (distance > 10) {
//                 const angleDeg = (Math.atan2(newY, newX) * 180) / Math.PI;
//                 setWindowDir(angleDeg);
//             } else {
//                 window.dir = '';
//             }
// 
//             if (!down) {
//                 if (handleRef.current) {
//                     handleRef.current.style.transform = 'translate3d(0px, 0px, 0) translate(-50%, -50%)';
//                 }
//                 window.dir = '';
//             }
//         },
//         {
//             from: () => [0, 0],
//             preventDefault: true,
//             eventOptions: {passive: false}
//         }
//     );
// 
// 
// 
//     return (
//         <>
//             {
//                 <div
//                     className={`w-[120px] h-[120px] border-4 border-opacity-20 hover:border-opacity-80 border-orange-400 bg-neutral-800 bg-opacity-20 rounded-sm`}
//                     style={{ touchAction: 'none' }}
//                 >
// 
//                     <div
//                         {...bind()}
//                         ref={handleRef}
//                         className="ring-4 ring-black ring-opacity-10 cursor-crosshair joystick-handle absolute left-1/2 top-1/2 w-[80px] h-[80px] bg-orange-400 rounded-sm"
//                         style={{
//                             transform: 'translate3d(0px, 0px, 0) translate(-50%, -50%)',
//                             touchAction: 'none',
//                             userSelect: 'none',
//                             willChange: 'transform',
//                         }}
//                     >
// 
//                         <div className="absolute left-1/2 -top-1 transform -translate-x-1/2 text-orange-300 text-lg">
//                             ▲
//                         </div>
//                         <div className="absolute right-0.5 top-1/2 transform -translate-y-1/2 text-orange-300 text-lg">
//                             ▶
//                         </div>
//                         <div className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 text-orange-300 text-lg">
//                             ▼
//                         </div>
//                         <div className="absolute left-0.5 top-1/2 transform -translate-y-1/2 text-orange-300 text-lg">
//                             ◀
//                         </div>
// 
//                     </div>
//                 </div>
//             }
//         </>
//     );
// };
// 

export const Joystick = () => {
  const handleRef = useRef(null);
  const maxDistance = 50;
  const setWindowDir = angleDeg => {
    let dir = '';
    if (angleDeg >= -22.5 && angleDeg < 22.5) {
      dir = 'right';
    } else if (angleDeg >= 22.5 && angleDeg < 67.5) {
      dir = 'downright';
    } else if (angleDeg >= 67.5 && angleDeg < 112.5) {
      dir = 'down';
    } else if (angleDeg >= 112.5 && angleDeg < 157.5) {
      dir = 'downleft';
    } else if (angleDeg >= 157.5 || angleDeg < -157.5) {
      dir = 'left';
    } else if (angleDeg >= -157.5 && angleDeg < -112.5) {
      dir = 'upleft';
    } else if (angleDeg >= -112.5 && angleDeg < -67.5) {
      dir = 'up';
    } else if (angleDeg >= -67.5 && angleDeg < -22.5) {
      dir = 'upright';
    }
    window.dir = dir;
  };

  // Configure useDrag
  const bind = useDrag(({
    movement: [mx, my],
    down,
    event
  }) => {
    event.preventDefault();
    event.stopPropagation();
    let newX = mx;
    let newY = my;
    const distance = Math.hypot(newX, newY);
    if (distance > maxDistance) {
      const angle = Math.atan2(newY, newX);
      newX = Math.cos(angle) * maxDistance;
      newY = Math.sin(angle) * maxDistance;
    }
    if (handleRef.current) {
      handleRef.current.style.transform = `translate3d(${newX}px, ${newY}px, 0) translate(-50%, -50%)`;
    }
    if (distance > 10) {
      const angleDeg = Math.atan2(newY, newX) * 180 / Math.PI;
      setWindowDir(angleDeg);
    } else {
      window.dir = '';
    }
    if (!down) {
      if (handleRef.current) {
        handleRef.current.style.transform = 'translate3d(0px, 0px, 0) translate(-50%, -50%)';
      }
      window.dir = '';
    }
  }, {
    from: () => [0, 0],
    preventDefault: true,
    eventOptions: {
      passive: false
    }
  });
  return /*#__PURE__*/_jsx(_Fragment, {
    children: /*#__PURE__*/_jsx("div", {
      className: `w-[120px] h-[120px] border-4 border-opacity-20 hover:border-opacity-80 border-orange-400 bg-neutral-800 bg-opacity-20 rounded-sm`,
      style: {
        touchAction: 'none'
      },
      children: /*#__PURE__*/_jsxs("div", {
        ...bind(),
        ref: handleRef,
        className: "ring-4 ring-black ring-opacity-10 cursor-crosshair joystick-handle absolute left-1/2 top-1/2 w-[80px] h-[80px] bg-orange-400 rounded-sm",
        style: {
          transform: 'translate3d(0px, 0px, 0) translate(-50%, -50%)',
          touchAction: 'none',
          userSelect: 'none',
          willChange: 'transform'
        },
        children: [/*#__PURE__*/_jsx("div", {
          className: "absolute left-1/2 -top-1 transform -translate-x-1/2 text-orange-300 text-lg",
          children: "\u25B2"
        }), /*#__PURE__*/_jsx("div", {
          className: "absolute right-0.5 top-1/2 transform -translate-y-1/2 text-orange-300 text-lg",
          children: "\u25B6"
        }), /*#__PURE__*/_jsx("div", {
          className: "absolute left-1/2 -bottom-1 transform -translate-x-1/2 text-orange-300 text-lg",
          children: "\u25BC"
        }), /*#__PURE__*/_jsx("div", {
          className: "absolute left-0.5 top-1/2 transform -translate-y-1/2 text-orange-300 text-lg",
          children: "\u25C0"
        })]
      })
    })
  });
};






///// component: systems/AudioSystem.jsx 
///// JSX source:
///
// import {useEffect, useLayoutEffect} from "react";
// const volStep = new Tone.Volume(-15).toDestination(); // For slash sound (full volume)
// 
// 
// window.sounds = {}
// 
// window.sounds.jump1 = new Tone.Sampler({
//     urls: {
//         A1: "c1c1b5b643891c559a19508f424aa0f7530d71c5dd16d3f31200e58a1019b05ci0",
//     },
//     baseUrl: "/content/",
//     onload: () => {
//         // window.step1.triggerAttackRelease(["C1", "E1", "G1", "B1"], 0.5);
//     }
// }).connect(volStep)
// 
// window.sounds.step1 = new Tone.Sampler({
//     urls: {
//         A1: "f1f180d020e64e0fe921028527b575f73209a8574efba83b3c233888566a1ce3i0",
//         // A1: "footstep05.ogg",
//     },
//     baseUrl: "/content/",
//     onload: () => {
//         // window.step1.triggerAttackRelease(["C1", "E1", "G1", "B1"], 0.5);
//     }
// }).connect(volStep)
// 
// 
// export const AudioSystem = () => {
// 
//     useLayoutEffect(() => {
//         async function start() {
//             try {
//                 await Tone.start()
//                 console.log('tonejs started');
// 
//                 // loopTest()
//             } catch (err) {
//                 console.error('error starting audio:', err);
//             }
//         }
// 
//         window.start = start
// 
//     }, [])
// 
//     return null
// }
// 

const volStep = new Tone.Volume(-15).toDestination(); // For slash sound (full volume)

window.sounds = {};
window.sounds.jump1 = new Tone.Sampler({
  urls: {
    A1: "c1c1b5b643891c559a19508f424aa0f7530d71c5dd16d3f31200e58a1019b05ci0"
  },
  baseUrl: "/content/",
  onload: () => {
    // window.step1.triggerAttackRelease(["C1", "E1", "G1", "B1"], 0.5);
  }
}).connect(volStep);
window.sounds.step1 = new Tone.Sampler({
  urls: {
    A1: "f1f180d020e64e0fe921028527b575f73209a8574efba83b3c233888566a1ce3i0"
    // A1: "footstep05.ogg",
  },
  baseUrl: "/content/",
  onload: () => {
    // window.step1.triggerAttackRelease(["C1", "E1", "G1", "B1"], 0.5);
  }
}).connect(volStep);
export const AudioSystem = () => {
  useLayoutEffect(() => {
    async function start() {
      try {
        await Tone.start();
        console.log('tonejs started');

        // loopTest()
      } catch (err) {
        console.error('error starting audio:', err);
      }
    }
    window.start = start;
  }, []);
  return null;
};






///// component: systems/BuildTestSystem.jsx 
///// JSX source:
///
// import { useRef } from "react";
// import { Instances, Instance } from "@react-three/drei";
// import { useCollider } from "useCollider";
// import {useFrame} from "@react-three/fiber";
// 
// export const BuildTestSystem = () => {
//     const groupRef = useRef(null);
// 
//     const moveRef = useRef()
// 
//     useFrame(() => {
//         moveRef.current.position.y = Math.abs(Math.sin(Date.now() * 0.0005) * 10)
//     })
// 
//     useCollider(groupRef, null, false);
// 
//     return (
//         <group ref={groupRef} position={[3, 0, -2]}>
//             <Instances limit={5} castShadow receiveShadow>
//                 <boxGeometry />
//                 <meshStandardMaterial
//                     roughness={0.4}
//                     metalness={-0.1}
//                     color="#ff9900"
//                 />
// 
//                 <Instance
//                     position={[4, 0.5, 11]}
//                     scale={[5, 4, 5]}
//                 />
//                 <Instance
//                     ref={moveRef}
//                     position={[-4, 1.5, 11]}
//                     scale={[5, 4, 5]}
//                 />
//             </Instances>
//         </group>
//     );
// };
// 

export const BuildTestSystem = () => {
  const groupRef = useRef(null);
  const moveRef = useRef();
  useFrame(() => {
    moveRef.current.position.y = Math.abs(Math.sin(Date.now() * 0.0005) * 10);
  });
  useCollider(groupRef, null, false);
  return /*#__PURE__*/_jsx("group", {
    ref: groupRef,
    position: [3, 0, -2],
    children: /*#__PURE__*/_jsxs(Instances, {
      limit: 5,
      castShadow: true,
      receiveShadow: true,
      children: [/*#__PURE__*/_jsx("boxGeometry", {}), /*#__PURE__*/_jsx("meshStandardMaterial", {
        roughness: 0.4,
        metalness: -0.1,
        color: "#ff9900"
      }), /*#__PURE__*/_jsx(Instance, {
        position: [4, 0.5, 11],
        scale: [5, 4, 5]
      }), /*#__PURE__*/_jsx(Instance, {
        ref: moveRef,
        position: [-4, 1.5, 11],
        scale: [5, 4, 5]
      })]
    })
  });
};






///// component: systems/DefaultCameraSystem.jsx 
///// JSX source:
///
// import {CameraControls} from "@react-three/drei";
// import {useEffect, useRef} from "react";
// import {useFrame} from "@react-three/fiber";
// 
// export const DefaultCameraSystem = () => {
// 
//     const cameraControlsRef = useRef()
// 
//     useEffect(() => {
//         const controls = cameraControlsRef.current;
//         if (!controls) return;
//         window.cam = controls;
// 
//         controls.dollyTo(3, false)
//         controls.moveTo(0, 1, 0, false)
//         controls.rotateTo(-0.5, Math.PI/2 + 0.1, false)
//         controls.minDistance = 1.5;
//         controls.maxDistance = 100;
//         controls.draggingSmoothTime = 0.015;
//         controls.smoothTime = 0.2;
//         controls.dollySpeed = 0.9;
// 
//         if (window.buildData) {
// 
//             window.cam.dollyTo(4, true)
//             window.cam.rotateTo(Math.PI, 1.2, true)
//         }
// 
//         // controls.maxPolarAngle = 2.2;
// 
//         controls.mouseButtons.right = 1
// 
//     }, [])
// 
//     useFrame(() => {
// 
//         if (!window.started) {
//             // cameraControlsRef.current.rotate(0.001, 0, true)
//         }
// 
//         if (cameraControlsRef.current.camera.position.y < 0.2) {
//             cameraControlsRef.current.camera.position.y = 0.2
//         }
//     })
// 
//     return (
//         <CameraControls makeDefault ref={cameraControlsRef} />
//     )
// }
// 

export const DefaultCameraSystem = () => {
  const cameraControlsRef = useRef();
  useEffect(() => {
    const controls = cameraControlsRef.current;
    if (!controls) return;
    window.cam = controls;
    controls.dollyTo(3, false);
    controls.moveTo(0, 1, 0, false);
    controls.rotateTo(-0.5, Math.PI / 2 + 0.1, false);
    controls.minDistance = 1.5;
    controls.maxDistance = 100;
    controls.draggingSmoothTime = 0.015;
    controls.smoothTime = 0.2;
    controls.dollySpeed = 0.9;
    if (window.buildData) {
      window.cam.dollyTo(4, true);
      window.cam.rotateTo(Math.PI, 1.2, true);
    }

    // controls.maxPolarAngle = 2.2;

    controls.mouseButtons.right = 1;
  }, []);
  useFrame(() => {
    if (!window.started) {
      // cameraControlsRef.current.rotate(0.001, 0, true)
    }
    if (cameraControlsRef.current.camera.position.y < 0.2) {
      cameraControlsRef.current.camera.position.y = 0.2;
    }
  });
  return /*#__PURE__*/_jsx(CameraControls, {
    makeDefault: true,
    ref: cameraControlsRef
  });
};






///// component: systems/EnvironmentSystem.jsx 
///// JSX source:
///
// import React, {forwardRef, memo, useEffect, useImperativeHandle, useMemo, useRef} from "react"
// import {Environment, SoftShadows, useTexture} from "@react-three/drei";
// import {useFrame} from "@react-three/fiber";
// import * as THREE from "three";
// import CustomShaderMaterial from "three-custom-shader-material";
// import { snoise, toLinear } from 'shaderNoiseFunctions';
// 
// 
// export const Skybox = memo(() => {
// 
//     const skyboxRef = useRef();
//     const materialRef = useRef();
// 
//     // const {scene} = useThree()
// 
// 
//     const map = useTexture('/content/70be267fbcf5503bfde5c20690fdc61d24f4be288f712c429b2d9d0c538c9f30i0')
//     // const map = useTexture('/content/609bd3a127a1b73bd39691704bc1dabbefab7309c5c9f9d89bc578c63b7c8081i0')
//     const map2 = useTexture('/content/60939768343608ff9735b61222ed452726237748fa4e46aa0e2a7982cd35afbai0')
// 
//     useEffect(() => {
//         // console.log(scene)
//         // scene.fog = new THREE.Fog(new THREE.Color(0, 0.4, 1), 500, 10000)
//         map.wrapS = map.wrapT = THREE.RepeatWrapping;
//         map.repeat.set(1, 1);
//         // map.minFilter = minFilter;
//         // map.magFilter = magFilter;
//         map.encoding = THREE.sRGBEncoding;
//         map.premultiplyAlpha = false;
//         map.format = THREE.RGBAFormat
//         map.anisotropy = 0
//         map.needsUpdate = true;
// 
//         map2.wrapS = map2.wrapT = THREE.RepeatWrapping;
//         map2.repeat.set(1, 1);
//         // map.minFilter = minFilter;
//         // map.magFilter = magFilter;
//         map2.encoding = THREE.sRGBEncoding;
//         map2.premultiplyAlpha = false;
//         map2.format = THREE.RGBAFormat
//         map2.anisotropy = 0
//         map2.needsUpdate = true;
//     }, [map, map2])
// 
// 
//     useFrame((state) => {
//         const material = materialRef.current;
//         if (!material) return;
// 
//         if (state.clock.running) {
//             material.uniforms.time.value = state.clock.elapsedTime;
//         }
// 
// 
//         if (window.playerPos) {
//             skyboxRef.current.position.y = -5000 - (window.playerPos.y * 250)
// 
//         }
// 
//     })
//     return (
//         <mesh
//             name={'skybox'}
//             ref={skyboxRef}
//             position={[0, -5000, 0]}
//             rotation={[0, -1.5, 0]}
//             scale={[900000, 900000, 900000]}
//             renderOrder={0}
//         >
//             <sphereGeometry args={[1, 8, 8]} />
//             <CustomShaderMaterial
//                 baseMaterial={THREE.MeshBasicMaterial}
//                 fog={false}
//                 side={THREE.BackSide}
//                 ref={materialRef}
//                 key={Math.random()}
//                 uniforms={{
//                     playerPos: { value: new THREE.Vector3() },
//                     playerDest: { value: new THREE.Vector3() },
//                     time: { value: 0 },
//                     map1: { value: map },
//                     map2: { value: map2 },
//                 }}
//                 vertexShader={`
//                     varying vec2 vUv;
//                     
//                     varying vec3 vPos;
//                     void main() {
//                         vUv = uv;
//                         vPos = position;
//                         csm_Position = position;
//                     }
//                 `}
//                 fragmentShader={`
//                     varying vec2 vUv;
//                     uniform sampler2D map1;
//                     uniform sampler2D map2;
//                     uniform float time;
//                     uniform vec3 playerPos;
//                     varying vec3 vPos;
//                    
//                     ${toLinear}
//                     ${snoise}
// 
//                     
// void main() {
//     vec2 uv = vUv;
// 
//     if (vPos.y < 0.0) {
//         uv.y = 1.0 - vUv.y;  // basic mirror flip
//     }
//     
//     
//     if (vPos.y < 0.0) {
//         uv.y = 1.0 - vUv.y;
// 
//         vec2 noisePos = vPos.xz * 12.0;
//         noisePos.x += time * 0.3;
// 
//         float wave = snoise(noisePos);
// 
//         uv.x += wave * 0.005 * (smoothstep(0., -0.2, vPos.y));
//         uv.y += wave * 0.005 * (smoothstep(0., -0.2, vPos.y));
// 
//     }
// 
//     vec4 tex1 = texture2D(map1, uv + vec2(time * 0.0012, 0.0));
//     vec4 tex2 = texture2D(map2, uv + vec2(time * -0.0022, 0.0));
// 
//     vec3 color = vec3(0.0, 0.55, 0.95);
// 
//     color = mix(color, tex1.rgb, 0.4);
//     color = mix(color, tex2.rgb, 0.3);
// 
//     if (vPos.y < 0.0) {
//         color *= 0.8;
//         color = mix(color, vec3(0.3, 0.8, 1.1), 0.2);
//         // color = pow(color, vec3(1.2));
//     }
// 
//     color = toLinear(vec4(color, 1.0)).rgb;
// 
//     csm_DiffuseColor.rgb = color;
// }
//                 `}
//             />
//         </mesh>
//     )
// }, () => true)
// 
// 
// 
// export const Lights = forwardRef(({ azimuth = 150, elevation = 90, lightDistance = 20, ...props }, ref) => {
//     const group = useRef();
//     const targetRef = useRef();
//     const directionalLightRef = useRef();
//     const ambientLightRef = useRef();
// 
//     useEffect(() => {
//         directionalLightRef.current.target = targetRef.current;
//         window.dirLight = directionalLightRef.current;
//         window.ambientLight = ambientLightRef.current;
//     }, []);
// 
//     useFrame(() => {
//         if (window.playerPos) {
//             targetRef.current.position.set(
//                 window.playerPos.x,
//                 window.playerPos.y,
//                 window.playerPos.z
//             );
// 
//             const azimuthRad = THREE.MathUtils.degToRad(azimuth);
//             const elevationRad = THREE.MathUtils.degToRad(elevation);
// 
//             const cosElevation = Math.cos(elevationRad);
//             const sinElevation = Math.sin(elevationRad);
//             const cosAzimuth = Math.cos(azimuthRad);
//             const sinAzimuth = Math.sin(azimuthRad);
// 
//             const offsetX = lightDistance * cosElevation * sinAzimuth;
//             const offsetY = lightDistance * sinElevation;
//             const offsetZ = lightDistance * cosElevation * cosAzimuth;
// 
//             group.current.position.set(
//                 window.playerPos.x + offsetX+11,
//                 window.playerPos.y + offsetY,
//                 window.playerPos.z + offsetZ+11
//             );
//         }
//     });
// 
//     useImperativeHandle(ref, () => ({
//         group,
//         directionalLight: directionalLightRef,
//         ambientLight: ambientLightRef,
//     }));
// 
//     //todo env bake this full then just rotate only single texture version of skybox?
//     return (
//         <>
//             <Environment near={1} background={false} far={1000000} resolution={256}
//                          // files={'/content/8c4ea8f9fafef081345ba8a72c' + '08efed2373d0ba33ac92aca5f043071fc42909i0?.hdr'}
//             >
//                 <Skybox />
//             </Environment>
//             <ambientLight ref={ambientLightRef} intensity={1} />
//             <group ref={group}>
//                 <directionalLight
//                     ref={directionalLightRef}
//                     color={[1.2, 1, 0.9]}
//                     intensity={0.75}
//                     shadow-mapSize={[2048, 2048]}
//                     // shadow-mapSize={[2048, 2048]}
//                     shadow-camera-near={1}
//                     shadow-camera-far={50}
//                     shadow-camera-left={-20}
//                     shadow-camera-right={20}
//                     shadow-camera-top={20}
//                     shadow-camera-bottom={-20}
//                     castShadow
//                 />
//             </group>
//             <group ref={targetRef} />
//         </>
//     );
// });
// 
// 
// import {composable, modules} from "material-composer-r3f"
// import {between, plusMinus} from "randomish"
// import {Color, Vector3} from "three"
// import {
//     Emitter,
//     InstancedParticles,
//     useParticleAttribute,
//     useParticleLifetime
// } from "vfx-composer-r3f"
// import {Gradient, Mul, Rotation3DY, Rotation3DZ} from "shader-composer";
// 
// 
// 
// 
// const tmpVec3 = new Vector3()
// 
// export const Clouds = () => {
// 
//     const lifetime = useParticleLifetime()
//     const velocity = useParticleAttribute(() => new Vector3())
//     const color = useParticleAttribute(() => new Color())
//     const rotation = useParticleAttribute(() => 0)
//     const scale = useParticleAttribute(() => 0)
// 
//     const cloudsRef = useRef()
// 
//     useEffect(() => {
//         window.cloudsRef = cloudsRef
//     }, [])
// 
//     return (
//         <InstancedParticles ref={cloudsRef} position={[0, 0, 0]} frustumCulled={false} capacity={1000} renderOrder={200}>
//             <tetrahedronGeometry args={[2, 1]} />
// 
//             <composable.meshStandardMaterial
//                 roughness={0.99}
//                 // depthWrite={false}
// 
//                 // normalMap={tex}
//                 blending={THREE.AdditiveBlending}
//                 depthWrite={false}
//                 // blending={THREE.AdditiveBlending}
//                 transparent
//                 opacity={0.02}
//                 // alphaMap={texture}
//             >
//                 {/*<modules.Billboard />*/}
//                 <modules.Color color={Gradient(
//                     lifetime.progress,
//                     [new Color(0.0, 0.0, 0.0), 0.0],
//                     [new Color(2, 1, 0.2), 0.5],
//                     // [new Color(1.1, 1.2, 1.0), 0.5],
//                     // [new Color(1.0, 1.0, 1.0), 0.9],
//                     [new Color(0, 0.0, 0.0), 1],
//                 )}
//                 />
//                 {/*<modules.Texture texture={texture} />*/}
//                 {/*<modules.Billboard />*/}
//                 <modules.Rotate rotation={Rotation3DZ(Mul(lifetime.age, rotation))} />
//                 <modules.Rotate rotation={Rotation3DY(Mul(lifetime.age, rotation))} />
// 
//                 <modules.Scale scale={scale} />
//                 <modules.Velocity direction={velocity} time={lifetime.age} />
//                 <modules.Acceleration
//                     direction={new Vector3(5, -0.2, 2)}
//                     time={lifetime.age}
//                 />
//                 <modules.Lifetime progress={lifetime.progress} />
//                 <modules.SurfaceWobble amplitude={1.4} frequency={0.1} />
//             </composable.meshStandardMaterial>
// 
// 
// 
//             <Emitter
//                 rate={50}
//                 setup={({ mesh, position, rotation: rot }) => {
//                     lifetime.write(mesh, between(4, 9))
// 
//                     if (!window.playerPos) {
//                         window.playerPos = new THREE.Vector3()
//                     }
// 
// 
//                     position.x = window.playerPos.x + between(-3000, 3000)
//                     position.y = between(400, 800)
//                     position.z = window.playerPos.z + between(-3000, 3000)
// 
//                     // rotation.x = plusMinus(3)
//                     // rotation.y = plusMinus(3)
// 
//                     rot.copy(new THREE.Quaternion().random())
// 
//                     rotation.write(mesh, plusMinus(0.05));
//                     // rotation.write(mesh, plusMinus(0.03));
//                     scale.write(mesh, between(50.0, 80.0));
// 
// 
//                     velocity.write(mesh, (v) =>
//                         v.set(plusMinus(0.5), between(-2, -1), plusMinus(0.5))
//                     )
//                 }}
//             />
// 
// 
// 
// 
// 
// 
// 
//         </InstancedParticles>
//     )
// }
// 
// 
// export const Sparkles = () => {
// 
//     const lifetime = useParticleLifetime()
//     const velocity = useParticleAttribute(() => new Vector3())
//     const rotation = useParticleAttribute(() => 0)
//     const scale = useParticleAttribute(() => 0)
// 
//     return (
//         <InstancedParticles frustumCulled={false} capacity={1000} renderOrder={9}>
//             <boxGeometry args={[1, 1, 1]} />
//             {/*<tetrahedronGeometry args={[0.1, 1]} />*/}
// 
//             <composable.meshStandardMaterial
//                 roughness={0.99}
//                 // depthWrite={false}
// 
//                 // normalMap={tex}
//                 blending={THREE.AdditiveBlending}
//                 depthWrite={false}
//                 // blending={THREE.AdditiveBlending}
//                 transparent
//                 opacity={0.3}
//                 // alphaMap={texture}
//             >
//                 {/*<modules.Billboard />*/}
//                 <modules.Color color={Gradient(
//                     lifetime.progress,
//                     [new Color(0.0, 0.0, 0.0), 0.0],
//                     [new Color(2, 0.3, 0), 0.5],
//                     // [new Color(1.1, 1.2, 1.0), 0.5],
//                     // [new Color(1.0, 1.0, 1.0), 0.9],
//                     [new Color(0, 0.0, 0.0), 1],
//                 )}
//                 />
//                 {/*<modules.Texture texture={texture} />*/}
//                 {/*<modules.Billboard />*/}
//                 <modules.Rotate rotation={Rotation3DZ(Mul(lifetime.age, rotation))} />
//                 <modules.Rotate rotation={Rotation3DY(Mul(lifetime.age, rotation))} />
// 
//                 <modules.Scale scale={scale} />
//                 <modules.Velocity direction={velocity} time={lifetime.age} />
//                 <modules.Acceleration
//                     direction={new Vector3(-7, -0.2, 0)}
//                     time={lifetime.age}
//                 />
//                 <modules.Lifetime progress={lifetime.progress} />
//                 {/*<modules.SurfaceWobble amplitude={1.4} frequency={0.1} />*/}
//             </composable.meshStandardMaterial>
// 
// 
// 
//             <Emitter
//                 rate={100}
//                 setup={({ mesh, position, rotation: rot }) => {
//                     lifetime.write(mesh, between(4, 9))
// 
//                     if (!window.playerPos) {
//                         window.playerPos = new THREE.Vector3()
//                     }
// 
//                     position.copy(window.playerPos || new THREE.Vector3())
// 
//                     position.x = window.playerPos.x + between(-200, 200)
//                     position.y = window.playerPos.y + between(-200, 200)
//                     position.z = window.playerPos.z + between(-200, 200)
// 
//                     // rotation.x = plusMinus(3)
//                     // rotation.y = plusMinus(3)
// 
//                     rot.copy(new THREE.Quaternion().random())
// 
//                     rotation.write(mesh, plusMinus(10.5));
//                     // rotation.write(mesh, plusMinus(0.03));
//                     scale.write(mesh, between(0.4, 0.8));
// 
//                     velocity.write(mesh, (v) =>
//                         v.set(plusMinus(2.5), between(-2, -1), plusMinus(2.5))
//                     )
//                 }}
//             />
// 
// 
// 
// 
// 
// 
// 
//         </InstancedParticles>
//     )
// }
// 
// 
// 
// 
// 
// export const EnvironmentSystem = () => {
// 
//     return (
//         <>
//             <Sparkles />
//             <Skybox />
//             <Clouds />
//             <Lights />
//         </>
//     )
// }
// 

export const Skybox = /*#__PURE__*/memo(() => {
  const skyboxRef = useRef();
  const materialRef = useRef();

  // const {scene} = useThree()

  const map = useTexture('/content/70be267fbcf5503bfde5c20690fdc61d24f4be288f712c429b2d9d0c538c9f30i0');
  // const map = useTexture('/content/609bd3a127a1b73bd39691704bc1dabbefab7309c5c9f9d89bc578c63b7c8081i0')
  const map2 = useTexture('/content/60939768343608ff9735b61222ed452726237748fa4e46aa0e2a7982cd35afbai0');
  useEffect(() => {
    // console.log(scene)
    // scene.fog = new THREE.Fog(new THREE.Color(0, 0.4, 1), 500, 10000)
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(1, 1);
    // map.minFilter = minFilter;
    // map.magFilter = magFilter;
    map.encoding = THREE.sRGBEncoding;
    map.premultiplyAlpha = false;
    map.format = THREE.RGBAFormat;
    map.anisotropy = 0;
    map.needsUpdate = true;
    map2.wrapS = map2.wrapT = THREE.RepeatWrapping;
    map2.repeat.set(1, 1);
    // map.minFilter = minFilter;
    // map.magFilter = magFilter;
    map2.encoding = THREE.sRGBEncoding;
    map2.premultiplyAlpha = false;
    map2.format = THREE.RGBAFormat;
    map2.anisotropy = 0;
    map2.needsUpdate = true;
  }, [map, map2]);
  useFrame(state => {
    const material = materialRef.current;
    if (!material) return;
    if (state.clock.running) {
      material.uniforms.time.value = state.clock.elapsedTime;
    }
    if (window.playerPos) {
      skyboxRef.current.position.y = -5000 - window.playerPos.y * 250;
    }
  });
  return /*#__PURE__*/_jsxs("mesh", {
    name: 'skybox',
    ref: skyboxRef,
    position: [0, -5000, 0],
    rotation: [0, -1.5, 0],
    scale: [900000, 900000, 900000],
    renderOrder: 0,
    children: [/*#__PURE__*/_jsx("sphereGeometry", {
      args: [1, 8, 8]
    }), /*#__PURE__*/_jsx(CustomShaderMaterial, {
      baseMaterial: THREE.MeshBasicMaterial,
      fog: false,
      side: THREE.BackSide,
      ref: materialRef,
      uniforms: {
        playerPos: {
          value: new THREE.Vector3()
        },
        playerDest: {
          value: new THREE.Vector3()
        },
        time: {
          value: 0
        },
        map1: {
          value: map
        },
        map2: {
          value: map2
        }
      },
      vertexShader: `
                    varying vec2 vUv;
                    
                    varying vec3 vPos;
                    void main() {
                        vUv = uv;
                        vPos = position;
                        csm_Position = position;
                    }
                `,
      fragmentShader: `
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
                `
    }, Math.random())]
  });
}, () => true);
export const Lights = /*#__PURE__*/forwardRef(({
  azimuth = 150,
  elevation = 90,
  lightDistance = 20,
  ...props
}, ref) => {
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
      targetRef.current.position.set(window.playerPos.x, window.playerPos.y, window.playerPos.z);
      const azimuthRad = THREE.MathUtils.degToRad(azimuth);
      const elevationRad = THREE.MathUtils.degToRad(elevation);
      const cosElevation = Math.cos(elevationRad);
      const sinElevation = Math.sin(elevationRad);
      const cosAzimuth = Math.cos(azimuthRad);
      const sinAzimuth = Math.sin(azimuthRad);
      const offsetX = lightDistance * cosElevation * sinAzimuth;
      const offsetY = lightDistance * sinElevation;
      const offsetZ = lightDistance * cosElevation * cosAzimuth;
      group.current.position.set(window.playerPos.x + offsetX + 11, window.playerPos.y + offsetY, window.playerPos.z + offsetZ + 11);
    }
  });
  useImperativeHandle(ref, () => ({
    group,
    directionalLight: directionalLightRef,
    ambientLight: ambientLightRef
  }));

  //todo env bake this full then just rotate only single texture version of skybox?
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(Environment, {
      near: 1,
      background: false,
      far: 1000000,
      resolution: 256
      // files={'/content/8c4ea8f9fafef081345ba8a72c' + '08efed2373d0ba33ac92aca5f043071fc42909i0?.hdr'}
      ,
      children: /*#__PURE__*/_jsx(Skybox, {})
    }), /*#__PURE__*/_jsx("ambientLight", {
      ref: ambientLightRef,
      intensity: 1
    }), /*#__PURE__*/_jsx("group", {
      ref: group,
      children: /*#__PURE__*/_jsx("directionalLight", {
        ref: directionalLightRef,
        color: [1.2, 1, 0.9],
        intensity: 0.75,
        "shadow-mapSize": [2048, 2048]
        // shadow-mapSize={[2048, 2048]}
        ,
        "shadow-camera-near": 1,
        "shadow-camera-far": 50,
        "shadow-camera-left": -20,
        "shadow-camera-right": 20,
        "shadow-camera-top": 20,
        "shadow-camera-bottom": -20,
        castShadow: true
      })
    }), /*#__PURE__*/_jsx("group", {
      ref: targetRef
    })]
  });
});
const tmpVec3 = new Vector3();
export const Clouds = () => {
  const lifetime = useParticleLifetime();
  const velocity = useParticleAttribute(() => new Vector3());
  const color = useParticleAttribute(() => new Color());
  const rotation = useParticleAttribute(() => 0);
  const scale = useParticleAttribute(() => 0);
  const cloudsRef = useRef();
  useEffect(() => {
    window.cloudsRef = cloudsRef;
  }, []);
  return /*#__PURE__*/_jsxs(InstancedParticles, {
    ref: cloudsRef,
    position: [0, 0, 0],
    frustumCulled: false,
    capacity: 1000,
    renderOrder: 200,
    children: [/*#__PURE__*/_jsx("tetrahedronGeometry", {
      args: [2, 1]
    }), /*#__PURE__*/_jsxs(composable.meshStandardMaterial, {
      roughness: 0.99
      // depthWrite={false}

      // normalMap={tex}
      ,
      blending: THREE.AdditiveBlending,
      depthWrite: false
      // blending={THREE.AdditiveBlending}
      ,
      transparent: true,
      opacity: 0.02
      // alphaMap={texture}
      ,
      children: [/*#__PURE__*/_jsx(modules.Color, {
        color: Gradient(lifetime.progress, [new Color(0.0, 0.0, 0.0), 0.0], [new Color(2, 1, 0.2), 0.5],
        // [new Color(1.1, 1.2, 1.0), 0.5],
        // [new Color(1.0, 1.0, 1.0), 0.9],
        [new Color(0, 0.0, 0.0), 1])
      }), /*#__PURE__*/_jsx(modules.Rotate, {
        rotation: Rotation3DZ(Mul(lifetime.age, rotation))
      }), /*#__PURE__*/_jsx(modules.Rotate, {
        rotation: Rotation3DY(Mul(lifetime.age, rotation))
      }), /*#__PURE__*/_jsx(modules.Scale, {
        scale: scale
      }), /*#__PURE__*/_jsx(modules.Velocity, {
        direction: velocity,
        time: lifetime.age
      }), /*#__PURE__*/_jsx(modules.Acceleration, {
        direction: new Vector3(5, -0.2, 2),
        time: lifetime.age
      }), /*#__PURE__*/_jsx(modules.Lifetime, {
        progress: lifetime.progress
      }), /*#__PURE__*/_jsx(modules.SurfaceWobble, {
        amplitude: 1.4,
        frequency: 0.1
      })]
    }), /*#__PURE__*/_jsx(Emitter, {
      rate: 50,
      setup: ({
        mesh,
        position,
        rotation: rot
      }) => {
        lifetime.write(mesh, between(4, 9));
        if (!window.playerPos) {
          window.playerPos = new THREE.Vector3();
        }
        position.x = window.playerPos.x + between(-3000, 3000);
        position.y = between(400, 800);
        position.z = window.playerPos.z + between(-3000, 3000);

        // rotation.x = plusMinus(3)
        // rotation.y = plusMinus(3)

        rot.copy(new THREE.Quaternion().random());
        rotation.write(mesh, plusMinus(0.05));
        // rotation.write(mesh, plusMinus(0.03));
        scale.write(mesh, between(50.0, 80.0));
        velocity.write(mesh, v => v.set(plusMinus(0.5), between(-2, -1), plusMinus(0.5)));
      }
    })]
  });
};
export const Sparkles = () => {
  const lifetime = useParticleLifetime();
  const velocity = useParticleAttribute(() => new Vector3());
  const rotation = useParticleAttribute(() => 0);
  const scale = useParticleAttribute(() => 0);
  return /*#__PURE__*/_jsxs(InstancedParticles, {
    frustumCulled: false,
    capacity: 1000,
    renderOrder: 9,
    children: [/*#__PURE__*/_jsx("boxGeometry", {
      args: [1, 1, 1]
    }), /*#__PURE__*/_jsxs(composable.meshStandardMaterial, {
      roughness: 0.99
      // depthWrite={false}

      // normalMap={tex}
      ,
      blending: THREE.AdditiveBlending,
      depthWrite: false
      // blending={THREE.AdditiveBlending}
      ,
      transparent: true,
      opacity: 0.3
      // alphaMap={texture}
      ,
      children: [/*#__PURE__*/_jsx(modules.Color, {
        color: Gradient(lifetime.progress, [new Color(0.0, 0.0, 0.0), 0.0], [new Color(2, 0.3, 0), 0.5],
        // [new Color(1.1, 1.2, 1.0), 0.5],
        // [new Color(1.0, 1.0, 1.0), 0.9],
        [new Color(0, 0.0, 0.0), 1])
      }), /*#__PURE__*/_jsx(modules.Rotate, {
        rotation: Rotation3DZ(Mul(lifetime.age, rotation))
      }), /*#__PURE__*/_jsx(modules.Rotate, {
        rotation: Rotation3DY(Mul(lifetime.age, rotation))
      }), /*#__PURE__*/_jsx(modules.Scale, {
        scale: scale
      }), /*#__PURE__*/_jsx(modules.Velocity, {
        direction: velocity,
        time: lifetime.age
      }), /*#__PURE__*/_jsx(modules.Acceleration, {
        direction: new Vector3(-7, -0.2, 0),
        time: lifetime.age
      }), /*#__PURE__*/_jsx(modules.Lifetime, {
        progress: lifetime.progress
      })]
    }), /*#__PURE__*/_jsx(Emitter, {
      rate: 100,
      setup: ({
        mesh,
        position,
        rotation: rot
      }) => {
        lifetime.write(mesh, between(4, 9));
        if (!window.playerPos) {
          window.playerPos = new THREE.Vector3();
        }
        position.copy(window.playerPos || new THREE.Vector3());
        position.x = window.playerPos.x + between(-200, 200);
        position.y = window.playerPos.y + between(-200, 200);
        position.z = window.playerPos.z + between(-200, 200);

        // rotation.x = plusMinus(3)
        // rotation.y = plusMinus(3)

        rot.copy(new THREE.Quaternion().random());
        rotation.write(mesh, plusMinus(10.5));
        // rotation.write(mesh, plusMinus(0.03));
        scale.write(mesh, between(0.4, 0.8));
        velocity.write(mesh, v => v.set(plusMinus(2.5), between(-2, -1), plusMinus(2.5)));
      }
    })]
  });
};
export const EnvironmentSystem = () => {
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(Sparkles, {}), /*#__PURE__*/_jsx(Skybox, {}), /*#__PURE__*/_jsx(Clouds, {}), /*#__PURE__*/_jsx(Lights, {})]
  });
};






///// component: systems/InputSystem.jsx 
///// JSX source:
///
// import {useCallback, useEffect, useRef} from "react";
// 
// 
// window.keyDown = {}
// 
// export const InputSystem = () => {
//     useEffect(() => {
// 
//         const handleKeyDown = (e) => {
//             if (window.isAceEditorFocused) {
//                 return
//             }
//             const key = e.key.toLowerCase();
//             if (key === "tab") {
//                 e.stopPropagation();
//                 e.preventDefault();
//             }
//             if (key === " ") {
//                 window.keyDown.space = true
//             } else {
//                 window.keyDown[key] = true
//             }
//         };
// 
//         const handleKeyUp = (e) => {
//             if (window.isAceEditorFocused) {
//                 return
//             }
//             const key = e.key.toLowerCase();
//             if (key === " ") {
//                 window.keyDown.space = false
//             } else {
//                 window.keyDown[key] = false
//             }
//         };
// 
//         window.addEventListener("keydown", handleKeyDown);
//         window.addEventListener("keyup", handleKeyUp);
// 
//         return () => {
//             window.removeEventListener("keydown", handleKeyDown);
//             window.removeEventListener("keyup", handleKeyUp);
//         };
//     }, []);
// 
// 
//     return null
// };
// 
// 
// export function useKeyboard({onKeyDown = {}, onKeyUp = {}}) {
//     const ref = useRef({});
// 
//     const onKeyDownFunction = useCallback((e) => {
//         if (window.isAceEditorFocused) {
//             return
//         }
//         const key = e.key.toLowerCase();
// 
//         if (onKeyDown[key]) {
//             onKeyDown[key](e);
//         }
//     }, [onKeyDown]);
// 
//     const onKeyUpFunction = useCallback((e) => {
//         if (window.isAceEditorFocused) {
//             return
//         }
//         const key = e.key.toLowerCase();
// 
//         if (onKeyUp[key]) {
//             onKeyUp[key](e);
//         }
//     }, [onKeyUp]);
// 
//     useEffect(() => {
//         window.addEventListener("keydown", onKeyDownFunction);
//         window.addEventListener("keyup", onKeyUpFunction);
//         return () => {
//             window.removeEventListener("keydown", onKeyDownFunction);
//             window.removeEventListener("keyup", onKeyUpFunction);
//         };
//     }, [onKeyDownFunction, onKeyUpFunction]);
// 
//     return ref.current;
// }
// 

window.keyDown = {};
export const InputSystem = () => {
  useEffect(() => {
    const handleKeyDown = e => {
      if (window.isAceEditorFocused) {
        return;
      }
      const key = e.key.toLowerCase();
      if (key === "tab") {
        e.stopPropagation();
        e.preventDefault();
      }
      if (key === " ") {
        window.keyDown.space = true;
      } else {
        window.keyDown[key] = true;
      }
    };
    const handleKeyUp = e => {
      if (window.isAceEditorFocused) {
        return;
      }
      const key = e.key.toLowerCase();
      if (key === " ") {
        window.keyDown.space = false;
      } else {
        window.keyDown[key] = false;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
  return null;
};
export function useKeyboard({
  onKeyDown = {},
  onKeyUp = {}
}) {
  const ref = useRef({});
  const onKeyDownFunction = useCallback(e => {
    if (window.isAceEditorFocused) {
      return;
    }
    const key = e.key.toLowerCase();
    if (onKeyDown[key]) {
      onKeyDown[key](e);
    }
  }, [onKeyDown]);
  const onKeyUpFunction = useCallback(e => {
    if (window.isAceEditorFocused) {
      return;
    }
    const key = e.key.toLowerCase();
    if (onKeyUp[key]) {
      onKeyUp[key](e);
    }
  }, [onKeyUp]);
  useEffect(() => {
    window.addEventListener("keydown", onKeyDownFunction);
    window.addEventListener("keyup", onKeyUpFunction);
    return () => {
      window.removeEventListener("keydown", onKeyDownFunction);
      window.removeEventListener("keyup", onKeyUpFunction);
    };
  }, [onKeyDownFunction, onKeyUpFunction]);
  return ref.current;
}






///// component: systems/PostprocessingSystem.jsx 
///// JSX source:
///
// import {useSpring} from "@react-spring/web"
// import {forwardRef, useImperativeHandle, useRef, useState} from "react"
// import {ECS} from "ecs"
// import {
//     BrightnessContrast,
//     HueSaturation,
//     EffectComposer, SMAA
// } from "@react-three/postprocessing"
// 
// const usePostUniformSpring = (effectRef, uniformName, defaultValue) => {
//     const entity = ECS.useCurrentEntity()
// 
//     const [_, api] = useSpring(() => ({
//         [uniformName]: defaultValue,
//         config: {
//             mass: 1.1,
//             friction: 21,
//             tension: 369,
//         },
//         onChange: (v) => {
//             if (entity && effectRef.current) {
//                 effectRef.current.uniforms.get(uniformName).value = v.value[uniformName]
//             }
//         },
//     }))
// 
//     return {
//         set: (value, config) => {
//             api.start({[uniformName]: value, config})
//         },
//         stop: () => {
//             api.stop()
//         },
//     }
// }
// 
// 
// 
// const PostprocessingModel = forwardRef((props, ref) => {
//     const group = useRef()
// 
//     const [multisampling, setMultisampling] = useState(2)
// 
//     const brightnessContrast = useRef()
//     const hueSaturation = useRef()
//     const vignette = useRef()
//     const bloom = useRef()
//     const dof = useRef()
//     const chromatic = useRef()
// 
//     const brightnessSpring = usePostUniformSpring(
//         brightnessContrast, 'brightness', 0)
// 
//     const contrastSpring = usePostUniformSpring(
//         brightnessContrast, 'contrast', 0)
// 
//     const saturationSpring = usePostUniformSpring(
//         hueSaturation, 'saturation', 0)
// 
//     const vignetteSpring = usePostUniformSpring(
//         vignette, 'darkness', 0)
// 
//     useImperativeHandle(ref, () => ({
//         group,
//         multisampling,
//         setMultisampling,
//         brightnessContrast,
//         hueSaturation,
//         vignette,
//         bloom,
//         dof,
//         chromatic,
//         springs: {
//             brightness: brightnessSpring,
//             contrast: contrastSpring,
//             saturation: saturationSpring,
//             vignette: vignetteSpring,
//         },
//     }))
// 
// 
// 
//     return (
//         <EffectComposer ref={ref} multisampling={multisampling}>
//             <SMAA preset={1} edgeDetectionMode={1} />
//             <BrightnessContrast ref={brightnessContrast} brightness={0.1} contrast={0.2}/>
//             <HueSaturation ref={hueSaturation} saturation={0.1}/>
// 
//         </EffectComposer>
//     )
// })
// 
// export const PostprocessingEntity = () => {
// 
//     return (
//         <ECS.Entity>
//             <ECS.Component name="isPostprocessing" data={true} />
//             <ECS.Component name="render">
//                 <PostprocessingModel />
//             </ECS.Component>
//         </ECS.Entity>
//     )
// }
// 
// export const PostprocessingSystem = () => {
// 
//     return <PostprocessingEntity />
// }
// 

const usePostUniformSpring = (effectRef, uniformName, defaultValue) => {
  const entity = ECS.useCurrentEntity();
  const [_, api] = useSpring(() => ({
    [uniformName]: defaultValue,
    config: {
      mass: 1.1,
      friction: 21,
      tension: 369
    },
    onChange: v => {
      if (entity && effectRef.current) {
        effectRef.current.uniforms.get(uniformName).value = v.value[uniformName];
      }
    }
  }));
  return {
    set: (value, config) => {
      api.start({
        [uniformName]: value,
        config
      });
    },
    stop: () => {
      api.stop();
    }
  };
};
const PostprocessingModel = /*#__PURE__*/forwardRef((props, ref) => {
  const group = useRef();
  const [multisampling, setMultisampling] = useState(2);
  const brightnessContrast = useRef();
  const hueSaturation = useRef();
  const vignette = useRef();
  const bloom = useRef();
  const dof = useRef();
  const chromatic = useRef();
  const brightnessSpring = usePostUniformSpring(brightnessContrast, 'brightness', 0);
  const contrastSpring = usePostUniformSpring(brightnessContrast, 'contrast', 0);
  const saturationSpring = usePostUniformSpring(hueSaturation, 'saturation', 0);
  const vignetteSpring = usePostUniformSpring(vignette, 'darkness', 0);
  useImperativeHandle(ref, () => ({
    group,
    multisampling,
    setMultisampling,
    brightnessContrast,
    hueSaturation,
    vignette,
    bloom,
    dof,
    chromatic,
    springs: {
      brightness: brightnessSpring,
      contrast: contrastSpring,
      saturation: saturationSpring,
      vignette: vignetteSpring
    }
  }));
  return /*#__PURE__*/_jsxs(EffectComposer, {
    ref: ref,
    multisampling: multisampling,
    children: [/*#__PURE__*/_jsx(SMAA, {
      preset: 1,
      edgeDetectionMode: 1
    }), /*#__PURE__*/_jsx(BrightnessContrast, {
      ref: brightnessContrast,
      brightness: 0.1,
      contrast: 0.2
    }), /*#__PURE__*/_jsx(HueSaturation, {
      ref: hueSaturation,
      saturation: 0.1
    })]
  });
});
export const PostprocessingEntity = () => {
  return /*#__PURE__*/_jsxs(ECS.Entity, {
    children: [/*#__PURE__*/_jsx(ECS.Component, {
      name: "isPostprocessing",
      data: true
    }), /*#__PURE__*/_jsx(ECS.Component, {
      name: "render",
      children: /*#__PURE__*/_jsx(PostprocessingModel, {})
    })]
  });
};
export const PostprocessingSystem = () => {
  return /*#__PURE__*/_jsx(PostprocessingEntity, {});
};






///// component: systems/RenderSystem.jsx 
///// JSX source:
///
// import {useEntities} from "miniplex-react"
// import {useFrame} from "@react-three/fiber"
// import {ECS} from 'ecs'
// 
// export const RenderSystem = () => {
//     const renderableEntities = useEntities(ECS.world.with("render"))
// 
//     useFrame(() => {
//         for (const entity of renderableEntities) {
//             const {render, position, rotation, scale} = entity
//             if (render?.group?.current) {
//                 if (position) {
//                     render.group.current.position.set(position.x, position.y, position.z)
//                 }
//                 if (rotation) {
//                     render.group.current.rotation.set(rotation.x, rotation.y, rotation.z)
//                 }
//                 if (scale) {
//                     render.group.current.scale.set(scale.x, scale.y, scale.z)
//                 }
//             }
//         }
//     })
// };
// 

export const RenderSystem = () => {
  const renderableEntities = useEntities(ECS.world.with("render"));
  useFrame(() => {
    for (const entity of renderableEntities) {
      const {
        render,
        position,
        rotation,
        scale
      } = entity;
      if (render?.group?.current) {
        if (position) {
          render.group.current.position.set(position.x, position.y, position.z);
        }
        if (rotation) {
          render.group.current.rotation.set(rotation.x, rotation.y, rotation.z);
        }
        if (scale) {
          render.group.current.scale.set(scale.x, scale.y, scale.z);
        }
      }
    }
  });
};






///// component: systems/world/MaterialBuilder.jsx 
///// JSX source:
///
// import * as THREE from "three";
// import { hexTexture } from "../../modules/shaderstuff.mjs";
// import CustomShaderMaterial from "three-custom-shader-material";
// import { toLinear } from "shaderNoiseFunctions";
// import {useEffect, useMemo, useRef, useState} from "react";
// import { useFrame, useThree } from "@react-three/fiber";
// import {useTexture} from "@react-three/drei";
// import {bakeTexture} from "../../modules/textureCache.mjs";
// 
// const getFragShader = (customFrag) => {
//     if (!customFrag) {
//         console.log('nop')
//         customFrag = 'void main() {vec3 color = vec3(0.9, 0.6, 0.0); float a = 1.0;'
//     } else {
//         customFrag = customFrag.replace(
//             /void\s+main\s*\(\s*\)\s*{/,
//             'void main() {vec3 color = vec3(0.5, 0.2, 0.0); float a = 1.0;'
//         );
//         customFrag = customFrag.replace(/\}\s*$/, '');
//     }
// 
//     return `
//     varying vec2 vUv;
//     varying vec3 vPosition;
//     varying vec3 vNormalWorld;
//     varying vec3 vViewDirection;
//     varying vec2 edgeDistance;
//     varying float verticalFactor;
//     
//     uniform float lastRebaseTime;
//     uniform float time;
//     uniform vec3 playerPosition;
//     ${hexTexture}
//     ${toLinear}
//     
// 
//       ${customFrag}
//       
//         
//       
//       // fog fade
//       // float playerDistance = distance(vPosition.xz, playerPosition.xz);
//       // color = mix(color, vec3(0.9, 0.9, 0.9), smoothstep(0., 2000., playerDistance) * 0.2);
// 
//       // opacity edge fade
//       // a -= smoothstep(1500., 3000., abs(edgeDistance.x));
//       // a -= smoothstep(1500., 3000., abs(edgeDistance.y));
//       // a = clamp(a, 0.2, 1.0);
// 
//       // new chunk smooth fade-in
//       // float rebaseDiff = clamp((time - lastRebaseTime) * 0.2, 0.0, 0.2);
//       // if (edgeDistance.x > 3000.0 || edgeDistance.y > 3000.0) {
//       //   a = rebaseDiff;
//       // }
// 
//       csm_DiffuseColor.rgb = toLinear(vec4(clamp(color, 0.0, 1.0), 1.0)).rgb;
//       csm_DiffuseColor.a = clamp(a, 0.0, 1.0);
//     }
//   `;
// };
// 
// export const MaterialBuilder = ({ offsetX = 0, offsetY = 0, ...props }) => {
//     const materialRef = useRef();
//     const { gl, camera, scene } = useThree();
// 
// 
//     const { terrain: {material} } = props;
// 
//     const vertexShader = `
//     varying vec2 vUv;
//     varying vec3 vPosition;
//     varying vec3 vNormalWorld;
//     varying vec3 vViewDirection;
//     varying vec2 edgeDistance;
//     varying float verticalFactor;
//     
//     uniform vec2 offset; //just neededfor builder
//     uniform vec3 playerPos;
//     void main() {
//       vUv = uv;
//       
//       //custom for builder single mesh offsets
//       vPosition = (position + vec3(offset.x, -offset.y, 0.)).xzy;
//       
//       vNormalWorld = normalize(mat3(modelMatrix) * normal);
//       vViewDirection = normalize(cameraPosition - vPosition);
//       edgeDistance = vec2(abs(vPosition.x - playerPos.x), abs(vPosition.z - playerPos.z));
//       verticalFactor = 1. - abs(vNormalWorld.y);
//       
//       csm_Position = position;
//     }
//   `;
// 
//     // Check fragment shader compilation and select shader
//     const { finalFragmentShader } = useMemo(() => {
//         // console.log(material.customFragmentShader)
//         const fragmentShaderCustomAttempt = getFragShader(material.customFragmentShader);
//         return { finalFragmentShader: fragmentShaderCustomAttempt };
//     }, [material, offsetX, offsetY, gl]);
// 
//     useFrame((state) => {
//         // if (!state.clock.running) {
//         //     return
//         // }
//         if (materialRef.current?.uniforms?.time) {
//             materialRef.current.uniforms.time.value = state.clock.elapsedTime;
//         }
//         if (window.playerPos && materialRef.current?.uniforms?.playerPosition) {
//             materialRef.current.uniforms.playerPosition.value = {
//                 x: window.playerPos.x,
//                 y: window.playerPos.y,
//                 z: -window.playerPos.z,
//             };
//         }
//     });
// 
//     const defaultCoinTex = '/content/cfab194b924f7785c6e453728e1c264b89b74843633278cda3ad3f57576c1e93i0'
// 
//     const texture0 = useTexture(material.textures?.[0]?.src || defaultCoinTex, texture => {
//         texture.wrapS = THREE.RepeatWrapping;
//         texture.wrapT = THREE.RepeatWrapping;
//         texture.magFilter = THREE.LinearFilter;
//         texture.minFilter = THREE.LinearMipmapLinearFilter;
//         texture.generateMipmaps = true;
//         texture.encoding =  THREE.sRGBEncoding
//         texture.anisotropy = 16
//         texture.needsUpdate = true
//     });
//     const texture1 = useTexture(material.textures?.[1]?.src || defaultCoinTex, texture => {
//         texture.wrapS = THREE.RepeatWrapping;
//         texture.wrapT = THREE.RepeatWrapping;
//         texture.magFilter = THREE.LinearFilter;
//         texture.minFilter = THREE.LinearMipmapLinearFilter;
//         texture.generateMipmaps = true;
//         texture.encoding =  THREE.sRGBEncoding
//         texture.anisotropy = 16
//         texture.needsUpdate = true
//     });
//     const texture2 = useTexture(material.textures?.[2]?.src || defaultCoinTex, texture => {
//         texture.wrapS = THREE.RepeatWrapping;
//         texture.wrapT = THREE.RepeatWrapping;
//         texture.magFilter = THREE.LinearFilter;
//         texture.minFilter = THREE.LinearMipmapLinearFilter;
//         texture.generateMipmaps = true;
//         texture.encoding =  THREE.sRGBEncoding
//         texture.anisotropy = 1
//         texture.needsUpdate = true
//     });
//     const texture3 = useTexture(material.textures?.[3]?.src || defaultCoinTex, texture => {
//         texture.wrapS = THREE.RepeatWrapping;
//         texture.wrapT = THREE.RepeatWrapping;
//         texture.magFilter = THREE.LinearFilter;
//         texture.minFilter = THREE.LinearMipmapLinearFilter;
//         texture.generateMipmaps = true;
//         texture.encoding =  THREE.sRGBEncoding
//         texture.anisotropy = 1
//         texture.needsUpdate = true
//     });
//     const texture4 = useTexture(material.textures?.[4]?.src || defaultCoinTex, texture => {
//         texture.wrapS = THREE.RepeatWrapping;
//         texture.wrapT = THREE.RepeatWrapping;
//         texture.magFilter = THREE.LinearFilter;
//         texture.minFilter = THREE.LinearMipmapLinearFilter;
//         texture.generateMipmaps = true;
//         texture.encoding =  THREE.sRGBEncoding
//         texture.anisotropy = 1
//         texture.needsUpdate = true
//     });
//     const texture5 = useTexture(material.textures?.[5]?.src || defaultCoinTex, texture => {
//         texture.wrapS = THREE.RepeatWrapping;
//         texture.wrapT = THREE.RepeatWrapping;
//         texture.magFilter = THREE.LinearFilter;
//         texture.minFilter = THREE.LinearMipmapLinearFilter;
//         texture.generateMipmaps = true;
//         texture.encoding =  THREE.sRGBEncoding
//         texture.anisotropy = 1
//         texture.needsUpdate = true
//     });
//     const texture6 = useTexture(material.textures?.[6]?.src || defaultCoinTex, texture => {
//         texture.wrapS = THREE.RepeatWrapping;
//         texture.wrapT = THREE.RepeatWrapping;
//         texture.magFilter = THREE.LinearFilter;
//         texture.minFilter = THREE.LinearMipmapLinearFilter;
//         texture.generateMipmaps = true;
//         texture.encoding =  THREE.sRGBEncoding
//         texture.anisotropy = 1
//         texture.needsUpdate = true
//     });
//     const texture7 = useTexture(material.textures?.[7]?.src || defaultCoinTex, texture => {
//         texture.wrapS = THREE.RepeatWrapping;
//         texture.wrapT = THREE.RepeatWrapping;
//         texture.magFilter = THREE.LinearFilter;
//         texture.minFilter = THREE.LinearMipmapLinearFilter;
//         texture.generateMipmaps = true;
//         texture.encoding =  THREE.sRGBEncoding
//         texture.anisotropy = 1
//         texture.needsUpdate = true
//     });
// 
// 
// 
//     const [baked0, setBaked0] = useState(null)
//     useEffect(() => {
//         const getBaked0 = async () => {
//             if (material.textures?.[0]?.bakeData) {
//                 const bakedTex = await bakeTexture(material.textures?.[0]?.name, material.textures?.[0]?.bakeData, gl, camera)
//                 setBaked0(bakedTex)
//             }
//         }
//         getBaked0()
//     }, [setBaked0, material])
// 
//     const [baked1, setBaked1] = useState(null)
//     useEffect(() => {
//         const getBaked1 = async () => {
//             if (material.textures?.[1]?.bakeData) {
//                 const bakedTex = await bakeTexture(material.textures?.[1]?.name, material.textures?.[1]?.bakeData, gl, camera)
//                 setBaked1(bakedTex)
//             }
//         }
//         getBaked1()
//     }, [setBaked1, material])
// 
//     const [baked2, setBaked2] = useState(null)
//     useEffect(() => {
//         const getBaked2 = async () => {
//             if (material.textures?.[2]?.bakeData) {
//                 const bakedTex = await bakeTexture(material.textures?.[2]?.name, material.textures?.[2]?.bakeData, gl, camera)
//                 setBaked2(bakedTex)
//             }
//         }
//         getBaked2()
//     }, [setBaked2, material])
// 
//     const [baked3, setBaked3] = useState(null)
//     useEffect(() => {
//         const getBaked3 = async () => {
//             if (material.textures?.[3]?.bakeData) {
//                 const bakedTex = await bakeTexture(material.textures?.[3]?.name, material.textures?.[3]?.bakeData, gl, camera)
//                 setBaked3(bakedTex)
//             }
//         }
//         getBaked3()
//     }, [setBaked3, material])
// 
//     const [baked4, setBaked4] = useState(null)
//     useEffect(() => {
//         const getBaked4 = async () => {
//             if (material.textures?.[4]?.bakeData) {
//                 const bakedTex = await bakeTexture(material.textures?.[4]?.name, material.textures?.[4]?.bakeData, gl, camera)
//                 setBaked4(bakedTex)
//             }
//         }
//         getBaked4()
//     }, [setBaked4, material])
// 
//     const [baked5, setBaked5] = useState(null)
//     useEffect(() => {
//         const getBaked5 = async () => {
//             if (material.textures?.[5]?.bakeData) {
//                 const bakedTex = await bakeTexture(material.textures?.[5]?.name, material.textures?.[5]?.bakeData, gl, camera)
//                 setBaked5(bakedTex)
//             }
//         }
//         getBaked5()
//     }, [setBaked5, material])
// 
//     const [baked6, setBaked6] = useState(null)
//     useEffect(() => {
//         const getBaked6 = async () => {
//             if (material.textures?.[6]?.bakeData) {
//                 const bakedTex = await bakeTexture(material.textures?.[6]?.name, material.textures?.[6]?.bakeData, gl, camera)
//                 setBaked6(bakedTex)
//             }
//         }
//         getBaked6()
//     }, [setBaked6, material])
// 
//     const [baked7, setBaked7] = useState(null)
//     useEffect(() => {
//         const getBaked7 = async () => {
//             if (material.textures?.[7]?.bakeData) {
//                 const bakedTex = await bakeTexture(material.textures?.[7]?.name, material.textures?.[7]?.bakeData, gl, camera)
//                 setBaked7(bakedTex)
//             }
//         }
//         getBaked7()
//     }, [setBaked7, material])
// 
//     return (
//         <CustomShaderMaterial
//             baseMaterial={material.baseMaterial || THREE.MeshToonMaterial}
//             color={"#000"}
//             {...material}
//             ref={materialRef}
//             depthTest={true}
//             depthWrite={true}
//             transparent
//             fog={false}
//             key={`${material.customFragmentShader}`}
//             uniforms={{
//                 offset: { value: [offsetX, offsetY] },
//                 playerPosition: { value: new THREE.Vector3() },
//                 time: { value: 0 },
//                 lastRebaseTime: { value: 0 },
//                 [material.textures?.[0]?.name || 'texture0']: {value: baked0 || texture0 },
//                 [material.textures?.[1]?.name || 'texture1']: {value: baked1 || texture1 },
//                 [material.textures?.[2]?.name || 'texture2']: {value: baked2 || texture2 },
//                 [material.textures?.[3]?.name || 'texture3']: {value: baked3 || texture3 },
//                 [material.textures?.[4]?.name || 'texture4']: {value: baked4 || texture4 },
//                 [material.textures?.[5]?.name || 'texture5']: {value: baked5 || texture5 },
//                 [material.textures?.[6]?.name || 'texture6']: {value: baked6 || texture6 },
//                 [material.textures?.[7]?.name || 'texture7']: {value: baked7 || texture7 },
//             }}
//             vertexShader={vertexShader}
//             fragmentShader={finalFragmentShader}
//         />
//     );
// };
// 

const getFragShader = customFrag => {
  if (!customFrag) {
    console.log('nop');
    customFrag = 'void main() {vec3 color = vec3(0.9, 0.6, 0.0); float a = 1.0;';
  } else {
    customFrag = customFrag.replace(/void\s+main\s*\(\s*\)\s*{/, 'void main() {vec3 color = vec3(0.5, 0.2, 0.0); float a = 1.0;');
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
export const MaterialBuilder = ({
  offsetX = 0,
  offsetY = 0,
  ...props
}) => {
  const materialRef = useRef();
  const {
    gl,
    camera,
    scene
  } = useThree();
  const {
    terrain: {
      material
    }
  } = props;
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
  const {
    finalFragmentShader
  } = useMemo(() => {
    // console.log(material.customFragmentShader)
    const fragmentShaderCustomAttempt = getFragShader(material.customFragmentShader);
    return {
      finalFragmentShader: fragmentShaderCustomAttempt
    };
  }, [material, offsetX, offsetY, gl]);
  useFrame(state => {
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
        z: -window.playerPos.z
      };
    }
  });
  const defaultCoinTex = '/content/cfab194b924f7785c6e453728e1c264b89b74843633278cda3ad3f57576c1e93i0';
  const texture0 = useTexture(material.textures?.[0]?.src || defaultCoinTex, texture => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.generateMipmaps = true;
    texture.encoding = THREE.sRGBEncoding;
    texture.anisotropy = 16;
    texture.needsUpdate = true;
  });
  const texture1 = useTexture(material.textures?.[1]?.src || defaultCoinTex, texture => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.generateMipmaps = true;
    texture.encoding = THREE.sRGBEncoding;
    texture.anisotropy = 16;
    texture.needsUpdate = true;
  });
  const texture2 = useTexture(material.textures?.[2]?.src || defaultCoinTex, texture => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.generateMipmaps = true;
    texture.encoding = THREE.sRGBEncoding;
    texture.anisotropy = 1;
    texture.needsUpdate = true;
  });
  const texture3 = useTexture(material.textures?.[3]?.src || defaultCoinTex, texture => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.generateMipmaps = true;
    texture.encoding = THREE.sRGBEncoding;
    texture.anisotropy = 1;
    texture.needsUpdate = true;
  });
  const texture4 = useTexture(material.textures?.[4]?.src || defaultCoinTex, texture => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.generateMipmaps = true;
    texture.encoding = THREE.sRGBEncoding;
    texture.anisotropy = 1;
    texture.needsUpdate = true;
  });
  const texture5 = useTexture(material.textures?.[5]?.src || defaultCoinTex, texture => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.generateMipmaps = true;
    texture.encoding = THREE.sRGBEncoding;
    texture.anisotropy = 1;
    texture.needsUpdate = true;
  });
  const texture6 = useTexture(material.textures?.[6]?.src || defaultCoinTex, texture => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.generateMipmaps = true;
    texture.encoding = THREE.sRGBEncoding;
    texture.anisotropy = 1;
    texture.needsUpdate = true;
  });
  const texture7 = useTexture(material.textures?.[7]?.src || defaultCoinTex, texture => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.generateMipmaps = true;
    texture.encoding = THREE.sRGBEncoding;
    texture.anisotropy = 1;
    texture.needsUpdate = true;
  });
  const [baked0, setBaked0] = useState(null);
  useEffect(() => {
    const getBaked0 = async () => {
      if (material.textures?.[0]?.bakeData) {
        const bakedTex = await bakeTexture(material.textures?.[0]?.name, material.textures?.[0]?.bakeData, gl, camera);
        setBaked0(bakedTex);
      }
    };
    getBaked0();
  }, [setBaked0, material]);
  const [baked1, setBaked1] = useState(null);
  useEffect(() => {
    const getBaked1 = async () => {
      if (material.textures?.[1]?.bakeData) {
        const bakedTex = await bakeTexture(material.textures?.[1]?.name, material.textures?.[1]?.bakeData, gl, camera);
        setBaked1(bakedTex);
      }
    };
    getBaked1();
  }, [setBaked1, material]);
  const [baked2, setBaked2] = useState(null);
  useEffect(() => {
    const getBaked2 = async () => {
      if (material.textures?.[2]?.bakeData) {
        const bakedTex = await bakeTexture(material.textures?.[2]?.name, material.textures?.[2]?.bakeData, gl, camera);
        setBaked2(bakedTex);
      }
    };
    getBaked2();
  }, [setBaked2, material]);
  const [baked3, setBaked3] = useState(null);
  useEffect(() => {
    const getBaked3 = async () => {
      if (material.textures?.[3]?.bakeData) {
        const bakedTex = await bakeTexture(material.textures?.[3]?.name, material.textures?.[3]?.bakeData, gl, camera);
        setBaked3(bakedTex);
      }
    };
    getBaked3();
  }, [setBaked3, material]);
  const [baked4, setBaked4] = useState(null);
  useEffect(() => {
    const getBaked4 = async () => {
      if (material.textures?.[4]?.bakeData) {
        const bakedTex = await bakeTexture(material.textures?.[4]?.name, material.textures?.[4]?.bakeData, gl, camera);
        setBaked4(bakedTex);
      }
    };
    getBaked4();
  }, [setBaked4, material]);
  const [baked5, setBaked5] = useState(null);
  useEffect(() => {
    const getBaked5 = async () => {
      if (material.textures?.[5]?.bakeData) {
        const bakedTex = await bakeTexture(material.textures?.[5]?.name, material.textures?.[5]?.bakeData, gl, camera);
        setBaked5(bakedTex);
      }
    };
    getBaked5();
  }, [setBaked5, material]);
  const [baked6, setBaked6] = useState(null);
  useEffect(() => {
    const getBaked6 = async () => {
      if (material.textures?.[6]?.bakeData) {
        const bakedTex = await bakeTexture(material.textures?.[6]?.name, material.textures?.[6]?.bakeData, gl, camera);
        setBaked6(bakedTex);
      }
    };
    getBaked6();
  }, [setBaked6, material]);
  const [baked7, setBaked7] = useState(null);
  useEffect(() => {
    const getBaked7 = async () => {
      if (material.textures?.[7]?.bakeData) {
        const bakedTex = await bakeTexture(material.textures?.[7]?.name, material.textures?.[7]?.bakeData, gl, camera);
        setBaked7(bakedTex);
      }
    };
    getBaked7();
  }, [setBaked7, material]);
  return /*#__PURE__*/_createElement(CustomShaderMaterial, {
    baseMaterial: material.baseMaterial || THREE.MeshToonMaterial,
    color: "#000",
    ...material,
    ref: materialRef,
    depthTest: true,
    depthWrite: true,
    transparent: true,
    fog: false,
    key: `${material.customFragmentShader}`,
    uniforms: {
      offset: {
        value: [offsetX, offsetY]
      },
      playerPosition: {
        value: new THREE.Vector3()
      },
      time: {
        value: 0
      },
      lastRebaseTime: {
        value: 0
      },
      [material.textures?.[0]?.name || 'texture0']: {
        value: baked0 || texture0
      },
      [material.textures?.[1]?.name || 'texture1']: {
        value: baked1 || texture1
      },
      [material.textures?.[2]?.name || 'texture2']: {
        value: baked2 || texture2
      },
      [material.textures?.[3]?.name || 'texture3']: {
        value: baked3 || texture3
      },
      [material.textures?.[4]?.name || 'texture4']: {
        value: baked4 || texture4
      },
      [material.textures?.[5]?.name || 'texture5']: {
        value: baked5 || texture5
      },
      [material.textures?.[6]?.name || 'texture6']: {
        value: baked6 || texture6
      },
      [material.textures?.[7]?.name || 'texture7']: {
        value: baked7 || texture7
      }
    },
    vertexShader: vertexShader,
    fragmentShader: finalFragmentShader
  });
};






///// component: systems/world/DefaultTerrain.jsx 
///// JSX source:
///
// import * as THREE from "three";
// import {useTexture} from "@react-three/drei";
// import {useEffect, useRef} from "react";
// import {MaterialBuilder} from "./MaterialBuilder.jsx";
// 
// import {useCollider} from 'useCollider'
// import currentData from "./biomes/biome1.mjs";
// 
// 
// import {createNoise2D} from "simplex-noise";
// import tooloud from "tooloud";
// import alea from "alea";
// import {InstancedGrassSystem} from "./InstancedGrassSystem.jsx";
// 
// window.noise = createNoise2D(alea(1));
// tooloud.Worley.setSeed(1);
// window.tooloud = tooloud
// 
// 
// const getStableOffset = (worldX, worldZ, seed = 12345) => {
//     const ix = Math.floor(worldX);
//     const iz = Math.floor(worldZ);
// 
//     let hash = Math.abs((ix * 374761393 + iz * 668265263 + seed) | 0);
//     hash ^= hash >> 16;
//     hash *= 0x85ebca6b;
//     hash ^= hash >> 13;
//     hash *= 0xc2b2ae35;
//     hash ^= hash >> 16;
// 
//     return (hash / 0xffffffff) * 3 - 1.0;
// };
// 
// export const GrassFollower = () => {
//     const lastCenter = useRef(new THREE.Vector3(-5000, 0, 0));
// 
//     const gridSize = 50;
//     const halfSize = gridSize / 2;
//     const cellSize = 1;
//     const offsetStrength = 0.8;
// 
//     const moveThreshold = 5;
// 
// 
// 
//     useEffect(() => {
// 
//         const intt = setInterval(() => {
//             if (!window.playerPos) return;
// 
//             const currentPos = new THREE.Vector3(
//                 window.playerPos.x,
//                 0,
//                 window.playerPos.z
//             );
// 
//             if (currentPos.distanceTo(lastCenter.current) < moveThreshold) return;
// 
//             const centerX = Math.round(currentPos.x / cellSize) * cellSize;
//             const centerZ = Math.round(currentPos.z / cellSize) * cellSize;
// 
//             const newCenter = new THREE.Vector3(centerX, 0, centerZ);
// 
//             if (newCenter.distanceTo(lastCenter.current) < 5) return;
// 
//             lastCenter.current.copy(newCenter);
// 
//             const positions = [];
// 
//             for (let i = -halfSize; i < halfSize; i++) {
//                 for (let j = -halfSize; j < halfSize; j++) {
//                     const baseX = centerX + i * cellSize;
//                     const baseZ = centerZ + j * cellSize;
// 
//                     if (baseX > 50 || baseX < -50 || baseZ > 50 || baseZ < -50) {
//                         return
//                     }
// 
//                     const offsetX = getStableOffset(baseX, baseZ, 12345) * offsetStrength;
//                     const offsetZ = getStableOffset(baseX, baseZ, 67890) * offsetStrength;
// 
//                     const x = baseX + offsetX;
//                     const z = baseZ + offsetZ;
//                     const y = 0;
// 
//                     positions.push([x, y, z]);
// 
// 
//                 }
//             }
// 
//             window.update_grass1(positions);
//         }, 500);
// 
//         return () => {
//             clearInterval(intt)
//         }
// 
//     }, [])
// 
//     useEffect(() => {
//         if (window.playerPos) {
//             lastCenter.current.set(-10000, 0, 0); // force initial update
//         }
//     }, []);
// 
//     return null;
// };
// 
// 
// 
// 
// 
// 
// 
// export const DefaultTerrain = ({offsetX = 0, offsetY = 0, worldOffsetX = -500, worldOffsetY = -500, resolution = 100}) => {
// 
//     const ref = useRef()
// 
//     useCollider(ref, null, true)
//     //
// 
// 
//     const tex = useTexture('/content/826ef7605750909f7d02c5717b7b366abfd527296c6789c1ded6b9860682c541i3')
//     useEffect(() => {
//         tex.flipY = false
//         tex.wrapS = THREE.RepeatWrapping;
//         tex.wrapT = THREE.RepeatWrapping;
//         tex.magFilter = THREE.LinearFilter;
//         tex.minFilter = THREE.LinearMipmapLinearFilter;
//         tex.generateMipmaps = true;
//         tex.encoding = THREE.sRGBEncoding
//         tex.anisotropy = 2
//         tex.repeat.x = 10
//         tex.repeat.y = 10
//         tex.needsUpdate = true
//     }, [tex])
// 
// 
//     return (
//         <>
// 
//             <GrassFollower />
// 
//             <InstancedGrassSystem />
// 
// 
//             <group ref={ref} position={[0, 0, 0]} scale={1}
// 
//             >
// 
//                 <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
//                     <planeGeometry args={[100, 100, 1, 1]}/>
//                     <MaterialBuilder  {...currentData} />
//                 </mesh>
// 
//                 <mesh position={[0, -50.02, 0]} scale={[100, 100, 100]}>
//                     <boxGeometry/>
//                     <meshStandardMaterial metalness={-2} color={'#fff337'} map={tex}/>
//                 </mesh>
// 
//             </group>
//         </>
// 
//     )
// }
// 

window.noise = createNoise2D(alea(1));
tooloud.Worley.setSeed(1);
window.tooloud = tooloud;
const getStableOffset = (worldX, worldZ, seed = 12345) => {
  const ix = Math.floor(worldX);
  const iz = Math.floor(worldZ);
  let hash = Math.abs(ix * 374761393 + iz * 668265263 + seed | 0);
  hash ^= hash >> 16;
  hash *= 0x85ebca6b;
  hash ^= hash >> 13;
  hash *= 0xc2b2ae35;
  hash ^= hash >> 16;
  return hash / 0xffffffff * 3 - 1.0;
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
      const currentPos = new THREE.Vector3(window.playerPos.x, 0, window.playerPos.z);
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
            return;
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
      clearInterval(intt);
    };
  }, []);
  useEffect(() => {
    if (window.playerPos) {
      lastCenter.current.set(-10000, 0, 0); // force initial update
    }
  }, []);
  return null;
};
export const DefaultTerrain = ({
  offsetX = 0,
  offsetY = 0,
  worldOffsetX = -500,
  worldOffsetY = -500,
  resolution = 100
}) => {
  const ref = useRef();
  useCollider(ref, null, true);
  //

  const tex = useTexture('/content/826ef7605750909f7d02c5717b7b366abfd527296c6789c1ded6b9860682c541i3');
  useEffect(() => {
    tex.flipY = false;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.magFilter = THREE.LinearFilter;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.generateMipmaps = true;
    tex.encoding = THREE.sRGBEncoding;
    tex.anisotropy = 2;
    tex.repeat.x = 10;
    tex.repeat.y = 10;
    tex.needsUpdate = true;
  }, [tex]);
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(GrassFollower, {}), /*#__PURE__*/_jsx(InstancedGrassSystem, {}), /*#__PURE__*/_jsxs("group", {
      ref: ref,
      position: [0, 0, 0],
      scale: 1,
      children: [/*#__PURE__*/_jsxs("mesh", {
        receiveShadow: true,
        rotation: [-Math.PI / 2, 0, 0],
        children: [/*#__PURE__*/_jsx("planeGeometry", {
          args: [100, 100, 1, 1]
        }), /*#__PURE__*/_jsx(MaterialBuilder, {
          ...currentData
        })]
      }), /*#__PURE__*/_jsxs("mesh", {
        position: [0, -50.02, 0],
        scale: [100, 100, 100],
        children: [/*#__PURE__*/_jsx("boxGeometry", {}), /*#__PURE__*/_jsx("meshStandardMaterial", {
          metalness: -2,
          color: '#fff337',
          map: tex
        })]
      })]
    })]
  });
};






///// component: systems/world/InstancedGrassSystem.jsx 
///// JSX source:
///
// import {useFrame} from "@react-three/fiber";
// import React, {useCallback, useEffect, useMemo, useRef} from "react";
// import * as THREE from "three";
// import {toLinear, snoise} from "shaderNoiseFunctions";
// 
// import {useTexture} from "@react-three/drei";
// import CustomShaderMaterial from "three-custom-shader-material";
// 
// 
// const tileGeometry = new THREE.PlaneGeometry(1,1,1,2)
//     // new BoxGeometry()
//     // createGrassTriangleGeometry()
//     // createGrassBladeGeometry()
// 
// const InstancedGrassSystemComponent = () => {
//     const meshRef = useRef();
//     const instancedGeometry = useRef();
// 
//     const materialRef = useRef()
// 
// 
//     const lagPos = useRef(new THREE.Vector3())
// 
//     useFrame((state) => {
//         if (window.playerPos && materialRef.current && state.clock.running) {
//             const u = materialRef.current.uniforms;
//             u.time.value = state.clock.elapsedTime;
//             u.playerPosition.value = window.playerPos
//             u.playerLagPos.value = lagPos.current
//             lagPos.current.lerp(window.playerPos, 0.2)
//             // console.log(lagPos.current)
//         }
//     });
// 
//     const updateGrassInstances = useCallback((grassInstances) => {
//         // console.log('update::')
//         // console.log((grassInstances))
// 
// 
//         if (instancedGeometry.current) {
//             let num = 0;
// 
//             grassInstances.forEach(grassInstance => {
// 
//                 let x = grassInstance[0] || 0
//                 let y = grassInstance[1] || 0
//                 let z = grassInstance[2] || 0
// 
//                 const scale = Math.abs(Math.sin(x-y*100000) * 0.1) + 0.1;
// 
//                 instancedGeometry.current.attributes.worldPos.array[num] = x;
//                 instancedGeometry.current.attributes.worldPos.array[num + 1] = y;
//                 instancedGeometry.current.attributes.worldPos.array[num + 2] = z;
//                 instancedGeometry.current.attributes.worldPos.array[num + 3] = scale;
// 
//                 num += 4;
//             })
// 
//             instancedGeometry.current.instanceCount = num / 4;
//             instancedGeometry.current.attributes.worldPos.needsUpdate = true;
//         }
// 
// 
//     }, [])
// 
//     useEffect(() => {
//         window.update_grass1 = updateGrassInstances
//     }, [updateGrassInstances])
// 
//     const tex = useTexture('data:image/webp;base64,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')
// 
//     useEffect(() => {
//         tex.flipY = true
//         tex.wrapS = THREE.RepeatWrapping;
//         tex.wrapT = THREE.RepeatWrapping;
//         tex.magFilter = THREE.LinearFilter;
//         tex.minFilter = THREE.LinearMipmapLinearFilter;
//         tex.generateMipmaps = true;
//         tex.encoding =  THREE.sRGBEncoding
//         tex.anisotropy = 1
//         tex.needsUpdate = true
//     }, [tex])
// 
// 
//     const uniforms = useMemo(() => ({
//         time: { value: 0 },
//         zoom: { value: 1 },
//         playerPosition: { value: new THREE.Vector3(0, 0, 0) },
//         playerLagPos: { value: new THREE.Vector3() },
//         map1: { value: tex}
//     }), [tex])
// 
//     const vert = useMemo(() => {
//         return `
//         uniform float time;
//         attribute vec4 worldPos;
//         varying vec2 vUv;
//         varying vec4 vWorldPos;
//         varying vec3 vPos;
//         uniform vec3 playerPosition;
//         uniform vec3 playerLagPos;
// 
//         ${snoise}
// 
//         void main() {
//             vUv = uv;
//             vPos = position;
// 
//             vec3 objectPos = worldPos.xyz;
// 
//             vec3 toCamera = normalize(cameraPosition - objectPos);
// 
//             float angle = -atan(toCamera.x, toCamera.z);
//             mat3 yRotation = mat3(
//                 cos(angle),  0.0, sin(angle),
//                 0.,         1.0, 0.0,
//                 -sin(angle), 0.0, cos(angle)
//             );
//             
//             vec3 scale = vec3(worldPos.w, worldPos.w*1.5, worldPos.w);
//             vec3 finalPosition = objectPos + (yRotation * position  * scale + vec3(0., scale.y*0.5, 0.));
//             
//             
//             
//             
//     float playerDist = distance(playerPosition, worldPos.xyz);
//     float playerLagDist = distance(playerLagPos, worldPos.xyz);
//     float moveGap = clamp(playerLagDist - playerDist, 0., 0.3);
// 
//     float maxDist = 0.9;
//     float maxDisplacement = 3.1;
// 
//     if (playerDist < maxDist) {
//         vec3 direction = normalize(worldPos.xyz - playerPosition);
//         
//         float strength = 0.2 + smoothstep(maxDist, -0.5, playerDist) * sin(moveGap * (time*0.004));
//         
//         finalPosition += direction * strength * maxDisplacement * (((position.y+0.5) * (position.y+0.5)));
//     }
//     
//     
//     
//             
//             if (position.y > -0.1) {
//                 
//     float n1 = snoise(worldPos.xz * 5.4 + (time * 0.5));
//     float n2 = abs( snoise(worldPos.xz * 0.01 + (time * 0.13)));
// 
//     finalPosition.x -= (n2 * 3. + n1) * (((position.y * position.y) +0.1) * 0.9);
//             }
// 
//             vWorldPos = worldPos;
//             csm_Position = finalPosition;
//             // csm_Position = (position * sin(worldPos.x*worldPos.z*1000.) + vec3(0., 0.5, 0.)) + worldPos.xyz;
//         }
//     `
//     })
// 
//     const frag = useMemo(() => {
//         return `
//         varying vec2 vUv;
//         uniform sampler2D map1;
//         uniform float time;
//         uniform vec3 playerPosition;
//         varying vec3 vPos;
//         varying vec4 vWorldPos;
// 
//  
//         ${toLinear}
//         ${snoise}
// 
//         void main() {
//         vec4 grass = texture2D(map1, vUv*0.95);
//             vec3 color = grass.rgb * 1.0;
//             color.r *= vWorldPos.w * 5.0;
//             color.b *= 0.8;
//             float a = grass.a;
//             float dist = distance(vWorldPos.xyz, playerPosition.xyz);
//             float camDist = distance(vWorldPos.xyz, cameraPosition.xyz);
//             
//             a -= smoothstep(0., 60., dist);
//             
//              if (camDist < 4.) {
//                         a *= smoothstep(0., 4., camDist);
//                     }
//                     
//             
//             // color.r = vUv.x;
//             // color.b = vUv.y;
//             // color = vec3(0., 1., 0.);
//             a = clamp(a, 0.0, 0.9);
//             color = clamp(color, 0.0, 1.0);
// 
//             csm_DiffuseColor.rgb = toLinear(vec4(color, 1.0)).rgb;
//             csm_DiffuseColor.a = a;
//         }
//     `
//     })
//     return (
//         <mesh ref={meshRef} frustumCulled={false} renderOrder={90}>
//             <instancedBufferGeometry
//                 name={'grass-instances'}
//                 ref={instancedGeometry}
//                 index={tileGeometry.index}
//                 attributes-position={tileGeometry.attributes.position}
//                 attributes-uv={tileGeometry.attributes.uv}
//                 instanceCount={0}
//             >
//                 <instancedBufferAttribute
//                     attach="attributes-worldPos"
//                     args={[new Float32Array(new Array(10000 * 4).fill(0)), 4]}
//                 />
//             </instancedBufferGeometry>
//             <CustomShaderMaterial
//                 ref={materialRef}
//                 baseMaterial={THREE.MeshToonMaterial}
//                 transparent
//                 fog={false}
//                 depthWrite={false}
//                 blending={THREE.AdditiveBlending}
//                 uniforms={uniforms}
//                 vertexShader={vert}
//                 fragmentShader={frag}
//             />
// 
// 
//         </mesh>
//     )
// }
// 
// export const InstancedGrassSystem = React.memo(InstancedGrassSystemComponent)
// 

const tileGeometry = new THREE.PlaneGeometry(1, 1, 1, 2);
// new BoxGeometry()
// createGrassTriangleGeometry()
// createGrassBladeGeometry()

const InstancedGrassSystemComponent = () => {
  const meshRef = useRef();
  const instancedGeometry = useRef();
  const materialRef = useRef();
  const lagPos = useRef(new THREE.Vector3());
  useFrame(state => {
    if (window.playerPos && materialRef.current && state.clock.running) {
      const u = materialRef.current.uniforms;
      u.time.value = state.clock.elapsedTime;
      u.playerPosition.value = window.playerPos;
      u.playerLagPos.value = lagPos.current;
      lagPos.current.lerp(window.playerPos, 0.2);
      // console.log(lagPos.current)
    }
  });
  const updateGrassInstances = useCallback(grassInstances => {
    // console.log('update::')
    // console.log((grassInstances))

    if (instancedGeometry.current) {
      let num = 0;
      grassInstances.forEach(grassInstance => {
        let x = grassInstance[0] || 0;
        let y = grassInstance[1] || 0;
        let z = grassInstance[2] || 0;
        const scale = Math.abs(Math.sin(x - y * 100000) * 0.1) + 0.1;
        instancedGeometry.current.attributes.worldPos.array[num] = x;
        instancedGeometry.current.attributes.worldPos.array[num + 1] = y;
        instancedGeometry.current.attributes.worldPos.array[num + 2] = z;
        instancedGeometry.current.attributes.worldPos.array[num + 3] = scale;
        num += 4;
      });
      instancedGeometry.current.instanceCount = num / 4;
      instancedGeometry.current.attributes.worldPos.needsUpdate = true;
    }
  }, []);
  useEffect(() => {
    window.update_grass1 = updateGrassInstances;
  }, [updateGrassInstances]);
  const tex = useTexture('data:image/webp;base64,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');
  useEffect(() => {
    tex.flipY = true;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.magFilter = THREE.LinearFilter;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.generateMipmaps = true;
    tex.encoding = THREE.sRGBEncoding;
    tex.anisotropy = 1;
    tex.needsUpdate = true;
  }, [tex]);
  const uniforms = useMemo(() => ({
    time: {
      value: 0
    },
    zoom: {
      value: 1
    },
    playerPosition: {
      value: new THREE.Vector3(0, 0, 0)
    },
    playerLagPos: {
      value: new THREE.Vector3()
    },
    map1: {
      value: tex
    }
  }), [tex]);
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
    `;
  });
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
    `;
  });
  return /*#__PURE__*/_jsxs("mesh", {
    ref: meshRef,
    frustumCulled: false,
    renderOrder: 90,
    children: [/*#__PURE__*/_jsx("instancedBufferGeometry", {
      name: 'grass-instances',
      ref: instancedGeometry,
      index: tileGeometry.index,
      "attributes-position": tileGeometry.attributes.position,
      "attributes-uv": tileGeometry.attributes.uv,
      instanceCount: 0,
      children: /*#__PURE__*/_jsx("instancedBufferAttribute", {
        attach: "attributes-worldPos",
        args: [new Float32Array(new Array(10000 * 4).fill(0)), 4]
      })
    }), /*#__PURE__*/_jsx(CustomShaderMaterial, {
      ref: materialRef,
      baseMaterial: THREE.MeshToonMaterial,
      transparent: true,
      fog: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: uniforms,
      vertexShader: vert,
      fragmentShader: frag
    })]
  });
};
export const InstancedGrassSystem = /*#__PURE__*/React.memo(InstancedGrassSystemComponent);






///// component: systems/vfx/FootDustVFX.jsx 
///// JSX source:
///
// import { useFrame, useThree } from "@react-three/fiber";
// import {useCallback, useEffect, useMemo, useRef} from "react";
// import * as THREE from "three";
// import { shaderMaterial } from "@react-three/drei";
// import { extend } from "@react-three/fiber";
// 
// 
// 
// export const DamageNumberMaterial = shaderMaterial(
//     {
//         time: 0,
//         zoom: 1,
//         playerPos: new THREE.Vector3(),
//         playerLagPos: new THREE.Vector3(),
//         cameraPos: new THREE.Vector3(),
//     },
//     `
//     uniform float time;
//     uniform vec3 cameraPos;
//     attribute vec4 worldPos;
//     varying vec2 vUv;
//     varying vec4 vWorldPos;
// 
//     void main() {
//       vUv = uv.xy;
//       vWorldPos = worldPos;
//       
//       float timeSinceSpawn = (time - worldPos.w);
//       
//       float initialVelocity = 11.0;
//       float gravity = 60.0;
//       float yOffset = initialVelocity * timeSinceSpawn - 0.5 * gravity * timeSinceSpawn * timeSinceSpawn;
//       
//       vec3 objectPos = worldPos.xyz;
//       objectPos.y += yOffset * 0.4;
//       objectPos.x += yOffset * sin(worldPos.w*1000.) * 0.2;
//       objectPos.z += yOffset * sin(worldPos.w*8241.) * 0.2;
//       
//       vec3 toCamera = normalize(cameraPos - objectPos);
//       vec3 up = vec3(0.0, 1.0, 0.0);
//       vec3 right = normalize(cross(up, toCamera));
//       up = normalize(cross(toCamera, right));
//       
//       mat3 billboardMatrix = mat3(
//         right,
//         up,
//         toCamera
//       );
//       
//       float scale = 0.1 + (yOffset*0.05);
//       vec3 localPos = billboardMatrix * (position * scale);
//       
//       vec4 worldPosition = vec4(localPos + objectPos, 1.0);
//       
//       gl_Position = projectionMatrix * modelViewMatrix * worldPosition;
//     }
//   `,
//     `
//     uniform float time;
//     uniform float zoom;
//     uniform vec3 playerPos;
//     uniform vec3 playerLagPos;
//     varying vec2 vUv;
//     varying vec4 vWorldPos;
// 
//     void main() {
//       
//       vec3 c = vec3(0.1, 0.4, 0.1)*0.5;
//       float a = 0.8 * (1.5 - (time - vWorldPos.w));
//       
//       gl_FragColor = vec4(c, a);
//     }
//   `,
//     (mat) => {
//         mat.transparent = true;
//         // mat.depthTest = false;
//         mat.blending = THREE.AdditiveBlending;
//     }
// );
// 
// extend({ DamageNumberMaterial });
// 
// export const FootDustVFX = () => {
//     const meshRef = useRef();
//     const instancedGeometry = useRef();
//     const damageNumberCache = useRef([]);
//     const { clock, camera } = useThree();
// 
// 
//     const geom = useMemo(() => new THREE.PlaneGeometry(1, 1), []);
// 
//     useFrame(() => {
//         if (!meshRef.current || !instancedGeometry.current) return;
// 
//         const now = clock.elapsedTime;
// 
//         // Filter damage numbers older than 1 second
//         damageNumberCache.current = damageNumberCache.current.filter(
//             (dn) => now - dn.spawnTime < 1
//         );
// 
//         // Update instance positions and number indices
//         let num = 0;
//         damageNumberCache.current.forEach((damageNumber) => {
//             let x = damageNumber.x || 0;
//             let y = damageNumber.y || 0;
//             let z = damageNumber.z || 0;
// 
//             instancedGeometry.current.attributes.worldPos.array[num] = x;
//             instancedGeometry.current.attributes.worldPos.array[num + 1] = 0;
//             instancedGeometry.current.attributes.worldPos.array[num + 2] = z;
//             instancedGeometry.current.attributes.worldPos.array[num + 3] = damageNumber.spawnTime;
// 
//             num += 4;
//         });
// 
//         meshRef.current.material.uniforms.time.value = now;
//         meshRef.current.material.uniforms.cameraPos.value.copy(camera.position);
// 
//         instancedGeometry.current.instanceCount = num / 4;
//         instancedGeometry.current.attributes.worldPos.needsUpdate = true;
//     });
// 
//     // useEffect(() => {
//     //     const getid = async () => {
//     //         console.log('idd')
//     //         const idd = await getBitmapInscriptionId(100100)
//     //
//     //         console.log(idd)
//     //     }
//     //     getid()
//     // })
// 
//     const addNum = useCallback(({position}) => {
//         // console.log('add')
//         const spawnTime = clock.elapsedTime;
//         // Random number between 1 and 100
//         // const numberIndex = (100 - Math.floor(Math.random() * 25)) + 1;
//         damageNumberCache.current.push({
//             x: (position.x || window.playerPos.x) + (Math.random() * 0.2),
//             y: position.y ||( window.playerPos.y + 1.5),
//             z: (position.z || window.playerPos.z) + (Math.random() * 0.2),
//             spawnTime,
//             // numberIndex,
//         });
// 
//         let num = 0;
//         damageNumberCache.current.forEach((damageNumber) => {
//             let x = damageNumber.x || 0;
//             let y = damageNumber.y || 0;
//             let z = damageNumber.z || 0;
// 
//             instancedGeometry.current.attributes.worldPos.array[num] = x;
//             instancedGeometry.current.attributes.worldPos.array[num + 1] = y;
//             instancedGeometry.current.attributes.worldPos.array[num + 2] = z;
//             instancedGeometry.current.attributes.worldPos.array[num + 3] = damageNumber.spawnTime;
// 
//             num += 4;
//         });
// 
//         instancedGeometry.current.instanceCount = num / 4;
//         instancedGeometry.current.attributes.worldPos.needsUpdate = true;
//     }, [])
// 
//     useEffect(() => {
//         window.addFootDust = addNum
//         const handleKeyDown = (e) => {
//             if (e.key === "i" && instancedGeometry.current) {
//                 addNum({position: window.playerPos})
//             }
//         };
// 
//         window.addEventListener("keydown", handleKeyDown);
//         return () => window.removeEventListener("keydown", handleKeyDown);
//     }, [addNum]);
// 
//     return (
//         <mesh ref={meshRef} frustumCulled={false} renderOrder={500}>
//             <instancedBufferGeometry
//                 name="foot-dust-vfx"
//                 ref={instancedGeometry}
//                 index={geom.index}
//                 attributes-position={geom.attributes.position}
//                 attributes-uv={geom.attributes.uv}
//                 instanceCount={0}
//             >
//                 <instancedBufferAttribute
//                     attach="attributes-worldPos"
//                     args={[new Float32Array(new Array(200 * 4).fill(0)), 4]}
//                 />
//                 <instancedBufferAttribute
//                     attach="attributes-numberIndex"
//                     args={[new Float32Array(new Array(200).fill(0)), 1]}
//                 />
//             </instancedBufferGeometry>
//             <damageNumberMaterial />
//         </mesh>
//     );
// };
// 

export const DamageNumberMaterial = shaderMaterial({
  time: 0,
  zoom: 1,
  playerPos: new THREE.Vector3(),
  playerLagPos: new THREE.Vector3(),
  cameraPos: new THREE.Vector3()
}, `
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
  `, `
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
  `, mat => {
  mat.transparent = true;
  // mat.depthTest = false;
  mat.blending = THREE.AdditiveBlending;
});
extend({
  DamageNumberMaterial
});
export const FootDustVFX = () => {
  const meshRef = useRef();
  const instancedGeometry = useRef();
  const damageNumberCache = useRef([]);
  const {
    clock,
    camera
  } = useThree();
  const geom = useMemo(() => new THREE.PlaneGeometry(1, 1), []);
  useFrame(() => {
    if (!meshRef.current || !instancedGeometry.current) return;
    const now = clock.elapsedTime;

    // Filter damage numbers older than 1 second
    damageNumberCache.current = damageNumberCache.current.filter(dn => now - dn.spawnTime < 1);

    // Update instance positions and number indices
    let num = 0;
    damageNumberCache.current.forEach(damageNumber => {
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

  const addNum = useCallback(({
    position
  }) => {
    // console.log('add')
    const spawnTime = clock.elapsedTime;
    // Random number between 1 and 100
    // const numberIndex = (100 - Math.floor(Math.random() * 25)) + 1;
    damageNumberCache.current.push({
      x: (position.x || window.playerPos.x) + Math.random() * 0.2,
      y: position.y || window.playerPos.y + 1.5,
      z: (position.z || window.playerPos.z) + Math.random() * 0.2,
      spawnTime
      // numberIndex,
    });
    let num = 0;
    damageNumberCache.current.forEach(damageNumber => {
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
  }, []);
  useEffect(() => {
    window.addFootDust = addNum;
    const handleKeyDown = e => {
      if (e.key === "i" && instancedGeometry.current) {
        addNum({
          position: window.playerPos
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [addNum]);
  return /*#__PURE__*/_jsxs("mesh", {
    ref: meshRef,
    frustumCulled: false,
    renderOrder: 500,
    children: [/*#__PURE__*/_jsxs("instancedBufferGeometry", {
      name: "foot-dust-vfx",
      ref: instancedGeometry,
      index: geom.index,
      "attributes-position": geom.attributes.position,
      "attributes-uv": geom.attributes.uv,
      instanceCount: 0,
      children: [/*#__PURE__*/_jsx("instancedBufferAttribute", {
        attach: "attributes-worldPos",
        args: [new Float32Array(new Array(200 * 4).fill(0)), 4]
      }), /*#__PURE__*/_jsx("instancedBufferAttribute", {
        attach: "attributes-numberIndex",
        args: [new Float32Array(new Array(200).fill(0)), 1]
      })]
    }), /*#__PURE__*/_jsx("damageNumberMaterial", {})]
  });
};






///// component: systems/player/DefaultPlayerController.jsx 
///// JSX source:
///
// import {useFrame, useThree} from "@react-three/fiber";
// import {forwardRef, useCallback, useRef} from "react";
// import * as THREE from "three";
// 
// import {ECS} from 'ecs'
// import {colliderStore} from "useCollider";
// 
// const PI = Math.PI;
// const TWO_PI = PI * 2;
// const rotationTarget = new THREE.Object3D();
// const tempEuler = new THREE.Euler();
// const moveDirection = new THREE.Vector3();
// const forwardDirection = new THREE.Vector3();
// const rightDirection = new THREE.Vector3();
// const playerDirection = new THREE.Vector3();
// 
// window.moveDirection = new THREE.Vector3(0, 0, 1);
// 
// const vec3 = new THREE.Vector3()
// const vec3_2 = new THREE.Vector3()
// 
// function normalizeAngle(from, to) {
//     let delta = (to - from) % TWO_PI;
//     if (delta > PI) delta -= TWO_PI;
//     if (delta < -PI) delta += TWO_PI;
//     return from + delta;
// }
// 
// window.camFocused = false
// export const DefaultPlayerController = forwardRef((props, ref) => {
// 
//     const noneFound = useRef(false)
// 
//     const forwardRayRef = useRef()
// 
//     const currentAnimation = useRef("idle");
// 
//     const player = ECS.useCurrentEntity()
// 
// 
//     const stepping = useRef(false)
//     const lastStepSound = useRef(0)
// 
//     const {raycaster} = useThree()
// 
//     useFrame(({camera, clock}, delta) => {
//         if (player) {
//             moveDirection.set(0, 0, 0);
//             forwardDirection.set(0, 0, 0);
//             rightDirection.set(0, 0, 0);
// 
//             const playerWorldQuaternion = new THREE.Quaternion(); // To get player's orientation
// 
//             camera.getWorldDirection(forwardDirection);
//             forwardDirection.y = 0;
//             forwardDirection.normalize();
//             window.camForward = forwardDirection;
// 
//             playerDirection.set(0, 0, 1).applyQuaternion(playerWorldQuaternion).normalize();
// 
// 
//             rightDirection.crossVectors(camera.up, forwardDirection).normalize();
//             if (window.keyDown.w || window.dir?.includes("up")) moveDirection.add(forwardDirection);
//             if (window.keyDown.s || window.dir?.includes("down")) moveDirection.add(forwardDirection.negate());
//             if (window.keyDown.d || window.dir?.includes("right")) moveDirection.add(rightDirection.negate());
//             if (window.keyDown.a || window.dir?.includes("left") )moveDirection.add(rightDirection);
// 
//             // console.log(player.render)
// 
//             const maxSpeed = player.speed || 5;
//             const acceleration = player.acceleration || 10; // Acceleration rate
//             const deceleration = player.deceleration || 10; // Deceleration rate
// 
// 
//             const colliders = Object.values(colliderStore.state.colliders).flat();
//             const collide = grav(player, delta, colliders)
// 
//             if (collide?.normal && collide?.distance < player.speed * 0.15) {
//                 // player.velocity.x -= forwardDirection.x*31
//                 // player.velocity.y -= forwardDirection.y*31
//                 // player.velocity.z -= forwardDirection.z*31
//                 moveDirection.add(collide.normal)
//             }
// 
//             if (moveDirection.length() > 0) {
// 
//                 window.moveDirection = moveDirection.clone()
//                 // console.log(window.moveDirection)
// 
//                 if (!player.state.jumping && stepping.current && Date.now() > lastStepSound.current + 400) {
//                     window.sounds.step1.triggerAttackRelease(["F1"], 0.4);
//                     lastStepSound.current = Date.now()
//                     window.addFootDust({
//                         position: player.position
//                     })
//                     setTimeout(() => {
//                         window.addFootDust({
//                             position: player.position
//                         })
//                     }, 20)
// 
//                     setTimeout(() => {
//                         window.addFootDust({
//                             position: player.position
//                         })
//                     }, 50)
//                 } else {
//                     setTimeout(() => {
//                         stepping.current = true
//                     }, 400)
//                 }
// 
//                 moveDirection.normalize();
//                 player.state.running = true;
// 
//                 if (!window.playerMoving) {
//                     window.playerMoving = true;
//                 }
// 
// 
//                 // if (collide?.distance < 2) {
//                 //     return
//                 //     // moveDirection.x += 1
//                 // }
// 
// 
//                 // Calculate target velocity
//                 const targetVelocity = new THREE.Vector3(
//                     moveDirection.x * maxSpeed,
//                     0,
//                     moveDirection.z * maxSpeed
//                 );
// 
//                 // Smoothly interpolate velocity toward target velocity
//                 player.velocity.x += (targetVelocity.x - player.velocity.x) * acceleration * delta;
//                 player.velocity.z += (targetVelocity.z - player.velocity.z) * acceleration * delta;
// 
//                 // Clamp velocity to maxSpeed to prevent overshooting
//                 const currentSpeed = Math.sqrt(player.velocity.x ** 2 + player.velocity.z ** 2);
//                 if (currentSpeed > maxSpeed) {
//                     const scale = maxSpeed / currentSpeed;
//                     player.velocity.x *= scale;
//                     player.velocity.z *= scale;
//                 }
// 
// 
//             } else {
//                 if (stepping.current) {
//                     stepping.current = false
//                 }
//                 player.state.running = false;
// 
//                 if (window.playerMoving) {
//                     window.playerMoving = false;
//                 }
// 
//                 // Apply deceleration to smoothly stop
//                 const speed = Math.sqrt(player.velocity.x ** 2 + player.velocity.z ** 2);
//                 if (speed > 0) {
//                     const decelerationFactor = Math.max(0, speed - deceleration * delta) / speed;
//                     player.velocity.x *= decelerationFactor;
//                     player.velocity.z *= decelerationFactor;
//                 } else {
//                     player.velocity.x = 0;
//                     player.velocity.z = 0;
//                 }
//             }
// 
//             // Update position using current velocity
//             player.position.x += player.velocity.x * delta;
//             player.position.z += player.velocity.z * delta;
// 
// 
//             if (player.position.x > 50) {
//                 player.position.x = 50
//             }
// 
//             if (player.position.x < -50) {
//                 player.position.x = -50
//             }
//             if (player.position.z > 50) {
//                 player.position.z = 50
//             }
//             if (player.position.z < -50) {
//                 player.position.z = -50
//             }
// 
//             window.playerPos = player.position;
// 
//             if (player.state) {
//                 const targetAnimation = player.state.running ? "run" : "idle";
//                 if (targetAnimation !== currentAnimation.current && player.render.model.current) {
//                     player.render.model.current.setAnimation(targetAnimation, 0.3, 0.1, 1.2);
//                     currentAnimation.current = targetAnimation;
//                 }
// 
// 
//                 if (player.rotationSpring) {
//                     if (moveDirection.length() > 0) {
//                         if (player.state.running) {
//                             rotationTarget.position.set(player.position.x, player.position.y, player.position.z);
//                             rotationTarget.lookAt(
//                                 player.position.x + moveDirection.x,
//                                 player.position.y + moveDirection.y,
//                                 player.position.z + moveDirection.z
//                             );
// 
//                             tempEuler.setFromQuaternion(rotationTarget.quaternion, "YXZ");
//                             const shortestY = normalizeAngle(player.rotation.y, tempEuler.y);
//                             player.rotationSpring.setRotationY(shortestY);
//                         }
//                     }
//                 }
//             }
// 
//             if (window.camFocused === false) {
//                 const dist = window.cam.distance || 1;
//                 let targetY = player.position.y + (1.9 - dist * -0.03);
// 
//                 window.cam.moveTo(player.position.x, targetY, player.position.z, false);
//             }
// 
//         }
//     });
// 
// 
//     const grav = useCallback((entity, delta, colliders) => {
// 
//         if (window.rebasing) {
//             return null
//         }
//         const {velocity, position} = entity;
// 
//         if (velocity && position) {
//             velocity.y -= 8.5 * delta;
// 
//             position.y += velocity.y * delta;
// 
//         }
// 
//         raycaster.set(
//             vec3.set(position.x, position.y + (2), position.z),
//             vec3_2.set(0, -1, 0)
//         );
// 
//         if (noneFound.current) {
//             noneFound.current = false
//         }
// 
//         // console.log(colliders)
// 
//         const intersect = raycaster.intersectObjects(colliders);
// 
//         // console.log(intersect)
//         if (intersect[0]) {
//             const groundY = intersect[0].point.y;
// 
//             const newY = position.y;
// 
//             if (newY <= groundY) {
//                 entity.position.y = groundY;
//                 entity.velocity.y = 0;
//                 entity.intersectPosition = groundY;
//                 entity.state.jumping = false;
//             }
// 
//             entity.groundNormal = intersect[0].normal
//         } else {
//             raycaster.set(
//                 vec3.set(position.x, position.y + (3), position.z),
//                 vec3_2.set(0, -1, 0)
//             );
// 
//             if (noneFound.current) {
//                 noneFound.current = false
//             }
// 
//             // console.log(colliders)
// 
//             const intersect = raycaster.intersectObjects(colliders);
// 
//             // console.log(intersect)
//             if (intersect[0]) {
//                 const groundY = intersect[0].point.y;
// 
//                 const newY = position.y + entity.velocity.y;
// 
//                 // console.log(groundY)
//                 // console.log(entity)
//                 if (newY <= groundY) {
//                     entity.position.y = groundY;
//                     entity.velocity.y = 0;
//                     entity.intersectPosition = groundY;
//                     entity.state.jumping = false; // Reset jumping state
//                 } else {
//                     entity.position.y = newY;
//                     entity.intersectPosition = null;
//                 }
// 
//                 // console.log
//                 entity.groundNormal = intersect[0].normal
//             } else {
//                 noneFound.current = true
//                 entity.position.y += entity.velocity.y * delta;
//                 entity.intersectPosition = null;
//             }
// 
// 
//         }
// 
// 
//         // forward ray
// 
// 
//         raycaster.set(
//             vec3.set(position.x, position.y + 1, position.z),
//             forwardDirection
//         );
// 
//         if (noneFound.current) {
//             noneFound.current = false
//         }
// 
//         // console.log(colliders)
// 
//         const intersectForward = raycaster.intersectObjects(colliders);
// 
//         // console.log(intersectForward[0])
//         if (intersectForward?.[0]?.point) {
//             forwardRayRef.current.position.copy(intersectForward[0].point)
//         }
// 
// 
//         if (position.y < -0) {
//             position.y = -0;
//             velocity.y = 0;
//         }
//         if (intersectForward?.[0]) {
//             return intersectForward[0]
//         }
// 
// 
//     }, [raycaster])
// 
//     useFrame((_, delta) => {
// 
//         const colliders = Object.values(colliderStore.state.colliders).flat();
//         // console.log(colliders)
//         grav(player, delta, colliders)
// 
//     })
// 
//     return (
//         <mesh visible={false} scale={0.2} ref={forwardRayRef}>
//             <boxGeometry/>
//             <meshNormalMaterial/>
//         </mesh>
//     )
// 
// 
// })
// 

const PI = Math.PI;
const TWO_PI = PI * 2;
const rotationTarget = new THREE.Object3D();
const tempEuler = new THREE.Euler();
const moveDirection = new THREE.Vector3();
const forwardDirection = new THREE.Vector3();
const rightDirection = new THREE.Vector3();
const playerDirection = new THREE.Vector3();
window.moveDirection = new THREE.Vector3(0, 0, 1);
const vec3 = new THREE.Vector3();
const vec3_2 = new THREE.Vector3();
function normalizeAngle(from, to) {
  let delta = (to - from) % TWO_PI;
  if (delta > PI) delta -= TWO_PI;
  if (delta < -PI) delta += TWO_PI;
  return from + delta;
}
window.camFocused = false;
export const DefaultPlayerController = /*#__PURE__*/forwardRef((props, ref) => {
  const noneFound = useRef(false);
  const forwardRayRef = useRef();
  const currentAnimation = useRef("idle");
  const player = ECS.useCurrentEntity();
  const stepping = useRef(false);
  const lastStepSound = useRef(0);
  const {
    raycaster
  } = useThree();
  useFrame(({
    camera,
    clock
  }, delta) => {
    if (player) {
      moveDirection.set(0, 0, 0);
      forwardDirection.set(0, 0, 0);
      rightDirection.set(0, 0, 0);
      const playerWorldQuaternion = new THREE.Quaternion(); // To get player's orientation

      camera.getWorldDirection(forwardDirection);
      forwardDirection.y = 0;
      forwardDirection.normalize();
      window.camForward = forwardDirection;
      playerDirection.set(0, 0, 1).applyQuaternion(playerWorldQuaternion).normalize();
      rightDirection.crossVectors(camera.up, forwardDirection).normalize();
      if (window.keyDown.w || window.dir?.includes("up")) moveDirection.add(forwardDirection);
      if (window.keyDown.s || window.dir?.includes("down")) moveDirection.add(forwardDirection.negate());
      if (window.keyDown.d || window.dir?.includes("right")) moveDirection.add(rightDirection.negate());
      if (window.keyDown.a || window.dir?.includes("left")) moveDirection.add(rightDirection);

      // console.log(player.render)

      const maxSpeed = player.speed || 5;
      const acceleration = player.acceleration || 10; // Acceleration rate
      const deceleration = player.deceleration || 10; // Deceleration rate

      const colliders = Object.values(colliderStore.state.colliders).flat();
      const collide = grav(player, delta, colliders);
      if (collide?.normal && collide?.distance < player.speed * 0.15) {
        // player.velocity.x -= forwardDirection.x*31
        // player.velocity.y -= forwardDirection.y*31
        // player.velocity.z -= forwardDirection.z*31
        moveDirection.add(collide.normal);
      }
      if (moveDirection.length() > 0) {
        window.moveDirection = moveDirection.clone();
        // console.log(window.moveDirection)

        if (!player.state.jumping && stepping.current && Date.now() > lastStepSound.current + 400) {
          window.sounds.step1.triggerAttackRelease(["F1"], 0.4);
          lastStepSound.current = Date.now();
          window.addFootDust({
            position: player.position
          });
          setTimeout(() => {
            window.addFootDust({
              position: player.position
            });
          }, 20);
          setTimeout(() => {
            window.addFootDust({
              position: player.position
            });
          }, 50);
        } else {
          setTimeout(() => {
            stepping.current = true;
          }, 400);
        }
        moveDirection.normalize();
        player.state.running = true;
        if (!window.playerMoving) {
          window.playerMoving = true;
        }

        // if (collide?.distance < 2) {
        //     return
        //     // moveDirection.x += 1
        // }

        // Calculate target velocity
        const targetVelocity = new THREE.Vector3(moveDirection.x * maxSpeed, 0, moveDirection.z * maxSpeed);

        // Smoothly interpolate velocity toward target velocity
        player.velocity.x += (targetVelocity.x - player.velocity.x) * acceleration * delta;
        player.velocity.z += (targetVelocity.z - player.velocity.z) * acceleration * delta;

        // Clamp velocity to maxSpeed to prevent overshooting
        const currentSpeed = Math.sqrt(player.velocity.x ** 2 + player.velocity.z ** 2);
        if (currentSpeed > maxSpeed) {
          const scale = maxSpeed / currentSpeed;
          player.velocity.x *= scale;
          player.velocity.z *= scale;
        }
      } else {
        if (stepping.current) {
          stepping.current = false;
        }
        player.state.running = false;
        if (window.playerMoving) {
          window.playerMoving = false;
        }

        // Apply deceleration to smoothly stop
        const speed = Math.sqrt(player.velocity.x ** 2 + player.velocity.z ** 2);
        if (speed > 0) {
          const decelerationFactor = Math.max(0, speed - deceleration * delta) / speed;
          player.velocity.x *= decelerationFactor;
          player.velocity.z *= decelerationFactor;
        } else {
          player.velocity.x = 0;
          player.velocity.z = 0;
        }
      }

      // Update position using current velocity
      player.position.x += player.velocity.x * delta;
      player.position.z += player.velocity.z * delta;
      if (player.position.x > 50) {
        player.position.x = 50;
      }
      if (player.position.x < -50) {
        player.position.x = -50;
      }
      if (player.position.z > 50) {
        player.position.z = 50;
      }
      if (player.position.z < -50) {
        player.position.z = -50;
      }
      window.playerPos = player.position;
      if (player.state) {
        const targetAnimation = player.state.running ? "run" : "idle";
        if (targetAnimation !== currentAnimation.current && player.render.model.current) {
          player.render.model.current.setAnimation(targetAnimation, 0.3, 0.1, 1.2);
          currentAnimation.current = targetAnimation;
        }
        if (player.rotationSpring) {
          if (moveDirection.length() > 0) {
            if (player.state.running) {
              rotationTarget.position.set(player.position.x, player.position.y, player.position.z);
              rotationTarget.lookAt(player.position.x + moveDirection.x, player.position.y + moveDirection.y, player.position.z + moveDirection.z);
              tempEuler.setFromQuaternion(rotationTarget.quaternion, "YXZ");
              const shortestY = normalizeAngle(player.rotation.y, tempEuler.y);
              player.rotationSpring.setRotationY(shortestY);
            }
          }
        }
      }
      if (window.camFocused === false) {
        const dist = window.cam.distance || 1;
        let targetY = player.position.y + (1.9 - dist * -0.03);
        window.cam.moveTo(player.position.x, targetY, player.position.z, false);
      }
    }
  });
  const grav = useCallback((entity, delta, colliders) => {
    if (window.rebasing) {
      return null;
    }
    const {
      velocity,
      position
    } = entity;
    if (velocity && position) {
      velocity.y -= 8.5 * delta;
      position.y += velocity.y * delta;
    }
    raycaster.set(vec3.set(position.x, position.y + 2, position.z), vec3_2.set(0, -1, 0));
    if (noneFound.current) {
      noneFound.current = false;
    }

    // console.log(colliders)

    const intersect = raycaster.intersectObjects(colliders);

    // console.log(intersect)
    if (intersect[0]) {
      const groundY = intersect[0].point.y;
      const newY = position.y;
      if (newY <= groundY) {
        entity.position.y = groundY;
        entity.velocity.y = 0;
        entity.intersectPosition = groundY;
        entity.state.jumping = false;
      }
      entity.groundNormal = intersect[0].normal;
    } else {
      raycaster.set(vec3.set(position.x, position.y + 3, position.z), vec3_2.set(0, -1, 0));
      if (noneFound.current) {
        noneFound.current = false;
      }

      // console.log(colliders)

      const intersect = raycaster.intersectObjects(colliders);

      // console.log(intersect)
      if (intersect[0]) {
        const groundY = intersect[0].point.y;
        const newY = position.y + entity.velocity.y;

        // console.log(groundY)
        // console.log(entity)
        if (newY <= groundY) {
          entity.position.y = groundY;
          entity.velocity.y = 0;
          entity.intersectPosition = groundY;
          entity.state.jumping = false; // Reset jumping state
        } else {
          entity.position.y = newY;
          entity.intersectPosition = null;
        }

        // console.log
        entity.groundNormal = intersect[0].normal;
      } else {
        noneFound.current = true;
        entity.position.y += entity.velocity.y * delta;
        entity.intersectPosition = null;
      }
    }

    // forward ray

    raycaster.set(vec3.set(position.x, position.y + 1, position.z), forwardDirection);
    if (noneFound.current) {
      noneFound.current = false;
    }

    // console.log(colliders)

    const intersectForward = raycaster.intersectObjects(colliders);

    // console.log(intersectForward[0])
    if (intersectForward?.[0]?.point) {
      forwardRayRef.current.position.copy(intersectForward[0].point);
    }
    if (position.y < -0) {
      position.y = -0;
      velocity.y = 0;
    }
    if (intersectForward?.[0]) {
      return intersectForward[0];
    }
  }, [raycaster]);
  useFrame((_, delta) => {
    const colliders = Object.values(colliderStore.state.colliders).flat();
    // console.log(colliders)
    grav(player, delta, colliders);
  });
  return /*#__PURE__*/_jsxs("mesh", {
    visible: false,
    scale: 0.2,
    ref: forwardRayRef,
    children: [/*#__PURE__*/_jsx("boxGeometry", {}), /*#__PURE__*/_jsx("meshNormalMaterial", {})]
  });
});






///// component: components/VRM.jsx 
///// JSX source:
///
// import React, {forwardRef, useEffect, useRef, useState, useImperativeHandle, Suspense, useLayoutEffect} from "react"
// import {useFrame} from "@react-three/fiber"
// import {GLTFLoader} from 'gltfAndDraco'
// import {DRACOLoader} from 'gltfAndDraco'
// import {VRMLoaderPlugin, VRMUtils} from '@pixiv/three-vrm'
// import {VRMAnimationLoaderPlugin, VRMLookAtQuaternionProxy, createVRMAnimationClip} from '@pixiv/three-vrm-animation'
// 
// let currentFinishedListener = null;
// let isAnimationPlaying = false;
// let debounceTimeout = null;
// import * as THREE from "three"
// import {loadMixamoAnimation} from 'vrm-utils'
// 
// 
// 
// export const VRM = forwardRef(({
//                                       src = '/content/609b4b19a41e89ee3274c4455036ff19ff0ae17426e4891bebf689997dbdca3bi0',
//                                       animations = {
//                                           idle: "/content/a11189dd226838ec2b7689e27355e37c3d2c841645d341f9ac22ac6cac0ab645i0",
//                                           walk: '/content/9c99296596aebca23b81d17c864ba6a35bd48fa8a006d1e81419a81948652326i4',
//                                           run: "/content/a2a286e5fcde5450311dc657ee37b67dfd4b471e325e4c08909f0b7e4b250496i0",
//                                           jump: "/content/abab52ddfe550d18c87d8102082f03dbbd7430e3c30e0c3bf7a4dea7b786bb47i0",
//                                           sit: "/content/9c99296596aebca23b81d17c864ba6a35bd48fa8a006d1e81419a81948652326i0",
//                                           attack: '/content/9c99296596aebca23b81d17c864ba6a35bd48fa8a006d1e81419a81948652326i3',
//                                       },
//                                       shadows = true
//                                   }, ref) => {
//     const [finalVrm, setFinalVrm] = useState(null)
//     const mixerRef = useRef(null)
//     const actionsRef = useRef({})
//     const activeActionRef = useRef(null)
//     const previousActionRef = useRef(null)
//     const helperRoot = useRef(new THREE.Group())
// 
//     const setAnimation = (animationName, fade1 = 0.2, fade2 = 0.3, speed = 1) => {
//         if (activeActionRef.current?._clip.name === animationName) {
//             return
//         }
// 
//         const action = actionsRef.current[animationName]
//         if (!action) {
//             console.warn(`animation not loaded: ${animationName}`)
//             return
//         }
// 
//         if (activeActionRef.current && activeActionRef.current !== action) {
//             action.reset()
//             action.enabled = true
//             action.setEffectiveTimeScale(speed)
//             action.setEffectiveWeight(1)
//             activeActionRef.current.crossFadeTo(action, fade1, false)
//             action.play()
//         } else {
//             action.reset()
//             action.enabled = true
//             action.setEffectiveTimeScale(speed)
//             action.setEffectiveWeight(1)
//             action.fadeIn(fade2).play()
//         }
// 
//         activeActionRef.current = action
//         previousActionRef.current = action
//     }
// 
// 
//     useImperativeHandle(ref, () => ({
//         vrm: finalVrm,
//         mixerRef: mixerRef,
//         setAnimation,
//         playAnimationOnce: (animationName, fade1 = 0.2, fade2 = 0.3, speed = 1) => {
//             const action = actionsRef.current[animationName]
//             if (!action) {
//                 console.warn(`animation not loaded: ${animationName}`)
//                 return
//             }
// 
//             const loopingAction = activeActionRef.current
// 
// 
//             if (activeActionRef.current?._clip.name === animationName) {
//                 return
//             }
// 
//             action.reset()
//             action.enabled = true
//             action.setEffectiveTimeScale(speed)
//             action.setEffectiveWeight(1)
//             action.loop = THREE.LoopOnce
//             action.clampWhenFinished = true
// 
//             if (loopingAction && loopingAction !== action) {
//                 loopingAction.crossFadeTo(action, fade1, false)
//             } else {
//                 action.fadeIn(fade2)
//             }
//             action.play()
//             activeActionRef.current = action
// 
//             const handleFinished = () => {
//                 if (loopingAction && loopingAction !== action) {
//                     loopingAction.reset();
//                     loopingAction.enabled = true;
//                     loopingAction.setEffectiveTimeScale(speed);
//                     loopingAction.setEffectiveWeight(1);
//                     action.crossFadeTo(loopingAction, fade2, false);
//                     loopingAction.play();
//                     activeActionRef.current = loopingAction;
//                 }
//                 isAnimationPlaying = false;
//             };
// 
//             const debounce = (func, delay) => {
//                 return (...args) => {
//                     clearTimeout(debounceTimeout);
//                     debounceTimeout = setTimeout(() => func(...args), delay);
//                 };
//             };
// 
//             const setupAndPlayAnimation = debounce((mixer, actionToPlay) => {
//                 if (isAnimationPlaying) {
//                     return;
//                 }
// 
//                 if (currentFinishedListener) {
//                     mixer.removeEventListener('finished', currentFinishedListener);
//                 }
// 
//                 mixer.addEventListener('finished', handleFinished);
//                 currentFinishedListener = handleFinished;
// 
//                 actionToPlay.reset();
//                 actionToPlay.enabled = true;
//                 actionToPlay.setEffectiveTimeScale(speed);
//                 actionToPlay.setEffectiveWeight(1);
//                 actionToPlay.play();
//                 isAnimationPlaying = true;
//             }, 100);
// 
//             const mixer = action.getMixer();
//             setupAndPlayAnimation(mixer, action);
//         },
//         stopAllAnimations: () => {
//             mixerRef.current?.stopAllAction()
//             activeActionRef.current = null
//             previousActionRef.current = null
//         },
//         getAvailableAnimations: () => Object.keys(actionsRef.current)
//     }))
// 
// 
//     useEffect(() => {
//         const start = async () => {
//             const loader = new GLTFLoader()
//             const dracoLoader = new DRACOLoader()
//             loader.setDRACOLoader(dracoLoader)
//             loader.crossOrigin = 'anonymous'
// 
//             loader.register((parser) => new VRMLoaderPlugin(parser, {
//                 helperRoot: helperRoot.current,
//                 autoUpdateHumanBones: true,
//             }))
//             loader.register((parser) => new VRMAnimationLoaderPlugin(parser))
// 
//             const gltfVrm = await loader.loadAsync(src)
//             const vrm = gltfVrm.userData.vrm
// 
//             VRMUtils.removeUnnecessaryVertices(gltfVrm.scene)
//             VRMUtils.combineSkeletons(gltfVrm.scene)
//             VRMUtils.combineMorphs(vrm)
//             VRMUtils.rotateVRM0(vrm)
//             VRMUtils.removeUnnecessaryJoints(gltfVrm.scene)
// 
//             const lookAtQuatProxy = new VRMLookAtQuaternionProxy(vrm.lookAt)
//             lookAtQuatProxy.name = 'lookAtQuaternionProxy'
//             vrm.scene.add(lookAtQuatProxy)
// 
//             vrm.scene.children[0].frustumCulled = false
//             vrm.scene.children[1].frustumCulled = false
// 
//             if (shadows) {
//                 try {
//                     vrm.scene.children[0].castShadow = true
//                     // vrm.scene.children[0].receiveShadow = true
//                 } catch (e) {
//                 }
//                 try {
//                     vrm.scene.children[1].castShadow = true
//                     // vrm.scene.children[1].receiveShadow = true
//                 } catch (e) {
//                 }
//                 try {
//                     vrm.scene.children[2].castShadow = true
//                     // vrm.scene.children[2].receiveShadow = true
//                 } catch (e) {
//                 }
//                 try {
//                     vrm.scene.children[3].castShadow = true
//                     // vrm.scene.children[2].receiveShadow = true
//                 } catch (e) {
//                 }
//                 try {
//                     vrm.scene.children[4].castShadow = true
//                     // vrm.scene.children[2].receiveShadow = true
//                 } catch (e) {
//                 }
//                 try {
//                     vrm.scene.children[5].castShadow = true
//                     // vrm.scene.children[2].receiveShadow = true
//                 } catch (e) {
//                 }
//                 try {
//                     vrm.scene.children[6].castShadow = true
//                     // vrm.scene.children[2].receiveShadow = true
//                 } catch (e) {
//                 }
//                 try {
//                     vrm.scene.children[7].castShadow = true
//                     // vrm.scene.children[2].receiveShadow = true
//                 } catch (e) {
//                 }
//                 try {
//                     vrm.scene.children[8].castShadow = true
//                     // vrm.scene.children[2].receiveShadow = true
//                 } catch (e) {
//                 }
//                 try {
//                     vrm.scene.children[9].castShadow = true
//                     // vrm.scene.children[2].receiveShadow = true
//                 } catch (e) {
//                 }
//             }
// 
// 
//             setFinalVrm(vrm)
// 
//             mixerRef.current = new THREE.AnimationMixer(vrm.scene)
// 
//             // console.log(animations)
//             for (const [name, animUrl] of Object.entries(animations)) {
//                 try {
//                     let clip
//                     // console.log(animUrl)
//                     if (animUrl.src && animUrl.type === 'fbx') {
//                         // console.log('yep fbx data')
//                         clip = await loadMixamoAnimation(animUrl.src, vrm)
// 
//                     } else if (animUrl.src && animUrl.type === 'vrma') {
// 
//                         const gltfVrma = await loader.loadAsync(animUrl.src)
//                         const vrmAnimation = gltfVrma.userData.vrmAnimations[0]
//                         clip = createVRMAnimationClip(vrmAnimation, vrm)
// 
//                     } else {
// 
//                         // const modifiedUrl = await fetchAndModifyVrma(animUrl, {});
//                         const gltfVrma = await loader.loadAsync(animUrl)
//                         const vrmAnimation = gltfVrma.userData.vrmAnimations[0]
//                         clip = createVRMAnimationClip(vrmAnimation, vrm)
//                     }
// 
//                     clip.name = name
//                     const action = mixerRef.current.clipAction(clip)
//                     actionsRef.current[name] = action
// 
//                     setAnimation('idle')
// 
//                         let cover = document.getElementById('loadCover')
// 
//                             if (cover) {
//                                 cover.style.transition = '1s'
//                                 cover.style.opacity = '0'
// 
//                                 setTimeout(() => {
//                                     cover.remove()
//                                 }, 1000)
//                             }
// 
// 
// 
//                 } catch (err) {
//                     console.error(`failed to load animation: ${animUrl}`, err)
//                 }
//             }
//             // playerStatusStore.set({mainHandName: 'IronSledgehammer'})
//             // ECS.world.removeComponent(player, 'mainHand')
//             // ECS.world.addComponent(player, 'mainHand', {
//             //     component: IronSledgehammer,
//             //     name: 'IronSledgehammer',
//             // })
//             // window.setNudge(Math.random())
// 
//             const loadCover = document.getElementById('loadd')
//             if (loadCover) {
//                 loadCover.remove()
//             }
// 
//         }
// 
//         start()
// 
//         return () => {
//             if (finalVrm) VRMUtils.deepDispose(finalVrm.scene)
//             if (mixerRef.current) mixerRef.current.stopAllAction()
//             const dracoLoader = new DRACOLoader()
//             dracoLoader.dispose()
//         }
//     }, [src])
// 
//     useFrame((_, delta) => {
//         if (_.clock.running) {
//             mixerRef.current?.update(delta)
//             finalVrm?.update(delta)
//         }
//     })
// 
//     return (
//         <Suspense fallback={<mesh>
//             <boxGeometry/>
//             <meshNormalMaterial/>
//         </mesh>}>
//             {
//                 finalVrm ? (
//                     <primitive object={finalVrm.scene}/>
//                 ) : null
//             }
//         </Suspense>
//     )
// })
// 

let currentFinishedListener = null;
let isAnimationPlaying = false;
let debounceTimeout = null;
export const VRM = /*#__PURE__*/forwardRef(({
  src = '/content/609b4b19a41e89ee3274c4455036ff19ff0ae17426e4891bebf689997dbdca3bi0',
  animations = {
    idle: "/content/a11189dd226838ec2b7689e27355e37c3d2c841645d341f9ac22ac6cac0ab645i0",
    walk: '/content/9c99296596aebca23b81d17c864ba6a35bd48fa8a006d1e81419a81948652326i4',
    run: "/content/a2a286e5fcde5450311dc657ee37b67dfd4b471e325e4c08909f0b7e4b250496i0",
    jump: "/content/abab52ddfe550d18c87d8102082f03dbbd7430e3c30e0c3bf7a4dea7b786bb47i0",
    sit: "/content/9c99296596aebca23b81d17c864ba6a35bd48fa8a006d1e81419a81948652326i0",
    attack: '/content/9c99296596aebca23b81d17c864ba6a35bd48fa8a006d1e81419a81948652326i3'
  },
  shadows = true
}, ref) => {
  const [finalVrm, setFinalVrm] = useState(null);
  const mixerRef = useRef(null);
  const actionsRef = useRef({});
  const activeActionRef = useRef(null);
  const previousActionRef = useRef(null);
  const helperRoot = useRef(new THREE.Group());
  const setAnimation = (animationName, fade1 = 0.2, fade2 = 0.3, speed = 1) => {
    if (activeActionRef.current?._clip.name === animationName) {
      return;
    }
    const action = actionsRef.current[animationName];
    if (!action) {
      console.warn(`animation not loaded: ${animationName}`);
      return;
    }
    if (activeActionRef.current && activeActionRef.current !== action) {
      action.reset();
      action.enabled = true;
      action.setEffectiveTimeScale(speed);
      action.setEffectiveWeight(1);
      activeActionRef.current.crossFadeTo(action, fade1, false);
      action.play();
    } else {
      action.reset();
      action.enabled = true;
      action.setEffectiveTimeScale(speed);
      action.setEffectiveWeight(1);
      action.fadeIn(fade2).play();
    }
    activeActionRef.current = action;
    previousActionRef.current = action;
  };
  useImperativeHandle(ref, () => ({
    vrm: finalVrm,
    mixerRef: mixerRef,
    setAnimation,
    playAnimationOnce: (animationName, fade1 = 0.2, fade2 = 0.3, speed = 1) => {
      const action = actionsRef.current[animationName];
      if (!action) {
        console.warn(`animation not loaded: ${animationName}`);
        return;
      }
      const loopingAction = activeActionRef.current;
      if (activeActionRef.current?._clip.name === animationName) {
        return;
      }
      action.reset();
      action.enabled = true;
      action.setEffectiveTimeScale(speed);
      action.setEffectiveWeight(1);
      action.loop = THREE.LoopOnce;
      action.clampWhenFinished = true;
      if (loopingAction && loopingAction !== action) {
        loopingAction.crossFadeTo(action, fade1, false);
      } else {
        action.fadeIn(fade2);
      }
      action.play();
      activeActionRef.current = action;
      const handleFinished = () => {
        if (loopingAction && loopingAction !== action) {
          loopingAction.reset();
          loopingAction.enabled = true;
          loopingAction.setEffectiveTimeScale(speed);
          loopingAction.setEffectiveWeight(1);
          action.crossFadeTo(loopingAction, fade2, false);
          loopingAction.play();
          activeActionRef.current = loopingAction;
        }
        isAnimationPlaying = false;
      };
      const debounce = (func, delay) => {
        return (...args) => {
          clearTimeout(debounceTimeout);
          debounceTimeout = setTimeout(() => func(...args), delay);
        };
      };
      const setupAndPlayAnimation = debounce((mixer, actionToPlay) => {
        if (isAnimationPlaying) {
          return;
        }
        if (currentFinishedListener) {
          mixer.removeEventListener('finished', currentFinishedListener);
        }
        mixer.addEventListener('finished', handleFinished);
        currentFinishedListener = handleFinished;
        actionToPlay.reset();
        actionToPlay.enabled = true;
        actionToPlay.setEffectiveTimeScale(speed);
        actionToPlay.setEffectiveWeight(1);
        actionToPlay.play();
        isAnimationPlaying = true;
      }, 100);
      const mixer = action.getMixer();
      setupAndPlayAnimation(mixer, action);
    },
    stopAllAnimations: () => {
      mixerRef.current?.stopAllAction();
      activeActionRef.current = null;
      previousActionRef.current = null;
    },
    getAvailableAnimations: () => Object.keys(actionsRef.current)
  }));
  useEffect(() => {
    const start = async () => {
      const loader = new GLTFLoader();
      const dracoLoader = new DRACOLoader();
      loader.setDRACOLoader(dracoLoader);
      loader.crossOrigin = 'anonymous';
      loader.register(parser => new VRMLoaderPlugin(parser, {
        helperRoot: helperRoot.current,
        autoUpdateHumanBones: true
      }));
      loader.register(parser => new VRMAnimationLoaderPlugin(parser));
      const gltfVrm = await loader.loadAsync(src);
      const vrm = gltfVrm.userData.vrm;
      VRMUtils.removeUnnecessaryVertices(gltfVrm.scene);
      VRMUtils.combineSkeletons(gltfVrm.scene);
      VRMUtils.combineMorphs(vrm);
      VRMUtils.rotateVRM0(vrm);
      VRMUtils.removeUnnecessaryJoints(gltfVrm.scene);
      const lookAtQuatProxy = new VRMLookAtQuaternionProxy(vrm.lookAt);
      lookAtQuatProxy.name = 'lookAtQuaternionProxy';
      vrm.scene.add(lookAtQuatProxy);
      vrm.scene.children[0].frustumCulled = false;
      vrm.scene.children[1].frustumCulled = false;
      if (shadows) {
        try {
          vrm.scene.children[0].castShadow = true;
          // vrm.scene.children[0].receiveShadow = true
        } catch (e) {}
        try {
          vrm.scene.children[1].castShadow = true;
          // vrm.scene.children[1].receiveShadow = true
        } catch (e) {}
        try {
          vrm.scene.children[2].castShadow = true;
          // vrm.scene.children[2].receiveShadow = true
        } catch (e) {}
        try {
          vrm.scene.children[3].castShadow = true;
          // vrm.scene.children[2].receiveShadow = true
        } catch (e) {}
        try {
          vrm.scene.children[4].castShadow = true;
          // vrm.scene.children[2].receiveShadow = true
        } catch (e) {}
        try {
          vrm.scene.children[5].castShadow = true;
          // vrm.scene.children[2].receiveShadow = true
        } catch (e) {}
        try {
          vrm.scene.children[6].castShadow = true;
          // vrm.scene.children[2].receiveShadow = true
        } catch (e) {}
        try {
          vrm.scene.children[7].castShadow = true;
          // vrm.scene.children[2].receiveShadow = true
        } catch (e) {}
        try {
          vrm.scene.children[8].castShadow = true;
          // vrm.scene.children[2].receiveShadow = true
        } catch (e) {}
        try {
          vrm.scene.children[9].castShadow = true;
          // vrm.scene.children[2].receiveShadow = true
        } catch (e) {}
      }
      setFinalVrm(vrm);
      mixerRef.current = new THREE.AnimationMixer(vrm.scene);

      // console.log(animations)
      for (const [name, animUrl] of Object.entries(animations)) {
        try {
          let clip;
          // console.log(animUrl)
          if (animUrl.src && animUrl.type === 'fbx') {
            // console.log('yep fbx data')
            clip = await loadMixamoAnimation(animUrl.src, vrm);
          } else if (animUrl.src && animUrl.type === 'vrma') {
            const gltfVrma = await loader.loadAsync(animUrl.src);
            const vrmAnimation = gltfVrma.userData.vrmAnimations[0];
            clip = createVRMAnimationClip(vrmAnimation, vrm);
          } else {
            // const modifiedUrl = await fetchAndModifyVrma(animUrl, {});
            const gltfVrma = await loader.loadAsync(animUrl);
            const vrmAnimation = gltfVrma.userData.vrmAnimations[0];
            clip = createVRMAnimationClip(vrmAnimation, vrm);
          }
          clip.name = name;
          const action = mixerRef.current.clipAction(clip);
          actionsRef.current[name] = action;
          setAnimation('idle');
          let cover = document.getElementById('loadCover');
          if (cover) {
            cover.style.transition = '1s';
            cover.style.opacity = '0';
            setTimeout(() => {
              cover.remove();
            }, 1000);
          }
        } catch (err) {
          console.error(`failed to load animation: ${animUrl}`, err);
        }
      }
      // playerStatusStore.set({mainHandName: 'IronSledgehammer'})
      // ECS.world.removeComponent(player, 'mainHand')
      // ECS.world.addComponent(player, 'mainHand', {
      //     component: IronSledgehammer,
      //     name: 'IronSledgehammer',
      // })
      // window.setNudge(Math.random())

      const loadCover = document.getElementById('loadd');
      if (loadCover) {
        loadCover.remove();
      }
    };
    start();
    return () => {
      if (finalVrm) VRMUtils.deepDispose(finalVrm.scene);
      if (mixerRef.current) mixerRef.current.stopAllAction();
      const dracoLoader = new DRACOLoader();
      dracoLoader.dispose();
    };
  }, [src]);
  useFrame((_, delta) => {
    if (_.clock.running) {
      mixerRef.current?.update(delta);
      finalVrm?.update(delta);
    }
  });
  return /*#__PURE__*/_jsx(Suspense, {
    fallback: /*#__PURE__*/_jsxs("mesh", {
      children: [/*#__PURE__*/_jsx("boxGeometry", {}), /*#__PURE__*/_jsx("meshNormalMaterial", {})]
    }),
    children: finalVrm ? /*#__PURE__*/_jsx("primitive", {
      object: finalVrm.scene
    }) : null
  });
});






///// component: systems/player/PlayerSystem.jsx 
///// JSX source:
///
// import {VRM} from "../../components/VRM.jsx";
// import React, {forwardRef, memo, useImperativeHandle, useRef, useEffect} from "react";
// import {RotationSpring} from "../../modules/springs.mjs";
// import {ECS, useGUI} from 'ecs'
// import {DefaultPlayerController} from "./DefaultPlayerController.jsx";
// import {QUATERNIUS_ANIMATIONS_1, QUATERNIUS_ANIMATIONS_2} from "world-tools-1";
// import {useKeyboard} from "../InputSystem.jsx";
// let playerEntityInstance = null;
// 
// 
// const getOrCreatePlayer = () => {
//     if (!playerEntityInstance) {
//         playerEntityInstance = ECS.world.add({
//             isPlayer: true,
//             position: {x: 0.0, y: 8, z: 0},
//             rotation: {x: 0, y: 0, z: 0},
//             scale: {x: 1, y: 1, z: 1},
//             velocity: {x: 0, y: 0, z: 0},
//             speed: 9,
//             acceleration: 10,
//             deceleration: 50,
//             state: {
//                 walking: false,
//                 running: false,
//                 jumping: false,
//                 swimming: false,
//                 flying: false,
//                 mounted: false,
//             }
//         });
//     }
//     return playerEntityInstance;
// };
// 
// 
// const PlayerModel = memo(forwardRef((props, ref) => {
//     const group = useRef();
//     const model = useRef();
//     const entity = ECS.useCurrentEntity();
// 
//     useEffect(() => {
//         if (!entity.render) {
//             entity.render = {};
//         }
//         entity.render.model = model;
//         entity.render.group = group;
// 
//         window.player = entity;
// 
// 
// 
//     }, [entity]);
// 
// 
//     useImperativeHandle(ref, () => ({
//         group,
//         model,
//     }), []);
// 
//     return (
//         <group ref={group}>
//             <VRM
//                 ref={model}
//                 src={'/content/609b1640c55ec583cd110cfa2dbe38759b5dd8ce0f0009ce8b8cd9af3b73ce27i0'}
//                 shadows
//                 animations={{
//                     ...QUATERNIUS_ANIMATIONS_1,
//                     ...QUATERNIUS_ANIMATIONS_2,
//                 }}
//             />
//         </group>
//     );
// }), () => true);
// 
// const PlayerEntity = memo(() => {
//     const player = getOrCreatePlayer();
// 
// 
// 
//     return (
//         <ECS.Entity entity={player}>
//             <ECS.Component name="render">
//                 <PlayerModel />
//             </ECS.Component>
// 
//             <ECS.Component name="playerController">
//                 <DefaultPlayerController />
//             </ECS.Component>
// 
//             <ECS.Component name="rotationSpring">
//                 <RotationSpring />
//             </ECS.Component>
// 
//         </ECS.Entity>
//     );
// });
// 
// 
// 
// export const PlayerSystem = memo(() => {
// 
//     useGUI(
//         <div className={'pix absolute bottom-20 right-2 flex flex-col gap-2'}>
// 
//             <button onClick={() => {
//                 window.player.render.model.current.playAnimationOnce('attack', 0.3, 0.4, 1.2);
//             }} className={'p-1 px-4 text-red-300 bg-neutral-800/25'}>
//                 attack
//             </button>
//             <button onClick={() => {
//                 window.player.render.model.current.playAnimationOnce('sit', 0.3, 0.4, 1.2);
//             }} className={'p-1 px-4 text-lime-300 bg-neutral-800/25'}>
//                 sit
//             </button>
//         </div>
//     )
// 
//     useKeyboard({
//         onKeyDown: {
// 
//             " ": () => {
//                 const player = window.player;
//                 if (player.state.jumping) return;
// 
//                 window.sounds?.jump1?.triggerAttackRelease(["F1"], 0.4);
//                 player.state.jumping = true;
//                 player.velocity.y += 7;
//                 player.speed += 2;
// 
//                 // setTimeout(() => player.speed += 2, 60);
//                 // setTimeout(() => {
//                 //     player.speed += 2;
//                 //     player.velocity.y += 1.2;
//                 // }, 120);
// 
//                 const modelRef = player.state.mounted ? player.render.mount.current : player.render.model.current;
//                 modelRef?.playAnimationOnce('jumpRoll', 0.3, 0.4, 1.2);
// 
//                 setTimeout(() => {
//                     modelRef?.setAnimation(player.state.running ? 'run' : 'idle', 0.4, 0.3, 1.2);
//                     player.speed -= 2;
//                     // player.velocity.y -= 1.2;
//                     // setTimeout(() => player.speed -= 2, 90);
//                     // setTimeout(() => player.speed -= 2, 160);
//                     if (!window.keyDown?.space) player.state.jumping = false;
//                 }, 600);
//             },
//         }
//     });
// 
// 
//     return (
//         <group>
//             <PlayerEntity />
//         </group>
//     );
// });
// 

let playerEntityInstance = null;
const getOrCreatePlayer = () => {
  if (!playerEntityInstance) {
    playerEntityInstance = ECS.world.add({
      isPlayer: true,
      position: {
        x: 0.0,
        y: 8,
        z: 0
      },
      rotation: {
        x: 0,
        y: 0,
        z: 0
      },
      scale: {
        x: 1,
        y: 1,
        z: 1
      },
      velocity: {
        x: 0,
        y: 0,
        z: 0
      },
      speed: 9,
      acceleration: 10,
      deceleration: 50,
      state: {
        walking: false,
        running: false,
        jumping: false,
        swimming: false,
        flying: false,
        mounted: false
      }
    });
  }
  return playerEntityInstance;
};
const PlayerModel = /*#__PURE__*/memo(/*#__PURE__*/forwardRef((props, ref) => {
  const group = useRef();
  const model = useRef();
  const entity = ECS.useCurrentEntity();
  useEffect(() => {
    if (!entity.render) {
      entity.render = {};
    }
    entity.render.model = model;
    entity.render.group = group;
    window.player = entity;
  }, [entity]);
  useImperativeHandle(ref, () => ({
    group,
    model
  }), []);
  return /*#__PURE__*/_jsx("group", {
    ref: group,
    children: /*#__PURE__*/_jsx(VRM, {
      ref: model,
      src: '/content/609b1640c55ec583cd110cfa2dbe38759b5dd8ce0f0009ce8b8cd9af3b73ce27i0',
      shadows: true,
      animations: {
        ...QUATERNIUS_ANIMATIONS_1,
        ...QUATERNIUS_ANIMATIONS_2
      }
    })
  });
}), () => true);
const PlayerEntity = /*#__PURE__*/memo(() => {
  const player = getOrCreatePlayer();
  return /*#__PURE__*/_jsxs(ECS.Entity, {
    entity: player,
    children: [/*#__PURE__*/_jsx(ECS.Component, {
      name: "render",
      children: /*#__PURE__*/_jsx(PlayerModel, {})
    }), /*#__PURE__*/_jsx(ECS.Component, {
      name: "playerController",
      children: /*#__PURE__*/_jsx(DefaultPlayerController, {})
    }), /*#__PURE__*/_jsx(ECS.Component, {
      name: "rotationSpring",
      children: /*#__PURE__*/_jsx(RotationSpring, {})
    })]
  });
});
export const PlayerSystem = /*#__PURE__*/memo(() => {
  useGUI(/*#__PURE__*/_jsxs("div", {
    className: 'pix absolute bottom-20 right-2 flex flex-col gap-2',
    children: [/*#__PURE__*/_jsx("button", {
      onClick: () => {
        window.player.render.model.current.playAnimationOnce('attack', 0.3, 0.4, 1.2);
      },
      className: 'p-1 px-4 text-red-300 bg-neutral-800/25',
      children: "attack"
    }), /*#__PURE__*/_jsx("button", {
      onClick: () => {
        window.player.render.model.current.playAnimationOnce('sit', 0.3, 0.4, 1.2);
      },
      className: 'p-1 px-4 text-lime-300 bg-neutral-800/25',
      children: "sit"
    })]
  }));
  useKeyboard({
    onKeyDown: {
      " ": () => {
        const player = window.player;
        if (player.state.jumping) return;
        window.sounds?.jump1?.triggerAttackRelease(["F1"], 0.4);
        player.state.jumping = true;
        player.velocity.y += 7;
        player.speed += 2;

        // setTimeout(() => player.speed += 2, 60);
        // setTimeout(() => {
        //     player.speed += 2;
        //     player.velocity.y += 1.2;
        // }, 120);

        const modelRef = player.state.mounted ? player.render.mount.current : player.render.model.current;
        modelRef?.playAnimationOnce('jumpRoll', 0.3, 0.4, 1.2);
        setTimeout(() => {
          modelRef?.setAnimation(player.state.running ? 'run' : 'idle', 0.4, 0.3, 1.2);
          player.speed -= 2;
          // player.velocity.y -= 1.2;
          // setTimeout(() => player.speed -= 2, 90);
          // setTimeout(() => player.speed -= 2, 160);
          if (!window.keyDown?.space) player.state.jumping = false;
        }, 600);
      }
    }
  });
  return /*#__PURE__*/_jsx("group", {
    children: /*#__PURE__*/_jsx(PlayerEntity, {})
  });
});






///// component: components/MemoryPerformanceMonitor.jsx 
///// JSX source:
///
// import {useThree} from "@react-three/fiber";
// import {useEffect, useRef} from "react";
// 
// import 'webgl-memory'
// import {getPerf} from 'r3f-perf'
// 
// import {useGUI} from 'ecs'
// import {TorusKnot} from "@react-three/drei";
// 
// function formatMemory(bytes) {
// 
//     const kb = (bytes / 1024).toFixed(2);
//     const mb = (bytes / (1024 * 1024)).toFixed(2);
// 
//     // return '' + numberWithCommas + ' - ' + `${kb} KB, ${mb} MB`
//     return `${mb} MB`
// }
// 
// 
// const getFps = () => new Promise(resolve => {
//     let repaint = 0;
//     const start = performance.now();
//     const withRepaint = () => {
//         requestAnimationFrame(() => {
//             if ((performance.now() - start) < 1000) {
//                 repaint += 1;
//                 withRepaint();
//             } else {
//                 resolve(repaint);
//             }
//         });
//     };
//     withRepaint();
// });
// 
// 
// export const MemoryPerformanceMonitor = () => {
// 
// 
//     const {gl, scene} = useThree()
// 
//     const report = useRef()
// 
// 
//     useGUI(
//         <div className={' text-[18px] bg-neutral-800/90 opacity-90 hover:opacity-90 ring-2 p-2 absolute bottom-32 left-[500px] text-orange-300 flex flex-col'}>
// 
//             <div id={'cpu1'}>
//                 00
//             </div>
//             <div id={'gpu1'}>
//                 00
//             </div>
//             <div id={'mem1'}>
//                 00
//             </div>
//             <div id={'draws1'}>
//                 00
//             </div>
//         </div>
//     )
// 
//     useEffect(() => {
// 
//         const intt = setInterval(() => {
//             report.current = getPerf()
//             // console.log(report.current)
// 
//             const rep = report.current.getReport()
//             // console.log(rep)
//             try {
// 
//                 if (report.current?.log?.cpu) {
//                     document.getElementById('cpu1').innerText = 'cpu: ' + report.current?.log?.cpu.toFixed(3) + ' (avg: ' + rep.log.cpu.toFixed(3) + ')'
//                 }
//                 if (report.current?.log?.gpu) {
//                     document.getElementById('gpu1').innerText = 'gpu: ' + report.current?.log?.gpu.toFixed(3) + ' (avg: ' + rep.log.gpu.toFixed(3) + ')'
//                 }
//                 if (report.current?.log?.mem) {
//                     document.getElementById('mem1').innerText = 'mem: ' + report.current?.log?.mem.toFixed(3) + ' (avg: ' + rep.log.gpu.toFixed(3) + ')'
//                 }
//                 if (report.current?.gl) {
//                     document.getElementById('draws1').innerText = 'draw calls: ' + report.current?.gl.info.render.calls.toLocaleString()
//                 }
//             } catch (e) {
//             }
//         }, 1000)
// 
//         const onDown = async (e) => {
//             // console.log(e.key)
//             if (e.key === 'o') {
//                 // gl.forceContextLoss();
//                 // gl.context = null;
//                 // gl.domElement = null;
//                 // gl.dispose();
//                 // gl = null;
//             }
//             if (e.key === 'p') {
// 
// 
//                 report.current = getPerf()
//                 console.log('cpu:' + report.current.log.cpu.toFixed(3))
//                 console.log('gpu:' + report.current.log.gpu.toFixed(3))
//                 console.log('fps:' + report.current.log.fps.toFixed(3))
//                 console.log('mem:' + report.current.log.mem.toFixed(3))
// 
// 
//                 if (performance.memory) {
//                     console.log('totalJSHeapSize: ' + formatMemory(performance.memory.totalJSHeapSize) + ' / ' + formatMemory(performance.memory.jsHeapSizeLimit))
//                     console.log('usedJSHeapSize: ' + formatMemory(performance.memory.usedJSHeapSize))
//                 }
// 
//                 // console.log(gl.info)
//                 const ext = gl.extensions.get('GMAN_webgl_memory');
//                 if (ext) {
//                     // memory info
//                     const info = ext.getMemoryInfo();
//                     const textures = ext.getResourcesInfo(WebGLTexture);
//                     const buffers = ext.getResourcesInfo(WebGLBuffer);
// 
//                     console.log(info)
//                     console.log(textures)
//                     console.log(buffers)
// 
//                     console.log('webgl memory: ' + formatMemory(info.memory.total))
//                     console.log('calls: ' + gl.info.render.calls.toLocaleString())
//                     console.log('triangles: ' + gl.info.render.triangles.toLocaleString())
//                     console.log('textures: ' + gl.info.memory.textures + ' / ' + info.resources.texture)
//                     console.log('tex memory: ' + formatMemory(info.memory.texture))
//                     console.log('geometries: ' + gl.info.memory.geometries.toLocaleString())
// 
//                     // console.log({
//                     //     glinfo: gl.info,
//                     //     memory: {
//                     //         info: info,
//                     //         textures: textures,
//                     //         buffers: buffers,
//                     //     }
//                     // })
// 
//                     // console.log('\n without post/shadows/env:')
//                     // console.log('calls: ' + (gl.info.render.calls - 2))
//                     // console.log('tris: ' + (gl.info.render.triangles - 113))
//                     // console.log('tex mem: ' + formatMemory(info.memory.texture - 32000000))
//                 }
//             }
//         }
// 
// 
//         window.document.addEventListener('keydown', onDown)
// 
//         return () => {
//             clearInterval(intt)
//             window.document.removeEventListener('keydown', onDown)
//         }
//     }, [gl])
// 
// 
// 
// }
// 

import 'webgl-memory';
function formatMemory(bytes) {
  const kb = (bytes / 1024).toFixed(2);
  const mb = (bytes / (1024 * 1024)).toFixed(2);

  // return '' + numberWithCommas + ' - ' + `${kb} KB, ${mb} MB`
  return `${mb} MB`;
}
const getFps = () => new Promise(resolve => {
  let repaint = 0;
  const start = performance.now();
  const withRepaint = () => {
    requestAnimationFrame(() => {
      if (performance.now() - start < 1000) {
        repaint += 1;
        withRepaint();
      } else {
        resolve(repaint);
      }
    });
  };
  withRepaint();
});
export const MemoryPerformanceMonitor = () => {
  const {
    gl,
    scene
  } = useThree();
  const report = useRef();
  useGUI(/*#__PURE__*/_jsxs("div", {
    className: ' text-[18px] bg-neutral-800/90 opacity-90 hover:opacity-90 ring-2 p-2 absolute bottom-32 left-[500px] text-orange-300 flex flex-col',
    children: [/*#__PURE__*/_jsx("div", {
      id: 'cpu1',
      children: "00"
    }), /*#__PURE__*/_jsx("div", {
      id: 'gpu1',
      children: "00"
    }), /*#__PURE__*/_jsx("div", {
      id: 'mem1',
      children: "00"
    }), /*#__PURE__*/_jsx("div", {
      id: 'draws1',
      children: "00"
    })]
  }));
  useEffect(() => {
    const intt = setInterval(() => {
      report.current = getPerf();
      // console.log(report.current)

      const rep = report.current.getReport();
      // console.log(rep)
      try {
        if (report.current?.log?.cpu) {
          document.getElementById('cpu1').innerText = 'cpu: ' + report.current?.log?.cpu.toFixed(3) + ' (avg: ' + rep.log.cpu.toFixed(3) + ')';
        }
        if (report.current?.log?.gpu) {
          document.getElementById('gpu1').innerText = 'gpu: ' + report.current?.log?.gpu.toFixed(3) + ' (avg: ' + rep.log.gpu.toFixed(3) + ')';
        }
        if (report.current?.log?.mem) {
          document.getElementById('mem1').innerText = 'mem: ' + report.current?.log?.mem.toFixed(3) + ' (avg: ' + rep.log.gpu.toFixed(3) + ')';
        }
        if (report.current?.gl) {
          document.getElementById('draws1').innerText = 'draw calls: ' + report.current?.gl.info.render.calls.toLocaleString();
        }
      } catch (e) {}
    }, 1000);
    const onDown = async e => {
      // console.log(e.key)
      if (e.key === 'o') {
        // gl.forceContextLoss();
        // gl.context = null;
        // gl.domElement = null;
        // gl.dispose();
        // gl = null;
      }
      if (e.key === 'p') {
        report.current = getPerf();
        console.log('cpu:' + report.current.log.cpu.toFixed(3));
        console.log('gpu:' + report.current.log.gpu.toFixed(3));
        console.log('fps:' + report.current.log.fps.toFixed(3));
        console.log('mem:' + report.current.log.mem.toFixed(3));
        if (performance.memory) {
          console.log('totalJSHeapSize: ' + formatMemory(performance.memory.totalJSHeapSize) + ' / ' + formatMemory(performance.memory.jsHeapSizeLimit));
          console.log('usedJSHeapSize: ' + formatMemory(performance.memory.usedJSHeapSize));
        }

        // console.log(gl.info)
        const ext = gl.extensions.get('GMAN_webgl_memory');
        if (ext) {
          // memory info
          const info = ext.getMemoryInfo();
          const textures = ext.getResourcesInfo(WebGLTexture);
          const buffers = ext.getResourcesInfo(WebGLBuffer);
          console.log(info);
          console.log(textures);
          console.log(buffers);
          console.log('webgl memory: ' + formatMemory(info.memory.total));
          console.log('calls: ' + gl.info.render.calls.toLocaleString());
          console.log('triangles: ' + gl.info.render.triangles.toLocaleString());
          console.log('textures: ' + gl.info.memory.textures + ' / ' + info.resources.texture);
          console.log('tex memory: ' + formatMemory(info.memory.texture));
          console.log('geometries: ' + gl.info.memory.geometries.toLocaleString());

          // console.log({
          //     glinfo: gl.info,
          //     memory: {
          //         info: info,
          //         textures: textures,
          //         buffers: buffers,
          //     }
          // })

          // console.log('\n without post/shadows/env:')
          // console.log('calls: ' + (gl.info.render.calls - 2))
          // console.log('tris: ' + (gl.info.render.triangles - 113))
          // console.log('tex mem: ' + formatMemory(info.memory.texture - 32000000))
        }
      }
    };
    window.document.addEventListener('keydown', onDown);
    return () => {
      clearInterval(intt);
      window.document.removeEventListener('keydown', onDown);
    };
  }, [gl]);
};






///// component: WorldWrapper.jsx 
///// JSX source:
///
// import React from "react";
// import {WorldLoader} from "world-tools-1";
// import {makeStore, useStore} from "statery";
// import {RenderSystem} from "./systems/RenderSystem.jsx";
// import {InputSystem} from "./systems/InputSystem.jsx";
// import {PostprocessingSystem} from "./systems/PostprocessingSystem.jsx";
// import {EnvironmentSystem} from "./systems/EnvironmentSystem.jsx";
// import {DefaultCameraSystem} from "./systems/DefaultCameraSystem.jsx";
// import {PlayerSystem} from "./systems/player/PlayerSystem.jsx";
// import {AudioSystem} from "./systems/AudioSystem.jsx";
// import {DefaultTerrain} from "./systems/world/DefaultTerrain.jsx";
// import {FootDustVFX} from "./systems/vfx/FootDustVFX.jsx";
// import {BuildTestSystem} from "./systems/BuildTestSystem.jsx";
// 
// 
// export const worldMetadataStore = makeStore({
//     metadata: {
//         name: 'character-controller-demo',
//         systems: [
// 
//             {src: RenderSystem},
//             {src: InputSystem},
//             {src: AudioSystem},
//             {src: PostprocessingSystem},
//             {src: EnvironmentSystem},
//             {src: DefaultCameraSystem},
//             {src: PlayerSystem},
//             {src: DefaultTerrain},
// 
//             {src: FootDustVFX},
// 
//             {src: BuildTestSystem},
// 
//         ],
//         canvas: {
//             onPointerMissed: () => {
//                 console.log('canvas click (onPointerMissed)')
// 
//                 const player = window.player;
//                 if (player.state.jumping) return;
// 
//                 window.sounds?.jump1?.triggerAttackRelease(["F1"], 0.4);
//                 player.state.jumping = true;
//                 player.velocity.y += 7;
//                 player.speed += 2;
// 
//                 const modelRef = player.state.mounted ? player.render.mount.current : player.render.model.current;
//                 modelRef?.playAnimationOnce('jumpRoll', 0.3, 0.4, 1.2);
// 
//                 setTimeout(() => {
//                     modelRef?.setAnimation(player.state.running ? 'run' : 'idle', 0.4, 0.3, 1.2);
//                     player.speed -= 2;
//                     player.state.jumping = false;
//                 }, 600);
// 
// 
//             },
//             style: {zIndex: 0},
//             shadows: true,
//             dpr: 1,
//             camera: {
//                 near: 0.5,
//                 far: 1000000,
//                 fov: 80
//             },
//             gl: {
//                 alpha: false,
//                 antialias: false,
//                 depth: false,
//                 stencil: false,
//                 powerPreference: 'high-performance',
//                 precision: 'highp',
//                 preserveDrawingBuffer: false
//             }
//         }
//     }
// })
// 
// export const WorldWrapper = () => {
//     const {metadata} = useStore(worldMetadataStore)
// 
//     return (
//         <div className={'w-full h-full flex border-3 border-[#333]'}>
//             <WorldLoader {...metadata} />
//         </div>
//     )
// }
// 

export const worldMetadataStore = makeStore({
  metadata: {
    name: 'character-controller-demo',
    systems: [{
      src: RenderSystem
    }, {
      src: InputSystem
    }, {
      src: AudioSystem
    }, {
      src: PostprocessingSystem
    }, {
      src: EnvironmentSystem
    }, {
      src: DefaultCameraSystem
    }, {
      src: PlayerSystem
    }, {
      src: DefaultTerrain
    }, {
      src: FootDustVFX
    }, {
      src: BuildTestSystem
    }],
    canvas: {
      onPointerMissed: () => {
        console.log('canvas click (onPointerMissed)');
        const player = window.player;
        if (player.state.jumping) return;
        window.sounds?.jump1?.triggerAttackRelease(["F1"], 0.4);
        player.state.jumping = true;
        player.velocity.y += 7;
        player.speed += 2;
        const modelRef = player.state.mounted ? player.render.mount.current : player.render.model.current;
        modelRef?.playAnimationOnce('jumpRoll', 0.3, 0.4, 1.2);
        setTimeout(() => {
          modelRef?.setAnimation(player.state.running ? 'run' : 'idle', 0.4, 0.3, 1.2);
          player.speed -= 2;
          player.state.jumping = false;
        }, 600);
      },
      style: {
        zIndex: 0
      },
      shadows: true,
      dpr: 1,
      camera: {
        near: 0.5,
        far: 1000000,
        fov: 80
      },
      gl: {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: 'high-performance',
        precision: 'highp',
        preserveDrawingBuffer: false
      }
    }
  }
});
export const WorldWrapper = () => {
  const {
    metadata
  } = useStore(worldMetadataStore);
  return /*#__PURE__*/_jsx("div", {
    className: 'w-full h-full flex border-3 border-[#333]',
    children: /*#__PURE__*/_jsx(WorldLoader, {
      ...metadata
    })
  });
};






///// component: App.jsx 
///// JSX source:
///
// import React from 'react';
// import {WorldWrapper} from "./WorldWrapper.jsx";
// import {Loader} from "@react-three/drei";
// import {Joystick} from "./components/Joystick.jsx";
// 
// 
// const App = () => {
// 
//     if (window.innerWidth < 250) {
//         return (
//             <div className={'border-4 border-orange-400 pix text-[14px] text-lime-400 flex w-full h-full bg-gradient-to-b from-[#444] to-[#222] flex-col justify-center items-center'}>
//                 <div className={'text-[12px] pb-4'}>
//                     react-three-fiber
//                 </div>
//                 <div>
//                     VRM character
//                 </div>
//             </div>
//         )
//     }
// 
//     return (
//         <div className={'w-full h-full flex flex-col bg-neutral-800 ' +
//             // 'bg-gradient-to-t from-[#444] to-[#222]' +
//             // 'md:pr-[275px] md:pb-[65px] md:pt-[4px] md:pl-[65px]' +
//             ''}>
//             <div id={'loadd'} style={{zIndex: 10000000000000}} className={'absolute top-0 left-0 w-full h-full bg-neutral-700 flex justify-center items-center pix text-orange-300'}>
//                 loading VRM character demo..
//             </div>
//             <Loader/>
//             <WorldWrapper/>
//             {
//                 window.innerWidth > 250 ? (
//                     <div className={'absolute bottom-8 left-8'}>
//                         <Joystick />
//                     </div>
//                 ) : null
//             }
// 
//             {
//                 window.innerWidth > 250 ? (
//                     <div className={'select-none pointer-events-none px-2 bg-neutral-800/25 pix text-orange-300 text-[14px] absolute bottom-0 right-0 w-fit h-16 flex flex-col items-center justify-center'}>
//                         <div className={' flex'}>
//                             move: <span className={'text-lime-400 px-1'}>WASD</span> keys
//                         </div>
//                         <div className={' flex text-yellow-300 text-[12px]'}>
//                             jump: <span className={'text-lime-300 px-1'}>[space bar]</span> or tap screen
//                         </div>
//                     </div>
//                 ) : null
//             }
// 
//         </div>
//     )
// }
// 
// 
// export default App;
// 

const App = () => {
  if (window.innerWidth < 250) {
    return /*#__PURE__*/_jsxs("div", {
      className: 'border-4 border-orange-400 pix text-[14px] text-lime-400 flex w-full h-full bg-gradient-to-b from-[#444] to-[#222] flex-col justify-center items-center',
      children: [/*#__PURE__*/_jsx("div", {
        className: 'text-[12px] pb-4',
        children: "react-three-fiber"
      }), /*#__PURE__*/_jsx("div", {
        children: "VRM character"
      })]
    });
  }
  return /*#__PURE__*/_jsxs("div", {
    className: 'w-full h-full flex flex-col bg-neutral-800 ' +
    // 'bg-gradient-to-t from-[#444] to-[#222]' +
    // 'md:pr-[275px] md:pb-[65px] md:pt-[4px] md:pl-[65px]' +
    '',
    children: [/*#__PURE__*/_jsx("div", {
      id: 'loadd',
      style: {
        zIndex: 10000000000000
      },
      className: 'absolute top-0 left-0 w-full h-full bg-neutral-700 flex justify-center items-center pix text-orange-300',
      children: "loading VRM character demo.."
    }), /*#__PURE__*/_jsx(Loader, {}), /*#__PURE__*/_jsx(WorldWrapper, {}), window.innerWidth > 250 ? /*#__PURE__*/_jsx("div", {
      className: 'absolute bottom-8 left-8',
      children: /*#__PURE__*/_jsx(Joystick, {})
    }) : null, window.innerWidth > 250 ? /*#__PURE__*/_jsxs("div", {
      className: 'select-none pointer-events-none px-2 bg-neutral-800/25 pix text-orange-300 text-[14px] absolute bottom-0 right-0 w-fit h-16 flex flex-col items-center justify-center',
      children: [/*#__PURE__*/_jsxs("div", {
        className: ' flex',
        children: ["move: ", /*#__PURE__*/_jsx("span", {
          className: 'text-lime-400 px-1',
          children: "WASD"
        }), " keys"]
      }), /*#__PURE__*/_jsxs("div", {
        className: ' flex text-yellow-300 text-[12px]',
        children: ["jump: ", /*#__PURE__*/_jsx("span", {
          className: 'text-lime-300 px-1',
          children: "[space bar]"
        }), " or tap screen"]
      })]
    }) : null]
  });
};
export default App;
