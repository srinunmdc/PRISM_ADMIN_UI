import React from 'react';
import PropTypes from "prop-types"
import { LoaderModal } from "di-components";

class MainLoaderModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = { modalShowing: true }
  }

  close = () => {
    this.setState({
      modalShowing:false
    })
  }
  
  open = () => {
    this.setState({
      modalShowing:true
    })
  }
  
  toggle = () => {
    this.open();
    setTimeout(this.close,3000)
  }
  
  render() {
    return (
      <div>
        <LoaderModal
          show={this.state.modalShowing}
          text="Loading..."
          contained={false}
        />
        {/* <button
          type="button"
          className="btn btn-primary"
          onClick={this.toggle}
        > Show Loader Modal </button> */}
      </div>
    )
  }
}

MainLoaderModal.propTypes = {
//
};

export default MainLoaderModal;
