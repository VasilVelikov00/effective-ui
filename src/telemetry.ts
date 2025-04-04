type TelemetryEntry = {
  source: string
  key: string
  type: "set" | "hit"
  input?: unknown
}

class TelemetryTracker {
  private entries: Array<TelemetryEntry> = []

  registerCacheSet(source: string, key: string, input?: unknown): void {
    this.entries.push({ source, key, type: "set", input })
    console.log(`[Telemetry] Cached: ${source} [${key}]`)
  }

  registerCacheHit(source: string, key: string): void {
    this.entries.push({ source, key, type: "hit" })
    console.log(`[Telemetry] Reused: ${source} [${key}]`)
  }

  report(): void {
    console.table(this.entries)
  }

  reset(): void {
    this.entries = []
  }

  getAll(): Array<TelemetryEntry> {
    return [...this.entries]
  }
}

export const Telemetry = new TelemetryTracker()
