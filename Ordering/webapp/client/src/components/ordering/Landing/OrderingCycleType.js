import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { orderingSelectedLink } from '../../../actions';
import * as constants from '../../../constants/ActionTypes';
import './OrderingCycleType.css';
import './OrderingCategories.css';
class OrderingCycleType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      availableCount: 19,
      remainingCount: 0,
      selectedOrderCycle: ["singleDay", "multiDay", "nonDaily"],
      orderingCategoryDetails: [],
      isCarried: true,
      orderByVendor: false,
      orderRemainingItems: true
    }
    this.toggleRef = React.createRef();
  }

  componentDidMount() {
    this.setState({
      selectedOrderCycle: this.props.selectedOrderCycle && this.props.selectedOrderCycle.length === 0 ? ["singleDay", "multiDay", "nonDaily"] : this.props.selectedOrderCycle,
      orderingCategoryDetails: this.props.orderingCategoryDetails,
      isCarried: this.props.isCarried,
    });
  }

  componentWillMount(){
    this.props.history.push({
      search: '?sort=viewbygroup'
    });
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      orderingCategoryDetails: newProps.orderingCategoryDetails,
      isCarried: newProps.isCarried,
      selectedOrderCycle: newProps.selectedOrderCycle,
    })
  }

  onChange(e) {
    let selectedOrderCycle = this.state.selectedOrderCycle
    let index;
    if (e.target.checked) {
      selectedOrderCycle.push(e.target.value)
    } else {
      index = selectedOrderCycle.indexOf(e.target.value)
      selectedOrderCycle.splice(index, 1)
    }
    this.setState({ selectedOrderCycle: selectedOrderCycle },()=>{
      this.props.selectedOrderCycleFunction(selectedOrderCycle);
    });
  }

  onClickGuidedReplenishment = () => {
    this.props.history.push(`/GR`);
    this.props.dispatch(orderingSelectedLink({
      selectedLink: 'GR'
    }));
  }

  isDisabled = () => {
    return !(this.state.selectedOrderCycle && this.state.selectedOrderCycle.includes('nonDaily'))
  }

  toggler = (isSelected) => {
    this.props.toggler(isSelected);
    this.setState({orderRemainingItems: isSelected})
  }
  carriedChanged(selection) {
    this.setState({ isCarried: selection === "Carried" ? true : false }, () => {
      this.props.isCarriedFunction(this.state.isCarried);

    })
  }
  onClickOrderByVendor() {
    this.setState({ orderByVendor: !this.state.orderByVendor },()=>{
      const { orderByVendor } = this.state
      this.props.orderByVendorFunction(orderByVendor);
      this.props.history.push({
        search: `?sort=${orderByVendor ? 'viewbyvendor' : 'viewbygroup'}`
      });
    });
  }

  render() {
    const { orderingCategoryDetails, isCarried, selectedOrderCycle, orderByVendor } = this.state;

    return (
      <div className="orderingCycle">
        <div className="rowXX d-none d-sm-block d-sm-none d-md-block">
          <button id="gr-recap"
            type="button"
            className="btn guided gr-recapHover"
            onClick={this.onClickGuidedReplenishment}

          >Guided Replenishment Recap
                  <i className='fa fa-angle-right arrow'></i>
          </button>
        </div>
        <div className="col-12 no-padding col-md-none col-lg-none  d-md-none d-lg-none">
          <div className="box guided card-block guided-box" onClick={this.onClickGuidedReplenishment}>
            <span
              className="cycleType"
              id="gr-recap"
            >
              Guided Replenishment Recap
                            </span>
            <i className='fa fa-angle-right arrow float-right'></i>
          </div>
        </div>
        <div className="row cycles">
          <div className="col-md-4 no-padding">
            <div className="card-block box p-2 coloring-stripe-Singleday">
              <div className="cycleType">
                <label className="cat-container" > Daily
                                    <input type="checkbox"
                    name="singleDay"
                    value="singleDay"
                    onChange={this.onChange.bind(this)}
                    checked={selectedOrderCycle && selectedOrderCycle.includes(constants.SINGLE_DAY) ? true : false}
                  />
                  <span className="cat-checkmark"></span>
                  <span className="items-left left-to-Order">
                    <p id="daily-count" className="items-cycle-type">{orderingCategoryDetails && orderingCategoryDetails.singleDay ? isCarried ? orderingCategoryDetails.singleDay.Carried.OrderCount.toString() + '/' + orderingCategoryDetails.singleDay.Carried.itemCounts.toString() : orderingCategoryDetails.singleDay.All.OrderCount.toString() + '/' + orderingCategoryDetails.singleDay.All.itemCounts.toString() : '0/0'} left to order
                                        </p>
                  </span>
                </label>
              </div>
            </div>
          </div>
          <div className="col-md-4 no-padding">
            <div className="card-block box p-2 coloring-stripe-Multiday">
              <div className="cycleType">
                <label className="cat-container"> Multi Day
                                <input
                    type="checkbox"
                    name="multiDay"
                    value="multiDay"
                    onChange={this.onChange.bind(this)}
                    checked={selectedOrderCycle && selectedOrderCycle.includes(constants.MULTI_DAY) ? true : false} />
                  <span className="cat-checkmark"></span>
                  <span className="items-left left-to-Order">
                    <p id="multiday-count" className="items-cycle-type">{orderingCategoryDetails && orderingCategoryDetails.multiDay ? isCarried ? orderingCategoryDetails.multiDay.Carried.OrderCount.toString() + '/' + orderingCategoryDetails.multiDay.Carried.itemCounts.toString() : orderingCategoryDetails.multiDay.All.OrderCount.toString() + '/' + orderingCategoryDetails.multiDay.All.itemCounts.toString() : '0/0'} left to order
                                    </p>
                  </span>
                </label>
              </div>
            </div>
          </div>
          <div className="col-md-4 no-padding">
            <div className="card-block box p-2 coloring-stripe-Nondaily">
              <div className="cycleType">
                <label className="cat-container"> Non-daily
                                    <input
                    type="checkbox"
                    name="nonDaily"
                    value="nonDaily"
                    disabled = { orderByVendor ? true: false}
                    onChange={this.onChange.bind(this)}
                    checked={selectedOrderCycle && selectedOrderCycle.includes(constants.NON_DAILY) ? true : false} />
                  <span className="cat-checkmark"></span>
                  <span className="items-left left-to-Order">
                    <p id="nondaily-count" className="items-cycle-type">{orderingCategoryDetails && orderingCategoryDetails.nonDaily ? isCarried ? orderingCategoryDetails.nonDaily.Carried.OrderCount.toString() + '/' + orderingCategoryDetails.nonDaily.Carried.itemCounts.toString() : orderingCategoryDetails.nonDaily.All.OrderCount.toString() + '/' + orderingCategoryDetails.nonDaily.All.itemCounts.toString() : '0/0'} left to order
                                        </p>
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="row hide-for-mobile">
          <div className="col-md-4 mt-3 rmv-order-padding">
            <button ref={this.toggleRef} id="order-by-vendor" type="button" className="btn btn-vendor" onClick={()=> this.onClickOrderByVendor()} disabled={this.isDisabled()}> {this.state.orderByVendor ? 'ORDER BY GROUP' : "ORDER BY VENDOR"}</button>
          </div>
          {/* <div className="col-md-4 mt-3 rmv-order-padding">
            <div className="toggle-wrapper">
              <div className="Order-remaining-item">Order remaining items only?</div>
              <div className="toggle-align"><ToggleButton toggler={this.toggler} isSelected={orderRemainingItems} /></div>
            </div>
          </div> */}
          <div className="col-md-8 Select-Items-to-Order right-padding mt-3 rmv-order-padding">
            <div className="toggle-wrapper">
              <span className="float-right left-padding cusOrdSelect">
                <label className="order-remaining-item">Carried</label>
                <span className="table-margin spacer"></span>
                <input type="radio" id="carried-desktop" checked={this.state.isCarried} name="radio" onChange={() => this.render()} />
                <label id="Carried-desktop" htmlFor="carried-desktop" onClick={() => this.carriedChanged('Carried')}><span></span></label>
                <span className="table-margin spacer"></span>
                <label className="order-remaining-item">All</label>
                <span className="table-margin spacer"></span>
                <input type="radio" id="all-desktop" checked={!this.state.isCarried} onChange={() => { this.render() }} name="radio2" />
                <label id="All-desktop" htmlFor="all-desktop" onClick={() => this.carriedChanged('All')}><span></span>
                </label>
              </span>
              <span className="float-left" > Select Items to order:</span>
            </div>
          </div>
        </div>

        <div className="hide-for-desktop details-container">
          <div className="Select-Items-to-Order">
            <span> Select Items to order:&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <label className="order-remaining-item-CA label-left">Carried</label>
            <span className="table-margin"></span>
            <input type="radio" id="carried-mob" checked={this.state.isCarried} onChange={() => { this.render() }} name="radio03" />
            <label id="Carried-mob" htmlFor="carried-mob" onClick={() => this.carriedChanged('Carried')}><span></span></label>
            <span className="table-margin"></span>
            <label className="order-remaining-item-CA label-right">All</label>
            <span className="table-margin"></span>
            <input type="radio" id="all-mob" checked={!this.state.isCarried} onChange={() => { this.render() }} name="radio04" />
            <label id="All-mob" htmlFor="all-mob" onClick={() => this.carriedChanged('All')}><span></span>
            </label>
          </div>

          <div className="btn-vendor-wrapper">
            <button ref={this.toggleRef} type="button" className="btn btn-vendor" onClick={()=> this.onClickOrderByVendor()} disabled={this.isDisabled()}>{this.state.orderByVendor ? 'GROUP' : "VENDOR"}</button>
          </div>
          {/* <div className="order-remaining">
            <span className="Order-remaining-item">Order remaining items only?</span>
            <ToggleButton toggler={this.toggler} isSelected={orderRemainingItems} />
          </div> */}
        </div>
      </div>
    );
  }
}


const mapStateToProps = state => {
  return ({
    orderingCategoryDetails: state.ordering.getOrderingCategoryDetails.payload ? state.ordering.getOrderingCategoryDetails.payload : '',
  });
}

export default connect(
  mapStateToProps
)(withRouter(OrderingCycleType))
