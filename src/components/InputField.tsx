import { ReactNode } from "react";

interface InputFieldProps {
  label: string;
  unit: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  icon?: ReactNode;
}

const InputField = ({ label, unit, value, onChange, min, max, step = 1 }: InputFieldProps) => (
  <div>
    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</label>
    <div className="relative">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        min={min}
        max={max}
        step={step}
        className="w-full rounded-lg border border-border bg-secondary px-3 py-2 pr-12 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono">
        {unit}
      </span>
    </div>
  </div>
);

export default InputField;
