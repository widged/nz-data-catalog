/* jshint esnext: true */

import React             from 'react';

let {Component} = React;

export default class SearchInput extends Component {

  constructor(props) {
    super(props);
    this.state   = {searchText: ''};
    this.bounded = {onTextChange: this.onTextChange.bind(this)};
  }

  onTextChange(event) {
    const {onChange} = this.props;
    var searchText = event.target.value;
    this.setState({
      searchText: searchText
    });
    onChange(searchText);
  }

  render() {
    const {onTextChange} = this.bounded;
    const {searchText} = this.state;
    return <wg-search-input>
    <div className="search-wrapper">
      <span className="search-icon">⚲</span>
      <input type="search" value={searchText} className="search-field" placeholder="Search" onChange={onTextChange} />
    </div>
    </wg-search-input>
  }
}
