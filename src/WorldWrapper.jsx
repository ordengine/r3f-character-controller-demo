import React from "react";
import {WorldLoader} from "world-tools-1";
import {makeStore, useStore} from "statery";
import {RenderSystem} from "./systems/RenderSystem.jsx";
import {InputSystem} from "./systems/InputSystem.jsx";
import {PostprocessingSystem} from "./systems/PostprocessingSystem.jsx";
import {EnvironmentSystem} from "./systems/EnvironmentSystem.jsx";
import {DefaultCameraSystem} from "./systems/DefaultCameraSystem.jsx";
import {PlayerSystem} from "./systems/player/PlayerSystem.jsx";
import {AudioSystem} from "./systems/AudioSystem.jsx";
import {DefaultTerrain} from "./systems/world/DefaultTerrain.jsx";
import {FootDustVFX} from "./systems/vfx/FootDustVFX.jsx";
import {BuildTestSystem} from "./systems/BuildTestSystem.jsx";


export const worldMetadataStore = makeStore({
    metadata: {
        name: 'character-controller-demo',
        systems: [

            {src: RenderSystem},
            {src: InputSystem},
            {src: AudioSystem},
            {src: PostprocessingSystem},
            {src: EnvironmentSystem},
            {src: DefaultCameraSystem},
            {src: PlayerSystem},
            {src: DefaultTerrain},

            {src: FootDustVFX},

            {src: BuildTestSystem},

        ],
        canvas: {
            onPointerMissed: () => {
                console.log('canvas click (onPointerMissed)')

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
            style: {zIndex: 0},
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
})

export const WorldWrapper = () => {
    const {metadata} = useStore(worldMetadataStore)

    return (
        <div className={'w-full h-full flex border-3 border-[#333]'}>
            <WorldLoader {...metadata} />
        </div>
    )
}
