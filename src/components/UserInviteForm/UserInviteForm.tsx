import React, { useCallback, useState, useRef } from 'react';
import z from 'zod';
import { FieldError } from 'react-hook-form';
import styled from 'styled-components';
import { gapM, gapS, gray6, gray7, gray10 } from '@taskany/colors';
import {
    Button,
    Text,
    Link,
    Form,
    FormInput,
    FormAction,
    FormActions,
    FormTitle,
    BulbOnIcon,
    QuestionIcon,
    ModalHeader,
    ModalContent,
    Tag,
    KeyCode,
} from '@taskany/bricks';

import { trpc } from '../../utils/trpcClient';
import { routes } from '../../hooks/router';
import { usePageContext } from '../../hooks/usePageContext';
import { Tip } from '../Tip';
import { Keyboard } from '../Keyboard';
import { notifyPromise } from '../../utils/notifyPromise';

import { tr } from './UserInviteForm.i18n';

const StyledEmails = styled.div`
    padding: ${gapM} 0;
`;

const StyledFormBottom = styled.div`
    display: flex;
    align-items: flex-end;
    justify-content: space-between;

    padding: ${gapS} ${gapS} 0 ${gapS};
`;

const schemaProvider = () =>
    z.string().email({
        message: tr('User email is required'),
    });

const UserInviteForm: React.FC = () => {
    const { locale } = usePageContext();
    const inputRef = useRef<HTMLInputElement>(null);
    const [emails, setEmails] = useState<string[]>([]);
    const [error, setError] = useState<FieldError>();
    const [inputValue, setInputValue] = useState('');
    const schema = schemaProvider();
    const inviteMutation = trpc.user.invite.useMutation();

    const inviteUser = useCallback(async () => {
        if (emails.length === 0) {
            return;
        }

        const promise = inviteMutation.mutateAsync(emails);

        await notifyPromise(promise, 'userInvite');

        setEmails([]);
        setInputValue('');
    }, [emails, inviteMutation]);

    const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        setError(undefined);
    }, []);

    const onEmailRemove = useCallback(
        (email: string) => () => {
            setEmails(emails.filter((em) => em !== email));
        },
        [setEmails, emails],
    );

    const onInputKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if ((e.keyCode === KeyCode.Enter || e.keyCode === KeyCode.Space) && inputRef.current && !e.metaKey) {
                e.preventDefault();
                const possibleEmail = inputValue;

                if (possibleEmail === '') {
                    return;
                }

                try {
                    schema.parse(possibleEmail);
                    setEmails([...emails, possibleEmail]);
                    setInputValue('');
                } catch (err: unknown) {
                    if (err instanceof Error) {
                        // Zod serialize errors to message field ¯\_(ツ)_/¯
                        const errors = JSON.parse(err.message);
                        setError(errors[0]);
                    }
                }
            }
        },
        [schema, setEmails, emails, inputValue],
    );

    const isValid = emails.length > 0;

    return (
        <>
            <ModalHeader>
                <FormTitle>{tr('Invite new users')}</FormTitle>
            </ModalHeader>

            <ModalContent>
                <StyledEmails>
                    {isValid ? (
                        <>
                            {emails.map((email) => (
                                <Tag key={email} title={email} onHide={onEmailRemove(email)} />
                            ))}
                        </>
                    ) : (
                        <Text size="s" color={gray7}>
                            {tr.raw('Start typing users emails', {
                                key1: <Keyboard enter />,
                                key2: <Keyboard space />,
                            })}
                        </Text>
                    )}
                </StyledEmails>

                <Form>
                    <FormInput
                        ref={inputRef}
                        value={inputValue}
                        error={error}
                        placeholder={tr('Users emails')}
                        autoFocus
                        flat="bottom"
                        onChange={onInputChange}
                        onKeyDown={onInputKeyDown}
                    />

                    <FormActions flat="top">
                        <FormAction left />
                        <FormAction right inline>
                            <Button
                                size="m"
                                view="primary"
                                type="submit"
                                disabled={!isValid}
                                text={tr('Send invites')}
                                onClick={inviteUser}
                            />
                        </FormAction>
                    </FormActions>
                </Form>

                <StyledFormBottom>
                    <Tip title={tr('Pro tip!')} icon={<BulbOnIcon size="s" color={gray10} />}>
                        {tr.raw('Press key to send invites', {
                            key: <Keyboard command enter />,
                        })}
                    </Tip>

                    <Link href={routes.help(locale, 'users')}>
                        <QuestionIcon size="s" color={gray6} />
                    </Link>
                </StyledFormBottom>
            </ModalContent>
        </>
    );
};

export default UserInviteForm;
