import React, { Component } from 'react';
import TrustTime from './TrustTime';
const bsv = require('bsv');

function toAddress(wif){
    let privateKey = bsv.PrivateKey.fromWIF(wif);
    let address = bsv.Address.fromPrivateKey(privateKey);
    return address.toString();
}
//async function (props){
//    const res = await fetch(`/api/${address}`);
//    const test1 = await
//}
class UtxoList extends Component {
    state = {};

    async componentDidMount() {
        const wif = this.props.wif;
        const address = toAddress(wif)+'/utxo';
        console.log(address);
        const res = await fetch(`/api/${address}`);
        const test1 = await res.json();
        const test2 = JSON.stringify(test1);
        this.setState({utxoInfo:test2});
        console.log(test2);
    }
    render (){
        return (
            <div>
                {this.state.utxoInfo}
            <TrustTime/>
            </div>
        )
    }
}
export default UtxoList;