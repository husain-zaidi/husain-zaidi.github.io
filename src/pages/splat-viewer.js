import React, { useEffect, useRef, useState } from 'react'

const styles = {
  page: {
    margin: 0,
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    background: '#080a0f',
  },
  root: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  status: {
    position: 'absolute',
    left: '0.75rem',
    top: '0.75rem',
    color: '#d7deef',
    background: 'rgba(10, 15, 24, 0.72)',
    border: '1px solid rgba(215, 222, 239, 0.2)',
    borderRadius: '0.5rem',
    padding: '0.4rem 0.55rem',
    font: '12px/1.3 -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
    zIndex: 2,
    maxWidth: 'calc(100% - 2rem)',
  },
}

const SplatViewerPage = () => {
  const rootRef = useRef(null)
  const [status, setStatus] = useState('Loading point cloud...')

  useEffect(() => {
    if (!rootRef.current || typeof window === 'undefined') return undefined

    let disposed = false
    let viewer
    let cleanup = () => {}

    const run = async () => {
      try {
        const GaussianSplats3D = await import(
          /* webpackIgnore: true */ 'https://esm.sh/@mkkellogg/gaussian-splats-3d@0.4.7?bundle'
        )

        if (disposed) return

        const root = rootRef.current
        const params = new URLSearchParams(window.location.search)
        const modelUrl = params.get('url') || '/splats/gs_PC_gaming.compressed.ply'
        viewer = new GaussianSplats3D.Viewer({
          rootElement: root,
          cameraUp: [0, 1, 0],
          initialCameraPosition: [0, 2.4, 6.4],
          initialCameraLookAt: [0, -0.6, 0],
          selfDrivenMode: true,
          useBuiltInControls: true,
          ignoreDevicePixelRatio: false,
          sharedMemoryForWorkers: false,
        })

        setStatus('Loading Gaussian splat...')
        await viewer.addSplatScene(modelUrl, {
          progressiveLoad: true,
          showLoadingUI: false,
          rotation: [1, 0, 0, 0],
          scale: [0.7, 0.7, 0.7],
        })
        if (disposed) return
        viewer.start()
        setStatus('Orbit: drag | Zoom: scroll/pinch')

        cleanup = () => {
          if (viewer) viewer.stop()
          while (root.firstChild) root.removeChild(root.firstChild)
        }
      } catch (err) {
        console.error(err)
        setStatus('Viewer failed to initialize.')
      }
    }

    run()

    return () => {
      disposed = true
      cleanup()
    }
  }, [])

  return (
    <main style={styles.page}>
      <div ref={rootRef} style={styles.root}>
        <div style={styles.status}>{status}</div>
      </div>
    </main>
  )
}

export default SplatViewerPage
