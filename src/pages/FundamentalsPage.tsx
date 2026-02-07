import { 
  Lightbulb, Waves, Cpu, Battery, CircuitBoard, Gauge, 
  BookOpen, Zap, ArrowRight 
} from "lucide-react";
import { Link } from "react-router-dom";

const topics = [
  {
    icon: Lightbulb,
    title: "Ohm's Law & Basic Circuits",
    content: [
      "Ohm's Law: V = I × R — the fundamental relationship between voltage, current, and resistance.",
      "Kirchhoff's Voltage Law (KVL): The sum of voltages around any closed loop equals zero.",
      "Kirchhoff's Current Law (KCL): The sum of currents entering a node equals the sum leaving it.",
      "Series circuits share the same current; voltage divides across components.",
      "Parallel circuits share the same voltage; current divides across branches.",
    ],
  },
  {
    icon: CircuitBoard,
    title: "Passive Components",
    content: [
      "Resistors: Oppose current flow. Power dissipation P = I²R. Color codes identify values.",
      "Capacitors: Store energy in electric fields. Impedance Xc = 1/(2πfC). Block DC, pass AC.",
      "Inductors: Store energy in magnetic fields. Impedance XL = 2πfL. Pass DC, block AC.",
      "RC Time Constant: τ = R × C — time to charge to 63.2% of final value.",
      "RL Time Constant: τ = L / R — determines current rise/fall rate.",
    ],
  },
  {
    icon: Cpu,
    title: "Semiconductors",
    content: [
      "Diodes: Allow current flow in one direction. Forward voltage ~0.7V (Si), ~0.3V (Schottky).",
      "Bipolar Junction Transistors (BJT): Current-controlled devices. NPN and PNP types. Ic = β × Ib.",
      "MOSFETs: Voltage-controlled switches. N-channel and P-channel. Key params: Vgs(th), Rds(on).",
      "Zener Diodes: Regulate voltage by operating in reverse breakdown region.",
      "LEDs: Emit light when forward biased. Always use a current-limiting resistor.",
    ],
  },
  {
    icon: Waves,
    title: "AC Circuits & Filters",
    content: [
      "AC signals are characterized by frequency (Hz), amplitude, and phase.",
      "RMS value = Peak / √2 for sinusoidal waveforms — represents equivalent DC heating power.",
      "Low-Pass Filter: Passes frequencies below cutoff fc = 1/(2πRC). Attenuates higher frequencies.",
      "High-Pass Filter: Passes frequencies above cutoff. Blocks DC component.",
      "Resonance: In LC circuits, fr = 1/(2π√(LC)). Impedance is minimized (series) or maximized (parallel).",
    ],
  },
  {
    icon: Battery,
    title: "Power Electronics Fundamentals",
    content: [
      "Switch-mode power supplies (SMPS) convert power efficiently using high-frequency switching.",
      "Buck converter: Steps voltage down. Duty cycle D = Vout/Vin.",
      "Boost converter: Steps voltage up. D = 1 - Vin/Vout.",
      "Flyback converter: Isolated topology based on buck-boost. Uses transformer for isolation.",
      "Key design parameters: efficiency, ripple, transient response, thermal management.",
    ],
  },
  {
    icon: Gauge,
    title: "Magnetics & Inductors",
    content: [
      "Inductance L = N² × µ × A / l — turns², permeability, area, and magnetic path length.",
      "Flux density B = µ × H. Saturation occurs when core can't support more flux.",
      "Air gap reduces effective permeability, prevents saturation, and stores energy.",
      "Core materials: Ferrite (high frequency), Iron powder (DC bias), Amorphous (low loss).",
      "Skin effect: At high frequencies, current flows near wire surface. Use Litz wire to mitigate.",
    ],
  },
];

const FundamentalsPage = () => {
  return (
    <div className="min-h-screen">
      <div className="container py-8 md:py-12">
        <div className="mb-10">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
            Electronics <span className="text-gradient-teal">Fundamentals</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Essential concepts and theory for students and engineers. Master these building blocks 
            to design robust electronic circuits and power systems.
          </p>
        </div>

        <div className="grid gap-6">
          {topics.map((topic, i) => (
            <div
              key={topic.title}
              className="rounded-xl border border-border bg-card p-6 animate-fade-in-up"
              style={{ animationDelay: `${0.05 * i}s` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <topic.icon className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold">{topic.title}</h2>
              </div>
              <ul className="space-y-2.5">
                {topic.content.map((item, j) => (
                  <li key={j} className="flex gap-2 text-sm text-secondary-foreground leading-relaxed">
                    <span className="text-primary mt-1 shrink-0">▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-xl border border-glow bg-primary/5 p-8 text-center">
          <BookOpen className="h-8 w-8 text-primary mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-2">Ready to Apply Your Knowledge?</h3>
          <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto">
            Use our DC-DC converter calculator to design real power supplies with magnetics and thermal analysis.
          </p>
          <Link
            to="/calculator"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity glow-teal"
          >
            <Zap className="h-4 w-4" />
            Open Calculator
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FundamentalsPage;
