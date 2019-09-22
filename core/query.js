'use strict';

import * as jmespath from 'jmespath';

const Graph = {
    OUTBOUND:  1,
    INBOUND:  2,
    UNDIRECTED: 3
}

class Query {

    constructor(store, edges) {
        this.store = store;
        this.edges = edges;

        this.counter = 0;

        this.runtime = new jmespath.Runtime();

        this.runtime.addFunction("blarg", this.blarg, [
            { types: [this.runtime.types.NUMBER, this.runtime.types.STRING] },
            { types: [this.runtime.types.STRING] }
        ]);

        this.runtime.addFunction("connected", this.connected, [
            { types: [this.runtime.types.STRING, this.runtime.types.EXPREF, this.runtime.types.OBJECT] },
        ]);

        this.runtime.counter = 0;
        this.runtime.store = store;
        this.runtime.edges = edges;

        this.engine = new jmespath.Engine(this.runtime);
    }

    query(expression) {
        return this.engine.search(this.store, expression);
    }

    blarg(args) {
        console.log("blarg() called");
        console.log("Arguments: " + args + "; Counter: " + ++this.counter);
        return Math.abs(args[0]);
    }

    bfsFindAdjacent(nodeId, vertices, edges, subgraph, orientation) {
        let adjacentNodes = [];

        edges.forEach(function(edge) {
            if (orientation & Graph.OUTBOUND && edge[0] === nodeId) {
                let node = vertices.find(function(vertex) {
                    return vertex.id === edge[1];
                });

                if (node) {
                    let adjacentIndex = vertices.indexOf(node);
                    let adjacent = vertices[adjacentIndex];

                    if (subgraph[adjacent.id] == undefined) {
                        adjacentNodes.push(adjacent);
                    }
                }
            } else if (orientation & Graph.INBOUND && edge[1] === nodeId) {
                let node = vertices.find(function(vertex) {
                    return vertex.id === edge[0];
                });

                if (node) {
                    let adjacentIndex = vertices.indexOf(node);
                    let adjacent = vertices[adjacentIndex];

                    if (subgraph[adjacent.id] === undefined) {
                        adjacentNodes.push(adjacent);
                    }
                }
            }
        });

        return adjacentNodes;
    }

    updateSubgraph(subgraph, rootNode, adjacentNodes) {
        if (subgraph[rootNode.id] === undefined) {
            adjacentNodes.forEach(function(node) {
                let subNode = {};
                subNode.node = node;
                subNode.predecessor = rootNode;
                subNode.distance = 1;
                subgraph[node.id] = subNode;
            });
        } else {
            adjacentNodes.forEach(function(node) {
                let subNode = {};
                subNode.node = node;
                subNode.predecessor = rootNode;
                subNode.distance = subgraph[rootNode.id].distance + 1;
                subgraph[node.id] = subNode;
            });
        }

        return adjacentNodes;
    }

    bfs(source, orientation = Graph.OUTBOUND) {
        let queue = [];
        let visited = [];
        let explored = [];
        let subgraph = {};

        let vertices = this.store.filter(node => node.id !== source.id);

        queue.push(source);
        visited.push(source);

        while (queue.length != 0) {
            let currentNode = queue.shift();
            let adjacentNodes = this.bfsFindAdjacent(currentNode.id, vertices, this.edges, subgraph, orientation);

            adjacentNodes.forEach(function(node) {
                queue.push(node);
                visited.push(node);
            });

            this.updateSubgraph(subgraph, currentNode, adjacentNodes);

            explored.push(currentNode);
        }

        return visited;
    }

    bfsConnected(source, target, orientation = Graph.OUTBOUND) {
        let queue = [];
        let visited = [];
        let explored = [];
        let subgraph = {};

        let vertices = this.store.filter(node => node.id !== source.id);

        queue.push(source);
        visited.push(source);

        while (queue.length != 0) {
            let currentNode = queue.shift();

            if (currentNode.id === target.id) return true;

            // if (subgraph[currentNode.id] !== undefined && subgraph[currentNode.id].distance > depth) {
            //     return false;
            // }

            let adjacentNodes = this.bfsFindAdjacent(currentNode.id, vertices, this.edges, subgraph, orientation);

            adjacentNodes.forEach(function(node) {
                queue.push(node);
                visited.push(node);
            });

            this.updateSubgraph(subgraph, currentNode, adjacentNodes);

            explored.push(currentNode);
        }

        return false;
    }

    // TODO - consider using object projections, not array projects, for store
    // TODO - match/find function to BFS
    // TODO - optional arguments for JMESpath functions
    // TODO - depth argument to BFS
    // TODO - weights to graph in general
    // TODO - move graph algos to separate module and then import
    // TODO - review sort_by and its use of KeyFunction for expression type returns
    // TODO - review signature
    // TODO - compare map of node-to-adjacents (both degrees) vs. current adjacency list
    // TODO - constructor parameters for edge property definition and error message
    // TODO - require entries as array(nodes) -- eval node vs each entry for boolean

    // boolean connected(expression->object, expression->object)
    // e.g. connected(@, &[name=="descendant"])
    //      connected(&[name=="ancestor"], @)
    connected(args) {
        console.log(`connected(): ${JSON.stringify(args)}`);

        var typeName = this._getTypeName(args);

        console.log(`Type: ${typeName}`);
        return true;
        //var mapped = [];
        var interpreter = this._interpreter;
        var exprefNode = args[0];
        //var elements = resolvedArgs[1];
        //for (var i = 0; i < elements.length; i++) {
        //    mapped.push(interpreter.visit(exprefNode, elements[i]));
        //}

        //return mapped;
        let result = interpreter.visit(exprefNode, this.store);
        console.log(`Result: ${result}`);
        return result;
    }

    markDiscovered(node) {
        // TODO - Turn into "twin" in order to keep each query separate
        return node.discovered = true;
    }



}

export { Query, Graph };