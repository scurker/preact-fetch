import { h, Component } from 'preact';

const fetchJSON = (url, options) => fetch(url, options).then(response => response.json());
const propsToURL = (url, props) => typeof url === 'function' ? url(props) : url;
const cache = new Map();

function withFetch(url, options = {}) {
  const { useCache, mapDataToProps, mapContextToProps, ...fetchOptions } = { useCache: false, ...options };

  return WrappedComponent => {
    return class AsyncResolve extends Component {

      constructor(props) {
        super(props);
        this.state = {
          data: {},
          state: 'initial'
        };
      }

      resolveAsync = async props => {
        let { ...rest } = props
          , data = {};

        let resolvedURL = propsToURL(url, rest);

        if(useCache && cache.has(resolvedURL)) {
          data = cache.get(resolvedURL);
        } else {
          this.setState(() => ({ state: 'loading' }));
          try {
            data = await fetchJSON(resolvedURL, fetchOptions);
            if(typeof mapDataToProps === 'function') {
              data = mapDataToProps(data);
            }
          } catch (ex) {
            this.setState(() => ({ state: 'error' }));
            return;
          }
        }

        this.setState(() => {
          useCache && cache.set(resolvedURL, data);
          return {
            data,
            state: 'resolved'
          };
        });
      }

      componentWillMount() {
        let { ...initialData } = this.context;
        if(initialData && Object.keys(initialData).length) {
          if(typeof mapContextToProps === 'function') {
            initialData = mapContextToProps(initialData);
          }
          this.setState(() => ({ data: initialData }));
        }
      }

      componentDidMount() {
        this.resolveAsync(this.props);
      }

      componentWillReceiveProps(nextProps) {
        let [ current, next ] = [ propsToURL(url, this.props), propsToURL(url, nextProps) ];

        if(current !== next) {
          this.resolveAsync(nextProps);
        }
      }

      render(props, { data, state: asyncState }) {
        return h(WrappedComponent, { asyncState, ...data, ...props });
      }

    };
  };
}

export default withFetch;