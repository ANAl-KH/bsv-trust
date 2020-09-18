import React from 'react';
import TrustTime1 from './TrustTime1';
//bsv库，主要用到的库，用来构建交易
const bsv = require('bsv');

//根据私钥计算出对应的地址
//用户输入的是WIF格式私钥，Wallet Import Format，需要转换成privateKey格式才能使用
function toAddress(wif){
    let privateKey = bsv.PrivateKey.fromWIF(wif);
    let address = bsv.Address.fromPrivateKey(privateKey);
    return address.toString();
}
//根据地址计算出对应的锁定脚本
function toScriptPubKey(address){
    let pubKeyHash = bsv.encoding.Base58Check.decode(address).slice(1);
    let scriptPubKey = `76a914${pubKeyHash.toString('hex')}88ac`;
    return scriptPubKey;
}

class UtxoInput1 extends React.Component{
    constructor(props){
        super(props);
        //err用来显示导入私钥过程中可能出现的各种错误信息，success用来判断是否已经成功导入私钥
        this.state = {wif:'',err:'',success:false};
        this.handleWifChange = this.handleWifChange.bind(this);
        this.handleWifClick = this.handleWifClick.bind(this);
    }

    handleWifChange(e){
        this.setState({wif: e.target.value,success:false});
    }

    async handleWifClick (){
        var wif = this.state.wif;
        this.setState({success:false});
        try{
            //判断用户输入的wif私钥格式是否正确，有问题的话bsv库会抛出错误，这一步不是很严谨因为有的字符串也可以顺利运行，不过影响不大
            var privateKey = bsv.PrivateKey.fromWIF(wif);
            var scriptPubKey = toScriptPubKey(toAddress(wif));
            var address = toAddress(wif)+'/utxo';
            try{
                //用对应的地址从https://metasv.com/#utxo-2 查询该地址里的未花费输出UTXO
                var res = await fetch(`/getutxo/${address}`);
                var utxoObj = await res.json();
                console.log(utxoObj);
                //示例：{"code":200,"data":[{"id":4701050,"address":"12higDjoCCNXSA95xZMWUdPvXNmkAduhWv","txid":"3541514998f58a38443878d0904033f519cb26820e9d88ccb5b22a90c3f34d1b","outputIndex":0,"value":500000,"height":576239,"ancestors":0,"descendents":0},{"id":5376917,"address":"12higDjoCCNXSA95xZMWUdPvXNmkAduhWv","txid":"e798e31cecf8a73ecf66402e702d28a91f99be46c09bee73a2e04a2068f2451f","outputIndex":0,"value":9990,"height":576240,"ancestors":0,"descendents":0},{"id":10733687,"address":"12higDjoCCNXSA95xZMWUdPvXNmkAduhWv","txid":"67ea4d9c3e9560bb59f7a1bb1824cd2f1cf7910812767bb5269c88479fa9353e","outputIndex":0,"value":7000,"height":576236,"ancestors":0,"descendents":0},{"id":11399113,"address":"12higDjoCCNXSA95xZMWUdPvXNmkAduhWv","txid":"0715d5d2a78aaa362f00f9a50026c849ece22e18e24b6469e79b2ce1df970042","outputIndex":0,"value":666000,"height":576235,"ancestors":0,"descendents":0},{"id":15263250,"address":"12higDjoCCNXSA95xZMWUdPvXNmkAduhWv","txid":"28d2b9d85c4a43f45d3365071914ad6652609d87341a3f624877d016d8081d58","outputIndex":0,"value":15085,"height":576240,"ancestors":0,"descendents":0},{"id":20292332,"address":"12higDjoCCNXSA95xZMWUdPvXNmkAduhWv","txid":"166a3ab4254f7dbb0a9ea5750bdc19254fb8597b30a8c393b8a48d3f73939775","outputIndex":0,"value":666000,"height":576241,"ancestors":0,"descendents":0},{"id":26557378,"address":"12higDjoCCNXSA95xZMWUdPvXNmkAduhWv","txid":"3f7b87b1735e3e21e3e60e0b3a09b3b9350176bdb2972bb2967a28a1df60179a","outputIndex":1,"value":666,"height":576228,"ancestors":0,"descendents":0},{"id":27026103,"address":"12higDjoCCNXSA95xZMWUdPvXNmkAduhWv","txid":"d0afbd423a80eb7460e9ebb2fb095aebdb4daba6fd0110aee2e358397e62c49c","outputIndex":429,"value":1,"height":309740,"ancestors":0,"descendents":0},{"id":28058794,"address":"12higDjoCCNXSA95xZMWUdPvXNmkAduhWv","txid":"fceec75763a4925e8efa068fc2086f0231db841b5d4d47b2ec0a9df7ee87c6a2","outputIndex":0,"value":196461,"height":576237,"ancestors":0,"descendents":0},{"id":31537708,"address":"12higDjoCCNXSA95xZMWUdPvXNmkAduhWv","txid":"0a21079a06c523fed3a41f890c4e96bb148433c90bf42d3c12649846af20f5b6","outputIndex":0,"value":100000000,"height":576232,"ancestors":0,"descendents":0},{"id":32092180,"address":"12higDjoCCNXSA95xZMWUdPvXNmkAduhWv","txid":"4844d71699b05b738fe54a80cad9a570ece202f05f7540b809307319239239ba","outputIndex":0,"value":250000,"height":576235,"ancestors":0,"descendents":0},{"id":36525589,"address":"12higDjoCCNXSA95xZMWUdPvXNmkAduhWv","txid":"4a979b3cc0810492529153f6f5322e406391a730e6628c9d206129ef4dd116d4","outputIndex":0,"value":9333,"height":576232,"ancestors":0,"descendents":0},{"id":37882544,"address":"12higDjoCCNXSA95xZMWUdPvXNmkAduhWv","txid":"63d3e80a9b4a03808beb57d8e104762d3177a467f87479779f866e223da504dc","outputIndex":0,"value":15187,"height":576236,"ancestors":0,"descendents":0},{"id":38862855,"address":"12higDjoCCNXSA95xZMWUdPvXNmkAduhWv","txid":"ce15088a047265e120d59b8fdad71b12b4fd3a40fcb12fda474e5b2324c7bbe1","outputIndex":0,"value":555555,"height":576243,"ancestors":0,"descendents":0}],"success":true}
                //判断是否查询成功
                if (utxoObj.code === 200 && utxoObj.success === true){
                    //判断余额是否足够
                    if(utxoObj.data!==[]){
                        var utxoData = utxoObj.data;
                        var totalBsvSat = parseInt(utxoData.reduce((totalSatoshis,item) => totalSatoshis + item.value,0));
                        var totalBsv = totalBsvSat/100000000;
                        if(totalBsvSat > parseInt(1350000)){
                            //计算未确认链式调用层数的总和
                            if(parseInt(utxoData.reduce((totalAncestors,item) => totalAncestors + item.ancestors,0)) < parseInt(20)){
                                utxoData.forEach(element => {
                                    //根据bsv库的要求对UTXO进行改造，将value改名为satoshis，增加scriptPubKey
                                    element['satoshis']=element['value'];
                                    element['scriptPubKey']=scriptPubKey;
                                    //将所需的信息都放到state中
                                    this.setState({err:`成功导入私钥，余额为${totalBsv}BSV`,success:true,utxo:utxoData,privateKey:privateKey,totalBsvSat:totalBsvSat,scriptPubKey:scriptPubKey});
                                });
                            }else{this.setState({err:'未确认utxo链式调用超过25层，请稍后再创建信托'})}
                        }else{this.setState({err:'该地址余额不足，最少需要0.0135BSV'})}
                    }else{this.setState({err:'该地址可用余额为零'})}
                }else{this.setState({err:'metasv.com服务器连接出错，无法查询余额'})}
            }catch(e){this.setState({err:'您的网络连接不正常，无法查询该地址余额'})}
        }catch(e){this.setState({err: '输入的私钥格式错误，请输入正确的wif格式私钥'})}
    }

    render(){
        const wif = this.state.wif;
        const err = this.state.err;
        const success = this.state.success;
        //使用err向用户显示相关错误信息，每次出错都会调用setState更新错误信息
        //直到私钥导入成功才渲染信托日期和信托目标地址设定组件，将所需的信息传递到组件props中
        return(
            <div>
                <div>第一步：</div>
                <div>请输入单个地址的WIF格式的私钥:</div>
                <input value={wif} onChange={this.handleWifChange} />
                <button onClick={this.handleWifClick}>获取余额</button>
                <div>{err}</div>
                <div>第二步：</div>
                <div>
                    {success
                    ? <TrustTime1 utxo={this.state.utxo} privateKey={this.state.privateKey} totalBsvSat={this.state.totalBsvSat} scriptPubKey={this.state.scriptPubKey}/>
                    : null
                    }
                </div>
            </div>
        );
    }
}

export default UtxoInput1;