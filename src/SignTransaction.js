import React from 'react';
const bsv = require('bsv');

function scriptPubKeyCalculator (wif){
    let bufwif = bsv.toBuffer(wif);
    let privateKey = bsv.PrivateKey.fromWIF(bufwif);
    let publicKey = bsv.PublicKey.fromPrivateKey(privateKey);
    let scriptSha256PubKey = bsv.crypto.Hash.sha256(publicKey);
//    let scriptPubKey = bsv.crypto.Hash.ripemd160(bsv.crypto.Hash.sha256(publicKey));
    return scriptSha256PubKey;
}

class SignTransaction extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }
    render (){
        let test2 = 'Kyvu96nXzQmPT39G71AS9e8h8qia2dofp9wchSYwt6hUULzjBBdp';
        let test3 = scriptPubKeyCalculator(test2);
        console.log(test3);
        return(
        <div></div>
        );
    }
}
export default SignTransaction;