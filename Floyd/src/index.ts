const MIN_DISTANCE = 1;
const MAX_DISTANCE = 200;
const MAX_CONNECTION_PER_NODE = 4;
const GRAPH_LENGTH = 7;

type NODE = [[number]];

class Floyd {
  private _nodeList: NODE = [[-1]];
  constructor() {
    this._nodeList = this._generateRandomGraph(
      GRAPH_LENGTH,
      MAX_CONNECTION_PER_NODE
    );
  }

  public getNodes(): NODE {
    return this._nodeList;
  }

  public findBestRouteBetweenTwoNodes(
    origin: number,
    destination: number
  ): { distance: number; path: string } {
    const nodes = this._nodeList.slice();
    let path: number[] = [origin];
    if (origin === destination) return { distance: 0, path: `${origin}` };

    if (
      origin < 0 ||
      this._nodeList.length <= origin ||
      destination < 0 ||
      this._nodeList.length <= destination
    )
      return { distance: -1, path: 'Invalid origin or destination.' };

    // intermediary
    for (let i = 0; i < this._nodeList.length; i++) {
    // origin
      for (let j = 0; j < this._nodeList.length; j++) {
    // destination
        for (let k = 0; k < this._nodeList.length; k++) {
          
          if (j === k || j === i || i === k) continue;
          let previousDistance = nodes[j][k];
          let newDistance = nodes[j][i] + nodes[i][k];

          if (newDistance < previousDistance) {
            nodes[j][k] = newDistance;
            nodes[j][k + this._nodeList.length] = i; // Store the intermediate node
          }
        }
      }
    }

    path = this._constructPath(origin, destination, nodes as NODE);
    return {
      distance: this._nodeList[origin][destination],
      path: path.join(' => '),
    };
  }

  private _generateRandomDistance(
    minDistance: number,
    maxDistance: number
  ): number {
    return Math.floor(
      Math.random() * (maxDistance - minDistance + 1) + minDistance
    );
  }

  private _generateRandomGraph(
    totalNodes: number,
    maxConnectionForEachNode: number = 4
  ): NODE {
    let nodeList: NODE = [[0]]; //INITIAL VALUE
    for (let i = 0; i < totalNodes; i++) {
      nodeList[i] = [0];
      let connectedNodes = 0;
      for (let j = 0; j < totalNodes; j++) {
        if (i === j) {
          nodeList[i][j] = 0;
          continue;
        } else if (
          connectedNodes < maxConnectionForEachNode ||
          maxConnectionForEachNode === 0
        )
          nodeList[i][j] = this._generateRandomDistance(
            MIN_DISTANCE,
            MAX_DISTANCE
          );
        else nodeList[i][j] = Infinity;

        connectedNodes += 1;
      }
      nodeList[i] = this._shuffleDistances(nodeList[i]);
      const originIndex = nodeList[i].findIndex(item => item === 0);
      nodeList[i].splice(originIndex, 1);
      nodeList[i].splice(i, 0, 0);
    }
    return nodeList;
  }

  private _shuffleDistances(distances: [number]): [number] {
    const shuffledDistances = [];
    while (distances.length) {
      const randomIndex = this._generateRandomDistance(0, distances.length - 1);
      shuffledDistances.push(distances[randomIndex]);
      distances.splice(randomIndex, 1);
    }

    return shuffledDistances as [number];
  }

  private _constructPath(
    origin: number,
    destination: number,
    nodes: NODE
  ): number[] {
    let path: number[] = [origin];
    let intermediate = nodes[origin][destination + this._nodeList.length];
    while (intermediate !== undefined) {
      path.push(intermediate);
      intermediate = nodes[intermediate][destination + this._nodeList.length];
    }

    path.push(destination);
    return path;
  }
}

const floyd = new Floyd();
console.log(floyd.getNodes());
console.log(floyd.findBestRouteBetweenTwoNodes(0, 3));
