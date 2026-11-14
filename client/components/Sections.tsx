export function Grading() {
  return (
    <section className="section" id="grading">
      <p className="eyebrow center">Condition grading</p>
      <h2 className="title">Know the Box <em>Before You Buy</em></h2>
      <div className="grades">
        <div className="g sealed"><h3>Sealed</h3><p>Factory sealed card or box. Any shelf wear is described in the listing.</p></div>
        <div className="g opened"><h3>Opened</h3><p>Opened for inspection or photos. Car and all parts present unless stated.</p></div>
        <div className="g damage"><h3>Packaging Damage</h3><p>Creased card, cracked blister or dented box. The car itself is untouched.</p></div>
      </div>
    </section>
  );
}

const reviews = [
  ['Sealed card was perfect, exactly as graded. Packed like a vault.', 'Arjun, Vadodara'],
  ['Best source for Mini GT and Tarmac Works in India.', 'Meera, Kochi'],
  ['Honest photos of every flaw. This is how it should be done.', 'Rahul, Surat'],
];
export function Reviews() {
  return (
    <section className="section dark" id="reviews">
      <div className="head"><h2 className="title">Collector <em>Reviews</em></h2></div>
      <div className="reviews">{reviews.map(([q, c]) => <blockquote key={c}>“{q}”<cite>— {c}</cite></blockquote>)}</div>
    </section>
  );
}
