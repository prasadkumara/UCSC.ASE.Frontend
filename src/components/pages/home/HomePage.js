import React, { Component } from 'react';
import { Row } from 'reactstrap';
import homeImg from '../../../assets/img/home.jpg';

class HomePage extends Component {

    render() {
        return (
            <div>
                <Row>
                    <img src={homeImg} style={{ width: "100%" }} />
                </Row>
            </div>
        )
    }
}

export default HomePage;