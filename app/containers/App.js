import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {
  fetchRepos,
  fetchReposIfNeeded,
  invalidateRepos,
  selectLanguage,
  prevPage,
  nextPage,
  resetPage
} from '../actions'

import RepoList from '../components/RepoList'
import LanguagePicker from '../components/LanguagePicker'
import Pagination from '../components/Pagination'

import '../sass/repo-app.scss'

class App extends Component {
  constructor(props) {
    super(props)
    this.handleRefreshClick = this.handleRefreshClick.bind(this)
    this.handleLanguageChange = this.handleLanguageChange.bind(this)
    this.onPrevClick = this.onPrevClick.bind(this)
    this.onNextClick = this.onNextClick.bind(this)
  }

  componentDidMount() {
    const { dispatch, selectedLanguage } = this.props
    dispatch(fetchReposIfNeeded(selectedLanguage))
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, selectedLanguage, page } = nextProps
    if (nextProps.selectedLanguage !== this.props.selectedLanguage) {
      dispatch(resetPage())
      dispatch(fetchReposIfNeeded(selectedLanguage))
    } else if (nextProps.page !== this.props.page) {
      dispatch(fetchRepos({ language: selectedLanguage, page }))
    }
  }

  handleRefreshClick(e) {
    e.preventDefault()
    const { dispatch, selectedLanguage } = this.props
    dispatch(invalidateRepos(selectedLanguage))
    dispatch(fetchReposIfNeeded(selectedLanguage))
  }

  handleLanguageChange(language) {
    const { dispatch } = this.props
    dispatch(selectLanguage(language))
  }

  onPrevClick() {
    const { dispatch } = this.props
    dispatch(prevPage())
  }

  onNextClick() {
    const { dispatch } = this.props
    dispatch(nextPage())
  }

  render() {
    const {
      repos,
      selectedLanguage,
      isFetching,
      lastUpdated,
      page
    } = this.props
    const isEmpty = repos.length === 0
    return (
      <div className="repo__app">
        <h1>Most Starred Github Repos</h1>
        <LanguagePicker
          value={selectedLanguage}
          onChange={this.handleLanguageChange}
          options={['javascript', 'python', 'go']}
        />
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
        <Pagination
          page={page}
          onPrevClick={this.onPrevClick}
          onNextClick={this.onNextClick}
        />
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
    reposByLanguage,
    pagination
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
    selectedLanguage,
    page: pagination.page
  }
}

export default connect(mapStateToProps)(App)
