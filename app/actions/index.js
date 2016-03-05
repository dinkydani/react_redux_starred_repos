import fetch from 'isomorphic-fetch'

export const SELECT_LANGUAGE = 'SELECT_LANGUAGE'
export function selectLanguage(language) {
  return {
    type: SELECT_LANGUAGE,
    language
  }
}

// Can hit a refresh button to update
export const INVALIDATE_REPOS = 'INVALIDATE_REPOS'
export function invalidateRepos(language) {
  return {
    type: INVALIDATE_REPOS,
    language
  }
}

// Send a request for the repos
export const REQUEST_REPOS = 'REQUEST_REPOS'
export function requestRepos(language, sort, order, limit) {
  return {
    type: 'REQUEST_REPOS',
    language,
    sort,
    order,
    limit
  }
}

// Get the repos back
export const RECEIVE_REPOS = 'RECEIVE_REPOS'
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
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.

  return function (dispatch) {
    // First dispatch: the app state is updated to inform
    // that the API call is starting.

    dispatch(requestRepos(language, sort, order, limit))

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.

    return fetch(`https://api.github.com/search/repositories?q=language:${language}&sort=${sort}&order=${order}&per_page=${limit}`)
      .then(response => response.json())
      .then(json =>

        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.

        dispatch(receiveRepos(language, json))
      )
      .catch(err =>
        console.error('Error fetching repos', err)
      )

      // In a real world app, you also want to
      // catch any error in the network call.
  }
}

function shouldFetchRepos(state, language) {
  const repos = state.reposByLanguage[language]
  if (!repos) {
    console.log('No repos, fetching')
    return true
  } else if (repos.isFetching) {
    console.log('Repos already fetching')
    return false
  } else {
    console.log('Else repos invalid?', repos.didInvalidate)
    return repos.didInvalidate
  }
}

export function fetchReposIfNeeded(language) {

  // Note that the function also receives getState()
  // which lets you choose what to dispatch next.

  // This is useful for avoiding a network request if
  // a cached value is already available.

  return (dispatch, getState) => {
    if (shouldFetchRepos(getState(), language)) {
      console.log('Should fetch repos true', language)
      // Dispatch a thunk from thunk!
      return dispatch(fetchRepos(language))
    } else {
      console.log('Should fetch repos false', language)
      // Let the calling code know there's nothing to wait for.
      return Promise.resolve()
    }
  }
}
