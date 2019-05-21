import React from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import Editor from "./Editor";
import Tab from "./Tab";
import EditorControl from "./EditorControl";
import AlertTemplateResourceStore from "../store/AlertTemplateStore";
import AlertTemplateService from "../service/AlertTemplateService";

@inject("alertTemplateStore", "loaderStore")
@observer
class EditorTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      baseUrl: `${window.location.protocol}//${window.location.host}`,
      template: null,
      activeTab: "",
      edited: false,
      editMode: false
    };
  }

  onClickTabItem(tab) {
    AlertTemplateResourceStore.setSelectedContentType(tab);
  }

  onChange = evt => {
    const { alertTemplateStore } = this.props;
    const activeTab = alertTemplateStore.templateContentTypes.selected;
    let data;
    alertTemplateStore.alertTemplates.forEach(element => {
      if (element.templateContentType === activeTab) {
        data = element;
      }
    });

    this.setState({
      edited: true
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
                //  var field = dynamicParams[i].substring(2, dynamicParams[i].length-1)
                newContent = newContent.replace(dynamicParams[i], '<span th:text="'+dynamicParams[i]+'">'+dynamicParams[i]+'<span>');
            } */
    }
    // this.props.data.changed = true;
    // AlertTemplateResourceStore.updateTemplateResource(this.props.data)
  };

  onDraft = () => {
    const { alertTemplateStore } = this.props;
    const activeTab = alertTemplateStore.templateContentTypes.selected;
    console.log("Saving Templates");
    let data;
    alertTemplateStore.alertTemplates.forEach(element => {
      if (element.templateContentType === activeTab) {
        data = element;
      }
    });
    const regex = /\${\w+\}/g;
    const dynamicVariables = data.changedContent.match(regex);
    let content = data.changedContent;

    dynamicVariables.forEach(dynamicVariable => {
      content = content.replace(
        dynamicVariable,
        `<span th:remove="tag" th:text="${dynamicVariable}">${dynamicVariable}</span>`
      );
    });
    // data.templateContent = data.changedContent;
    data.templateContent = content;
    AlertTemplateService.saveTemplate(data);
    this.setState({
      edited: false
    });
  };

  onClickEdit = () => {
    const { loaderStore } = this.props;
    loaderStore.loadingStart();
    this.setState(
      {
        editMode: true
      },
      () => {
        loaderStore.loadingComplete();
      }
    );
  };

  onPreview = () => {
    this.setState({
      editMode: false
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
    const activeTab = alertTemplateStore.templateContentTypes.selected;
    let data;
    alertTemplateStore.alertTemplates.forEach(element => {
      if (element.templateContentType === activeTab) {
        data = element;
      }
    });
    this.setState({
      edited: false,
      editMode: false
    });
    data.changedContent = data.templateContent;
  };

  onReject = () => {
    const { alertTemplateStore } = this.props;
    const activeTab = alertTemplateStore.templateContentTypes.selected;
    let data;
    alertTemplateStore.alertTemplates.forEach(element => {
      if (element.templateContentType === activeTab) {
        data = element;
      }
    });
    console.log("Deleting Template");
    this.setState({
      editMode: false
    });
    AlertTemplateService.deleteTemplate(data);
  };

  render() {
    const { editMode, edited } = this.state;
    const { alertTemplateStore } = this.props;
    const activeTab = alertTemplateStore.templateContentTypes.selected;

    return (
      <React.Fragment>
        <div className="tabs">
          <ul className="tab-list">
            {alertTemplateStore.templateContentTypes.options &&
              alertTemplateStore.templateContentTypes.options.map(element => {
                const label = element;

                return (
                  <Tab
                    activeTab={activeTab}
                    key={label}
                    label={label}
                    onClick={this.onClickTabItem.bind(this)}
                  />
                );
              })}
          </ul>

          <div className="tab-content">
            {alertTemplateStore.alertTemplates.map(element => {
              if (element.templateContentType !== activeTab) return undefined;
              return (
                <Editor
                  data={element}
                  editMode={editMode}
                  onChange={this.onChange}
                />
              );
            })}
          </div>
        </div>
        {alertTemplateStore.alertTemplates.map(element => {
          if (element.templateContentType !== activeTab) return undefined;
          return (
            <EditorControl
              data={element}
              edited={edited}
              editMode={editMode}
              onPublish={this.onPublish}
              onReject={this.onReject}
              onDraft={this.onDraft}
              onCancel={this.onCancel}
              onPreview={this.onPreview}
              onClickEdit={this.onClickEdit}
            />
          );
        })}
      </React.Fragment>
    );
  }
}

EditorTabs.propTypes = {
  alertTemplateStore: PropTypes.object.isRequired,
  loaderStore: PropTypes.object.isRequired
};

export default EditorTabs;
