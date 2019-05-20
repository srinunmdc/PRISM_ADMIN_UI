import React from "react";
import PropTypes from "prop-types";
import { inject } from "mobx-react";

@inject("loaderStore")
class EditorConrol extends React.Component {
  render() {
    const {
      data,
      edited,
      editMode,
      onPublish,
      onReject,
      onDraft,
      onCancel,
      onPreview,
      onClickEdit
    } = this.props;
    return (
      <div className="col-md-12 col-sm-12 col-xs-12">
        {data.state && data.state === "DRAFT" && edited === false ? (
          <div>
            <div className="col-xs-2 pull-right">
              <button
                type="button"
                className="btn sm btn-primary"
                onClick={onPublish}
              >
                Publish
              </button>
            </div>
            <div className="col-xs-2 pull-right">
              <button
                type="button"
                className="btn sm btn-primary"
                onClick={onReject}
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
                onClick={onDraft}
              >
                Save as Draft
              </button>
            </div>
            <div className="col-xs-2 pull-right">
              <button
                type="button"
                className="btn sm btn-primary"
                onClick={onCancel}
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
              onClick={onPreview}
            >
              Preview
            </button>
          </div>
        ) : (
          <div className="col-xs-2 pull-right">
            <button
              type="button"
              className="btn sm btn-primary"
              onClick={onClickEdit}
            >
              Edit
            </button>
          </div>
        )}
      </div>
    );
  }
}

EditorConrol.propTypes = {
  data: PropTypes.object.isRequired,
  edited: PropTypes.bool.isRequired,
  editMode: PropTypes.bool.isRequired,
  onPublish: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  onDraft: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onPreview: PropTypes.func.isRequired,
  onClickEdit: PropTypes.func.isRequired
};

export default EditorConrol;
