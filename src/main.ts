import axios from 'axios';
import fs from 'fs';
import OsmToGeoJSON, { Options as osmtogeojsonOptions } from 'osmtogeojson';
import { QueryBuilder, QueryBuilderConstructor } from './QueryBuilder';
import { OverpassAPISettings, OverpassAPIResult, BBox } from './type';

export interface OSMQueryConstructor extends OverpassAPISettings {
	endPoint?: string
	bbox?: BBox
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

	// QueryBuilderを使ったリクエスト
	static queryBuilder = (options: QueryBuilderConstructor) => {
		return new QueryBuilder(options);
	}
	static get = (queryBuilder: QueryBuilder) => {
		const osmQuery = new OSMQuery();
		osmQuery.fromQLString(queryBuilder.toString() + "out;");
		console.log(osmQuery.toString());
		return osmQuery.execute();
	}

	// 手書きのQLを使ったリクエスト
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

	// クエリを実行する
	public execute = async () => {
		if (this.queryString === undefined) {
			throw Error("You tried to send API request, but the query is empty.");
		}
		const result = await axios.get(this.endPoint, {
			params: {
				data: this.toString()
			}
		}).then(response => {
			return response.data as OverpassAPIResult
		}).catch(error => {
			throw error;
		});
		return new OSMQueryResult(result);
	}

	public toString = () => {
		const settings = Object.entries(this.settings).filter(x => x[1] !== undefined).map(x => `[${x[0]}:${x[1]}]`).join("");
		return settings + (this.bbox ? `[bbox:${this.bbox.south}, ${this.bbox.west}, ${this.bbox.north}, ${this.bbox.east}]` : "") + ";\n" + this.queryString;
	}
}

class OSMQueryResult {
	data: OverpassAPIResult;
	constructor(overpassAPIResult: OverpassAPIResult) {
		this.data = overpassAPIResult;
	}

	public toGeoJSON = (options?: osmtogeojsonOptions) => {
		return OsmToGeoJSON.toGeojson(this.data, options);
	}
}