import {useEntities} from "miniplex-react"
import {useFrame} from "@react-three/fiber"
import {ECS} from 'ecs'

export const RenderSystem = () => {
    const renderableEntities = useEntities(ECS.world.with("render"))

    useFrame(() => {
        for (const entity of renderableEntities) {
            const {render, position, rotation, scale} = entity
            if (render?.group?.current) {
                if (position) {
                    render.group.current.position.set(position.x, position.y, position.z)
                }
                if (rotation) {
                    render.group.current.rotation.set(rotation.x, rotation.y, rotation.z)
                }
                if (scale) {
                    render.group.current.scale.set(scale.x, scale.y, scale.z)
                }
            }
        }
    })
};
