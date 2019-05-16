import React, { Component } from "react";
import {inject, observer} from 'mobx-react';
import DropDown from "./DropDown";

import Input from "./Input"
import  AlertTypeResourceStore from "./store/AlertTypeStore";


@inject('alertTypeStore')
@observer
export default class AdvancedSearch extends Component {

	constructor(props){
		super(props);
		this.state = {
			categorey:"",
			serachText:"",
			emailChecked:true,
			smsChecked:true,
			pushChecked:true

		};
	}

	searchStringSelected=(value)=>{
		this.setState({searchString: value.toString()})

		AlertTypeResourceStore.setFilteredAlertTypes(this.state.categorey, value)

	}

	onCategoreySlected=(categorey)=>{
		AlertTypeResourceStore.setCategories(categorey);
		this.setState({categorey: categorey});
		AlertTypeResourceStore.setFilteredAlertTypes(categorey, this.state.serachText);
	}

	onEventTypeSlected=(categorey)=>{
		//this.setState({categorey: categorey});
		//AlertTypeResourceStore.setFilteredAlertTypes(categorey, this.state.serachText);
	}

	handleChangeChk = (e) =>{
		console.log(e);
	}

	render(){

		const { alertTypeStore } = this.props;

		return(
			<div className="row">
				<div className="col-md-12 col-sm-12 col-xs-12">
					{/* <div className="col-md-3 col-sm-3 col-xs-12">
						<label className="heading-3 text-light">Event Type<span className="di-icon-help-outline help-icon" aria-hidden="true"></span></label>
					</div> */}
					<div className="col-md-3 col-sm-3 col-xs-12">
						<label className="heading-3 text-light">Category<span className="di-icon-help-outline help-icon" aria-hidden="true"></span></label>
					</div>
					<div className="col-md-3 col-sm-3 col-xs-12">
						<label className="heading-3 text-light">Filter Message<span className="di-icon-help-outline help-icon" aria-hidden="true"></span></label>
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
						<span className="di-checkbox margin-15"><input className="sm" type="checkbox" checked={this.state.emailChecked} onChange={this.handleChangeChk}/><span
							className="lbl sm">Email</span></span>
						

						<span className="di-checkbox margin-15"><input className="sm" type="checkbox" checked={this.state.smsChecked} onChange={this.handleChangeChk}/><span
							className="lbl sm">Text</span></span>

						<span className="di-checkbox margin-15"><input className="sm" type="checkbox" checked={this.state.pushChecked} onChange={this.handleChangeChk}/><span
							className="lbl sm">Push</span></span>
					</div>

				</div>
			</div>
		)
	}

}
