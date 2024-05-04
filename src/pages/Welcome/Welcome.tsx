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
              <h3>Titre</h3>
              <Button className='start-button' onClick={() => setShowInputs(true)}>C'est parti !</Button>
            </>) :
          (<Setup />)
        }
      </div>
      <span className='disclaimer'>Cette application est un prototype.</span>
    </div>
  )
}

export default Welcome