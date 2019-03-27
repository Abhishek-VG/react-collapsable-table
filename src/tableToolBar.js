/**
 * @author Abhishek VG
 */
import React from 'react'

export class TableToolBar extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { changeRowsPerPage, handleSearch, rowsPerPage } = this.props
        return (
            <React.Fragment>
                <div className="rowsPerPage">
                    <label className="label">Show
                         <select
                            onChange={(event) => changeRowsPerPage(event.target.value)}
                            value={rowsPerPage}
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select> entries</label>
                </div>
                <div id="example_filter" className="tableSearch">
                    <label className="label">Search:
                        <input type="search" className="" name="example_filter" onChange={handleSearch} />
                    </label>
                </div>
            </React.Fragment>
        )
    }
}