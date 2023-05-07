import React, { Component } from 'react';
import { Collapsible, ErrorSpan } from '../../core';
import { get, post, del } from "../../../utility/apiClient";
import { FormGroup, Row, Col, Card, CardHeader, CardBody, Button, Label, Input } from 'reactstrap';
import './Style.scss';

/*-- Imports for redux --*/
import { connect } from 'react-redux';
import { showMessageBox, resetMessageBox } from '../../../redux/actions/messageBoxActions';
import { showLoadingScreen, hideLoadingScreen } from '../../../redux/actions/loadingScreenActions';

/*-- Map the redux states to props --*/
function mapStateToProps(state) {
    return {}
};

/*-- Map the redux actions to props --*/
const mapDispatchToProps = {
    showMessageBox,
    resetMessageBox,
    showLoadingScreen,
    hideLoadingScreen
};

class StudentReservations extends Component {
    constructor(props) {
        super(props)
        this.state = {
            studentID: 2,
            orderID: 0,
            orderNumber: "",
            studentName: "Mr. Janaka Prasad",
            studentNameError: "",
            studentEmail: "janakaprasad25@gmail.com",
            studentEmailError: "",
            itemList: [],
            existingReservationList: [],
            fooditem1: "",
            foodItem1Error: "",
            foodItem1Qty: 0,
            foodItem1QtyError: "",
            fooditem2: "",
            foodItem2Error: "",
            foodItem2Qty: 0,
            foodItem2QtyError: "",
        }
    };

    componentDidMount() {
        this.loadExistingItems()
        this.loadExistingReservations();
    };

    handleChangeEvent = (event) => {
        debugger
        if (event.target.value !== "") {
            this.setState({
                [event.target.name]: event.target.value
            })
        }

        if (event.target.name === "studentName") { this.setState({ studentNameError: "" }) }
        if (event.target.name === "studentEmail") { this.setState({ studentEmailError: "" }) }
        if (event.target.name === "foodItem1Qty") { this.setState({ foodItem2QtyError: "" }) }
        if (event.target.name === "foodItem1Qty") { this.setState({ foodItem2QtyError: "" }) }
    };

    resetFormData(showConfirmation) {
        if (showConfirmation) {
            let messageBox = {
                show: true,
                title: "Confirmation",
                className: "warning",
                content: "Are you sure you want to reset the form data.?",
                isConfirmation: true,
                callBackFunction: (response) => {
                    if (response) {
                        this.setState({
                            foodItem1Qty: 0,
                            foodItem1QtyError: "",
                            foodItem2Qty: 0,
                            foodItem2QtyError: "",
                            studentNameError: "",
                            studentEmailError: "",
                            fooditem1: "",
                            foodItem1Error: "",
                            fooditem2: "",
                            foodItem2Error: ""
                        })
                    }
                }
            }
            this.props.showMessageBox(messageBox);
        } else {
            this.setState({
                foodItem1Qty: 0,
                foodItem1QtyError: "",
                foodItem2Qty: 0,
                foodItem2QtyError: "",
                studentNameError: "",
                studentEmailError: "",
                fooditem1: "",
                foodItem1Error: "",
                fooditem2: "",
                foodItem2Error: ""
            })
        }
    };

    loadSelectedReservationData(selectedReservation) {
        if (selectedReservation) {
            this.setState({
                orderID: selectedReservation.orderId,
                orderNumber: selectedReservation.orderNumber
            })
        }
    };

    validateSaveData() {
        debugger
        let isValidate = true;
        if (this.state.studentName === "" || this.state.studentName === null) {
            isValidate = false;
            this.setState({ studentNameError: 'Student name is required' });
        }
        if (this.state.studentEmail === "" || this.state.studentEmail === null) {
            isValidate = false;
            this.setState({ studentEmailError: 'Student email is required' });
        }
        if (this.state.fooditem1.length === 0 || this.state.fooditem1 === null) {
            isValidate = false;
            this.setState({ foodItem1Error: 'This food item is required' });
        }
        if (this.state.foodItem1Qty === 0 || this.state.foodItem1Qty === null) {
            isValidate = false;
            this.setState({ foodItem1QtyError: 'Qty is required' });
        }
        if (this.state.fooditem2.length === 0  || this.state.fooditem2 === null) {
            isValidate = false;
            this.setState({ foodItem2Error: 'This food item is required' });
        }
        if (this.state.foodItem2Qty === 0 || this.state.foodItem2Qty === null) {
            isValidate = false;
            this.setState({ foodItem2QtyError: 'Qty is required' });
        }
        return isValidate;
    };

    loadExistingReservations() {
        this.props.showLoadingScreen();
        get('apigateway-prod/reservations').then(response => {
            this.props.hideLoadingScreen();
            if (response.request.status === 200) {
                if (response.data !== null) {
                    this.setState({
                        existingReservationList: response.data
                    })
                }
            } else {
                let messageBox = {
                    show: true,
                    title: "Oops!",
                    className: "error",
                    content: "Get existing reservations failed.\nYou may be able to try again.",
                    isConfirmation: false,
                    callBackFunction: null
                }
                this.props.showMessageBox(messageBox);
                console.error(`Get existing reservations failed. | ${response.data.errorMessage}`);
            }
        })
    };

    loadExistingItems() {
        this.props.showLoadingScreen();
        get('apigateway-prod/items').then(response => {
            this.props.hideLoadingScreen();
            if (response.request.status === 200) {
                if (response.data !== null) {
                    this.setState({
                        itemList: response.data
                    })
                }
            } else {
                let messageBox = {
                    show: true,
                    title: "Oops!",
                    className: "error",
                    content: "Get existing items failed.\nYou may be able to try again.",
                    isConfirmation: false,
                    callBackFunction: null
                }
                this.props.showMessageBox(messageBox);
                console.error(`Get existing items failed. | ${response.data.errorMessage}`);
            }
        })
    };

    deleteFormData() {
        if (this.state.orderID !== 0) {
            let messageBox = {
                show: true,
                title: "Confirmation",
                className: "error",
                content: "Are you sure you want to delete this seservation.?",
                isConfirmation: true,
                callBackFunction: (response) => {
                    if (response) {
                        this.props.showLoadingScreen();
                        del(`apigateway-prod/delete-reservations/${this.state.orderID}`).then(response => {
                            this.props.hideLoadingScreen();
                            if (response.request.status === 200) {
                                let messageBox = {
                                    show: true,
                                    title: "Success",
                                    className: "success",
                                    content: "Reservation details successfully deleted",
                                    isConfirmation: false,
                                    callBackFunction: () => {
                                        this.resetFormData(false);
                                        this.loadExistingReservations();
                                    }
                                }
                                this.props.showMessageBox(messageBox);
                            } else {
                                let messageBox = {
                                    show: true,
                                    title: "Oops!",
                                    className: "error",
                                    content: "Delete reservation failed.\nYou may be able to try again.",
                                    isConfirmation: false,
                                    callBackFunction: null
                                }
                                this.props.showMessageBox(messageBox);
                                console.error(`Delete reservation failed. | ${response.data.errorMessage}`);
                            }
                        })
                    }
                }
            }
            this.props.showMessageBox(messageBox);
        } else {
            let messageBox = {
                show: true,
                title: "Warning",
                className: "warning",
                content: "Please select an existing reservation",
                isConfirmation: false,
                callBackFunction: null
            }
            this.props.showMessageBox(messageBox);
        }
    };

    saveFormData() {
        if (this.validateSaveData()) {
            let formData = {
                studentId: this.state.studentID,
                foodItem1: this.state.fooditem1,
                foodItem2: this.state.fooditem2,
                item1Qty: this.state.foodItem1Qty,
                item2Qty: this.state.foodItem2Qty
            }
            this.props.showLoadingScreen();
            post("apigateway-prod/save-reservations", formData).then(response => {
                this.props.hideLoadingScreen();
                if (response.request.status === 200) {
                    let messageBox = {
                        show: true,
                        title: "Success",
                        className: "success",
                        content: "Reservation details successfully saved",
                        isConfirmation: false,
                        callBackFunction: () => {
                            this.resetFormData(false);
                            this.loadExistingReservations();
                        }
                    }
                    this.props.showMessageBox(messageBox);
                } else {
                    let messageBox = {
                        show: true,
                        title: "Oops!",
                        className: "error",
                        content: "Save reservation details failed.\nYou may be able to try again.",
                        isConfirmation: false,
                        callBackFunction: null
                    }
                    this.props.showMessageBox(messageBox);
                    console.error(`Save reservation details failed. | ${response.data.errorMessage}`);
                }
            })
        }
    };

    render() {
        return (
            <div>
                <Row>
                    <Col md="12" sm="12" xs="12">
                        <Card>
                            <CardHeader>
                                <i className="fa fa-cube"></i> Reservation Details
                                <Collapsible id="student_input_criteria_id" />
                            </CardHeader>
                            <CardBody id="student_input_criteria_id">
                                <FormGroup row>
                                    <Col md="6" sm="12" xs="12">
                                        <Row>
                                            <Col md="12" sm="12" xs="12">
                                                <Label>Student Name</Label>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12" sm="12" xs="12">
                                                <Input id="studentName_id" name="studentName" type="text" value={this.state.studentName} maxLength={50} autoComplete="off"
                                                    onChange={this.handleChangeEvent.bind(this)} />
                                                <ErrorSpan IsVisible={true} ErrorName={this.state.studentNameError} />
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md="6" sm="12" xs="12">
                                        <Row>
                                            <Col md="12" sm="12" xs="12">
                                                <Label>Student Email</Label>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12" sm="12" xs="12">
                                                <Input id="studentEmail_id" name="studentEmail" type="text" value={this.state.studentEmail} maxLength={50} autoComplete="off"
                                                    onChange={this.handleChangeEvent.bind(this)} />
                                                <ErrorSpan IsVisible={true} ErrorName={this.state.studentEmailError} />
                                            </Col>
                                        </Row>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="6" sm="12" xs="12">
                                        <Row>
                                            <Col md="12" sm="12" xs="12">
                                                <Label>Food Item 1</Label>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12" sm="12" xs="12">
                                                <select className='box' name="fooditem1" type="number" value={this.state.fooditem1} onChange={this.handleChangeEvent.bind(this)} required defaultValue="">
                                                    <option value="">Select a Food Item 1</option>
                                                    {this.state.itemList.map((itemsList) => (
                                                        <option key={itemsList.itemCode} value={itemsList.itemCode}>
                                                            {itemsList.itemDescription}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ErrorSpan IsVisible={true} ErrorName={this.state.foodItem1Error} />
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md="6" sm="12" xs="12">
                                        <Row>
                                            <Col md="12" sm="12" xs="12">
                                                <Label>Food Item 1 Qty</Label>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="6" sm="12" xs="12">
                                                <Input id="foodItem1Qty_id" name="foodItem1Qty" type="number" value={this.state.foodItem1Qty} maxLength={50} autoComplete="off"
                                                    onChange={this.handleChangeEvent.bind(this)} />
                                                <ErrorSpan IsVisible={true} ErrorName={this.state.foodItem1QtyError} />
                                            </Col>
                                        </Row>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="6" sm="12" xs="12">
                                        <Row>
                                            <Col md="12" sm="12" xs="12">
                                                <Label>Food Item 2</Label>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12" sm="12" xs="12">
                                                <select className='box' name="fooditem2" type="number" value={this.state.fooditem2} onChange={this.handleChangeEvent.bind(this)} required defaultValue="">
                                                    <option value="">Select a Food Item 2</option>
                                                    {this.state.itemList.map((itemsList) => (
                                                        <option key={itemsList.itemCode} value={itemsList.itemCode}>
                                                            {itemsList.itemDescription}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ErrorSpan IsVisible={true} ErrorName={this.state.foodItem2Error} />
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md="6" sm="12" xs="12">
                                        <Row>
                                            <Col md="12" sm="12" xs="12">
                                                <Label>Food Item 2 Qty</Label>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="6" sm="12" xs="12">
                                                <Input id="foodItem2Qty_id" name="foodItem2Qty" type="number" value={this.state.foodItem2Qty} maxLength={50} autoComplete="off"
                                                    onChange={this.handleChangeEvent.bind(this)} />
                                                <ErrorSpan IsVisible={true} ErrorName={this.state.foodItem2QtyError} />
                                            </Col>
                                        </Row>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    {/* <Col md="3" sm="3" xs="3">
                                    </Col> */}
                                    <Col className="offset-3" md="3" sm="3" xs="3">
                                        <Button block className="btn btn-success mr-2" onClick={this.saveFormData.bind(this)}>Save</Button>
                                    </Col>
                                    <Col md="3" sm="3" xs="3">
                                        <Button block className="btn btn-danger" onClick={this.deleteFormData.bind(this)}>Delete</Button>
                                    </Col>
                                    <Col md="3" sm="3" xs="3">
                                        <Button block className="btn btn-warning" onClick={this.resetFormData.bind(this)}>Reset</Button>
                                    </Col>
                                </FormGroup>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardHeader>
                                <i className="fa fa-cube"></i> Existing Reservations
                                <Collapsible id="student_exist_student_details_id" />
                            </CardHeader>
                            <CardBody id="student_exist_student_details_id">
                                <FormGroup row>
                                    <Col md="12" sm="12" xs="12">
                                        <div style={{ overflowX: "auto" }}>
                                            <table className="exist-student-table">
                                                <tbody>
                                                    <tr style={{ color: "white", backgroundColor: "#6c757d" }}>
                                                        <th>Order ID</th>
                                                        <th>Order Number</th>
                                                        <th>Order Place Date</th>
                                                        <th>Ordered Items</th>
                                                        <th>Sub Total</th>
                                                        <th>Tax Total</th>
                                                        <th>Total</th>
                                                    </tr>
                                                    <React.Fragment>
                                                        {
                                                            this.state.existingReservationList.map((reservation, index) => (
                                                                <tr key={index} onClick={this.loadSelectedReservationData.bind(this, reservation)}>
                                                                    <td>{reservation.orderId}</td>
                                                                    <td>{reservation.orderNumber}</td>
                                                                    <td>{reservation.orderPlaceDate}</td>
                                                                    <td>{reservation.orderedItems}</td>
                                                                    <td>{reservation.subTotal}</td>
                                                                    <td>{reservation.taxAmount}</td>
                                                                    <td>{reservation.totalAmount}</td>
                                                                </tr>
                                                            ))
                                                        }
                                                    </React.Fragment>
                                                </tbody>
                                            </table>
                                        </div>
                                    </Col>
                                </FormGroup>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentReservations)
