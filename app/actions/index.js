import fetch from 'isomorphic-fetch'

export const SELECT_LANGUAGE = 'SELECT_LANGUAGE'
export const INVALIDATE_REPOS = 'INVALIDATE_REPOS'
export const REQUEST_REPOS = 'REQUEST_REPOS'
export const RECEIVE_REPOS = 'RECEIVE_REPOS'

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

export function requestRepos(language, sort, order, limit) {
  return {
    type: 'REQUEST_REPOS',
    language,
    sort,
    order,
    limit
  }
}

export function receiveRepos(language, json) {
  return {
    type: RECEIVE_REPOS,
    language,
    repos: json.items,
    totalItems: json.total_count,
    receivedAt: Date.now()
  }
}

// Meet our first thunk action creator!
// Though its insides are different, you would use it just like any other action creator:
// store.dispatch(fetchRepos('javascript'))

export function fetchRepos({
  language = 'javascript',
  sort = 'stars',
  order = 'desc',
  limit = 5 }) {
  return function (dispatch) {
    dispatch(requestRepos(language, sort, order, limit))

    return fetch(`https://api.github.com/search/repositories?q=language:${language}&sort=${sort}&order=${order}&per_page=${limit}`)
      .then(response => response.json())
      .then(json =>
        dispatch(receiveRepos(language, json))
      )
      .catch(err =>
        console.error('Error fetching repos', err)
      )
  }
}

function shouldFetchRepos(state, language) {
// function shouldFetchRepos(state) {
  const repos = state.reposByLanguage[language]
  // const repos = state.repos
  if (!repos) {
    return true
  } else if (repos.isFetching) {
    return false
  }
  return repos.didInvalidate
}

export function fetchReposIfNeeded(language) {
// export function fetchReposIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchRepos(getState(), language)) {
    // if (shouldFetchRepos(getState())) {
      // Dispatch a thunk from thunk!
      return dispatch(fetchRepos(language))
    }
  }
}
