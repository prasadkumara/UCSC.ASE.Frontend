import React, { Component } from 'react';
import { Collapsible, ErrorSpan } from '../../core';
import { get, post, del } from "../../../utility/apiClient";
import { FormGroup, Row, Col, Card, CardHeader, CardBody, Button, Label, Input, InputArea } from 'reactstrap';
import '../students/Style.scss';

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

class PromoCampaigns extends Component {
    constructor(props) {
        super(props)
        this.state = {
            campaignId: 0,
            emailList: "",
            emailListError: "",
            promotionHeader: "",
            promotionHeaderError: "",
            promotionDescription: "",
            promotionDescriptionError: "",
            existingPromoCampaignList: []
        }
    };

    componentDidMount() {
        this.loadExistingPromoCampaigns();
    };

    handleChangeEvent = (event) => {
        debugger
        if (event.target.value !== "") {
            this.setState({
                [event.target.name]: event.target.value
            })
        }

        if (event.target.name === "emailList") { this.setState({ emailListError: "" }) }
        if (event.target.name === "promotionHeader") { this.setState({ promotionHeaderError: "" }) }
        if (event.target.name === "promotionDescription") { this.setState({ promotionDescriptionError: "" }) }
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
                            campaignId: 0,
                            emailList: "",
                            emailListError: "",
                            promotionHeader: "",
                            promotionHeaderError: "",
                            promotionDescription: "",
                            promotionDescriptionError: ""
                        })
                    }
                }
            }
            this.props.showMessageBox(messageBox);
        } else {
            this.setState({
                campaignId: 0,
                emailList: "",
                emailListError: "",
                promotionHeader: "",
                promotionHeaderError: "",
                promotionDescription: "",
                promotionDescriptionError: ""
            })
        }
    };

    loadSelectedPrmoCampaignData(selectedPrmoCampaign) {
        if (selectedPrmoCampaign) {
            this.setState({
                campaignId: selectedPrmoCampaign.id,
                emailList: selectedPrmoCampaign.promoEmail,
                promotionHeader: selectedPrmoCampaign.promotionHeader,
                promotionDescription: selectedPrmoCampaign.promotionDescription
            })
        }
    };

    validateSaveData() {
        let isValidate = true;
        if (this.state.emailList === "" || this.state.emailList === null) {
            isValidate = false;
            this.setState({ emailListError: 'Promo email is required' });
        }
        if (this.state.promotionHeader === "" || this.state.promotionHeader === null) {
            isValidate = false;
            this.setState({ promotionHeaderError: 'Promo header is required' });
        }
        if (this.state.promotionDescription === "" || this.state.promotionDescription === null) {
            isValidate = false;
            this.setState({ promotionDescriptionError: 'Promo description is required' });
        }
        return isValidate;
    };

    loadExistingPromoCampaigns() {
        this.props.showLoadingScreen();
        get('apigateway-prod/promotion').then(response => {
            this.props.hideLoadingScreen();
            if (response.request.status === 200) {
                if (response.data !== null) {
                    this.setState({
                        existingPromoCampaignList: response.data
                    })
                }
            } else {
                let messageBox = {
                    show: true,
                    title: "Oops!",
                    className: "error",
                    content: "Get existing promo campaign details failed.\nYou may be able to try again.",
                    isConfirmation: false,
                    callBackFunction: null
                }
                this.props.showMessageBox(messageBox);
                console.error(`Get existing promo campaign details failed. | ${response.data.errorMessage}`);
            }
        })
    };

    deleteFormData() {
        if (this.state.campaignId !== 0) {
            let messageBox = {
                show: true,
                title: "Confirmation",
                className: "error",
                content: "Are you sure you want to delete this promo campaign detail.?",
                isConfirmation: true,
                callBackFunction: (response) => {
                    if (response) {
                        this.props.showLoadingScreen();
                        del(`apigateway-prod/delete-promotion/${this.state.campaignId}`).then(response => {
                            this.props.hideLoadingScreen();
                            if (response.request.status === 200) {
                                let messageBox = {
                                    show: true,
                                    title: "Success",
                                    className: "success",
                                    content: "Promo campaign detail successfully deleted",
                                    isConfirmation: false,
                                    callBackFunction: () => {
                                        this.resetFormData(false);
                                        this.loadExistingPromoCampaigns();
                                    }
                                }
                                this.props.showMessageBox(messageBox);
                            } else {
                                let messageBox = {
                                    show: true,
                                    title: "Oops!",
                                    className: "error",
                                    content: "Delete promo campaign detail failed.\nYou may be able to try again.",
                                    isConfirmation: false,
                                    callBackFunction: null
                                }
                                this.props.showMessageBox(messageBox);
                                console.error(`Delete promo campaign detail failed. | ${response.data.errorMessage}`);
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
                content: "Please select an existing promo campaign detail",
                isConfirmation: false,
                callBackFunction: null
            }
            this.props.showMessageBox(messageBox);
        }
    };

    saveFormData() {
        if (this.validateSaveData()) {
            let formData = {
                EmailList: this.state.emailList,
                PromotionHeader: this.state.promotionHeader,
                PromotionDescription: this.state.promotionDescription
            }
            this.props.showLoadingScreen();
            post("apigateway-prod/save-promotion", formData).then(response => {
                this.props.hideLoadingScreen();
                if (response.request.status === 200) {
                    let messageBox = {
                        show: true,
                        title: "Success",
                        className: "success",
                        content: "Promo campaign detail successfully saved",
                        isConfirmation: false,
                        callBackFunction: () => {
                            this.resetFormData(false);
                            this.loadExistingPromoCampaigns();
                        }
                    }
                    this.props.showMessageBox(messageBox);
                } else {
                    let messageBox = {
                        show: true,
                        title: "Oops!",
                        className: "error",
                        content: "Save promo campaign detail failed.\nYou may be able to try again.",
                        isConfirmation: false,
                        callBackFunction: null
                    }
                    this.props.showMessageBox(messageBox);
                    console.error(`Save promo campaign detail failed. | ${response.data.errorMessage}`);
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
                                <i className="fa fa-cube"></i> Campaign Details
                                <Collapsible id="student_input_criteria_id" />
                            </CardHeader>
                            <CardBody id="student_input_criteria_id">
                                <FormGroup row>
                                    <Col md="6" sm="12" xs="12">
                                        <Row>
                                            <Col md="12" sm="12" xs="12">
                                                <Label>Email List</Label>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12" sm="12" xs="12">
                                                <Input id="emailList_id" name="emailList" type="textarea" rows="2" value={this.state.emailList} maxLength={500} minLength={0} autoComplete="off"
                                                    onChange={this.handleChangeEvent.bind(this)} />
                                                <ErrorSpan IsVisible={true} ErrorName={this.state.emailListError} />
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md="6" sm="12" xs="12">
                                        <Row>
                                            <Col md="12" sm="12" xs="12">
                                                <Label>Promotion Header</Label>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12" sm="12" xs="12">
                                                <Input id="promotionHeader_id" name="promotionHeader" type="textarea" rows="2" value={this.state.promotionHeader} maxLength={500} minLength={0} autoComplete="off"
                                                    onChange={this.handleChangeEvent.bind(this)} />
                                                <ErrorSpan IsVisible={true} ErrorName={this.state.promotionHeaderError} />
                                            </Col>
                                        </Row>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="6" sm="12" xs="12">
                                        <Row>
                                            <Col md="12" sm="12" xs="12">
                                                <Label>Promotion Description</Label>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12" sm="12" xs="12">
                                                <Input id="promotionDescription_id" name="promotionDescription" type="textarea" rows="5" value={this.state.promotionDescription} maxLength={1000} minLength={0} autoComplete="off"
                                                    onChange={this.handleChangeEvent.bind(this)} />
                                                <ErrorSpan IsVisible={true} ErrorName={this.state.promotionDescriptionError} />
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
                                <i className="fa fa-cube"></i> Existing Campaign Details
                                <Collapsible id="student_exist_student_details_id" />
                            </CardHeader>
                            <CardBody id="student_exist_student_details_id">
                                <FormGroup row>
                                    <Col md="12" sm="12" xs="12">
                                        <div style={{ overflowX: "auto" }}>
                                            <table className="exist-student-table">
                                                <tbody>
                                                    <tr style={{ color: "white", backgroundColor: "#6c757d" }}>
                                                        <th>Campaign Id</th>
                                                        <th>Promo Email</th>
                                                        <th>Promotion Header</th>
                                                        <th>Promo Status</th>
                                                        <th>Promotion Description</th>
                                                        <th>Create On</th>
                                                    </tr>
                                                    <React.Fragment>
                                                        {
                                                            this.state.existingPromoCampaignList.map((promocampaign, index) => (
                                                                <tr key={index} onClick={this.loadSelectedPrmoCampaignData.bind(this, promocampaign)}>
                                                                    <td>{promocampaign.id}</td>
                                                                    <td>{promocampaign.promoEmail}</td>
                                                                    <td>{promocampaign.promotionHeader}</td>
                                                                    <td>{promocampaign.promoStatus == 2 ? 'Email Sent' : 'Email Faild'}</td>
                                                                    <td>{promocampaign.promotionDescription}</td>
                                                                    <td>{promocampaign.createOn}</td>
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

export default connect(mapStateToProps, mapDispatchToProps)(PromoCampaigns)
