import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const Redirect = () => {
  const navigate = useNavigate()
  const params = useParams()

  useEffect(() => {
    const path = '/' + (params['*'] || '')
    navigate(path, { replace: true })
  }, [navigate, params])

  return null
}

export default Redirect
