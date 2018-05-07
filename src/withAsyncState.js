import { h } from 'preact';

export default function withAsyncState({ Component, InitialComponent, LoadingComponent, ErrorComponent }) {
  return props => {
    let { asyncState } = props
      , RenderComponent = null;

    switch(asyncState) {
      case 'initial':
        RenderComponent = InitialComponent || Component;
        break;
      case 'loading':
        RenderComponent = LoadingComponent || Component;
        break;
      case 'error':
        RenderComponent = ErrorComponent || Component;
        break;
      case 'resolved':
        RenderComponent = Component;
        break;
    }

    return h(RenderComponent, props);
  };
}