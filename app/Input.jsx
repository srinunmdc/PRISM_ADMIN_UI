import React, { Component } from "react";
export default class Input extends Component{
  constructor(props){
      super(props);

  }
  render(){
    return(
      <div className="ad-search-type">
          {this.props.name ?
              <div className="di sm search-type">
                  <div className="remove-gray">
                      <label className="dropdown-label">{this.props.name}</label>
                  </div>
              </div>
                  : null
          }
        <div className="di sm search-box">
          <input type="text" id="adSearchValue" onPaste={this.onChangeSearch.bind(this)} onChange={(e)=>this.onChangeSearch(e)} className= "form-control sm pull-right" placeholder={this.props.textplaceHolder} />
        </div>
      </div>

    );
  }
  onChangeSearch = (e)=>{
      let val = e.target.value;
      if(val.length > 2 || val.length === 0)
        this.props.onChange(e.target.value);



  }
}
