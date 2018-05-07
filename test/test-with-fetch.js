import { h } from 'preact';
import test from 'ava';
import sinon from 'sinon';
import { shallow, deep } from 'preact-render-spy';
import { withFetch, FetchProvider } from '../src';

const NullComponent = () => null;
const EmptyComponent = () => <div></div>;
let sandbox;
let fetchStub;

test.beforeEach(() => {
  sandbox = sinon.createSandbox();
  if(!global.fetch) {
    global.fetch = function() {};
  }
  fetchStub = sandbox.stub(global, 'fetch');
  fetchStub.returns(Promise.resolve({ json() { return {}; } }));
});

test.afterEach.always(() => {
  fetchStub.restore();
  sandbox.reset();
});

test.serial('should fetch url when rendered', t => {
  let Component = withFetch('https://foo.com')(NullComponent);

  shallow(<Component />);

  t.is(global.fetch.calledOnce, true, 'fetch was not called exactly once');
  t.is(global.fetch.calledWith('https://foo.com'), true, 'fetch was not called with "https://foo.com"');
});

test.serial('should fetch url with props when rendered', t => {
  let Component = withFetch(props => `https://foo.com/${props.id}`)(NullComponent);

  shallow(<Component id="1" />);

  t.is(global.fetch.calledOnce, true, 'fetch was not called exactly once');
  t.is(global.fetch.calledWith('https://foo.com/1'), true, 'fetch was not called with "https://foo.com/1"');
});

test.serial('should fetch again when props change', async t => {
  let Component = withFetch(props => `https://foo.com/${props.id}`)(NullComponent)
    , context = shallow(<Component id="1" />);

  await wait(100);
  context.render(<Component id="2" />);

  t.is(global.fetch.calledTwice, true, 'fetch was not called exactly twice');
  t.is(global.fetch.secondCall.args[0], 'https://foo.com/2', 'fetch was not called with "https://foo.com/2"');
});

test.serial('should not fetch again when next props are the same', async t => {
  let Component = withFetch(props => `https://foo.com/${props.id}`)(NullComponent)
    , context = shallow(<Component id="1" />);

  await wait(100);
  context.render(<Component id="1" />);

  t.is(global.fetch.calledOnce, true, 'fetch was not called exactly once');
});

test.serial('should only fetch once when component is rendered with same url and useCache', async t => {
  fetchStub.returns(Promise.resolve({ json() { return { foo: 'bar' }; } }));

  let RenderComponent = props => <div>{props.foo}</div>
    , Component = withFetch('https://foo.com', { useCache: true })(RenderComponent)
    , context = deep(<Component />);

  await wait(1);
  let firstRender = context.text();
  await wait(1);
  context.render(NullComponent);
  await wait(1);
  let secondRender = context.render(<Component />);
  await wait(1);

  t.is(global.fetch.calledOnce, true, 'fetch was not called exactly once');
  t.is(firstRender, 'bar', 'firstRender is not set to "bar"');
  t.is(secondRender.text(), 'bar', 'secondRender is not set to "bar"');
});

test.serial('should set async state to initial', t => {
  let Component = withFetch('https://foo.com')(EmptyComponent)
    , context = shallow(<Component />).output();

  t.is(context.attributes.asyncState, 'initial', 'asyncState not set to "initial"');
});

test.serial('should set async state to loading', async t => {
  fetchStub.returns(wait(10000));

  let Component = withFetch('https://foo.com')(EmptyComponent)
    , context = shallow(<Component />);

  await wait(100);

  t.is(context.output().attributes.asyncState, 'loading', 'asyncState not set to "loading"');
});

test.serial('should set async state to resolved', async t => {
  fetchStub.returns(Promise.resolve({ json() {} }));

  let Component = withFetch('https://foo.com')(EmptyComponent)
    , context = shallow(<Component />);

  await wait(100);

  t.is(context.output().attributes.asyncState, 'resolved', 'asyncState not set to "resolved"');
});

test.serial('should set async state to error', async t => {
  fetchStub.throws();

  let Component = withFetch('https://foo.com')(EmptyComponent)
    , context = shallow(<Component />);

  await wait(1);

  t.is(context.output().attributes.asyncState, 'error', 'asyncState not set to "error"');
});

test.serial('should render resolved data', async t => {
  fetchStub.returns(Promise.resolve({ json() { return { foo: 'bar' }; }}));

  let RenderComponent = props => <div>{props.foo}</div>
    , Component = withFetch('https://foo.com')(RenderComponent)
    , context = deep(<Component />);

  await wait(1);

  t.is(context.text(), 'bar');
});

test.serial('should map resolved data to new props', async t => {
  fetchStub.returns(Promise.resolve({ json() { return { foo: 'bar' }; }}));

  let RenderComponent = props => <div>{props.foobar}</div>
    , mapDataToProps = props => ({ foobar: props.foo })
    , Component = withFetch('https://foo.com', { mapDataToProps })(RenderComponent)
    , context = deep(<Component />);

  await wait(1);

  t.is(context.text(), 'bar');
});

test.serial('should render data from context', t => {
  let RenderComponent = props => <div>{props.foo}</div>
    , Component = withFetch('https://foo.com')(RenderComponent)
    , context = deep(<FetchProvider foo="bar"><Component /></FetchProvider>, { depth: 2 }).output();

  t.is(context.attributes.asyncState, 'initial', 'asyncState not set to "initial"');
  t.is(context.attributes.foo, 'bar', 'context was not passed to component');
});

test.serial('should not have initial data if no context data provided', t => {
  let RenderComponent = props => <div>{props.foo}</div>
    , Component = withFetch('https://foo.com')(RenderComponent)
    , context = deep(<FetchProvider><Component /></FetchProvider>, { depth: 2 }).output();

  t.deepEqual(context.attributes, { asyncState: 'initial' }, 'asyncState not set to "initial"');
});

test.serial('should map context data to new props', t => {
  let RenderComponent = props => <div>{props.foobar}</div>
    , mapContextToProps = props => ({ foobar: props.foo })
    , Component = withFetch('https://foo.com', { mapContextToProps })(RenderComponent)
    , context = deep(<FetchProvider foo="bar"><Component /></FetchProvider>, { depth: 2 }).output();

  t.deepEqual(context.attributes.asyncState, 'initial', 'asyncState not set to "initial"');
  t.is(context.attributes.foobar, 'bar', 'context was not mapped to component');
});