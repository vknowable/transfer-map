import './App.css';
import Graph from "react-vis-network-graph";
import React, { useState, useEffect, useRef } from 'react';
import { genNodesEdges } from './utils/node_utils';

const options = {
  layout: {
    hierarchical: false,
    improvedLayout: true
  },
  edges: {
    color: "#BBB",
    physics: true
  },
  nodes: {
    shape: "box",
    shadow: true,
    physics: false,
    borderWidth: 2,
    margin: 10,
    shapeProperties: { borderRadius: 8 },
    font: { color: '#121212', size: 12 }
  },
};

const endpoint = process.env.REACT_APP_API_URL


function App() {

  ////////////////////////////
  // load data from api
  async function refreshData(endpoint) {
    try {
      const response = await fetch(endpoint)
      
      // handle 404 etc type errors
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      const txData = await response.json()
      const { offsetWidth, offsetHeight } = graphContainer.current

      setState({
        graph: genNodesEdges(txData.txdata, offsetWidth-400, offsetHeight-60),
        events: {}
      })
    }
    catch (error) {
      console.error("Api fetch error:", error)
    }
  }

  ////////////////////////////
  // load initial data
  useEffect(() => {
    const initState = async () => await refreshData(endpoint)
    initState()
      .catch(console.error)
  }, [])

  ////////////////////////////
  // eye tracking
  useEffect(() => {
    const handleMouseMove = (event) => {
      const eyeL = eyeRefL.current
      const eyeR = eyeRefR.current
      if (eyeL && eyeR) {
        [eyeL, eyeR].forEach(eye => {
          const x = eye.offsetLeft + eye.offsetWidth / 2;
          const y = eye.offsetTop + eye.offsetHeight / 2;
          const rad = Math.atan2(event.pageX - x, event.pageY - y);
          const rot = (rad * (180 / Math.PI) * -1) + 180;
  
          eye.style.transform = `rotate(${rot}deg)`;
        })
      }
    }
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    }
  }, [])

  ////////////////////////////
  // component constants
  const emptyState = {
    graph: { nodes: [], edges: [] },
    events: {}
  }

  const [state, setState] = useState(emptyState)
  const { graph, events } = state;
  const graphContainer = useRef(null)
  const eyeRefL = useRef(null)
  const eyeRefR = useRef(null)

  ////////////////////////////////////////////////////////

  return (
    <div>
      <div className='header'>

        <div class='.container' >
          <div class='eye' ref={eyeRefL}></div>
          <div class='eye' ref={eyeRefR}></div>
        </div>

        <h1>Transfer Map</h1>
        <p>Front-end: <a href='https://github.com/vknowable/transfer-map/tree/main'>https://github.com/vknowable/transfer-map</a></p>
        <p>Back-end: <a href='https://github.com/vknowable/transfer-map-backend/tree/master'>https://github.com/vknowable/transfer-map-backend</a></p>
        <button onClick={() => refreshData(endpoint)}>Refresh</button>
      </div>
      <p style={{ marginTop: "2em", textAlign: "center" }}>Click and drag nodes for a better view or use scroll wheel to zoom in/out</p>
      <div className='graph-container' ref={graphContainer}>
        <Graph graph={graph} options={options} events={events} style={{ height: "640px" }} />
      </div>
    </div>
  );
}

export default App;
