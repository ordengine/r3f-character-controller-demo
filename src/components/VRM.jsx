import React, {forwardRef, useEffect, useRef, useState, useImperativeHandle, Suspense, useLayoutEffect} from "react"
import {useFrame} from "@react-three/fiber"
import {GLTFLoader} from 'gltfAndDraco'
import {DRACOLoader} from 'gltfAndDraco'
import {VRMLoaderPlugin, VRMUtils} from '@pixiv/three-vrm'
import {VRMAnimationLoaderPlugin, VRMLookAtQuaternionProxy, createVRMAnimationClip} from '@pixiv/three-vrm-animation'

let currentFinishedListener = null;
let isAnimationPlaying = false;
let debounceTimeout = null;
import * as THREE from "three"
import {loadMixamoAnimation} from 'vrm-utils'



export const VRM = forwardRef(({
                                      src = '/content/609b4b19a41e89ee3274c4455036ff19ff0ae17426e4891bebf689997dbdca3bi0',
                                      animations = {
                                          idle: "/content/a11189dd226838ec2b7689e27355e37c3d2c841645d341f9ac22ac6cac0ab645i0",
                                          walk: '/content/9c99296596aebca23b81d17c864ba6a35bd48fa8a006d1e81419a81948652326i4',
                                          run: "/content/a2a286e5fcde5450311dc657ee37b67dfd4b471e325e4c08909f0b7e4b250496i0",
                                          jump: "/content/abab52ddfe550d18c87d8102082f03dbbd7430e3c30e0c3bf7a4dea7b786bb47i0",
                                          sit: "/content/9c99296596aebca23b81d17c864ba6a35bd48fa8a006d1e81419a81948652326i0",
                                          attack: '/content/9c99296596aebca23b81d17c864ba6a35bd48fa8a006d1e81419a81948652326i3',
                                      },
                                      shadows = true
                                  }, ref) => {
    const [finalVrm, setFinalVrm] = useState(null)
    const mixerRef = useRef(null)
    const actionsRef = useRef({})
    const activeActionRef = useRef(null)
    const previousActionRef = useRef(null)
    const helperRoot = useRef(new THREE.Group())

    const setAnimation = (animationName, fade1 = 0.2, fade2 = 0.3, speed = 1) => {
        if (activeActionRef.current?._clip.name === animationName) {
            return
        }

        const action = actionsRef.current[animationName]
        if (!action) {
            console.warn(`animation not loaded: ${animationName}`)
            return
        }

        if (activeActionRef.current && activeActionRef.current !== action) {
            action.reset()
            action.enabled = true
            action.setEffectiveTimeScale(speed)
            action.setEffectiveWeight(1)
            activeActionRef.current.crossFadeTo(action, fade1, false)
            action.play()
        } else {
            action.reset()
            action.enabled = true
            action.setEffectiveTimeScale(speed)
            action.setEffectiveWeight(1)
            action.fadeIn(fade2).play()
        }

        activeActionRef.current = action
        previousActionRef.current = action
    }


    useImperativeHandle(ref, () => ({
        vrm: finalVrm,
        mixerRef: mixerRef,
        setAnimation,
        playAnimationOnce: (animationName, fade1 = 0.2, fade2 = 0.3, speed = 1) => {
            const action = actionsRef.current[animationName]
            if (!action) {
                console.warn(`animation not loaded: ${animationName}`)
                return
            }

            const loopingAction = activeActionRef.current


            if (activeActionRef.current?._clip.name === animationName) {
                return
            }

            action.reset()
            action.enabled = true
            action.setEffectiveTimeScale(speed)
            action.setEffectiveWeight(1)
            action.loop = THREE.LoopOnce
            action.clampWhenFinished = true

            if (loopingAction && loopingAction !== action) {
                loopingAction.crossFadeTo(action, fade1, false)
            } else {
                action.fadeIn(fade2)
            }
            action.play()
            activeActionRef.current = action

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
            mixerRef.current?.stopAllAction()
            activeActionRef.current = null
            previousActionRef.current = null
        },
        getAvailableAnimations: () => Object.keys(actionsRef.current)
    }))


    useEffect(() => {
        const start = async () => {
            const loader = new GLTFLoader()
            const dracoLoader = new DRACOLoader()
            loader.setDRACOLoader(dracoLoader)
            loader.crossOrigin = 'anonymous'

            loader.register((parser) => new VRMLoaderPlugin(parser, {
                helperRoot: helperRoot.current,
                autoUpdateHumanBones: true,
            }))
            loader.register((parser) => new VRMAnimationLoaderPlugin(parser))

            const gltfVrm = await loader.loadAsync(src)
            const vrm = gltfVrm.userData.vrm

            VRMUtils.removeUnnecessaryVertices(gltfVrm.scene)
            VRMUtils.combineSkeletons(gltfVrm.scene)
            VRMUtils.combineMorphs(vrm)
            VRMUtils.rotateVRM0(vrm)
            VRMUtils.removeUnnecessaryJoints(gltfVrm.scene)

            const lookAtQuatProxy = new VRMLookAtQuaternionProxy(vrm.lookAt)
            lookAtQuatProxy.name = 'lookAtQuaternionProxy'
            vrm.scene.add(lookAtQuatProxy)

            vrm.scene.children[0].frustumCulled = false
            vrm.scene.children[1].frustumCulled = false

            if (shadows) {
                try {
                    vrm.scene.children[0].castShadow = true
                    // vrm.scene.children[0].receiveShadow = true
                } catch (e) {
                }
                try {
                    vrm.scene.children[1].castShadow = true
                    // vrm.scene.children[1].receiveShadow = true
                } catch (e) {
                }
                try {
                    vrm.scene.children[2].castShadow = true
                    // vrm.scene.children[2].receiveShadow = true
                } catch (e) {
                }
                try {
                    vrm.scene.children[3].castShadow = true
                    // vrm.scene.children[2].receiveShadow = true
                } catch (e) {
                }
                try {
                    vrm.scene.children[4].castShadow = true
                    // vrm.scene.children[2].receiveShadow = true
                } catch (e) {
                }
                try {
                    vrm.scene.children[5].castShadow = true
                    // vrm.scene.children[2].receiveShadow = true
                } catch (e) {
                }
                try {
                    vrm.scene.children[6].castShadow = true
                    // vrm.scene.children[2].receiveShadow = true
                } catch (e) {
                }
                try {
                    vrm.scene.children[7].castShadow = true
                    // vrm.scene.children[2].receiveShadow = true
                } catch (e) {
                }
                try {
                    vrm.scene.children[8].castShadow = true
                    // vrm.scene.children[2].receiveShadow = true
                } catch (e) {
                }
                try {
                    vrm.scene.children[9].castShadow = true
                    // vrm.scene.children[2].receiveShadow = true
                } catch (e) {
                }
            }


            setFinalVrm(vrm)

            mixerRef.current = new THREE.AnimationMixer(vrm.scene)

            // console.log(animations)
            for (const [name, animUrl] of Object.entries(animations)) {
                try {
                    let clip
                    // console.log(animUrl)
                    if (animUrl.src && animUrl.type === 'fbx') {
                        // console.log('yep fbx data')
                        clip = await loadMixamoAnimation(animUrl.src, vrm)

                    } else if (animUrl.src && animUrl.type === 'vrma') {

                        const gltfVrma = await loader.loadAsync(animUrl.src)
                        const vrmAnimation = gltfVrma.userData.vrmAnimations[0]
                        clip = createVRMAnimationClip(vrmAnimation, vrm)

                    } else {

                        // const modifiedUrl = await fetchAndModifyVrma(animUrl, {});
                        const gltfVrma = await loader.loadAsync(animUrl)
                        const vrmAnimation = gltfVrma.userData.vrmAnimations[0]
                        clip = createVRMAnimationClip(vrmAnimation, vrm)
                    }

                    clip.name = name
                    const action = mixerRef.current.clipAction(clip)
                    actionsRef.current[name] = action

                    setAnimation('idle')

                        let cover = document.getElementById('loadCover')

                            if (cover) {
                                cover.style.transition = '1s'
                                cover.style.opacity = '0'

                                setTimeout(() => {
                                    cover.remove()
                                }, 1000)
                            }



                } catch (err) {
                    console.error(`failed to load animation: ${animUrl}`, err)
                }
            }
            // playerStatusStore.set({mainHandName: 'IronSledgehammer'})
            // ECS.world.removeComponent(player, 'mainHand')
            // ECS.world.addComponent(player, 'mainHand', {
            //     component: IronSledgehammer,
            //     name: 'IronSledgehammer',
            // })
            // window.setNudge(Math.random())

            const loadCover = document.getElementById('loadd')
            if (loadCover) {
                loadCover.remove()
            }

        }

        start()

        return () => {
            if (finalVrm) VRMUtils.deepDispose(finalVrm.scene)
            if (mixerRef.current) mixerRef.current.stopAllAction()
            const dracoLoader = new DRACOLoader()
            dracoLoader.dispose()
        }
    }, [src])

    useFrame((_, delta) => {
        if (_.clock.running) {
            mixerRef.current?.update(delta)
            finalVrm?.update(delta)
        }
    })

    return (
        <Suspense fallback={<mesh>
            <boxGeometry/>
            <meshNormalMaterial/>
        </mesh>}>
            {
                finalVrm ? (
                    <primitive object={finalVrm.scene}/>
                ) : null
            }
        </Suspense>
    )
})
