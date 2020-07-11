import React from 'react';
import {DatePicker} from 'antd';
import moment from 'moment';
import TargetAddress from './TargetAddress';
import SignTransaction from './SignTransaction';
class TrustTime extends React.Component{
    constructor(props){
        super(props);
        this.state = {time:'',address:''};
//        this.handleonChange = this.handleonChange.bind(this);
        this.handleonOk = this.handleonOk.bind(this);
        this.disableDate = this.disableDate.bind(this);
        this.handleAddressChange = this.handleAddressChange.bind(this);
    }
//    handleonChange(value,dateString){
//        console.log(value);
//        console.log(dateString);
//    }
    handleonOk(value){
        this.setState({time:value});
        console.log(this.state.time);
    }
    handleAddressChange(ads){
        this.setState({address:ads});
    }
    disableDate(current){
        return current < moment().startOf('day');
    }
    render(){
        return(
            <div>
                <DatePicker 
                disabledDate={this.disableDate} 
                 showTime  onOk={this.handleonOk} />
                <TargetAddress 
                address={this.state.address}
                onAddressChange={this.handleAddressChange}
             />
             <SignTransaction 
             address={this.state.address}
             utxo={this.props.utxo}
             locktime={this.state.time}
             wif={this.props.wif}
             />
            </div>
        );
    }
}
export default TrustTime;