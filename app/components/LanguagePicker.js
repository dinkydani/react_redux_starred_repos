import React, { Component, PropTypes } from 'react'

export default class LanguagePicker extends Component {
  render() {
    const {
      value,
      onChange,
      options
    } = this.props

    return (
      <span>
        <h1>{value}</h1>
        <select
          onChange={e => onChange(e.target.value)}
          value={value}
        >
          {options.map(option =>
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          )}
        </select>
      </span>
    )
  }
}

LanguagePicker.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.string.isRequired
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}
