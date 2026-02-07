interface ResultCardProps {
  label: string;
  value: string | number;
  unit: string;
  highlight?: boolean;
  warn?: boolean;
}

const ResultCard = ({ label, value, unit, highlight, warn }: ResultCardProps) => (
  <div className={`rounded-lg border p-3 ${
    warn ? "border-destructive/40 bg-destructive/5" :
    highlight ? "border-glow bg-primary/5" : "border-border bg-card"
  }`}>
    <div className="text-xs text-muted-foreground mb-1">{label}</div>
    <div className="flex items-baseline gap-1">
      <span className={`text-lg font-mono font-bold ${
        warn ? "text-destructive" : highlight ? "text-primary" : "text-foreground"
      }`}>
        {typeof value === "number" ? value.toFixed(2) : value}
      </span>
      <span className="text-xs text-muted-foreground">{unit}</span>
    </div>
  </div>
);

export default ResultCard;
