import React, {Component} from 'react';
import './styles/App.css';
import PixelMapView from './components/PixelMapView';


export default class App extends Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {

        const {data} = this.props;

        return (
            <div className="App">
                <PixelMapView
                    data={data}
                />
            </div>
        );
    }
}
