import React, { Component } from 'react';
import { ObjectTypes } from '../helpers/ViewPortConst';
import ActionRenderer from './action/ActionRenderer';

class MainRenderer extends Component {
  constructor(props) {
    super(props);
    this.cache = null;
  }

  calculateCache = (data) => {
    return data
      ? data.map((item, index) => {
          return this.dorender(item, index, item.transform);
        })
      : [];
  };

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.data !== this.props.data) {
      this.cache = null;
    }
  }

  onDragOver(e) {
    e.preventDefault();
  }
  onDragDrop = (e) => {
    console.log('notify Drop');
    e.stopPropagation();
    this.props.onDropIteminPage(e, this.props.item);
  };

  onMouseUpShell = (side) => {
    //  DrawComander.cmp_update_connector(this.props.item,side);
  };

  dorender(item, index, transform) {
    let w = item.w;
    let h = item.h;
    if (this.props.selection.box && item == this.props.selection.item) {
      w = this.props.selection.box.w;
      h = this.props.selection.box.h;
    }
    return (
      <ActionRenderer
        key={index}
        item={item}
        transform={transform}
        w={w}
        h={h}
        id={item.id}
        onStartLink={this.props.onStartLink}
        onEndLink={this.props.onEndLink}
        doObjectMouseDown={this.props.doObjectMouseDown}
      />
    );
  }

  renderItems = () => {
    if (!this.cache) {
      this.cache = this.calculateCache(this.props.data);
    }

    if (this.props.selection.item && this.props.selection.type != ObjectTypes.TYPE_LINK) {
      //and not a link
      let selectedIndex = this.props.data.indexOf(this.props.selection.item);
      let transform = this.props.selection.transform;
      this.cache[selectedIndex] = this.dorender(this.props.selection.item, selectedIndex, transform);
    }
    return [...this.cache];
  };

  render() {
    const { transform } = this.props;
    return (
      <div
        style={{
          transform: `matrix(${transform})`,
          position: 'absolute'
        }}
      >
        {this.renderItems()}
      </div>
    );
  }
}

export default MainRenderer;
