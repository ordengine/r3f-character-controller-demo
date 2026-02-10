import {useCallback, useEffect, useRef} from "react";


window.keyDown = {}

export const InputSystem = () => {
    useEffect(() => {

        const handleKeyDown = (e) => {
            if (window.isAceEditorFocused) {
                return
            }
            const key = e.key.toLowerCase();
            if (key === "tab") {
                e.stopPropagation();
                e.preventDefault();
            }
            if (key === " ") {
                window.keyDown.space = true
            } else {
                window.keyDown[key] = true
            }
        };

        const handleKeyUp = (e) => {
            if (window.isAceEditorFocused) {
                return
            }
            const key = e.key.toLowerCase();
            if (key === " ") {
                window.keyDown.space = false
            } else {
                window.keyDown[key] = false
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);


    return null
};


export function useKeyboard({onKeyDown = {}, onKeyUp = {}}) {
    const ref = useRef({});

    const onKeyDownFunction = useCallback((e) => {
        if (window.isAceEditorFocused) {
            return
        }
        const key = e.key.toLowerCase();

        if (onKeyDown[key]) {
            onKeyDown[key](e);
        }
    }, [onKeyDown]);

    const onKeyUpFunction = useCallback((e) => {
        if (window.isAceEditorFocused) {
            return
        }
        const key = e.key.toLowerCase();

        if (onKeyUp[key]) {
            onKeyUp[key](e);
        }
    }, [onKeyUp]);

    useEffect(() => {
        window.addEventListener("keydown", onKeyDownFunction);
        window.addEventListener("keyup", onKeyUpFunction);
        return () => {
            window.removeEventListener("keydown", onKeyDownFunction);
            window.removeEventListener("keyup", onKeyUpFunction);
        };
    }, [onKeyDownFunction, onKeyUpFunction]);

    return ref.current;
}
