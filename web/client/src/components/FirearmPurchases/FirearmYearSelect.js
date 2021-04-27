import React, {useEffect, useState} from "react";

/**
 * Simple dropdown menu comprising years for which data is available in the database.
 * Will react to changes of state so as to only show years with available data
 *
 * @param props
 * @returns {*}
 */
export default function FirearmYearSelect(props) {

    const [selectOptions, setSelectOptions] = useState([])

    /**
     * Set the dropdown any time the selectedState prop changes
     */
    useEffect(() => {
        const query = `http://localhost:8081/years/${props.selectedState}`;
        fetch(query, { method: 'GET' }).then(res => {
            return res.json();
        }, err => {
            console.log(err)
        }).then(data => {
            let options = data.map((yearObj, i) => {
                return <option key={"year-option-" + i} value={yearObj.year}>{yearObj.year}</option>
            })
            setSelectOptions(options);
        })
    }, [props.selectedState])

    /**
     * Quick change handler to invoke the FirearmPurchase's
     * handler
     */
    const handleChange = (e) => {
        props.handleChange('year', e.target.value);
    }

    /**
     * Render
     */
    return (
        <div style={{paddingBottom: "2%", display: "flex"}}>
            <div>
                <h3>Year: </h3>
            </div>
            <div style={{paddingLeft: "3%"}}>
                <select style={{fontSize: "24px"}} onChange={handleChange}>
                    <option select value={'all'}>All available years</option>
                    {selectOptions}
                </select>
            </div>
        </div>
    )
}