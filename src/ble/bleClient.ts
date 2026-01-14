export type Telemetry = {
  ts: number;
  tempC: number;
  humidityPct: number;
  actuatorPct?: number;
};

type BleHandles = {
  device: BluetoothDevice;
  server: BluetoothRemoteGATTServer;
  service: BluetoothRemoteGATTService;
  telemetryChar: BluetoothRemoteGATTCharacteristic;
  commandChar: BluetoothRemoteGATTCharacteristic;
};

export class BleClient {
  private handles: BleHandles | null = null;
  private onTelemetry?: (t: Telemetry) => void;
  private telemetryListener?: EventListener;

  constructor(
    private readonly uuids: {
      service: BluetoothServiceUUID;
      telemetryChar: BluetoothCharacteristicUUID;
      commandChar: BluetoothCharacteristicUUID;
    }
  ) {}

  isConnected(): boolean {
    return !!this.handles?.server?.connected;
  }

  async connect(onTelemetry: (t: Telemetry) => void): Promise<void> {
    this.onTelemetry = onTelemetry;

    if (!navigator.bluetooth) {
      throw new Error("Web Bluetooth not available in this browser.");
    }

    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: [this.uuids.service] }],
      optionalServices: [this.uuids.service],
    });

    device.addEventListener("gattserverdisconnected", () => {
      // You can attempt auto-reconnect here if desired.
      this.handles = null;
    });

    const server = await device.gatt!.connect();
    const service = await server.getPrimaryService(this.uuids.service);

    const telemetryChar = await service.getCharacteristic(this.uuids.telemetryChar);
    const commandChar = await service.getCharacteristic(this.uuids.commandChar);

    this.handles = { device, server, service, telemetryChar, commandChar };

    await this.startTelemetryNotifications();
  }

  async disconnect(): Promise<void> {
    if (!this.handles) return;

    try {
      await this.stopTelemetryNotifications();
    } finally {
      this.handles.server.disconnect();
      this.handles = null;
    }
  }

  /** Send a command as JSON (simple + debuggable). */
  async sendCommand(cmd: unknown): Promise<void> {
    if (!this.handles) throw new Error("Not connected.");

    const payload = new TextEncoder().encode(JSON.stringify(cmd));
    // Many BLE stacks have a 20–247 byte limit depending on MTU; keep commands small.
    await this.handles.commandChar.writeValue(payload);
  }

  private async startTelemetryNotifications(): Promise<void> {
    if (!this.handles) throw new Error("Not connected.");

    await this.handles.telemetryChar.startNotifications();

    // Keep a stable reference so we can remove it on disconnect.
    this.telemetryListener = (event: Event) => {
      const char = event.target as BluetoothRemoteGATTCharacteristic;
      const value = char.value;
      if (!value) return;

      const t = this.parseTelemetry(value);
      this.onTelemetry?.(t);
    };

    this.handles.telemetryChar.addEventListener(
      "characteristicvaluechanged",
      this.telemetryListener
    );
  }

  private async stopTelemetryNotifications(): Promise<void> {
    if (!this.handles || !this.telemetryListener) return;

    this.handles.telemetryChar.removeEventListener(
      "characteristicvaluechanged",
      this.telemetryListener
    );
    this.telemetryListener = undefined;

    try {
      await this.handles.telemetryChar.stopNotifications();
    } catch {
      // Some devices disconnect before stopNotifications succeeds; safe to ignore.
    }
  }

  /**
   * Telemetry parsing strategy:
   * Option 1 (recommended initially): device sends UTF-8 JSON lines.
   * Option 2: binary packet (more efficient), then parse with DataView.
   */
  private parseTelemetry(value: DataView): Telemetry {
    // JSON telemetry:
    const text = new TextDecoder().decode(value.buffer);
    // Example: {"tempC":23.4,"humidityPct":61.2,"actuatorPct":42}
    try {
      const obj = JSON.parse(text);
      return {
        ts: Date.now(),
        tempC: Number(obj.tempC),
        humidityPct: Number(obj.humidityPct),
        actuatorPct: obj.actuatorPct != null ? Number(obj.actuatorPct) : undefined,
      };
    } catch {
      // If parsing fails, surface diagnostic values.
      return {
        ts: Date.now(),
        tempC: NaN,
        humidityPct: NaN,
      };
    }
  }
}
