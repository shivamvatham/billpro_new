import { useState } from "react";

export function useToggle(defaultVal = true) {
    const [value, setValue] = useState(defaultVal)

    function toggle(val) {
        if (typeof val == 'boolean') {
            setValue(val)
        } else {
            setValue(!value)
        }
    }
    return [value, toggle]
}