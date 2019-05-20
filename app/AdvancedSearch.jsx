import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import DropDown from "./DropDown";
import ReactTooltip from "react-tooltip";
import Input from "./Input";
import AlertTypeResourceStore from "./store/AlertTypeStore";

@inject("alertTypeStore")
@observer
class AdvancedSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categorey: "",
      serachText: "",
      emailChecked: true,
      smsChecked: true,
      pushChecked: true
    };
    window.that = this;
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.tooltipClose = this.tooltipClose.bind(this);
  }

  setFilteredArray = () => {
    const deliveryTypes = {
      EMAIL: this.state.emailChecked,
      SMS: this.state.smsChecked,
      PUSH: this.state.pushChecked
    };
    AlertTypeResourceStore.setFilteredAlertTypes(
      deliveryTypes,
      this.state.categorey,
      this.state.serachText
    );
  };

  searchStringSelected = value => {
    this.setState({ serachText: value.toString() }, () => {
      this.setFilteredArray();
    });
  };

  onCategoreySlected = categorey => {
    AlertTypeResourceStore.setCategories(categorey);
    this.setState({ categorey }, () => {
      this.setFilteredArray();
    });
  };

  onEventTypeSlected = categorey => {
    // this.setState({categorey: categorey});
    // AlertTypeResourceStore.setFilteredAlertTypes(categorey, this.state.serachText);
  };

  handleChangeEmail = e => {
    this.setState({ emailChecked: !this.state.emailChecked }, () => {
      this.setFilteredArray();
    });
  };

  handleChangeText = e => {
    this.setState({ smsChecked: !this.state.smsChecked }, () => {
      this.setFilteredArray();
    });
  };

  handleChangePush = e => {
    this.setState({ pushChecked: !this.state.pushChecked }, () => {
      this.setFilteredArray();
    });
  };

  tooltipClose() {
    debugger;
  }

  render() {
    const { alertTypeStore } = this.props;
    const close =
      "<span class='di-icon-close tooltip-close' aria-hidden='true' onclick=window.that.tooltip.tooltipRef=null;window.that.tooltip.hideTooltip();></span>";
    const data =
      "<h3>Why did I get this page?</h3><span>Common reasons include:</span><ul class='margin-left-20'><li>You recently cleared your cookies <a href='#' target='blank'>Learn more</a></li><li>You are browsing in private ir incognito mode</li><li>You are using a different browser from the one you set last time</li><li>You knowingly or unknowningly asked to skip this extra security step</li></ul>";
    const content = close + data;
    return (
      <React.Fragment>
        <div className="row">
          <div className="col-md-12 col-sm-12 col-xs-12 ">
            {/* <div className="col-md-3 col-sm-3 col-xs-12">
						<label className="heading-3 text-light">Event Type<span className="di-icon-help-outline help-icon" aria-hidden="true"></span></label>
					</div> */}
            <div className="col-md-3 col-sm-3 col-xs-12">
              <label className="heading-3 text-light">
                Category
                <span
                  data-tip="category"
                  className="di-icon-help-outline help-icon"
                  aria-hidden="true"
                />
              </label>
              <div class="tip-icon" />
            </div>
            <div className="col-md-3 col-sm-3 col-xs-12">
              <label className="heading-3 text-light">
                Filter Message
                <span
                  data-tip={`${content}`}
                  className="di-icon-help-outline help-icon"
                  aria-hidden="true"
                />
              </label>
            </div>
            <div className="col-md-3 col-sm-3 col-xs-12">
              <label className="heading-3 text-light">Channels </label>
            </div>
          </div>
          <div className="col-md-12 col-sm-12 col-xs-12 align-vertically">
            {/* <div className="col-md-3 col-sm-3 col-xs-12">
						<DropDown
							onSelect={this.onCategoreySlected}
							default={alertTypeStore.alertCategories.selected}
							data={alertTypeStore.alertCategories.options}
							width={100}
						/>
					</div> */}
            <div className="col-md-3 col-sm-3 col-xs-12">
              <DropDown
                onSelect={this.onCategoreySlected}
                default={alertTypeStore.alertCategories.selected}
                data={alertTypeStore.alertCategories.options}
                width={100}
              />
            </div>
            <div className="col-md-3 col-sm-3 col-xs-12">
              <Input
                textplaceHolder="Start typing to filter..."
                onChange={this.searchStringSelected}
                width={100}
              />
            </div>
            <div className="col-md-3 col-sm-3 col-xs-12">
              <span className="di-checkbox margin-15">
                <input
                  className="sm"
                  type="checkbox"
                  checked={this.state.emailChecked}
                  onChange={this.handleChangeEmail}
                />
                <span className="lbl sm">Email</span>
              </span>

              <span className="di-checkbox margin-15">
                <input
                  className="sm"
                  type="checkbox"
                  checked={this.state.smsChecked}
                  onChange={this.handleChangeText}
                />
                <span className="lbl sm">Text</span>
              </span>

              <span className="di-checkbox margin-15">
                <input
                  className="sm"
                  type="checkbox"
                  checked={this.state.pushChecked}
                  onChange={this.handleChangePush}
                />
                <span className="lbl sm">Push</span>
              </span>
            </div>
          </div>
        </div>
        <ReactTooltip
          event="click"
          globalEventOff="click"
          place="bottom"
          effect="solid"
          className="help-tooltip"
          multiline
          html
          clickable
          afterShow={evt => {
            for (const tooltip of document.querySelectorAll(".help-tooltip")) {
              tooltip.addEventListener("click", e => e.stopPropagation());
            }
          }}
          afterHide={evt => {
            for (const tooltip of document.querySelectorAll(".help-tooltip")) {
              tooltip.addEventListener("click", e => e.stopPropagation());
            }
          }}
          offset={{ top: -10, right: 3 }}
          ref={el => (this.tooltip = el)}
        />
      </React.Fragment>
    );
  }
}

export default AdvancedSearch;
