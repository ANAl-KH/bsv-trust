import React from 'react';

class TargetAddress extends React.Component{
    constructor(props){
        super(props);
        this.handleAddressChange = this.handleAddressChange.bind(this);
    }
    handleAddressChange(e){
        this.props.onAddressChange(e.target.value);
    }
    render(){
        const address = this.props.address;
        return(
            <div>
                <div>请输入信托资金的接收地址</div>
                <input value={address} onChange={this.handleAddressChange} />
            </div>
        );
    }
}

export default TargetAddress;