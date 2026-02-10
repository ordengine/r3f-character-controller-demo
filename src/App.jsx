import React from 'react';
import {WorldWrapper} from "./WorldWrapper.jsx";
import {Loader} from "@react-three/drei";
import {Joystick} from "./components/Joystick.jsx";


const App = () => {

    if (window.innerWidth < 250) {
        return (
            <div className={'border-4 border-orange-400 pix text-[14px] text-lime-400 flex w-full h-full bg-gradient-to-b from-[#444] to-[#222] flex-col justify-center items-center'}>
                <div className={'text-[12px] pb-4'}>
                    react-three-fiber
                </div>
                <div>
                    VRM character
                </div>
            </div>
        )
    }

    return (
        <div className={'w-full h-full flex flex-col bg-neutral-800 ' +
            // 'bg-gradient-to-t from-[#444] to-[#222]' +
            // 'md:pr-[275px] md:pb-[65px] md:pt-[4px] md:pl-[65px]' +
            ''}>
            <div id={'loadd'} style={{zIndex: 10000000000000}} className={'absolute top-0 left-0 w-full h-full bg-neutral-700 flex justify-center items-center pix text-orange-300'}>
                loading VRM character demo..
            </div>
            <Loader/>
            <WorldWrapper/>
            {
                window.innerWidth > 250 ? (
                    <div className={'absolute bottom-8 left-8'}>
                        <Joystick />
                    </div>
                ) : null
            }

            {
                window.innerWidth > 250 ? (
                    <div className={'select-none pointer-events-none px-2 bg-neutral-800/25 pix text-orange-300 text-[14px] absolute bottom-0 right-0 w-fit h-16 flex flex-col items-center justify-center'}>
                        <div className={' flex'}>
                            move: <span className={'text-lime-400 px-1'}>WASD</span> keys
                        </div>
                        <div className={' flex text-yellow-300 text-[12px]'}>
                            jump: <span className={'text-lime-300 px-1'}>[space bar]</span> or tap screen
                        </div>
                    </div>
                ) : null
            }

        </div>
    )
}


export default App;
