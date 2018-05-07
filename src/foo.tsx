import { h, AnyComponent, Component } from 'preact';

export interface Props {
  email: string
}

export interface State {
  firstName: string,
  lastName: string
}

export default function HOC<P extends Props>(SomeComponent: AnyComponent<any, any>) {
  return class extends Component<P, State> {
    componentDidMount() {
      let { email } = this.props;
      fetch(`/user/${email}`)
        .then((response: any) => response.json())
        .then(({ firstName, lastName }) => this.setState({ firstName, lastName }))
    }

    render(props, state) {
      return <SomeComponent {...props} {...state} />;
    }
  }
}