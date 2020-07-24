import React from 'react';
import moment from 'moment';
const bsv = require('bsv');

function toAddress(wif){
    let privateKey = bsv.PrivateKey.fromWIF(wif);
    let address = bsv.Address.fromPrivateKey(privateKey);
    return address.toString();
}
function toScriptPubKey(address){
    let pubKeyHash = bsv.encoding.Base58Check.decode(address).slice(1);
    let scriptPubKey = `76a914${pubKeyHash.toString('hex')}88ac`;
    console.log(scriptPubKey);
    return scriptPubKey;
}

class UtxoInput1 extends React.Component{
    constructor(props){
        super(props);
        this.state = {wif:'',err:''};
        this.handleWifChange = this.handleWifChange.bind(this);
        this.handleWifClick = this.handleWifClick.bind(this);
    }

    handleWifChange(e){
        this.setState({wif: e.target.value});
    }

    async handleWifClick (){
        var wif = this.state.wif;
        try{
            var privateKey = bsv.PrivateKey.fromWIF(wif);
            var scriptPubKey = toScriptPubKey(toAddress(wif));
            var address = toAddress(wif)+'/utxo';
            try{
                var res = await fetch(`/api/${address}`);
                var utxoObj = await res.json();
                if (utxoObj.code === 200 && utxoObj.success === true){
                    if(utxoObj.data!==[]){
                        var utxoData = utxoObj.data;
                        var totalBsvSat = parseInt(utxoData.reduce((totalSatoshis,item) => totalSatoshis + item.value,0));
                        var totalBsv = totalBsvSat/100000000;
                        if(totalBsvSat > parseInt(133/*0000*/)){
                            if(parseInt(utxoData.reduce((totalAncestors,item) => totalAncestors + item.ancestors,0)) < parseInt(20)){
                                utxoData.forEach(element => {
                                    element['satoshis']=element['value'];
                                    element['scriptPubKey']=scriptPubKey;
                                    this.setState({err:`成功导入私钥，余额为${totalBsv}`});
                                });
                            }else{this.setState({err:'未确认utxo链式调用超过25层，请稍后再创建信托'})}
                        }else{this.setState({err:'该地址余额不足，最少需要0.0133BSV'})}
                    }else{this.setState({err:'该地址可用余额为零'})}
                }else{this.setState({err:'metasv.com服务器连接出错，无法查询余额'})}
            }catch(e){this.setState({err:'您的网络连接不正常，无法查询该地址余额'})}
        }catch(e){this.setState({err: '输入的私钥格式错误，请输入正确的wif格式私钥'})}
    }

    render(){
        const wif = this.state.wif;
        const err = this.state.err;
        return(
            <div>
                <div>在创建信托时请不要对该地址内的BSV进行操作，以免信托创建失败</div>
                <div>目前最多支持使用300个utxo创建信托</div>
                <div>请输入WIF格式的私钥:需要验证用户输入的私钥和地址是否合法</div>
                <input value={wif} onChange={this.handleWifChange} />
                <button onClick={this.handleWifClick}>确认</button>
                <div>{err}</div>
            </div>
        )
    }
}

export default UtxoInput1;