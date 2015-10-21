/* jshint esnext: true */

import React             from 'react';
import ReactDOM          from 'react-dom';
import ViewportObserver  from '../../lib/viewport-observer/ViewportObserver';
import {closestParent}   from '../../lib/dom-utils/DomUtils';

let {Component,  PropTypes} = React;
let {findDOMNode} = ReactDOM;

export default class LazyLoader extends Component {
  constructor(props) {
    super(props);
    this.state = {  visible: false, viewportObserver: new ViewportObserver() }
    this.onWindowScroll = this.onWindowScroll.bind(this);
  }
  componentDidMount() {
    const {viewportObserver} = this.state;
    const viewport = closestParent(findDOMNode(this), '.lazyload-viewport') || window;
    viewportObserver.viewport(viewport).onChange(this.onWindowScroll);
    this.onWindowScroll();
  }
  componentDidUpdate() {
    if (!this.state.visible) this.onWindowScroll();
  }
  componentWillUnmount() {
    const {viewportObserver} = this.state;
    viewportObserver.stopListening();
  }

  onWindowScroll() {
    const { viewportObserver }     = this.state;
    const { threshold, onVisible } = this.props;
    if (viewportObserver.isTopVisible(findDOMNode(this), threshold)) {
      onVisible();
      viewportObserver.stopListening();
    }
  }
  render() {
    return (
      <wg-lazy-load>{this.props.children}</wg-lazy-load>
    );
  }
}
LazyLoader.propTypes = {
  height: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
  threshold: PropTypes.number
}
LazyLoader.defaultProps = {
  threshold: 0,
}
