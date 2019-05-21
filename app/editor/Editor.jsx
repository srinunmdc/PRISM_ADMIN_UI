import React from "react";
import PropTypes from "prop-types";
import CKEditor from "./NewCKEditor";

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: "75%"
    };
  }

  // eslint-disable-next-line react/sort-comp
  render() {
    const { height } = this.state;
    const { data, editMode, onChange } = this.props;
    const previewDivStyle = {
      height,
      border: "1px solid #d1d1d1",
      overflow: "auto"
    };
    let commonRemove =
      "PasteText,PasteFromWord,Indent,Outdent,Scayt,Link,Unlink,Anchor,Image,Table,HorizontalRule,SpecialChar,Maximize,Strike,RemoveFormat,NumberedList,BulletedList,Blockquote,Styles,About,Subscript,Superscript";
    let extra = "";
    if (
      this.props.activeTab === "PUSH_BODY" ||
      this.props.activeTab === "SMS_BODY"
    ) {
      extra = ",Bold,Italic,Underline,Format";
    }
    const finalRemove = commonRemove + extra;
    return (
      <div className="col-md-12 col-sm-12 col-xs-12 editor-preview-wrapper">
        {editMode ? (
          <div className="col-md-10 col-sm-10 col-xs-12">
            <CKEditor
              activeClass="p10"
              content={data.changedContent}
              events={{
                change: onChange
              }}
              config={{
                language: data.locale,
                height,
                toolbarCanCollapse: true,
                allowedContent: true,
                disableAutoInline: true,
                forcePasteAsPlainText: true,
                removeButtons: finalRemove
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
    );
  }
}

Editor.propTypes = {
  data: PropTypes.object.isRequired,
  editMode: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
};

export default Editor;
