import { useEffect } from "react";


export default function useClickOutsideHandler(ref, handler) {
    useEffect(() => {
        const listener = e => {
            // do nothing when click on the target 
            if (!ref.current || ref.current.contains(e.target)) {
                return
            }
            handler()
        }

        document.addEventListener('mousedown', listener)
        document.addEventListener('touchstart', listener)

        return () => {
            document.removeEventListener('mousedown', listener)
            document.removeEventListener('touchstart', listener)
        }
    }, [ref, handler])
}