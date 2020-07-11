import React from 'react';
const bsv = require('bsv');

function scriptPubKeyCalculator (address){
    let decodeAddress = bsv.encoding.Base58Check.decode(address);
    let scriptPubKey = decodeAddress.slice(1);
    let strscriptPubKey = scriptPubKey.toString('hex');
    return strscriptPubKey;
//    let wif = 'Kyvu96nXzQmPT39G71AS9e8h8qia2dofp9wchSYwt6hUULzjBBdp';
//    let privateKey = bsv.PrivateKey.fromWIF(wif);
//    let publicKey = bsv.PublicKey.fromPrivateKey(privateKey);
//    let pbID = 
//    console.log('zaizheli');
//    console.log(publicKey);
//    console.log('zaizheli');
//    return true;
//    let bufpublicKey = bsv.encoding.BufferWriter.prototype.toBuffer(publicKey);
//    let scriptSha256PubKey = bsv.crypto.Hash.sha256(bufpublicKey);
//    let scriptPubKey = bsv.crypto.Hash.ripemd160(bsv.crypto.Hash.sha256(publicKey));
//    return scriptSha256PubKey;
}

class SignTransaction extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }
    render (){
        let test3 = scriptPubKeyCalculator('1D7nNuyHjsYtG1Pbk3stvcs6inqWUvCsZy');
        console.log(test3);
        return(
        <div></div>
        );
    }
}
export default SignTransaction;