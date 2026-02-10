import {VRM} from "../../components/VRM.jsx";
import React, {forwardRef, memo, useImperativeHandle, useRef, useEffect} from "react";
import {RotationSpring} from "../../modules/springs.mjs";
import {ECS, useGUI} from 'ecs'
import {DefaultPlayerController} from "./DefaultPlayerController.jsx";
import {QUATERNIUS_ANIMATIONS_1, QUATERNIUS_ANIMATIONS_2} from "world-tools-1";
import {useKeyboard} from "../InputSystem.jsx";
let playerEntityInstance = null;


const getOrCreatePlayer = () => {
    if (!playerEntityInstance) {
        playerEntityInstance = ECS.world.add({
            isPlayer: true,
            position: {x: 0.0, y: 8, z: 0},
            rotation: {x: 0, y: 0, z: 0},
            scale: {x: 1, y: 1, z: 1},
            velocity: {x: 0, y: 0, z: 0},
            speed: 9,
            acceleration: 10,
            deceleration: 50,
            state: {
                walking: false,
                running: false,
                jumping: false,
                swimming: false,
                flying: false,
                mounted: false,
            }
        });
    }
    return playerEntityInstance;
};


const PlayerModel = memo(forwardRef((props, ref) => {
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
        model,
    }), []);

    return (
        <group ref={group}>
            <VRM
                ref={model}
                src={'/content/609b1640c55ec583cd110cfa2dbe38759b5dd8ce0f0009ce8b8cd9af3b73ce27i0'}
                shadows
                animations={{
                    ...QUATERNIUS_ANIMATIONS_1,
                    ...QUATERNIUS_ANIMATIONS_2,
                }}
            />
        </group>
    );
}), () => true);

const PlayerEntity = memo(() => {
    const player = getOrCreatePlayer();



    return (
        <ECS.Entity entity={player}>
            <ECS.Component name="render">
                <PlayerModel />
            </ECS.Component>

            <ECS.Component name="playerController">
                <DefaultPlayerController />
            </ECS.Component>

            <ECS.Component name="rotationSpring">
                <RotationSpring />
            </ECS.Component>

        </ECS.Entity>
    );
});



export const PlayerSystem = memo(() => {

    useGUI(
        <div className={'pix absolute bottom-20 right-2 flex flex-col gap-2'}>

            <button onClick={() => {
                window.player.render.model.current.playAnimationOnce('attack', 0.3, 0.4, 1.2);
            }} className={'p-1 px-4 text-red-300 bg-neutral-800/25'}>
                attack
            </button>
            <button onClick={() => {
                window.player.render.model.current.playAnimationOnce('sit', 0.3, 0.4, 1.2);
            }} className={'p-1 px-4 text-lime-300 bg-neutral-800/25'}>
                sit
            </button>
        </div>
    )

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
            },
        }
    });


    return (
        <group>
            <PlayerEntity />
        </group>
    );
});
