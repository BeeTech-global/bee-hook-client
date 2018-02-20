import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import { Button, Table } from 'react-bootstrap'

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import BinService from '../services/BinService';
const url = 'https://hook-mock.herokuapp.com';

const binService = new BinService({ url });

const App = () => (
  <Router basename="/bee-hook-client" >
    <div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/bins">List all Bins</Link>
        </li>
      </ul>

      <hr />

      <Route exact path="/" component={Home} />
      <Route exact path="/bin/:hash" component={Results} />
      <Route exact path="/bins" component={List} />
    </div>
  </Router>
);

class List extends Component {
  constructor(params) {
    super(params);
    this.state = { bins: [] };
  }

  componentDidMount(){
    this.loadBins();
  }

  loadBins() {
    binService.getAll()
      .then(result => {
        this.setState({ bins: result });
      });
  }

  renderBin(bin){
    return (
      <tr>
        <td>{bin.hash}</td>
        <td>{bin.created_at}</td>
        <td>{bin.last_update}</td>
        <td>{bin.total}</td>
        <td><Link to={`/bin/${bin.hash}`}>Go To {bin.hash}</Link></td>
      </tr>
    )
  }

  render() {
    return (
      <div>
        <h2>List</h2>
        <h3>Total: {this.state.bins.length}</h3>
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th>Bin</th>
              <th>Created At</th>
              <th>Last request</th>
              <th>Total</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            { this.state.bins.map(this.renderBin) }
          </tbody>
        </Table>
      </div>
    );
  }
}

class Results extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hash: props.match.params.hash,
      bins: [],
      total: null,
      binUrl: `${url}/bin/${props.match.params.hash}`
    };
  }

  componentDidMount(){
    this.loadResults();
  }

  loadResults() {
    binService.getByHash(this.state.hash)
      .then((result) => {
        console.log(result.bins.total)
        this.setState({
          bins: result.bins,
          total: result.bins.length
        });
      });
  }
  
  renderRequest(request, index) {
    return (
      <li key={index}>
        <p>Time: {request.created_at}</p>
        <p>Method: {request.method}</p>
        
        <p>Headers:</p>
        <ul>
          {
            Object.entries(request.headers)
              .map(([key, value], index) => (
                <li key={index}>
                  <b>{key}:</b> {value}
                </li>
              ))
          }
        </ul>
        
        <p>Body:</p>
        <code>{ JSON.stringify(request.body, null, 2) }</code>
        
        <p>Query:</p>
        <ul>
          {
            Object.entries(request.query)
              .map(([key, value], index) => (
                <li key={index}>
                  <b>{key}:</b> {value}
                </li>
              ))
          }
        </ul>
      </li>
    )
  }

  render() {
    return (
      <div>
        <h2>Results</h2>
        <h3>Total: {this.state.total}</h3>
        <h3>Url: {this.state.binUrl}</h3>
        <ul>
          { this.state.bins.reverse().map(this.renderRequest) }
        </ul>
      </div>
    );
  }
}

class Home extends Component {
  constructor(params) {
    super(params);
    this.state = {};
  }

  createBin() {
    binService.generateHash()
      .then((result) => {
        this.props.history.push(`/bin/${result.hash}`)
      });
  }

  render() {
    return (
      <div>
        <h2>Home</h2>
        <Button onClick={this.createBin.bind(this)}>Create Bin</Button>
      </div>
    );
  }
}


export default App;