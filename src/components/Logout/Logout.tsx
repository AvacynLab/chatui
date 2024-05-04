import { useDispatch } from 'react-redux'
import { clearUser } from '../../store/user/userSlice'
import Button from '../Button'

function Logout () {
    const dispatch = useDispatch()
    const handleLogout = () => {
        dispatch(clearUser())
    }
    return (
        <Button onClick={handleLogout}>Déconnexion</Button>
    )
}

export default Logout
