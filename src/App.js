// import _ from 'lodash';
import React, { Component } from 'react';
import "react-tabs/style/react-tabs.css";
import './App.css';

// import characterJson from './db/character.json';
// import relation from './db/relation.json';
// import relation_member from './db/relation_member';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import Homepage from './components/homepage/Homepage';
import Compatibility from './components/compatibility/Compatibility';
import Skills from './components/skills/Skills';



export class App extends Component{
  state = {
  }
  
  render() {
    return (
      <Router>
        <div className="App">
		      <div className="content">
		        <Route exact path="/" component={Homepage} />
            <Route path="/Compatibility" component={Compatibility} />
            <Route path="/Skills" component={Skills} />
		      </div>
        </div>
      </Router>
    );
  }
} 


//		        <Route path="/Compatibility" component={Compatibility} />







// export class App extends Component {
//   constructor(props) {
//     super(props)
//     this.characterIds = Object.keys(characterJson);
//     this.relations = {};
//     for (let i = 0; i < this.characterIds.length; i += 1) {
//       this.relations[this.characterIds[i]] = {};
//       for (let j = 0; j < this.characterIds.length; j += 1) {
//         this.relations[this.characterIds[i]][this.characterIds[j]] = this.calculateRelation(this.characterIds[i], this.characterIds[j]);
//       }
//     }
//   }

//   calculateRelation(id1, id2) {
//     if (id1 === id2) {
//       return 0;
//     }
//     const relations = _.intersection(relation_member[id1], relation_member[id2])
//     return _.reduce(relations, (sum, id) => sum += parseInt(relation[id]), 0);
//   }

//   createRow(id) {
//     return (
//       <tr>
//         <th>{this.idToPortrait(id)}</th>
//         { _.map(this.characterIds, (targetId) => <th>{ this.calculateRelation(id, targetId) }</th>) }
//       </tr>
//     )
//   }

//   idToPortrait(id) {
//     return (
//       <img class="portrait" src={`image/character/portrait/${id}.png`} alt={characterJson[id].text}/>
//     )
//   }

//   render() {
//     return (
//       <table>
//         <tbody>
//           <tr>
//             <th></th>
//             { _.map(this.characterIds, (id) => <th>{this.idToPortrait(id)}</th>) }
//           </tr>
//           { _.map(this.characterIds, (id) => this.createRow(id)) }
//         </tbody>
//       </table>
//     );
//   }
// }
