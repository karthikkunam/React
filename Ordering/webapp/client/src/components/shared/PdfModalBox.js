import React from 'react';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';
import './PdfModalBox.css';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import print from "print-js";
class PdfModalBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: props.initialModalState,
      msgTitle: props.msgTitle || '',
      msgBody: props.msgBody || '',
      showModal: props.showModal,
      base64pdf: '',
      showDownload: false
    }
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    this.setState({
      base64pdf: this.props.base64pdf,
      showDownload: this.getChromeVersion()
    })
    this.toggle();
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      base64pdf: newProps.base64pdf,
      showModal: newProps.showModal,
      showDownload: this.getChromeVersion()
    })
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }), () => {
      if (this.props.modalAction) {
        this.props.modalAction(this.state.modal);
      }
    });
  }

  getChromeVersion() {
    const raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
    return (raw && parseInt(raw[2], 10) <= 40) ? true : false;
  }

  download() {
    document.getElementById("pdfDownload").click();
  }

  printPdf(base64pdf) {
    let printValue = base64pdf.split(',')[1];
    print({
      printable: printValue,
      type: 'pdf',
      style: '.result {visibility: visible;font-size: 30px;color: green;}',
      base64: true
    });
  }
  
  render() {
    const { base64pdf } = this.state;  
    return (
      <div className="message-box">
        <Modal
          show={this.state.showModal}
          isOpen={this.state.modal}
          toggle={this.toggle}
          centered={true}
          className="modal-box-pdf"
          backdrop="static" 
          >
          {/* <ModalHeader toggle={this.toggle}>{msgTitle}</ModalHeader> */}
          <ModalBody>
            {/* {msgBody} */}
            <object width="100%" height="100%" type="application/pdf" data={base64pdf}>
            {/* <embed type="application/pdf" src={base64pdf} id="embed_pdf"></embed>  */}
            </object>
          </ModalBody>
          <ModalFooter>
            {
              <Button
                id="close"
                type="button"
                className="btn btn-msg-box d-sm-block msg-box-btn-align-center mg-close-align"
                onClick={this.toggle}><i className="fa fa-times-circle" aria-hidden="true"></i></Button>
            }
            {/* { showDownload &&
              <Button
                id="download"
                type="button"
                className="btn btn-msg-box d-sm-block msg-box-btn-align-center mg-close-align"
                onClick = {this.download}><i className="fa fa-download" aria-hidden="true"></i>
                <a id="pdfDownload" download="download.pdf" href = {base64pdf} hidden ></a>
              </Button>
            }
            { showDownload &&
              <Button
                id="print"
                type="button"
                className="btn btn-msg-box d-sm-block msg-box-btn-align-center mg-close-align"
                onClick={()=>{this.printPdf(base64pdf)}}><i className="fa fa-print" aria-hidden="true"></i>    
              </Button>
            } */}
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return ({
  });
}

export default connect(mapStateToProps)(withRouter(PdfModalBox));