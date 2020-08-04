import React, { Component } from 'react';
import MainRenderer from './renderer/MainRenderer';
import RubberBand from './rubberBand/RubberBand';
import Consts, { ObjectTypes } from './helpers/ViewPortConst';
import SpacialHelper from './helpers/SpacialHelper';
import ZoomPanHelper from './helpers/ZoomPanHelper';
import LinkManager from './links/LinkManager';
import Matrix from './helpers/Matrix';
import Registry from './registry/Registry';
import BackGround from './background/BackGround';
//import Registry from 'store//';

class Flow extends Component {
  constructor(props) {
    super(props);

    //Init Controllers
    this.ZoomPanHelper = new ZoomPanHelper();

    //Initialization of state
    this.state = {
      data: [],
      dragging: false,
      viewportMtx: new Matrix(this.props.viewportMtx),
      viewportTr: '1,0,0,1,0,0',
      selection: this.getSelectedObjInfo(null)
    };

    ///LOCAL VARIABLES
    this.draggingPositionX = 0;
    this.draggingPositionY = 0;
    this.mode = Consts.MODE_GLOBAL_PAN;
    Registry.addAll(this.props.data);
  }
  ///////////////////////
  /// STATE MANAGEMENT //
  ///////////////////////

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.dragging !== this.state.dragging) {
      this.addRemoveMouseListener(nextState, this.state);
    }
    if (nextProps.selectedItem !== this.props.selectedItem) {
      //force state to be new selection
      nextState.selection = this.getSelectedObjInfo(nextProps.selectedItem);
    }
    if (nextProps.data !== this.props.data) {
      this.calcNewDataState(nextProps.data);
    }
    return true;
  }

  calcNewDataState = (data) => {
    Registry.addAll(data);
  };

  addRemoveMouseListener = (newState, oldState) => {
    if (newState.dragging && !oldState.dragging) {
      document.addEventListener('mousemove', this.doMouseMove);
      document.addEventListener('mouseup', this.doMouseUp);
    } else if (!newState.dragging && oldState.dragging) {
      document.removeEventListener('mousemove', this.doMouseMove);
      document.removeEventListener('mouseup', this.doMouseUp);
    }
  };

  getSelectedObjInfo = (item) => {
    let matrix = item ? new Matrix(item.transform) : new Matrix();
    let box = item ? { id: item.id, x: 0, y: 0, w: item.w, h: item.h } : { id: '', x: 0, y: 0, w: 0, h: 0 };
    let type = item ? this.getObjType(item) : ObjectTypes.TYPE_ITEM;
    return {
      item: item,
      matrix: matrix,
      transform: matrix.matrixToText(),
      box: box,
      type: type
    };
  };

  ///////////////////
  /// MOUSE EVENT ///
  ///////////////////

  //When we click anywhere that is not an Object or the rubberband
  doGlobalMouseDown = (e) => {
    if (e.button === 0) {
      this.setDraggingPosition(e);
      this.setState({ dragging: true });
      this.mode = Consts.MODE_GLOBAL_PAN;
    }
  };

  doObjectMouseDown = (e, parent, item) => {
    e.stopPropagation();
    this.setDraggingPosition(e);
    this.setState({ dragging: true });
    if (this.props.onSelectItem) this.props.onSelectItem(parent, item);
    //this.updateSelectedInfo(parent, item);
    this.mode = Consts.MODE_RUBER_BAND_MOVE;
  };

  doRubberMouseDown = (e, mode, item) => {
    e.stopPropagation();
    this.setDraggingPosition(e);
    this.setState({ dragging: true });
    this.mode = mode;
  };

  onStartLink = (e, obj, output) => {
    e.stopPropagation();
    this.setDraggingPosition(e);
    let x = e.clientX;
    let y = e.clientY - 80;
    let linkposition = `1,0,0,1,${x},${y}`;
    let tempLink = { start: obj.id, output: output.id, end: '*', input: '*' };
    let selection = this.getSelectedObjInfo(tempLink);
    selection.matrix = new Matrix(linkposition);
    selection.tranform = linkposition;
    selection.item = tempLink;
    this.mode = Consts.MODE_RUBER_BAND_MOVE;
    this.setState({ dragging: true, selection: selection });
  };

  onEndLink = (e, obj, input) => {
    if (this.state.selection.type == ObjectTypes.TYPE_LINK) {
      e.stopPropagation();
      this.state.selection.item.end = obj.id;
      this.state.selection.item.input = input.id;
      if (this.props.onAddLink) this.props.onAddLink(this.state.selection.item);
      if (this.props.onSelectItem) this.props.onSelectItem(null, null);
      this.setState;
    }
  };

  ///////////////////////
  /// MOUSE EVENTS  ////
  /////////////////////

  doMouseMove = (e) => {
    if (this.state.dragging) {
      console.log('Moving');
      e.stopPropagation();
      let x = e.clientX - 170; //this.refs.container.offsetLeft;
      let y = e.clientY - 57; //this.refs.container.offsetTop;

      let deltaX = this.draggingPositionX - x;
      let deltaY = this.draggingPositionY - y;

      switch (this.mode) {
        case Consts.MODE_GLOBAL_PAN:
          this.pan(deltaX, deltaY);
          break;
        case Consts.MODE_RUBER_BAND_MOVE:
          this.updateSelectedItem(SpacialHelper.moveObject(deltaX, deltaY, this.state));
          break;
        case Consts.MODE_RUBER_BAND_ROTATE:
          this.updateSelectedItem(SpacialHelper.rotateObject(x, y, this.draggingPositionX, this.draggingPositionY, this.state));
          break;

        case Consts.MODE_RUBER_BAND_RESIZE_UL:
        case Consts.MODE_RUBER_BAND_RESIZE_UR:
        case Consts.MODE_RUBER_BAND_RESIZE_DL:
        case Consts.MODE_RUBER_BAND_RESIZE_DR:
          let newState = SpacialHelper.resizeObject(deltaX, deltaY, this.mode, this.state);
          this.updateSelectedItem(newState);
          break;
      }

      this.setDraggingPosition(e);
    }
  };

  doMouseUp = (e) => {
    this.setState({ dragging: false });
    if (this.state.selection.type == ObjectTypes.TYPE_LINK) {
      if (this.props.onSelectItem) this.props.onSelectItem(null, null);
    }
    if (this.props.selectedItem && this.props.onChange)
      this.props.onChange(this.props.selectedItem, {
        transform: this.state.selection.matrix.matrixToText(),
        w: this.state.selection.box.w,
        h: this.state.selection.box.h
      });
  };

  doMouseWheel = (e) => {
    e.preventDefault();
    let cx = e.clientX - this.refs.container.offsetLeft;
    let cy = e.clientY - this.refs.container.offsetTop;
    let scale = e.deltaY > 0 ? 1.05 : 0.95;
    this.zoom(scale, cx, cy);
  };

  ownEvent(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ////////////////////////////
  //   DRAG & DROP EVENTS  //
  //////////////////////////

  onDragOver = (e) => {
    e.preventDefault();
  };

  onDrop = (e) => {
    let objType = parseInt(e.dataTransfer.getData('objtype'));
    if (objType == ObjectTypes.TYPE_PAGE || objType == ObjectTypes.TYPE_ACTION || objType == ObjectTypes.TYPE_REDUCER) {
      let x = e.clientX - this.refs.container.offsetLeft;
      let y = e.clientY - this.refs.container.offsetTop;
      let coor = SpacialHelper.coordinatesGlobalToLocal(x, y, this.state.viewportMtx, null);
      let matrix = `1, 0, 0, 1, ${coor.x}, ${coor.y}`;
      this.addItem(e, null, matrix);
    }
  };

  addItem = (e, parent, matrix) => {
    let type = parseInt(e.dataTransfer.getData('type'));
    let subtype = e.dataTransfer.getData('subtype');
    let objType = parseInt(e.dataTransfer.getData('objtype'));
    let name = e.dataTransfer.getData('name');
    let data = {
      name: name,
      type: type,
      objType: objType,
      subtype: subtype,
      transform: matrix
    };
    this.props.onAddItem(data, parent);
  };

  updateSelectedItem = (newState) => {
    let matrix = newState.matrix;
    // newState.box?newState.box.id=this.state.box.id:null;
    let box = newState.box ? newState.box : this.state.selection.box;
    let selection = { ...this.state.selection };
    selection.matrix = matrix;
    selection.transform = matrix.matrixToText();
    selection.box = box;
    this.setState({ selection: selection });
  };

  //////////////////////////
  // VIEW PORT ZOOM & PAN //
  /////////////////////////

  pan = (dx, dy) => {
    this.ZoomPanHelper.pan(dx, dy, this.state.viewportMtx);
    this.applyMatrix();
  };

  zoom = (scale, cx, cy) => {
    this.ZoomPanHelper.zoom(scale, cx, cy, this.state.viewportMtx);
    this.applyMatrix();
  };

  applyMatrix = () => {
    let newMatrix = this.state.viewportMtx.matrixToText();
    this.setState({
      viewportTr: newMatrix
    });
  };
  /////////////////////////
  //       HELPERS       //
  /////////////////////////
  getObjType(item) {
    if (item.hasOwnProperty('start') && item.hasOwnProperty('output') && item.hasOwnProperty('end') && item.hasOwnProperty('input')) {
      return ObjectTypes.TYPE_LINK;
    }
    return ObjectTypes.TYPE_ITEM;
  }

  setDraggingPosition = (e) => {
    // this.draggingPositionX=e.clientX-this.refs.container.offsetLeft;
    // this.draggingPositionY=e.clientY-this.refs.container.offsetTop;

    this.draggingPositionX = e.clientX - 170;
    this.draggingPositionY = e.clientY - 57;
  };

  render() {
    const { viewportTr } = this.state;
    return (
      <div
        ref="container"
        onDragOver={this.onDragOver}
        onDrop={this.onDrop}
        style={{
          position: 'relative',
          userSelect: 'none',
          width: '100%',
          height: '100%',
          outline: 0
        }}
        tabIndex="0"
      >
        <div
          id="viewport"
          ref="mainSvg"
          x={0}
          y={0}
          width="100%"
          style={{ position: 'relative', userSelect: 'none', height: '100%' }}
          onMouseDown={this.doGlobalMouseDown}
          onWheel={this.doMouseWheel}
        >
          <div
            style={{
              transform: `matrix(${viewportTr})`,
              position: 'absolute'
            }}
          >
            <MainRenderer
              selection={this.state.selection}
              data={this.props.data}
              doObjectMouseDown={this.doObjectMouseDown}
              onDropIteminPage={this.onDropIteminPage}
              onEndLink={this.onEndLink}
              onStartLink={this.onStartLink}
            />
          </div>

          <LinkManager transform={viewportTr} links={this.props.links} selection={this.state.selection} />

          {this.props.selectedItem && this.state.selection.type != ObjectTypes.TYPE_LINK ? (
            <RubberBand selection={this.props.selectedItem} viewport={this.state} doRubberMouseDown={this.doRubberMouseDown} />
          ) : null}
          <BackGround />
        </div>
      </div>
    );
  }
}

export default Flow;
