import React from 'react';

export const getPromoCode = (key) => {
  if (!key) return "";
  let codeMap = {}
  codeMap["ON PROMO"] = 'P';
  codeMap["PROMO START"] = 'P+';
  codeMap["PROMO END"] = 'P-';

  return codeMap[(key).toUpperCase()];
}

export const getBillCode = (key) => {
  if (!key) return "";
  let codeMap = {}
  codeMap["BILL BACK"] = '$';
  codeMap["NEW"] = 'N';
  codeMap["Delete"] = 'D';
  codeMap["DELETED"] = "D";

  return codeMap[(key).toUpperCase()];
}

export const getItemStatus = (key, orderingFlow = null) => {
  if (!key) return "";
  let codeMap = {};
  if(orderingFlow){
    codeMap["NEW"] = "New";
    codeMap["DELETE"] = "Delete";
    codeMap["DELETED"] = "Delete";
    return codeMap[(key).toUpperCase()];
  }
    codeMap["NEW"] = "N";
    codeMap["DELETE"] = "D";
    codeMap["DELETED"] = "D";
    return codeMap[(key).toUpperCase()];
}

export const getPromotionDetails = (promo) => {
  const promoStr = promo && promo.toUpperCase();
  if (promoStr === "STARTING PROMO") {
    return (<span className="Promo-Start" > P+ </span>)
  } else if (promoStr === "ON PROMO") {
    return (<span className="Promo-On" > P </span>)
  } else if (promoStr === "ENDING PROMO") {
    return (<span className="Promo-Ends" > P- </span>)
  } else {
    return (<span> </span>)
  }
}

export const getPromotion = (promotion) => {
  const input = promotion && promotion.toUpperCase();
  if (!promotion) {
    return "";
  }
  if (input === 'STARTING PROMO') {
    return "P+";
  }
  if (input === 'ON PROMO') {
    return "P";
  }
  if (input === 'ENDING PROMO') {
    return 'P-'
  }
  return promotion;
}

export const getBillback = (isBillBackAvailable) => {
  return isBillBackAvailable ? '$' : '';
}

export const getBillbackOrderingFlow = (isBillBackAvailable) => {
  return isBillBackAvailable ? 'Yes' : 'No';
}