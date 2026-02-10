import {useSpring} from "@react-spring/web"
import {forwardRef, useImperativeHandle, useRef, useState} from "react"
import {ECS} from "ecs"
import {
    BrightnessContrast,
    HueSaturation,
    EffectComposer, SMAA
} from "@react-three/postprocessing"

const usePostUniformSpring = (effectRef, uniformName, defaultValue) => {
    const entity = ECS.useCurrentEntity()

    const [_, api] = useSpring(() => ({
        [uniformName]: defaultValue,
        config: {
            mass: 1.1,
            friction: 21,
            tension: 369,
        },
        onChange: (v) => {
            if (entity && effectRef.current) {
                effectRef.current.uniforms.get(uniformName).value = v.value[uniformName]
            }
        },
    }))

    return {
        set: (value, config) => {
            api.start({[uniformName]: value, config})
        },
        stop: () => {
            api.stop()
        },
    }
}



const PostprocessingModel = forwardRef((props, ref) => {
    const group = useRef()

    const [multisampling, setMultisampling] = useState(2)

    const brightnessContrast = useRef()
    const hueSaturation = useRef()
    const vignette = useRef()
    const bloom = useRef()
    const dof = useRef()
    const chromatic = useRef()

    const brightnessSpring = usePostUniformSpring(
        brightnessContrast, 'brightness', 0)

    const contrastSpring = usePostUniformSpring(
        brightnessContrast, 'contrast', 0)

    const saturationSpring = usePostUniformSpring(
        hueSaturation, 'saturation', 0)

    const vignetteSpring = usePostUniformSpring(
        vignette, 'darkness', 0)

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
            vignette: vignetteSpring,
        },
    }))



    return (
        <EffectComposer ref={ref} multisampling={multisampling}>
            <SMAA preset={1} edgeDetectionMode={1} />
            <BrightnessContrast ref={brightnessContrast} brightness={0.1} contrast={0.2}/>
            <HueSaturation ref={hueSaturation} saturation={0.1}/>

        </EffectComposer>
    )
})

export const PostprocessingEntity = () => {

    return (
        <ECS.Entity>
            <ECS.Component name="isPostprocessing" data={true} />
            <ECS.Component name="render">
                <PostprocessingModel />
            </ECS.Component>
        </ECS.Entity>
    )
}

export const PostprocessingSystem = () => {

    return <PostprocessingEntity />
}
