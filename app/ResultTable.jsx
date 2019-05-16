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
            'Description',
            ''
        ];

        const {alertTypeStore, alertTemplateStore, loaderStore} = this.props;
        const { collapseID } = this.state;
        return (
            <table class="table table-striped">
                <Thead columns={columns}/>
                
                <tbody>
                {alertTypeStore.filteredAlertTypes ? alertTypeStore.filteredAlertTypes.map((obj) => {
                        return (
                            <React.Fragment>
                            <tr>
                                <td>{obj.alertTypeName}</td>
                                <td>{obj.platform}</td>
                                <td>{obj.vendor}</td>
                                    <td>
                                        {
                                            obj.deliveryTypes.map((element) => {
                                                if (element === "EMAIL")
                                                    return <span className="glyphicon glyphicon-envelope icon-margin"></span>
                                                if (element === "SMS")
                                                    return <span className="glyphicon glyphicon-comment icon-margin"></span>
                                                if (element === "PUSH")
                                                    return <span className="glyphicon glyphicon-bell icon-margin"></span>

                                            })
                                        }
                                    </td>
                                
                                <td>{obj.description}</td>
                                <td><span
                                    className={this.state.collapseID === obj.alertTypeId ? "glyphicon glyphicon-menu-up" : "glyphicon glyphicon-menu-down"}
                                    onClick={(e) => this.expandAccordian(obj)}></span></td>
                            </tr>
                            {loaderStore.isLoading && collapseID === obj.alertTypeId ? 
                                    <td colSpan="6"><Loader /></td> : this.state.collapseID === obj.alertTypeId && <tr>
                            <td colSpan="6">
                            <div id={"accordion_" + obj.alertTypeId}
                                    className={this.state.collapseID === obj.alertTypeId ? "collapse in row data" : "collapse"}>
                                <EditorTabs

                                    />
                            </div>
                            </td>
                            </tr>}
                            </React.Fragment>            
                        )
                    })
                    : null}
            </tbody>
            </table>
        );
    }



}

export default ResultTable;
