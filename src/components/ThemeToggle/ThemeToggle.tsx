import { Icon } from '@iconify/react/dist/iconify.js'
import { useThemeToggle } from './hooks'
import './ThemeToggle.scss'

function ThemeToggle() {
    const { theme, handleThemeToggle } = useThemeToggle()
    return (
        <button className='theme-toggle-container' onClick={handleThemeToggle}>
            {theme === 'light' ?
                <Icon className='theme-icon' icon='line-md:sun-rising-filled-loop' height={24} />
                :
                <Icon className='theme-icon' icon='line-md:moon-filled-alt-loop' height={24} />}
        </button>
    )
}

export default ThemeToggle
