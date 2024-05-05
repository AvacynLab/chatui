import { useState } from 'react'
import './Welcome.scss'
import Button from '../../components/Button'
import Setup from './Setup'
import ThemeToggle from '../../components/ThemeToggle'

function Welcome() {
  const [showInputs, setShowInputs] = useState(false)

  return (
    <div className='welcome-page'>
      <div className='theme-toggle-wrapper'>
        <ThemeToggle />
      </div>
      <div className='heading'>
        <h1 className={showInputs ? 'small-h1' : ''}>Chattez avec <span>Avacyn</span></h1>
        {!showInputs ?
          (
            <>
              <h3>Ne soyez pas jaloux de Tony, ayez votre propre Jarvis !</h3>
              <Button className='start-button' onClick={() => setShowInputs(true)}>Démarrer</Button>
            </>) :
          (<Setup />)
        }
      </div>
      <span className='disclaimer'>v0.1.4  Cette application est un prototype, Avacyn peut faire des erreurs. Pensez à vérifier les informations importantes.</span>
    </div>
  )
}

export default Welcome