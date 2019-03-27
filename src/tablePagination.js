/**
 * @author Abhishek VG
 */
import React from 'react'
import cx from 'classnames';

export class TablePagination extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { rowsPerPage, page, count, onChangePage } = this.props;
        const pageStartValue = ((page - 1) * rowsPerPage) + 1;
        const pageEndValue = (pageStartValue + rowsPerPage - 1) < count ? pageStartValue + rowsPerPage - 1 : count
        const pageRangeDetails = `Showing ${pageStartValue} to ${pageEndValue} of ${count} entries`;
        const numberOfPages = Math.ceil(count / rowsPerPage);
        return (
            <div>
                <div className="tablePaginatorInfo">{pageRangeDetails}</div>

                <div className="tablePaginateControls">

                    <a className={cx('paginateButton', 'previous', page === 1 && 'disabled')} aria-controls="example" data-dt-idx="0" tabindex="0" id="example_previous" onClick={page !== 1 && onChangePage.bind(null, page - 1)}>Previous</a>
                    {/* generates the pagination */}
                    <span>
                        {
                            Array(numberOfPages).fill("").map((unwantedData, index) => {
                                return (<a className={cx('paginateButton', page === index + 1 && 'current')} onClick={onChangePage.bind(null, index + 1)}>
                                    {index + 1}
                                </a>)
                            })
                        }
                    </span>

                    <a className={cx('paginateButton', 'next', page === numberOfPages && 'disabled')} aria-controls="example" data-dt-idx="3" tabindex="0" id="example_next" onClick={page !== numberOfPages && onChangePage.bind(null, page + 1)}>
                        Next
            </a>
                </div>
            </div>
        )
    }
}