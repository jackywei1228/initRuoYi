import React from 'react'
import IFrame from '@/components/iFrame'

const Swagger = () => {
  const url = `${process.env.VUE_APP_BASE_API}/swagger-ui/index.html`
  return <IFrame src={url} />
}

export default Swagger
