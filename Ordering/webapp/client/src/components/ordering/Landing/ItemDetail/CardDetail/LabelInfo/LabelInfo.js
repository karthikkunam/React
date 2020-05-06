import React, { Component } from 'react'
import './labelInfo.css'

export default class LabelInfo extends Component {

    createMarkUp=(markUp)=>{
        return {__html: markUp};
        }

  render() {
    const WriteOffTxt = window.innerWidth < 768 ? this.createMarkUp('<span>W/O</span>') : this.createMarkUp('<span>Write Off</span>');
    const OutOffStockTxt = window.innerWidth < 768 ? this.createMarkUp('<span>OOS</span>') : this.createMarkUp('<span>Out of Stock</span>');
    const DeliveredTxt = window.innerWidth < 768 ? this.createMarkUp('<span>Deliv.</span>') : this.createMarkUp('<span>Delivered</span>');
    return (
      <div className="label-wrapper">
        <table>
        <thead>
              <tr>
                <th className="label-info"></th>
              </tr>
          </thead>
         <tbody>
               <tr className="item-row" style={{"float": "left"}}>
                    <td className="rmvPadding">
                        <div className="label-border"><div className="alnleft">Weather</div></div>
                        <div className="label-border"><div className="alnleft">Date</div></div>
                        <div className="label-border"><div className="alnleft">Temp</div></div>
                        <div className="label-border"><div dangerouslySetInnerHTML={DeliveredTxt} className="alnleft"></div></div>
                        <div className="label-border"><div className="alnleft">Sales</div></div>
                        <div className="label-border"><div dangerouslySetInnerHTML={WriteOffTxt} className="alnleft"></div></div>
                        {
                          !this.props.reviewFinalizePage &&
                          <div><div dangerouslySetInnerHTML={OutOffStockTxt} className="alnleft"></div></div>
                        }
                    </td>   
                </tr>
            </tbody>
        </table>
      </div>
    )
  }
}
