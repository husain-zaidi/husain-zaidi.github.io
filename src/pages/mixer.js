import React from 'react'
import Layout from '../components/layout'

const links = [
  { href: '/', label: 'Homepage', value: 'husain-zaidi.com' },
  { href: 'https://twitter.com/husainzaidi', label: 'Twitter', value: '@husainzaidi' },
  { href: 'https://github.com/husain-zaidi', label: 'GitHub', value: 'husain-zaidi' },
  { href: 'https://www.linkedin.com/in/husain-zaidi/', label: 'LinkedIn', value: 'husain-zaidi' },
  { href: 'mailto:husainhz7@gmail.com', label: 'Email' },
  { href: 'tel:+918126898856', label: 'Phone' },
  { href: 'https://drive.google.com/file/d/1-_AOHUlKklgeKla8eLkOyx1DnsLDg27e/view?usp=drive_link', label: 'Resume' },
  { href: 'https://luma.com/user/husainzaidi', label: 'Luma', value: 'luma.com/user/husainzaidi' },
]

const itemStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '0.25rem 0.5rem',
}

const linkStyle = {
  color: '#fff',
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
  fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)',
  whiteSpace: 'nowrap',
}

const valueStyle = {
  color: '#999',
  fontSize: 'clamp(0.65rem, 1.8vw, 0.75rem)',
  marginTop: '0.15rem',
  whiteSpace: 'nowrap',
}

const MixerPage = () => (
  <Layout pageClassName="mixer-page">
    <div style={{
      maxWidth: 720,
      margin: '0 auto',
      padding: 'clamp(2rem, 8vw, 5rem) 1.25rem',
      textAlign: 'center',
      fontFamily: 'system-ui, sans-serif',
      lineHeight: 1.6,
      boxSizing: 'border-box',
    }}>

      <h1 style={{
        fontWeight: 600,
        fontSize: 'clamp(1.75rem, 6vw, 2.5rem)',
        color: 'white',
        margin: '0 0 0.5rem',
      }}>Husain Zaidi</h1>

      <p style={{
        fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
        color: '#ddd',
        maxWidth: 600,
        margin: '0 auto 2rem',
      }}>
        I work on the Project Manager Agent in Microsoft, building LLM orchestration and distributed task systems. At home I build robotics — ROS navigation, and memory systems for household robots.
      </p>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '0.25rem 0.5rem',
        marginBottom: '2.5rem',
      }}>
        {links.map(({ href, label, value }) => (
          <span key={label} style={itemStyle}>
            <a href={href} style={linkStyle}>{label}</a>
            {value && <span style={valueStyle}>{value}</span>}
          </span>
        ))}
      </div>
    </div>
  </Layout>
)

export default MixerPage
