import React from 'react';
import AlertTypeService from "./service/AlertTypeService";
import MainLayout from "./MainLayout";
import AlertTypeResourceStore from "./store/AlertTypeStore";
import { Provider } from 'mobx-react';
import AlertTemplateResourceStore from "./store/AlertTemplateStore";

class App extends React.Component {
  constructor(props){
    super(props);

  }

  render() {
   	return (
        <Provider
            alertTypeStore={AlertTypeResourceStore}
            alertTemplateStore={AlertTemplateResourceStore}
        >
              <MainLayout/>
        </Provider>
  );
 }


}
export default App;
