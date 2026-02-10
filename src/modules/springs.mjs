import {forwardRef, useImperativeHandle, useRef} from "react";
import {useSpring} from "@react-spring/web";
import {ECS} from 'ecs'

export const RotationSpring = forwardRef((props, ref) => {
    const entity = ECS.useCurrentEntity();

    const lastTargetY = useRef(0)

    const [_, api] = useSpring(() => ({
        rotationY: 0,
        config: {
            mass: 1.1,
            friction: 21,
            tension: 369,
        },
        onChange: (v) => {
            if (entity?.rotation) {
                entity.rotation.y = v.value.rotationY;
            }
        },
    }));

    useImperativeHandle(ref, () => ({
        ref: ref,
        setRotationY: (targetY) => {
            // console.log('sety: ' + targetY)

            if (targetY !== lastTargetY.current) {
                lastTargetY.current = targetY
                api.start({rotationY: targetY});
            }
        },
        stop: () => {
            api.stop();
        },
    }));

    return null;
});


export const HeightSpring = forwardRef((props, ref) => {
    const entity = ECS.useCurrentEntity();


    const [_, api] = useSpring(() => ({
        height: 0,
        config: {
            mass: 1.1,
            friction: 21,
            tension: 369,
        },
        onChange: (v) => {
            if (entity?.position) {
                entity.position.y = v.value.height;
            }
        },
    }));

    useImperativeHandle(ref, () => ({
        ref: ref,
        setHeight: (targetHeight, config) => {
            api.start({height: targetHeight, config});
        },
        stop: () => {
            api.stop();
        },
    }));

    return null;
});
