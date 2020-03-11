import React from "react"
import {GlobalConsumer  } from "./context"

export const withContext = Component => {
  return props => (
    <GlobalConsumer>
      {value => <Component {...props} value={value} />}
    </GlobalConsumer>
  )
}
