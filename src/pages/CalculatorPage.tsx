import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Magnet, Thermometer, ArrowDown, ArrowUp, ArrowLeftRight, Shuffle, ArrowRight, Columns } from "lucide-react";
import InputField from "@/components/InputField";
import ResultCard from "@/components/ResultCard";
import {
  Topology,
  PowerInputs,
  MagneticInputs,
  ThermalInputs,
  calculatePowerStage,
  calculateMagnetics,
  calculateThermal,
} from "@/lib/calculators";

const nonIsolated: { id: Topology; label: string; icon: typeof ArrowDown; desc: string }[] = [
  { id: "buck", label: "Buck", icon: ArrowDown, desc: "Step-Down" },
  { id: "boost", label: "Boost", icon: ArrowUp, desc: "Step-Up" },
  { id: "buck-boost", label: "Buck-Boost", icon: ArrowLeftRight, desc: "Inverting" },
];

const isolated: { id: Topology; label: string; icon: typeof ArrowDown; desc: string }[] = [
  { id: "flyback", label: "Flyback", icon: Shuffle, desc: "Isolated Buck-Boost" },
  { id: "forward", label: "Forward", icon: ArrowRight, desc: "Isolated Buck" },
  { id: "push-pull", label: "Push-Pull", icon: Columns, desc: "Center-Tap" },
];

const CalculatorPage = () => {
  const [topology, setTopology] = useState<Topology>("buck");

  const [power, setPower] = useState<PowerInputs>({
    vin: 12,
    vout: 5,
    iout: 2,
    fsw: 200,
    rippleCurrentPercent: 30,
    rippleVoltagePercent: 1,
    efficiency: 0.9,
    turnsRatio: 2,
  });

  const powerResults = useMemo(() => calculatePowerStage(topology, power), [topology, power]);

  const [magnetic, setMagnetic] = useState<MagneticInputs>({
    inductance: 0,
    peakCurrent: 0,
    bmax: 0.3,
    ae: 52,
    windowArea: 40,
    currentDensity: 4,
    corePermeability: 2500,
    coreLengthMm: 37,
  });

  const effectiveMagnetic = useMemo(() => ({
    ...magnetic,
    inductance: powerResults.inductance,
    peakCurrent: powerResults.peakCurrent,
  }), [magnetic, powerResults]);

  const magneticResults = useMemo(() => calculateMagnetics(effectiveMagnetic), [effectiveMagnetic]);

  const [thermal, setThermal] = useState<ThermalInputs>({
    totalLoss: 0,
    ambientTemp: 25,
    maxJunctionTemp: 125,
    thetaJC: 2,
    thetaCS: 0.5,
  });

  const effectiveThermal = useMemo(() => ({
    ...thermal,
    totalLoss: powerResults.losses || 0.01,
  }), [thermal, powerResults]);

  const thermalResults = useMemo(() => calculateThermal(effectiveThermal), [effectiveThermal]);

  const updatePower = (key: keyof PowerInputs, val: number) =>
    setPower((p) => ({ ...p, [key]: val }));
  const updateMagnetic = (key: keyof MagneticInputs, val: number) =>
    setMagnetic((p) => ({ ...p, [key]: val }));
  const updateThermal = (key: keyof ThermalInputs, val: number) =>
    setThermal((p) => ({ ...p, [key]: val }));

  return (
    <div className="min-h-screen">
      <div className="container py-8 md:py-12">
        {/* Topology Selector */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
            DC-DC Converter <span className="text-gradient-teal">Calculator</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Select topology and enter parameters for power stage, magnetics, and thermal design.
          </p>
        </div>

        {/* Non-Isolated */}
        <div className="mb-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Non-Isolated</h3>
          <div className="grid grid-cols-3 gap-3">
            {nonIsolated.map((t) => (
              <button
                key={t.id}
                onClick={() => setTopology(t.id)}
                className={`group rounded-xl border p-3 text-left transition-all duration-200 ${
                  topology === t.id
                    ? "border-glow bg-primary/5 glow-teal"
                    : "border-border bg-card hover:bg-secondary"
                }`}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <t.icon className={`h-4 w-4 ${topology === t.id ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`font-semibold text-sm ${topology === t.id ? "text-primary" : "text-foreground"}`}>{t.label}</span>
                </div>
                <span className="text-xs text-muted-foreground">{t.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Isolated */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Isolated</h3>
          <div className="grid grid-cols-3 gap-3">
            {isolated.map((t) => (
              <button
                key={t.id}
                onClick={() => setTopology(t.id)}
                className={`group rounded-xl border p-3 text-left transition-all duration-200 ${
                  topology === t.id
                    ? "border-glow bg-primary/5 glow-teal"
                    : "border-border bg-card hover:bg-secondary"
                }`}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <t.icon className={`h-4 w-4 ${topology === t.id ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`font-semibold text-sm ${topology === t.id ? "text-primary" : "text-foreground"}`}>{t.label}</span>
                </div>
                <span className="text-xs text-muted-foreground">{t.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Calculator Tabs */}
        <Tabs defaultValue="power" className="space-y-6">
          <TabsList className="bg-secondary border border-border w-full md:w-auto">
            <TabsTrigger value="power" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary gap-1.5">
              <Zap className="h-3.5 w-3.5" /> Power Stage
            </TabsTrigger>
            <TabsTrigger value="magnetics" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary gap-1.5">
              <Magnet className="h-3.5 w-3.5" /> Magnetics
            </TabsTrigger>
            <TabsTrigger value="thermal" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary gap-1.5">
              <Thermometer className="h-3.5 w-3.5" /> Thermal
            </TabsTrigger>
          </TabsList>

          {/* Power Stage Tab */}
          <TabsContent value="power" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" /> Input Parameters
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Input Voltage" unit="V" value={power.vin} onChange={(v) => updatePower("vin", v)} min={0.1} step={0.1} />
                  <InputField label="Output Voltage" unit="V" value={power.vout} onChange={(v) => updatePower("vout", v)} min={0.1} step={0.1} />
                  <InputField label="Output Current" unit="A" value={power.iout} onChange={(v) => updatePower("iout", v)} min={0.01} step={0.1} />
                  <InputField label="Switching Freq" unit="kHz" value={power.fsw} onChange={(v) => updatePower("fsw", v)} min={1} step={10} />
                  <InputField label="Current Ripple" unit="%" value={power.rippleCurrentPercent} onChange={(v) => updatePower("rippleCurrentPercent", v)} min={1} max={100} step={1} />
                  <InputField label="Voltage Ripple" unit="%" value={power.rippleVoltagePercent} onChange={(v) => updatePower("rippleVoltagePercent", v)} min={0.1} max={20} step={0.1} />
                  <InputField label="Efficiency" unit="η" value={power.efficiency} onChange={(v) => updatePower("efficiency", v)} min={0.5} max={1} step={0.01} />
                  {["flyback", "forward", "push-pull"].includes(topology) && (
                    <InputField label="Turns Ratio (Np/Ns)" unit="N" value={power.turnsRatio || 1} onChange={(v) => updatePower("turnsRatio", v)} min={0.1} max={50} step={0.1} />
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Results</h3>
                <div className="grid grid-cols-2 gap-3">
                  <ResultCard label="Duty Cycle" value={(powerResults.dutyCycle * 100).toFixed(1)} unit="%" highlight />
                  <ResultCard label="Inductance" value={powerResults.inductance.toFixed(1)} unit="µH" highlight />
                  <ResultCard label="Ripple Current" value={powerResults.rippleCurrent.toFixed(2)} unit="A" />
                  <ResultCard label="Peak Current" value={powerResults.peakCurrent.toFixed(2)} unit="A" />
                  <ResultCard label="RMS Current" value={powerResults.rmsCurrent.toFixed(2)} unit="A" />
                  <ResultCard label="Input Current" value={powerResults.inputCurrent.toFixed(2)} unit="A" />
                  <ResultCard label="Output Cap" value={powerResults.outputCapacitance.toFixed(1)} unit="µF" />
                  <ResultCard label="Input Cap" value={powerResults.inputCapacitance.toFixed(1)} unit="µF" />
                  <ResultCard label="Output Power" value={powerResults.outputPower.toFixed(1)} unit="W" />
                  <ResultCard label="Power Loss" value={powerResults.losses.toFixed(2)} unit="W" warn={powerResults.losses > 5} />
                  <ResultCard label="Switch Stress" value={powerResults.switchVoltageStress.toFixed(1)} unit="V" />
                  <ResultCard label="Diode Stress" value={powerResults.diodeVoltageStress.toFixed(1)} unit="V" />
                  {powerResults.turnsRatio && (
                    <ResultCard label="Turns Ratio" value={powerResults.turnsRatio.toFixed(1)} unit="Np/Ns" highlight />
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Magnetics Tab */}
          <TabsContent value="magnetics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Magnet className="h-4 w-4 text-primary" /> Core & Winding Parameters
                </h3>
                <div className="rounded-lg bg-secondary/50 border border-border p-3 mb-2">
                  <p className="text-xs text-muted-foreground">
                    <span className="text-primary font-medium">Auto-linked:</span> Inductance ({powerResults.inductance.toFixed(1)} µH) and peak current ({powerResults.peakCurrent.toFixed(2)} A) from power stage.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Max Flux Density" unit="T" value={magnetic.bmax} onChange={(v) => updateMagnetic("bmax", v)} min={0.05} max={0.5} step={0.01} />
                  <InputField label="Core Area (Ae)" unit="mm²" value={magnetic.ae} onChange={(v) => updateMagnetic("ae", v)} min={1} step={1} />
                  <InputField label="Window Area" unit="mm²" value={magnetic.windowArea} onChange={(v) => updateMagnetic("windowArea", v)} min={1} step={1} />
                  <InputField label="Current Density" unit="A/mm²" value={magnetic.currentDensity} onChange={(v) => updateMagnetic("currentDensity", v)} min={1} max={10} step={0.5} />
                  <InputField label="Core Permeability" unit="µr" value={magnetic.corePermeability} onChange={(v) => updateMagnetic("corePermeability", v)} min={100} step={100} />
                  <InputField label="Mag. Path Length" unit="mm" value={magnetic.coreLengthMm} onChange={(v) => updateMagnetic("coreLengthMm", v)} min={5} step={1} />
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Magnetics Results</h3>
                <div className="grid grid-cols-2 gap-3">
                  <ResultCard label="Number of Turns" value={magneticResults.turns} unit="turns" highlight />
                  <ResultCard label="Air Gap" value={magneticResults.airGapMm} unit="mm" highlight />
                  <ResultCard label="Wire Area" value={magneticResults.wireAreaMm2} unit="mm²" />
                  <ResultCard label="Wire Diameter" value={magneticResults.wireDiameterMm} unit="mm" />
                  <ResultCard label="Fill Factor" value={(magneticResults.fillFactor * 100).toFixed(1)} unit="%" warn={magneticResults.fillFactor > 0.5} />
                  <ResultCard label="AL Value" value={magneticResults.alValue} unit="nH/N²" />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Thermal Tab */}
          <TabsContent value="thermal" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-primary" /> Thermal Parameters
                </h3>
                <div className="rounded-lg bg-secondary/50 border border-border p-3 mb-2">
                  <p className="text-xs text-muted-foreground">
                    <span className="text-primary font-medium">Auto-linked:</span> Total power loss ({powerResults.losses.toFixed(2)} W) from power stage.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Ambient Temp" unit="°C" value={thermal.ambientTemp} onChange={(v) => updateThermal("ambientTemp", v)} min={-40} max={85} step={1} />
                  <InputField label="Max Junction Temp" unit="°C" value={thermal.maxJunctionTemp} onChange={(v) => updateThermal("maxJunctionTemp", v)} min={60} max={175} step={5} />
                  <InputField label="θ Junction-Case" unit="°C/W" value={thermal.thetaJC} onChange={(v) => updateThermal("thetaJC", v)} min={0.1} max={50} step={0.1} />
                  <InputField label="θ Case-Sink" unit="°C/W" value={thermal.thetaCS} onChange={(v) => updateThermal("thetaCS", v)} min={0.01} max={10} step={0.1} />
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Thermal Results</h3>
                <div className="grid grid-cols-2 gap-3">
                  <ResultCard
                    label="Max θ Heatsink-Ambient"
                    value={thermalResults.maxThetaSA}
                    unit="°C/W"
                    highlight
                    warn={thermalResults.maxThetaSA < 0}
                  />
                  <ResultCard label="Heatsink Temp" value={thermalResults.heatsinkTemp} unit="°C" />
                  <ResultCard label="Case Temp" value={thermalResults.caseTemp} unit="°C" />
                  <ResultCard
                    label="Junction Temp"
                    value={thermalResults.junctionTemp}
                    unit="°C"
                    warn={thermalResults.junctionTemp > thermal.maxJunctionTemp}
                  />
                  <ResultCard label="Heatsink Rise" value={thermalResults.tempRiseHeatsink} unit="°C" />
                </div>
                {thermalResults.maxThetaSA < 0 && (
                  <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-xs text-destructive">
                    ⚠️ Negative θ_SA means no passive heatsink can meet thermal requirements. Consider forced air cooling or reducing power loss.
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CalculatorPage;
