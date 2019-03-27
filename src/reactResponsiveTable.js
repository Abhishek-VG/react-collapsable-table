/**
 * @author Abhishek VG
 */
import React from "react";
import cx from 'classnames';
import { TableToolBar } from './tableToolBar';
import { TablePagination } from './tablePagination';
import './reactResponsiveTableStyles.css';

const tableHeader = [
  { id: 'Firstname' }, { id: 'Lastname' }, { id: 'Email' }
];
const tableBody = [
  { id: 1, Firstname: 'Monkey', Lastname: 'D', Email: 'mokney@gmail.com' },
  { id: 2, Firstname: 'Zoro', Lastname: 'Roro', Email: 'lost@gmail.com' },
  { id: 3, Firstname: 'Brazve', Lastname: 'Usopp', Email: 'usopp@gmail.com' },
  { id: 4, Firstname: 'Monkey', Lastname: 'D', Email: 'mokney@gmail.com' },
  { id: 5, Firstname: 'Zoro', Lastname: 'Roro', Email: 'lost@gmail.com' },
];

export default class ReactResponsiveTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHeaderData: [],
      tableBodyData: [],
      tableMinWidth: null,
      collapseColumn: false,
      order: 'asc',
      orderBy: false,
      rowsPerPage: 25,
      page: 1,
      searchText: '',
    };
    //ref
    this.table = React.createRef();
    this.tableContainer = React.createRef();
    this.valuesInitialization = this.valuesInitialization.bind(this);
    this.changeRowsPerPage = this.changeRowsPerPage.bind(this);
    this.changePage = this.changePage.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }


  //LIFECYCLE METHODS STARTS
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.tableHeaderData.length !== 0 && prevState.tableHeaderData.length === 0) {
      nextProps.tableHeaderData.forEach((eachData) => {
        eachData[eachData.id] = React.createRef()
      });
      return { tableHeaderData: nextProps.tableHeaderData, tableBodyData: nextProps.tableBodyData, init: true }
    } else if (prevState.init) {
      return { init: false }
    } return null
  }

  componentDidMount() {
    window.addEventListener("resize", this.resize.bind(this));
    if (this.state.init) this.resize();
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.state.init) this.resize();
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize.bind(this));
  }
  //LIFECYCLE METHODS ENDS

  //COLUMN HIDING SECTION STARTS
  valuesInitialization(tableWidth) {
    const { tableHeaderData } = this.state;
    console.log('this.state', this.state)

    tableHeaderData.forEach(data => {
      data.width = data[data.id].current.offsetWidth
    });
    console.log('uuuu')
    this.setState({ tableMinWidth: tableWidth });
  }

  displayAllColumns() {
    const { tableHeaderData } = this.state;
    return tableHeaderData.map((data, key) => Object.assign({}, data, { hide: false }))
  }

  resize() {
    const { tableHeaderData } = this.state;
    let collapseColumn;
    //40px is the size of icon
    let sum = this.state.collapseColumn ? 40 : 0;
    let updatedTableHeaderData;
    const TableWidth = this.state.tableMinWidth || this.table.current.offsetWidth;
    const tableContainerWidth = this.tableContainer.current.offsetWidth;
    console.log('TableWidth = ',TableWidth,' | tableContainerWidth =',tableContainerWidth, tableHeaderData)
    if (TableWidth > tableContainerWidth) {
      //to set all cells and table min width
      if (this.state.tableMinWidth === null) {
        console.log('Finally')
        this.valuesInitialization(TableWidth)
      }

      //to find the index,
      const index = tableHeaderData.findIndex((headerData) => {
        sum += headerData.width;
        return sum > tableContainerWidth;
      });
      if (index !== -1) {
        collapseColumn = true;
        updatedTableHeaderData = tableHeaderData.map((data, key) => {
          let hide;
          if (key >= index) {
            hide = true;
          } else
            hide = false;
          return Object.assign({}, data, { hide });
        });
      } else {
        collapseColumn = false;
        updatedTableHeaderData = this.displayAllColumns()
      }
    } else {
      collapseColumn = false;
      updatedTableHeaderData = this.displayAllColumns();
    }
    this.setState({ tableHeaderData: updatedTableHeaderData, collapseColumn });
  }
  //COLUMN HIDING SECTION ENDS

  handleSearch(event) {
    this.setState({ searchText: event.target.value })
  }

  handleRowExpand(rowIndex, rowData, expand) {
    const { tableBodyData } = this.state;
    const actualIndex = tableBodyData.findIndex((obj) => obj.id === rowData.id)
    this.setState({
      tableBodyData: [
        ...this.state.tableBodyData.slice(0, actualIndex),
        { ...this.state.tableBodyData[actualIndex], expand },
        ...this.state.tableBodyData.slice(actualIndex + 1),
      ]
    });
  }

  //chnages the table page
  changePage(page) {
    this.setState({ page: eval(page) })
  }

  //changes the row number
  changeRowsPerPage(rowsPerPage) {
    this.setState({ rowsPerPage: eval(rowsPerPage) })
  }

  //SORTING LOGIC STARTS HERE
  sortColumn(id) {
    let order = 'desc'
    if (this.state.orderBy === id && this.state.order === 'desc') {
      order = 'asc';
    }
    this.setState({ orderBy: id, order })
  }

  //decending order logic
  descendingLogic(x, y, orderBy) {
    if (y[orderBy] < x[orderBy]) {
      return -1;
    }
    if (y[orderBy] > x[orderBy]) {
      return 1;
    }
    return 0;
  }

  sortTable(bodyData, cmp) {
    const { searchText } = this.state;
    const filteredResult = bodyData.filter((eachBodyObject) => {
      return Object.values(eachBodyObject).find(el => {
        return el !== true && el !== false && isNaN(el) && el.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
      })
    })
    const stabilizedThis = filteredResult.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = cmp(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
  }

  getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => this.descendingLogic(a, b, orderBy) : (a, b) => -this.descendingLogic(a, b, orderBy);
  }

  render() {
    const { collapseColumn, tableHeaderData, tableBodyData, rowsPerPage, page, order, orderBy } = this.state;
    //returns null when tableHeaderData is not present
    if (tableHeaderData.length === 0) return null
    
    const headerDataToDisplay = this.sortTable(tableBodyData, this.getSorting(order, orderBy))
      .slice((page - 1) * rowsPerPage, (page - 1) * rowsPerPage + rowsPerPage);
    
      return (
      <div className="reactResponsiveTableContainer"style={{ width: '100%', overflow: 'auto' }} ref={this.tableContainer}>
        <TableToolBar
          changeRowsPerPage={this.changeRowsPerPage}
          rowsPerPage={rowsPerPage}
          handleSearch={this.handleSearch}
        />
        <table className="table" ref={this.table}>
          <thead>
            <tr>
              {
                tableHeaderData.map((eachHeaderData) => {
                  return (
                    <React.Fragment>
                      <th
                        ref={eachHeaderData[eachHeaderData.id]}
                        style={{ display: eachHeaderData.hide ? "none" : "" }}
                        onClick={() => this.sortColumn(eachHeaderData.id)}
                      >
                        {
                          this.state.orderBy === eachHeaderData.id &&
                          <svg className={cx('j61', 'j806', this.state.order === 'asc' ? 'j807' : 'j808')} focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                            <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"></path>
                          </svg>
                        }
                        {eachHeaderData.id}
                      </th>
                    </React.Fragment>
                  )
                })
              }
              {collapseColumn && <th></th>}
            </tr>
          </thead>
          <tbody>
            {
              headerDataToDisplay.length === 0 ?
                <tr><td colSpan={tableHeaderData.length}>No Records Found!!!</td></tr>
                :
                headerDataToDisplay.map((eachRowData, rowIndex) => {
                  return (
                    <React.Fragment>
                      {/* table body data which is displayed starts*/}
                      <tr>
                        {
                          tableHeaderData.map((eachHeaderData) => {
                            return <td style={{ display: eachHeaderData.hide ? "none" : "" }}>
                              {eachRowData[eachHeaderData.id]}</td>
                          })
                        }
                        {collapseColumn && <td className={eachRowData.expand ? "minus" : "plus"} onClick={this.handleRowExpand.bind(this, rowIndex, eachRowData, !eachRowData.expand)}></td>}
                      </tr>
                      {/* table body data which is displayed ends*/}

                      {/* prints data which are hidden */}
                      {collapseColumn && eachRowData.expand && <tr>
                        <td colSpan={tableHeaderData.length}>
                          {
                            <ul class="rowDetailsContainer">
                              {
                                tableHeaderData.reduce((finalObj, eachHeaderData) => {
                                  if (eachHeaderData.hide)
                                    finalObj.push(<li className="rowDetails">
                                      <b>{eachHeaderData.id}</b>
                                      {`:  ${eachRowData[eachHeaderData.id]}`}</li>);
                                  return finalObj
                                }, [])
                              }
                            </ul>
                          }
                        </td>
                      </tr>
                      }
                      {/* prints data which are hidden */}
                    </React.Fragment>
                  )
                })
            }
          </tbody>
          <tfoot>
            <tr>
              {
                tableHeaderData.map((eachHeaderData) => {
                  return (
                    <React.Fragment>
                      <th
                        ref={eachHeaderData[eachHeaderData.id]}
                        style={{ display: eachHeaderData.hide ? "none" : "" }}
                        onClick={() => this.sortColumn(eachHeaderData.id)}
                      >
                        {eachHeaderData.id}
                      </th>
                    </React.Fragment>
                  )
                })
              }
              {collapseColumn && <th></th>}
            </tr>
          </tfoot>
        </table>
        <TablePagination
          rowsPerPage={rowsPerPage}
          count={tableBodyData.length}
          page={page}
          onChangePage={this.changePage}
        />
      </div>
    )
  }
}
