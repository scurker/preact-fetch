import { h } from 'preact';
import { FetchProvider, withFetch, withAsyncState } from '../';

const EmptyComponent = () => null;

// withFetch Options
let ComponentA = withFetch('https://foo.com')(EmptyComponent);
let ComponentB = withFetch(props => `https://foo.com/${props.id}`)(EmptyComponent);
let ComponentC = withFetch('https://foo.com', { mapDataToProps: props => ({}) })(EmptyComponent);
let ComponentD = withFetch('https://foo.com', { mapContextToProps: props => ({}) })(EmptyComponent);
let ComponentE = withFetch('https://foo.com', { useCache: true })(EmptyComponent);
// <ComponentA />
// <ComponentB />
// <ComponentC />
// <ComponentD />
// <ComponentE />

let ComponentWithProps = withFetch<{ foo: string }>('https://foo.com')(EmptyComponent);
// let ComponentF = <ComponentWithProps foo="bar" />;

// With RequestInitOptions
withFetch('', { method: 'POST' })(EmptyComponent);

// withAsyncComponent options
withAsyncState({ Component: EmptyComponent });
withAsyncState({ InitialComponent: EmptyComponent });
withAsyncState({ LoadingComponent: EmptyComponent });
withAsyncState({ ErrorComponent: EmptyComponent });