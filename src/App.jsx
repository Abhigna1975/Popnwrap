import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Link, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { categories } from './ui/catalog';
import './ui/shop.css';

const allProducts = categories.flatMap((c) => c.products.map((p) => ({ ...p, category: c.slug })));
const byId = Object.fromEntries(allProducts.map((p) => [p.id, p]));
const money = (n) => `$${n.toFixed(2)}`;

function useCart() {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('popnwrap-cart')) || {}; } catch { return {}; }
  });
  useEffect(() => {
    try { localStorage.setItem('popnwrap-cart', JSON.stringify(cart)); } catch { /* storage blocked */ }
  }, [cart]);
  const change = (id, d) => setCart((c) => {
    const q = (c[id] || 0) + d;
    const next = { ...c };
    if (q <= 0) delete next[id]; else next[id] = q;
    return next;
  });
  const lines = Object.entries(cart).filter(([id]) => byId[id]).map(([id, qty]) => ({ ...byId[id], qty }));
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const subtotal = lines.reduce((n, l) => n + l.qty * l.price, 0);
  return { cart, lines, count, subtotal, add: (id) => change(id, 1), remove: (id) => change(id, -1), clear: () => setCart({}) };
}

function Header({ count }) {
  return (
    <header className="nav">
      <Link to="/" className="logo">Pop<span>n</span>wrap</Link>
      <nav className="nav-links">
        {categories.map((c) => <NavLink key={c.slug} to={`/shop/${c.slug}`}>{c.title.replace('Balloon bouquets with ', 'With ')}</NavLink>)}
      </nav>
      <Link to="/cart" className="cart-btn" aria-label={`Cart, ${count} items`}>
        Bag <b>{count}</b>
      </Link>
    </header>
  );
}

function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <p className="eyebrow">Premium balloon and gift bouquets</p>
          <h1>Gifts that arrive<br />already <em>celebrating.</em></h1>
          <p className="lede">Hand wrapped balloon bouquets filled with flowers, toys and keepsakes. Pick one, add it to your bag, and check out on a single page.</p>
          <div className="row">
            <a href="#shop" className="btn">Shop bouquets</a>
            <Link to="/shop/flower-bouquets" className="btn ghost">Flower bouquets</Link>
          </div>
        </div>
        <div className="hero-art">
          <img className="a1" src={categories[0].cover} alt="Balloon bouquet with roses" />
          <img className="a2" src={categories[1].cover} alt="Balloon bouquet with a plush toy" />
          <img className="a3" src={categories[2].cover} alt="Balloon bouquet with a baby onesie" />
        </div>
      </section>

      <section id="shop" className="section">
        <div className="head"><p className="eyebrow">Shop by occasion</p><h2>Find the right bouquet</h2></div>
        <div className="cats">
          {categories.map((c) => (
            <Link key={c.slug} to={`/shop/${c.slug}`} className="cat">
              <img src={c.cover} alt={c.title} loading="lazy" />
              <div><h3>{c.title}</h3><span>{c.products.length} styles · from {money(c.products[0].price)}</span></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section how">
        <div className="head"><p className="eyebrow">How it works</p><h2>Three steps to a gift</h2></div>
        <ol>
          <li><b>1</b><h3>Pick a bouquet</h3><p>Browse real photos of every style from several angles.</p></li>
          <li><b>2</b><h3>Add to your bag</h3><p>Change quantities any time. Your bag is saved on this device.</p></li>
          <li><b>3</b><h3>One page checkout</h3><p>Contact, delivery and shipping on a single screen.</p></li>
        </ol>
      </section>
    </>
  );
}

function ProductCard({ p, qty, add, remove }) {
  const [i, setI] = useState(0);
  return (
    <article className="card">
      <div className="gallery">
        <img src={p.images[i]} alt={`${p.name}, photo ${i + 1}`} loading="lazy" />
        {p.images.length > 1 && (
          <div className="dots">
            {p.images.map((_, k) => (
              <button key={k} className={k === i ? 'on' : ''} aria-label={`Show photo ${k + 1}`} onClick={() => setI(k)} />
            ))}
          </div>
        )}
      </div>
      <div className="card-body">
        <h3>{p.name}</h3>
        <p className="price">{money(p.price)}</p>
        {qty ? (
          <div className="stepper">
            <button onClick={remove} aria-label="Remove one">−</button>
            <span>{qty} in bag</span>
            <button onClick={add} aria-label="Add one">+</button>
          </div>
        ) : (
          <button className="btn full" onClick={add}>Add to bag</button>
        )}
      </div>
    </article>
  );
}

function Category({ shop }) {
  const { slug } = useParams();
  const c = categories.find((x) => x.slug === slug) || categories[0];
  return (
    <section className="section">
      <Link to="/" className="back">← All bouquets</Link>
      <div className="head"><h2>{c.title}</h2><p className="muted">{c.products.length} styles. Tap the dots to see more photos.</p></div>
      <div className="grid">
        {c.products.map((p) => (
          <ProductCard key={p.id} p={p} qty={shop.cart[p.id]} add={() => shop.add(p.id)} remove={() => shop.remove(p.id)} />
        ))}
      </div>
    </section>
  );
}

function Summary({ shop, shipping }) {
  return (
    <aside className="summary">
      <h3>Order summary</h3>
      {shop.lines.map((l) => (
        <div key={l.id} className="sline"><img src={l.images[0]} alt="" /><span>{l.name}<small>Qty {l.qty}</small></span><b>{money(l.qty * l.price)}</b></div>
      ))}
      <div className="srow"><span>Subtotal</span><span>{money(shop.subtotal)}</span></div>
      {shipping != null && <div className="srow"><span>Shipping</span><span>{money(shipping)}</span></div>}
      <div className="srow total"><span>Total</span><span>{money(shop.subtotal + (shipping || 0))}</span></div>
    </aside>
  );
}

function Cart({ shop }) {
  if (!shop.lines.length) return (
    <section className="section empty"><h2>Your bag is empty</h2><p className="muted">Find a bouquet you love and it will show up here.</p><Link to="/" className="btn">Start shopping</Link></section>
  );
  return (
    <section className="section">
      <div className="head"><h2>Your bag</h2></div>
      <div className="two">
        <div className="lines">
          {shop.lines.map((l) => (
            <div key={l.id} className="line">
              <img src={l.images[0]} alt={l.name} />
              <div><h3>{l.name}</h3><p className="muted">{money(l.price)} each</p></div>
              <div className="stepper sm"><button onClick={() => shop.remove(l.id)} aria-label="Remove one">−</button><span>{l.qty}</span><button onClick={() => shop.add(l.id)} aria-label="Add one">+</button></div>
              <b>{money(l.qty * l.price)}</b>
            </div>
          ))}
        </div>
        <div>
          <Summary shop={shop} />
          <Link to="/checkout" className="btn full">Checkout</Link>
        </div>
      </div>
    </section>
  );
}

function Checkout({ shop }) {
  const nav = useNavigate();
  const [ship, setShip] = useState('standard');
  const [f, setF] = useState({ name: '', email: '', address: '', city: '', zip: '' });
  const [err, setErr] = useState({});
  const [done, setDone] = useState(false);
  const shipping = ship === 'express' ? 15 : 7.99;
  const fields = useMemo(() => [
    ['name', 'Full name', 'text'], ['email', 'Email', 'email'], ['address', 'Street address', 'text'], ['city', 'City', 'text'], ['zip', 'ZIP code', 'text'],
  ], []);
  const submit = (e) => {
    e.preventDefault();
    const x = {};
    fields.forEach(([k, label]) => { if (!f[k].trim()) x[k] = `${label} is required`; });
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) x.email = 'Enter a valid email';
    if (f.zip && !/^\d{5}$/.test(f.zip)) x.zip = 'ZIP must be 5 digits';
    setErr(x);
    if (!Object.keys(x).length) { setDone(true); shop.clear(); }
  };
  if (done) return (
    <section className="section empty"><div className="ok">✓</div><h2>Thank you, {f.name.split(' ')[0]}!</h2><p className="muted">This is a demo store, so no payment was taken.</p><button className="btn" onClick={() => nav('/')}>Back to shop</button></section>
  );
  if (!shop.lines.length) return <Cart shop={shop} />;
  return (
    <section className="section">
      <div className="head"><h2>Checkout</h2><p className="muted">Everything on one page.</p></div>
      <div className="two">
        <form className="form" onSubmit={submit} noValidate>
          <h3>Contact and delivery</h3>
          {fields.map(([k, label, type]) => (
            <label key={k} className={`fld ${k === 'city' || k === 'zip' ? 'half' : ''}`}>
              <span>{label}</span>
              <input type={type} value={f[k]} aria-invalid={!!err[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} />
              {err[k] && <em>{err[k]}</em>}
            </label>
          ))}
          <h3>Shipping</h3>
          {[['standard', 'Standard', 7.99], ['express', 'Express', 15]].map(([v, l, p]) => (
            <label key={v} className={`opt ${ship === v ? 'on' : ''}`}>
              <input type="radio" name="ship" checked={ship === v} onChange={() => setShip(v)} /> <span>{l}</span><b>{money(p)}</b>
            </label>
          ))}
          <button className="btn full" type="submit">Place order · {money(shop.subtotal + shipping)}</button>
        </form>
        <Summary shop={shop} shipping={shipping} />
      </div>
    </section>
  );
}

export default function App() {
  const shop = useCart();
  return (
    <BrowserRouter>
      <Header count={shop.count} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop/:slug" element={<Category shop={shop} />} />
          <Route path="/cart" element={<Cart shop={shop} />} />
          <Route path="/checkout" element={<Checkout shop={shop} />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <footer className="foot"><span className="logo">Pop<span>n</span>wrap</span><span>© 2025 Popnwrap. Designed and built by Abhigna Margam.</span></footer>
    </BrowserRouter>
  );
}
