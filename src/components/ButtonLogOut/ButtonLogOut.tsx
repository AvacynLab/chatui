import './ButtonLogOut.scss'
import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode,
    disabled?: boolean
}

function ButtonLogOut ({ children, disabled, ...buttonProps }: ButtonProps) {
    return (
    <button className={`buttonlogout ${disabled ? 'disabled' : ''}`}
    { ...buttonProps } >
        {children}
    </button>
    )
}

export default ButtonLogOut
