import { Link } from "react-router-dom";
import { Zap, Calculator, BookOpen, Cpu, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Calculator,
    title: "DC-DC Converter Calculator",
    description: "Complete power stage, magnetics, and thermal design for Buck, Boost, and Buck-Boost topologies.",
    link: "/calculator",
    accent: "primary",
  },
  {
    icon: Cpu,
    title: "Circuit Fundamentals",
    description: "Learn about resistors, capacitors, inductors, transistors and how they work in real circuits.",
    link: "/fundamentals",
    accent: "accent",
  },
  {
    icon: BookOpen,
    title: "Learning Resources",
    description: "Curated tutorials, datasheets, and reference designs for students and working engineers.",
    link: "/fundamentals",
    accent: "primary",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute inset-0 gradient-radial" />
        <div className="container relative z-10 flex flex-col items-center justify-center py-24 md:py-36 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-mono text-primary mb-8 animate-fade-in-up">
            <Zap className="h-3.5 w-3.5" />
            Electronics Engineering Hub
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight max-w-4xl animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Master Electronics{" "}
            <span className="text-gradient-teal">Design & Build</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Interactive calculators, reference designs, and learning resources for students and engineers. 
            Start with our DC-DC converter design tool.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-10 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Link
              to="/calculator"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity glow-teal"
            >
              <Calculator className="h-4 w-4" />
              Open DC-DC Calculator
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground hover:bg-secondary/80 transition-colors"
            >
              Explore Features
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            {[
              { value: "3", label: "Topologies" },
              { value: "Full", label: "Magnetics Design" },
              { value: "Thermal", label: "Heatsink Calc" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold font-mono text-gradient-teal">{stat.value}</div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Tools for <span className="text-gradient-amber">Engineers</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
            From converter design to thermal management — everything you need in one place.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <Link
              key={f.title}
              to={f.link}
              className="group rounded-xl border border-border bg-card p-6 hover:border-glow hover:glow-teal transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${0.1 * i}s` }}
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${
                f.accent === "primary" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
              } mb-4`}>
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container text-center text-sm text-muted-foreground space-y-1">
          <p>ElectroHub — Built for students and engineers who love electronics.</p>
          <p className="text-xs">Created by <span className="text-primary font-semibold">Tmsen</span></p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
