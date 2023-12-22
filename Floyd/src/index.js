var MIN_DISTANCE = 1;
var MAX_DISTANCE = 200;
var MAX_CONNECTION_PER_NODE = 4;
var GRAPH_LENGTH = 7;
var Floyd = /** @class */ (function () {
    function Floyd() {
        this._nodeList = [[-1]];
        this._nodeList = this._generateRandomGraph(GRAPH_LENGTH, MAX_CONNECTION_PER_NODE);
    }
    Floyd.prototype.getNodes = function () {
        return this._nodeList;
    };
    Floyd.prototype.findBestRouteBetweenTwoNodes = function (origin, destination) {
        var nodes = this._nodeList.slice();
        var path = [origin];
        if (origin === destination)
            return { distance: 0, path: "".concat(origin) };
        if (origin < 0 ||
            this._nodeList.length <= origin ||
            destination < 0 ||
            this._nodeList.length <= destination)
            return { distance: -1, path: 'Invalid origin or destination.' };
        // intermediary
        for (var i = 0; i < this._nodeList.length; i++) {
            // origin
            for (var j = 0; j < this._nodeList.length; j++) {
                // destination
                for (var k = 0; k < this._nodeList.length; k++) {
                    if (j === k || j === i || i === k)
                        continue;
                    var previousDistance = nodes[j][k];
                    var newDistance = nodes[j][i] + nodes[i][k];
                    if (newDistance < previousDistance) {
                        nodes[j][k] = newDistance;
                        nodes[j][k + this._nodeList.length] = i; // Store the intermediate node
                    }
                }
            }
        }
        path = this._constructPath(origin, destination, nodes);
        return {
            distance: this._nodeList[origin][destination],
            path: path.join(' => '),
        };
    };
    Floyd.prototype._generateRandomDistance = function (minDistance, maxDistance) {
        return Math.floor(Math.random() * (maxDistance - minDistance + 1) + minDistance);
    };
    Floyd.prototype._generateRandomGraph = function (totalNodes, maxConnectionForEachNode) {
        if (maxConnectionForEachNode === void 0) { maxConnectionForEachNode = 4; }
        var nodeList = [[0]]; //INITIAL VALUE
        for (var i = 0; i < totalNodes; i++) {
            nodeList[i] = [0];
            var connectedNodes = 0;
            for (var j = 0; j < totalNodes; j++) {
                if (i === j) {
                    nodeList[i][j] = 0;
                    continue;
                }
                else if (connectedNodes < maxConnectionForEachNode ||
                    maxConnectionForEachNode === 0)
                    nodeList[i][j] = this._generateRandomDistance(MIN_DISTANCE, MAX_DISTANCE);
                else
                    nodeList[i][j] = Infinity;
                connectedNodes += 1;
            }
            nodeList[i] = this._shuffleDistances(nodeList[i]);
            var originIndex = nodeList[i].findIndex(function (item) { return item === 0; });
            nodeList[i].splice(originIndex, 1);
            nodeList[i].splice(i, 0, 0);
        }
        return nodeList;
    };
    Floyd.prototype._shuffleDistances = function (distances) {
        var shuffledDistances = [];
        while (distances.length) {
            var randomIndex = this._generateRandomDistance(0, distances.length - 1);
            shuffledDistances.push(distances[randomIndex]);
            distances.splice(randomIndex, 1);
        }
        return shuffledDistances;
    };
    Floyd.prototype._constructPath = function (origin, destination, nodes) {
        var path = [origin];
        var intermediate = nodes[origin][destination + this._nodeList.length];
        while (intermediate !== undefined) {
            path.push(intermediate);
            intermediate = nodes[intermediate][destination + this._nodeList.length];
        }
        path.push(destination);
        return path;
    };
    return Floyd;
}());
var floyd = new Floyd();
console.log(floyd.getNodes());
console.log(floyd.findBestRouteBetweenTwoNodes(0, 3));
