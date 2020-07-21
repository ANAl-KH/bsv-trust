import React, { Component } from 'react';
import TrustTime from './TrustTime';
const bsv = require('bsv');

function toAddress(wif){
    let privateKey = bsv.PrivateKey.fromWIF(wif);
    let address = bsv.Address.fromPrivateKey(privateKey);
    return address.toString();
}
//从地址倒推出scriptPubKey
function toScriptPubKey(address){
    let pubKeyHash = bsv.encoding.Base58Check.decode(address).slice(1);
    let scriptPubKey = `76a914${pubKeyHash.toString('hex')}88ac`;
    let test1 = scriptPubKey.toString('hex');
    console.log(test1);
    console.log(scriptPubKey);
    return scriptPubKey;
}

//async function (props){
//    const res = await fetch(`/api/${address}`);
//    const test1 = await
//}
class UtxoList extends Component {
    state = {};

    async componentDidMount() {
        const wif = this.props.wif;
        const scriptPubKey = toScriptPubKey(toAddress(wif));
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
            var totalAncestors = 0;
            if(parseInt(utxoData.reduce((totalAncestors,item) => totalAncestors + item.ancestors,0)) < parseInt(20)){
                console.log(totalAncestors);
                //按照bsv库的要求对utxo进行改造，将value改名为satoshis，加一个属性scriptPubKey
                //a
            }else{console.log('未确认utxo链式调用超过25层，请稍后再创建信托')}
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