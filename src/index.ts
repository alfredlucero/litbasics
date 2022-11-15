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


@customElement('lit-rating-element')
export class LitRatingElement extends LitElement {
  @property({ reflect: true }) public rating = 0;
  @property({ reflect: true }) public vote = null;

  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
    }
    button {
      background: transparent;
      border: none;
      cursor: pointer;
    }

    :host([vote=up]) .thumb_up {
      fill: green;
    }

    :host([vote=down]) .thumb_down {
      fill: red;
    }
  `;

  // Renders template under hood into shadow root
  render() {
    return html`
      <button class="thumb_down" .vote=${this.vote} @click=${() => { this.vote = 'down' }}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewbox="0 0 24 24" width="24"><path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"/></svg>
      </button>
      <span class="rating">${this.rating}</span>
      <button class="thumb_up" .vote=${this.vote} @click=${() => { this.vote = 'up' }}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewbox="0 0 24 24" width="24"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>
      </button>
    `;
  }

  willUpdate(changedProps) {
    if (changedProps.has('vote')) {
      const newValue = this.vote;
      const oldValue = changedProps.get('vote');

      if (oldValue === null) {
        if (newValue === 'up') {
          this.rating = 1;
        } else {
          this.rating = -1;
        }
        return;
      }

      if (newValue === 'up') {
        if (oldValue === 'down') {
          this.rating += 2;
        } else {
          this.rating += 1;
        }
      } else if (newValue === 'down') {
        if (oldValue === 'up') {
          this.rating -= 2;
        } else {
          this.rating -= 1;
        }
      }
    }
  }
}
