import React, {Component} from 'react';
import {Row, Col, Divider, Empty, Card, Tree} from 'antd';

const {TreeNode} = Tree;

export default class VarTreeList extends Component {

    constructor(props) {
        super(props);

    }

    update(){
        this.props.handleNodeChecked()
    }

    render() {
        const {vars} = this.props;
        // console.log(vars);

        return (
            <Tree
                checkable
                defaultCheckedKeys={['output']}
                defaultExpandedKeys={['output']}
                onCheck={this.props.handleNodeChecked}
            >
                <TreeNode title="Input" key="input">
                    {Object.keys(vars.input).map(key => {
                        return (<TreeNode
                            title={key}
                            key={key}
                        />);
                    })}
                </TreeNode>
                <TreeNode title="Output" key="output">
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