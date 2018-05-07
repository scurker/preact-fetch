import { AnyComponent, ComponentFactory } from 'preact';

export = withFetch;
export as namespace withFetch;

declare namespace withFetch {

  type PropsToURL = (props: any) => string;
  type FetchURL = string | PropsToURL;
  type FetchState = 'initial' | 'loading' | 'error' | 'resolved';

  interface ComponentProps {
    asyncState: FetchState
  }

  interface FetchOptions extends RequestInit {
    useCache?: boolean,
    mapDataToProps?: (props: any) => object,
    mapContextToProps?: (props: any) => object
  }

  interface AsyncStateProps {
    Component?: AnyComponent<any, any>,
    InitialComponent?: AnyComponent<any, any>,
    LoadingComponent?: AnyComponent<any, any>,
    ErrorComponent?: AnyComponent<any, any>
  }

  function FetchProvider(props: any): AnyComponent<any, any>;
  function withAsyncState(args: AsyncStateProps): AnyComponent<{}, any>;
  function withFetch<Response>(url: FetchURL, options?: FetchOptions): (Component: AnyComponent<ComponentProps, any>) => AnyComponent<Response>;

}