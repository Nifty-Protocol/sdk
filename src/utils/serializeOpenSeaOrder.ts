function hasNullValue(obj, ignore) {
  for (const [key, value] of Object.entries(obj)) {
    if (value === null) {
      if (ignore && ignore.includes(key)) {
        continue;
      }
      console.error(`${key} is null`);
      return true;
    }
  }
  return false;
}

export const serializeOpenSeaOrder = ({ raw }) => {
  if (hasNullValue(raw, ['taker'])) {
    throw new Error('Order is not valid');
  }

  return {
    cancelled: raw.cancelled,
    clientSignature: raw.client_signature,
    closingDate: raw.closing_date,
    createdDate: raw.created_date,
    currentPrice: raw.current_price,
    expirationTime: raw.expiration_time,
    finalized: raw.finalized,
    listingTime: raw.listing_time,
    maker: raw.maker,
    makerAssetBundle: raw.maker_asset_bundle,
    makerFees: raw.maker_fees,
    markedInvalid: raw.maker_fees,
    orderHash: raw.order_hash,
    orderType: raw.order_type,
    protocolAddress: raw.protocol_address,
    protocolData: raw.protocol_data,
    side: raw.side,
    taker: raw.taker,
    takerAssetBundle: raw.taker_asset_bundle,
    takerFees: raw.taker_fees,
  }
}

