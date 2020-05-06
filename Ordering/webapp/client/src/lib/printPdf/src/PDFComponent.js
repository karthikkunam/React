import * as React from 'react';
import _ from 'lodash';

export class PDFComponent extends React.Component {
    constructor(props) {
        super(props);
        this.childRefs = {};
        if (this.buildDefinition) {
            this.buildDefinition(props);
        } else {
            this.definition = {}
        }
    }
    render() {
        if (this.props.children) {
            const children = React.Children.map(this.props.children, (child, i) => {
                if (child) {
                    if (typeof (child) === 'string' || typeof (child) === 'number' || child instanceof Date) {
                        this.text = child;
                        return '';
                    } else {
                        const ref = React.createRef();
                        this.childRefs[`child${i}`] = ref;
                        return React.cloneElement(child, {
                            ref: this.childRefs[`child${i}`]
                        });
                    }
                }

            });
            return children;
        } else {
            return null;
        }
    }

    getProp(propName) {
        if (this.props) {
            return this.props[propName];
        }
    }

    getDefinition() {
        // should this component be an array or just an object?
        let childrenDefinition = this.isArray ? [] : {};

        // if there is any children 
        if (this.childRefs.hasOwnProperty('child0')) {
            // for each children?
            for (let child in this.childRefs) {
                //get the definition. 
                if (this.childRefs[child].current) {
                    const currentChildDefinition = this.childRefs[child].current.getDefinition();
                    let colSpan = this.childRefs[child].current.getProp('colSpan');

                    if (this.isArray) {
                        // if we expected the children to be an array to push
                        childrenDefinition.push(currentChildDefinition);
                        if (colSpan) {
                            colSpan = Number.parseInt(colSpan);
                            if (!Number.isNaN(colSpan)) // if not nan
                            {
                                for (let i = 0; i < colSpan - 1; i++) {
                                    childrenDefinition.push({
                                        text: ''
                                    })
                                }
                            }
                        }
                    } else {
                        //otherwise we merge it.
                        const colSpanList = [];
                        if (colSpan) {
                            colSpan = Number.parseInt(colSpan);
                            if (!Number.isNaN(colSpan)) // if not nan
                            {
                                for (let i = 0; i < colSpan; i++) {
                                    colSpanList.push({
                                        text: ''
                                    })
                                }
                            }
                        }
                        childrenDefinition = {
                            ...childrenDefinition,
                            ...currentChildDefinition,
                            ...colSpanList
                        };
                    }
                }

            }
        }

        if (this.contentField) {
            _.set(this.definition, this.contentField, childrenDefinition);
            return this.definition
        } else {
            if (this.isArray) {
                return childrenDefinition
            } else {
                return {
                    ...this.definition,
                    ...childrenDefinition
                };
            }
        }

    }
}