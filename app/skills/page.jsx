import SkillsShowcase from "@/components/SkillsShowcase";

export const metadata = {
  title: "Claude Skills",
  description: "A collection of Claude Code skills and templates for web development, blog optimization, and more.",
  openGraph: {
    title: "Claude Skills | Alien Signal Blog",
    description: "Discover and install Claude Code skills for your projects",
  },
};

export default function SkillsPage() {
  return (
    <section className="container">
      <div className="skills-page">
        <div className="skills-header">
          <pre className="skills-ascii" aria-label="SKILLS">{`
 ██████╗██╗      █████╗ ██╗   ██╗██████╗ ███████╗
██╔════╝██║     ██╔══██╗██║   ██║██╔══██╗██╔════╝
██║     ██║     ███████║██║   ██║██║  ██║█████╗
██║     ██║     ██╔══██║██║   ██║██║  ██║██╔══╝
╚██████╗███████╗██║  ██║╚██████╔╝██████╔╝███████╗
 ╚═════╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝
      ███████╗██╗  ██╗██╗██╗     ██╗     ███████╗
      ██╔════╝██║ ██╔╝██║██║     ██║     ██╔════╝
      ███████╗█████╔╝ ██║██║     ██║     ███████╗
      ╚════██║██╔═██╗ ██║██║     ██║     ╚════██║
      ███████║██║  ██╗██║███████╗███████╗███████║
      ╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚══════╝`}</pre>
          <h1 className="skills-title">Claude Code Skills</h1>
          <p className="skills-subtitle">
            Ready-to-use skills and templates for Claude Code. Copy the install command and enhance your workflow.
          </p>
        </div>

        <SkillsShowcase />
      </div>
    </section>
  );
}
