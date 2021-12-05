import axios from 'axios';
import fs from 'fs';
import { OverpassAPIResult } from './type';

export interface OSMQueryConstructor {
	endPoint?: string
}
export class OSMQuery {
	endPoint: string
	private queryString: string
	constructor(options?: OSMQueryConstructor) {
		this.endPoint = options?.endPoint || "https://overpass-api.de/api/interpreter";
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
				data: this.queryString
			}
		}).then(response => response.data);
		return result as Promise<OverpassAPIResult>;
	}

	public toString = () => {
		return this.queryString;
	}
}
