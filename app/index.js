import 'babel-polyfill'

// Configure the store
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'

// import { fetchReposIfNeeded } from './actions'
import rootReducer from './reducers'

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    createLogger() // neat middleware that logs actions
  )
)

// store.dispatch(fetchReposIfNeeded('javascript')).then(() =>
// store.dispatch(fetchReposIfNeeded()).then(() =>
//   console.log(store.getState())
// )

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './containers/App'

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
