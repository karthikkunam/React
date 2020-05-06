import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getOrderingDetails, getOrderByVendorDetails, orderingContinueButton } from '../../../actions';
import SpinnerComponent from '../../shared/SpinnerComponent';
import pending from '../../../assets/images/pending.png';
import complete from '../../../assets/images/complete.png'
import info from '../../../assets/images/info.png'
// import './OrderingCategories.css'
import { getItemsForSelectedCategories } from '../../utility/getItemsForSelectedCategories';
import { SINGLE_DAY, MULTI_DAY, NON_DAILY, CDC, DSD} from '../../../constants/ActionTypes';

import ReactTooltip from 'react-tooltip'
import { storeDetails } from '../../../lib/storeDetails';

export class OrderingCategories extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orderingCategoryDetails: {},
            storeId: storeDetails() && storeDetails().storeId,
            isCarried: true,
            parentCollapse: false,
            isContinueEnabled: false,
            selectedOrderCycle: [SINGLE_DAY, MULTI_DAY, NON_DAILY],
            orderByVendor: false,
            orderByVendorData: false,
            orderRemainingItems: true,
            displayOrderingSpinner: true,
            displayVendorSpinner: true,
            orderingStatus: ''
        }

    }

    componentDidMount() {
        this.setState({
            isCarried: this.props.isCarried,
            selectedOrderCycle: this.props.selectedOrderCycle,
            orderByVendor: this.props.orderByVendor,
            loginData: this.props.loginData,
            orderRemainingItems: this.props.orderRemainingItems,
            displayOrderingSpinner: true,
            displayVendorSpinner: true
        });
        const { storeId } = this.state;
        const { orderByVendor } = this.props;
        /** Dispatch an action to fetch the Ordering Info(Single Day, Multi Day & Non-Daily)*/
        if(orderByVendor){
            this.props.dispatch(getOrderByVendorDetails(storeId));
        } else {
            this.props.dispatch(getOrderingDetails(storeId));
        }
    }

    componentWillReceiveProps(newProps) {
        const { orderingCategoryDetails, orderByVendorData } = this.state;

        this.setState({
            orderingCategoryDetails: newProps && newProps.orderingCategoryDetails,
            isCarried: newProps.isCarried,
            orderByVendorData: newProps && newProps.orderByVendorData,
            orderRemainingItems: newProps && newProps.orderRemainingItems,
            selectedOrderCycle: newProps && newProps.selectedOrderCycle,
            orderingStatus: newProps && newProps.orderingStatus
        }, () => {
            const { orderingStatus, orderByVendor, storeId } = this.state;
            if( orderByVendor !== newProps.orderByVendor){
                this.setState({ orderByVendor: newProps.orderByVendor, parentCollapse: false },()=>{
                    if(newProps.orderByVendor){
                        this.props.dispatch(getOrderByVendorDetails(storeId));
                        this.setState({ displayVendorSpinner: true, orderByVendorData: false })
                    } else {
                        this.props.dispatch(getOrderingDetails(storeId));
                        this.setState({ displayOrderingSpinner: true , orderingCategoryDetails: false })
                    }
                    // this.resetSelections(newProps.orderByVendor); // USED TO REVERT SELECTIONS
                    // this.setContinueButton();
                })
            }else{
                this.setContinueButton();
            }
            if (newProps && newProps.selectedOrderCycle ) {
                this.updateCategorySelections(newProps.selectedOrderCycle);
            }
            if (newProps && newProps.orderingCategoryDetails && newProps.orderingCategoryDetails !== orderingCategoryDetails) {
                this.setState({ displayOrderingSpinner: false })
            }
            if (newProps && newProps.orderByVendorData && newProps.orderByVendorData !== orderByVendorData ) {
                this.setState({ displayVendorSpinner: false })
            }

            if(orderingStatus === "NETWORK_ERROR" || orderingStatus === "COMPLETE"){
                this.setState({ displayOrderingSpinner: false })
                this.setState({ displayVendorSpinner: false })
            }
        });
    }

    updateCategorySelections(orderCycles) {
        const { orderingCategoryDetails, orderByVendorData } = this.state;

        if (orderCycles && !orderCycles.includes(SINGLE_DAY)) {
            orderingCategoryDetails[SINGLE_DAY] && orderingCategoryDetails[SINGLE_DAY].category.forEach(function (category) {
                category.isSelectedByUser = false;
                category.subCategories.forEach(function (subCategory) {
                    subCategory.isSelectedByUser = false;
                })
            });
        }
        if (orderCycles && !orderCycles.includes(MULTI_DAY)) {
            orderingCategoryDetails[MULTI_DAY] && orderingCategoryDetails[MULTI_DAY].category.forEach(function (category) {
                category.isSelectedByUser = false;
                category.subCategories.forEach(function (subCategory) {
                    subCategory.isSelectedByUser = false;
                })
            });
        }
        if (orderCycles && !orderCycles.includes(NON_DAILY)) {
            orderingCategoryDetails[NON_DAILY] && orderingCategoryDetails[NON_DAILY].category.forEach(function (category) {
                category.isSelectedByUser = false;
                category.subCategories.forEach(function (subCategory) {
                    subCategory.isSelectedByUser = false;
                })
            });
            orderByVendorData[NON_DAILY] && orderByVendorData[CDC].category.forEach(function (category) {
                category.isSelectedByUser = false;
                category.subCategories.forEach(function (subCategory) {
                    subCategory.isSelectedByUser = false;
                })
            });
            orderByVendorData[NON_DAILY] && orderByVendorData[DSD].category.forEach(function (category) {
                category.isSelectedByUser = false;
            });
        }
        this.setState({
            orderingCategoryDetails: orderingCategoryDetails,
            orderByVendorData: orderByVendorData
        },()=>{
            this.setContinueButton();
        })
    }

    resetSelections(){
        let  { orderByVendor, orderingCategoryDetails, orderByVendorData } = this.state;

        orderByVendor && orderByVendorData && orderByVendorData.CDC && orderByVendorData.CDC.category.forEach(function (category) {
            category.isSelectedByUser = false;

            category.subCategories && category.subCategories.forEach(function (subCategory) {
                subCategory.isSelectedByUser = false;
            });
        });

        orderByVendor && orderByVendorData.DSD && orderByVendorData.DSD.category && orderByVendorData.DSD.category.forEach(function (category) {
            category.isSelectedByUser = false;
        });

        !orderByVendor && orderingCategoryDetails.singleDay && orderingCategoryDetails.singleDay.category && orderingCategoryDetails.singleDay.category.forEach(function (category) {
            category.isSelectedByUser = false;

            category.subCategories && category.subCategories.forEach(function (subCategory) {
                subCategory.isSelectedByUser = false;
            });
        });

        !orderByVendor && orderingCategoryDetails.multiDay && orderingCategoryDetails.multiDay.category && orderingCategoryDetails.multiDay.category.forEach(function (category) {
            category.isSelectedByUser = false;

            category.subCategories && category.subCategories.forEach(function (subCategory) {
                subCategory.isSelectedByUser = false;
            });
        });
        !orderByVendor && orderingCategoryDetails.nonDaily && orderingCategoryDetails.nonDaily.category && orderingCategoryDetails.nonDaily.category.forEach(function (category) {
            category.isSelectedByUser = false;

            category.subCategories && category.subCategories.forEach(function (subCategory) {
                subCategory.isSelectedByUser = false;
            });
        });

        this.setState({ orderingCategoryDetails : orderingCategoryDetails, orderByVendorData: orderByVendorData },()=>{
            this.setContinueButton();
        })

    }

    setContinueButton() {
        const { orderingCategoryDetails, orderByVendorData, isCarried, orderRemainingItems, orderByVendor } = this.state;
        let isContinueEnabled = false;
        let ItemDetailData = {
            [SINGLE_DAY]: {
                "psa": [],
                "cat": [],
                "ordergroupcode": [],
                "orderCycleTypeCode": "D",
                "orderCycleTypeName": "DAILY FRESH FOODS",
                "itemAggregates": 0
            },
            [MULTI_DAY]: {
                "psa": [],
                "cat": [],
                "ordergroupcode": [],
                "orderCycleTypeCode": "O",
                "orderCycleTypeName": "DAILY-OTHER",
                "itemAggregates": 0
            },
            [NON_DAILY]: {
                "psa": [],
                "cat": [],
                "ordergroupcode": [],
                "orderCycleTypeCode": "N",
                "orderCycleTypeName": "NON-DAILY,GUIDED REPLENISHMENT",
                "merchandisevendorCode": [],
                "itemAggregates": 0
            },
        }
        orderByVendor && orderByVendorData && orderByVendorData.CDC && orderByVendorData.CDC.category.forEach(function (category) {
            if (category.isSelectedByUser === true) {
                isContinueEnabled = true;
            }
            category.subCategories && category.subCategories.forEach(function (subCategory) {
                if (subCategory.isSelectedByUser === true) {
                    isContinueEnabled = true;
                    ItemDetailData.nonDaily.ordergroupcode.push(category.orderGroupCode);
                    ItemDetailData.nonDaily.psa.push(subCategory.psa);
                    ItemDetailData.nonDaily.cat.push(subCategory.cat);
                    ItemDetailData.nonDaily.itemAggregates += isCarried ? subCategory.carriedOrderCounts : subCategory.allOrderCounts;
                }
            });
        });

        orderByVendor && orderByVendorData.DSD && orderByVendorData.DSD.category && orderByVendorData.DSD.category.forEach(function (category) {
            if (category.isSelectedByUser === true) {
                isContinueEnabled = true;
                ItemDetailData.nonDaily.merchandisevendorCode.push(category.orderGroupCode);
                ItemDetailData.nonDaily.itemAggregates += isCarried ? category.carriedOrderCounts : category.allOrderCounts;
            }
        });

        !orderByVendor && orderingCategoryDetails.singleDay && orderingCategoryDetails.singleDay.category && orderingCategoryDetails.singleDay.category.forEach(function (category) {
            if (category.isSelectedByUser === true) {
                isContinueEnabled = true;
            }
            category.subCategories && category.subCategories.forEach(function (subCategory) {
                if (subCategory.isSelectedByUser === true) {
                    isContinueEnabled = true;
                    ItemDetailData.singleDay.ordergroupcode.push(category.orderGroupCode);
                    ItemDetailData.singleDay.psa.push(subCategory.psa);
                    ItemDetailData.singleDay.cat.push(subCategory.cat);
                    ItemDetailData.singleDay.itemAggregates += isCarried ? subCategory.carriedOrderCounts : subCategory.allOrderCounts;
                }
            });
        });

        !orderByVendor && orderingCategoryDetails.multiDay && orderingCategoryDetails.multiDay.category && orderingCategoryDetails.multiDay.category.forEach(function (category) {
            if (category.isSelectedByUser === true) {
                isContinueEnabled = true;
            }
            category.subCategories && category.subCategories.forEach(function (subCategory) {
                if (subCategory.isSelectedByUser === true) {
                    isContinueEnabled = true;
                    ItemDetailData.multiDay.ordergroupcode.push(category.orderGroupCode);
                    ItemDetailData.multiDay.psa.push(subCategory.psa);
                    ItemDetailData.multiDay.cat.push(subCategory.cat);
                    ItemDetailData.multiDay.itemAggregates += isCarried ? subCategory.carriedOrderCounts : subCategory.allOrderCounts;
                }
            });
        });
        !orderByVendor && orderingCategoryDetails.nonDaily && orderingCategoryDetails.nonDaily.category && orderingCategoryDetails.nonDaily.category.forEach(function (category) {
            if (category.isSelectedByUser === true) {
                isContinueEnabled = true;
            }
            category.subCategories && category.subCategories.forEach(function (subCategory) {
                if (subCategory.isSelectedByUser === true) {
                    isContinueEnabled = true;
                    ItemDetailData.nonDaily.ordergroupcode.push(category.orderGroupCode);
                    ItemDetailData.nonDaily.psa.push(subCategory.psa);
                    ItemDetailData.nonDaily.cat.push(subCategory.cat);
                    ItemDetailData.nonDaily.itemAggregates += isCarried ? subCategory.carriedOrderCounts : subCategory.allOrderCounts;
                }
            });
        });

        this.props.dispatch(orderingContinueButton({
            isContinueEnabled: isContinueEnabled,
            isCarried: isCarried,
            orderByVendor: orderByVendor,
            orderRemainingItems: orderRemainingItems,
            checkCategories: getItemsForSelectedCategories(orderingCategoryDetails, orderByVendorData, orderByVendor),
            ItemDetailData: ItemDetailData
        }));
    }

    categoryCollapse(index, orderCycleType) {
        let { orderingCategoryDetails, orderByVendorData } = this.state
        if (orderCycleType === DSD || orderCycleType === CDC) {
            if (!orderByVendorData[orderCycleType].category[index].hasOwnProperty("isExpanded")) {
                orderByVendorData[orderCycleType].category[index].isExpanded = false;
                this.setState({ orderByVendorData: orderByVendorData })
            } else {
                orderByVendorData[orderCycleType].category[index].isExpanded = !orderByVendorData[orderCycleType].category[index].isExpanded;
                this.setState({ orderByVendorData: orderByVendorData })
            }
        }
        else {
            if (!orderingCategoryDetails[orderCycleType].category[index].hasOwnProperty("isExpanded")) {
                orderingCategoryDetails[orderCycleType].category[index].isExpanded = false;
                this.setState({ orderingCategoryDetails: orderingCategoryDetails })
            } else {
                orderingCategoryDetails[orderCycleType].category[index].isExpanded = !orderingCategoryDetails[orderCycleType].category[index].isExpanded;
                this.setState({ orderingCategoryDetails: orderingCategoryDetails })
            }
        }
    }

    onChangeParentChkBox = (index, orderCycleType) => {
        let { orderingCategoryDetails } = this.state;
        if (orderCycleType === DSD || orderCycleType === CDC) {
            orderingCategoryDetails = this.state.orderByVendorData
        }
        if (!orderingCategoryDetails[orderCycleType].category[index].hasOwnProperty("isSelectedByUser")) {
            orderingCategoryDetails[orderCycleType].category[index].isSelectedByUser = true;
            if ((orderCycleType === DSD) || (orderCycleType === CDC)) {
                this.setState({ orderByVendorData: orderingCategoryDetails }, () => {
                    this.parentSelectionUpdated(index, orderingCategoryDetails, orderCycleType)
                })
            } else {
                this.setState({ orderingCategoryDetails: orderingCategoryDetails }, () => {
                    this.parentSelectionUpdated(index, orderingCategoryDetails, orderCycleType)
                })
            }

        } else {
            orderingCategoryDetails[orderCycleType].category[index].isSelectedByUser = !orderingCategoryDetails[orderCycleType].category[index].isSelectedByUser
            if ((orderCycleType === DSD) || (orderCycleType === CDC)) {
                this.setState({ orderByVendorData: orderingCategoryDetails }, () => {
                    this.parentSelectionUpdated(index, orderingCategoryDetails, orderCycleType)
                })
            } else {
                this.setState({ orderingCategoryDetails: orderingCategoryDetails }, () => {
                    this.parentSelectionUpdated(index, orderingCategoryDetails, orderCycleType)
                })
            }
        }
        setTimeout(() => {
            this.setContinueButton();
        }, 100)
    }

    parentSelectionUpdated(parentIndex, data, orderCycleType) {
        data[orderCycleType].category[parentIndex].subCategories && data[orderCycleType].category[parentIndex].subCategories.forEach(function (value) {
            value.isSelectedByUser = data[orderCycleType].category[parentIndex].isSelectedByUser
        });
        if ((orderCycleType === DSD) || (orderCycleType === CDC)) {
            this.setState({ orderByVendorData: data });

        } else {
            this.setState({ orderingCategoryDetails: data });

        }
    }

    checkAllChildsSelected(parentIndex, data, orderCycleType) {
        let count = 0;
        data[orderCycleType].category[parentIndex].subCategories.forEach(function (value) {
            if (value && value.isSelectedByUser) {
                count++;
            }
        });
        if (data[orderCycleType].category[parentIndex].subCategories.length === count) {
            data[orderCycleType].category[parentIndex].isSelectedByUser = true
        } else {
            data[orderCycleType].category[parentIndex].isSelectedByUser = false;
        }
        if ((orderCycleType === DSD) || (orderCycleType === CDC)) {
            this.setState({ orderByVendorData: data });

        } else {
            this.setState({ orderingCategoryDetails: data });

        }
    }

    onChangeChildChkBox = (index, childIndex, orderCycleType) => {
        let { orderingCategoryDetails } = this.state
        if (orderCycleType === DSD || orderCycleType === CDC) {
            orderingCategoryDetails = this.state.orderByVendorData
        }
        if (!orderingCategoryDetails[orderCycleType].category[index].subCategories[childIndex].hasOwnProperty("isSelectedByUser")) {
            orderingCategoryDetails[orderCycleType].category[index].subCategories[childIndex].isSelectedByUser = true;
            if ((orderCycleType === DSD) || (orderCycleType === CDC)) {
                this.setState({ orderByVendorData: orderingCategoryDetails }, () => {
                    this.checkAllChildsSelected(index, orderingCategoryDetails, orderCycleType);
                });
            } else {
                this.setState({ orderingCategoryDetails: orderingCategoryDetails }, () => {
                    this.checkAllChildsSelected(index, orderingCategoryDetails, orderCycleType);
                });
            }

        } else {
            orderingCategoryDetails[orderCycleType].category[index].subCategories[childIndex].isSelectedByUser = !orderingCategoryDetails[orderCycleType].category[index].subCategories[childIndex].isSelectedByUser;
            if ((orderCycleType === DSD) || (orderCycleType === CDC)) {
                this.setState({ orderByVendorData: orderingCategoryDetails }, () => {
                    this.checkAllChildsSelected(index, orderingCategoryDetails, orderCycleType);
                });
            } else {
                this.setState({ orderingCategoryDetails: orderingCategoryDetails }, () => {
                    this.checkAllChildsSelected(index, orderingCategoryDetails, orderCycleType);
                });
            }
        }
        setTimeout(() => {
            this.setContinueButton();
        }, 100)
    }

    parentCollapse() {
        const THIS = this;
        this.setState({ parentCollapse: !this.state.parentCollapse }, () => {
            THIS.state.orderingCategoryDetails && THIS.state.orderingCategoryDetails.singleDay && THIS.state.orderingCategoryDetails.singleDay.category.forEach(function (category) {
                category.isExpanded = !THIS.state.parentCollapse
            });
            THIS.state.orderingCategoryDetails && THIS.state.orderingCategoryDetails.multiDay && THIS.state.orderingCategoryDetails.multiDay.category.forEach(function (category) {
                category.isExpanded = !THIS.state.parentCollapse
            });
            THIS.state.orderingCategoryDetails && THIS.state.orderingCategoryDetails.nonDaily && THIS.state.orderingCategoryDetails.nonDaily.category.forEach(function (category) {
                category.isExpanded = !THIS.state.parentCollapse
            });
            THIS.state.orderByVendorData && THIS.state.orderByVendorData.CDC && THIS.state.orderByVendorData.CDC.category.forEach(function (category) {
                category.isExpanded = !THIS.state.parentCollapse
            });
            THIS.state.orderByVendorData && THIS.state.orderByVendorData.DSD && THIS.state.orderByVendorData.DSD.category.forEach(function (category) {
                category.isExpanded = !THIS.state.parentCollapse
            });
            THIS.setState({ 
                orderingCategoryDetails: THIS.state.orderingCategoryDetails, 
                orderByVendorData: THIS.state.orderByVendorData 
            });
        })
    }

    determineCategoryStatus(isCarried, category) {
        if (isCarried) {
            if (category.carriedOrderCounts === 0) {
                return 'complete';
            } else if (category.carriedOrderCounts === category.carriedItemCounts) {
                return '-';
            }
            else return 'pending';
        }
        else {
            if (category.allOrderCounts === 0) {
                return 'complete';
            } else if (category.allOrderCounts === category.allItemCounts) {
                return '-';
            }
            else return 'pending';
        }
    }

    determineSubcategoryStatus(isCarried, subCategory) {
        if (isCarried) {
            if (subCategory.carriedOrderCounts === 0) {
                return 'complete';
            } else if (subCategory.carriedOrderCounts === subCategory.carriedItemCounts) {
                return '-';
            }
            else return 'pending';
        }
        else {
            if (subCategory.allOrderCounts === 0) {
                return 'complete';
            } else if (subCategory.allOrderCounts === subCategory.allItemCounts) {
                return '-';
            }
            else return 'pending';
        }
    }

    convertToLowerCase(category) {
        return category ?  category.toLowerCase() :"";
    }

    render() {
        const {
            orderingCategoryDetails,
            isCarried,
            selectedOrderCycle,
            orderByVendor,
            orderByVendorData,
            displayOrderingSpinner,
            displayVendorSpinner
        } = this.state;
        const THIS = this;
        return (
            <div className="cat-table-resize">
                {!orderByVendor && displayOrderingSpinner &&
                        <div className="ordering-home-spinner" >
                            <SpinnerComponent displaySpinner={displayOrderingSpinner} />
                        </div>
                    }

                    {orderByVendor && displayVendorSpinner &&
                        <div className="ordering-home-spinner" >
                            <SpinnerComponent displaySpinner={displayVendorSpinner} />
                        </div>
                    }
                <table className="cat-table-header">
                    <thead>
                        <tr className="row text-left">
                            <th className="col-5 col-sm-5 col-md-4 cat-header-text cusGroup" scope="col"><span className="bold">{orderByVendor ? "Vendor" : "Group,"}</span>{orderByVendor ? "" : " Category"} </th>
                            <th className="left-border-mob col-3 col-sm-3 d-md-none cat-header-text text-center"># to order</th>
                            <th className="col-md-3 d-none d-md-table-cell cat-header-text cusAvail">Available to Order</th>
                            <th className="col-md-3 d-none d-md-table-cell cat-header-text cusRem">Remaining to Order</th>
                            <th className="left-border-mob right-border-mob col-2 col-sm-2 col-md-1 cat-header-text text-left side-padding cusStatus">Status
                        <img className="status-mob d-md-none" data-tip data-for="status" alt="status-info" src={info} />
                                <ReactTooltip place="left" id='status' type='light' effect="solid">
                                    <div className="status-bg">
                                        <div><img alt="arr" className="pending-status" src={pending} /><span style={{ "padding": "10px" }}>Pending</span></div>
                                        <div><img alt="arr" className="complete-status" src={complete} /><span style={{ "padding": "10px" }}>Complete</span></div>
                                    </div>
                                </ReactTooltip>
                            </th>
                            <th className="left-border left-border-none  col-2 col-sm-2 col-md-1 cat-header-text cusArrow">
                                <i onClick={() => this.parentCollapse()} className={this.state.parentCollapse === true ? 'fa fa-angle-down cat-arrow-landing' : 'fa fa-angle-up cat-arrow-landing'}>
                                </i>
                            </th>
                        </tr>
                    </thead>
                </table>
                <div className="category-table">

                    { selectedOrderCycle && selectedOrderCycle.includes(SINGLE_DAY) && orderingCategoryDetails.singleDay && orderingCategoryDetails.singleDay.category && !orderByVendor && orderingCategoryDetails.singleDay.category.length > 0 &&

                        orderingCategoryDetails.singleDay.category.map((category, categoryIndex) => {
                            if (isCarried && category.carriedItemCounts.toString() === '0' && category.carriedOrderCounts.toString() === '0') {
                                return true;
                            }

                            return (
                                <table key={categoryIndex} >
                                    <thead className='container'>
                                        <tr className="row cat-border-bottom cat-text text-left" key={categoryIndex}>
                                            <td className="col-5 col-sm-5 col-md-5 coloring-stripe-Singleday text-left" data-label="Group,Category">
                                                <label id={`single-day-cat-${categoryIndex}`} className="group-checkbox"> {category.orderGroupCodeName}
                                                    <input type="checkbox" onClick={() => THIS.onChangeParentChkBox(categoryIndex, SINGLE_DAY)} checked={category.isSelectedByUser ? category.isSelectedByUser : false} name={`single-day-cat-${categoryIndex}`} value={`s-${categoryIndex}`} onChange={() => THIS.render()} />
                                                    <span className="group-checkmark" />
                                                </label>
                                            </td>
                                            <td className="col-3 col-sm-3 d-md-none text-center " data-label="# to order"><div className="mob-to-order-group">{isCarried ? (category.carriedOrderCounts.toString() + '/' + category.carriedItemCounts.toString()) : (category.allOrderCounts.toString() + '/' + category.allItemCounts.toString())}</div></td>
                                            <td className="col-md-2 d-none d-md-table-cell" data-label="Available to Order">{isCarried ? category.carriedItemCounts : category.allItemCounts}</td>
                                            <td className="col-md-2 d-none d-md-table-cell cusRemSingleDay" data-label="Remaining to Order">{isCarried ? category.carriedOrderCounts : category.allOrderCounts}</td>
                                            <td className="col-3 col-sm-3 col-md-2 text-left cusStatusSingleDay" data-label="Status" >
                                            { (THIS.determineCategoryStatus(isCarried, category) === "complete" || THIS.determineCategoryStatus(isCarried, category) === "pending" ) &&
                                               <img className="status" alt="status" src={THIS.determineCategoryStatus(isCarried, category) === "complete" ? complete : THIS.determineCategoryStatus(isCarried, category) === "pending" ? pending : pending} />

                                            }                                                
                                            <span className="status-text status-group" >{THIS.determineCategoryStatus(isCarried, category) === "complete" ? "Complete" : THIS.determineCategoryStatus(isCarried, category) === "pending" ? "Pending" : '-'}</span></td>
                                            <td className="col-1 col-sm-1 col-md-1 cusArrowSingleDay"> <i onClick={() => this.categoryCollapse(categoryIndex, SINGLE_DAY)} className={category.hasOwnProperty("isExpanded") && category.isExpanded === false ? 'fa fa-angle-down cat-arrow2' : 'fa fa-angle-up cat-arrow2'}></i></td>
                                        </tr>
                                    </thead>
                                    {category.subCategories && category.subCategories.length > 0 && (category.hasOwnProperty("isExpanded") ? category.isExpanded : true) && category.subCategories.map((subCategory, subCategoryIndex) => {
                                        if (isCarried && subCategory.carriedItemCounts.toString() === '0' && subCategory.carriedOrderCounts.toString() === '0') {
                                            return true;
                                        }

                                        return (
                                            <tbody key={subCategoryIndex}>
                                                <tr className="row cat-border-bottom sub-cat-text" key={subCategoryIndex}>
                                                    <td className="col-5 col-sm-5 col-md-5 text-left" data-label="Group,Category">
                                                        <label id={`single-day-sub-cat-${subCategoryIndex}`} className="category-checkbox"> {this.convertToLowerCase(subCategory.psaDescription)}
                                                            <input type="checkbox" onClick={() => THIS.onChangeChildChkBox(categoryIndex, subCategoryIndex, SINGLE_DAY)} checked={subCategory.isSelectedByUser ? subCategory.isSelectedByUser : false} name={`single-day-sub-cat-${subCategoryIndex}`} value={`s-${categoryIndex}`} onChange={() => THIS.render()} />
                                                            <span className="category-checkmark"></span>
                                                        </label>
                                                    </td>
                                                    <td className="col-3 col-sm-3 d-md-none text-center " data-label="# to order"><div className="mob-to-order-cat">{isCarried ? (subCategory.carriedOrderCounts.toString() + '/' + subCategory.carriedItemCounts.toString()) : (subCategory.allOrderCounts.toString() + '/' + subCategory.allItemCounts.toString())}</div></td>
                                                    <td className="col-md-2 d-none d-md-table-cell" data-label="Available to Order">{isCarried ? subCategory.carriedItemCounts : subCategory.allItemCounts}</td>
                                                    <td className="col-md-2 d-none d-md-table-cell cusRemSingleDay" data-label="Remaining to Order">{isCarried ? subCategory.carriedOrderCounts : subCategory.allOrderCounts}</td>
                                                    <td className="col-3 col-sm-3 col-md-2 text-left cusStatusSingleDay" data-label="Status">
                                                    { (THIS.determineCategoryStatus(isCarried, subCategory) === "complete" || THIS.determineCategoryStatus(isCarried, subCategory) === "pending" ) &&
                                                        <img className="status" alt="status" src={THIS.determineCategoryStatus(isCarried, subCategory) === "complete" ? complete : THIS.determineCategoryStatus(isCarried, subCategory) === "pending" ? pending : pending} />

                                                    }
                                                    <span className="status-text status-group" >{THIS.determineSubcategoryStatus(isCarried, subCategory) === "complete" ? "Complete" : THIS.determineSubcategoryStatus(isCarried, subCategory) === "pending" ? "Pending" : '-'}</span>
                                                    </td>
                                                    <td className="col-1 col-sm-1 col-md-1 cusArrowSingleDay" data-label="label"></td>
                                                </tr>
                                            </tbody>);

                                    })}
                                </table>
                            );
                        })
                    }

                    { selectedOrderCycle && !orderByVendor && selectedOrderCycle.includes(MULTI_DAY) && orderingCategoryDetails.multiDay && orderingCategoryDetails.multiDay.category && orderingCategoryDetails.multiDay.category.length > 0 &&

                        orderingCategoryDetails.multiDay.category.map((category, categoryIndex) => {
                            if (isCarried && category.carriedItemCounts.toString() === '0' && category.carriedOrderCounts.toString() === '0') {
                                return true;
                            }

                            return (
                                <table key={categoryIndex}>
                                    <thead>
                                        <tr className="row cat-border-bottom cat-text text-left" key={categoryIndex}>
                                            <td className="col-5 col-sm-5 col-md-5 coloring-stripe-Multiday text-left" data-label="Group,Category">
                                                <label id={`multi-day-cat-${categoryIndex}`} className="group-checkbox"> {category.orderGroupCodeName}
                                                    <input type="checkbox" onClick={() => THIS.onChangeParentChkBox(categoryIndex, MULTI_DAY)} checked={category.isSelectedByUser ? category.isSelectedByUser : false} name={`multi-day-cat-${categoryIndex}`} value={`m-${categoryIndex}`} onChange={() => THIS.render()} />
                                                    <span className="group-checkmark"></span>
                                                </label>
                                            </td>
                                            <td className="col-3 col-sm-3 d-md-none text-center " data-label="# to order"><div className="mob-to-order-group">{isCarried ? (category.carriedOrderCounts.toString() + '/' + category.carriedItemCounts.toString()) : (category.allOrderCounts.toString() + '/' + category.allItemCounts.toString())}</div></td>
                                            <td className="col-md-2 d-none d-md-table-cell" data-label="Available to Order">{isCarried ? category.carriedItemCounts : category.allItemCounts}</td>
                                            <td className="col-md-2 d-none d-md-table-cell cusRemMultiDay" data-label="Remaining to Order">{isCarried ? category.carriedOrderCounts : category.allOrderCounts}</td>
                                            <td className="col-3 col-sm-3 col-md-2 text-left cusStatusMultiDay" data-label="Status" >
                                            { (THIS.determineCategoryStatus(isCarried, category) === "complete" || THIS.determineCategoryStatus(isCarried, category) === "pending" ) &&

                                                <img className="status" alt="status" src={THIS.determineCategoryStatus(isCarried, category) === "complete" ? complete : THIS.determineCategoryStatus(isCarried, category) === "pending" ? pending : pending} />

                                            }                                                
                                            <span className="status-text status-group" >{THIS.determineCategoryStatus(isCarried, category) === "complete" ? "Complete" : THIS.determineCategoryStatus(isCarried, category) === "pending" ? "Pending" : '-'}</span>
                                            </td>
                                            <td className="col-1 col-sm-1 col-md-1 cusArrowMultiDay"> <i onClick={() => this.categoryCollapse(categoryIndex, MULTI_DAY)} className={category.hasOwnProperty("isExpanded") && category.isExpanded === false ? 'fa fa-angle-down cat-arrow2' : 'fa fa-angle-up cat-arrow2'}></i></td>
                                        </tr>
                                    </thead>
                                    {category.subCategories && category.subCategories.length > 0 && (category.hasOwnProperty("isExpanded") ? category.isExpanded : true) && category.subCategories.map((subCategory, subCategoryIndex) => {
                                        if (isCarried && subCategory.carriedItemCounts.toString() === '0' && subCategory.carriedOrderCounts.toString() === '0') {
                                            return true;
                                        }

                                        return (
                                            <tbody key={subCategoryIndex} >
                                                <tr className="row cat-border-bottom sub-cat-text" key={subCategoryIndex}>
                                                    <td className="col-5 col-sm-5 col-md-5 text-left" data-label="Group,Category">
                                                        <label id={`multi-day-sub-cat-${subCategoryIndex}`} className="category-checkbox">{this.convertToLowerCase(subCategory.psaDescription)}
                                                            <input type="checkbox" onClick={() => THIS.onChangeChildChkBox(categoryIndex, subCategoryIndex, MULTI_DAY)} checked={subCategory.isSelectedByUser ? subCategory.isSelectedByUser : false} name={`multi-day-sub-cat-${subCategoryIndex}`} value={`m-${categoryIndex}`} onChange={() => THIS.render()} />
                                                            <span className="category-checkmark"></span>
                                                        </label>
                                                    </td>
                                                    <td className="col-3 col-sm-3 d-md-none text-center " data-label="# to order"><div className="mob-to-order-cat">{isCarried ? (subCategory.carriedOrderCounts.toString() + '/' + subCategory.carriedItemCounts.toString()) : (subCategory.allOrderCounts.toString() + '/' + subCategory.allItemCounts.toString())}</div></td>
                                                    <td className="col-md-2 d-none d-md-table-cell" data-label="Available to Order">{isCarried ? subCategory.carriedItemCounts : subCategory.allItemCounts}</td>
                                                    <td className="col-md-2 d-none d-md-table-cell cusRemMultiDay" data-label="Remaining to Order">{isCarried ? subCategory.carriedOrderCounts : subCategory.allOrderCounts}</td>
                                                    <td className="col-3 col-sm-3 col-md-2 text-left cusStatusMultiDay" data-label="Status">
                                                    { (THIS.determineCategoryStatus(isCarried, subCategory) === "complete" || THIS.determineCategoryStatus(isCarried, subCategory) === "pending" ) &&

                                                        <img className="status" alt="status" src={THIS.determineCategoryStatus(isCarried, subCategory) === "complete" ? complete : THIS.determineCategoryStatus(isCarried, subCategory) === "pending" ? pending : pending} />

                                                    }                                                        
                                                        <span className="status-text status-group" >{THIS.determineSubcategoryStatus(isCarried, subCategory) === "complete" ? "Complete" : THIS.determineSubcategoryStatus(isCarried, subCategory) === "pending" ? "Pending" : '-'}</span>
                                                    </td>
                                                    <td className="col-1 col-sm-1 col-md-1 cusArrowMultiDay" data-label="label"></td>
                                                </tr>
                                            </tbody>);

                                    })}
                                </table>
                            );
                        })
                    }

                    { selectedOrderCycle && !orderByVendor && selectedOrderCycle.includes(NON_DAILY) && orderingCategoryDetails.nonDaily && orderingCategoryDetails.nonDaily.category && orderingCategoryDetails.nonDaily.category.length > 0 &&

                        orderingCategoryDetails.nonDaily.category.map((category, categoryIndex) => {
                            if (isCarried && category.carriedItemCounts.toString() === '0' && category.carriedOrderCounts.toString() === '0') {
                                return true;
                            }

                            return (
                                <table key={categoryIndex}>
                                    <thead>
                                        <tr className="row cat-border-bottom cat-text text-left" key={categoryIndex}>
                                            <td className="col-5 col-sm-5 col-md-5 coloring-stripe-Nondaily text-left" data-label="Group,Category">
                                                <label id={`non-daily-cat-${categoryIndex}`} className="group-checkbox"> {category.orderGroupCodeName}
                                                    <input type="checkbox" onClick={() => THIS.onChangeParentChkBox(categoryIndex, NON_DAILY)} checked={category.isSelectedByUser ? category.isSelectedByUser : false} name={`non-daily-cat-${categoryIndex}`} value={`n-${categoryIndex}`} onChange={() => THIS.render()} />
                                                    <span className="group-checkmark"></span>
                                                </label>
                                            </td>
                                            <td className="col-3 col-sm-3 d-md-none text-center " data-label="# to order"><div className="mob-to-order-group">{isCarried ? (category.carriedOrderCounts.toString() + '/' + category.carriedItemCounts.toString()) : (category.allOrderCounts.toString() + '/' + category.allItemCounts.toString())}</div></td>
                                            <td className="col-md-2 d-none d-md-table-cell" data-label="Available to Order">{isCarried ? category.carriedItemCounts : category.allItemCounts}</td>
                                            <td className="col-md-2 d-none d-md-table-cell cusRemNonDay" data-label="Remaining to Order">{isCarried ? category.carriedOrderCounts : category.allOrderCounts}</td>
                                            <td className="col-3 col-sm-3 col-md-2 text-left cusStatusNonDaily" data-label="Status" >
                                            { (THIS.determineCategoryStatus(isCarried, category) === "complete" || THIS.determineCategoryStatus(isCarried, category) === "pending" ) &&

                                                <img className="status" alt="status" src={THIS.determineCategoryStatus(isCarried, category) === "complete" ? complete : THIS.determineCategoryStatus(isCarried, category) === "pending" ? pending : pending} />

                                            }                                                
                                            <span className="status-text status-group" >{THIS.determineCategoryStatus(isCarried, category) === "complete" ? "Complete" : THIS.determineCategoryStatus(isCarried, category) === "pending" ? "Pending" : '-'}</span>
                                            </td>
                                            <td className="col-1 col-sm-1 col-md-1 cusArrowNonDaily"> <i onClick={() => this.categoryCollapse(categoryIndex, NON_DAILY)} className={category.hasOwnProperty("isExpanded") && category.isExpanded === false ? 'fa fa-angle-down cat-arrow2' : 'fa fa-angle-up cat-arrow2'}></i></td>
                                        </tr>
                                    </thead>
                                    {category.subCategories && category.subCategories.length > 0 && (category.hasOwnProperty("isExpanded") ? category.isExpanded : true) && category.subCategories.map((subCategory, subCategoryIndex) => {
                                        if (isCarried && subCategory.carriedItemCounts.toString() === '0' && subCategory.carriedOrderCounts.toString() === '0') {
                                            return true;
                                        }

                                        return (
                                            <tbody key={subCategoryIndex} >
                                                <tr className="row cat-border-bottom sub-cat-text" key={subCategoryIndex}>
                                                    <td className="col-5 col-sm-5 col-md-5 text-left" data-label="Group,Category">
                                                        <label id={`non-daily-sub-cat-${subCategoryIndex}`} className="category-checkbox"> {this.convertToLowerCase(subCategory.psaDescription)}
                                                            <input type="checkbox" onClick={() => THIS.onChangeChildChkBox(categoryIndex, subCategoryIndex, NON_DAILY)} checked={subCategory.isSelectedByUser ? subCategory.isSelectedByUser : false} name={`non-daily-sub-cat-${subCategoryIndex}`} value={`n-${categoryIndex}`} onChange={() => THIS.render()} />
                                                            <span className="category-checkmark"></span>
                                                        </label>
                                                    </td>
                                                    <td className="col-3 col-sm-3 d-md-none text-center " data-label="# to order"><div className="mob-to-order-cat">{isCarried ? (subCategory.carriedOrderCounts.toString() + '/' + subCategory.carriedItemCounts.toString()) : (subCategory.allOrderCounts.toString() + '/' + subCategory.allItemCounts.toString())}</div></td>
                                                    <td className="col-md-2 d-none d-md-table-cell" data-label="Available to Order">{isCarried ? subCategory.carriedItemCounts : subCategory.allItemCounts}</td>
                                                    <td className="col-md-2 d-none d-md-table-cell cusRemNonDay" data-label="Remaining to Order">{isCarried ? subCategory.carriedOrderCounts : subCategory.allOrderCounts}</td>
                                                    <td className="col-3 col-sm-3 col-md-2 text-left cusStatusNonDaily" data-label="Status">
                                                    { (THIS.determineCategoryStatus(isCarried, subCategory) === "complete" || THIS.determineCategoryStatus(isCarried, subCategory) === "pending" ) &&

                                                        <img className="status" alt="status" src={THIS.determineCategoryStatus(isCarried, subCategory) === "complete" ? complete : THIS.determineCategoryStatus(isCarried, subCategory) === "pending" ? pending : pending} />

                                                    }                                                        
                                                    <span className="status-text status-group" >{THIS.determineSubcategoryStatus(isCarried, subCategory) === "complete" ? "Complete" : THIS.determineSubcategoryStatus(isCarried, subCategory) === "pending" ? "Pending" : '-'}</span>
                                                    </td>
                                                    <td className="col-1 col-sm-1 col-md-1 cusArrowNonDaily" data-label="label"></td>
                                                </tr>
                                            </tbody>);

                                    })}


                                </table>
                            );
                        })
                    }

                    {!displayOrderingSpinner && 
                    (this.props.orderingStatus === "COMPLETE" || this.props.orderingStatus === "NETWORK_ERROR") &&           
                    (( !orderByVendor  && 
                    (((orderingCategoryDetails.singleDay && orderingCategoryDetails.singleDay.category.length === 0) && 
                    (orderingCategoryDetails.multiDay && orderingCategoryDetails.multiDay.category.length === 0) && 
                    (orderingCategoryDetails.nonDaily && orderingCategoryDetails.nonDaily.category.length === 0)) 
                    || !orderingCategoryDetails)) || (orderByVendor && (orderByVendorData.CDC && orderByVendorData.CDC.category && orderByVendorData.CDC.category.length === 0 && 
                    orderByVendorData.DSD && orderByVendorData.DSD.category && orderByVendorData.DSD.category.length === 0 ))) &&

                        <span className="ordering-no-data-indicator no-data-indicator">Currently system is generating Order data for the new window. Please wait for few minutes and try again.</span>
                    }

                    {orderByVendor && orderByVendorData.CDC && orderByVendorData.CDC.category && orderByVendorData.CDC.category.length > 0 &&

                        orderByVendorData.CDC.category.map((category, categoryIndex) => {
                            if (isCarried && category.carriedItemCounts.toString() === '0' && category.carriedOrderCounts.toString() === '0') {
                                return true;
                            }

                            return (
                                <table key={categoryIndex}>
                                    <thead>
                                        <tr className="row cat-border-bottom cat-text text-left" key={categoryIndex}>
                                            <td className="col-5 col-sm-5 col-md-5 coloring-stripe-Nondaily text-left" data-label="Group,Category">
                                                <label id={`non-daily-cat-${categoryIndex}`} className="group-checkbox">CDC - {category.orderGroupCodeName}
                                                    <input type="checkbox" onClick={() => THIS.onChangeParentChkBox(categoryIndex, CDC)} checked={category.isSelectedByUser ? category.isSelectedByUser : false} name={`non-daily-cat-${categoryIndex}`} value={`n-${categoryIndex}`} onChange={() => THIS.render()} />
                                                    <span className="group-checkmark"></span>
                                                </label>
                                            </td>
                                            <td className="col-3 col-sm-3 d-md-none text-center " data-label="# to order"><div className="mob-to-order-group">{isCarried ? (category.carriedOrderCounts.toString() + '/' + category.carriedItemCounts.toString()) : (category.allOrderCounts.toString() + '/' + category.allItemCounts.toString())}</div></td>
                                            <td className="col-md-2 d-none d-md-table-cell" data-label="Available to Order">{isCarried ? category.carriedItemCounts : category.allItemCounts}</td>
                                            <td className="col-md-2 d-none d-md-table-cell cusRemToOrder" data-label="Remaining to Order">{isCarried ? category.carriedOrderCounts : category.allOrderCounts}</td>
                                            <td className="col-3 col-sm-3 col-md-2 text-left cusStatusCustom" data-label="Status" >
                                            { (THIS.determineCategoryStatus(isCarried, category) === "complete" || THIS.determineCategoryStatus(isCarried, category) === "pending" ) &&

                                                <img className="status" alt="status" src={THIS.determineCategoryStatus(isCarried, category) === "complete" ? complete : THIS.determineCategoryStatus(isCarried, category) === "pending" ? pending : pending} />

                                            }                                                
                                            <span className="status-text status-group" >{THIS.determineCategoryStatus(isCarried, category) === "complete" ? "Complete" : THIS.determineCategoryStatus(isCarried, category) === "pending" ? "Pending" : '-'}</span>
                                            </td>
                                            <td className="col-1 col-sm-1 col-md-1 cusArrowCustom"> <i onClick={() => this.categoryCollapse(categoryIndex, CDC)} className={category.hasOwnProperty("isExpanded") && category.isExpanded === false ? 'fa fa-angle-down cat-arrow2' : 'fa fa-angle-up cat-arrow2'}></i></td>
                                        </tr>
                                    </thead>
                                    {category.subCategories && category.subCategories.length > 0 && (category.hasOwnProperty("isExpanded") ? category.isExpanded : true) && category.subCategories.map((subCategory, subCategoryIndex) => {
                                        if (isCarried && subCategory.carriedItemCounts.toString() === '0' && subCategory.carriedOrderCounts.toString() === '0') {
                                            return true;
                                        }

                                        return (
                                            <tbody key={subCategoryIndex} >
                                                <tr className="row cat-border-bottom sub-cat-text" key={subCategoryIndex}>
                                                    <td className="col-5 col-sm-5 col-md-5 text-left" data-label="Group,Category">
                                                        <label id={`non-daily-sub-cat-${subCategoryIndex}`} className="category-checkbox"> {this.convertToLowerCase(subCategory.psaDescription)}
                                                            <input type="checkbox" onClick={() => THIS.onChangeChildChkBox(categoryIndex, subCategoryIndex, CDC)} checked={subCategory.isSelectedByUser ? subCategory.isSelectedByUser : false} name={`non-daily-sub-cat-${subCategoryIndex}`} value={`n-${categoryIndex}`} onChange={() => THIS.render()} />
                                                            <span className="category-checkmark"></span>
                                                        </label>
                                                    </td>
                                                    <td className="col-3 col-sm-3 d-md-none text-center " data-label="# to order"><div className="mob-to-order-cat">{isCarried ? (subCategory.carriedOrderCounts.toString() + '/' + subCategory.carriedItemCounts.toString()) : (subCategory.allOrderCounts.toString() + '/' + subCategory.allItemCounts.toString())}</div></td>
                                                    <td className="col-md-2 d-none d-md-table-cell" data-label="Available to Order">{isCarried ? subCategory.carriedItemCounts : subCategory.allItemCounts}</td>
                                                    <td className="col-md-2 d-none d-md-table-cell cusRemToOrder" data-label="Remaining to Order">{isCarried ? subCategory.carriedOrderCounts : subCategory.allOrderCounts}</td>
                                                    <td className="col-3 col-sm-3 col-md-2 text-left cusStatusCustom" data-label="Status">
                                                    { (THIS.determineCategoryStatus(isCarried, subCategory) === "complete" || THIS.determineCategoryStatus(isCarried, subCategory) === "pending" ) &&

                                                        <img className="status" alt="status" src={THIS.determineCategoryStatus(isCarried, subCategory) === "complete" ? complete : THIS.determineCategoryStatus(isCarried, subCategory) === "pending" ? pending : pending} />

                                                    }                                                        
                                                    <span className="status-text status-group" >{THIS.determineSubcategoryStatus(isCarried, subCategory) === "complete" ? "Complete" : THIS.determineSubcategoryStatus(isCarried, subCategory) === "pending" ? "Pending" : '-'}</span>
                                                    </td>
                                                    <td className="col-1 col-sm-1 col-md-1 cusArrowCustom" data-label="label"></td>
                                                </tr>
                                            </tbody>);

                                    })}

                                </table>
                            );
                        })
                    }
                    {orderByVendor && orderByVendorData.DSD && orderByVendorData.DSD.category && orderByVendorData.DSD.category.length > 0 &&

                        orderByVendorData.DSD.category.map((category, categoryIndex) => {
                            if (isCarried && category.carriedItemCounts.toString() === '0' && category.carriedOrderCounts.toString() === '0') {
                                return true;
                            }

                            return (
                                <table key={categoryIndex}>
                                    <thead>
                                        <tr className="row cat-border-bottom cat-text text-left" key={categoryIndex}>
                                            <td className="col-5 col-sm-5 col-md-5 coloring-stripe-Nondaily text-left" data-label="Group,Category">
                                                <label id={`non-daily-cat-${categoryIndex}`} className="group-checkbox"> DSD - {category.orderGroupCodeName}
                                                    <input type="checkbox" onClick={() => THIS.onChangeParentChkBox(categoryIndex, DSD)} checked={category.isSelectedByUser ? category.isSelectedByUser : false} name={`non-daily-cat-${categoryIndex}`} value={`n-${categoryIndex}`} onChange={() => THIS.render()} />
                                                    <span className="group-checkmark"></span>
                                                </label>
                                            </td>
                                            {/* <td className="col-3 col-sm-3 d-md-none text-center " data-label="# to order"><div className="mob-to-order-group">{isCarried ? (category.carriedOrderCounts.toString() + '/' + category.carriedItemCounts.toString()) : (category.allOrderCounts.toString() + '/' + category.allItemCounts.toString())}</div></td> */}
                                            <td className="col-md-2 d-none d-md-table-cell" data-label="Available to Order">{isCarried ? category.carriedItemCounts : category.allItemCounts}</td>
                                            <td className="col-md-2 d-none d-md-table-cell cusRemToOrder" data-label="Remaining to Order">{isCarried ? category.carriedOrderCounts : category.allOrderCounts}</td>
                                            <td className="col-3 col-sm-3 col-md-2 text-left cusStatusCustom" data-label="Status" >
                                            { (THIS.determineCategoryStatus(isCarried, category) === "complete" || THIS.determineCategoryStatus(isCarried, category) === "pending" ) &&

                                                <img className="status" alt="status" src={THIS.determineCategoryStatus(isCarried, category) === "complete" ? complete : THIS.determineCategoryStatus(isCarried, category) === "pending" ? pending : pending} />

                                            }                                                
                                            <span className="status-text status-group" >{THIS.determineCategoryStatus(isCarried, category) === "complete" ? "Complete" : THIS.determineCategoryStatus(isCarried, category) === "pending" ? "Pending" : '-'}</span>
                                            </td>
                                            {/* <td className = "col-1 col-sm-1 col-md-1"> <i onClick = {()=> this.categoryCollapse(categoryIndex, DSD)} className={ category.hasOwnProperty("isExpanded") && category.isExpanded === false ? 'fa fa-angle-down cat-arrow2': 'fa fa-angle-up cat-arrow2'}></i></td> */}
                                        </tr>
                                    </thead>
                                </table>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return ({
        loginData: state.login.loginData.payload,
        orderByVendorData: state.ordering.getOrderByVendorDetails && state.ordering.getOrderByVendorDetails && state.ordering.getOrderByVendorDetails.payload ? state.ordering.getOrderByVendorDetails.payload : '',
        orderingCategoryDetails: state.ordering.getOrderingCategoryDetails.payload ? state.ordering.getOrderingCategoryDetails.payload : '',
        orderingStatus: state.ordering && state.ordering.getOrderingStatus && state.ordering.getOrderingStatus.payload
    });
}
export default connect(
    mapStateToProps
)(withRouter(OrderingCategories))
