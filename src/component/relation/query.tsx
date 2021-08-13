import _ from 'lodash';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import React, { Component } from 'react';

import '../../app.css';
import './relation.css';

import { LocalizationData } from '../../library/common';
import characterJson from '../../db/character.json';
import relationJson from '../../db/relation.json';
import relationMemberJson from '../../db/relation_member.json';

const characters = characterJson as { [key: string]: {} };
const relations = relationJson as { [key: string]: string };
const relationMembers = relationMemberJson as { [key: string]: string[] };

interface HorseRow {
  id: string;
  name: string;
  relation: number;
  image: string;
}
interface HorseGreatRow {
  id1:string
  image1 : string;
  relation1: number;
  id2:string
  image2 : string;
  relation2: number;
  id3:string
  image3 : string;
  relation3: number;
  relationTotal: number;
}
interface HorseAllRela{
  father:HorseGreatRow
  mother:HorseGreatRow
  relation:number
}
interface HorseRela {
  id: string;
  relation: number;
}

interface IProps {
  localization: LocalizationData;
}

const tableStyle = {
  float: 'left',
};

interface IState {
  horseId: string
  horseId2: string
  horseId2Img: string 
}

class RelationQuery extends Component<IProps, IState> {
  static calculateRelation(id1: string | undefined, id2: string): number {
    if (id1 === id2 || id1 === undefined) {
      return 0;
    }
    const targetRelations: string[] = _.intersection(relationMembers[id1], relationMembers[id2]);
    return _.reduce(targetRelations, (sum: number, id: string) => sum + parseInt(relations[id], 10), 0);
  }
  static calculateGrandRelation(id1: string | undefined, id2: string, id3: string): number {
    if (id1 === id2 || id1 === undefined || id1 === id3 || id2 === id3) {
      return 0;
    }
    const targetRelations: string[] = _.intersection(relationMembers[id1], relationMembers[id2], relationMembers[id3]);
    return _.reduce(targetRelations, (sum: number, id: string) => sum + parseInt(relations[id], 10), 0);
  }

  horses: string[];

  constructor(props: IProps) {
    super(props);
    this.horses = Object.keys(characters);
    this.state = {
      horseId: '', 
      horseId2: '',     
      horseId2Img: '',
    };
  }

  selectHorse = (event: any) => {
    const { value } = event.target;
    this.setState({ horseId: value });
  };
  selectHorse2 = (event: any) => {
    const { value } = event.target;
    this.setState({ horseId2: value });
  };


  buildBestArray(inputId:string|undefined) {
    //const { horseId } = this.state;
    const { localization } = this.props;
    let rel: HorseGreatRow[] = [];
    
    let rel3: HorseAllRela[] = [];
    this.horses.forEach((targetHorseId) => {
      if (targetHorseId !== inputId) {


        let relation1: number = RelationQuery.calculateRelation(inputId, targetHorseId);

        let rel2: HorseRela[] = [];
        this.horses.forEach((parentHorseId) => {
          if (targetHorseId !== parentHorseId || inputId !== parentHorseId) {
            rel2.push({
              id: parentHorseId,
              relation: RelationQuery.calculateGrandRelation(inputId, targetHorseId, parentHorseId),
            })
          }
        });
        rel2 = _.sortBy(rel2, [(horseRela) => -horseRela.relation]);
        rel.push({
          id1:targetHorseId,
          id2:rel2[0].id,
          id3:rel2[1].id,
          image1: `${process.env.PUBLIC_URL}/static/image/character/portrait/${targetHorseId}.png`,
          relation1: relation1,
          image2: `${process.env.PUBLIC_URL}/static/image/character/portrait/${rel2[0].id}.png`,
          relation2: rel2[0].relation,
          image3: `${process.env.PUBLIC_URL}/static/image/character/portrait/${rel2[1].id}.png`,
          relation3: rel2[1].relation,
          relationTotal:  relation1 + rel2[0].relation + rel2[1].relation
        });
      }
    });
    rel = _.sortBy(rel, [(horseGreatRow) => -horseGreatRow.relationTotal]);
    
    for(let father = 0; father < rel.length-1; father++){
      for(let mother = father + 1; mother < rel.length; mother++){
        rel3.push({
          father:rel[father],
          mother:rel[mother],
          relation:RelationQuery.calculateRelation(rel[father].id1, rel[mother].id1) + rel[father].relationTotal + rel[mother].relationTotal,
        });
      }
    }
    
    rel3 = _.sortBy(rel3, [(Horseallrela) => -Horseallrela.relation]);
    rel3 = rel3.slice(0,4);
    return [
      rel.map((horseGreatRow) => (
        <React.Fragment>
          <tr>
            
            <td rowSpan={2}><img className="portrait" src={horseGreatRow.image1}  /></td>
            <td rowSpan={2} width={'15%'}>{horseGreatRow.relation1}</td>
            <td><img className="portrait" src={horseGreatRow.image2}  /></td>
            <td width={'15%'}>{horseGreatRow.relation2}</td>
            
            <td rowSpan={2} width={'15%'}>{horseGreatRow.relationTotal}</td>
          </tr>
          <tr>
            <td><img className="portrait" src={horseGreatRow.image3}  /></td>
            <td width={'15%'}>{horseGreatRow.relation3}</td>
          </tr>
        </React.Fragment>
      )),
      rel3.map((Horseallrela) => (
        <React.Fragment>
          <tr>
            <td rowSpan={4}>{Horseallrela.relation}</td>
            <td rowSpan={2}><img className="portrait" src={Horseallrela.father.image1}  /></td>
            <td><img className="portrait" src={Horseallrela.father.image2}  /></td>          
          </tr>
          <tr>
            <td><img className="portrait" src={Horseallrela.father.image3}  /></td>
          </tr>
          <tr>           
            <td rowSpan={2}><img className="portrait" src={Horseallrela.mother.image1}  /></td>
            <td><img className="portrait" src={Horseallrela.mother.image2}  /></td>
          </tr>
          <tr>
            <td><img className="portrait" src={Horseallrela.mother.image3}  /></td>
          </tr>
        </React.Fragment>
      )),
    ];
  }
  buildGrandArray(inputId:string|undefined,inputId2:string) {
    //const { horseId } = this.state;
    const { localization } = this.props;
    let rel: HorseRow[] = [];
    this.horses.forEach((targetHorseId) => {
      if (targetHorseId !== inputId && targetHorseId !== inputId2) {
        rel.push({
          id:targetHorseId,
          name: localization.character.name[targetHorseId],
          relation: RelationQuery.calculateGrandRelation(inputId, inputId2, targetHorseId),
          image: `${process.env.PUBLIC_URL}/static/image/character/portrait/${targetHorseId}.png`,
        });
      }
    });
    rel = _.sortBy(rel, [(horseRow) => -horseRow.relation]);

    return rel.map((horseRow) => (
      <React.Fragment>
        <tr>
          <td>{horseRow.name}</td>
          <td><img className="portrait" src={horseRow.image} alt={horseRow.name} /></td>
          <td width={'15%'}>{horseRow.relation}</td>
        </tr>
      </React.Fragment>
    ));
  }
  buildRelationArray(inputId:string|undefined) {
    //const { horseId } = this.state;
    const { localization } = this.props;
    let rel: HorseRow[] = [];
    this.horses.forEach((targetHorseId) => {
      if (targetHorseId !== inputId) {
        rel.push({
          id: targetHorseId,
          name: localization.character.name[targetHorseId],
          relation: RelationQuery.calculateRelation(inputId, targetHorseId),
          image: `${process.env.PUBLIC_URL}/static/image/character/portrait/${targetHorseId}.png`,
        });
      }
    });
    rel = _.sortBy(rel, [(horseRow) => -horseRow.relation]);

    return rel.map((horseRow) => (
      <React.Fragment>
        <tr onClick={() => this.setState({ horseId2:horseRow.id,horseId2Img:horseRow.image})}>   
          <td>{horseRow.name}</td>
          <td><img className="portrait" src={horseRow.image} alt={horseRow.name} /></td>
          <td width={'15%'}>{horseRow.relation}</td>
        </tr>
      </React.Fragment>
    ));
  }

  render() {
    const { localization } = this.props;
    const relationArray = this.buildRelationArray(this.state.horseId);
    const grandArray = this.buildGrandArray(this.state.horseId,this.state.horseId2);
    const [sideRelationArray,bestRelation] = this.buildBestArray(this.state.horseId);
    return (
      <div className="content">
        <div className="dropdown" >
          <FormControl>
            <InputLabel id="demo-simple-select-label">ウマ</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              onChange={this.selectHorse}
              
            >
              { this.horses.map((targetHorseId) => (
                <MenuItem key={`${targetHorseId}_option`} value={targetHorseId}>
                  <img
                    className="portrait"
                    src={`${process.env.PUBLIC_URL}/static/image/character/portrait/${targetHorseId}.png`}
                    alt={localization.character.name[targetHorseId]}
                  />
                  {localization.character.name[targetHorseId]}
                </MenuItem>
              ))}
            </Select>
           
          </FormControl>
          
        </div>
        <table style={{float:'left',marginRight:'20px'}}>
          
          {relationArray}
        </table>
        <table style={{float:'left',marginRight:'20px'}}>
          <th >そふぼ<br/>click left table Img</th>
          <th colSpan={2}><img className="portrait" src={this.state.horseId2Img} ></img></th>
          
          {grandArray}
        </table>
        <table style={{float:'left',marginRight:'20px'}}>
          <th colSpan={5}>Side parent</th>
          {sideRelationArray}
        </table>
        <table style={{float:'left'}}>
          <th colSpan={3}>Best couple</th>
          {bestRelation}
        </table>
      </div>
    );
  }
}

export default RelationQuery;
