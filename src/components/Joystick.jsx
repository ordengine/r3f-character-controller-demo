import React, {useRef} from 'react';
import {useDrag} from '@use-gesture/react';

export const Joystick = () => {
    const handleRef = useRef(null);

    const maxDistance = 50;
    const setWindowDir = (angleDeg) => {
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
    const bind = useDrag(
        ({movement: [mx, my], down, event}) => {
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
                const angleDeg = (Math.atan2(newY, newX) * 180) / Math.PI;
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
        },
        {
            from: () => [0, 0],
            preventDefault: true,
            eventOptions: {passive: false}
        }
    );



    return (
        <>
            {
                <div
                    className={`w-[120px] h-[120px] border-4 border-opacity-20 hover:border-opacity-80 border-orange-400 bg-neutral-800 bg-opacity-20 rounded-sm`}
                    style={{ touchAction: 'none' }}
                >

                    <div
                        {...bind()}
                        ref={handleRef}
                        className="ring-4 ring-black ring-opacity-10 cursor-crosshair joystick-handle absolute left-1/2 top-1/2 w-[80px] h-[80px] bg-orange-400 rounded-sm"
                        style={{
                            transform: 'translate3d(0px, 0px, 0) translate(-50%, -50%)',
                            touchAction: 'none',
                            userSelect: 'none',
                            willChange: 'transform',
                        }}
                    >

                        <div className="absolute left-1/2 -top-1 transform -translate-x-1/2 text-orange-300 text-lg">
                            ▲
                        </div>
                        <div className="absolute right-0.5 top-1/2 transform -translate-y-1/2 text-orange-300 text-lg">
                            ▶
                        </div>
                        <div className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 text-orange-300 text-lg">
                            ▼
                        </div>
                        <div className="absolute left-0.5 top-1/2 transform -translate-y-1/2 text-orange-300 text-lg">
                            ◀
                        </div>

                    </div>
                </div>
            }
        </>
    );
};
