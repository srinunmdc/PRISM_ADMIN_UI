import React from "react";
import { inject } from "mobx-react";
import CKEditor from "./NewCKEditor";
import AlertTemplateService from "../service/AlertTemplateService";

@inject("loaderStore")
class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edited: false,
      editMode: false,
      height: "400px"
    };
  }

  onChange = evt => {
    const { data } = this.props;
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
    const { data } = this.props;
    console.log("Saving Templates");
    data.templateContent = data.changedContent;
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
    const { data } = this.props;
    console.log("Saving Templates");
    AlertTemplateService.publishTemplate(data);
  };

  onCancel = () => {
    const { data } = this.props;
    this.setState({
      edited: false,
      editMode: false
    });
    data.changedContent = data.templateContent;
  };

  onReject = () => {
    const { data } = this.props;
    console.log("Deleting Template");
    this.setState({
      editMode: false
    });
    AlertTemplateService.deleteTemplate(data);
  };

  render() {
    const { editMode, edited, height } = this.state;
    const { data } = this.props;
    const previewDivStyle = {
      height,
      border: "1px solid #d1d1d1",
      overflow: "scroll"
    };

    return (
      <div>
        <div className="col-md-12 col-sm-12 col-xs-12">
          {editMode ? (
            <div className="col-md-10 col-sm-10 col-xs-12">
              <CKEditor
                activeClass="p10"
                content={data.templateContent}
                events={{
                  change: this.onChange
                }}
                config={{
                  language: data.locale,
                  height,
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
                  __html: data.changedContent
                }}
              />
            </div>
          )}
        </div>

        <div className="col-md-12 col-sm-12 col-xs-12">
          {data.state && data.state === "DRAFT" && edited === false ? (
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
          {edited ? (
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
          {editMode ? (
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
}

export default Editor;
