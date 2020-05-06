import React from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import './MessageBox.css';
import { connect } from 'react-redux';
import { postOrderDetails, orderingSelectedLink } from '../../actions';
import { withRouter } from 'react-router-dom';
// import constants from 'jest-haste-map/build/constants';

class MessageBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: props.initialModalState,
      msgTitle: props.msgTitle || '',
      msgBody: props.msgBody || '',
      showModal: props.showModal,
      orderMinMax: props.orderMinMax,
      reviewFinalizePage: props.reviewFinalizePage,
      sideNav: props.sideNav,
      homePage: props.homePage,
      LDUMin: props.LDUMin,
      LDUMax: props.LDUMax,
      index: props.index,
      cIndex: props.cIndex,
      grPage: props.grPage,
      grPageOnHome: props.grPageOnHome,
      LDUBox: props.LDUBox,
      reporting: props.reporting,
      NoDataModal: props.NoDataModal,
      orderingCutoffTime: props.orderingCutoffTime,
      savedQntyModal: props.savedQntyModal,
      previousSelectionVal: props.previousSelectionVal,
      defaultSelectionVal: props.defaultSelectionVal,
      toggleSideNavActions: false,
      itemDetailPrevious: props.itemDetailPrevious

    }
    this.performSaveAction = this.performSaveAction.bind(this);
    this.reviewPageExit = this.reviewPageExit.bind(this);
    this.lduMinOrderQnty = this.lduMinOrderQnty.bind(this);
    this.lduMaxOrderQnty = this.lduMaxOrderQnty.bind(this);
    this.grPageExit = this.grPageExit.bind(this);
    this.previousSelectionQnty = this.previousSelectionQnty.bind(this);
    this.defaultSelectionQnty = this.defaultSelectionQnty.bind(this);
    this.stayOnItemPage = this.stayOnItemPage.bind(this);
    this.itmPageExit = this.itmPageExit.bind(this);
    this.toggle = this.toggle.bind(this);

  }

  componentDidMount() {
    this.setState({
      loginData: this.props.loginData,
      modifiedItems: this.props.modifiedItems
    })
    this.toggle();
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      loginData: newProps.loginData,
      modifiedItems: newProps.modifiedItems
    })
  }

  toggle() {
    const { index, cIndex } = this.state;
    this.setState(prevState => ({
      modal: !prevState.modal
    }), () => {
      if (this.props.modalAction) {
        this.props.modalAction(this.state.modal, index, cIndex);
      }
    });
  }

  performSaveAction() {
    const THIS = this;
    try {
      THIS.props.dispatch(postOrderDetails({
        Items: this.state.modifiedItems,
        storeId: this.state.loginData.storeId
      })).then(() => {
        this.toggle();
        if (this.props.executePreviousAction) {
          this.props.executePreviousAction();
        } else {
          this.props.history.push('/home');
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  orderingPrevious = ()=> {
    try {
        this.toggle();
        if (this.props.executePreviousAction) {
          this.props.executePreviousAction();
        } else {
          this.props.history.push('/landing');
        }
    } catch (err) {
      console.log(err);
    }
  }

  stayOnItemPage() {
    const THIS = this;
    try {
      THIS.props.stayItemPg(true);
      THIS.toggle();
    }
    catch (err) {
      console.log(err);
    }
  }

  itmPageExit() {
    const THIS = this;
    try {
      THIS.props.extItemPg(false);
      THIS.toggle();
    }
    catch (err) {
      console.log(err);
    }
  }

  orderingPage = ()=> {
    const THIS = this;
    try {
      THIS.props.orderingPage(false);
      THIS.toggle();
    }
    catch (err) {
      console.log(err);
    }
  }

  reviewPageExit() {
    const THIS = this;
    try {
      THIS.props.dispatch(orderingSelectedLink({
        selectedLink: 'ItemDetail'
      })).then(() => this.toggle());
    }
    catch (err) {
      console.log(err);
    }
  }

  lduMinOrderQnty() {
    const THIS = this;
    const { LDUMin, index, cIndex } = this.state;
    try {
      THIS.props.lduMinOrderQntyChk(LDUMin, index, cIndex);
      THIS.toggle();
    }
    catch (err) {
      console.log(err);
    }
  }

  lduMaxOrderQnty() {
    const THIS = this;
    const { LDUMax, index, cIndex } = this.state;
    try {
      THIS.props.lduMaxOrderQntyChk(LDUMax, index, cIndex);
      THIS.toggle();
    }
    catch (err) {
      console.log(err);
    }
  }

  previousSelectionQnty() {
    const THIS = this;
    const { previousSelectionVal, index, cIndex } = this.state;
    try {
      THIS.props.previousSelectionChk(previousSelectionVal, index, cIndex);
      THIS.toggle();
    }
    catch (err) {
      console.log(err);
    }
  }

  defaultSelectionQnty() {
    const THIS = this;
    const { defaultSelectionVal, index, cIndex } = this.state;
    try {
      THIS.props.defaultSelectionChk(defaultSelectionVal, index, cIndex);
      THIS.toggle();
    }
    catch (err) {
      console.log(err);
    }
  }

  grPageExit() {
    const THIS = this;
    try {
      THIS.props.history.push('/landing');
    }
    catch (err) {
      console.log(err);
    }
  }

  grPageOnHome = () => {
    const THIS = this;
    try {
      THIS.props.history.push('/home');
    }
    catch (err) {
      console.log(err);
    }
  }
  
  render() {
    const { msgBody,
      orderMinMax,
      sideNav,
      reviewFinalizePage,
      homePage,
      LDUBox,
      LDUMin,
      LDUMax,
      grPage,
      grPageOnHome,
      reporting,
      orderingCutoffTime,
      savedQntyModal,
      previousSelectionVal,
      defaultSelectionVal,
      itemDetailPrevious,
      NoDataModal,
      msgTitle
    } = this.state;
    const { toggleSideNavActions } = this.props;
    return (
      <div className="message-box">
        <Modal
          show={this.state.showModal}
          isOpen={this.state.modal}
          toggle={this.toggle}
          centered={true}
          className={this.props.className}
          backdrop="static" >
          { msgTitle &&
          <ModalHeader >{msgTitle}</ModalHeader> 
          }  
          <ModalBody>
            {msgBody}
          </ModalBody>
          <ModalFooter>
            {
              sideNav &&
              <div className="msg-box-review-finalize">
                <Button id= "btn-sideNav-stay-on-ordering" className="btn btn-msg-box d-sm-block mg-review-margin-rt review-page-no" onClick={toggleSideNavActions ? this.toggle : this.toggle}>No, Stay On Page</Button>
                <Button className="btn btn-msg-box d-sm-block review-page-yes" onClick={toggleSideNavActions ? this.performSaveAction : this.performSaveAction}>Yes, Exit</Button>
              </div>
            }
            {
              itemDetailPrevious &&
              <div className="msg-box-review-finalize">
                <Button id= "btn-stay-on-ordering" className="btn btn-msg-box d-sm-block mg-review-margin-rt review-page-no" onClick={toggleSideNavActions ? this.stayOnItemPage :this.stayOnItemPage}>No, Stay On Page</Button>
                <Button className="btn btn-msg-box d-sm-block review-page-yes" onClick={ toggleSideNavActions ? this.orderingPrevious: this.orderingPage}>Yes, Exit</Button>
              </div>
            }
            {
              orderMinMax &&
              <Button
                id="orderMin"
                type="button"
                className="btn btn-msg-box d-sm-block msg-box-btn-align-center review-page-yes btn-close"
                onClick={this.toggle}>Close</Button>
            }
            {
              NoDataModal &&
              <Button
                id="orderMin"
                type="button"
                className="btn btn-msg-box d-sm-block msg-box-btn-align-center review-page-yes btn-close"
                onClick={this.toggle}>Close</Button>
            }
            {
              reviewFinalizePage &&
              <div className="msg-box-review-finalize review-finalize">
                <Button id= "btn-stay-on-orderingDetail" className="btn btn-msg-box d-sm-block mg-review-margin-rt review-page-no" onClick={this.stayOnItemPage}>No, Stay On Page</Button>
                <Button className="btn btn-msg-box d-sm-block review-page-yes-updated" onClick={this.itmPageExit}>Yes, Proceed</Button>
              </div>
            }
            {
              homePage &&
              <div className="message-box-ordering-unavailable">
                <Button
                  id="btn-close"
                  type="button"
                  className="btn btn-msg-box d-sm-block msg-box-btn-align-center review-page-yes btn-close"
                  onClick={this.toggle}>Close</Button>
              </div>
            }
            {
              savedQntyModal &&
              <div className="message-box-ldu three-buttons">
                <Button
                  id="btn-previous"
                  type="button"
                  className="btn btn-msg-box d-sm-block msg-box-btn-align-center mg-close-align mg-ldu"
                  onClick={this.previousSelectionQnty}>{previousSelectionVal}</Button>
                <Button
                  id="btn-default"
                  type="button"
                  className="btn btn-msg-box d-sm-block msg-box-btn-align-center mg-close-align mg-ldu"
                  onClick={this.defaultSelectionQnty}>{defaultSelectionVal}</Button>
                <Button
                  id="btn-cancel"
                  type="button"
                  className="btn btn-msg-box d-sm-block msg-box-btn-align-center mg-close-align mg-ldu"
                  onClick={this.toggle}>Cancel</Button>
              </div>
            }
            {
              LDUBox &&
              <div className="message-box-ldu three-buttons">
                <Button
                  id="btn-ldu-min"
                  type="button"
                  className="btn btn-msg-box d-sm-block msg-box-btn-align-center mg-close-align mg-ldu"
                  onClick={this.lduMinOrderQnty}>{LDUMin}</Button>
                <Button
                  id="btn-ldu-max"
                  type="button"
                  className="btn btn-msg-box d-sm-block msg-box-btn-align-center mg-close-align mg-ldu"
                  onClick={this.lduMaxOrderQnty}>{LDUMax}</Button>
                <Button
                  id="btn-ldu-cancel"
                  type="button"
                  className="btn btn-msg-box d-sm-block msg-box-btn-align-center mg-close-align mg-ldu"
                  onClick={this.toggle}>Cancel</Button>
              </div>
            }
            {grPage &&
              <div className="msg-box-review-finalize grRecap">
                <Button className="btn  btn-no d-none d-sm-block mg-review-margin-rt review-page-no" onClick={this.toggle}>No, Stay On Page</Button>
                <Button className="btn  btn-yes d-none d-sm-block  review-page-yes" onClick={this.grPageExit}>Yes, Exit</Button>
              </div>
            }
            {grPageOnHome &&
              <div className="msg-box-review-finalize grRecap">
                <Button className="btn btn-previous btn-no d-none d-sm-block mg-review-margin-rt review-page-no" onClick={this.toggle}>No, Stay On Page</Button>
                <Button className="btn btn-previous btn-yes d-none d-sm-block mg-review-margin-rt review-page-yes" onClick={this.grPageOnHome}>Yes, Exit</Button>
              </div>
            }
            {
              reporting &&
              <div className="message-box-reporting">
                <Button
                  id="btn-close"
                  type="button"
                  className="btn btn-msg-box d-sm-block msg-box-btn-align-center mg-close-align review-page-yes btn-close"
                  onClick={this.toggle}>Close</Button>
              </div>
            }
            {
              orderingCutoffTime &&
              <div className="message-box-reporting">
                <Button
                  id="btn-close"
                  type="button"
                  className="btn btn-msg-box d-sm-block msg-box-btn-align-center mg-close-align review-page-yes btn-close"
                  onClick={this.toggle}>Close</Button>
              </div>
            }
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return ({
    loginData: state.login.loginData.payload,
    modifiedItems: state && state.ordering && state.ordering.modifiedItems,
  });
}

export default connect(mapStateToProps)(withRouter(MessageBox));