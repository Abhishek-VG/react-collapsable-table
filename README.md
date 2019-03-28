# react-collapsable-table
React collapsable table, which collapses the column which can be viewed by expanding gives better mobile experience

## Usage

Here is a quick example to get you started:

```jsx
import React from "react";
import { Table } from "react-collapsable-table";
const tableHeader = [{ id: "Firstname" }, { id: "Lastname" }, { id: "Email" }];
const tableBody = [
  { id: 1, Firstname: "Roronoa", Lastname: "Zoro", Email: "roronoa@gmail.com" },
  { id: 2, Firstname: "Zoro", Lastname: "Roro", Email: "lost@gmail.com" },
  { id: 3, Firstname: "Brazve", Lastname: "Usopp", Email: "usopp@gmail.com" },
  { id: 4, Firstname: "Monkey", Lastname: "D", Email: "mokney@gmail.com" },
  { id: 5, Firstname: "Zoro", Lastname: "Roro", Email: "lost@gmail.com" }
];
export default class App extends React.Component {
  render() {
    return <Table tableHeaderData={tableHeader} tableBodyData={tableBody} />;
  }
}

```

For live and interactive demo:

[![Edit Button](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/worx10krow)
