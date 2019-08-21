import React, {Component} from 'react';
import {Row, Col, Tree} from 'antd';
const {TreeNode} = Tree;

class CreatedScenarios extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let scenarios = this.props.scenarios
        
        return (
            <Row
                gutter={16}
                style={{minHeight: 350}}
            >
                <Col span={12}>
                    Created scenarios
                <Tree
                checkable
                defaultCheckedKeys={['Scenarios']}
                defaultExpandedKeys={['Scenarios']}
                onCheck={this.props.handleNodeChecked.bind(this)}
                disabled={false}
            >
                <TreeNode title="Select All" key="Scenarios">
                    {scenarios.map(v => {
                        return (<TreeNode
                            title={v.name}
                            key={v.name}
                        />);
                    })}
                </TreeNode>
            </Tree>
                </Col>

            </Row>
        );
    }
}

export default CreatedScenarios