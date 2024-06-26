import Button from '../../../components/Button'
import ProxySetup from './ProxySetup'
import './Setup.scss'
import { useSetup } from './hooks'

function Setup() {

    const { handleNameChange, handleApiKeyChange, handleSubmit, getAPI, name, API_KEY, showApiError, handleProxyChange, proxy } = useSetup()

    return (
        <div className={`auth-container ${API_KEY ? 'active' : ''}`}>
            <div className='input-container'>
                <span>Votre prénom</span>
                <input
                    type='text'
                    id='name'
                    value={name}
                    autoComplete='off'
                    onChange={handleNameChange}
                />
            </div>
            <div className='input-container'>
                <span>Clé d'accès</span>
                <input
                    type='password'
                    id='apiKey'
                    value={API_KEY}
                    autoComplete='new-password'
                    onChange={handleApiKeyChange}
                />
                {showApiError && <p>Vous devez fournir une clé d'accès valide ! Obtenez-la en utilisant le bouton gauche.</p>}
            </div>
                <ProxySetup proxy={proxy} handleProxyChange={handleProxyChange} />
            <div className='buttons-container'>
                <Button className='start-button secondary' onClick={getAPI}>Obtenir une clé d'accès</Button>
                <Button className='start-button' onClick={handleSubmit}>Démarrer</Button>
            </div>
        </div>
    )
}

export default Setup
