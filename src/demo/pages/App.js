import React, { Component } from 'react';
import Flow from 'libs/Flow';
import './App.css';

const doc = {
  name: "GQ's Flow",
  nodos: [
    {
      id: 'id0',
      type: 'trigger',
      name: 'Triger',
      transform: '1,0,0,1,10,10',
      w: 180,
      h: 100
    },
    {
      id: 'id1',
      type: 'email',
      name: 'Send Email',
      outputs: [
        { id: 'id1ot1', alias: 'success', name: 'Email sent' },
        { id: 'id1ot2', alias: 'error', name: 'Email Error' }
      ],
      inputs: [{ id: 'id1in1', alias: 'input', name: 'Input' }],
      transform: '1,0,0,1,250,10',
      w: 180,
      h: 100
    },
    {
      id: 'id2',
      type: 'router',
      name: 'Router',
      inputs: [{ id: 'id2in1', alias: 'input', name: 'Input' }],
      outputs: [
        { id: 'id2ot1', alias: 'output1' },
        { id: 'id2ot2', alias: 'output2' }
      ],
      transform: '1,0,0,1,300,200',
      w: 180,
      h: 100
    },
    {
      id: 'id3',
      type: 'logger',
      name: 'Logger',
      transform: '1,0,0,1,400,350',
      w: 180,
      h: 100
    },
    {
      id: 'id4',
      type: 'timer',
      name: 'Timer',
      transform: '1,0,0,1,100,300',
      w: 180,
      h: 100
    }
  ],
  links: [
    // {start:"id2",output:"id2ot1",end:"id1" ,input:"id1in1"}
  ]
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: null,
      data: doc.nodos,
      links: doc.links
    };
  }
  onSelectItem = (item) => {
    this.setState({ selectedItem: item });
  };
  onChange = (item, position) => {
    item.transform = position.transform;
    // item.w = position.w;
    // item.h = position.h;
  };
  onAddLink = (item) => {
    let newLinks = [...this.state.links, item];
    this.setState({ links: newLinks });
  };

  render() {
    return (
      <div className="app-container">
        <div className="title-container">
          <h1>Getting Started Demo</h1>
        </div>
        <div className="flow-container">
          <Flow
            data={this.state.data}
            links={this.state.links}
            selectedItem={this.state.selectedItem}
            onSelectItem={this.onSelectItem}
            onAddLink={this.onAddLink}
            onChange={this.onChange}
          />
        </div>
      </div>
    );
  }
}

export default App;
