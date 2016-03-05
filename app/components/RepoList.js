import React, { PropTypes, Component } from 'react'

export default class RepoList extends Component {
  render() {
    return (
      <ul>
        {this.props.repos.map(repo =>
          <li key={repo.id}>
            {repo.full_name}
          </li>
        )}
      </ul>
    )
  }
}

RepoList.propTypes = {
  repos: PropTypes.array.isRequired
}
