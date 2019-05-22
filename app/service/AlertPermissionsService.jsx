'use strict';
import AlertManagementService from "./AlertManagementService";
import  AlertPermissionResourceStore from "../store/AlertPermissionStore";

let _data = {"PERMISSION_DTO":"{\"administrator\":true,\"editor\":true,\"viewer\":false,\"role\":\"Administrator\"}"};
export default class AlertPermissionsService {


    static loadPermissions(){
        AlertManagementService.loadPermissions().then((response) => {
            AlertPermissionResourceStore.setPermissions(JSON.parse(response.data.PERMISSION_DTO))
        })
        .catch((response) => {
            // Only process this response if the saved processID matches the current
            // global requestID. If it doesn't match, the response is stale and we can
            // ignore it.
            console.log("Exception while fetching templates")

            // for local testing only uncomment above _data variable before using below code.
            AlertPermissionResourceStore.setPermissions(JSON.parse(_data.PERMISSION_DTO))

        });
    }

}
