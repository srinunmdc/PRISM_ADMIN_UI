import React from "react";
import  AlertTypeResourceStore from "./store/AlertTypeStore";


class tableHead extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      caret: []
    };
  }

  sort(column, index) {
    let ar = this.state.caret;
    ar[index] = !this.state.caret[index];
    this.setState({
      caret: ar
    });
    const sortOrder = !this.state.caret[index] ? "asc" : "desc";
    this.props.sort(column, sortOrder);
  }
  render() {
    return (
      <thead>
        {this.props.columns.map((col, i) => {
          return (
            <th scope="col">
              <span onClick={() => this.sort(col.value, i)}>{col.label}</span>
              {col.value != "" && (
                <span
                  className={this.state.caret[i] ? "caret up" : "caret"}
                  aria-hidden="true"
                />
              )}
            </th>
          );
        })}
      </thead>
    );
  }
}

export default tableHead;
