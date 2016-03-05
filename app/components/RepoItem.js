import React, { PropTypes, Component } from 'react'

import '../sass/repo-item.scss';
import 'font-awesome-webpack';

export default class RepoItem extends Component {
  render() {
    const {
      repo
    } = this.props
    return (
      <div className="repo__item">
        <h2 className="repo__name">{repo.full_name}</h2>
        <p className="repo__owner">{repo.owner.login}</p>
        <p className="repo__stars">
          <span className="fa fa-star"></span>
          {repo.stargazers_count}
        </p>
        <a href={repo.html_url}>Take me there</a>
      </div>
    );
  }
}

RepoItem.propTypes = {
  repo: PropTypes.object.isRequired
}
