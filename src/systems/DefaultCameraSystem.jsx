import {CameraControls} from "@react-three/drei";
import {useEffect, useRef} from "react";
import {useFrame} from "@react-three/fiber";

export const DefaultCameraSystem = () => {

    const cameraControlsRef = useRef()

    useEffect(() => {
        const controls = cameraControlsRef.current;
        if (!controls) return;
        window.cam = controls;

        controls.dollyTo(3, false)
        controls.moveTo(0, 1, 0, false)
        controls.rotateTo(-0.5, Math.PI/2 + 0.1, false)
        controls.minDistance = 1.5;
        controls.maxDistance = 100;
        controls.draggingSmoothTime = 0.015;
        controls.smoothTime = 0.2;
        controls.dollySpeed = 0.9;

        if (window.buildData) {

            window.cam.dollyTo(4, true)
            window.cam.rotateTo(Math.PI, 1.2, true)
        }

        // controls.maxPolarAngle = 2.2;

        controls.mouseButtons.right = 1

    }, [])

    useFrame(() => {

        if (!window.started) {
            // cameraControlsRef.current.rotate(0.001, 0, true)
        }

        if (cameraControlsRef.current.camera.position.y < 0.2) {
            cameraControlsRef.current.camera.position.y = 0.2
        }
    })

    return (
        <CameraControls makeDefault ref={cameraControlsRef} />
    )
}
