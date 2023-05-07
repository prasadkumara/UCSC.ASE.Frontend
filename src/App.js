import React, { Component } from 'react';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import LoadingScreen from './components/core/loadingScreen/LoadingScreen';

/*-- Import required components --*/
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout/DefaultLayout'));

class App extends Component {
  render() {
    let myLoading = () => (
      <LoadingScreen isVisible={true} />
    );

    return (
      <BrowserRouter>
        <React.Suspense fallback={myLoading()}>
          <Switch>
            <Route path="/" name="DEFAULT LAYOUT" render={props => <DefaultLayout {...props} />} />
          </Switch>
        </React.Suspense>
      </BrowserRouter>
    )
  }
}

export default App;
