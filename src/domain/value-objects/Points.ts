export class Points {
  private readonly _value: number;

  constructor(value: number) {
    if (!Number.isInteger(value) || value < 0) {
      throw new Error(`Points must be a non‑negative integer. Got ${value}`);
    }
    this._value = value;
  }

  get value(): number {
    return this._value;
  }

  add(delta: Points): Points {
    return new Points(this._value + delta._value);
  }

  subtract(delta: Points): Points {
    if (delta._value > this._value) {
      throw new Error('Cannot subtract more points than current value');
    }
    return new Points(this._value - delta._value);
  }

  equals(other: Points): boolean {
    return this._value === other._value;
  }
}
