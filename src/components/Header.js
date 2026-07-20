import PropTypes from 'prop-types'
import React from 'react'

const Header = props => {
  const [localTime, setLocalTime] = React.useState('')

  React.useEffect(() => {
    const updateLocalTime = () => {
      setLocalTime(
        new Intl.DateTimeFormat(undefined, {
          hour: 'numeric',
          minute: '2-digit',
        }).format(new Date())
      )
    }

    updateLocalTime()
    const clockInterval = window.setInterval(updateLocalTime, 30000)

    return () => window.clearInterval(clockInterval)
  }, [])

  return (
  <header id="header" style={props.timeout ? { display: 'none' } : {}}>
    <div className="content">
      <div className="local-time" aria-label={localTime ? `Local time ${localTime}` : 'Local time'}>
        <span className="icon fa-clock-o" aria-hidden="true"></span>
        <span>{localTime || '--:--'}</span>
      </div>
      <div className="inner">
        <span className="eyebrow">Software Engineer 2 @ Microsoft</span>
        <h1>Husain Zaidi</h1>
        <p>Automate drudgery, live in the future.</p>
      </div>
    </div>
    <nav aria-label="Primary navigation">
      <ul>
        <li>
          <button
            onClick={() => {
              props.onOpenArticle('work')
            }}
          >
            <span className="icon fa-code" aria-hidden="true"></span>
            <span>Work</span>
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              props.onOpenArticle('about')
            }}
          >
            <span className="icon fa-user" aria-hidden="true"></span>
            <span>About</span>
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              props.onOpenArticle('contact')
            }}
          >
            <span className="icon fa-envelope-o" aria-hidden="true"></span>
            <span>Contact</span>
          </button>
        </li>
      </ul>
    </nav>
  </header>
  )
}

Header.propTypes = {
  onOpenArticle: PropTypes.func,
  timeout: PropTypes.bool,
}

export default Header
