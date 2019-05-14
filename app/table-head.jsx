import React from 'react';

const tableHead = (props) => {
    return (
        <div className="row heading">

            {props.columns.map((col, i) => {
                return <div className="col-xs-2"><span className="cell">{col}</span></div>
            })}
        </div>
    );
}

export default tableHead;