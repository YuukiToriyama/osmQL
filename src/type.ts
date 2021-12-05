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