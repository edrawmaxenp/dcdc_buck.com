// DC-DC Converter calculation utilities

export type Topology = "buck" | "boost" | "buck-boost" | "flyback" | "forward" | "push-pull";

export interface PowerInputs {
  vin: number;
  vout: number;
  iout: number;
  fsw: number;
  rippleCurrentPercent: number;
  rippleVoltagePercent: number;
  efficiency: number;
  turnsRatio?: number; // Np/Ns for isolated topologies
}

export interface PowerResults {
  dutyCycle: number;
  inductance: number; // µH (magnetizing inductance for isolated)
  rippleCurrent: number;
  peakCurrent: number;
  rmsCurrent: number;
  inputCurrent: number;
  outputCapacitance: number;
  inputCapacitance: number;
  outputRippleVoltage: number;
  switchVoltageStress: number;
  diodeVoltageStress: number;
  outputPower: number;
  inputPower: number;
  losses: number;
  turnsRatio?: number;
}

export interface MagneticInputs {
  inductance: number;
  peakCurrent: number;
  bmax: number;
  ae: number;
  windowArea: number;
  currentDensity: number;
  corePermeability: number;
  coreLengthMm: number;
}

export interface MagneticResults {
  turns: number;
  airGapMm: number;
  wireAreaMm2: number;
  wireDiameterMm: number;
  fillFactor: number;
  alValue: number;
}

export interface ThermalInputs {
  totalLoss: number;
  ambientTemp: number;
  maxJunctionTemp: number;
  thetaJC: number;
  thetaCS: number;
}

export interface ThermalResults {
  maxThetaSA: number;
  junctionTemp: number;
  tempRiseHeatsink: number;
  heatsinkTemp: number;
  caseTemp: number;
}

export function calculatePowerStage(topology: Topology, inputs: PowerInputs): PowerResults {
  const { vin, vout, iout, fsw, rippleCurrentPercent, efficiency } = inputs;
  const fswHz = fsw * 1000;
  const deltaIpercent = rippleCurrentPercent / 100;
  const deltaVpercent = inputs.rippleVoltagePercent / 100;
  const n = inputs.turnsRatio || 1; // Np/Ns

  let dutyCycle: number;
  let inductorCurrent: number;
  let switchStress: number;
  let diodeStress: number;
  let inputCurrent: number;

  switch (topology) {
    case "buck":
      dutyCycle = vout / (vin * efficiency);
      dutyCycle = Math.min(Math.max(dutyCycle, 0.01), 0.99);
      inductorCurrent = iout;
      inputCurrent = iout * dutyCycle / efficiency;
      switchStress = vin;
      diodeStress = vin;
      break;
    case "boost":
      dutyCycle = 1 - (vin * efficiency) / vout;
      dutyCycle = Math.min(Math.max(dutyCycle, 0.01), 0.99);
      inductorCurrent = iout / (1 - dutyCycle);
      inputCurrent = inductorCurrent;
      switchStress = vout;
      diodeStress = vout;
      break;
    case "buck-boost":
      dutyCycle = vout / (vin * efficiency + vout);
      dutyCycle = Math.min(Math.max(dutyCycle, 0.01), 0.99);
      inductorCurrent = iout / (1 - dutyCycle);
      inputCurrent = inductorCurrent * dutyCycle / efficiency;
      switchStress = vin + vout;
      diodeStress = vin + vout;
      break;
    case "flyback":
      // Flyback: D = Vout * n / (Vin * η + Vout * n)
      dutyCycle = (vout * n) / (vin * efficiency + vout * n);
      dutyCycle = Math.min(Math.max(dutyCycle, 0.01), 0.99);
      // Magnetizing current (primary side)
      inductorCurrent = (iout * n) / (1 - dutyCycle);
      inputCurrent = inductorCurrent * dutyCycle / efficiency;
      // Voltage stress
      switchStress = vin + vout * n; // Primary switch
      diodeStress = vout + vin / n; // Secondary diode
      break;
    case "forward":
      // Forward: D = Vout * n / (Vin * η)
      dutyCycle = (vout * n) / (vin * efficiency);
      dutyCycle = Math.min(Math.max(dutyCycle, 0.01), 0.49); // Max 50% for forward
      // Output inductor current
      inductorCurrent = iout;
      inputCurrent = iout / (n * efficiency);
      switchStress = 2 * vin; // With reset winding
      diodeStress = vout + vin / n;
      break;
    case "push-pull":
      // Push-Pull: D = Vout * n / (2 * Vin * η), each switch
      dutyCycle = (vout * n) / (2 * vin * efficiency);
      dutyCycle = Math.min(Math.max(dutyCycle, 0.01), 0.49);
      inductorCurrent = iout;
      inputCurrent = iout / (n * efficiency);
      switchStress = 2 * vin;
      diodeStress = 2 * vout;
      break;
  }

  const rippleCurrent = inductorCurrent * deltaIpercent;
  const peakCurrent = inductorCurrent + rippleCurrent / 2;
  const rmsCurrent = Math.sqrt(inductorCurrent ** 2 + (rippleCurrent ** 2) / 12);

  // Inductance
  let inductance: number;
  if (topology === "buck" || topology === "forward" || topology === "push-pull") {
    const vApplied = topology === "buck" ? (vin - vout) : (vin / n - vout);
    inductance = (vApplied * dutyCycle) / (fswHz * rippleCurrent) * 1e6;
  } else if (topology === "boost") {
    inductance = (vin * dutyCycle) / (fswHz * rippleCurrent) * 1e6;
  } else {
    // buck-boost & flyback: magnetizing inductance
    inductance = (vin * dutyCycle) / (fswHz * rippleCurrent) * 1e6;
  }

  const outputRippleVoltage = vout * deltaVpercent;
  let outputCapacitance: number;
  if (topology === "buck" || topology === "forward" || topology === "push-pull") {
    outputCapacitance = (rippleCurrent / (8 * fswHz * (outputRippleVoltage || 0.001))) * 1e6;
  } else {
    outputCapacitance = (iout * dutyCycle / (fswHz * (outputRippleVoltage || 0.001))) * 1e6;
  }

  const inputCapacitance = outputCapacitance * 0.5;
  const outputPower = vout * iout;
  const inputPower = outputPower / efficiency;
  const losses = inputPower - outputPower;

  return {
    dutyCycle,
    inductance: Math.max(inductance, 0.01),
    rippleCurrent,
    peakCurrent,
    rmsCurrent,
    inputCurrent,
    outputCapacitance: Math.max(outputCapacitance, 0.01),
    inputCapacitance: Math.max(inputCapacitance, 0.01),
    outputRippleVoltage: outputRippleVoltage * 1000,
    switchVoltageStress: switchStress,
    diodeVoltageStress: diodeStress,
    outputPower,
    inputPower,
    losses,
    turnsRatio: ["flyback", "forward", "push-pull"].includes(topology) ? n : undefined,
  };
}

export function calculateMagnetics(inputs: MagneticInputs): MagneticResults {
  const { inductance, peakCurrent, bmax, ae, currentDensity, corePermeability, coreLengthMm } = inputs;
  const Lhenry = inductance * 1e-6;
  const aeMeter = ae * 1e-6;

  const turns = Math.ceil((Lhenry * peakCurrent) / (bmax * aeMeter));

  const mu0 = 4 * Math.PI * 1e-7;
  const lcMeter = coreLengthMm * 1e-3;
  const airGapM = (mu0 * turns * turns * aeMeter) / Lhenry - lcMeter / corePermeability;
  const airGapMm = Math.max(airGapM * 1000, 0);

  const alValue = (Lhenry / (turns * turns)) * 1e9;

  const peakArea = peakCurrent / currentDensity;
  const wireDiameter = Math.sqrt((4 * peakArea) / Math.PI);

  const windowAreaUsed = turns * peakArea;
  const fillFactor = windowAreaUsed / inputs.windowArea;

  return {
    turns,
    airGapMm: Math.round(airGapMm * 100) / 100,
    wireAreaMm2: Math.round(peakArea * 1000) / 1000,
    wireDiameterMm: Math.round(wireDiameter * 100) / 100,
    fillFactor: Math.round(fillFactor * 1000) / 1000,
    alValue: Math.round(alValue * 10) / 10,
  };
}

export function calculateThermal(inputs: ThermalInputs): ThermalResults {
  const { totalLoss, ambientTemp, maxJunctionTemp, thetaJC, thetaCS } = inputs;

  const totalThetaMax = (maxJunctionTemp - ambientTemp) / totalLoss;
  const maxThetaSA = totalThetaMax - thetaJC - thetaCS;

  const thetaTotal = thetaJC + thetaCS + Math.max(maxThetaSA, 0);
  const junctionTemp = ambientTemp + totalLoss * thetaTotal;
  const tempRiseHeatsink = totalLoss * Math.max(maxThetaSA, 0);
  const heatsinkTemp = ambientTemp + tempRiseHeatsink;
  const caseTemp = heatsinkTemp + totalLoss * thetaCS;

  return {
    maxThetaSA: Math.round(maxThetaSA * 100) / 100,
    junctionTemp: Math.round(junctionTemp * 10) / 10,
    tempRiseHeatsink: Math.round(tempRiseHeatsink * 10) / 10,
    heatsinkTemp: Math.round(heatsinkTemp * 10) / 10,
    caseTemp: Math.round(caseTemp * 10) / 10,
  };
}
