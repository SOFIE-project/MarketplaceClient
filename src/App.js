import React, { Component } from 'react';
import Web3 from 'web3';
import RequestList from './components/RequestsList';
import MakeOffer from './components/MakeRequest';
import './App.css';

import './components/RequestsList'

const web3 = new Web3(Web3.givenProvider);

let isMetaMaskEnabled = () => window.web3;

function providerName(){
  if(!isMetaMaskEnabled()){
    return <p style={{color:'red'}}> No Metamask </p>
  }
  return <p style={{color:'green'}}> Metamask installed </p>
}

/*Gets current account and displays it in the header*/
async function getAccount() {
    let account = "No account";
    if (web3.currentProvider) {
        account = await web3.eth.getAccounts();
    }
    return account
}


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
    };
  }
  componentWillMount() {
      getAccount().then(accounts => {
          this.setState({account: accounts})
      });
  }
  render() {
    return (
        <div className="App">
        <header className="App-header" style={{'height':'150px'}}>
          <h1 className="App-title">Flower Marketplace</h1>
          {providerName()} <p>Account: {this.state.account}</p>
        </header>
      <div>
          <MakeOffer/>
          <RequestList/>
      </div>
      </div>
    );
  }
}

export default App;
