import { Box, Text, useModal, UserMenu, UserMenuDivider, UserMenuItem } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React, { useNetworkConnectorUpdater } from 'hooks/useActiveWeb3React'
import Image from 'next/image'
import { useEffect, useMemo } from 'react'
import { chains } from 'utils/wagmi'
import { WrongNetworkModal } from './WrongNetworkModal'

export const NetworkSelect = ({ switchNetwork }) => {
  const { t } = useTranslation()

  return (
    <>
      <Box px="16px" py="8px">
        <Text>{t('Select a Network')}</Text>
      </Box>
      <UserMenuDivider />
      {chains.map((chain) => (
        <UserMenuItem key={chain.id} style={{ justifyContent: 'flex-start' }} onClick={() => switchNetwork(chain.id)}>
          <Image width={24} height={24} src={`/images/chains/${chain.id}.png`} unoptimized />
          <Text pl="12px">{chain.name}</Text>
        </UserMenuItem>
      ))}
    </>
  )
}

export const NetworkSwitcher = () => {
  const { t } = useTranslation()
  const { chainId, chain } = useActiveWeb3React()
  const { isLoading, switchNetwork, pendingChainId } = useNetworkConnectorUpdater()
  const foundChain = useMemo(
    () => chains.find((c) => c.id === (isLoading ? pendingChainId || chainId : chainId)),
    [isLoading, pendingChainId, chainId],
  )

  const isWrongNetwork = chain?.unsupported

  const [openWrongNetworkModal, dismiss] = useModal(<WrongNetworkModal />, false, false, 'wrong-network')

  useEffect(() => {
    if (isWrongNetwork) {
      openWrongNetworkModal()
    } else {
      dismiss()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWrongNetwork])

  return (
    <UserMenu
      mr="8px"
      variant={isLoading ? 'pending' : isWrongNetwork ? 'danger' : 'default'}
      avatarSrc={`/images/chains/${chainId}.png`}
      text={
        isLoading ? (
          t('Requesting')
        ) : isWrongNetwork ? (
          t('Network')
        ) : foundChain ? (
          <>
            <Box display={['none', null, null, null, null, 'block']}>{foundChain.name}</Box>
            <Box display={['block', null, null, null, null, 'none']}>{foundChain.nativeCurrency?.symbol}</Box>
          </>
        ) : (
          t('Select a Network')
        )
      }
    >
      {() => <NetworkSelect switchNetwork={switchNetwork} />}
    </UserMenu>
  )
}
