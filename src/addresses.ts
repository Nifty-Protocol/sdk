import addressesOld from "./addressesOld";

export interface addressesParameter {
  NativeERC20?: string,
  ERC20Proxy?: string,
  ERC721Proxy?: string,
  ERC1155Proxy?: string,
  Forwarder?: string | boolean,
  Exchange?: string,
  Collections?: string,
  RoyaltiesManager?: string,
  NFTrade721?: string,
  GreenPay?: string,
  LibAssetData?: string,
  old: any
}

const addresses: { [chainId: number]: addressesParameter } = {
  1: {
    NativeERC20: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    ERC20Proxy: '0x474363A12b5966F7D8221c0a4B0fD31337F7BD83',
    ERC721Proxy: '0x72F864fce4594E98e3378F06FA69D7824a223E44',
    ERC1155Proxy: '0xa2f950ccb80909FF80eB6dCd7cD915D85A1f6c25',
    Exchange: '0xBF6bfE5D6B86308cF3B7F147Dd03ef11f80bfDE3',
    NFTrade721: '0xcEcC2d4E3E6590b9cb9f662f62171f441cbCa40C',
    Collections: '0x091746ba9fed9936ac0b080e7a735b41239b240b',
    RoyaltiesManager: '0x7E65237E76E0c290b544Be42C0fb88d4950bB666',
    LibAssetData: '0x4FB6f91904D2318274CDB5812480835f6859dFEa',
    old: addressesOld[1]
  },
  56: {
    NativeERC20: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    ERC20Proxy: '0x474363A12b5966F7D8221c0a4B0fD31337F7BD83',
    ERC721Proxy: '0x72F864fce4594E98e3378F06FA69D7824a223E44',
    ERC1155Proxy: '0xa2f950ccb80909FF80eB6dCd7cD915D85A1f6c25',
    Exchange: '0xBF6bfE5D6B86308cF3B7F147Dd03ef11f80bfDE3',
    NFTrade721: '0xcEcC2d4E3E6590b9cb9f662f62171f441cbCa40C',
    Collections: '0x0f354194014300FdBbcFDdEBF4B7ca1819454D13',
    RoyaltiesManager: '0xCbB74218c5C12e482735001739Db4FAe44F9af49',
    GreenPay: '0x0B5A3d2c6999a7193B42deEc32AB4AFBb9A9e70B',
    LibAssetData: '0x4FB6f91904D2318274CDB5812480835f6859dFEa',
    old: addressesOld[56]
  },
  43114: {
    NativeERC20: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
    ERC20Proxy: '0x474363A12b5966F7D8221c0a4B0fD31337F7BD83',
    ERC721Proxy: '0x72F864fce4594E98e3378F06FA69D7824a223E44',
    ERC1155Proxy: '0xa2f950ccb80909FF80eB6dCd7cD915D85A1f6c25',
    Exchange: '0xBF6bfE5D6B86308cF3B7F147Dd03ef11f80bfDE3',
    NFTrade721: '0x71c82Fdbbdb6fb641f680087DA5aBEFFDDfE66a3',
    Collections: '0x5F67aBe0A2A673536E5A57af8e00b28f289f419E',
    RoyaltiesManager: '0x0190052a36373eCdCd7BB4BDD003D751F60D00BE',
    LibAssetData: '0x4FB6f91904D2318274CDB5812480835f6859dFEa',
    old: addressesOld[43114]
  },
  137: {
    NativeERC20: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    ERC20Proxy: '0x474363A12b5966F7D8221c0a4B0fD31337F7BD83',
    ERC721Proxy: '0x72F864fce4594E98e3378F06FA69D7824a223E44',
    ERC1155Proxy: '0xa2f950ccb80909FF80eB6dCd7cD915D85A1f6c25',
    Exchange: '0xBF6bfE5D6B86308cF3B7F147Dd03ef11f80bfDE3',
    NFTrade721: '0x6418d019aec4409E4830bc5C063B180d976a609F',
    Collections: '0x535D6657A9226c84ed341E38a20E0b756418C474',
    RoyaltiesManager: '0x96A5429655eddBB2b581cc4F582776813c6895B4',
    LibAssetData: '0x4FB6f91904D2318274CDB5812480835f6859dFEa',
    old: addressesOld[137]
  },
  1284: {
    NativeERC20: '0xAcc15dC74880C9944775448304B263D191c6077F',
    ERC20Proxy: '0x474363A12b5966F7D8221c0a4B0fD31337F7BD83',
    ERC721Proxy: '0x72F864fce4594E98e3378F06FA69D7824a223E44',
    ERC1155Proxy: '0xa2f950ccb80909FF80eB6dCd7cD915D85A1f6c25',
    Exchange: '0x747308dD127Ee58cb0a07c966650295eE8fb4a13',
    Collections: '0x432532427A6131F8189443A9F175FD23f35a5899',
    RoyaltiesManager: '0x10555128238Aaa4762F85B791645843fBFdBbF97',
    LibAssetData: '0x4FB6f91904D2318274CDB5812480835f6859dFEa',
    old: addressesOld[1284]
  },
  1564830818: {
    RoyaltiesManager: '0x474363A12b5966F7D8221c0a4B0fD31337F7BD83',
    NativeERC20: '',
    ERC20Proxy: '0xa2f950ccb80909FF80eB6dCd7cD915D85A1f6c25',
    ERC721Proxy: '0xf23a1357694A4823FC4C51654692d5f635bb9233',
    ERC1155Proxy: '0x4B75bA193755A52F5b6398466CB3e9458610CBaf',
    Exchange: '0xaff8a3e3B69E4e88e83B589ED080560C4359BBa8',
    Collections: '0x4FB6f91904D2318274CDB5812480835f6859dFEa',
    LibAssetData: '0x72F864fce4594E98e3378F06FA69D7824a223E44',
    old: addressesOld[1564830818]
  }

  // testnets
  4: {
    NativeERC20: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
    ERC20Proxy: '0x474363A12b5966F7D8221c0a4B0fD31337F7BD83',
    ERC721Proxy: '0x72F864fce4594E98e3378F06FA69D7824a223E44',
    ERC1155Proxy: '0xa2f950ccb80909FF80eB6dCd7cD915D85A1f6c25',
    Exchange: '0xBF6bfE5D6B86308cF3B7F147Dd03ef11f80bfDE3',
    Collections: '0x8cc87c4c5EA3f95764AF650448656B720f001Aa4',
    RoyaltiesManager: '0x508c3aCfE17b97BB3059858794b6a18C66D6A8a8',
    LibAssetData: '0x4FB6f91904D2318274CDB5812480835f6859dFEa',
    old: addressesOld[4]
  },
  5: {
    RoyaltiesManager: '0xAA3d3290fA216369Cd89431109257bb9Ddf40dAe',
    NativeERC20: '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6',
    ERC20Proxy: '0x474363A12b5966F7D8221c0a4B0fD31337F7BD83',
    ERC721Proxy: '0x72F864fce4594E98e3378F06FA69D7824a223E44',
    ERC1155Proxy: '0xa2f950ccb80909FF80eB6dCd7cD915D85A1f6c25',
    Exchange: '0x893EF461B2e50c04F4b5AEbe20a33CCC7D2440Ad',
    Collections: '0x6418d019aec4409E4830bc5C063B180d976a609F',
    LibAssetData: '0x4FB6f91904D2318274CDB5812480835f6859dFEa',
    old: addressesOld[5]
  },
  344106930: {
    RoyaltiesManager: '0x8Dee419134Fd5ea392849860785B4dC770b46925',
    NativeERC20: '0x08f98Af60eb83C18184231591A8F89577E46A4B9',
    ERC20Proxy: '0xa2f950ccb80909FF80eB6dCd7cD915D85A1f6c25',
    ERC721Proxy: '0xf23a1357694A4823FC4C51654692d5f635bb9233',
    ERC1155Proxy: '0x4B75bA193755A52F5b6398466CB3e9458610CBaf',
    Exchange: '0xaff8a3e3B69E4e88e83B589ED080560C4359BBa8',
    Collections: '0x3FB1d0a5be1f60C44775b6fEF5C8a5Dc41253a2b',
    LibAssetData: '0x72F864fce4594E98e3378F06FA69D7824a223E44',
    old: addressesOld[344106930]
  }
};

export default addresses;
