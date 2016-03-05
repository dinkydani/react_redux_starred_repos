import fetch from 'isomorphic-fetch'

export const SELECT_LANGUAGE = 'SELECT_LANGUAGE'
export const INVALIDATE_REPOS = 'INVALIDATE_REPOS'
export const REQUEST_REPOS = 'REQUEST_REPOS'
export const RECEIVE_REPOS = 'RECEIVE_REPOS'
export const NEXT_PAGE = 'NEXT_PAGE'
export const PREV_PAGE = 'PREV_PAGE'
export const RESET_PAGE = 'RESET_PAGE'

export function selectLanguage(language) {
  return {
    type: SELECT_LANGUAGE,
    language
  }
}

export function invalidateRepos(language) {
  return {
    type: INVALIDATE_REPOS,
    language
  }
}

export function requestRepos({ language, page, sort, order, limit }) {
  return {
    type: 'REQUEST_REPOS',
    language,
    page,
    sort,
    order,
    limit
  }
}

export function receiveRepos({ language, page, json }) {
  return {
    type: RECEIVE_REPOS,
    language,
    page,
    repos: json.items,
    totalItems: json.total_count,
    receivedAt: Date.now()
  }
}

export function fetchRepos({
  language = 'javascript',
  page = 1,
  sort = 'stars',
  order = 'desc',
  limit = 5 }) {
  return function (dispatch) {
    dispatch(requestRepos({ language, sort, order, limit }))
    return fetch(`https://api.github.com/search/repositories?q=language:${language}&sort=${sort}&order=${order}&per_page=${limit}&page=${page}`)
      .then(response => response.json())
      .then(json => {
        dispatch(receiveRepos({ language, page, json }))
      })
      .catch(err =>
        console.error('Error fetching repos', err)
      )
  }
}

function shouldFetchRepos(state, language, page) {
  if (state.pagination.page !== page) {
    return true
  }
  const repos = state.reposByLanguage[language]
  if (!repos) {
    return true
  } else if (repos.isFetching) {
    return false
  }
  return repos.didInvalidate
}

export function fetchReposIfNeeded(language) {
  return (dispatch, getState) => {
    if (shouldFetchRepos(getState(), language)) {
      // Dispatch a thunk from thunk!
      return dispatch(fetchRepos({ language }))
    }
  }
}

export function nextPage() {
  return {
    type: NEXT_PAGE
  }
}

export function prevPage() {
  return {
    type: PREV_PAGE
  }
}

export function resetPage() {
  return {
    type: RESET_PAGE
  }
}
