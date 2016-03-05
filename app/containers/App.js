import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { fetchReposIfNeeded, invalidateRepos } from '../actions'
import RepoList from '../components/RepoList'

class App extends Component {
  constructor(props) {
    super(props)
    this.handleRefreshClick = this.handleRefreshClick.bind(this)
  }

  componentDidMount() {
    const { dispatch, selectedLanguage } = this.props
    dispatch(fetchReposIfNeeded(selectedLanguage))
  }

  handleRefreshClick(e) {
    e.preventDefault()

    const { dispatch, selectedLanguage } = this.props
    dispatch(invalidateRepos(selectedLanguage))
    dispatch(fetchReposIfNeeded(selectedLanguage))
  }

  render() {
    const {
      repos,
      selectedLanguage,
      isFetching,
      lastUpdated
    } = this.props
    const isEmpty = repos.length === 0
    return (
      <div>
        <p>Selected: {selectedLanguage}</p>
        <p>
          {lastUpdated &&
            <span>
              Last updated at {new Date(lastUpdated).toLocaleTimeString()}
              {' '}
            </span>
          }
          {!isFetching &&
            <a href="#"
               onClick={this.handleRefreshClick}>
              Refresh
            </a>
          }
        </p>
        {isEmpty && !isFetching &&
          <h2>No repos found :(</h2>
        }
        {isEmpty && isFetching &&
          <h2>Loading...</h2>
        }
        {!isEmpty && !isFetching &&
          <div style={{ opacity: isFetching ? 0.5 : 1 }}>
            <RepoList repos={repos} />
          </div>
        }
      </div>
    )
  }
}

App.propTypes = {
  selectedLanguage: PropTypes.string.isRequired,
  repos: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const {
    selectedLanguage,
    reposByLanguage
  } = state

  const {
    items: repos,
    isFetching,
    lastUpdated
  } = reposByLanguage[selectedLanguage] || {
    items: [],
    isFetching: true
  }

  return {
    repos,
    isFetching,
    lastUpdated,
    selectedLanguage
  }
}

export default connect(mapStateToProps)(App)
