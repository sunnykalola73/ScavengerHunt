import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import NotFoundPage from "./components/notFoundPage";

import { routes } from "./constants";

import "./App.css";

const App = (props) => {
  return (
    <Router>
      <Route exact path="/">
        <Redirect to="user" />
      </Route>
      <Switch>
        {routes.map((route, i) => (
          <Route path={route.path} component={route.component} key={i} />
        ))}
        <Route component={NotFoundPage} />
      </Switch>
    </Router>
  );
};

export default App;
