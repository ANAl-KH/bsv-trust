/*
import React, { Component } from 'react';
import TrustTime from './TrustTime';
import moment from 'moment';
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
        const privateKey = bsv.PrivateKey.fromWIF(wif);
        const scriptPubKey = toScriptPubKey(toAddress(wif));
        const address = toAddress(wif)+'/utxo';
        console.log(address);
        const res = await fetch(`/api/${address}`);
        const utxoObj = await res.json();
        const utxoStr = JSON.stringify(utxoObj);
        this.setState({utxoInfo:utxoStr});
        console.log(utxoStr);
        console.log(utxoObj);
        if (utxoObj.code === 200 && utxoObj.success === true && utxoObj.data!==[]){
            var utxoData = utxoObj.data;
            var totalAncestors = 0;
            if(parseInt(utxoData.reduce((totalAncestors,item) => totalAncestors + item.ancestors,0)) < parseInt(20)){
                console.log(totalAncestors);
                //重构，全部重构
                //按照bsv库的要求对utxo进行改造，将value改名为satoshis，加一个属性scriptPubKey
                //todo:计算一下总额够不够所有的手续费,总额太小的也不能支持,如果有300个100聪的，也不行。扣完手续费只剩dust的也不行
                //parseInt(utxoData.reduce((totalSatoshis,item) => totalSatoshis + item.value,0))
                utxoData.forEach(element => {
                    element['satoshis']=element['value'];
                    element['scriptPubKey']=scriptPubKey;
                });
                console.log(utxoData);
            }else{console.log('未确认utxo链式调用超过25层，请稍后再创建信托')}
        }else{console.log('获取utxo失败');}
        console.log(utxoData.length);
        console.log(parseInt(utxoData.reduce((totalSatoshis,item) => totalSatoshis + item.value,0)))
        console.log(moment().unix());
        var currentUnix = moment().unix();
        var targetUnix = 1600849647;
        //如果一年内，手续费是40万sat，超过一年，手续费是90万sat
        var reduceTx = bsv.Transaction().from(utxoData).to('1D7nNuyHjsYtG1Pbk3stvcs6inqWUvCsZy',239825).sign(privateKey);
        console.log(reduceTx);
        console.log(reduceTx.outputs);
        var rawReduceTx = reduceTx.toBuffer().toString('hex');
        console.log(rawReduceTx);
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
*/