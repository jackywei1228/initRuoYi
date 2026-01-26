import React from 'react'

const IFrame = ({ src }) => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: 'calc(100vh - 120px)' }}>
      <iframe
        title="iframe"
        src={src}
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
    </div>
  )
}

export default IFrame
