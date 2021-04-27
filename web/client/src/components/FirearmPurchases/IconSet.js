import React, {useState, useEffect} from "react";
import Icon from "./Icon";
import {image_map} from "./Util";
import CardGroup from "react-bootstrap/CardGroup";

export default function IconSet(props) {


    const [icons, setIcons] = useState([])

    /**
     * Update the icon set everytime the data backing it changes
     */
    useEffect(() => {
        let temp = props.queryData.arr.map((categoryObj, i) => {
            return <Icon
                key={"icon-"+i}
                image={image_map[categoryObj.type]["light"]}
                height={props.height}
                width={props.width}
                label={image_map[categoryObj.type]['label']}
                tooltip={image_map[categoryObj.type]['tooltip']}
                percentage={parseInt(categoryObj.totalCost / props.queryData.total * 100) + "%"}
            />
        });

        if (temp.length === 0) {
            setIcons([<h1>No data available</h1>])
        } else if (temp.length < 5) {
            for (let i = 0; i < 5 - temp.length; i++) {
                temp.push(<Icon
                    key={"blank-"+i}
                    height={props.height}
                    width={props.width}
                    label={""}
                    percentage={""}
                />)
            }
            setIcons(temp);
        } else {
            setIcons(temp);
        }
    }, [props.queryData, props.height, props.width]);

    /**
     * Render
     */
    return (
        <CardGroup>
            {icons}
        </CardGroup>
    )
}

