import React from 'react'
import Layout from '../components/layout'
import card from '../images/card.png'

const MixerPage = () => (
  <Layout pageClassName="mixer-page">
    <div style={{ 
      maxWidth: 720, 
      margin: '5rem auto', 
      padding: '0 2rem', 
      textAlign: 'center', 
      fontFamily: 'system-ui, sans-serif', 
      lineHeight: 1.6,
    }}>
     
      <h1 style={{ 
        fontWeight: 600, 
        fontSize: '1.5rem', 
        color: 'white', 
        marginBottom: '2rem' 
      }}>Husain Zaidi</h1>

      <p style={{ 
        fontSize: '1.1rem', 
        color: 'white', 
        maxWidth: 600, 
        margin: '0 auto 2rem' 
      }}>
        I work on the Project Manager Agent in Microsoft, building LLM orchestration and distributed task systems. At home I build robotics — ROS navigation, and memory systems for household robots.
      </p>

      <div style={{ 
        marginBottom: '2rem', 
        fontSize: '1.05rem' 
      }}>
        <a href="/" style={{ margin: '0 0.5rem' }}>Homepage</a>
        <a href="https://twitter.com/husainzaidi" style={{ margin: '0 0.5rem' }}>Twitter</a>
        <a href="https://github.com/husain-zaidi" style={{ margin: '0 0.5rem' }}>GitHub</a>
        <a href="https://www.linkedin.com/in/husain-zaidi/" style={{ margin: '0 0.5rem' }}>LinkedIn</a>
        <a href="mailto:husainhz7@gmail.com" style={{ margin: '0 0.5rem' }}>Email</a>
        <a href="tel:+918126898856" style={{ margin: '0 0.5rem' }}>Phone</a>
        <a href="https://drive.google.com/file/d/1-_AOHUlKklgeKla8eLkOyx1DnsLDg27e/view?usp=drive_link" style={{ margin: '0 0.5rem' }}>Resume</a>
        <a href="https://luma.com/user/husainzaidi" style={{ margin: '0 0.5rem' }}>Luma</a>
      </div>

      <img src={card} alt="QR code" style={{ maxWidth: 240 }} />
    </div>
  </Layout>
)

export default MixerPage