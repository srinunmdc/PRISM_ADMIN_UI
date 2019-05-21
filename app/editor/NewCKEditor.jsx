"use strict";
import React from "react";
import ReactDOM from "react-dom";
import loadScript from "load-script";
import PropTypes from "prop-types";
//const loadScript = require('load-script');

var defaultScriptUrl = "https://cdn.ckeditor.com/4.6.2/standard/ckeditor.js";

/**
 * @author codeslayer1
 * @description CKEditor component to render a CKEditor textarea with defined configs and all CKEditor events handler
 */
class CKEditor extends React.Component {
  constructor(props) {
    super(props);

    //Bindings
    this.onLoad = this.onLoad.bind(this);

    //State initialization
    this.state = {
      isScriptLoaded: this.props.isScriptLoaded,
      config: this.props.config
    };
  }

  //load ckeditor script as soon as component mounts if not already loaded
  componentDidMount() {
    if (!this.props.isScriptLoaded) {
      loadScript(this.props.scriptUrl, this.onLoad);
    } else {
      this.onLoad();
    }
  }

  componentWillUnmount() {
    this.unmounting = true;
  }

  onLoad() {
    if (this.unmounting) return;

    this.setState({
      isScriptLoaded: true
    });

    if (!window.CKEDITOR) {
      console.error("CKEditor not found");
      return;
    }

    window.CKEDITOR.dtd.$removeEmpty["span"] = false;

    if (!window.CKEDITOR.plugins.get("dragFields")) {
      window.CKEDITOR.plugins.add("dragFields", {
        init: function(editor) {
          editor.on("paste", function(evt) {
            var content = evt.data.dataTransfer.getData("text");
            evt.data.dataValue =
              '<span th:text="' + content + '">${' + content + "}<span>";
          });
        }
      });
    }
    // Initialize the editor with the hcard plugin.
    //window.CKEDITOR.inline( 'my_editor', {
    //extraPlugins: 'dragFields'
    ///} );

    this.editorInstance = window.CKEDITOR.appendTo(
      ReactDOM.findDOMNode(this),
      this.state.config,
      this.props.content
    );

    //Register listener for custom events if any
    for (var event in this.props.events) {
      var eventHandler = this.props.events[event];
      this.editorInstance.on(event, eventHandler);
    }
  }

  render() {
    return <div className={this.props.activeClass} id="my_editor" />;
  }
}

CKEditor.defaultProps = {
  content: "",
  config: {},
  isScriptLoaded: false,
  scriptUrl: defaultScriptUrl,
  activeClass: "",
  events: {}
};

CKEditor.propTypes = {
  content: PropTypes.any,
  config: PropTypes.object,
  isScriptLoaded: PropTypes.bool,
  scriptUrl: PropTypes.string,
  activeClass: PropTypes.string,
  events: PropTypes.object
};

export default CKEditor;
