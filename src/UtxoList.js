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
        const utxo = await res.json();
//        utxo.xxxx = ''//加上bsv需要的，metasv缺的那个参数
//        const test2 = JSON.stringify(test1);
        this.setState({utxoInfo:utxo});
        console.log(this.state.utxoInfo);
        console.log(utxo.data);
    }
    render (){
        return (
            <div>
            <TrustTime utxo={this.state.utxoInfo}
            wif={this.props.wif}
            />
            </div>
        )
    }
}
export default UtxoList;