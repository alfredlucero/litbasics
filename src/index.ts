import {html, css, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('my-counter')
export class SimpleGreeting extends LitElement {
  @property() public count = 0;

  static styles = css`
    * {
      font-size: 200%;
    }

    span {
      width: 4rem;
      display: inline-block;
      text-align: center;
    }

    button {
      width: 4rem;
      height: 4rem;
      border: none;
      border-radius: 10px;
      background-color: seagreen;
      color: white;
    }
  `;

  render() {
    return html`
      <button @click="${this.dec}">-</button>
      <span>${this.count}</span>
      <button @click="${this.inc}">+</button>
    `;
  }

  inc() {
    this.count++;
  }

  dec() {
    this.count--;
  }
}

class TodoList extends LitElement {
  static properties = {
    todos: { type: Array },
  };

  static styles = css`
    :host {
      color: blue;
    }

    ul {
      list-style: none;
      padding: 0;
    }

    button {
      background-color: transparent;
      border: none;
    }
  `;

  _changeTodoFinished(e, changedTodo) {
    const eventDetails = { changedTodo, finished: e.target.checked };
    this.dispatchEvent(new CustomEvent('change-todo-finished', { detail: eventDetails }));
  }

  _removeTodo(item) {
    this.dispatchEvent(new CustomEvent('remove-todo', { detail: item }));
  }

  render() {
    if (!this.todos) {
      return html``;
    }

    return html`
      <ol>
        ${this.todos.map(todo => html`
          <li>
            <input
              type="checkbox"
              .checked=${todo.finished}
              @change=${e => this._changeTodoFinished(e, todo)}
            />
            ${todo.text}
            <button @click=${() => this._removeTodo(todo)}>X</button>
          </li>
        `)}
      </ol>
    `;
  }
}
customElements.define('todo-list', TodoList);

const author = 'open-wc';
const homepage = 'https://open-wc.org/';
const footerTemplate = html`
  <footer>Made with love by <a href="${homepage}">${author}</a></footer>
`;

class TodoApp extends LitElement {
  static properties = {
    todos: { type: Array }
  };

  constructor() {
    super();
    this.todos = [
      { text: 'Do A', finished: true },
      { text: 'Do B', finished: false },
      { text: 'Do C', finished: false },
    ];
  }

  _addTodo() {
    const input = this.shadowRoot.getElementById('addTodoInput');
    const text = input.value;
    input.value = '';

    // this.todos.push({ text, finished: false });
    // Trigger a re-render so we can display the new todo item on the screen
    // It's not able to respond to changes triggered by the parent components
    // this.requestUpdate();

    this.todos = [
      ...this.todos,
      { text, finished: false },
    ];
  }

  _removeTodo(e) {
    this.todos = this.todos.filter(todo => todo !== e.detail);
  }

  _changeTodoFinished(e) {
    const { changedTodo, finished } = e.detail;

    this.todos = this.todos.map((todo) => {
      if (todo !== changedTodo) {
        return todo;
      }
      return { ...changedTodo, finished };
    });
  }

  render() {
    const finishedCount = this.todos.filter(e => e.finished).length;
    const unfinishedCount = this.todos.length - finishedCount;

    return html`
      <h1>Todo app</h1>

      <input id="addTodoInput" placeholder="Name" />
      <button @click="${this._addTodo}">Add</button>

      <todo-list 
        .todos=${this.todos}
        @change-todo-finished="${this._changeTodoFinished}"
        @remove-todo="${this._removeTodo}"
      ></todo-list>

      <div>Total finished: ${finishedCount}</div>
      <div>Total unfinished: ${unfinishedCount}</div>

      ${footerTemplate}
    `;
  }
}
customElements.define('todo-app', TodoApp);
