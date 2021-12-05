import axios from 'axios';
import fs from 'fs';
import { OverpassAPISettings, OverpassAPIResult } from './type';

export interface OSMQueryConstructor extends OverpassAPISettings {
	endPoint?: string
	bbox?: {
		south: number
		west: number
		north: number
		east: number
	}
}
export class OSMQuery {
	endPoint: string
	settings: OverpassAPISettings
	bbox: {
		south: number
		west: number
		north: number
		east: number
	} | undefined
	private queryString: string
	constructor(options?: OSMQueryConstructor) {
		this.endPoint = options?.endPoint || "https://overpass-api.de/api/interpreter";
		this.settings = {
			timeout: options?.timeout || 180, // 180秒
			maxsize: options?.maxsize || 536870912, // 512MB
			out: "json",
			date: options?.date || undefined
		}
		this.bbox = options?.bbox || undefined;
	}

	public fromQLString = (queryString: string) => {
		this.queryString = queryString;
		return this;
	}
	public fromQLFile = (filePath: string) => {
		if (fs.existsSync(filePath) === false) {
			throw Error(`Tried to read ${filePath}, but there are no such a file`);
		}
		this.queryString = fs.readFileSync(filePath, {
			encoding: "utf8"
		});
		return this;
	}

	public query = async () => {
		if (this.queryString === undefined) {
			throw Error("You tried to send API request, but the query is empty.");
		}
		const result = axios.get(this.endPoint, {
			params: {
				data: this.toString()
			}
		}).then(response => response.data);
		return result as Promise<OverpassAPIResult>;
	}

	public toString = () => {
		const settings = Object.entries(this.settings).filter(x => x[1] !== undefined).map(x => `[${x[0]}:${x[1]}]`).join("");
		return settings + (this.bbox && `[bbox:${this.bbox.south}, ${this.bbox.west}, ${this.bbox.north}, ${this.bbox.east}]`) + ";\n" + this.queryString;
	}
}