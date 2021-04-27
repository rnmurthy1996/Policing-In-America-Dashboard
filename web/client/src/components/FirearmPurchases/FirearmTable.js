import React, {useEffect, useState} from "react";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

/**
 * Builds the table for displaying more detailed data. This will return three columns of item_name, type, and cost
 * and is set to be paginated by default.
 *
 * @param props
 * @returns {*}
 * @constructor
 */
export default function FirearmTable(props) {

    const [data, setData] = useState([{item_type: 'n/a', item_name: 'n/a', cost: 'n/a'}])

    /**
     * Number formatting helper. Invoked with formatter.format(n)
     * Credit: https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-string
     */
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    });


    /**
     * Basically the equivalent of componentDidMount for a function, but relies on dependencies in the
     * props changing. Allows state to be effectively passed from upper component
     */
    useEffect(() => {
        const query = `http://localhost:8081/purchasedetails/${props.selectedState}/${props.selectedYear}`;
        console.log("Querying...")
        fetch(query, { method: 'GET' }).then(res => {
            return res.json();
        }, err => {
            console.log(err)
        }).then(resData => {
            let output = resData.map((detailObj, i) => {
                return {
                    item_type: detailObj.item_type,
                    item_name: detailObj.item_name,
                    cost: formatter.format(parseInt(detailObj.cost))
                };
            })
            setData(output);
            console.log("Found data of size..." + data.length)
        })
    }, [props.selectedState, props.selectedYear])

    /**
     * Rendering
     */
    return (
        <div>
            <BootstrapTable
                data={ data }
                pagination>
                <TableHeaderColumn dataField='item_name' isKey={ true }>Item Name</TableHeaderColumn>
                <TableHeaderColumn dataField='item_type'>Item Type</TableHeaderColumn>
                <TableHeaderColumn dataField='cost'>Cost</TableHeaderColumn>
            </BootstrapTable>
        </div>
    )
}