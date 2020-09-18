import React from 'react';
import {DatePicker} from 'antd';
import moment from 'moment';
//bsv库，主要用到的库，用来构建交易
const bsv = require('bsv');

class TrustTime1 extends React.Component{
    constructor(props){
        super(props);
        this.state = {time:'',targetAddress:'',err:''};
        this.handleTimeonChange = this.handleTimeonChange.bind(this);
        this.handleTimeonOk = this.handleTimeonOk.bind(this);
        this.disableDate = this.disableDate.bind(this);
        this.handleAddronChange = this.handleAddronChange.bind(this);
        this.handleSetClick = this.handleSetClick.bind(this);
    }

    handleTimeonChange(value,dateString){}

    handleTimeonOk(value){
        //获取用户设定的信托到期时间，转换成unix时间戳的格式
        let unixTime = moment(value._d).unix();
        this.setState({time:unixTime});
        //console.log(this.state.time);
    }

    disableDate(current){
        //信托的到期时间只能是未来，因此禁止时间选择框选择今天之前的日期
        return current < moment().startOf('day');
    }

    handleAddronChange(e){
        //获取用户输入的信托目标地址
        this.setState({targetAddress: e.target.value});
    }

    async handleSetClick(){
        //开始创建信托，检查用户是否已设定日期和目标地址
        if(this.state.time !== '' && this.state.targetAddress !== ''){
            try{
                var correctTargetAddress = bsv.Address.fromString(this.state.targetAddress)
                var trustAddress = bsv.Address.fromPrivateKey(this.props.privateKey)
                console.log(this.props.utxo.length)
                console.log(this.props.totalBsvSat)
                console.log(74*this.props.utxo.length)
                //用户总余额减去所有手续费。手续费随用户地址里的UTXO数量变化。
                var reduceSat = this.props.totalBsvSat - 400300 - 74*this.props.utxo.length;
                console.log(reduceSat);
                try{
                    //创建第一笔交易，因为第二笔交易的SigHash Single只能对单个UTXO使用，所以需要将用户所有的UTXO集中起来。
                    //第一个输出是给我们的手续费，第二个输出是用来构建第三笔交易的，第三个输出就是给第二笔交易用的单个UTXO
                    var reduceTx = bsv.Transaction().from(this.props.utxo).to('1KXZ29ssLh83hZcuzHAADXso37tUYt3Saw',400000).to(trustAddress,230).to(trustAddress,reduceSat).sign(this.props.privateKey);
                    var rawReduceTx = reduceTx.toBuffer().toString('hex');
                    console.log(rawReduceTx);
                    //构建第二笔交易需要第一笔交易产生的第三个UTXO，没找到bsv库里有相关方法，只能手动构建UTXO
                    var reduceTxid = bsv.crypto.Hash.sha256sha256(reduceTx.toBuffer()).reverse().toString('hex');
                    var trustUtxo = {
                        'address':trustAddress,
                        'txId':reduceTxid,
                        'outputIndex':2,
                        'scriptPubKey':this.props.scriptPubKey,
                        'satoshis':reduceSat
                    };
                    console.log(trustUtxo);
                    //使用第一笔交易的第三个输出构建第二笔交易，也就是信托交易，设定了nLockTime,使用了SigHash Single
                    var trustTx = bsv.Transaction().from(trustUtxo).to(correctTargetAddress,reduceSat-900130).to(correctTargetAddress,900000).lockUntilDate(this.state.time).sign(this.props.privateKey,3);
                    var rawTrustTx = trustTx.toBuffer().toString('hex');
                    console.log(rawTrustTx);
                    //构建第三笔交易需要第一笔交易产生的第二个UTXO，手动构建
                    var carrierUtxo = {
                        'address':trustAddress,
                        'txId':reduceTxid,
                        'outputIndex':1,
                        'scriptPubKey':this.props.scriptPubKey,
                        'satoshis':230
                    };
                    //构建第三笔交易，opreturn中放上标记字符串和第二笔交易的原始数据
                    var trustSign = 'BSVTRUSTLONGDELAY';
                    var carrierTx = bsv.Transaction().from(carrierUtxo).addSafeData(trustSign+rawTrustTx).sign(this.props.privateKey);
                    var rawCarrierTx = carrierTx.toBuffer().toString('hex');
                    console.log(rawCarrierTx);
                    //把第一笔交易和第三笔交易的原始数据通过https://metasv.com/#bc60c7b38b post出去，post成功后信托就创建成功了
                    try{
                        var postReduceRes = await fetch('https://api.metasv.com/v1/merchants/tx/broadcast',{
                            method:'post',
                            headers:{
                                'Content-Type':'application/json'
                            },
                            body:JSON.stringify({
                                rawHex:rawReduceTx,
                            })
                        });
                        console.loge(postReduceRes.json());
                        var postCarrierRes = await fetch('https://api.metasv.com/v1/merchants/tx/broadcast',{
                            method:'post',
                            headers:{
                                'Content-Type':'application/json'
                            },
                            body:JSON.stringify({
                                rawHex:rawCarrierTx,
                            })
                        });
                        console.log(postCarrierRes.json());
                    }catch(e){this.setState({err:'网络连接错误，创建信托失败'})}
                }catch(e){this.setState({err:'创建信托失败,请联系管理员微信：15317066025'})}
            }catch(e){this.setState({err:'地址格式错误，请输入正确的BSV地址'})}
        }else{this.setState({err:'请设定信托到期时间与信托到期后接收信托资金的地址'})}
    }
    render(){
        const address = this.state.targetAddress;
        console.log(this.props.utxo);
        console.log(this.props.privateKey);
        return(
            <div>
                <div>请设定信托到期时间：</div>
                <DatePicker disabledDate={this.disableDate} showTime onChange={this.handleTimeonChange} onOk={this.handleTimeonOk} />
                <div>请设定信托到期后接收信托资金的地址：</div>
                <input value = {address} onChange={this.handleAddronChange} />
                <button onClick={this.handleSetClick}>创建信托</button>
                <div>{this.state.err}</div>
                <div>创建成功！</div>
            </div>
        );
    }
}
export default TrustTime1;