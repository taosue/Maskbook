import { IconButton, makeStyles, MenuItem } from '@material-ui/core'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import { isETH } from '../../../web3/helpers'
import { useStylesExtends } from '../../../components/custom-ui-helper'
import { useModal } from '../DashboardDialogs/Base'
import { DashboardWalletHideTokenConfirmDialog } from '../DashboardDialogs/Wallet'
import { useMenu } from '../../../utils/hooks/useMenu'
import type { WalletRecord } from '../../../plugins/Wallet/database/types'
import { useI18N } from '../../../utils/i18n-next-ui'
import type { ERC20TokenDetailed, EtherTokenDetailed } from '../../../web3/types'
import { useRemoteControlledDialog } from '../../../utils/hooks/useRemoteControlledDialog'
import { PluginTransakMessages } from '../../../plugins/Transak/messages'
import { useAccount } from '../../../web3/hooks/useAccount'
import { DashboardWalletTransferDialog } from './TransferDialog'
import { useChainIdValid } from '../../../web3/hooks/useChainState'

const useStyles = makeStyles((theme) => ({
    more: {
        color: theme.palette.text.primary,
    },
}))

export interface ERC20TokenActionsBarProps extends withClasses<KeysInferFromUseStyles<typeof useStyles>> {
    wallet: WalletRecord
    token: ERC20TokenDetailed | EtherTokenDetailed
}

export function ERC20TokenActionsBar(props: ERC20TokenActionsBarProps) {
    const { wallet, token } = props

    const { t } = useI18N()
    const account = useAccount()
    const classes = useStylesExtends(useStyles(), props)

    const chainIdValid = useChainIdValid()

    //#region remote controlled buy dialog
    const [, setBuyDialogOpen] = useRemoteControlledDialog(PluginTransakMessages.events.buyTokenDialogUpdated)
    //#endregion

    const [transeferDialog, , openTransferDialogOpen] = useModal(DashboardWalletTransferDialog)
    const [hideTokenConfirmDialog, , openHideTokenConfirmDialog] = useModal(DashboardWalletHideTokenConfirmDialog)
    const [menu, openMenu] = useMenu(
        <MenuItem
            onClick={() => {
                setBuyDialogOpen({
                    open: true,
                    code: token.symbol ?? token.name,
                    address: account,
                })
            }}>
            {t('buy')}
        </MenuItem>,
        <MenuItem disabled={!chainIdValid} onClick={() => openTransferDialogOpen({ wallet, token })}>
            {t('transfer')}
        </MenuItem>,
        <MenuItem
            style={{ display: isETH(token.address) ? 'none' : 'initial' }}
            onClick={() => openHideTokenConfirmDialog({ wallet, token })}>
            {t('hide')}
        </MenuItem>,
    )

    return (
        <>
            <IconButton className={classes.more} size="small" onClick={openMenu}>
                <MoreHorizIcon />
            </IconButton>
            {menu}
            {hideTokenConfirmDialog}
            {transeferDialog}
        </>
    )
}
