
import {PDFComponent} from './../../lib/printPdf'; 

export default class PDFCustomHeader extends PDFComponent {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return '';
    }

    getDefinition() {
        const {
            title,
            employeeId,
            storeId
        } = this.props;
        const queriesTexts = this.props.queries.map(query => {
            return {
                text: [{text: `${query.name}: `, bold:true}, `${query.value}`],
                alignment: 'center',
                fontSize: 8,
                margin: [20, 5, 0, 0]
            }
        });
        return {
            header: function (currentPage, count, pageSize) {
                return {
                    stack:[
                        {
                            columns: [{
                                text: '',
                                width: '*'
                            },
                            {
                                stack: [{
                                        image: "data:image/png;base64,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",
                                        width: 60,
                                        height: 11.2,
                                        margin: [10, 20, 0, 0],
                                        alignment: 'center',
                                    },
                                    {
                                        text: title,
                                        fontSize: 12,
                                        alignment: 'center',
                                        margin: [10, 10, 0, 0],
                                    },
                                ], 
                            },
                            {
                                stack: [{
                                        text: `Page ${currentPage}/${count}`,
                                        alignment: 'right',
                                        margin: [0, 10, 10, 0],
                                        fontSize: 8
                                    },
                                    {
                                        text: `Emp #: ${employeeId}`,
                                        alignment: 'right',
                                        margin: [0, 5, 10, 0],
                                        fontSize: 8
                                    },
                                    {
                                        text: `Store #: ${storeId}`,
                                        alignment: 'right',
                                        margin: [0, 5, 10, 0],
                                        fontSize: 8
                                    }
                                ]
                            }
                        ]}, 
                        {
                            columns: queriesTexts
                        }
                    ]
                
                }

            }
        };
    }
}