import React from 'react';
import DevTools from 'mobx-react-devtools';
import AlertTypeService from "./service/AlertTypeService";
import MainLayout from "./MainLayout";
import AlertTypeResourceStore from "./store/AlertTypeStore";
import { Provider } from 'mobx-react';
import AlertTemplateResourceStore from "./store/AlertTemplateStore";
import LoaderResourceStore from "./store/LoaderStore";

class App extends React.Component {
  constructor(props){
    super(props);

  }

  render() {
   	return (
       <div>
          <Provider
              alertTypeStore={AlertTypeResourceStore}
              alertTemplateStore={AlertTemplateResourceStore}
              loaderStore={LoaderResourceStore}
          >
                <MainLayout/>
          </Provider>
          <DevTools />
        </div>
  );
 }


}
export default App;
