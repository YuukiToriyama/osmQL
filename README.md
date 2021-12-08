# osmQL

Easy access to OSM's gold mine of information.

## Abstract

JavaScript で Overpass API にアクセスするためのライブラリです。
Overpass QL を記述したファイルを読み込んで実行する機能だけでなく、ユーティリティを用いてクエリを作成する機能もあります。
かんたんなクエリの実行に便利であるほか、クエリ言語にあまり親しみがないユーザーでもかんたんに Overpass API に触れることができます。

## Installation

```bash
npm install @toriyama/osmql
```

## Usage

大きく分けて 2 つの使い方があります。

- 手書きの OverpassQL を実行する
- `QueryBuilder`を用いてクエリを作成し実行する

### 手書きの OverpassQL を実行する

クラス`OSMQuery`をインポートしたらまずインスタンスを作成してください。

```javascript
import { OSMQuery } from "@toriyama/osmql";
const osmQuery = new OSMQuery(options);
```

`options`には次のオプションを指定できます。

| オプション | デフォルト値                            | 説明                                                                                                                                         |
| ---------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| endPoint   | https://overpass-api.de/api/interpreter | Overpass API を提供しているサーバーの URL を指定します。                                                                                     |
| bbox       | undefined                               | 東西南北の緯度経度を指定し検索結果を絞り込みます。 例) `{ south: 35.0, west: 135.73, north: 35.05, east: 135.79 }`                           |
| timeout    | 180                                     | 処理時間が指定した秒数以上になる場合処理を中断します。                                                                                       |
| maxsize    | 536870912                               | 処理に用いられる一時メモリの上限サイズを指定できます。                                                                                       |
| date       | undefined                               | 指定した日時以前のデータから検索します。日時は[ISO 8601](https://ja.wikipedia.org/wiki/ISO_8601)形式で記述します。例) `2021-11-20T21:00:00Z` |

#### クエリ文字列を実行する

`fromQLString`メソッドを利用します。

```javascript
const osmQuery = new OSMQuery();
const query = osmQuery.fromQLString(
	"node(35.0, 135.73, 35.05, 135.79)['name' ~ '郵便局$'];out;"
);
query.execute().then((result) => {
	const geojson = result.toGeoJSON();
	console.log(geojson);
});
```

```javascript
{
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'node/796933156',
      properties: [Object],
      geometry: [Object]
    },
    {
      type: 'Feature',
      id: 'node/1422960082',
      properties: [Object],
      geometry: [Object]
    },
    ...
  ]
}
```

#### ファイルからクエリを読み込んで実行

`fromQLFile`メソッドを用います。

```text
// sample.ql
node
	(35.0, 135.73, 35.05, 135.79)
	['name' ~ '郵便局$'];
out;
```

```javascript
const osmQuery = new OSMQuery();
const query = osmQuery.fromQLFile("./sample.ql");
query.execute().then((result) => {
	const geojson = result.toGeoJSON();
	console.log(geojson);
});
```

### `QueryBuilder`を用いてクエリを作成し実行する(experimental)

`OSMQuery.queryBuilder()`を用いると OverpassQL が書けなくてもかんたんなクエリを作成し実行することができます。

![image](https://i.imgur.com/OVL34kd.png)

京都の市街地にある郵便局の一覧を取得する次のクエリを`QueryBuilder`を使って実行してみましょう。

```text
node
	(35.0, 135.73, 35.05, 135.79)
	['name' ~ '郵便局$'];
out;
```

```javascript
const query = OSMQuery.queryBuilder({
	category: "node",
});
query.setBounding({
	south: 35.0,
	west: 135.73,
	north: 35.05,
	east: 135.79,
});
query.filterBy("name")(/郵便局$/);
OSMQuery.get(query).then((result) => {
	console.log(result.toGeoJSON());
});
```

## Contribution

追加して欲しい機能などがあれば Issue からお気軽にお申し付けください！

## Todo

- [ ] ブラウザでも実行できるようにする
- [ ] 詳細なドキュメントを作成
- [ ] 複雑なクエリも QueryBuilder を使って生成できるようにする

## Author

Torichan ([@CoconMap](https://twitter.com/CoconMap))
