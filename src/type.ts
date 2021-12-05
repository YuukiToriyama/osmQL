export type Polygon = {
	lat: number
	lon: number
}[];
export interface BBox {
	south: number
	west: number
	north: number
	east: number
}
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
export type Feature = {
	type: "Feature"
	geometry: {
		type: string
		coordinates: [number, number][]
	}
	properties: Record<string, string>
}
export type GeoJson = {
	type: "FeatureCollection"
	features: Feature[]
}