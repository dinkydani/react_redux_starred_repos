import { combineReducers } from 'redux'
import {
  SELECT_LANGUAGE,
  INVALIDATE_REPOS,
  REQUEST_REPOS,
  RECEIVE_REPOS,
  NEXT_PAGE,
  PREV_PAGE,
  RESET_PAGE
} from '../actions'

function selectedLanguage(state = 'javascript', action) {
  switch (action.type) {
    case SELECT_LANGUAGE:
      return action.language
    default:
      return state
  }
}

function repos(state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) {
  switch (action.type) {
    case INVALIDATE_REPOS:
      return Object.assign({}, state, {
        didInvalidate: true
      })
    case REQUEST_REPOS:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case RECEIVE_REPOS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        language: action.language,
        page: action.page,
        items: action.repos,
        lastUpdated: action.receivedAt
      })
    default:
      return state
  }
}

function reposByLanguage(state = {}, action) {
  switch (action.type) {
    case INVALIDATE_REPOS:
    case RECEIVE_REPOS:
    case REQUEST_REPOS:
      return Object.assign({}, state, {
        [action.language]: repos(state[action.language], action)
      })
    default:
      return state
  }
}

const initialPaginationState = { page: 1 }
function pagination(state = initialPaginationState, action) {
  switch (action.type) {
    case NEXT_PAGE:
      return { page: state.page + 1 }
    case PREV_PAGE:
      return { page: state.page <= 1 ? 1 : state.page - 1 }
    case RESET_PAGE:
      return initialPaginationState
    default:
      return state
  }
}

const rootReducer = combineReducers({
  reposByLanguage,
  selectedLanguage,
  pagination
})

export default rootReducer
