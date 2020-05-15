import React, {Component} from 'react';
import {Row, Col, Divider, Empty, Card, Tree} from 'antd';

const {TreeNode} = Tree;

export default class VarTreeList extends Component {

    constructor(props) {
        super(props);

    }

    // update(){
    //     this.props.handleNodeChecked()
    // }

    render() {
        const {vars} = this.props;
        console.log(vars);

        return (
            <Tree
                checkable
                defaultCheckedKeys={['']}
                // defaultExpandedKeys={['weap-flows']}
                onCheck={this.props.handleNodeChecked}
            >
                <TreeNode title="Water_Flows" key="weap-flows">
                    {vars.output.map(v => {
                        return (<TreeNode
                            title={v.name}
                            key={v.name}
                        />);
                    })}
                </TreeNode>
            </Tree>
        );
    }
}