import React from "react";
import { observer, inject } from "mobx-react";
import Thead from "./table-head";
import sort from "./util/sort";
import ResultRow from "./ResultRow";

@inject("alertTypeStore")
@observer
class ResultTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sort: "",
      order: false,
      alertType: "",
      collapseID: "",
      mode: "EDIT",
      collapseID: "",
      sortOrder: "asc",
      sortKey: ""
    };
    this.sortFields = this.sortFields.bind(this);
    this.setCollapseId = this.setCollapseId.bind(this);
  }

  sortFields(sortKey, sortOrder) {
    this.setState({
      sortKey,
      sortOrder
    });
  }

  setCollapseId(id) {
    this.setState({
      collapseID: id
    });
  }

  render() {
    const columns = [
      { label: "Alert Type", value: "alertTypeName" },
      { label: "Platform", value: "platform" },
      { label: "Alert Source", value: "vendor" },
      { label: "Delivery Type", value: "" },
      { label: "Description", value: "description" },
      { label: "", value: "" }
    ];
    const { alertTypeStore } = this.props;
    const { sortKey, sortOrder } = this.state;
    return (
      <table className="table table-striped">
        <Thead columns={columns} sort={this.sortFields} />

        <tbody>
          {alertTypeStore.filteredAlertTypes
            ? sort(alertTypeStore.filteredAlertTypes, sortKey, sortOrder).map(
                (obj, index) => {
                  const classs =
                    index % 2 === 0
                      ? "not-accordian-even"
                      : "not-accordian-odd";
                  return (
                    <ResultRow
                      alertTypeObj={obj}
                      classs={classs}
                      setCollapseId={this.setCollapseId}
                      collapseID={this.state.collapseID}
                    />
                  );
                }
              )
            : null}
        </tbody>
      </table>
    );
  }
}
export default ResultTable;
