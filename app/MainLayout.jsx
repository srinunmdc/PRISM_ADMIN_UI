import React, { Component } from 'react';
import {observer, inject} from 'mobx-react';
import { Loader } from "di-components";

import AdvancedSearch from "./AdvancedSearch";
import ResultTable from "./ResultTable";
import AlertTypeService from "./service/AlertTypeService";

@inject('loaderStore')
@observer
class MainLayout extends Component {
    constructor(props){
        super(props);

    }

    componentDidMount() {
        AlertTypeService.loadAlertTypeResources();
    }

    render() {
        const { loaderStore} = this.props;
        if (loaderStore.isFullScreenLoading) {
            return (
                <div className="main-layout-loader">
                    <Loader />
                </div>
            )
        }
        return (
           <div>
                <div className="ad-search-pannel">
                    <AdvancedSearch

                    />
                </div>
               <div className="row">
                   <div className="col-xs-12">&nbsp;</div>
               </div>
                <div className="row">
                    <div className="col-md-12 col-sm-12 col-xs-12">
                    <ResultTable

                    />
                    </div>
                </div>
            </div>

        );
    }



    onSuccess(response){
        console.log("Success Result :");
        console.log(response);
        for (var i = 0; i < response.length; i++) {
            var channels = response[i].channels;
            for (var key in channels) {
                if (channels.hasOwnProperty(key)) {
                    response[i][key.toLowerCase()] = channels[key];
                }
            }
            delete response[i].channels;
            //to change coulumn Colour to identify sucess or failure
            /*for(var key in response[i].status){
              console.log(response[i].status[key]);
               if(response[i].status[key] == "true"){
                response[i].status[key]="green"
              }else if(response[i].status[key] == "false"){
                response[i].status[key]="red"
              }
           }*/
        }
        console.log("Table Result :");
        console.log(response);
        this.setState({results :response});

    }

}
export default MainLayout;
