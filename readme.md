# preact-fetch

> A Higher-Order Component (HOC) helper for creating declarative components with fetch.

### Installation

With [npm](https://www.npmjs.com/):

```sh
npm install preact-fetch
```

With [yarn](https://yarnpkg.com):

```sh
yarn add preact-fetch
```

### Usage

```
import { h } from 'preact';
import { withFetch } from 'preact-fetch';

function RepoStars({ full_name, html_url, stargazers_count }) {
  return (
    <div>
      <a href={html_url}>{full_name} 🌟<strong>{stargazers_count}</strong></a>
    </div>
  );
}

function Repos({ items = [] }) {
  return (
    <div>
      <ul>
        {items.map(repo => (
          <RepoStars {...repo} />
        ))}
      </ul>
    </div>
  );
}

const fetchURL = props => `https://api.github.com/search/repositories?q=${props.query}`;
export default withFetch(fetchURL)(Repos);
```

```
<Repos query="preact" />
<Repos query="react" />
```