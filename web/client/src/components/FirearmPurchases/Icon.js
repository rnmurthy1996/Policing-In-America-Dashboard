import React from "react";
import Card from "react-bootstrap/Card";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

/**
 * Circular icon class that will display with a tooltip and percentage
 * as well as the name of the icon being displayed.
 *
 * TODO: Confirm accuracy of tooltips, these are currently just placeholders
 */
export default function Icon(props) {

    // Check whether we have tooltips or not. If not, nothing will be displayed
    // to ensure that spacing is maintained even if there aren't enough icons
    if (props.tooltip) {
        return (
            <OverlayTrigger
            key={props.label}
            placement="top"
            overlay={
                <Tooltip id={props.label + "-tooltip"}>
                    {props.tooltip}
                </Tooltip>
            }>
            <Card className="text-center" border="white" style={{padding: "3.5%"}}>
                <Card.Text style={{fontSize: "20px"}}>
                    {props.label}
                </Card.Text>
                <Card.Img className="mx-auto d-block" src={props.image} style={{
                    borderRadius: 100,
                    background: "#212529",
                    height: props.height,
                    width: props.width,
                }}/>
                <Card.Body>
                    <Card.Title style={{fontSize: "40px"}}>{props.percentage}</Card.Title>
                </Card.Body>

            </Card>
        </OverlayTrigger>
        )
    } else {
        return (
                <Card className="text-center" border="white" style={{padding: "3.5%"}}>
                    <Card.Text style={{fontSize: "20px"}}>
                        {props.label}
                    </Card.Text>
                    <Card.Body>
                        <Card.Title style={{fontSize: "40px"}}>{props.percentage}</Card.Title>
                    </Card.Body>
                </Card>
        )
    }
}
