'use strict'
import { observable, action, configure, toJS } from 'mobx';
configure({ enforceActions: 'observed' });

class LoaderStore {
    @observable isLoading = false;
    @observable isFullScreenLoading = false;

    @action
    loadingStart = () => {
        this.isLoading = true;
    };

    @action
    loadingComplete = () => {
        this.isLoading = false;
    };

    @action
    fullScreenLoadingStart = () => {
        this.isFullScreenLoading = true;
    };

    @action
    fullScreenLoadingComplete = () => {
        this.isFullScreenLoading = false;
    };
}
const LoaderResourceStore = new LoaderStore();
export default LoaderResourceStore;