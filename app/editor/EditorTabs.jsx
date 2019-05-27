import React from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import Editor from "./Editor";
import Tab from "./Tab";
import AlertTemplateResourceStore from "../store/AlertTemplateStore";

@inject("alertTemplateStore")
@observer
class EditorTabs extends React.Component {
  onClickTabItem(tab) {
    AlertTemplateResourceStore.setSelectedContentType(tab);
  }

  render() {
    const {
      editMode,
      edited,
      alertTemplateStore,
      onChange,
      onPublish,
      onReject,
      onDraft,
      onCancel,
      onPreview,
      onClickEdit,
      showAlert
    } = this.props;
    const activeTab = alertTemplateStore.templateContentTypes.selected;
    return (
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
                onChange={onChange}
                activeTab={activeTab}
                edited={edited}
                onPublish={onPublish}
                onReject={onReject}
                onDraft={onDraft}
                onCancel={onCancel}
                onPreview={onPreview}
                onClickEdit={onClickEdit}
                showAlert={showAlert}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

EditorTabs.propTypes = {
  alertTemplateStore: PropTypes.object.isRequired,
  editMode: PropTypes.bool.isRequired,
  edited: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onPublish: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  onDraft: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onPreview: PropTypes.func.isRequired,
  onClickEdit: PropTypes.func.isRequired
};

export default EditorTabs;
