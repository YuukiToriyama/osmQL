# osmQL

Easy access to OSM's gold mine of information.

## Usage

```javascript
(async () => {
	const osmQuery = new OSMQuery({
		timeout: 25,
		bbox: {
			south: 35.0,
			west: 135.73,
			north: 35.05,
			east: 135.79,
		},
	});
	const query = osmQuery.fromQLString("node['name' ~ '^松屋'];out;");
	console.log(query.toString());
	query.query().then((result) => {
		console.log(result);
	});
})();
```

```text
// sample.ql
[out:json];
node
	(35.0, 135.73, 35.05, 135.79)
	['name' ~ '郵便局$'];
out;
```

```javascript
(async () => {
	const osmQuery = new OSMQuery({});
	const query = osmQuery.fromQLFile("./sample.ql");
	query.query().then((result) => {
		console.log(result);
	});
})();
```

## Options

- `endPoint`
  - Overpass API URL
  - (default) `https://overpass-api.de/api/interpreter`
