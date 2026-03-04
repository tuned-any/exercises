class TodoList extends HTMLElement {
  #items = [];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        ul  { padding: 0; margin: 0 0 8px; list-style: none; }
        li  { padding: 4px 0; }
        div { display: flex; gap: 6px; }
      </style>
      <ul id="ul"></ul>
      <div>
        <input id="txt" type="text" placeholder="New item…" />
        <button id="btn">Add</button>
      </div>
    `;

    this.shadowRoot.getElementById('btn').addEventListener('click', () => {
      const input = this.shadowRoot.getElementById('txt');
      const text  = input.value.trim();
      if (!text) return;

      this.#items.push(text);
      input.value = '';
      this.#render();
      this.#emit();
    });
  }

  #render() {
    const ul = this.shadowRoot.getElementById('ul');
    ul.innerHTML = this.#items
      .map(item => `<li>${item}</li>`)
      .join('');
  }

  #emit() {
    this.dispatchEvent(new CustomEvent('listChanged', {
      bubbles : true,
      composed: true,
      detail  : { items: [...this.#items] }
    }));
  }
}

customElements.define('todo-list', TodoList);

document.querySelector('todo-list').addEventListener('listChanged', e => {
  document.getElementById('log').textContent =
    'listChanged - New item: ' + JSON.stringify(e.detail.items);
});