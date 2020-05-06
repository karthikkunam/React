import React from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';
// import PropTypes from 'prop-types';
import './SideNavBar.css';
// import LandingIcon from '../../assets/images/ordering-landing.png';
import LandingIcon from '../../assets/images/ISP-Home.png';
import MessageBox from './MessageBox';
import { UNSAVED_MSG_TITLE, UNSAVED_MSG_BODY } from '../utility/constants';
import { singleDay, multiDay, nonDaily } from '../../constants/ActionTypes';
import { storeDetails } from '../../lib/storeDetails'

export class SideNavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            msgTitle: '',
            msgBody: '',
            modifiedItems: [],
            toggleSideNavActions: false,
            userSelectedItems: '',
            totalItemCount: '',
            environment: storeDetails() && storeDetails().environment,
            version: storeDetails() && storeDetails().version,
        }
    }

    componentDidMount() {
        this.setState({
            modifiedItems: this.props.modifiedItems
        });
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            modifiedItems: newProps.modifiedItems
        });
    }

    modalAction = (showModal) => {
        this.setState({ showModal: showModal }, () => {
            setTimeout(() => {
                let defaultButton = document.getElementById("btn-sideNav-stay-on-ordering");
                if (defaultButton) {
                    defaultButton.focus();
                }
            }, 100);
        })
    }

    navigateISPHome = () => {
        // const { modifiedItems } = this.state;
        // if( modifiedItems && modifiedItems.length > 0){
        //     this.setState({
        //         showModal: true,
        //         ...this.getBodyTitle()
        //     });
        // } else{
        //     this.props.history.push('home');
        // }
        if (this.props.selectedLink === 'ItemDetail') {
            this.setState({
                showModal: true,
                ...this.getBodyTitle()
            });
        } else if (this.props.location && this.props.location.pathname === "/GR") {
            this.props.onHome();
        } else {
            this.props.history.push('/home');
        }
    };

    getBodyTitle() {
        let userSelectedItems = [];
        let emptyList = [];
        const { selectedLink } = this.props;
        if (this.props.currentOrderCycleType === singleDay) {
            this.props.itemsByOrderCycle[singleDay].forEach(function (data) {
                if ((data.untransmittedOrderQty === undefined || data.untransmittedOrderQty === null || data.untransmittedOrderQty === "") && !data.isStoreOrderBlocked) {
                    emptyList.push(data);
                } else {
                    if (!data.isStoreOrderBlocked) {
                        userSelectedItems.push(data);
                    }
                }
            });
        } else if (this.props.currentOrderCycleType === multiDay) {
            this.props.itemsByOrderCycle[multiDay].forEach(function (data) {
                if ((data.untransmittedOrderQty === undefined || data.untransmittedOrderQty === null || data.untransmittedOrderQty === "") && !data.isStoreOrderBlocked) {
                    emptyList.push(data);
                } else {
                    if (!data.isStoreOrderBlocked) {
                        userSelectedItems.push(data);
                    }
                }
            });
        } else if (this.props.currentOrderCycleType === nonDaily) {
            this.props.itemsByOrderCycle[nonDaily].forEach(function (data) {
                if ((data.untransmittedOrderQty === undefined || data.untransmittedOrderQty === null || data.untransmittedOrderQty === "") && !data.isStoreOrderBlocked) {
                    emptyList.push(data);
                } else {
                    if (!data.isStoreOrderBlocked) {
                        userSelectedItems.push(data);
                    }
                }
            });
        } else {
            return []
        }

        const total = userSelectedItems.length + emptyList.length;
        if (selectedLink === 'ItemDetail' && emptyList.length > 0) {
            return {
                msgTitle: 'ORDER INCOMPLETE',
                msgBody: `Are you sure you want to exit? ${emptyList.length} out of the total ${total} have not been ordered.`,
                toggleSideNavActions: true,
            }
        }
        return {
            msgTitle: UNSAVED_MSG_TITLE,
            msgBody: UNSAVED_MSG_BODY,
            toggleSideNavActions: false,
        }
    }

    getVersion() {
        let clientVersion;
        const defaultClientVersion = 'UNKNOWN';
        if (!this.state.version) {
            clientVersion = defaultClientVersion;
        } else {
            clientVersion = this.state.version
        }
        return clientVersion;
    }

    getEnvironment() {
        let envrionment;
        const defaultEnvironemnt = 'Unavailable';
        if (!this.state.environment) {
            envrionment = defaultEnvironemnt
        } else {
            envrionment = this.state.environment;
        }
        return envrionment;
    }

    render() {
        const { showModal, msgTitle, msgBody, toggleSideNavActions } = this.state;
        return (
            <Tabs defaultTab="vertical-tab-one" vertical>
                <TabList className="d-none d-sm-block">
                    <Tab tabFor="vertical-tab-one">
                        <img className="img-landing" onClick={this.navigateISPHome} src={LandingIcon} alt={"img-landing"} />
                    </Tab>
                    <Tab tabFor="vertical-tab-one" className="version-text">
                        7BOSS
                                <br />
                        v{this.getVersion()}
                        <br />
                        {this.getEnvironment()}
                    </Tab>
                </TabList>
                <TabPanel tabId="vertical-tab-one">
                    {this.props.children}
                </TabPanel>
                {showModal &&
                    <MessageBox
                        sideNav={true}
                        initialModalState={false}
                        className={"message-box"}
                        msgTitle={msgTitle}
                        msgBody={msgBody}
                        modalAction={this.modalAction}
                        toggleSideNavActions={toggleSideNavActions}
                    />
                }
            </Tabs>
        );
    }
}
const mapStateToProps = state => {
    return ({
        itemsByOrderCycle: state.ordering.getItemDetailsForSelectedCategory && state.ordering.getItemDetailsForSelectedCategory ? state.ordering.getItemDetailsForSelectedCategory : {},
        currentOrderCycleType: state.ordering && state.ordering.currentOrderCycleType && state.ordering.currentOrderCycleType.payload && state.ordering.currentOrderCycleType.payload.orderCycleType ? state.ordering.currentOrderCycleType.payload.orderCycleType : {},
        modifiedItems: state && state.ordering && state.ordering.modifiedItems,
        items: state.ordering.getItemDetailsForSelectedCategory ? state.ordering.getItemDetailsForSelectedCategory : {},
        selectedLink: state.ordering.orderingSelectedLink && state.ordering.orderingSelectedLink.payload && state.ordering.orderingSelectedLink.payload.selectedLink ? state.ordering.orderingSelectedLink.payload.selectedLink : 'Ordering',
        checkCategories: state.ordering.orderingContiueButton.payload && state.ordering.orderingContiueButton.payload.checkCategories ? state.ordering.orderingContiueButton.payload.checkCategories : [],
    });
};
export default connect(
    mapStateToProps
)(withRouter(SideNavBar))
