import {useEffect, useLayoutEffect} from "react";
const volStep = new Tone.Volume(-15).toDestination(); // For slash sound (full volume)


window.sounds = {}

window.sounds.jump1 = new Tone.Sampler({
    urls: {
        A1: "c1c1b5b643891c559a19508f424aa0f7530d71c5dd16d3f31200e58a1019b05ci0",
    },
    baseUrl: "/content/",
    onload: () => {
        // window.step1.triggerAttackRelease(["C1", "E1", "G1", "B1"], 0.5);
    }
}).connect(volStep)

window.sounds.step1 = new Tone.Sampler({
    urls: {
        A1: "f1f180d020e64e0fe921028527b575f73209a8574efba83b3c233888566a1ce3i0",
        // A1: "footstep05.ogg",
    },
    baseUrl: "/content/",
    onload: () => {
        // window.step1.triggerAttackRelease(["C1", "E1", "G1", "B1"], 0.5);
    }
}).connect(volStep)


export const AudioSystem = () => {

    useLayoutEffect(() => {
        async function start() {
            try {
                await Tone.start()
                console.log('tonejs started');

                // loopTest()
            } catch (err) {
                console.error('error starting audio:', err);
            }
        }

        window.start = start

    }, [])

    return null
}
