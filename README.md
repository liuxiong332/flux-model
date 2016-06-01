## Flux-Reducer

The flux-like data flow for JavaScript apps.

It helps you write applications that behave consistently, run in different environments (client, server and native), have the good encapsulation and decouple with each other.

### Installation

To install the `flux-reducer`with `npm`:

```sh
npm install --save flux-reducer
```

### Tutorials

Now let's talk with the todo-list as a example.

First, we need create the `Todo` reducer that can receive the message relative to 'Todo'.

```js
import { Reducer } from 'flux-reducer';

class TodoReducer extends Reducer({
  name: '',
  detail: '',
  isCompleted: false,
}) {
  changeName(name) {
    this.trigger(this.set('name', name));
  }
};
```

The UI can send the 'changeName' to `TodoReducer` to change the `Todo` name. The `trigger` will broadcast the new reducer to all subscribers.

Then, we need create `Todos` reducer that can respond to `Todo` collection related actions.

```js
import { ArrayReducer } from 'flux-reducer';

class TodosReducer extends ArrayReducer {
  constructor() {
    super(...arguments);
    this.monitorAllValues();
  }

  addTodo(todo) {
    this.trigger(this.push(new TodoReducer(todo)));
  }
}
```

We need invoke `TodosReducer`'s' `addTodo` method to add the new `Todo` instance.

Now, we can subscribe to `TodosReducer` to get the new state.

```js
let todosReducer = new TodosReducer;
todosReducer.subscribe((newReducer) => {
  console.log('the todos have changed.');
});

todosReducer.addTodo({
  name: 'new todo',
});
```

Invoke this code segment, the log information will show in the terminal.
