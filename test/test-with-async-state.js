import { h } from 'preact';
import test from 'ava';
import { deep } from 'preact-render-spy';
import { withAsyncState } from '../src';

const InitialComponent = () => <div>Initial</div>;
const LoadingComponent = () => <div>Loading</div>;
const ErrorComponent = () => <div>Error</div>;
const Component = () => <div>Resolved</div>;

test('should render initial component', t => {
  const RenderComponent = withAsyncState({ InitialComponent })
      , context = deep(<RenderComponent asyncState="initial" />);
  t.is(context.find('div').text(), 'Initial');
});

test('should render loading component', t => {
  const RenderComponent = withAsyncState({ LoadingComponent })
      , context = deep(<RenderComponent asyncState="loading" />);
  t.is(context.find('div').text(), 'Loading');
});

test('should render error component', t => {
  const RenderComponent = withAsyncState({ ErrorComponent })
      , context = deep(<RenderComponent asyncState="error" />);
  t.is(context.find('div').text(), 'Error');
});

test('should render default component when no component is provided for asyncState', t => {
  const RenderComponent = withAsyncState({ Component })
      , initialContext = deep(<RenderComponent asyncState="initial" />)
      , loadingContext = deep(<RenderComponent asyncState="loading" />)
      , errorContext = deep(<RenderComponent asyncState="error" />);

  t.is(initialContext.find('div').text(), 'Resolved');
  t.is(loadingContext.find('div').text(), 'Resolved');
  t.is(errorContext.find('div').text(), 'Resolved');
});

test('should render component', t => {
  const RenderComponent = withAsyncState({ Component })
      , context = deep(<RenderComponent asyncState="resolved" />);
  t.is(context.text(), 'Resolved');
});

test('should pass through props', t => {
  const RenderComponent = withAsyncState({ Component: props => <div foo={props.foo}>With Props</div> })
      , context = deep(<RenderComponent foo="bar" asyncState="resolved" />);

  t.is(context.attr('foo'), 'bar');
});