import {html, css, LitElement, PropertyValues} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { classMap } from 'lit/directives/class-map.js';

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

/** Lit React Parallels */

// Public reactive properties similar to React's props and state but mutable, public API that is accessed and set by consumers of the component
class LitProperty extends LitElement {
  @property() name = 'There';
}

// Internal reactive state similar to React's state but mutable, meant for private internal state that is typically accessed from within the component or subclasses
class LitState extends LitElement {
  @state() name = 'There';
}

// Constructor lifecycle is invoked by document.createElement, document.innerHTML, new ComponentClass(), customElements.define
class LitConstructor extends LitElement {
  @property({ type: Number }) counter = 0;
  private _privateProp = 'private';
}

// Lit equivalent of render is also render but with html`` usage
// Can return renderable result i.e. TemplateResult, string, etc.
// render() should be a pure function
// will render to whichever node createRenderRoot() returns (ShadowRoot by default)

// componentDidMount is similar to the combo of both Lit's firstUpdated and connectedCallback lifecycle callbacks
// firstUpdated = called first time component's template is rendered into the component's root; only called if element is connected and not called via doucment.createElement until node is appended into DOM tree
// - great place to perform component setup that requires DOM rendered by component
// - changes to reactive properties in firstUpdated will cause a re-render, though the browser will typically batch the changes into the same frame
/*
  firstUpdated() {
    this._chart = new Chart(this.chartEl, {});
  }
*/
// connectedCallback = called whenever custom element is inserted into the DOM tree
// - when custom elements detached from DOM, they aren't destoryed and thus can be connected multiple times; firstUpdated won't be called again
// - useful for re-initializing the DOM or re-attaching event listeners cleaned up on disconnect
/*
  connectedCallback() {
    super.connectedCallback();
    this.window.addEventListener('resize', this.boundOnResize);
  }
*/

// componentDidUpdate
// lit equivalent is updated
// - called on initial render too
/*
  updated(prevProps: PropertyValues<this>) {
    if (prevProps.has('title')) {
      this._chart.setTitle(this.title);
    }
  }
*/

// componentWillUnmount
// lit equivalent is disconnectedCallback
// - when custom elements detached from DOM, the component is not destroyed
// - called after element is removed from the tree
// - DOM inside root is still attached to root's subtree
// - useful for cleaning up event listeners and leaky references so the browser can garbage collect the component
/*
  disconnectedCallback() {
    super.disconnectedCallback();
    this.window.removeEventListener('resize', this.boundOnResize);
  }
*/

// Arrange Lit methods in order of lifecycle call: properties, constructor, render

@customElement('lit-clock')
class LitClock extends LitElement {
  @state() // declares internal reactive prop
  private date = new Date(); // initialization
  private timerId = -1 as unknown as ReturnType<typeof setTimeout>;

  connectedCallback() {
    super.connectedCallback();
    this.timerId = setInterval(() => this.tick(), 1000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this.timerId);
  }

  render() {
    return html`
      <div>
        <h1>Hello, World!</h1>
        <h2>It is ${this.date.toLocaleTimeString()}.</h2>
      </div>
    `;
  }

  tick() {
    this.date = new Date();
  }
}

// Translate React Hook concepts to Lit
// Reactive controllers = sharing stateful logic, splitting up components, hooking into update lifecycle of an element
// - object interface that can hook into the update lifecyle of a controller host like LitElement
// componentDidMount to LitElement's connectedCallback and controller's hostConnected
// componentWillUnmount to LitElement's disconnectedCallback and controller's hostDisconnected
import { ReactiveController, ReactiveControllerHost } from 'lit';

export class ClockController implements ReactiveController {
  private readonly host: ReactiveControllerHost;
  private interval = 0 as unknown as ReturnType<typeof setTimeout>;
  date = new Date();

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    host.addController(this);
  }

  hostConnected() {
    this.interval = setInterval(() => this.tick(), 1000);
  }

  private tick() {
    this.date = new Date();
    // Since the date is set on the controller, the host needs to be told to run its update lifecycle or else the host component will not update
    this.host.requestUpdate();
  }

  hostDisconnected() {
    clearInterval(this.interval);
  }
}

@customElement('lit-controller-clock')
class LitControllerClock extends LitElement {
  private readonly clock = new ClockController(this); // Instantiate with controller host aka the element component and use controller in render method

  render() {
    return html`
      <div>
        <h1>Hello, world!</h1>
        <h2>It is ${this.clock.date.toLocaleTimeString()}.</h2>
      </div>
    `;
  }
}

// Slots enable composition by allowing you to nest components
// - analogous to React's props.children
// - children are HTMLElements attached to slots; the attachment is called projection
@customElement('slot-test')
export class SlotTest extends LitElement {
  render() {
    return html`
      <article>
        <slot></slot>
      </article>
    `;
  }
}

@customElement('slot-multiple')
export class SlotMultiple extends LitElement {
  render() {
    return html`
      <article>
        <header>
          <slot name="headerChildren"></slot>
        </header>
        <section>
          <slot name="sectionChildren"></slot>
        </section>
        <slot name="slotWithDefault">
          <p>This will not render when children are attached to this slot!</p>
        </slot>
      </article>
    `
  }
}

@customElement('react-counter-button')
export class ReactCounterButton extends LitElement {
  @property({ type: Number }) step: number = 0;

  onClick() {
    // Browser events bubble up from children to parent elements
    // React passes state in the opposite direction so it's uncommon to dispatch and listen to events
    const event = new CustomEvent('update-counter', {
      bubbles: true,
      detail: {
        step: this.step,
      }
    });

    this.dispatchEvent(event);
  }

  render() {
    const label = this.step < 0 ? `- ${-1 * this.step}` : `+ ${this.step}`;

    return html`
      <button @click=${this.onClick}>${label}</button>
    `
  }
}

@customElement('react-counter')
export class ReactCounter extends LitElement {
  // Reactive property to update component when value is changed
  @property({ type: Number }) count = 0;

  // Binded to @update-counter event listener
  addToCounter(e: CustomEvent<{step: number }>) {
    // Get step from detail of event or via @query
    this.count += e.detail.step;
  }

  render() {
    return html`
      <div @update-counter="${this.addToCounter}">
        <h3>&Sigma; ${this.count}</h3>
        <react-counter-button step="-1"></react-counter-button>
        <react-counter-button step="1"></react-counter-button>
      </div>
    `;
  }
}

@customElement('styles-test')
class StylesTest extends LitElement {
  @property({ type: String })
  color = '#000'

  render() {
    const headerStyle = styleMap({
      color: 'orange',
      'border-color': this.color,
      'border-width': '1px',
      'border-style': 'solid'
    });

    return html`
      <div>
        <h1 style="${headerStyle}">This text is orange. This div has a border color of ${this.color}</h1>
        <input type="color" @input=${e => (this.color = e.target.value)} />
      </div>
    `;
  }
}

// Advanced React vs. Lit topics

// Lit-html doesn't include a conventional virtual DOM that diffs each individual node
// Uses performance features part of tagged template literal spec; string arrays passed into the function have the same pointer and browser does not
// recreate a new strings array on each function invocation; most of diffing done in browser's C++
// JSX doesn't run in the browser but uses a preprocessor to convert JSX to JavaScript function calls typically via Babel
// With tagged template literals that can run in the browser without transpilation or preprocessor - all you need is an HTML file, an ES module script, and a server

// React uses a synthetic event system; provides a camelCase event listener equivalent for each type of node; doesn't have method to define an event listener for custom event and developers
// must use a ref and imperatively apply a listener
// vs. Lit accesses DOM and uses native events and adding event listeners is like @event-name=${eventNameListener}, less runtime parsing

// LitElement uses custom elements to package its components
// - native to browser and does not require any tooling
// - fit into every browser API from innerHTML and document.createElement to querySelector
// - can be used across frameworks
// - lazily registered with customElements.define and "hydrate" DOM
// cons
// - can't create custom element without defining a class (no JSX-like functional components)
// - must contain a closing tag
// - introduces an extra node to DOM tree which may cause layout issues
// - must be registered via JavaScript
// passing data to custom elements
// - not only strings, can do @property({ attribute: false }) data = { ... }

// Reactive controllers are most like custom hooks
// Lit uses a private class property for passing non-renderable data between callbacks and effects vs. useEffect and useCallback

// It's possible to use Redux, MobX, state management library alongside Lit because components are created in the browser scope

// Shadow DOM to encapsulate sytles and DOM within a custom element
// Shadow roows generate a shadow tree separate from the main document tree; styles scoped to this document and don't leak
// new selectors such as :host, :host(:hover), slot[name="title"] (can only style directly slotted elements and not children of those elements)

// Can share styles between components in form of CSSTemplateResults via css template tags
// i.e. export const bodyCss = css``;
// static get styles = [ bodyCss ];

// Can tackle theming with web components using shadow DOM by exposing a style API via CSS Custom properties
// .some-class { border-color: var(---theme-primary, default value )}
// html { --theme-primary: #F00; }
// html[dark] { --theme-primary: #F88; };
// you can disable shadow DOM by overriding createRenderRoot to return this and render component's template to custom element but we lose the encapsulation

// Browser support
// IE 11 needs polyfills ~33KB
// - can serve two different bundles for IE11 and one for modern browsers
// - serving ES6 is faster and will serve most clients; transpiled ES5 significantly increases bundle size
// - best of both worlds with IE 11 support and no slowdown on modern browsers


const ORANGE = css`orange`;

@customElement('css-test')
export class CssTest extends LitElement {
  // Styles are scoped with Shadow DOM by default
  // Can separate styles into their own files with css
  // CSS template tag parsed once per class vs per instance and compatible with CSS Custom properties polyfill
  // CSS Custom properties can penetrate Lit style scoping
  // Using link tag is not recommended as it may cause a flash of unstyled content; not recommended to inline style tags in templates as they will be parsed per component instance instead of per class
  static styles = [
    css`
      #orange {
        color: ${ORANGE};
      }

      #purple {
        color: purple;
      }
    `
  ];

  render() {
    return html`
      <div>
        <h1 id="orange">This text is orange</h1>
        <h1 id="purple">This text is purple</h1>
      </div>
    `;
  }
}

@customElement('story-card')
export class StoryCard extends LitElement {
  static styles = css`
    #media {
      height: 100%;
    }

    #media ::slotted(*) {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    #content {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      padding: 48px;
      font-family: sans-serif;
      color; white;
      font-size: 24px;
    }
    #content > slot::slotted(*) {
      margin: 0;
    }
  `;
      
  render() {
    return html`
      <div id="media">
        <slot name="media"></slot>
      </div>
      <div id="content">
        <slot></slot>
      </div>
    `;
  }
}

@customElement('story-viewer')
export class StoryViewer extends LitElement {
  @property({ type: Number }) index: number = 0;

  static styles = css`
    :host {
      display: block;
      position: relative;
      width: 300px;
      height: 800px;
    }

    ::slotted(*) {
      position: absolute;
      width: 100%;
      height: calc(100% - 20px);
    }

    svg {
      position: absolute;
      top: calc(50% - 25px);
      height: 50px;
      cursor: pointer;
    }

    #next {
      right: 0;
    }

    #progress {
      position: relative;
      top: calc(100% - 20px);
      height: 20px;
      width: 50%;
      margin: 0 auto;
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: 1fr;
      grid-gap: 10px;
      align-content: center;
    }
    #progress > div {
      background: grey;
      height: 4px;
      transition: background 0.3s linear;
      cursor: pointer;
    }
    #progress > div.watched {
      background: white;
    }
  `;

  render() {
    return html`
      <slot></slot>

      <svg id="prev" viewBox="0 0 10 10" @click=${() => this.previous()}>
        <path d="M 6 2 L 4 5 L 6 8" stroke="#fff" fill="none" />
      </svg>
      <svg id="next" viewBox="0 0 10 10" @click=${() => this.next()}>
        <path d="M 4 2 L 6 5 L 4 8" stroke="#fff" fill="none" />
      </svg>

      <div id="progress">
        ${Array.from(this.children).map((_, i) => html`
          <div class=${classMap({ watched: i <= this.index})} @click=${() => this.index = i}></div>
        `)}
      </div>
    `;
  }

  update(changedProperties: PropertyValues) {
    const width = this.clientWidth;
    Array.from(this.children).forEach((el: Element, i) => {
      const x = (i - this.index) * width;
      (el as HTMLElement).style.transform = `translate3d(${x}px,0,0)`;
    });
    super.update(changedProperties);
  }

  next() {
    this.index = Math.max(0, Math.min(this.children.length - 1, this.index + 1));
  }

  previous() {
    this.index = Math.max(0, Math.min(this.children.length - 1, this.index - 1));
  }
}