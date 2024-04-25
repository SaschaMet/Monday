import { ChangeEventHandler } from "react"

export const Toggle = (
    { onChangeFunction, labelText, active = false }:
        { onChangeFunction: ChangeEventHandler<HTMLInputElement>, labelText: string, active: boolean }) => {
    return (
        <label className="toggle">
            <input name={labelText} defaultChecked={active} type="checkbox" role="switch" onChange={onChangeFunction} />
            {labelText}
        </label>
    )

}