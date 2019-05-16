import React from 'react';

const tableHead = (props) => {
    return (
        <thead>

            {props.columns.map((col, i) => {
                return <th scope="col">{col}</th>
            })}
        </thead>
    );
}

export default tableHead;