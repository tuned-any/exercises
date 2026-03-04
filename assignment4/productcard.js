class ProductCard extends HTMLElement {

  /* Observed attributes — triggers */
  static get observedAttributes() {
    return ['name', 'price'];
  }

  constructor() {
    super();
    /* A closed Shadow DOM - Attach */
    this._shadow = this.attachShadow({ mode: 'open' });
  }

  /* Lifecycle: element added to DOM */
  connectedCallback() {
    this._render();
    this._shadow
      .querySelector('.btn-buy')
      .addEventListener('click', () => this._onPurchase());
  }

  
  attributeChangedCallback(attr, oldVal, newVal) {
    if (oldVal !== newVal && this._shadow.innerHTML) this._render();
  }

  /* Shadow DOM content */
  _render() {
    const name  = this.getAttribute('name')  ?? 'Product';
    const price = this.getAttribute('price') ?? '0.00';

    this._shadow.innerHTML = `
      <style>
        /* Styles fully encapsulated */
        :host {
          display: inline-block;
          --accent: #818cf8;
          --card-bg: #16161f;
          --radius: 14px;
        }

        .card {
          background: var(--card-bg);
          border: 1px solid #2a2a3d;
          border-radius: var(--radius);
          width: 280px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 24px rgba(0,0,0,.4);
        }
        
        /* Image slot wrapper */
        .img-wrapper {
          overflow: hidden;
          background: #0d0d14;
        }
        ::slotted(img) {
          width: 100%;
          height: 180px;
          object-fit: cover;
          display: block;
          transition: transform .35s;
        }
        .card:hover ::slotted(img) { transform: scale(1.04); }

        /* Body */
        .body {
          padding: 1.1rem 1.25rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: .6rem;
          flex: 1;
        }

        .name {
          font-size: 1rem;
          font-weight: 700;
          color: #e2e8f0;
          letter-spacing: .01em;
        }

        .desc {
          font-size: .82rem;
          color: #7c8caa;
          line-height: 1.55;
          flex: 1;
        }

        /* Description slot text */
        ::slotted(span) {
          font-size: .82rem;
          color: #7c8caa;
          line-height: 1.55;
        }

        .footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: .5rem;
        }

        .price {
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--accent);
          letter-spacing: -.01em;
        }
        .price::before { content: '$'; font-size: .8em; font-weight: 500; }

        .btn-buy {
          background: var(--accent);
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: .45rem 1rem;
          font-size: .82rem;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: .03em;
          transition: background .15s, transform .1s;
        }
        .btn-buy:hover  { background: #6366f1; }
        .btn-buy:active { transform: scale(.95); }
      </style>

      <div class="card">
        <div class="img-wrapper">
          <slot name="image"></slot>
        </div>
        <div class="body">
          <div class="name">${this._escape(name)}</div>
          <div class="desc">
            <slot name="description"></slot>
          </div>
          <div class="footer">
            <span class="price">${parseFloat(price).toFixed(2)}</span>
            <button class="btn-buy">Buy Now</button>
          </div>
        </div>
      </div>
    `;

    /* Re-attach listener */
    this._shadow
      .querySelector('.btn-buy')
      .addEventListener('click', () => this._onPurchase());
  }

 
  _onPurchase() {
    const name  = this.getAttribute('name')  ?? 'Product';
    const price = this.getAttribute('price') ?? '0.00';

    const evt = new CustomEvent('purchase', {
      bubbles: true,       // bubbles up through the DOM
      composed: true,      // crosses the Shadow DOM boundary
      detail: { name, price: parseFloat(price) }
    });
    this.dispatchEvent(evt);
  }

  
  _escape(str) {
    return str.replace(/[&<>"']/g, c =>
      ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
}

/* Register the custom element */
customElements.define('product-card', ProductCard);

/* Listen for purchase events on the document */
const log = document.getElementById('event-log');
document.addEventListener('purchase', e => {
  const { name, price } = e.detail;
  log.innerHTML =
    `<span>New purchase</span>  — <b style="color:#e2e8f0">${name}</b> `
  + `added to cart for <span>$${price.toFixed(2)}</span> `;
});