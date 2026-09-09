import { sitePath } from "@/lib/site";

const actions = [
  {
    label: "I HAVE 5 MINUTES",
    description: "Start a focused Bible study that fits your time.",
    href: sitePath("/study?minutes=5"),
  },
  {
    label: "I'M LOST",
    description: "Bring a difficult passage and let the study guide you.",
    href: sitePath("/ask"),
  },
  {
    label: "TEACH ME",
    description: "Learn Scripture clearly, step by step, without the jargon.",
    href: sitePath("/ask"),
  },
  {
    label: "READ THE BIBLE",
    description: "Open Scripture and start reading immediately.",
    href: sitePath("/bible"),
  },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href={sitePath("/")}>Bible Study</a>
        <nav aria-label="Main navigation">
          <a href={sitePath("/bible")}>Bible</a>
          <a href={sitePath("/study")}>Study</a>
          <a href={sitePath("/memory")}>Memory</a>
          <a href={sitePath("/sermon")}>Sermon</a>
        </nav>
      </header>

      <section className="hero">
        <p className="eyebrow">READ • UNDERSTAND • REMEMBER • LIVE</p>
        <h1>Bible study without the friction.</h1>
        <p className="hero-copy">
          Open the Bible. Understand what you are reading. Remember what you learned.
          Know what to do next.
        </p>
        <div className="hero-actions">
          <a className="primary-button" href={sitePath("/bible")}>Start studying</a>
          <a className="secondary-button" href={sitePath("/study")}>I have 5 minutes</a>
        </div>
      </section>

      <section className="actions-section" aria-labelledby="start-heading">
        <div className="section-heading">
          <p className="eyebrow">START WHERE YOU ARE</p>
          <h2 id="start-heading">What do you need right now?</h2>
        </div>
        <div className="action-grid">
          {actions.map((action) => (
            <a className="action-card" href={action.href} key={action.label}>
              <span className="action-label">{action.label}</span>
              <span className="action-description">{action.description}</span>
              <span className="arrow" aria-hidden="true">→</span>
            </a>
          ))}
        </div>
      </section>

      <section className="method" aria-labelledby="method-heading">
        <p className="eyebrow">THE STUDY LOOP</p>
        <h2 id="method-heading">A better way to study Scripture.</h2>
        <div className="method-list">
          {[
            ["01", "READ", "See what the text actually says."],
            ["02", "UNDERSTAND", "Get clear context and explanations."],
            ["03", "DISCOVER", "Find connections, people, places and themes."],
            ["04", "REMEMBER", "Turn what you learned into lasting knowledge."],
            ["05", "APPLY", "Leave every study knowing your next step."],
          ].map(([number, title, text]) => (
            <div className="method-item" key={number}>
              <span className="method-number">{number}</span>
              <div><strong>{title}</strong><p>{text}</p></div>
            </div>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <p>Built to help people actually understand and live the Bible.</p>
      </footer>
    </main>
  );
}
