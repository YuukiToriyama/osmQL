import { BBox, Polygon } from './type';

export interface QueryBuilderConstructor {
	category: "node" | "way" | "relation" | "derived" | "area"
}
export class QueryBuilder {
	private options: QueryBuilderConstructor
	private tagFilters: string[] = [];
	private boundingFilter: string = "";
	private userFilter: string = "";
	constructor(options: QueryBuilderConstructor) {
		this.options = options;
	}
	public filterBy = (tagName: string) => {
		return (value: string | RegExp) => {
			if (typeof value === "string") {
				this.tagFilters.push(`['${tagName}' = '${value}']`);
			} else if (value instanceof RegExp) {
				if (value.ignoreCase) {
					this.tagFilters.push(`['${tagName}' ~ '${value.source}', i]`);
				} else {
					this.tagFilters.push(`['${tagName}' ~ '${value.source}']`);
				}
			}
			return this;
		}
	}
	public setBounding = (bounding: BBox | Polygon) => {
		if (bounding instanceof Array) {
			const points = bounding.map(point => `${point.lat} ${point.lon}`).join(" ");
			this.boundingFilter = `(poly: "${points}")`;
		} else {
			this.boundingFilter = `(${bounding.south}, ${bounding.west}, ${bounding.north}, ${bounding.east})`;
		}
		return this;
	}
	public editedBy = (userName: string | string[] | number) => {
		if (typeof userName === "string") {
			this.userFilter = `(user: "${userName}")`;
		} else if (typeof userName === "number") {
			this.userFilter = `(uid: ${userName})`;
		} else {
			const users = userName.map(name => `"${name}"`).join(", ");
			this.userFilter = `(user: ${users})`;
		}
		return this;
	}
	public toString = () => {
		return [
			this.options.category,
			this.boundingFilter || "",
			this.userFilter || "",
			...(this.tagFilters || [""])
		].join("") + ";"
	}
}