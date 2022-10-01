import React, { Component } from "react";
import Node from "./Node/Node";
import {
  dijkstra,
  getNodesInShortestPathOrder,
} from "./algorithms/dijkstra";

import "./PathfindingVisualizer.css";

const START_NODE_ROW = 8;
const START_NODE_COL = 9;
const FINISH_NODE_ROW = 8;
const FINISH_NODE_COL = 30;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIspressed: false,
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIspressed: true });
    console.log("downpressed");

  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIspressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    console.log("enterpressed");
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIspressed: false });
    console.log("Uppressed");
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
   
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        
        }, 10 * i);
        
      }else{
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
      
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, 10 * i);
    }
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
   for(let i = 0; i < nodesInShortestPathOrder.length; i++){
   
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
       
      
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path"; 
         
      }, 50 * i);
    }
   
  }
  
  visualizeDijkstra() {
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
   
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }
  
      
  clearGrid() {
    if (!this.state.isRunning) {
      const newGrid = this.state.grid.slice();
      for (const row of newGrid) {
        for (const node of row) {
          let nodeClassName = document.getElementById(
            `node-${node.row}-${node.col}`,
          ).className;
          if (
            nodeClassName !== 'node node-start' &&
            nodeClassName !== 'node node-finish' &&
            nodeClassName !== 'node node-wall'
          ) {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              'node';
            node.isVisited = false;
            node.distance = Infinity;
         
            
          if (nodeClassName === 'node node-finish') {
            node.isVisited = false;
            node.distance = Infinity;
            node.isFinish=true;
          }
          if (nodeClassName === 'node node-start') {
            node.isVisited = false;
            node.distance = Infinity;
           node.isFinish=false;
            node.isStart = true;
            node.isWall = false;
            node.previousNode = null;
           
          }
        }
      }
    }
  }
}

  

  render(){
    const { grid, mouseIspressed } = this.state;
   

    return (
      <>
      <div className="header ">
        <p className="parra">PathfindingVisualizer</p>
        <nav>
        <button className="btn1" onClick={() => this.visualizeDijkstra()}>Visualize</button>
         <button className ="btn2" onClick={() =>this.clearGrid()}>Clear path</button>
        </nav>
      </div>
      
         
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { col, row, isStart, isFinish, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      row={row}
                      isStart={isStart}
                      isFinish={isFinish}
                      isWall={isWall}
                      mouseIspressed={mouseIspressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 18; row++) {
    const currentRow = [];
    for (let col = 0; col < 39; col++) {
      currentRow.push(createNode(col, row ));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
   isVisited: false,
   isWall : false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node, 
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode; 
  return newGrid;
};
