import React, { Component, PropTypes } from 'react'
import '../sass/repo-btns.scss';

export default class Pagination extends Component {
  render() {
    const {
      page,
      onNextClick,
      onPrevClick
    } = this.props

    return (
      <div>
        <p> Current page: {page} </p>
        { page > 1 &&
          <button className="repo__btn" onClick={onPrevClick}>Prev</button>
        }
        <button className="repo__btn" onClick={onNextClick}>Next</button>
      </div>
    )
  }
}

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  onPrevClick: PropTypes.func.isRequired,
  onNextClick: PropTypes.func.isRequired
}
