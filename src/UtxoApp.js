import React from 'react';
import UtxoInput1 from './UtxoInput1';

class UtxoApp extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div>
                <UtxoInput1/>
            </div>
        );
    }
}

export default UtxoApp;