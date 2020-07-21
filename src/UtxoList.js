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
        const utxoObj = await res.json();
        const utxoStr = JSON.stringify(utxoObj);
        this.setState({utxoInfo:utxoStr});
        console.log(utxoStr);
        console.log(utxoObj);
        if (utxoObj.code === 200 && utxoObj.success === true){
            var utxoData = utxoObj.data;
            for(var i in utxoData){
                console.log(utxoData[i].ancestors);
            }
        }else{console.log('获取utxo失败');}
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