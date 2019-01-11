import Web3 from 'web3';
import Flowerjson from '../contracts/FlowerMarketPlace.json'

const web3 = new Web3(Web3.givenProvider);
web3.defaultAccount = '0x1650a9b32B45D360E146F0Ca5FF5f4A38fAae223'; //This should be updated to be dynamic in the future

var FlowerContract = new web3.eth.Contract(Flowerjson.abi);
FlowerContract.options.address = '0x14c369B997C8D8D6e46E8Cb43217119211C9C339';
FlowerContract.defaultAccount = web3.defaultAccount;

export default FlowerContract