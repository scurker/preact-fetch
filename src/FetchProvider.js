import { Component } from 'preact';

class FetchProvider extends Component {

  getChildContext() {
    // eslint-disable-next-line no-unused-vars
    let { children, ...context } = this.props;
    return context;
  }

  render({ children }) {
    return children && children[0] || /* istanbul ignore next */ null;
  }

}

export default FetchProvider;