import { QueryBuilder } from './QueryBuilder';

describe("QueryBuilder.filterBy()", () => {
	test("amenity = \"parking\"", () => {
		const query = new QueryBuilder({
			category: "node"
		});
		query.filterBy("amenity")("parking");
		expect(query.toString()).toStrictEqual(`node['amenity' = 'parking'];`);
	});
	test("name ~ \"郵便局$\"", () => {
		const query = new QueryBuilder({
			category: "node"
		});
		query.filterBy("name")(/郵便局$/);
		expect(query.toString()).toStrictEqual(`node['name' ~ '郵便局$'];`)
	});
});

describe("QueryBuilder.setBounding()", () => {
	const query = new QueryBuilder({
		category: "node"
	});
	test("square", () => {
		query.setBounding({
			south: 34.9,
			west: 135.73,
			north: 35.05,
			east: 135.79
		});
		expect(query.toString()).toStrictEqual(`node(34.9, 135.73, 35.05, 135.79);`);
	});
	test("polygon", () => {
		const triangle = [
			{ lat: 50.7, lon: 7.1 },
			{ lat: 50.7, lon: 7.2 },
			{ lat: 50.75, lon: 7.15 }
		];
		query.setBounding(triangle);
		expect(query.toString()).toStrictEqual(`node(poly: "50.7 7.1 50.7 7.2 50.75 7.15");`);
	});
});

describe("QueryBuilder.editedBy()", () => {
	const query = new QueryBuilder({
		category: "node"
	});
	test("single username", () => {
		query.editedBy("Torichan");
		expect(query.toString()).toStrictEqual(`node(user: "Torichan");`);
	});
	test("uid", () => {
		query.editedBy(13633227);
		expect(query.toString()).toStrictEqual(`node(uid: 13633227);`);
	});
	test("some users", () => {
		query.editedBy(["Torichan", "Torichan2", "Torichan3"]);
		expect(query.toString()).toStrictEqual(`node(user: "Torichan", "Torichan2", "Torichan3");`)
	});
});