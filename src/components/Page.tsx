import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { useTheme } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import { Session } from 'next-auth';
import { gapS, gray4, radiusM, textColor } from '@taskany/colors';
import { TextStyle, Footer, nullable } from '@taskany/bricks';

import { pageContext, PageContext } from '../utils/pageContext';
import { ExternalPageProps } from '../utils/declareSsrProps';
import { useHotkeys } from '../hooks/useHotkeys';
import { ModalEvent } from '../utils/dispatchModal';
import { createProjectKeys, inviteUserKeys, createGoalKeys } from '../utils/hotkeys';

import { Theme } from './Theme';
import { GlobalStyle } from './GlobalStyle';
import { PageHeader } from './PageHeader/PageHeader';

const ModalOnEvent = dynamic(() => import('./ModalOnEvent'));
const ProjectCreateForm = dynamic(() => import('./ProjectCreateForm/ProjectCreateForm'));
const GoalCreateForm = dynamic(() => import('./GoalCreateForm/GoalCreateForm'));
const UserInviteForm = dynamic(() => import('./UserInviteForm/UserInviteForm'));
const HotkeysModal = dynamic(() => import('./HotkeysModal/HotkeysModal'));
const NotificationsHub = dynamic(() => import('./NotificationsHub/NotificationsHub'));

interface PageProps {
    user: Session['user'];
    ssrTime: number;
    locale: ExternalPageProps['locale'];
    title?: string;
    children?: React.ReactNode;
}

const StyledContent = styled.div`
    /* presses the footer to the bottom*/
    min-height: calc(100vh - 160px);
`;

export const PageContent = styled.div`
    padding: 10px 40px 0 40px;
`;

export const PageActions = styled.div`
    display: flex;
    align-items: start;
    justify-content: right;

    > * + * {
        margin-left: ${gapS};
    }
`;

const mapThemeOnId = { light: 0, dark: 1 } as const;

export const Page: React.FC<PageProps> = ({ user, ssrTime, title = 'Untitled', locale, children }) => {
    useHotkeys();

    const { resolvedTheme } = useTheme();
    const theme = (
        user?.settings?.theme === 'system' ? resolvedTheme || 'dark' : user?.settings?.theme || 'light'
    ) as PageContext['theme'];

    return (
        <pageContext.Provider value={{ user, theme, themeId: mapThemeOnId[theme], locale, ssrTime }}>
            <Head>
                <title>{title}</title>
            </Head>

            <GlobalStyle />
            <TextStyle />

            {nullable(theme, (t) => (
                <Theme theme={t} />
            ))}

            <Toaster
                toastOptions={{
                    style: { borderRadius: radiusM, background: gray4, color: textColor },
                }}
                position="bottom-right"
            />

            <PageHeader />

            <StyledContent>{children}</StyledContent>

            <ModalOnEvent event={ModalEvent.ProjectCreateModal} hotkeys={createProjectKeys}>
                <ProjectCreateForm />
            </ModalOnEvent>

            <ModalOnEvent event={ModalEvent.GoalCreateModal} hotkeys={createGoalKeys}>
                <GoalCreateForm />
            </ModalOnEvent>

            <ModalOnEvent event={ModalEvent.UserInviteModal} hotkeys={inviteUserKeys}>
                <UserInviteForm />
            </ModalOnEvent>

            <HotkeysModal />

            <NotificationsHub />

            <Footer />
        </pageContext.Provider>
    );
};
