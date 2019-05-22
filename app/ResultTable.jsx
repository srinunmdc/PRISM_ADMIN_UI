import React from "react";
import { observer, inject } from "mobx-react";
import Thead from "./table-head";
import AlertTemplateService from "./service/AlertTemplateService";
import EditorTabs from "./editor/EditorTabs";
import AlertTemplateResourceStore from "./store/AlertTemplateStore";
import sort from "./util/sort";

@inject("alertTypeStore", "loaderStore")
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
      sortOrder: "asc",
      sortKey: ""
    };
    this.sortFields = this.sortFields.bind(this);
  }

  onClick() {
    //  console.log(alertTypeResourse);
    // this.setState({alertType: alertTypeName})
    //   AlertTypeActions.setSelectedAlertType(alertTypeResourse);
    // this.props.history.push('/edit');
  }

  expandAccordian = alertTypeResource => {
    console.log(alertTypeResource);
    AlertTemplateResourceStore.resetStore();

    if (this.state.collapseID === alertTypeResource.alertTypeId) {
      this.setState({ collapseID: "" });
    } else {
      AlertTemplateService.loadAlertTemplatesResources(alertTypeResource);
      this.setState({ collapseID: alertTypeResource.alertTypeId });
    }
  };

  sortFields(sortKey, sortOrder) {
    this.setState({
      sortKey,
      sortOrder
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
    const hidden = { opacity: 0.5 };
    const { alertTypeStore } = this.props;
    const { collapseID } = this.state;
    return (
      <table className="table table-striped">
        <Thead columns={columns} sort={this.sortFields} />

        <tbody>
          {alertTypeStore.filteredAlertTypes
            ? sort(
                alertTypeStore.filteredAlertTypes,
                this.state.sortKey,
                this.state.sortOrder
              ).map((obj, index) => {
                const classs =
                  index % 2 === 0 ? "not-accordian-even" : "not-accordian-odd";
                return (
                  <React.Fragment>
                    <tr className={classs}>
                      <td>{obj.alertTypeName}</td>
                      <td>{obj.platform}</td>
                      <td>{obj.vendor}</td>
                      <td>
                        <span
                          className="glyphicon glyphicon-envelope icon-margin"
                          style={
                            obj.deliveryTypes.includes("EMAIL") ? {} : hidden
                          }
                        />
                        <span
                          className="glyphicon glyphicon-comment icon-margin"
                          style={
                            obj.deliveryTypes.includes("SMS") ? {} : hidden
                          }
                        />
                        <span
                          className="glyphicon glyphicon-bell icon-margin"
                          style={
                            obj.deliveryTypes.includes("PUSH") ? {} : hidden
                          }
                        />
                      </td>

                      <td>{obj.description}</td>
                      <td>
                        <span
                          className={
                            collapseID === obj.alertTypeId
                              ? "glyphicon glyphicon-menu-up"
                              : "glyphicon glyphicon-menu-down"
                          }
                          onClick={() => this.expandAccordian(obj)}
                        />
                      </td>
                    </tr>
                    {collapseID === obj.alertTypeId && (
                      <tr>
                        <td colSpan="6" style={{ padding: 0 }}>
                          <div
                            id={`accordion_${obj.alertTypeId}`}
                            className="accordian-border"
                          >
                            <EditorTabs />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            : null}
        </tbody>
      </table>
    );
  }
}
export default ResultTable;
