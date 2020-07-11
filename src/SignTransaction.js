import React from 'react';
const bsv = require('bsv');

function scriptPubKeyCalculator (address){
    let decodeAddress = bsv.encoding.Base58Check.decode(address);
    let sptPubKey = decodeAddress.slice(1);
    let middlesptPubKey = sptPubKey.toString('hex');
    let scriptPubKey = `OP_DUP OP_HASH160 ${middlesptPubKey} OP_EQUALVERIFY OP_CHECKSIG`;
    return scriptPubKey;
}
class SignTransaction extends React.Component{
    constructor(props){
        super(props);
//        this.state = {utxo:this.props.utxo};
    }
    render (){
        let test3 = scriptPubKeyCalculator('1D7nNuyHjsYtG1Pbk3stvcs6inqWUvCsZy');
        console.log(test3);
//        let utxoData = this.state.utxo.data;
//        console.log(utxoData);
        return(
        <div></div>
        );
    }
}
export default SignTransaction;