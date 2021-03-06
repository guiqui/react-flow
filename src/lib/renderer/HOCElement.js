import React from 'react';
export function withTransform(WrappedComponent) {
  // ...and returns another component...

  return class extends React.Component {
    constructor(props) {
      super(props);
      this.transform = '1,0,0,1,0,0';
      this.w = 50;
      this.h = 50;
    }

    render() {
      const { h, w, transform } = this.props;
      return (
        <div
          id={`${this.props.id}`}
          className="actionContainer"
          style={{
            overflow: 'hidden',
            transformOrigin: '0% 0%',
            top: 0,
            left: 0,
            height: h,
            width: w,
            position: 'absolute',
            transform: `matrix(${transform})`
          }}
          onMouseDown={(e) => this.props.doObjectMouseDown(e, this.props.item)}
        >
          <div> hello</div>
          {/* <WrappedComponent {...this.props} /> */}
        </div>
      );
    }
  };
}

// ...and returns another component...
export class ViewPortElement extends React.Component {
  constructor(props) {
    super(props);
    this.transform = '1,0,0,1,0,0';
    this.w = 100;
    this.h = 50;
    this.id = props.id;
  }

  render() {
    const { h, w, transform, children } = this.props;
    this.transform = transform ? transform : this.transform;
    console.log(this.transform);
    return (
      <div
        id={`${this.props.id}`}
        className="actionContainer"
        style={{
          overflow: 'hidden',
          transformOrigin: '0% 0%',
          top: 0,
          left: 0,
          height: this.h,
          width: this.w,
          position: 'absolute',
          transform: `matrix(${this.transform})`
        }}
        onMouseDown={(e) => this.props.doObjectMouseDown(e, null, this)}
      >
        {children}
      </div>
    );
  }
}
