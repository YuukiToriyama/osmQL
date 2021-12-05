# osmQL

Easy access to OSM's gold mine of information.

## Usage

```javascript
const osmQuery = new OSMQuery({});
const qlString = "[out:json];node(57.7,11.9,57.8,12.0)[amenity=bar];out;";
const query = osmQuery.fromQLString(qlString);
query.query().then((result) => {
	console.log(result);
});
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
