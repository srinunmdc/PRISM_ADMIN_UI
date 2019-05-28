import React from "react";
import PropTypes from "prop-types";
import { observer, inject } from "mobx-react";

import Thead from "./table-head";
import sort from "./util/sort";
import EditorTabs from "./editor/EditorTabs";
import AlertTemplateResourceStore from "./store/AlertTemplateStore";
import AlertTemplateService from "./service/AlertTemplateService";
import ConfirmModal from "./ConfirmModal";

@inject("alertTypeStore", "alertTemplateStore")
@observer
class ResultTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapseID: "",
      sortOrder: "asc",
      sortKey: "",
      edited: {},
      editMode: {},
      confirmModalShow: false,
      showAlert: false
    };
    this.sortFields = this.sortFields.bind(this);
    this.setCollapseId = this.setCollapseId.bind(this);
    this.onClickEdit = this.onClickEdit.bind(this);
  }

  setCollapseId(id) {
    this.setState({
      collapseID: id
    });
  }

  declineEditing = () => {
    this.setState(
      {
        confirmModalShow: false,
        edited: {},
        editMode: {},
        showAlert: false
      },
      () => {
        this.resetTemplateStore();
        this.setCollapseId("");
      }
    );
  };

  continueEditing = () => {
    this.setState({ confirmModalShow: false });
  };

  resetTemplateStore = () => {
    AlertTemplateResourceStore.resetStore();
  };

  expandAccordian = alertTypeResource => {
    const { collapseID, edited } = this.state;

    if (Object.values(edited).includes(true)) {
      this.setState({ confirmModalShow: true });
    } else {
      this.resetTemplateStore();

      if (collapseID === alertTypeResource.alertTypeId) {
        this.setCollapseId("");
      } else {
        AlertTemplateService.loadAlertTemplatesResources(alertTypeResource);
        this.setCollapseId(alertTypeResource.alertTypeId);
      }
    }

    // AlertTemplateResourceStore.resetStore();
  };

  onChange = evt => {
    const { alertTemplateStore } = this.props;
    const activeTab = alertTemplateStore.templateContentTypes.selected;
    let data;
    alertTemplateStore.alertTemplates.forEach(element => {
      if (element.templateContentType === activeTab) {
        data = element;
      }
    });
    const { edited } = this.state;
    this.setState({
      edited: { ...edited, [activeTab]: true }
    });
    if (data.templateContentType === "EMAIL_BODY") {
      data.changedContent = evt.editor.getData();
    } else {
      data.changedContent = evt.editor
        .getData()
        .replace("<p>", "")
        .replace("</p>", ""); // evt.editor.document.getBody().getText();
      /* // For PUSH, SMS and MAIL_SUBJECT content should be plain and thymeleaf tags are in html, logic to handle the CKEditor formating
    var dynamicParams = newContent.match(/\$\{([^}]+)\}/gmi);
    var i;
    for (i=0;i<dynamicParams.length;i++) {
    // var field = dynamicParams[i].substring(2, dynamicParams[i].length-1)
    newContent = newContent.replace(dynamicParams[i], '<span th:text="'+dynamicParams[i]+'">'+dynamicParams[i]+'<span>');
    } */
    }
    // this.props.data.changed = true;
    // AlertTemplateResourceStore.updateTemplateResource(this.props.data)
  };

  onDraft = () => {
    const { alertTemplateStore } = this.props;
    const { edited } = this.props;
    const activeTab = alertTemplateStore.templateContentTypes.selected;
    console.log("Saving Templates");
    let data;
    let error;
    alertTemplateStore.alertTemplates.forEach(element => {
      if (element.templateContentType === activeTab) {
        data = element;
      }
    });
    const regex = /\${\w*\}/g;
    const dynamicVariables = data.changedContent.match(regex);
    let content = data.changedContent;
    if (dynamicVariables) {
      dynamicVariables.forEach(dynamicVariable => {
        const matchedString = dynamicVariable.substring(
          2,
          dynamicVariable.length - 1
        );
        if (data.previewValues[matchedString]) {
          content = content.replace(
            dynamicVariable,
            `<span th:remove="tag" th:text="${dynamicVariable}">${dynamicVariable}</span>`
          );
        } else {
          error = true;
        }
      });
    }
    if (!error) {
      data.templateContent = content;
      AlertTemplateService.saveTemplate(data);
      this.setState({
        edited: { ...edited, [activeTab]: false },
        showAlert: false
      });
    } else {
      this.setState({ showAlert: true });
    }
  };

  onClickEdit = () => {
    const { editMode } = this.state;
    const { alertTemplateStore } = this.props;
    const activeTab = alertTemplateStore.templateContentTypes.selected;
    const edit = editMode;
    edit[activeTab] = true;
    this.setState({
      editMode: { ...edit }
    });
  };

  onPreview = () => {
    const { alertTemplateStore } = this.props;
    const { editMode } = this.state;
    const activeTab = alertTemplateStore.templateContentTypes.selected;
    const edit = editMode;
    edit[activeTab] = false;
    this.setState({
      editMode: { ...edit }
    });
  };

  onPublish = () => {
    const { alertTemplateStore } = this.props;
    const activeTab = alertTemplateStore.templateContentTypes.selected;
    let data;
    alertTemplateStore.alertTemplates.forEach(element => {
      if (element.templateContentType === activeTab) {
        data = element;
      }
    });
    console.log("Saving Templates");
    AlertTemplateService.publishTemplate(data);
  };

  onCancel = () => {
    const { alertTemplateStore } = this.props;
    const { editMode, edited } = this.state;
    const activeTab = alertTemplateStore.templateContentTypes.selected;
    let data;
    alertTemplateStore.alertTemplates.forEach(element => {
      if (element.templateContentType === activeTab) {
        data = element;
      }
    });
    const edit = editMode;
    edit[activeTab] = false;
    this.setState({
      edited: { ...edited, [activeTab]: false },
      editMode: { ...edit },
      showAlert: false
    });
    data.changedContent = data.templateContent;
  };

  onReject = () => {
    const { alertTemplateStore } = this.props;
    const { editMode } = this.state;
    const activeTab = alertTemplateStore.templateContentTypes.selected;
    let data;
    alertTemplateStore.alertTemplates.forEach(element => {
      if (element.templateContentType === activeTab) {
        data = element;
      }
    });
    console.log("Deleting Template");
    const edit = editMode;
    edit[activeTab] = false;
    this.setState({
      editMode: { ...edit }
    });
    AlertTemplateService.deleteTemplate(data);
  };

  sortFields(sortKey, sortOrder) {
    this.setState({
      sortKey,
      sortOrder
    });
  }

  renderResultRow = (obj, accordianEvenOdd) => {
    const { collapseID, editMode, edited, showAlert } = this.state;
    const hidden = { opacity: 0.5 };
    return (
      <React.Fragment>
        <tr className={accordianEvenOdd}>
          <td className="col-xs-2">{obj.alertTypeName}</td>
          <td className="col-xs-3">{obj.description}</td>
          <td className="col-xs-2">{obj.platform}</td>
          <td className="col-xs-2">{obj.vendor}</td>
          <td className="col-xs-2">
            <span
              className="glyphicon glyphicon-envelope icon-margin"
              style={obj.deliveryTypes.includes("EMAIL") ? {} : hidden}
            />
            <span
              className="glyphicon glyphicon-comment icon-margin"
              style={obj.deliveryTypes.includes("SMS") ? {} : hidden}
            />
            <span
              className="glyphicon glyphicon-bell icon-margin"
              style={obj.deliveryTypes.includes("PUSH") ? {} : hidden}
            />
          </td>
          <td style={{ textAlign: "right" }} className="col-xs-1">
            <span
              className={
                collapseID === obj.alertTypeId
                  ? "glyphicon glyphicon-menu-up"
                  : "glyphicon glyphicon-menu-down"
              }
              onClick={() => this.expandAccordian(obj)}
              style={{ padding: "0px 10px" }}
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
                <EditorTabs
                  editMode={editMode}
                  edited={edited}
                  onChange={this.onChange}
                  onPublish={this.onPublish}
                  onReject={this.onReject}
                  onDraft={this.onDraft}
                  onCancel={this.onCancel}
                  onPreview={this.onPreview}
                  onClickEdit={this.onClickEdit}
                  showAlert={showAlert}
                  closeAlert={this.closeAlert}
                />
              </div>
            </td>
          </tr>
        )}
      </React.Fragment>
    );
  };

  closeAlert = () => {
    this.setState({ showAlert: false });
  };

  render() {
    const columns = [
      { label: "Alert Type", value: "alertTypeName", column: "col-xs-2" },
      { label: "Description", value: "description", column: "col-xs-3" },
      { label: "Platform", value: "platform", column: "col-xs-2" },
      { label: "Alert Source", value: "vendor", column: "col-xs-2" },
      { label: "Delivery Type", value: "", column: "col-xs-2" },
      { label: "", value: "", column: "col-xs-1" }
    ];
    const { alertTypeStore } = this.props;
    const { sortKey, sortOrder, edited, confirmModalShow } = this.state;
    const confirmModalContent = Object.keys(edited).join(", ");
    return (
      <React.Fragment>
        <table className="table table-striped row">
          <Thead columns={columns} sort={this.sortFields} />

          <tbody>
            {alertTypeStore.filteredAlertTypes
              ? sort(alertTypeStore.filteredAlertTypes, sortKey, sortOrder).map(
                  (obj, index) => {
                    const accordianEvenOdd =
                      index % 2 === 0
                        ? "not-accordian-even"
                        : "not-accordian-odd";
                    return this.renderResultRow(obj, accordianEvenOdd);
                  }
                )
              : null}
          </tbody>
        </table>
        <ConfirmModal
          show={confirmModalShow}
          close={this.declineEditing}
          content={confirmModalContent}
          confirmHandler={this.continueEditing}
        />
      </React.Fragment>
    );
  }
}

ResultTable.propTypes = {
  alertTypeStore: PropTypes.object.isRequired,
  alertTemplateStore: PropTypes.object.isRequired,
  alertTypeObj: PropTypes.object.isRequired,
  edited: PropTypes.bool.isRequired
};

export default ResultTable;
