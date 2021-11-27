import React, { Component } from 'react';
import XrdPlot from './xrd/plot_xrd';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Plot from 'react-plotly.js';

/*
class Title extends Component{
// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu


// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it


render() { 
  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
    &#x25bc;
  </a>
));
const CustomMenu = React.forwardRef(
  ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
    const [value, setValue] = useState('');

    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
        <FormControl
          autoFocus
          className="mx-3 my-2 w-auto"
          placeholder="Type to filter..."
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
        <ul className="list-unstyled">
          {React.Children.toArray(children).filter(
            (child) =>
              !value || child.props.children.toLowerCase().startsWith(value),
          )}
        </ul>
      </div>
    );
  },
);
return(
  <Dropdown>
    <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
      Custom toggle
    </Dropdown.Toggle>

    <Dropdown.Menu as={CustomMenu}>
      <Dropdown.Item eventKey="1">Red</Dropdown.Item>
      <Dropdown.Item eventKey="2">Blue</Dropdown.Item>
      <Dropdown.Item eventKey="3" active>Orange</Dropdown.Item>
      <Dropdown.Item eventKey="1">Red-Orange</Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>)
}
}*/
class Visualizer extends Component{
  render(){
    const Atomic_coords = this.props.Coords['data']['attributes']['sites']; 
    var data = {
      x: Object.keys(Atomic_coords).map(i => Atomic_coords[i].position[0]),
      y: Object.keys(Atomic_coords).map(i => Atomic_coords[i].position[1]),
      z: Object.keys(Atomic_coords).map(i => Atomic_coords[i].position[2]),
      mode: 'markers',
	    marker: {    
	    	size: 12,
	    	line: {
	    	color: 'rgba(217, 217, 217, 0.14)',
	    	width: 0.5},
	    	opacity: 0.8},        
	    type: 'scatter3d'
    };
    var layout = {margin: {
      l: 0,   
      r: 0,   
      b: 0,
      t: 0
      }}; 
      //newPlot('myDiv', data, layout) 
      //<Plot data= {data}  layout = {layout}/> 
    return (
        <div>
          <h2> Visualizer</h2>
          <div> Coordinates: <span className="blue">{this.props.CoordsBox}</span></div>
          <Plot
             data={[data,]}
             layout={ layout }
            />
        </div>);

    }
}

class InfoBox extends Component{

    render() {
      return ( 
      <div>
        <h3> Info </h3>
        <div>Formula: <span className="blue">{this.props.formula}</span></div>
        <div>Spacegroup international: <span className="blue">{this.props.spacegroupInternational}</span></div>
        <div>Spacegroup number: <span className="blue">{this.props.spacegroupNumber}</span></div>
        <div>Bravais lattice: <span className="blue">{this.props.bravaisLattice}</span></div>

      </div>
      );
    }
   
}

class CoordsBox extends Component{
  
  render(){
    const Cell_coords = this.props.CoordsBox['data']['attributes']['cell'];
    const Atomic_coords = this.props.CoordsBox['data']['attributes']['sites'];
    //console.log('!');
    //console.log(Cell_coords);   
        return (
        <div>
          <div>
          <h3> 3D structure cell </h3>
            <Table striped bordered hover>
              <thead >
                <tr>
                  <th></th>
                  <th>x</th>
                  <th>y</th>
                  <th>z</th>
                </tr>
              </thead>
              <tbody>
              {
                
                Object.keys(Cell_coords).map(i => { return(
                <tr>
                  <td>v{parseInt(i)+1}</td>
                  <td>{Cell_coords[i][0]}</td>
                  <td>{Cell_coords[i][1]}</td>
                  <td>{Cell_coords[i][2]}</td>
                </tr>);})
                }
              </tbody>
            </Table>
            <h3> 3D structure atomic coordinates </h3>
            <Table striped bordered hover>
              <thead >
                <tr>
                  <th>Kind label</th>
                  <th>x</th>
                  <th>y</th>
                  <th>z</th>
                </tr>
              </thead>
              <tbody>
              {Object.keys(Atomic_coords).map(i => { return(
                <tr>
                  <td>{Atomic_coords[i].kind_name}</td>
                  <td>{Atomic_coords[i].position[0]}</td>
                  <td>{Atomic_coords[i].position[1]}</td>
                  <td>{Atomic_coords[i].position[2]}</td>
                </tr>)})
                }
              </tbody>
            </Table>
          </div>

          
        </div>
        );

    }

}
//<div>Coordinates: <span className="blue">{this.props.CoordsBox['3D_structure_atomic_coords'].a1.y}</span></div>

class DetailPage extends Component{
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      info: [],
      coords: [],
      xrd_plot_params: {"fit_type": "gauss", "FWHM":0.4},
      xrd_pattern:[],
      page_details: []
    };
  }

componentDidMount(){
const url = this.props.page_details_link;

const result = fetch(url, { method: 'get' })
  .then(response => response.json()) // pass the data as promise to next then block
  .then(data => {
    const compounds_url = data.data.compounds_url;
  
    return Promise.all([fetch(`${compounds_url}/${this.props.compound}`).then(res => res.json()),
    fetch(this.props.compound+"_CoordBox_correct.json", {
      headers: {
        'Content-Type': 'application/json', 
        'Accept': 'application/json'
      }
    }
    ).then(res => res.json()),
    fetch(`xrd_${this.props.compound}_CuKa.json`, {
      headers: {
        'Content-Type': 'application/json', 
        'Accept': 'application/json'
      }
    }
    ).then(res => res.json())]); // make a 2nd request and return a promise
  })

// I'm using the result const to show that you can continue to extend the chain from the returned promise
result.then(r => {
  //console.log(r[1]);
  this.setState({
    isLoaded: true,
    info: r[0],
    coords: r[1],
    xrd_pattern: r[2]
  });
}, (error) => {
  this.setState({
    isLoaded: true,
    error
  });
}
);

  }

  
 render() {

    const compound = this.props.compound;
    const isLoaded = this.state.isLoaded;
    const info = this.state.info;
    const coords = this.state.coords;
    const xrd_pattern = this.state.xrd_pattern;
    const xrd_params = this.state.xrd_plot_params;
    const error = this.state.error;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>loading...</div>;
    } else {
        return (
        <div className="details-page" > 
          <h1>Compound: <span>{compound}</span></h1>
          <Container fluid>
            <Row>
              <Col><Visualizer Coords={coords}></Visualizer></Col>
              <Col>
                {<InfoBox 
                  bravaisLattice={info['data'][compound][0]['info']['bravais_lattice']} 
                  spacegroupInternational = {info['data'][compound][0]['info']['spacegroup_international']}
                  spacegroupNumber = {info['data'][compound][0]['info']['spacegroup_number']}
                  formula = {info['data'][compound][0]['info']['formula']}
                />}
                <XrdPlot xrdPattern={xrd_pattern}
                         xrdParameters={xrd_params} />
              </Col>
            <Col><CoordsBox CoordsBox={coords}></CoordsBox></Col>
            
            
            </Row>
            
          </Container>
        </div>  
    ); } 
    }

}

class ThreeDimDataBase extends Component{
  
  render(){
    //console.log('!');
    //console.log(this.state.page_details);
    const info_page_link = "https://dev-www.materialscloud.org/mcloud/api/v2/discover/3dd/info";
    const compound = "Sb2Zr";
    return(
    <div className="3dcd">
        <div className="3dcd-details_page">
        <DetailPage 
            page_details_link={info_page_link}
            compound={compound}
          />
          </div>
      </div>
    );
  }

}

//<Col><Visualizer CoordsBox={this.state.coords['data'][this.state.compound][0]}></Visualizer></Col>//
   export default  ThreeDimDataBase; 