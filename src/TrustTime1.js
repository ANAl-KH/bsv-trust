import React from 'react';
import {DatePicker} from 'antd';
import moment from 'moment';
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
        let unixTime = moment(value._d).unix();
        this.setState({time:unixTime});
        console.log(this.state.time);
    }

    disableDate(current){
        return current < moment().startOf('day');
    }

    handleAddronChange(e){
        this.setState({targetAddress: e.target.value});
    }

    async handleSetClick(){
        if(this.state.time !== '' && this.state.targetAddress !== ''){
            try{
                var correctTargetAddress = bsv.Address.fromString(this.state.targetAddress)
                var trustAddress = bsv.Address.fromPrivateKey(this.props.privateKey)
                console.log(this.props.utxo.length)
                console.log(this.props.totalBsvSat)
                console.log(74*this.props.utxo.length)
                var reduceSat = this.props.totalBsvSat - 400300 - 74*this.props.utxo.length;
                console.log(reduceSat);
                try{
                    var reduceTx = bsv.Transaction().from(this.props.utxo).to('1KXZ29ssLh83hZcuzHAADXso37tUYt3Saw',400000).to(trustAddress,230).to(trustAddress,reduceSat).sign(this.props.privateKey);
                    var rawReduceTx = reduceTx.toBuffer().toString('hex');
                    console.log(rawReduceTx);
                    var reduceTxid = bsv.crypto.Hash.sha256sha256(reduceTx.toBuffer()).reverse().toString('hex');
                    var trustUtxo = {
                        'address':trustAddress,
                        'txId':reduceTxid,
                        'outputIndex':2,
                        'scriptPubKey':this.props.scriptPubKey,
                        'satoshis':reduceSat
                    };
                    console.log(trustUtxo);
                    var trustTx = bsv.Transaction().from(trustUtxo).to(correctTargetAddress,reduceSat-900130).to(correctTargetAddress,900000).lockUntilDate(this.state.time).sign(this.props.privateKey,3);
                    var rawTrustTx = trustTx.toBuffer().toString('hex');
                    console.log(rawTrustTx);
                    var carrierUtxo = {
                        'address':trustAddress,
                        'txId':reduceTxid,
                        'outputIndex':1,
                        'scriptPubKey':this.props.scriptPubKey,
                        'satoshis':230
                    };
                    //var trustSignBuf = Buffer.from('BSVTRUSTLONGDELAY');
                    //var trustSignHex = trustSignBuf.toString('hex');
                    var trustSign = 'BSVTRUSTLONGDELAY';
                    var carrierTx = bsv.Transaction().from(carrierUtxo).addSafeData(trustSign+rawTrustTx).sign(this.props.privateKey);
                    var rawCarrierTx = carrierTx.toBuffer().toString('hex');
                    console.log(rawCarrierTx);
                    /*
                    try{
                        var postReduceRes = await fetch('/postapi/',{
                            method:'post',
                            headers:{
                                'Content-Type':'application/json'
                            },
                            body:JSON.stringify({
                                rawHex:rawReduceTx,
                            })
                        });
                        console.loge(postReduceRes.json());
                        var postCarrierRes = await fetch('/postapi/',{
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
                    */
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
            </div>
        );
    }
}
export default TrustTime1;