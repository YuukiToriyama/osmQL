export interface OverpassAPISettings {
	timeout?: number
	maxsize?: number
	out?: "json" | "xml" | "csv" | "custom" | "popup"
	date?: string // ISO8601形式
}
export interface OverpassAPIResult {
	version: number
	generator: string
	elements: OverpassAPIResultElement[]
}
interface OverpassAPIResultElement {
	type: string
	id: number
	lat: number
	lon: number
	tags: Record<string, any>
}