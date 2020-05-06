import React from 'react';
import { connect } from 'react-redux';
import { getReportingDetails, getReportingyVendorDetails } from '../../actions/index';
import './ReportingCycleType.css';
import './ReportingCategories.css';
import { getOrderDate } from '../utility/getOrderDate';
import { getReportingItemDetails, getReportingItemVendorDetails, getSelectedReportingData, action } from '../../actions/index';
import { SINGLE_DAY, MULTI_DAY, NON_DAILY, NON_DAILY_VENDOR, CDC, DSD, SINGLE_DAY_REPORTING, GR, cycleTypes, GR_EXTENSION, REPORTING_CYCLES_SELECTED, RESET_REPORTING_DETAIL_DATA } from '../../constants/ActionTypes';
import { storeDetails } from '../../lib/storeDetails';
export class ReportingCategories extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                reportingCategoryDetails: {},
                parentCollapse: false,
                isContinueEnabled: false,
                orderByVendor: false,
                reportingVendorDetails: [],
                orderCycles: [SINGLE_DAY, MULTI_DAY, NON_DAILY, NON_DAILY_VENDOR],
                storeId: storeDetails() && storeDetails().storeId,
                previousSelected: '',
                previousSelectedIndex: null
            }
        }

        componentDidMount() {
            const { selectedDay, orderByVendor, orderCycles } = this.props;
            const { storeId } = this.state;
            this.setState({
                // reportingCategoryDetails: reportingCategoryDetails, // we always need updated data from API 
                orderByVendor: orderByVendor,
                // reportingVendorDetails: reportingVendorDetails,
                selectedDay: getOrderDate(selectedDay),
                orderCycles: orderCycles,
            });

            /** Dispatch an action to fetch the Ordering Info(Single Day, Multi Day & Non-Daily)*/
            if (selectedDay) {
                this.props.dispatch(getReportingDetails(storeId, selectedDay));
            }

            /** Dispatch an action to fetch the Ordering Info(SCDC & DSD)*/
            if (selectedDay && this.state.orderCycles.includes(NON_DAILY)) {
                this.props.dispatch(getReportingyVendorDetails(storeId, selectedDay));
            }
        }

        componentWillReceiveProps(newProps) {
            this.setState({
                orderCycles: newProps.orderCycles,
                reportingCategoryDetails: newProps.reportingCategoryDetails,
                reportingVendorDetails: newProps.reportingVendorDetails,
                selectedDay: getOrderDate(newProps.selectedDay),
            }, () => {
                const { orderByVendor } = this.state;
                if (orderByVendor !== newProps.orderByVendor) {
                    this.setState({
                            orderByVendor: newProps.orderByVendor,
                            previousSelected: '',
                            previousSelectedIndex: null
                        },
                        () => {
                            this.resetSelections(newProps.orderByVendor); // USED TO REVERT SELECTIONS
                        })
                } else {
                    this.setContinueButton();
                }
            });
            const { storeId } = this.state;

            if (getOrderDate(newProps.selectedDay) !== this.state.selectedDay) {
                this.props.dispatch(getReportingDetails(storeId, newProps.selectedDay));
                this.props.dispatch(getReportingyVendorDetails(storeId, newProps.selectedDay));
            }

            if (newProps && newProps.onNext) {
                let selectedItemsMap = new Map();
                let {
                    singleDayPsaCode,
                    singleDayCatCode,
                    multiDayPsaCode,
                    multiDayCatCode,
                    nonDailyPsaCode,
                    nonDailyCatCode,
                    singleDayGroups,
                    multiDayGroups,
                    nonDailyGroups,
                    grPsaCode,
                    grCatCode,
                    grGroups,
                    cdcPsaCode,
                    cdcCatCode,
                    cdcGroups,
                    dsdOrderGroupCode
                } = this.getSubCategories();
                let isFirstItemSelected = undefined;
                let selectedCycles = [];
                let orderDateValue = getOrderDate(newProps.selectedDay);
                let isFirstPage = true;

                if (singleDayGroups || (singleDayPsaCode && singleDayCatCode)) {
                    selectedItemsMap.set(SINGLE_DAY, {
                        storeId: storeId,
                        orderDate: orderDateValue,
                        selectedDay: newProps.selectedDay,
                        ordercycletype: SINGLE_DAY_REPORTING,
                        orderCycleType: SINGLE_DAY,
                        groupCodes: singleDayGroups ? singleDayGroups : "",
                        psa: singleDayPsaCode,
                        cat: singleDayCatCode,
                        isSelected: true,
                        isFirstPage: isFirstPage,
                        timeZone: storeDetails() ? storeDetails().timeZone : 'UTC',
                    });
                    isFirstItemSelected = SINGLE_DAY;
                    selectedCycles.push(SINGLE_DAY);
                }
                if (multiDayGroups || (multiDayPsaCode && multiDayCatCode)) {
                    selectedItemsMap.set(MULTI_DAY, {
                        storeId: storeId,
                        orderDate: orderDateValue,
                        selectedDay: newProps.selectedDay,
                        ordercycletype: cycleTypes.multiDay,
                        orderCycleType: MULTI_DAY,
                        groupCodes: multiDayGroups ? multiDayGroups : "",
                        psa: multiDayPsaCode,
                        cat: multiDayCatCode,
                        isFirstPage: isFirstPage,
                        isSelected: isFirstItemSelected ? false : true,
                        timeZone: storeDetails() ? storeDetails().timeZone : 'UTC',
                    });
                    isFirstItemSelected = isFirstItemSelected ? isFirstItemSelected : MULTI_DAY
                    selectedCycles.push(MULTI_DAY);
                }
                if (nonDailyGroups || (nonDailyPsaCode && nonDailyCatCode)) {
                    selectedItemsMap.set(NON_DAILY, {
                        storeId: storeId,
                        orderDate: orderDateValue,
                        selectedDay: newProps.selectedDay,
                        ordercycletype: cycleTypes.nonDaily,
                        orderCycleType: NON_DAILY,
                        groupCodes: nonDailyGroups ? nonDailyGroups : "",
                        psa: nonDailyPsaCode,
                        cat: nonDailyCatCode,
                        isFirstPage: isFirstPage,
                        isSelected: isFirstItemSelected ? false : true,
                        timeZone: storeDetails() ? storeDetails().timeZone : 'UTC',
                    });
                    isFirstItemSelected = isFirstItemSelected ? isFirstItemSelected : NON_DAILY;
                    selectedCycles.push(NON_DAILY);
                }
                if (grGroups || (grPsaCode && grCatCode)) {
                    selectedItemsMap.set(GR, {
                        storeId: storeId,
                        orderDate: orderDateValue,
                        selectedDay: newProps.selectedDay,
                        ordercycletype: GR,
                        orderCycleType: GR,
                        groupCodes: grGroups ? grGroups : "",
                        psa: grPsaCode,
                        cat: grCatCode,
                        isFirstPage: isFirstPage,
                        timeZone: storeDetails() ? storeDetails().timeZone : 'UTC',
                        isSelected: isFirstItemSelected ? false : true
                    });
                    isFirstItemSelected = isFirstItemSelected ? isFirstItemSelected : GR;
                    selectedCycles.push("gr");
                }

                if (cdcGroups || dsdOrderGroupCode || (cdcPsaCode && cdcCatCode)) {
                    selectedItemsMap.set(NON_DAILY_VENDOR, {
                        storeId: storeId,
                        orderDate: orderDateValue,
                        selectedDay: newProps.selectedDay,
                        ordercycletype: cycleTypes.nonDaily + ',' + GR,
                        orderCycleType: NON_DAILY_VENDOR,
                        groupCodes: cdcGroups ? cdcGroups : "",
                        merchandiseVendorCode: dsdOrderGroupCode ? dsdOrderGroupCode : "",
                        psa: cdcPsaCode,
                        cat: cdcCatCode,
                        isFirstPage: isFirstPage,
                        timeZone: storeDetails() ? storeDetails().timeZone : 'UTC',
                        isSelected: isFirstItemSelected ? false : true
                    });
                    isFirstItemSelected = isFirstItemSelected ? isFirstItemSelected : NON_DAILY;
                    selectedCycles.push(NON_DAILY_VENDOR);
                }

                if (selectedItemsMap.size > 0) {
                    this.props.dispatch(getReportingItemDetails(selectedItemsMap.get(isFirstItemSelected)));
                    this.props.dispatch(getSelectedReportingData(selectedItemsMap));
                    this.props.dispatch(action({
                        type: REPORTING_CYCLES_SELECTED,
                        data: selectedCycles
                    }));
                    this.props.dispatch(action({
                        type: RESET_REPORTING_DETAIL_DATA
                    }))
                    if (isFirstItemSelected === SINGLE_DAY) {
                        this.props.onNextComplete(`/report/singleday`);
                    } else if (isFirstItemSelected === MULTI_DAY) {
                        this.props.onNextComplete(`/report/multiday`);
                    } else if (isFirstItemSelected === NON_DAILY) {
                        if (selectedItemsMap.get(NON_DAILY_VENDOR)) {
                            this.props.dispatch(getReportingItemVendorDetails(selectedItemsMap.get(NON_DAILY_VENDOR)));
                        }
                        this.props.onNextComplete(`/report/nondaily`);
                    } else if (isFirstItemSelected === GR) {
                        this.props.onNextComplete(`/report/gr`);
                    }
                }
            }
            this.props.isReportingSpinner(false);
        }

        getSubCategories = () => {
            let singleDayPsaCode, singleDayCatCode, singleDayGroups = '';
            let multiDayGroups, multiDayPsaCode, multiDayCatCode = '';
            let nonDailyPsaCode, nonDailyCatCode, nonDailyGroups = '';
            let grPsaCode, grCatCode, grGroups = "";
            let cdcPsaCode, cdcCatCode, cdcGroups, dsdOrderGroupCode = "";
            const cycleTypes = [SINGLE_DAY, MULTI_DAY, NON_DAILY, NON_DAILY_VENDOR];
            const { reportingVendorDetails, reportingCategoryDetails } = this.state;
            cycleTypes.forEach(eachCycleTpye => {
                reportingCategoryDetails[eachCycleTpye] && reportingCategoryDetails[eachCycleTpye].category.forEach(eachCat => {
                    eachCycleTpye !== NON_DAILY && eachCat.subCategories.forEach((data) => {
                        if (data.isSelectedByUser === true) {
                            if (eachCycleTpye === SINGLE_DAY) {
                                singleDayGroups = singleDayGroups && singleDayGroups.length > 0 ? (singleDayGroups + `,${eachCat.orderGroupCode}`) : `${eachCat.orderGroupCode}`
                                singleDayPsaCode = singleDayPsaCode && singleDayPsaCode.length > 0 ? (singleDayPsaCode + `,${data.psa}`) : `${data.psa}`
                                singleDayCatCode = singleDayCatCode && singleDayCatCode.length > 0 ? (singleDayCatCode + `,${data.cat}`) : `${data.cat}`

                            } else if (eachCycleTpye === MULTI_DAY) {
                                multiDayGroups = multiDayGroups && multiDayGroups.length > 0 ? (multiDayGroups + `,${eachCat.orderGroupCode}`) : `${eachCat.orderGroupCode}`
                                multiDayPsaCode = multiDayPsaCode && multiDayPsaCode.length > 0 ? (multiDayPsaCode + `,${data.psa}`) : `${data.psa}`
                                multiDayCatCode = multiDayCatCode && multiDayCatCode.length > 0 ? (multiDayCatCode + `,${data.cat}`) : `${data.cat}`
                            }
                        }
                    });

                    eachCycleTpye === NON_DAILY && eachCat.orderGroupCodeName && !eachCat.orderGroupCodeName.includes(GR_EXTENSION) && eachCat.subCategories.forEach((data) => {
                        if (data.isSelectedByUser === true) {
                            nonDailyGroups = nonDailyGroups && nonDailyGroups.length > 0 ? (nonDailyGroups + `,${eachCat.orderGroupCode}`) : `${eachCat.orderGroupCode}`
                            nonDailyPsaCode = nonDailyPsaCode && nonDailyPsaCode.length > 0 ? (nonDailyPsaCode + `,${data.psa}`) : `${data.psa}`
                            nonDailyCatCode = nonDailyCatCode && nonDailyCatCode.length > 0 ? (nonDailyCatCode + `,${data.cat}`) : `${data.cat}`
                        }
                    });

                    eachCycleTpye === NON_DAILY && eachCat.orderGroupCodeName && eachCat.orderGroupCodeName.includes(GR_EXTENSION) && eachCat.subCategories.forEach((data) => {
                        if (data.isSelectedByUser === true) {
                            grGroups = grGroups && grGroups.length > 0 ? (grGroups + `,${eachCat.orderGroupCode}`) : `${eachCat.orderGroupCode}`
                            grPsaCode = grPsaCode && grPsaCode.length > 0 ? (grPsaCode + `,${data.psa}`) : `${data.psa}`
                            grCatCode = grCatCode && grCatCode.length > 0 ? (grCatCode + `,${data.cat}`) : `${data.cat}`
                        }
                    });
                });

                eachCycleTpye === NON_DAILY_VENDOR && reportingVendorDetails && reportingVendorDetails[CDC] && reportingVendorDetails[CDC].category.forEach(eachCat => {
                    eachCat.subCategories.forEach((data) => {
                        if (data.isSelectedByUser === true) {
                            cdcGroups = cdcGroups && cdcGroups.length > 0 ? (cdcGroups + `,${eachCat.orderGroupCode}`) : `${eachCat.orderGroupCode}`
                            cdcPsaCode = cdcPsaCode && cdcPsaCode.length > 0 ? (cdcPsaCode + `,${data.psa}`) : `${data.psa}`
                            cdcCatCode = cdcCatCode && cdcCatCode.length > 0 ? (cdcCatCode + `,${data.cat}`) : `${data.cat}`
                        }
                    });
                });

                eachCycleTpye === NON_DAILY_VENDOR && reportingVendorDetails && reportingVendorDetails[DSD] && reportingVendorDetails[DSD].category.forEach(eachCat => {
                    if (eachCat.isSelectedByUser === true) {
                        dsdOrderGroupCode = dsdOrderGroupCode && dsdOrderGroupCode.length > 0 ? (dsdOrderGroupCode + `,${eachCat.orderGroupCode}`) : `${eachCat.orderGroupCode}`
                    }
                });
            })
            return {
                singleDayPsaCode,
                singleDayCatCode,
                multiDayPsaCode,
                multiDayCatCode,
                nonDailyPsaCode,
                nonDailyCatCode,
                singleDayGroups,
                multiDayGroups,
                nonDailyGroups,
                grCatCode,
                grGroups,
                grPsaCode,
                cdcPsaCode,
                cdcCatCode,
                cdcGroups,
                dsdOrderGroupCode
            };
        }

        resetSelections() {
            let { orderByVendor, reportingCategoryDetails, reportingVendorDetails } = this.state;

            orderByVendor && reportingVendorDetails && reportingVendorDetails.CDC && reportingVendorDetails.CDC.category.forEach(function (category) {
                category.isSelectedByUser = false;

                category.subCategories && category.subCategories.forEach(function (subCategory) {
                    subCategory.isSelectedByUser = false;
                });
            });

            orderByVendor && reportingVendorDetails.DSD && reportingVendorDetails.DSD.category && reportingVendorDetails.DSD.category.forEach(function (category) {
                category.isSelectedByUser = false;
            });

            !orderByVendor && reportingCategoryDetails.singleDay && reportingCategoryDetails.singleDay.category && reportingCategoryDetails.singleDay.category.forEach(function (category) {
                category.isSelectedByUser = false;

                category.subCategories && category.subCategories.forEach(function (subCategory) {
                    subCategory.isSelectedByUser = false;
                });
            });

            !orderByVendor && reportingCategoryDetails.multiDay && reportingCategoryDetails.multiDay.category && reportingCategoryDetails.multiDay.category.forEach(function (category) {
                category.isSelectedByUser = false;

                category.subCategories && category.subCategories.forEach(function (subCategory) {
                    subCategory.isSelectedByUser = false;
                });
            });
            !orderByVendor && reportingCategoryDetails.nonDaily && reportingCategoryDetails.nonDaily.category && reportingCategoryDetails.nonDaily.category.forEach(function (category) {
                category.isSelectedByUser = false;

                category.subCategories && category.subCategories.forEach(function (subCategory) {
                    subCategory.isSelectedByUser = false;
                });
            });

            this.setState({
                reportingCategoryDetails: reportingCategoryDetails,
                reportingVendorDetails: reportingVendorDetails
            }, () => {
                this.setContinueButton();
            })

        }

        setContinueButton() {
            const {
                reportingCategoryDetails,
                reportingVendorDetails,
                orderCycles,
                orderByVendor
            } = this.state;
            let isContinueEnabled = false;

            if (!orderCycles.includes(SINGLE_DAY)) {
                if (reportingCategoryDetails && reportingCategoryDetails.singleDay && reportingCategoryDetails.singleDay.category) {
                    reportingCategoryDetails.singleDay.category.forEach(function (category) {
                        category.isSelectedByUser = false;
                        category.subCategories.forEach(function (subCategories) {
                            subCategories.isSelectedByUser = false;
                        });
                    })
                }
            }
            if (!orderCycles.includes(MULTI_DAY)) {
                if (reportingCategoryDetails && reportingCategoryDetails.multiDay && reportingCategoryDetails.multiDay.category) {
                    reportingCategoryDetails.multiDay.category.forEach(function (category) {
                        category.isSelectedByUser = false;
                        category.subCategories.forEach(function (subCategories) {
                            subCategories.isSelectedByUser = false;
                        });
                    })
                }
            }
            if (!orderCycles.includes(NON_DAILY)) {
                if (reportingCategoryDetails && reportingCategoryDetails.nonDaily && reportingCategoryDetails.nonDaily.category) {
                    reportingCategoryDetails.nonDaily.category.forEach(function (category) {
                        category.isSelectedByUser = false;
                        category.subCategories.forEach(function (subCategories) {
                            subCategories.isSelectedByUser = false;
                        });
                    })
                }
            }

            orderByVendor && reportingVendorDetails && reportingVendorDetails.CDC && reportingVendorDetails.CDC.category.forEach(function (category) {
                if (category.isSelectedByUser === true) {
                    isContinueEnabled = true;
                    return false
                }
                category.subCategories && category.subCategories.forEach(function (subCategory) {
                    if (subCategory.isSelectedByUser === true) {
                        isContinueEnabled = true;
                        return false
                    }
                });
            });

            orderByVendor && reportingVendorDetails.DSD && reportingVendorDetails.DSD.category && reportingVendorDetails.DSD.category.forEach(function (category) {
                if (category.isSelectedByUser === true) {
                    isContinueEnabled = true;
                    return false
                }
            });

            !orderByVendor && reportingCategoryDetails.singleDay && reportingCategoryDetails.singleDay.category && reportingCategoryDetails.singleDay.category.forEach(function (category) {
                if (category.isSelectedByUser === true) {
                    isContinueEnabled = true;
                    return false
                }
                category.subCategories && category.subCategories.forEach(function (subCategory) {
                    if (subCategory.isSelectedByUser === true) {
                        isContinueEnabled = true;
                        return false
                    }
                });
            });

            !orderByVendor && reportingCategoryDetails.multiDay && reportingCategoryDetails.multiDay.category && reportingCategoryDetails.multiDay.category.forEach(function (category) {
                if (category.isSelectedByUser === true) {
                    isContinueEnabled = true;
                    return false
                }
                category.subCategories && category.subCategories.forEach(function (subCategory) {
                    if (subCategory.isSelectedByUser === true) {
                        isContinueEnabled = true;
                        return false
                    }
                });
            });

            !orderByVendor && reportingCategoryDetails.nonDaily && reportingCategoryDetails.nonDaily.category && reportingCategoryDetails.nonDaily.category.forEach(function (category) {
                if (category.isSelectedByUser === true) {
                    isContinueEnabled = true;
                    return false
                }
                category.subCategories && category.subCategories.forEach(function (subCategory) {
                    if (subCategory.isSelectedByUser === true) {
                        isContinueEnabled = true;
                        return false
                    }
                });
            });
            this.setState({
                isContinueEnabled: isContinueEnabled
            })
            this.props.isNextDisabled(!isContinueEnabled);
        }

        categoryCollapse(index, orderCycleType) {
            let { reportingCategoryDetails, reportingVendorDetails } = this.state;

            if (orderCycleType === DSD || orderCycleType === CDC) {
                if (!reportingVendorDetails[orderCycleType].category[index].hasOwnProperty("isExpanded")) {
                    reportingVendorDetails[orderCycleType].category[index].isExpanded = false;
                    this.setState({
                        reportingVendorDetails: reportingVendorDetails
                    })
                } else {
                    reportingVendorDetails[orderCycleType].category[index].isExpanded = !reportingVendorDetails[orderCycleType].category[index].isExpanded;
                    this.setState({
                        reportingVendorDetails: reportingVendorDetails
                    })
                }
            } else {
                if (!reportingCategoryDetails[orderCycleType].category[index].hasOwnProperty("isExpanded")) {
                    reportingCategoryDetails[orderCycleType].category[index].isExpanded = false;
                    this.setState({
                        reportingCategoryDetails: reportingCategoryDetails
                    })
                } else {
                    reportingCategoryDetails[orderCycleType].category[index].isExpanded = !reportingCategoryDetails[orderCycleType].category[index].isExpanded;
                    this.setState({
                        reportingCategoryDetails: reportingCategoryDetails
                    })
                }
            }
        }

        onChangeParentChkBox = (index, orderCycleType) => {
            let { reportingCategoryDetails } = this.state;

            if (orderCycleType === DSD || orderCycleType === CDC) {
                reportingCategoryDetails = this.state.reportingVendorDetails
            }
            if (!reportingCategoryDetails[orderCycleType].category[index].hasOwnProperty("isSelectedByUser")) {
                reportingCategoryDetails[orderCycleType].category[index].isSelectedByUser = true;
                if ((orderCycleType === DSD) || (orderCycleType === CDC)) {
                    this.setState({
                        reportingVendorDetails: reportingCategoryDetails
                    }, () => {
                        this.parentSelectionUpdated(index, reportingCategoryDetails, orderCycleType)
                    })
                } else {
                    this.setState({
                        reportingCategoryDetails: reportingCategoryDetails
                    }, () => {
                        this.parentSelectionUpdated(index, reportingCategoryDetails, orderCycleType)
                    })
                }

            } else {
                reportingCategoryDetails[orderCycleType].category[index].isSelectedByUser = !reportingCategoryDetails[orderCycleType].category[index].isSelectedByUser
                if ((orderCycleType === DSD) || (orderCycleType === CDC)) {
                    this.setState({
                        reportingVendorDetails: reportingCategoryDetails
                    }, () => {
                        this.parentSelectionUpdated(index, reportingCategoryDetails, orderCycleType)
                    })
                } else {
                    this.setState({
                        reportingCategoryDetails: reportingCategoryDetails
                    }, () => {
                        this.parentSelectionUpdated(index, reportingCategoryDetails, orderCycleType)
                    })
                }
            }
            setTimeout(() => {
                this.setContinueButton();
            }, 100)
        }

        parentSelectionUpdated(parentIndex, data, orderCycleType) {

            const { previousSelected } = this.state;
            if (previousSelected === '') {
                this.setState({
                    previousSelected: orderCycleType,
                    previousSelectedIndex: parentIndex
                })
            } else {
                if (data[orderCycleType].category[parentIndex].isSelectedByUser) {

                    data[previousSelected].category.forEach(function (parentLevel, index) {

                        parentLevel.isSelectedByUser = false;
                        parentLevel.subCategories.forEach(function (value) {
                            value.isSelectedByUser = false;
                        });

                    });
                    if (previousSelected === orderCycleType) {
                        data[orderCycleType].category[parentIndex].isSelectedByUser = true;
                    }
                    this.setState({
                        previousSelected: orderCycleType,
                        previousSelectedIndex: parentIndex
                    })
                } else {
                    this.setState({
                        previousSelected: '',
                        previousSelectedIndex: null
                    })
                }
            }
            data[orderCycleType].category[parentIndex].subCategories && data[orderCycleType].category[parentIndex].subCategories.forEach(function (value) {
                value.isSelectedByUser = data[orderCycleType].category[parentIndex].isSelectedByUser
            });
            if ((orderCycleType === DSD) || (orderCycleType === CDC)) {
                this.setState({
                    reportingVendorDetails: data
                });

            } else {
                this.setState({
                    reportingCategoryDetails: data
                });

            }
        }

        checkAllChildsSelected(parentIndex, data, orderCycleType, childIndex) {

            let previousSelected = this.state.previousSelected;
            let previousSelectedIndex = this.state.previousSelectedIndex;
            if (previousSelected === '') {
                this.setState({
                    previousSelected: orderCycleType,
                    previousSelectedIndex: parentIndex
                })
            } else {
                if (data[orderCycleType].category[parentIndex].subCategories[childIndex].isSelectedByUser) {

                    data[previousSelected].category.forEach(function (parentLevel, index) {
                        let isNotRemove = false;
                        if (previousSelected === orderCycleType) {
                            if (previousSelectedIndex === parentIndex || parentIndex === index) {
                                isNotRemove = true;
                            }
                        }
                        if (!isNotRemove) {
                            parentLevel.isSelectedByUser = false;
                            parentLevel.subCategories.forEach(function (value) {
                                value.isSelectedByUser = false;
                            });
                        }
                    });
                    //  data[orderCycleType].category[parentIndex].isSelectedByUser=true;
                    this.setState({
                        previousSelected: orderCycleType,
                        previousSelectedIndex: parentIndex
                    })
                } else {
                    let countSel = 0;
                    data[previousSelected].category[parentIndex].subCategories.forEach(function (value) {
                        if (value && value.isSelectedByUser) {
                            countSel++;
                        }
                    });
                    if (countSel === 0) {
                        this.setState({
                            previousSelected: '',
                            previousSelectedIndex: null
                        })
                    }
                }
            }
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
                this.setState({
                    reportingVendorDetails: data
                });

            } else {
                this.setState({
                    reportingCategoryDetails: data
                });
            }
        }

        onChangeChildChkBox = (index, childIndex, orderCycleType) => {
            let { reportingCategoryDetails } = this.state;

            if (orderCycleType === DSD || orderCycleType === CDC) {
                reportingCategoryDetails = this.state.reportingVendorDetails
            }
            if (!reportingCategoryDetails[orderCycleType].category[index].subCategories[childIndex].hasOwnProperty("isSelectedByUser")) {
                reportingCategoryDetails[orderCycleType].category[index].subCategories[childIndex].isSelectedByUser = true;
                if ((orderCycleType === DSD) || (orderCycleType === CDC)) {
                    this.setState({
                        reportingVendorDetails: reportingCategoryDetails
                    }, () => {
                        this.checkAllChildsSelected(index, reportingCategoryDetails, orderCycleType, childIndex);
                    });
                } else {
                    this.setState({
                        reportingCategoryDetails: reportingCategoryDetails
                    }, () => {
                        this.checkAllChildsSelected(index, reportingCategoryDetails, orderCycleType, childIndex);
                    });
                }

            } else {
                reportingCategoryDetails[orderCycleType].category[index].subCategories[childIndex].isSelectedByUser = !reportingCategoryDetails[orderCycleType].category[index].subCategories[childIndex].isSelectedByUser;
                if ((orderCycleType === DSD) || (orderCycleType === CDC)) {
                    this.setState({
                        reportingVendorDetails: reportingCategoryDetails
                    }, () => {
                        this.checkAllChildsSelected(index, reportingCategoryDetails, orderCycleType, childIndex);
                    });
                } else {
                    this.setState({
                        reportingCategoryDetails: reportingCategoryDetails
                    }, () => {
                        this.checkAllChildsSelected(index, reportingCategoryDetails, orderCycleType, childIndex);
                    });
                }
            }
            setTimeout(() => {
                this.setContinueButton();
            }, 100)
        }

        parentCollapse() {
            const THIS = this;
            this.setState({
                parentCollapse: !this.state.parentCollapse
            }, () => {
                THIS.state.reportingCategoryDetails.singleDay.category.forEach(function (category) {
                    category.isExpanded = !THIS.state.parentCollapse
                });
                THIS.state.reportingCategoryDetails.multiDay.category.forEach(function (category) {
                    category.isExpanded = !THIS.state.parentCollapse
                });
                THIS.state.reportingCategoryDetails.nonDaily.category.forEach(function (category) {
                    category.isExpanded = !THIS.state.parentCollapse
                });
                THIS.state.reportingVendorDetails.CDC.category.forEach(function (category) {
                    category.isExpanded = !THIS.state.parentCollapse
                });
                THIS.state.reportingVendorDetails.DSD.category.forEach(function (category) {
                    category.isExpanded = !THIS.state.parentCollapse
                });
                THIS.setState({
                    reportingCategoryDetails: THIS.state.reportingCategoryDetails,
                    reportingVendorDetails: THIS.state.reportingVendorDetails
                });
            })
        }

        convertToLowerCase(category) {
            return category ? category.toLowerCase() : '';
        }

    render() {

        const { reportingCategoryDetails, orderCycles, orderByVendor, reportingVendorDetails } = this.state;
        const THIS = this;

        return (
            <div className="reportingCategories cat-table-resize">
                <table className="cat-table-header">
                    <thead>
                        <tr className="row text-left">
                            <th className="col-11 cat-header-text text-left" scope="col" >
                                <div className="reporting-cat-header">
                                    <span className="bold">{orderByVendor ? "Vendor" : "Group,"}</span>{orderByVendor ? "" : " Category"}
                                </div>
                            </th>
                            <th className="left-border left-border-none  col-12 col-sm-12 col-md-1 cat-header-text"> <i onClick={() => this.parentCollapse()} className={this.state.parentCollapse === false ? 'fa fa-angle-up cat-arrow' : 'fa fa-angle-down cat-arrow'}></i></th>
                        </tr>
                    </thead>
                </table>
                <div className="reporting-cat-table">
                    {!orderByVendor && orderCycles.includes(SINGLE_DAY) && reportingCategoryDetails && reportingCategoryDetails.singleDay && reportingCategoryDetails.singleDay.category && reportingCategoryDetails.singleDay.category.length > 0 &&

                        reportingCategoryDetails.singleDay.category.map((category, categoryIndex) => {
                            return (
                                <table key={categoryIndex} >
                                    <thead className='container'>
                                        <tr className="row cat-border-bottom cat-text text-left" key={categoryIndex}>
                                            <td className="col-md-11 text-left coloring-stripe-Singleday" data-label="Group,Category">
                                                <label id={`single-day-cat-${categoryIndex}`} className="group-checkbox"> {this.convertToLowerCase(category.orderGroupCodeName)}
                                                    <input type="checkbox" onClick={() => THIS.onChangeParentChkBox(categoryIndex, SINGLE_DAY)}
                                                        checked={category.isSelectedByUser ? category.isSelectedByUser : false}
                                                        name={`single-day-cat-${categoryIndex}`} value={`s-${categoryIndex}`} onChange={() => THIS.render()} />
                                                    <span className="group-checkmark"></span>
                                                </label>
                                            </td>
                                            <td className="col-md-1 text-right"> <i onClick={() => this.categoryCollapse(categoryIndex, SINGLE_DAY)}
                                                className={category.hasOwnProperty("isExpanded") && category.isExpanded === false ? 'fa fa-angle-down cat-arrow2' :
                                                    'fa fa-angle-up cat-arrow2'}></i></td>
                                        </tr>
                                    </thead>
                                    {category.subCategories && category.subCategories.length > 0 && (category.hasOwnProperty("isExpanded") ? category.isExpanded : true) && category.subCategories.map((subCategory, subCategoryIndex) => {

                                        return (
                                            <tbody key={subCategoryIndex}>
                                                <tr className="row cat-border-bottom sub-cat-text" key={subCategoryIndex}>
                                                    <td className="col-12 col-md-12 text-left" data-label="Group,Category">
                                                        <label id={`single-day-sub-cat-${subCategoryIndex}`} className="category-checkbox"> {this.convertToLowerCase(subCategory.psaDescription)}
                                                            <input type="checkbox" onClick={() => THIS.onChangeChildChkBox(categoryIndex, subCategoryIndex, SINGLE_DAY)} checked={subCategory.isSelectedByUser ? subCategory.isSelectedByUser : false} name={`single-day-sub-cat-${subCategoryIndex}`} value={`s-${categoryIndex}`} onChange={() => THIS.render()} />
                                                            <span className="category-checkmark"></span>
                                                        </label>
                                                    </td>
                                                </tr>
                                            </tbody>);
                                    })}
                                </table>
                            );
                        })
                    }

                    {!orderByVendor && orderCycles.includes(MULTI_DAY) && reportingCategoryDetails.multiDay && reportingCategoryDetails.multiDay.category && reportingCategoryDetails.multiDay.category.length > 0 &&

                        reportingCategoryDetails.multiDay.category.map((category, categoryIndex) => {
                            return (
                                <table key={categoryIndex}>
                                    <thead>
                                        <tr className="row cat-border-bottom cat-text text-left" key={categoryIndex}>
                                            <td className="col-3 col-sm-5 col-md-11 coloring-stripe-Multiday text-left" data-label="Group,Category">
                                                <label id={`multi-day-cat-${categoryIndex}`} className="group-checkbox"> {this.convertToLowerCase(category.orderGroupCodeName)}
                                                    <input type="checkbox" onClick={() => THIS.onChangeParentChkBox(categoryIndex, MULTI_DAY)} checked={category.isSelectedByUser ? category.isSelectedByUser : false} name={`multi-day-cat-${categoryIndex}`} value={`m-${categoryIndex}`} onChange={() => THIS.render()} />
                                                    <span className="group-checkmark"></span>
                                                </label>
                                            </td>
                                            <td className="col-1 col-sm-1 col-md-1"> <i onClick={() => this.categoryCollapse(categoryIndex, MULTI_DAY)} className={category.hasOwnProperty("isExpanded") && category.isExpanded === false ? 'fa fa-angle-down cat-arrow2' : 'fa fa-angle-up cat-arrow2'}></i></td>
                                        </tr>
                                    </thead>
                                    {category.subCategories && category.subCategories.length > 0 && (category.hasOwnProperty("isExpanded") ? category.isExpanded : true) && category.subCategories.map((subCategory, subCategoryIndex) => {

                                        return (
                                            <tbody key={subCategoryIndex} >
                                                <tr className="row cat-border-bottom sub-cat-text" key={subCategoryIndex}>
                                                    <td className="col-5 col-sm-5 col-md-12 text-left" data-label="Group,Category">
                                                        <label id={`multi-day-sub-cat-${subCategoryIndex}`} className="category-checkbox"> {this.convertToLowerCase(subCategory.psaDescription)}
                                                            <input type="checkbox" onClick={() => THIS.onChangeChildChkBox(categoryIndex, subCategoryIndex, MULTI_DAY)} checked={subCategory.isSelectedByUser ? subCategory.isSelectedByUser : false} name={`multi-day-sub-cat-${subCategoryIndex}`} value={`m-${categoryIndex}`} onChange={() => THIS.render()} />
                                                            <span className="category-checkmark"></span>
                                                        </label>
                                                    </td>
                                                </tr>
                                            </tbody>);
                                    })}
                                </table>
                            );
                        })
                    }

                    {!orderByVendor && orderCycles.includes(NON_DAILY) && reportingCategoryDetails.nonDaily && reportingCategoryDetails.nonDaily.category && reportingCategoryDetails.nonDaily.category.length > 0 &&

                        reportingCategoryDetails.nonDaily.category.map((category, categoryIndex) => {
                            return (
                                <table key={categoryIndex}>
                                    <thead>
                                        <tr className="row cat-border-bottom cat-text text-left" key={categoryIndex}>
                                            <td className="col-md-11 coloring-stripe-Nondaily text-left" data-label="Group,Category">
                                                <label id={`non-daily-cat-${categoryIndex}`} className="group-checkbox"> {this.convertToLowerCase(category.orderGroupCodeName)}
                                                    <input type="checkbox" onClick={() => THIS.onChangeParentChkBox(categoryIndex, NON_DAILY)} checked={category.isSelectedByUser ? category.isSelectedByUser : false} name={`non-daily-cat-${categoryIndex}`} value={`n-${categoryIndex}`} onChange={() => THIS.render()} />
                                                    <span className="group-checkmark"></span>
                                                </label>
                                            </td>
                                            <td className="col-1 col-sm-1 col-md-1"> <i onClick={() => this.categoryCollapse(categoryIndex, NON_DAILY)} className={category.hasOwnProperty("isExpanded") && category.isExpanded === false ? 'fa fa-angle-down cat-arrow2' : 'fa fa-angle-up cat-arrow2'}></i></td>
                                        </tr>
                                    </thead>
                                    {category.subCategories && category.subCategories.length > 0 && (category.hasOwnProperty("isExpanded") ? category.isExpanded : true) && category.subCategories.map((subCategory, subCategoryIndex) => {
                                        return (
                                            <tbody key={subCategoryIndex} >
                                                <tr className="row cat-border-bottom sub-cat-text" key={subCategoryIndex}>
                                                    <td className="col-5 col-sm-5 col-md-12 text-left" data-label="Group,Category">
                                                        <label id={`non-daily-sub-cat-${subCategoryIndex}`} className="category-checkbox"> {this.convertToLowerCase(subCategory.psaDescription)}
                                                            <input type="checkbox" onClick={() => THIS.onChangeChildChkBox(categoryIndex, subCategoryIndex, NON_DAILY)} checked={subCategory.isSelectedByUser ? subCategory.isSelectedByUser : false} name={`non-daily-sub-cat-${subCategoryIndex}`} value={`n-${categoryIndex}`} onChange={() => THIS.render()} />
                                                            <span className="category-checkmark"></span>
                                                        </label>
                                                    </td>
                                                </tr>
                                            </tbody>);
                                    })}
                                </table>
                            );
                        })
                    }

                    {
                        orderByVendor && reportingVendorDetails.CDC && reportingVendorDetails.CDC.category && reportingVendorDetails.CDC.category.length > 0 &&
                        reportingVendorDetails.CDC.category.map((category, categoryIndex) => {

                            return (
                                <table key={categoryIndex}>
                                    <thead>
                                        <tr className="row cat-border-bottom cat-text text-left" key={categoryIndex}>
                                            <td className="col-md-11 coloring-stripe-Nondaily text-left" data-label="Group,Category">
                                                <label id={`non-daily-cat-${categoryIndex}`} className="group-checkbox">CDC - {this.convertToLowerCase(category.orderGroupCodeName)}
                                                    <input type="checkbox" onClick={() => THIS.onChangeParentChkBox(categoryIndex, CDC)} checked={category.isSelectedByUser ? category.isSelectedByUser : false} name={`non-daily-cat-${categoryIndex}`} value={`n-${categoryIndex}`} onChange={() => THIS.render()} />
                                                    <span className="group-checkmark"></span>
                                                </label>
                                            </td>
                                            <td className="col-1 col-sm-1 col-md-1"> <i onClick={() => this.categoryCollapse(categoryIndex, CDC)} className={category.hasOwnProperty("isExpanded") && category.isExpanded === false ? 'fa fa-angle-down cat-arrow2' : 'fa fa-angle-up cat-arrow2'}></i></td>
                                        </tr>
                                    </thead>
                                    {category.subCategories && category.subCategories.length > 0 && (category.hasOwnProperty("isExpanded") ? category.isExpanded : true) && category.subCategories.map((subCategory, subCategoryIndex) => {

                                        return (
                                            <tbody key={subCategoryIndex} >
                                                <tr className="row cat-border-bottom sub-cat-text" key={subCategoryIndex}>
                                                    <td className="col-5 col-sm-5 col-md-12 text-left" data-label="Group,Category">
                                                        <label id={`non-daily-sub-cat-${subCategoryIndex}`} className="category-checkbox"> {this.convertToLowerCase(subCategory.psaDescription)}
                                                            <input type="checkbox" onClick={() => THIS.onChangeChildChkBox(categoryIndex, subCategoryIndex, CDC)} checked={subCategory.isSelectedByUser ? subCategory.isSelectedByUser : false} name={`non-daily-sub-cat-${subCategoryIndex}`} value={`n-${categoryIndex}`} onChange={() => THIS.render()} />
                                                            <span className="category-checkmark"></span>
                                                        </label>
                                                    </td>
                                                </tr>
                                            </tbody>);
                                    })}

                                </table>
                            );
                        })
                    }

                    {orderByVendor && reportingVendorDetails.DSD && reportingVendorDetails.DSD.category && reportingVendorDetails.DSD.category.length > 0 &&

                        reportingVendorDetails.DSD.category.map((category, categoryIndex) => {
                            return (
                                <table key={categoryIndex}>
                                    <thead>
                                        <tr className="row cat-border-bottom cat-text text-left" key={categoryIndex}>
                                            <td className="col-5 col-sm-5 col-md-12 coloring-stripe-Nondaily text-left" data-label="Group,Category">
                                                <label id={`non-daily-cat-${categoryIndex}`} className="group-checkbox"> DSD - {category.orderGroupCodeName}
                                                    <input type="checkbox" onClick={() => THIS.onChangeParentChkBox(categoryIndex, DSD)} checked={category.isSelectedByUser ? category.isSelectedByUser : false} name={`non-daily-cat-${categoryIndex}`} value={`n-${categoryIndex}`} onChange={() => THIS.render()} />
                                                    <span className="group-checkmark"></span>
                                                </label>
                                            </td>
                                        </tr>
                                    </thead>
                                </table>
                            );
                        })
                    }

                    {
                        !orderByVendor && reportingCategoryDetails && (reportingCategoryDetails.singleDay || reportingCategoryDetails.multiDay || reportingCategoryDetails.nonDaily) && (reportingCategoryDetails.singleDay.category.length === 0 && reportingCategoryDetails.multiDay.category.length === 0 && reportingCategoryDetails.nonDaily.category.length === 0) ?
                            <span className="reporting-no-data-indicator no-data-indicator">No Data Available</span>
                            : null
                    }

                    {
                        orderByVendor && reportingVendorDetails && (reportingVendorDetails.CDC || reportingVendorDetails.DSD) && (reportingVendorDetails.CDC.category.length === 0 && reportingVendorDetails.DSD.category.length === 0) ?
                            <span className="reporting-no-data-indicator no-data-indicator">No Data Available</span>
                            : null
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return ({
        reportingVendorDetails: state.reporting && state.reporting.reportingData && state.reporting.reportingData.reportingVendorDetails && state.reporting.reportingData.reportingVendorDetails ? state.reporting.reportingData.reportingVendorDetails : {},
        reportingCategoryDetails: state.reporting && state.reporting.reportingData && state.reporting.reportingData.reportingDetails ? state.reporting.reportingData.reportingDetails : {},
    });
}
export default connect(
    mapStateToProps
)(ReportingCategories)
