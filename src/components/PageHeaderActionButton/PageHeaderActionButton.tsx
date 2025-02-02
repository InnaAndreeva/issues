import { FC, useCallback } from 'react';
import { ArrowUpSmallIcon, Button, Dropdown, ArrowDownSmallIcon, MenuItem } from '@taskany/bricks';

import { ModalEvent, dispatchModalEvent } from '../../utils/dispatchModal';

import { tr } from './PageHeaderActionButton.i18n';

export const PageHeaderActionButton: FC = () => {
    const onMenuItemClick = useCallback(({ event }: { event: ModalEvent }) => {
        dispatchModalEvent(event)();
    }, []);

    return (
        <>
            <Button
                text={tr('Create')}
                view="primary"
                outline
                brick="right"
                onClick={dispatchModalEvent(ModalEvent.GoalCreateModal)}
            />
            <Dropdown
                onChange={onMenuItemClick}
                items={[
                    {
                        title: tr('Create goal'),
                        event: ModalEvent.GoalCreateModal,
                    },
                    {
                        title: tr('Create project'),
                        event: ModalEvent.ProjectCreateModal,
                    },
                ]}
                renderTrigger={(props) => (
                    <Button
                        view="primary"
                        outline
                        brick="left"
                        iconRight={
                            props.visible ? (
                                <ArrowUpSmallIcon size="s" noWrap />
                            ) : (
                                <ArrowDownSmallIcon size="s" noWrap />
                            )
                        }
                        ref={props.ref}
                        onClick={props.onClick}
                    />
                )}
                renderItem={(props) => (
                    <MenuItem
                        key={props.item.title}
                        focused={props.cursor === props.index}
                        onClick={props.onClick}
                        view="primary"
                        ghost
                    >
                        {props.item.title}
                    </MenuItem>
                )}
            />
        </>
    );
};
