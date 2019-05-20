"use strict";

import { observable, action, configure, toJS } from "mobx";

configure({ enforceActions: "observed" });

class LoaderStore {
  @observable isLoading = false;

  @observable isAppLoading = false;

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
    this.isAppLoading = true;
  };

  @action
  fullScreenLoadingComplete = () => {
    this.isAppLoading = false;
  };
}
const LoaderResourceStore = new LoaderStore();
export default LoaderResourceStore;
