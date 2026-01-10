export const metadata = {
  title: "About",
  description: "Learn about the Alien Signal Blog and my journey into programming, web development, and the digital universe.",
  openGraph: {
    title: "About | Alien Signal Blog",
    description: "Learn about my journey into programming and web development",
  },
};

export default function AboutPage() {
  return (
    <section className="container">
      <div className="card cardPad">
        <h1 className="h2" style={{ fontSize: 28 }}>About Me</h1>

        <p className="p" style={{ marginTop: 10 }}>
          This is the start of my exploration into the digital unknown.
        </p>
        <p className="p" style={{ marginTop: 10 }}>
          Guided by curiosity and a fascination with how systems communicate and evolve,
          I am diving into the world of coding—a universe built on logic, creativity,
          and infinite possibility. Programming is more than a technical skill to me;
          it is a language that shapes reality in the digital age.
        </p>
        <p className="p" style={{ marginTop: 10 }}>
          Each line of code is a signal, each project a new discovery. As I continue to learn
          and experiment, my goal is to grow into a skilled programmer capable of building
          meaningful systems. The process itself—learning, failing, improving—is what drives me forward.
        </p>

        <div style={{ height: 16 }} />

        <div className="badges">
          <span className="badge green">Green Signal</span>
          <span className="badge orange">Orange Accent</span>
          <span className="badge">Learning in public</span>
          <span className="badge">Projects + notes</span>
        </div>
      </div>
    </section>
  );
}
