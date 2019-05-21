"use strict";
import React from "react";
import CKEditor from "./NewCKEditor";
import AlertTemplateService from "../service/AlertTemplateService";

export default class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edited: false,
      editMode: false,
      height: "400px"
    };
  }

  onChange = evt => {
    this.setState({
      edited: true
    });
    if (this.props.data.templateContentType == "EMAIL_BODY") {
      this.props.data.changedContent = evt.editor.getData();
    } else {
      this.props.data.changedContent = evt.editor
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

  // eslint-disable-next-line react/sort-comp
  render() {
    const previewDivStyle = {
      height: this.state.height,
      border: "1px solid #d1d1d1",
      overflow: "scroll"
    };

    return (
      <div>
        <div className="col-md-12 col-sm-12 col-xs-12">
          {this.state.editMode ? (
            <div className="col-md-10 col-sm-10 col-xs-12">
              <CKEditor
                activeClass="p10"
                content={this.props.data.templateContent}
                events={{
                  change: this.onChange
                }}
                config={{
                  language: this.props.data.locale,
                  height: this.state.height,
                  toolbarCanCollapse: true,
                  allowedContent: true,
                  disableAutoInline: true,
                  forcePasteAsPlainText: true,
                  removeButtons:
                    "PasteText,PasteFromWord,Indent,Outdent,Scayt,Link,Unlink,Anchor,Image,Table,HorizontalRule,SpecialChar,Maximize,Strike,RemoveFormat,NumberedList,BulletedList,Blockquote,Styles,About,Subscript,Superscript"
                }}
              />
            </div>
          ) : (
            <div
              className="col-md-10 col-sm-10 col-xs-12"
              style={previewDivStyle}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: this.props.data.changedContent
                }}
              />
            </div>
          )}
        </div>

        <div className="col-md-12 col-sm-12 col-xs-12">
          {this.props.data.state &&
          this.props.data.state === "DRAFT" &&
          this.state.edited === false ? (
            <div>
              <div className="col-xs-2 pull-right">
                <button
                  type="button"
                  className="btn sm btn-primary"
                  onClick={this.onPublish}
                >
                  Publish
                </button>
              </div>
              <div className="col-xs-2 pull-right">
                <button
                  type="button"
                  className="btn sm btn-primary"
                  onClick={this.onReject}
                >
                  Reject
                </button>
              </div>
            </div>
          ) : null}
          {this.state.edited ? (
            <div>
              <div className="col-xs-2 pull-right">
                <button
                  type="button"
                  className="btn sm btn-primary"
                  onClick={this.onDraft}
                >
                  Save as Draft
                </button>
              </div>
              <div className="col-xs-2 pull-right">
                <button
                  type="button"
                  className="btn sm btn-primary"
                  onClick={this.onCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : null}
          {this.state.editMode ? (
            <div className="col-xs-2 pull-right">
              <button
                type="button"
                className="btn sm btn-primary"
                onClick={this.onPreview}
              >
                Preview
              </button>
            </div>
          ) : (
            <div className="col-xs-2 pull-right">
              <button
                type="button"
                className="btn sm btn-primary"
                onClick={this.onClickEdit}
              >
                Edit
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  onDraft = () => {
    console.log("Saving Templates");
    this.props.data.templateContent = this.props.data.changedContent;
    AlertTemplateService.saveTemplate(this.props.data);
    this.setState({
      edited: false
    });
  };

  onClickEdit = () => {
    this.setState({
      editMode: true
    });
  };

  onPreview = () => {
    this.setState({
      editMode: false
    });
  };

  onPublish = () => {
    console.log("Saving Templates");
    AlertTemplateService.publishTemplate(this.props.data);
  };

  onCancel = () => {
    this.setState({
      edited: false,
      editMode: false
    });
    this.props.data.changedContent = this.props.data.templateContent;
  };

  onReject = () => {
    console.log("Deleting Template");
    this.setState({
      editMode: false
    });
    AlertTemplateService.deleteTemplate(this.props.data);
  };
}
