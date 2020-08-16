import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import { Header, Icon, List } from "semantic-ui-react";

class App extends Component {
  state = {
    values: [],
  };
  componentDidMount() {
    // this.setState({
    //   values: [
    //     { id: 1, name: "Value 101" },
    //     { id: 2, name: "Value 102" },
    //   ],
    // });
    axios.get("http://localhost:5000/api/values").then((response) => {
      this.setState({
        values: response.data,
      });
    });
  }
  render() {
    return (
      <div>
        <Header as="h2" icon>
          <Icon name="plug" />
          <Header.Subheader>Reactivities</Header.Subheader>
        </Header>
        <ul>
          {this.state.values.map((value: any) => (
            <List.Item key={value.id}>{value.name}</List.Item>
          ))}
        </ul>
      </div>
    );
  }
}

export default App;
