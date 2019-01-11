import React from 'react';
import FlowerContract from "./FlowerContract"

import { Form, FormGroup, Label, Input, Button, Row} from 'reactstrap';

const flowernum = {"rose":0, "tulip":1 ,"jasmine":2, "white":3};
const types = ["rose", "tulip" ,"jasmine", "white"];

async function makeRequest(amount, time, flower){
    /*Metamask sends error on rejections even if it's catched so currently no checking is done between calls*/
    let txhash = await FlowerContract.methods.submitRequest(new Date(time).getTime() / 1000).send({to: FlowerContract.options.address,from: FlowerContract.defaultAccount, gas :1000000}); //Create request
    let txhashExtra = await FlowerContract.methods.submitRequestExtra(txhash.events.RequestAdded.returnValues[0], amount, flowernum[flower]).send({to: FlowerContract.options.address,from: FlowerContract.defaultAccount, gas :1000000});//Add parameters to request
    FlowerContract.last_block_number = txhash.blockNumber;
    FlowerContract.last_gas_used = txhash.gasUsed;
    let adds = FlowerContract.events.RequestAdded();
    console.log(txhashExtra, adds);
    window.location.reload(); //This is done to update RequestList
}

class MakeOffer extends React.Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event){
        event.preventDefault();
        const target = event.target;
        const amount = Math.round(target.amount.value);
        const time = target.dateTime.value;
        const flower = target.flowerType.value;
        makeRequest(amount,time,flower);
    }

    render() {
        return (
            <div className="jumbotron">
                <Form id="flowerRequest" onSubmit={this.handleSubmit}>
                    <Row className="justify-content-center" style={{padding: '5px',backgroundColor:'cornsilk'}}>
                        <FormGroup>
                            <Label for="exampleNumber">Quantity </Label>
                            <Input type="number" name="number" id="amount" min="1" step="1" placeholder="Quantity" required/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="exampleSelect">Flowertype </Label>
                            <Input type="select" name="select" id="flowerType" required>
                                {types.map(flower => <option key={flower}>{flower}</option>)}
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="exampleDatetime">Endtime</Label>
                            <Input type="datetime-local" name="datetime" id="dateTime" placeholder={Date.now()} required/>
                        </FormGroup>
                        <Button style={{'height': '50%', 'top': '34px', 'position': 'relative','backgroundColor':'#28a745'}} form="flowerRequest" type="submit" value="Submit" onSubmit={this.handleSubmit}>Submit</Button>
                    </Row>
                </Form>
            </div>
        );
    }
}

export default MakeOffer