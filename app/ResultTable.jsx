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
      confirmRejectModalShow: false,
      showAlert: {
        EMAIL_BODY: false,
        EMAIL_SUBJECT: false,
        PUSH_BODY: false,
        SMS_BODY: false
      }, // have to make showAlert keys dynamic by taking value from templateContentTypes in alertTemplateSore
      hoverIndex: null,
      wrongDynamicVariables: {
        EMAIL_BODY: [],
        EMAIL_SUBJECT: [],
        PUSH_BODY: [],
        SMS_BODY: []
      } // have to make wrongDynamicVariables keys dynamic by taking value from templateContentTypes in alertTemplateSore
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
        showAlert: {
          EMAIL_BODY: false,
          EMAIL_SUBJECT: false,
          PUSH_BODY: false,
          SMS_BODY: false
        },
        wrongDynamicVariables: {
          EMAIL_BODY: [],
          EMAIL_SUBJECT: [],
          PUSH_BODY: [],
          SMS_BODY: []
        }
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

  declineRejectEditing = () => {
    this.setState({
      confirmRejectModalShow: false
    });
  };

  continueRejectEditing = () => {
    this.setState({ confirmRejectModalShow: false });
    const { alertTemplateStore } = this.props;
    const { editMode } = this.state;
    const activeTab = alertTemplateStore.templateContentTypes.selected;
    let data;
    alertTemplateStore.alertTemplates.forEach(element => {
      if (element.templateContentType === activeTab) {
        data = element;
      }
    });
    const edit = editMode;
    edit[activeTab] = false;
    data.state = undefined;
    this.setState({
      editMode: { ...edit }
    });
    AlertTemplateService.deleteTemplate(data);
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
        this.setState({ editMode: {}, edited: {} });
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
    const { edited, wrongDynamicVariables, showAlert } = this.state;
    const activeTab = alertTemplateStore.templateContentTypes.selected;
    let data;
    let error;
    alertTemplateStore.alertTemplates.forEach(element => {
      if (element.templateContentType === activeTab) {
        data = element;
      }
    });
    // const regex = /\${\w*\}/g;
    const regex = /\${[^$]*\}/g;
    const dynamicVariables = data.changedContent.match(regex);
    let content = data.changedContent;
    const dynamicError = [];
    if (data.previewValues && dynamicVariables) {
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
          dynamicError.push(dynamicVariable);
          this.setState({
            wrongDynamicVariables: {
              ...wrongDynamicVariables,
              [activeTab]: dynamicError
            }
          });
        }
      });
    }
    if (!error) {
      data.templateContent = content;
      data.state = "DRAFT";
      AlertTemplateService.saveTemplate(data);
      this.setState({
        edited: { ...edited, [activeTab]: false },
        showAlert: { ...showAlert, [activeTab]: false }
      });
    } else {
      this.setState({ showAlert: { ...showAlert, [activeTab]: true } });
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
    const { edited, editMode } = this.state;
    const activeTab = alertTemplateStore.templateContentTypes.selected;
    let data;
    alertTemplateStore.alertTemplates.forEach(element => {
      if (element.templateContentType === activeTab) {
        data = element;
      }
    });
    data.state = "PUBLISHED";
    this.setState({
      edited: { ...edited, [activeTab]: false },
      editMode: { ...editMode, [activeTab]: false }
    });
    AlertTemplateService.publishTemplate(data);
    data.state = undefined;
  };

  onCancel = () => {
    const { alertTemplateStore } = this.props;
    const { editMode, edited, showAlert } = this.state;
    const activeTab = alertTemplateStore.templateContentTypes.selected;
    let data;
    alertTemplateStore.alertTemplates.forEach(element => {
      if (element.templateContentType === activeTab) {
        data = element;
      }
    });
    data.state = undefined;
    const edit = editMode;
    edit[activeTab] = false;
    this.setState({
      edited: { ...edited, [activeTab]: false },
      editMode: { ...edit },
      showAlert: { ...showAlert, [activeTab]: false },
      wrongDynamicVariables: {
        EMAIL_BODY: [],
        EMAIL_SUBJECT: [],
        PUSH_BODY: [],
        SMS_BODY: []
      }
    });
    data.changedContent = data.templateContent;
  };

  onReject = () => {
    this.setState({
      confirmRejectModalShow: true
    });
  };

  handleMouseEnterOnRow = index => {
    this.setState({ hoverIndex: index });
  };

  handleMouseLeaveonRow = () => {
    this.setState({ hoverIndex: null });
  };

  renderResultRow = (obj, accordianEvenOdd, index) => {
    const {
      collapseID,
      editMode,
      edited,
      showAlert,
      hoverIndex,
      wrongDynamicVariables,
      rejectAlert
    } = this.state;
    const hidden = { opacity: 0.5 };
    const showIcon = hoverIndex === index ? "" : "invisible";
    return (
      <React.Fragment>
        <tr
          className={`${accordianEvenOdd} prism-table-row`}
          onMouseEnter={() => this.handleMouseEnterOnRow(index)}
          onMouseLeave={this.handleMouseLeaveonRow}
          onClick={() => this.expandAccordian(obj)}
        >
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
                  : `glyphicon glyphicon-menu-down ${showIcon}`
              }
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
                  rejectAlert={rejectAlert}
                  onDraft={this.onDraft}
                  onCancel={this.onCancel}
                  onPreview={this.onPreview}
                  onClickEdit={this.onClickEdit}
                  showAlert={showAlert}
                  closeAlert={this.closeAlert}
                  wrongDynamicVariables={wrongDynamicVariables}
                />
              </div>
            </td>
          </tr>
        )}
      </React.Fragment>
    );
  };

  closeAlert = () => {
    const { alertTemplateStore } = this.props;
    const { showAlert } = this.state;
    const activeTab = alertTemplateStore.templateContentTypes.selected;
    this.setState({
      showAlert: { ...showAlert, [activeTab]: false },
      rejectAlert: false
    });
  };

  sortFields(sortKey, sortOrder) {
    this.setState({
      sortKey,
      sortOrder
    });
  }

  render() {
    const columns = [
      { label: "Alert Type", value: "alertTypeName", column: "col-xs-2" },
      { label: "Description", value: "description", column: "col-xs-3" },
      { label: "Platform", value: "platform", column: "col-xs-2" },
      { label: "Alert Source", value: "vendor", column: "col-xs-2" },
      { label: "Delivery Type", value: "", column: "col-xs-2" },
      { label: "", value: "", column: "col-xs-1" }
    ];
    const { alertTypeStore, alertTemplateStore } = this.props;
    const activeTab = alertTemplateStore.templateContentTypes.selected;
    const {
      sortKey,
      sortOrder,
      edited,
      confirmModalShow,
      confirmRejectModalShow
    } = this.state;
    const confirmModalContent = Object.keys(edited)
      .filter(key => edited[key])
      .join(", ");

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
                    return this.renderResultRow(obj, accordianEvenOdd, index);
                  }
                )
              : null}
          </tbody>
        </table>
        <ConfirmModal
          show={confirmModalShow}
          close={this.declineEditing}
          content={`You might lose your changes in ${confirmModalContent}. Continue editing?`}
          confirmHandler={this.continueEditing}
          successText="Yes"
          failText="Discard"
        />
        <ConfirmModal
          show={confirmRejectModalShow}
          close={this.declineRejectEditing}
          content={`You want to reject changes in ${activeTab}`}
          confirmHandler={this.continueRejectEditing}
          successText="Yes"
          failText="No"
        />
      </React.Fragment>
    );
  }
}

ResultTable.propTypes = {
  alertTypeStore: PropTypes.object.isRequired,
  alertTemplateStore: PropTypes.object.isRequired,
  alertTypeObj: PropTypes.object.isRequired
};

export default ResultTable;
