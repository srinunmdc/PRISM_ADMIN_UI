"use strict";
import AlertManagementService from "./AlertManagementService";
import AlertTypeResourceStore from "../store/AlertTypeStore";
import LoaderResourceStore from "../store/LoaderStore";

let _data = {
  alertTypes:
    '{"alertTypes":[{"alertTypeId":1001,"alertTypeName":"CBTYPE1","eventTypeDomain":"ACCOUNT","vendor":"CORELATION","status":"ACTIVE","description":"Callback test alert","alertCategory":"value 1","alertSource":"Banking","platform":"API Prism","deliveryTypes":["EMAIL","PUSH"]},{"alertTypeId":1002,"alertTypeName":"CBTYPE","eventTypeDomain":"ACCOUNT","vendor":"CORELATION","status":"ACTIVE","description":"Callback test alert","alertCategory":"value 2","alertSource":"Banking","platform":"API Prism","deliveryTypes":["EMAIL","PUSH","SMS"]},{"alertTypeId":1502,"alertTypeName":"SBU","eventTypeDomain":"ACCOUNT","vendor":"CORELATION","status":"ACTIVE","description":"LOW balance alert","alertCategory":"value 2","alertSource":"Banking","platform":"API Prism","deliveryTypes":["EMAIL","PUSH"]},{"alertTypeId":3501,"alertTypeName":"SBU-new","eventTypeDomain":"ACCOUNT","vendor":"CORELATION","status":"INACTIVE","description":"LOW balance alert","additionalInfo":{"first":"first Value","second":"second value"},"alertCategory":"value 1","alertSource":"Banking","platform":"API Prism","deliveryTypes":["PUSH"]}]}'
};
export default class AlertTypeService {
  static loadAlertTypeResources() {
    LoaderResourceStore.fullScreenLoadingStart();
    AlertManagementService.getAlertTypeResources()
      .then(response => {
        LoaderResourceStore.fullScreenLoadingComplete();
        AlertTypeResourceStore.setAlertTypes(
          JSON.parse(response.data.alertTypes)
        );
      })
      .catch(response => {
        // Only process this response if the saved processID matches the current
        // global requestID. If it doesn't match, the response is stale and we can
        // ignore it.
        console.log("Exception while fetching templates");
        LoaderResourceStore.fullScreenLoadingComplete();

        // for local testing only uncomment above _data variable before using below code.
        AlertTypeResourceStore.setAlertTypes(JSON.parse(_data.alertTypes));
      });
  }

  static filterAlertTypeResources(search) {}
}
