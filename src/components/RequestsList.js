import React from 'react';
import FlowerContract from "./FlowerContract"
import {Button, InputGroup, InputGroupAddon, Input ,ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

const flowernum = {0:"rose", 1:"tulip" ,2:"jasmine", 3:"white"};

async function getOpenRequests(){
    let ids = await FlowerContract.methods.getOpenRequestIdentifiers().call();
    let list = [];
    ids = ids[1];
    /*Add open Requests to list*/
    for(let i in ids){
        let offerIdentifiers = [];

        var request = await FlowerContract.methods.getRequest(ids[i]).call();
        offerIdentifiers = await FlowerContract.methods.getRequestOfferIDs(ids[i]).call();
        let allOffers = [];
        for(let i in offerIdentifiers[1]){
            allOffers[i] = await FlowerContract.methods.getOfferExtra(offerIdentifiers[1][i]).call();
        }
        list[i] = await FlowerContract.methods.getRequestExtra(ids[i]).call();
        list[i].number = ids[i];
        list[i].flowerName = flowernum[list[i]['flowerType']];
        list[i].deadline = request['deadline'];
        list[i].dateTime = new Date(list[i].deadline * 1000).toLocaleString();
        list[i].index = i;
        list[i].offers = allOffers;
    }
    return list
}

async function makeOffer(requestID, amount){
    let request = await FlowerContract.methods.getRequest(requestID).call();
    let offer = await FlowerContract.methods.submitOffer(requestID).send({to: FlowerContract.options.address,from: FlowerContract.defaultAccount, gas :1000000});
    let offerExtra = await FlowerContract.methods.submitOfferExtra(offer.events.OfferAdded.returnValues[0], amount).send({to: FlowerContract.options.address,from: FlowerContract.defaultAccount, gas :1000000});
    console.log(request, offer, offerExtra);
    window.location.reload();

}

async function decideRequest(request){
    let decided = await FlowerContract.methods.decideRequest(request.number, request.offers.map(x => request.offers.indexOf(x))).send({to: FlowerContract.options.address,from: FlowerContract.defaultAccount, gas :1000000});;
    console.log(decided);
    window.location.reload();
}

class RequestsList extends React.Component {

    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleOfferSubmit = this.handleOfferSubmit.bind(this);
        this.acceptOfferSubmit = this.acceptOfferSubmit.bind(this);
        this.state = {
            list: [],
            dropdownOpen: false,
        };
    }

    handleOfferSubmit(event){
        event.preventDefault();
        const target = event.target;
        makeOffer(target.id,target.amount.value);
    }

    toggle() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

    acceptOfferSubmit(request){
        decideRequest(request);
    }

    componentDidMount(){
        getOpenRequests().then(list => {
            this.setState({list})
        });
    }

    requestlist() {
        return this.state.list.map(function (request) {
            return <tr key={request['index']}>
                <th>{request['number']}</th>
                <td>{request['status']}</td>
                <td>{request['flowerName']}</td>
                <td>{request['quantity']}</td>
                <td>{request['dateTime']}</td>
                <td>
                    <ButtonDropdown isOpen={this.state[request['index']]} toggle={() => {
                        this.setState({[request['index']]: !this.state[request['index']]});
                    } }>
                        <DropdownToggle caret color="danger">
                            Offer
                        </DropdownToggle>
                        <DropdownMenu right style={{'minWidth': 17 + 'rem'}}>

                            <DropdownItem header>Current Offers</DropdownItem>
                            {request['offers'].map(function (offer, index) {
                                return <div key={index} style={{'display':'flex','padding': .50 + 'rem '+.50 + 'rem '+.50 + 'rem '+.0 +'rem'}}>
                                        <DropdownItem disabled >{[offer['price']]}</DropdownItem>
                                        </div>
                                }, this)}
                            <div style={{'display':'flex','justifyContent': 'center'}}>
                                <Button id={[request['index']] + ' decide'} style={{'width':'90%'}} color="success" onClick={() => this.acceptOfferSubmit(request)} type="submit" >Decide Request</Button>
                            </div>
                            <DropdownItem divider/>

                            <DropdownItem header>Make Offer:</DropdownItem>

                            <form id={request['number']} onSubmit={this.handleOfferSubmit}>
                                <InputGroup style={{'padding': .50 + 'rem'}}>
                                    <Input placeholder="Amount" type="number" min="0" id="amount" required/>
                                    <InputGroupAddon addonType="append">
                                        <Button color="success" type="submit">Submit</Button>
                                    </InputGroupAddon>
                                </InputGroup>
                            </form>

                        </DropdownMenu>
                    </ButtonDropdown>
                </td>
            </tr>

        }, this);
    }

    render() {
        return (
        <div className="jumbotron">
                <table className="table table-light table-hover">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">RequestID</th>
                            <th scope="col">Status</th>
                            <th scope="col">Flowertype</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Time</th>
                            <th scope="col">Offer</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.requestlist()}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default RequestsList