import React from "react";
import { observer, inject } from "mobx-react";
import Thead from "./table-head";
import AlertTemplateService from "./service/AlertTemplateService";
import EditorTabs from "./editor/EditorTabs";
import AlertTemplateResourceStore from "./store/AlertTemplateStore";

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
      mode: "EDIT"
    };
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

  render() {
    const columns = [
      "Alert Type",
      "Platform",
      "Alert Source",
      "Delivery Type",
      "Description",
      ""
    ];

    const { alertTypeStore } = this.props;
    const { collapseID } = this.state;
    return (
      <table className="table table-striped">
        <Thead columns={columns} />

        <tbody>
          {alertTypeStore.filteredAlertTypes
            ? alertTypeStore.filteredAlertTypes.map(obj => (
                <React.Fragment>
                  <tr>
                    <td>{obj.alertTypeName}</td>
                    <td>{obj.platform}</td>
                    <td>{obj.vendor}</td>
                    <td>
                      {obj.deliveryTypes.map(element => {
                        if (element === "EMAIL")
                          return (
                            <span className="glyphicon glyphicon-envelope icon-margin" />
                          );
                        if (element === "SMS")
                          return (
                            <span className="glyphicon glyphicon-comment icon-margin" />
                          );
                        if (element === "PUSH")
                          return (
                            <span className="glyphicon glyphicon-bell icon-margin" />
                          );
                      })}
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
                      <td colSpan="6">
                        <div
                          id={`accordion_${obj.alertTypeId}`}
                          className={
                            collapseID === obj.alertTypeId
                              ? "collapse in row data"
                              : "collapse"
                          }
                        >
                          <EditorTabs />
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            : null}
        </tbody>
      </table>
    );
  }
}
export default ResultTable;
