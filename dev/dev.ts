import { Effect } from 'effect';

import {
  children,
  fetchJSON,
  mount,
  navigate,
  router,
  tag,
  text,
  useSignal,
  withData,
  withFallback,
  withSignal,
} from '../src';

const Home = () =>
  tag(
    'main',
    children(
      tag('h1', children(text('Home'))),
      tag(
        'button',
        { onClick: navigate('/about') },
        children(text('Go to About'))
      ),
      tag(
        'button',
        { onClick: navigate('/users/1') },
        children(text('Go to User 1'))
      ),
      tag(
        'button',
        { onClick: navigate('/posts?userId=1') },
        children(text('Go to Posts'))
      )
    )
  );

const About = () =>
  tag(
    'main',
    children(
      tag('h1', children(text('About'))),
      tag('button', { onClick: navigate('/') }, children(text('Go to Home'))),
      tag(
        'button',
        { onClick: navigate('/users/1') },
        children(text('Go to User 1'))
      ),
      tag(
        'button',
        { onClick: navigate('/posts?userId=1') },
        children(text('Go to Posts'))
      )
    )
  );

const fetchUser = (id: number) =>
  fetchJSON<{ name: string }>(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );

const renderUser = (user: { name: string }) =>
  tag(
    'h1',
    {
      onClick: Effect.sync(() => console.log('Clicked!')),
      style: undefined,
    },
    children(text(`Hi, ${user.name}`))
  );

const UserProfile = withFallback(withData(fetchUser, renderUser), {
  loading: () => text('Loading...'),
  error: (err) => text(`Oops: ${err._tag}`),
});

const fetchPosts = (userId: number) =>
  fetchJSON<{ title: string }[]>(
    `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
  );

const renderPosts = (posts: { title: string }[]) =>
  tag(
    'div',
    children(...posts.map((post) => tag('p', children(text(post.title)))))
  );

const Posts = withFallback(withData(fetchPosts, renderPosts), {
  loading: () => text('Loading...'),
  error: (err) => text(`Oops: ${err._tag}`),
});

const count = useSignal(0);

const Counter = withSignal(count, (value) =>
  tag(
    'div',
    children(
      tag('h1', children(text(`Count: ${value}`))),
      tag(
        'button',
        {
          onClick: count.update((value) => value - 1),
        },
        children(text('-'))
      ),
      tag(
        'button',
        {
          onClick: count.update((value) => value + 1),
        },
        children(text('+'))
      )
    )
  )
);

const App = router({
  '/': Home,
  '/about': About,
  '/users/:userId': ({ path: { userId } }) => UserProfile(Number(userId)),
  '/posts': ({ search }) => Posts(Number(search.get('userId') || 0)),
  '/counter': () => Counter,
});

Effect.runPromise(mount(App, '#root'));
