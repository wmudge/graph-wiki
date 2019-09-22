import { Query, Graph } from "./core/query.js";

//    .addEdge("A", "B")
//    .addEdge("A", "C", 2)
//    .addEdge("A", "H", 3)
//    .addEdge("B", "D")
//    .addEdge("C", "E", 2)
//    .addEdge("D", "F", 3)
//    .addEdge("E", "D")
//    .addEdge("E", "G", 2)
//    .addEdge("E", "H", 3)
//    .addEdge("F", "B");

const store = [
    {
        "id": 1001,
        "name": "A",
        "tags": [ 1002, 1003, 1008 ],
        "body": "Foo bar @[B] baz"
    },
    {
        "id": 1002,
        "name": "B",
        "tags": [ 1004 ],
        "body": "Foo bar baz"
    },
    {
        "id": 1003,
        "name": "C",
        "tags": [ 1005 ],
        "body": "Foo bar baz"
    },
    {
        "id": 1004,
        "name": "D",
        "tags": [ 1006 ],
        "body": "Foo bar @[C] baz"
    },
    {
        "id": 1005,
        "name": "E",
        "tags": [ 1004, 1007, 1008 ],
        "body": "Foo bar baz"
    },
    {
        "id": 1006,
        "name": "F",
        "tags": [ 1002 ],
        "body": "Foo bar @[C] baz"
    },
    {
        "id": 1007,
        "name": "G",
        "body": "Foo bar @[C] baz"
    },
    {
        "id": 1008,
        "name": "H",
        "body": "Foo bar @[C] baz"
    },
];

function debug(variable) {
    console.log(JSON.stringify(variable, null, '  '));
}

function has(object, key) {
    return object ? Object.prototype.hasOwnProperty.call(object, key) : false;
}

// On Tags only right now
const edges = store
    .filter(post => has(post, 'tags'))
    .flatMap(post => post.tags
        .map(tag => [ post.id, tag ])
    );

//debug(edges);

const query = new Query(store, edges);

var bfs;
/*
bfs = query.bfs(store[0]);
debug(bfs.map(node => node.id));

bfs = query.bfs(store[1]);
debug(bfs.map(node => node.id));

bfs = query.bfs(store[2]);
debug(bfs.map(node => node.id));

bfs = query.bfs(store[3]);
debug(bfs.map(node => node.id));

bfs = query.bfs(store[4]);
debug(bfs.map(node => node.id));
*/
///
///
/*
[0, 4].forEach(function(v) {
    console.log(`---- ${store[v].name} ----`);

    console.log("OUTBOUND");
    bfs = query.bfs(store[v], Graph.OUTBOUND);
    debug(bfs.map(node => node.name));

    console.log("INBOUND");
    bfs = query.bfs(store[v], Graph.INBOUND);
    debug(bfs.map(node => node.name));

    console.log("UNDIRECTED");
    bfs = query.bfs(store[v], Graph.UNDIRECTED);
    debug(bfs.map(node => node.name));
});
*/
///
///
/*
[[4,0], [0,6], [2,1]].forEach(function(e) {
    let source = e[0];
    let target = e[1];

    console.log(`---- ${store[source].name} connected to ${store[target].name} ----`);

    console.log("OUTBOUND");
    bfs = query.bfsConnected(store[source], store[target], Graph.OUTBOUND);
    debug(bfs);

    console.log("INBOUND");
    bfs = query.bfsConnected(store[source], store[target], Graph.INBOUND);
    debug(bfs);

    console.log("UNDIRECTED");
    bfs = query.bfsConnected(store[source], store[target], Graph.UNDIRECTED);
    debug(bfs);
});
*/
///
///
/*
var foo;

foo = query.query("blarg(`2`, 'something')");
debug(foo);

foo = query.query("blarg('foo', 'something')");
debug(foo);
*/
///
///

var result;
// result = query.query("[?name=='A']");
// debug(result);

// result = query.query("[?name == 'A' || name == 'B'].name");
// debug(result);

// result = query.query("[].name");
// debug(result);

//result = query.query("[?name == 'A' && connected(&[?name == 'C'])].name");
//debug(result);

result = query.query("[? (name == 'A' || name == 'B') && connected(@)]");
debug(result);

//store.push({ "foo": "c" });
//console.log(query.query("[].name"));

//result = query.query("[?name")
