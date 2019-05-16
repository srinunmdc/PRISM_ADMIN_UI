import React from 'react';
import Thead from './table-head';
import {observer, inject} from 'mobx-react';
import AlertTemplateService from './service/AlertTemplateService'
import EditorTabs from './editor/EditorTabs';
import AlertTemplateResourceStore from "./store/AlertTemplateStore";
import LoaderResourceStore from "./store/LoaderStore";
import { Loader } from "di-components";

@inject('alertTypeStore', 'loaderStore')
@observer
class ResultTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            sort: '',
            order: false,
            alertType: '',
            collapseID: '',
            mode: 'EDIT'
        }
    }

    onClick(alertTypeResourse) {
        //  console.log(alertTypeResourse);
        // this.setState({alertType: alertTypeName})
        //   AlertTypeActions.setSelectedAlertType(alertTypeResourse);
        // this.props.history.push('/edit');
    }

    expandAccordian = (alertTypeResource) => {
        console.log(alertTypeResource);
        AlertTemplateResourceStore.resetStore();

        if (this.state.collapseID === alertTypeResource.alertTypeId) {
            this.setState({collapseID: ''});
        } else {
            AlertTemplateService.loadAlertTemplatesResources(alertTypeResource);
            this.setState({collapseID: alertTypeResource.alertTypeId});
        }

    }

    render() {

        let columns = [
            'Alert Type',
            'Platform',
            'Alert Source',
            'Delivery Type',
            'Description'
        ];

        const {alertTypeStore, alertTemplateStore, loaderStore} = this.props;
        const { collapseID } = this.state;
        return (
            <div className="di-rs-table">
                <Thead columns={columns}/>
                {alertTypeStore.filteredAlertTypes ? alertTypeStore.filteredAlertTypes.map((obj) => {
                        return (
                            <div>
                                <div className="row data">
                                    <div className="col-xs-2"><span className="cell">{obj.alertTypeName}</span></div>
                                    <div className="col-xs-2"><span className="cell">{obj.platform}</span></div>
                                    <div className="col-xs-2"><span className="cell">{obj.vendor}</span></div>
                                    <div className="col-xs-2">
                                        <span className="cell">
                                          {
                                              obj.deliveryTypes.map((element) => {
                                                  if (element === "EMAIL")
                                                      return <span className="glyphicon glyphicon-envelope"></span>
                                                  if (element === "SMS")
                                                      return <span className="glyphicon glyphicon-comment"></span>
                                                  if (element === "PUSH")
                                                      return <span className="glyphicon glyphicon-bell"></span>

                                              })
                                          }
                                        </span>
                                    </div>
                                    <div className="col-xs-2"><span className="cell">{obj.description}</span></div>
                                    <div className="col-xs-2"><span className="cell"><span
                                        className={this.state.collapseID === obj.alertTypeId ? "caret up" : "caret"}
                                        onClick={(e) => this.expandAccordian(obj)}></span></span></div>
                                </div>

                                {/* <div id={"accordion_" + obj.alertTypeId}
                                     className={this.state.collapseID === obj.alertTypeId ? "collapse in row data" : "collapse"}>
                                   <EditorTabs

                                        />
                                </div> */}
                                {loaderStore.isLoading && collapseID === obj.alertTypeId ? 
                                    <Loader /> : 
                                    <div id={"accordion_" + obj.alertTypeId}
                                     className={this.state.collapseID === obj.alertTypeId ? "collapse in row data" : "collapse"}>
                                   <EditorTabs

                                        />
                                </div>}

                            </div>

                        )
                    })
                    : null}

            </div>
        );
    }



}

export default ResultTable;
