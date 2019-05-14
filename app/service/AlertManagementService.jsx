'use strict';

import axios from 'axios';
import {toJS } from 'mobx';
export default class AlertManagementService {

    static getTemplates(alertTypeResource){
        let commonUrlLocal = dashboard.getTemplates;
        return axios.post(commonUrlLocal,{},{params:{alertTypeName:alertTypeResource.alertTypeName}})

    }

    static getAlertTypeResources(){
        let commonUrlLocal = dashboard.getAlertTypeRecords;
        return axios.post(commonUrlLocal)
    }

    static saveTemplates(alertTemplate){
        let commonUrlLocal = dashboard.saveTemplates;
        return axios.post(commonUrlLocal, toJS(alertTemplate));
    }

    static publishTemplate(template){
        let commonUrlLocal = dashboard.publishTemplate;
        return axios.post(commonUrlLocal,{}, {params:{id:template.alertTemplateResourceId, alertTypeName: template.alertTypeName}});
    }

    static deleteTemplate(template){
        let commonUrlLocal = dashboard.deleteTemplate;
        return axios.post(commonUrlLocal,{}, {params:{id:template.alertTemplateResourceId, alertTypeName: template.alertTypeName}});
    }


}