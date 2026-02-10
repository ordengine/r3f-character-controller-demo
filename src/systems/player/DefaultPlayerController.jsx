import {useFrame, useThree} from "@react-three/fiber";
import {forwardRef, useCallback, useRef} from "react";
import * as THREE from "three";

import {ECS} from 'ecs'
import {colliderStore} from "useCollider";

const PI = Math.PI;
const TWO_PI = PI * 2;
const rotationTarget = new THREE.Object3D();
const tempEuler = new THREE.Euler();
const moveDirection = new THREE.Vector3();
const forwardDirection = new THREE.Vector3();
const rightDirection = new THREE.Vector3();
const playerDirection = new THREE.Vector3();

window.moveDirection = new THREE.Vector3(0, 0, 1);

const vec3 = new THREE.Vector3()
const vec3_2 = new THREE.Vector3()

function normalizeAngle(from, to) {
    let delta = (to - from) % TWO_PI;
    if (delta > PI) delta -= TWO_PI;
    if (delta < -PI) delta += TWO_PI;
    return from + delta;
}

window.camFocused = false
export const DefaultPlayerController = forwardRef((props, ref) => {

    const noneFound = useRef(false)

    const forwardRayRef = useRef()

    const currentAnimation = useRef("idle");

    const player = ECS.useCurrentEntity()


    const stepping = useRef(false)
    const lastStepSound = useRef(0)

    const {raycaster} = useThree()

    useFrame(({camera, clock}, delta) => {
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
            if (window.keyDown.a || window.dir?.includes("left") )moveDirection.add(rightDirection);

            // console.log(player.render)

            const maxSpeed = player.speed || 5;
            const acceleration = player.acceleration || 10; // Acceleration rate
            const deceleration = player.deceleration || 10; // Deceleration rate


            const colliders = Object.values(colliderStore.state.colliders).flat();
            const collide = grav(player, delta, colliders)

            if (collide?.normal && collide?.distance < player.speed * 0.15) {
                // player.velocity.x -= forwardDirection.x*31
                // player.velocity.y -= forwardDirection.y*31
                // player.velocity.z -= forwardDirection.z*31
                moveDirection.add(collide.normal)
            }

            if (moveDirection.length() > 0) {

                window.moveDirection = moveDirection.clone()
                // console.log(window.moveDirection)

                if (!player.state.jumping && stepping.current && Date.now() > lastStepSound.current + 400) {
                    window.sounds.step1.triggerAttackRelease(["F1"], 0.4);
                    lastStepSound.current = Date.now()
                    window.addFootDust({
                        position: player.position
                    })
                    setTimeout(() => {
                        window.addFootDust({
                            position: player.position
                        })
                    }, 20)

                    setTimeout(() => {
                        window.addFootDust({
                            position: player.position
                        })
                    }, 50)
                } else {
                    setTimeout(() => {
                        stepping.current = true
                    }, 400)
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
                const targetVelocity = new THREE.Vector3(
                    moveDirection.x * maxSpeed,
                    0,
                    moveDirection.z * maxSpeed
                );

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
                    stepping.current = false
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
                player.position.x = 50
            }

            if (player.position.x < -50) {
                player.position.x = -50
            }
            if (player.position.z > 50) {
                player.position.z = 50
            }
            if (player.position.z < -50) {
                player.position.z = -50
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
                            rotationTarget.lookAt(
                                player.position.x + moveDirection.x,
                                player.position.y + moveDirection.y,
                                player.position.z + moveDirection.z
                            );

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
            return null
        }
        const {velocity, position} = entity;

        if (velocity && position) {
            velocity.y -= 8.5 * delta;

            position.y += velocity.y * delta;

        }

        raycaster.set(
            vec3.set(position.x, position.y + (2), position.z),
            vec3_2.set(0, -1, 0)
        );

        if (noneFound.current) {
            noneFound.current = false
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

            entity.groundNormal = intersect[0].normal
        } else {
            raycaster.set(
                vec3.set(position.x, position.y + (3), position.z),
                vec3_2.set(0, -1, 0)
            );

            if (noneFound.current) {
                noneFound.current = false
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
                entity.groundNormal = intersect[0].normal
            } else {
                noneFound.current = true
                entity.position.y += entity.velocity.y * delta;
                entity.intersectPosition = null;
            }


        }


        // forward ray


        raycaster.set(
            vec3.set(position.x, position.y + 1, position.z),
            forwardDirection
        );

        if (noneFound.current) {
            noneFound.current = false
        }

        // console.log(colliders)

        const intersectForward = raycaster.intersectObjects(colliders);

        // console.log(intersectForward[0])
        if (intersectForward?.[0]?.point) {
            forwardRayRef.current.position.copy(intersectForward[0].point)
        }


        if (position.y < -0) {
            position.y = -0;
            velocity.y = 0;
        }
        if (intersectForward?.[0]) {
            return intersectForward[0]
        }


    }, [raycaster])

    useFrame((_, delta) => {

        const colliders = Object.values(colliderStore.state.colliders).flat();
        // console.log(colliders)
        grav(player, delta, colliders)

    })

    return (
        <mesh visible={false} scale={0.2} ref={forwardRayRef}>
            <boxGeometry/>
            <meshNormalMaterial/>
        </mesh>
    )


})
