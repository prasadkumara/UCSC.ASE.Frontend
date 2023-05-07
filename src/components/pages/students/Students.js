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

class Students extends Component {
    constructor(props) {
        super(props)
        this.state = {
            studentId: 0,
            studentName: "",
            studentNameError: "",
            studentAddress: "",
            studentAddressError: "",
            studentEmial: "",
            studentEmailError: "",
            studentMobile: "",
            studentMobileError: "",
            studentBatch: "",
            studentBatchError: "",
            existingStudentList: []
        }
    };

    componentDidMount() {
        this.loadExistingStudents();
    };

    handleChangeEvent = (event) => {
        debugger
        if (event.target.value !== "") {
            this.setState({
                [event.target.name]: event.target.value
            })
        }

        if (event.target.name === "studentName") { this.setState({ studentNameError: "" }) }
        if (event.target.name === "studentAddress") { this.setState({ studentAddressError: "" }) }
        if (event.target.name === "studentEmial") { this.setState({ studentEmailError: "" }) }
        if (event.target.name === "studentMobile") { this.setState({ studentMobileError: "" }) }
        if (event.target.name === "studentBatch") { this.setState({ studentBatchError: "" }) }
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
                            studentId: 0,
                            studentName: "",
                            studentNameError: "",
                            studentAddress: "",
                            studentAddressError: "",
                            studentEmial: "",
                            studentEmailError: "",
                            studentMobile: "",
                            studentMobileError: "",
                            studentBatch: "",
                            studentBatchError: ""
                        })
                    }
                }
            }
            this.props.showMessageBox(messageBox);
        } else {
            this.setState({
                studentId: 0,
                studentName: "",
                studentNameError: "",
                studentAddress: "",
                studentAddressError: "",
                studentEmial: "",
                studentEmailError: "",
                studentMobile: "",
                studentMobileError: "",
                studentBatch: "",
                studentBatchError: ""
            })
        }
    };

    loadSelectedStudentData(selectedStudent) {
        if (selectedStudent) {
            this.setState({
                studentId: selectedStudent.id,
                studentName: selectedStudent.name,
                studentAddress: selectedStudent.address,
                studentEmial: selectedStudent.email,
                studentMobile: selectedStudent.mobileNo,
                studentBatch: selectedStudent.batch
            })
        }
    };

    validateSaveData() {
        let isValidate = true;
        if (this.state.studentName === "" || this.state.studentName === null) {
            isValidate = false;
            this.setState({ studentNameError: 'Student name is required' });
        }
        if (this.state.studentAddress === "" || this.state.studentAddress === null) {
            isValidate = false;
            this.setState({ studentAddressError: 'Student address is required' });
        }
        if (this.state.studentEmial === "" || this.state.studentEmial === null) {
            isValidate = false;
            this.setState({ studentEmailError: 'Student email is required' });
        }
        if (this.state.studentMobile === "" || this.state.studentMobile === null) {
            isValidate = false;
            this.setState({ studentMobileError: 'Student mobile is required' });
        }
        if (this.state.studentBatch === "" || this.state.studentBatch === null) {
            isValidate = false;
            this.setState({ studentBatchError: 'Student batch is required' });
        }
        return isValidate;
    };

    loadExistingStudents() {
        this.props.showLoadingScreen();
        get('apigateway-prod/student').then(response => {
            this.props.hideLoadingScreen();
            if (response.request.status === 200) {
                if (response.data !== null) {
                    this.setState({
                        existingStudentList: response.data
                    })
                }
            } else {
                let messageBox = {
                    show: true,
                    title: "Oops!",
                    className: "error",
                    content: "Get existing students failed.\nYou may be able to try again.",
                    isConfirmation: false,
                    callBackFunction: null
                }
                this.props.showMessageBox(messageBox);
                console.error(`Get existing students failed. | ${response.data.errorMessage}`);
            }
        })
    };

    deleteFormData() {
        if (this.state.studentId !== 0) {
            let messageBox = {
                show: true,
                title: "Confirmation",
                className: "error",
                content: "Are you sure you want to delete this student.?",
                isConfirmation: true,
                callBackFunction: (response) => {
                    if (response) {
                        this.props.showLoadingScreen();
                        del(`apigateway-prod/delete-student/${this.state.studentId}`).then(response => {
                            this.props.hideLoadingScreen();
                            if (response.request.status === 200) {
                                let messageBox = {
                                    show: true,
                                    title: "Success",
                                    className: "success",
                                    content: "Student details successfully deleted",
                                    isConfirmation: false,
                                    callBackFunction: () => {
                                        this.resetFormData(false);
                                        this.loadExistingStudents();
                                    }
                                }
                                this.props.showMessageBox(messageBox);
                            } else {
                                let messageBox = {
                                    show: true,
                                    title: "Oops!",
                                    className: "error",
                                    content: "Delete student failed.\nYou may be able to try again.",
                                    isConfirmation: false,
                                    callBackFunction: null
                                }
                                this.props.showMessageBox(messageBox);
                                console.error(`Delete student failed. | ${response.data.errorMessage}`);
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
                content: "Please select an existing student",
                isConfirmation: false,
                callBackFunction: null
            }
            this.props.showMessageBox(messageBox);
        }
    };

    saveFormData() {
        if (this.validateSaveData()) {
            let formData = {
                Name: this.state.studentName,
                Address: this.state.studentAddress,
                Email: this.state.studentEmial,
                MobileNo: this.state.studentMobile,
                Batch: this.state.studentBatch
            }
            this.props.showLoadingScreen();
            post("apigateway-prod/save-student", formData).then(response => {
                this.props.hideLoadingScreen();
                if (response.request.status === 200) {
                    let messageBox = {
                        show: true,
                        title: "Success",
                        className: "success",
                        content: "Student details successfully saved",
                        isConfirmation: false,
                        callBackFunction: () => {
                            this.resetFormData(false);
                            this.loadExistingStudents();
                        }
                    }
                    this.props.showMessageBox(messageBox);
                } else {
                    let messageBox = {
                        show: true,
                        title: "Oops!",
                        className: "error",
                        content: "Save student details failed.\nYou may be able to try again.",
                        isConfirmation: false,
                        callBackFunction: null
                    }
                    this.props.showMessageBox(messageBox);
                    console.error(`Save student details failed. | ${response.data.errorMessage}`);
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
                                <i className="fa fa-cube"></i> Student Details
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
                                                <Label>Student Address</Label>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12" sm="12" xs="12">
                                                <Input id="studentAddress_id" name="studentAddress" type="text" value={this.state.studentAddress} maxLength={50} autoComplete="off"
                                                    onChange={this.handleChangeEvent.bind(this)} />
                                                <ErrorSpan IsVisible={true} ErrorName={this.state.studentAddressError} />
                                            </Col>
                                        </Row>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="6" sm="12" xs="12">
                                        <Row>
                                            <Col md="12" sm="12" xs="12">
                                                <Label>Student Emial</Label>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12" sm="12" xs="12">
                                                <Input id="studentEmial_id" name="studentEmial" type="text" value={this.state.studentEmial} maxLength={50} autoComplete="off"
                                                    onChange={this.handleChangeEvent.bind(this)} />
                                                <ErrorSpan IsVisible={true} ErrorName={this.state.studentEmailError} />
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md="6" sm="12" xs="12">
                                        <Row>
                                            <Col md="12" sm="12" xs="12">
                                                <Label>Student Mobile</Label>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12" sm="12" xs="12">
                                                <Input id="studentMobile_id" name="studentMobile" type="text" value={this.state.studentMobile} maxLength={50} autoComplete="off"
                                                    onChange={this.handleChangeEvent.bind(this)} />
                                                <ErrorSpan IsVisible={true} ErrorName={this.state.studentMobileError} />
                                            </Col>
                                        </Row>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="6" sm="12" xs="12">
                                        <Row>
                                            <Col md="12" sm="12" xs="12">
                                                <Label>Student Batch</Label>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12" sm="12" xs="12">
                                                <Input id="studentBatch_id" name="studentBatch" type="text" value={this.state.studentBatch} maxLength={50} autoComplete="off"
                                                    onChange={this.handleChangeEvent.bind(this)} />
                                                <ErrorSpan IsVisible={true} ErrorName={this.state.studentBatchError} />
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
                                <i className="fa fa-cube"></i> Existing Students
                                <Collapsible id="student_exist_student_details_id" />
                            </CardHeader>
                            <CardBody id="student_exist_student_details_id">
                                <FormGroup row>
                                    <Col md="12" sm="12" xs="12">
                                        <div style={{ overflowX: "auto" }}>
                                            <table className="exist-student-table">
                                                <tbody>
                                                    <tr style={{ color: "white", backgroundColor: "#6c757d" }}>
                                                        <th>Student Id</th>
                                                        <th>Student Name</th>
                                                        <th>Student Address</th>
                                                        <th>Student Emial</th>
                                                        <th>Student Mobile</th>
                                                        <th>Student Batch</th>
                                                    </tr>
                                                    <React.Fragment>
                                                        {
                                                            this.state.existingStudentList.map((student, index) => (
                                                                <tr key={index} onClick={this.loadSelectedStudentData.bind(this, student)}>
                                                                    <td>{student.id}</td>
                                                                    <td>{student.name}</td>
                                                                    <td>{student.address}</td>
                                                                    <td>{student.email}</td>
                                                                    <td>{student.mobileNo}</td>
                                                                    <td>{student.batch}</td>
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

export default connect(mapStateToProps, mapDispatchToProps)(Students)
