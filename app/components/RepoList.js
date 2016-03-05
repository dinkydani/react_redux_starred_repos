import React, { PropTypes, Component } from 'react'
import RepoItem from './RepoItem'

import '../sass/repo-list.scss'

export default class RepoList extends Component {
  render() {
    return (
      <div>
        {this.props.repos.map(repo =>
          <RepoItem
            key={repo.id}
            repo={repo}
          />
        )}
      </div>
    )
  }
}

RepoList.propTypes = {
  repos: PropTypes.array.isRequired
}
